// src/app/api/employee/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { generateToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { employeeId, otp } = await req.json();

    if (!employeeId || !otp) {
      return NextResponse.json(
        { error: 'Employee ID and OTP are required' },
        { status: 400 }
      );
    }

    // Get employee with OTP
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { error: 'Invalid employee ID' },
        { status: 404 }
      );
    }

    // Check if OTP is valid
    if (!employee.otp || employee.otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (new Date() > new Date(employee.otp_expiry)) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Update employee - mark as verified and clear OTP
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        is_verified: true,
        otp: null,
        otp_expiry: null,
        last_login: new Date().toISOString()
      })
      .eq('id', employeeId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = generateToken(employee.id, employee.email);

    // Create response with token in cookie
    const response = NextResponse.json({
      message: 'OTP verified successfully',
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.first_name,
        lastName: employee.last_name,
        department: employee.department,
        position: employee.position,
        isActive: employee.is_active
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

  } catch (error) {
    console.error('Employee verify OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}