// src/app/api/employee/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmployeeOTPEmail } from '@/lib/email';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { 
      email, 
      password, 
      firstName, 
      lastName, 
      phone, 
      department, 
      position 
    } = await req.json();

    if (!email || !password || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Email, password, first name, and last name are required' },
        { status: 400 }
      );
    }

    // Check if employee already exists
    const { data: existingEmployee } = await supabase
      .from('employees')
      .select('id')
      .eq('email', email)
      .single();

    if (existingEmployee) {
      return NextResponse.json(
        { error: 'Employee with this email already exists' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Create employee
    const { data: newEmployee, error: createError } = await supabase
      .from('employees')
      .insert({
        email,
        password: hashedPassword,
        first_name: firstName,
        last_name: lastName,
        phone,
        department,
        position,
        otp,
        otp_expiry: otpExpiry.toISOString(),
        is_verified: false,
        is_active: true, // Auto-activate new employees
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (createError) {
      return NextResponse.json(
        { error: 'Failed to create employee account' },
        { status: 500 }
      );
    }

    // Send OTP email
    await sendEmployeeOTPEmail(email, otp, firstName);

    return NextResponse.json({
      message: 'Employee account created successfully. Please verify your email with the OTP sent.',
      employeeId: newEmployee.id,
      requiresOTP: true
    });

  } catch (error) {
    console.error('Employee signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}