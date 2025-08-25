// src/app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const authResult = await authenticateUser(email, password);
    
    if (!authResult.success) {
      return NextResponse.json(
        { 
          error: authResult.error,
          needsVerification: authResult.needsVerification || false 
        },
        { status: 401 }
      );
    }

    // Check if token exists before setting cookie
    if (!authResult.token) {
      return NextResponse.json(
        { error: 'Authentication token not generated' },
        { status: 500 }
      );
    }

    // Create response with token in httpOnly cookie
    const response = NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      user: authResult.user
    });

    // Set httpOnly cookie with JWT token (now TypeScript knows token is not undefined)
    response.cookies.set('auth-token', authResult.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;

  } catch (error) {
    console.error('Signin error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}