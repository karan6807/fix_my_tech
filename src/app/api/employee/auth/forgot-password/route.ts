// src/app/api/employee/auth/forgot-password/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendEmployeePasswordResetEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if employee exists
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('id, email, first_name, is_active')
      .eq('email', email)
      .single();

    // Always return success message for security (don't reveal if email exists)
    const successResponse = {
      message: 'If an employee account with this email exists, a password reset OTP has been sent.'
    };

    if (fetchError || !employee) {
      return NextResponse.json(successResponse);
    }

    // Check if employee account is active
    if (!employee.is_active) {
      return NextResponse.json(successResponse);
    }

    // Generate OTP for password reset
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update employee with reset OTP
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        reset_otp: otp,
        reset_otp_expiry: otpExpiry.toISOString(),
        reset_requested_at: new Date().toISOString()
      })
      .eq('id', employee.id);

    if (updateError) {
      console.error('Failed to update reset OTP:', updateError);
      return NextResponse.json(successResponse);
    }

    // Send OTP email for password reset
    try {
      // The function was being called with 4 arguments, but it likely expects only 3.
      // Removed the 'password_reset' string.
      await sendEmployeePasswordResetEmail(email, otp, employee.first_name);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
      // Don't reveal email sending failure to user
    }

    return NextResponse.json(successResponse);

  } catch (error) {
    console.error('Employee forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
