import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json(
        { error: 'Email, OTP, and new password are required' },
        { status: 400 }
      );
    }

    // Get employee with reset OTP
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { error: 'Invalid email or OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is valid
    if (!employee.reset_otp || employee.reset_otp !== otp) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (new Date() > new Date(employee.reset_otp_expiry)) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update employee password and clear reset OTP
    const { error: updateError } = await supabase
      .from('employees')
      .update({
        password: hashedPassword,
        reset_otp: null,
        reset_otp_expiry: null,
        reset_requested_at: null
      })
      .eq('id', employee.id);

    if (updateError) {
      return NextResponse.json(
        { error: 'Failed to reset password' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
    });

  } catch (error) {
    console.error('Employee reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}