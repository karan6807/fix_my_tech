import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Check if admin exists
    const { data: admin, error: adminError } = await supabaseAdmin
      .from('admins')
      .select('id, email')
      .eq('email', email)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save OTP to database
    const { error: otpError } = await supabaseAdmin
      .from('admin_otps')
      .upsert({
        admin_id: admin.id,
        email: email,
        otp: otp,
        purpose: 'password_reset',
        expires_at: expiresAt.toISOString(),
        used: false
      });

    if (otpError) {
      console.error('Error saving OTP:', otpError);
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send OTP email
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: email,
          subject: 'Admin Password Reset OTP',
          type: 'admin_password_reset_otp',
          data: {
            otp: otp,
            email: email
          }
        })
      });
    } catch (emailError) {
      console.error('Failed to send OTP email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent to your email'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}