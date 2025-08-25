// src/app/api/auth/verify-otp/route.js
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, markEmailAsVerified, generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, otp, purpose } = await request.json();

    // Validation
    if (!email || !otp || !purpose) {
      return NextResponse.json(
        { error: 'Email, OTP, and purpose are required' },
        { status: 400 }
      );
    }

    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        { error: 'OTP must be 6 digits' },
        { status: 400 }
      );
    }

    // Verify OTP
    const verifyResult = await verifyOTP(email, otp, purpose);
    if (!verifyResult.success) {
      return NextResponse.json(
        { error: verifyResult.error },
        { status: 400 }
      );
    }

    // If this is email verification, mark email as verified
    if (purpose === 'email_verification') {
      const markVerifiedResult = await markEmailAsVerified(verifyResult.userId);
      if (!markVerifiedResult.success) {
        return NextResponse.json(
          { error: 'Failed to verify email' },
          { status: 500 }
        );
      }

      // Generate token for auto-login after verification
      const token = generateToken(verifyResult.userId, email);

      const response = NextResponse.json({
        success: true,
        message: 'Email verified successfully'
      });

      // Set auth cookie
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      });

      return response;
    }

    // For password reset verification
    return NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      userId: verifyResult.userId
    });

  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}