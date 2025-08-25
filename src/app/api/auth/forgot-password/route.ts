// src/app/api/auth/forgot-password/route.js
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    console.log('=== FORGOT PASSWORD API DEBUG ===');
    console.log('Email received:', email);

    // Validation
    if (!email) {
      console.log('ERROR: No email provided');
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if admin exists in admin_users table
    console.log('Looking for admin with email:', email.toLowerCase());
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .eq('is_active', true)
      .single();

    console.log('Admin query result:', { admin: admin ? 'found' : 'not found', error: adminError });

    if (adminError || !admin) {
      console.log('Admin not found, returning success message for security');
      // For security, we don't reveal if email exists or not
      return NextResponse.json({
        success: true,
        message: 'If the email exists in our system, you will receive a password reset code.'
      });
    }

    console.log('Admin found:', admin.name, admin.email);

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    // Delete any existing OTPs for this admin
    await supabase
      .from('admin_otps')
      .delete()
      .eq('admin_id', admin.id);

    // Insert new OTP
    const { error: otpError } = await supabase
      .from('admin_otps')
      .insert({
        admin_id: admin.id,
        email: admin.email,
        otp: otp,
        expires_at: expiresAt.toISOString(),
      });

    if (otpError) {
      console.error('OTP creation error:', otpError);
      return NextResponse.json(
        { error: 'Failed to generate reset code' },
        { status: 500 }
      );
    }

    // Send password reset email
    console.log('Attempting to send password reset email to:', admin.email);
    try {
      await sendPasswordResetEmail(admin.email, admin.name, otp);
      console.log('Password reset email sent successfully!');
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }

    console.log('=== FORGOT PASSWORD API SUCCESS ===');
    return NextResponse.json({
      success: true,
      message: 'Password reset code sent to your email.'
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}