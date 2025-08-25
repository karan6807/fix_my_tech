// src/app/api/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

// Define the JWT payload interface
interface JwtPayload {
  userId: string;
  email: string;
  iat?: number;
  exp?: number;
}

export async function GET(request: NextRequest) {
  try {
    // Get token from httpOnly cookie first, then fallback to Authorization header
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
      }
      token = authHeader.substring(7); // Remove "Bearer " prefix
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Type assertion to ensure we have the correct payload structure
    const payload = decoded as JwtPayload;
    
    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
    }

    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('id, name, email, email_verified')
      .eq('id', payload.userId)
      .single();

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        email_verified: user.email_verified
      }
    });

  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
  }
}