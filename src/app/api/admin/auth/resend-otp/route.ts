// src/app/api/admin/auth/resend-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOTPEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { adminId } = await request.json();

    // Validation
    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required' },
        { status: 400 }
      );
    }

    // Get admin details
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', adminId)
      .eq('is_active', true)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Admin not found' },
        { status: 404 }
      );
    }

    // Check for rate limiting (optional)
    const oneMinuteAgo = new Date();
    oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

    const { data: recentOTPs } = await supabase
      .from('admin_otps')
      .select('*')
      .eq('admin_id', adminId)
      .gte('created_at', oneMinuteAgo.toISOString());

    if (recentOTPs && recentOTPs.length >= 3) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait before requesting again.' },
        { status: 429 }
      );
    }

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // OTP expires in 10 minutes

    // Delete existing unverified OTPs for this admin
    await supabase
      .from('admin_otps')
      .delete()
      .eq('admin_id', adminId)
      .eq('is_verified', false);

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
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send OTP email
    try {
      await sendOTPEmail(admin.email, otp, admin.name);
    } catch (emailError) {
      console.error('Email sending error:', emailError);
      return NextResponse.json(
        { error: 'Failed to send OTP email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'New OTP sent successfully',
    });

  } catch (error) {
    console.error('Admin resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}