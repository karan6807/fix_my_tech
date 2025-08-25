// src/app/api/employee/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmployeeOTPEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if employee is active
    if (!employee.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated. Please contact administrator.' },
        { status: 403 }
      );
    }

    // If employee is already verified, log them in directly
    if (employee.is_verified) {
      // Generate JWT token
      const { generateToken } = await import('@/lib/auth');
      const token = generateToken(employee.id, employee.email);

      // Update last login
      await supabase
        .from('employees')
        .update({ last_login: new Date().toISOString() })
        .eq('id', employee.id);

      // Create response with token in cookie
      const response = NextResponse.json({
        success: true,
        message: 'Signed in successfully',
        employee: {
          id: employee.id,
          email: employee.email,
          firstName: employee.first_name,
          lastName: employee.last_name,
          department: employee.department,
          position: employee.position,
          isActive: employee.is_active,
          isVerified: employee.is_verified
        }
      });

      // Set HTTP-only cookie
      response.cookies.set('employee_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    // For unverified employees, send OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update employee with OTP
    const { error: updateError } = await supabase
      .from('employees')
      .update({ 
        otp, 
        otp_expiry: otpExpiry.toISOString(),
        last_login_attempt: new Date().toISOString()
      })
      .eq('id', employee.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send OTP email
    await sendEmployeeOTPEmail(email, otp, employee.first_name);

    return NextResponse.json({
      message: 'OTP sent successfully',
      employeeId: employee.id,
      requiresOTP: true
    });

  } catch (error) {
    console.error('Employee signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}