// src/app/api/employee/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTPEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { employeeId, type = 'verification' } = await req.json(); // type: 'verification' or 'reset'

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      );
    }

    // Get employee
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('id', employeeId)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check rate limiting (prevent spam)
    const lastOTPTime = type === 'reset' ? employee.reset_requested_at : employee.last_login_attempt;
    if (lastOTPTime) {
      const timeSinceLastOTP = Date.now() - new Date(lastOTPTime).getTime();
      const minInterval = 60 * 1000; // 1 minute

      if (timeSinceLastOTP < minInterval) {
        return NextResponse.json(
          { error: 'Please wait before requesting another OTP' },
          { status: 429 }
        );
      }
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Update employee with new OTP based on type
    const updateData = {
      ...(type === 'reset' 
        ? {
            reset_otp: otp,
            reset_otp_expiry: otpExpiry.toISOString(),
            reset_requested_at: new Date().toISOString()
          }
        : {
            otp,
            otp_expiry: otpExpiry.toISOString(),
            last_login_attempt: new Date().toISOString()
          }
      )
    };

    const { error: updateError } = await supabase
      .from('employees')
      .update(updateData)
      .eq('id', employeeId);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to generate new OTP' },
        { status: 500 }
      );
    }

    // Send new OTP email
    // The function was being called with 4 arguments, but it likely expects only 3.
    // Removed the 'emailType' string.
    await sendOTPEmail(employee.email, otp, employee.first_name);

    return NextResponse.json({
      message: 'New OTP sent successfully',
      employeeId: employee.id
    });

  } catch (error) {
    console.error('Employee resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
