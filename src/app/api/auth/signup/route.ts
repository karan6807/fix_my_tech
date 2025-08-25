// src/app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createUser, createOTP } from '@/lib/auth';
import { sendVerificationEmail } from '@/lib/email';

// Define the interface for the request body
interface SignupRequestBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// Define the interface for the success response
interface SignupResponse {
  success: true;
  message: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

// Define the interface for error response
interface ErrorResponse {
  error: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<SignupResponse | ErrorResponse>> {
  try {
    const body: SignupRequestBody = await request.json();
    const { name, email, password, confirmPassword } = body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
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

    // Create user
    const userResult = await createUser(name, email, password);
    if (!userResult.success) {
      return NextResponse.json(
        { error: userResult.error },
        { status: 400 }
      );
    }

    // Generate and send OTP
    const otpResult = await createOTP(email, userResult.user.id, 'email_verification');
    if (!otpResult.success) {
      return NextResponse.json(
        { error: 'Failed to generate verification code' },
        { status: 500 }
      );
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(email, name, otpResult.otp);
    if (!emailResult.success) {
      return NextResponse.json(
        { error: 'Failed to send verification email' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Account created successfully. Please check your email for verification code.',
      user: {
        id: userResult.user.id,
        name: userResult.user.name,
        email: userResult.user.email
      }
    });

  } catch (error) {
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}