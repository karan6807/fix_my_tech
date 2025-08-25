// src/app/api/auth/resend-otp/route.js
import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, createOTP } from '@/lib/auth';
import { sendVerificationEmail, sendPasswordResetEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { email, purpose } = await request.json();

    // Validation
    if (!email || !purpose) {
      return NextResponse.json(
        { error: 'Email and purpose are required' },
        { status: 400 }
      );
    }

    if (!['email_verification', 'password_reset'].includes(purpose)) {
      return NextResponse.json(
        { error: 'Invalid purpose' },
        { status: 400 }
      );
    }

    // Get user by email
    const userResult = await getUserByEmail(email);
    if (!userResult.success) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Generate new OTP
    const otpResult = await createOTP(email, userResult.user.id, purpose);
    if (!otpResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate OTP' },
        { status: 500 }
      );
    }

    // Send appropriate email
    let emailResult;
    if (purpose === 'email_verification') {
      emailResult = await sendVerificationEmail(email, userResult.user.name, otpResult.otp);
    } else {
      emailResult = await sendPasswordResetEmail(email, userResult.user.name, otpResult.otp);
    }

    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'OTP sent successfully'
    });

  } catch (error) {
    console.error('Resend OTP error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}