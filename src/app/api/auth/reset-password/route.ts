// src/app/api/auth/reset-password/route.js
import { NextRequest, NextResponse } from 'next/server';
import { updateUserPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { userId, password, confirmPassword } = await request.json();

    // Validation
    if (!userId || !password || !confirmPassword) {
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

    // Update password
    const updateResult = await updateUserPassword(userId, password);
    if (!updateResult.success) {
      return NextResponse.json(
        { error: updateResult.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}