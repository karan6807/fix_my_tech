// src/app/api/admin/auth/logout/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = 
      request.cookies.get('admin-auth-token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (token) {
      try {
        // Verify and decode token to get admin ID
        const decodedToken: any = jwt.verify(token, JWT_SECRET);
        
        if (decodedToken.type === 'admin' && decodedToken.adminId) {
          // Clean up any remaining OTPs for this admin (optional)
          await supabase
            .from('admin_otps')
            .delete()
            .eq('admin_id', decodedToken.adminId);
        }
      } catch (jwtError) {
        // Token is invalid, but we'll still clear the cookie
        console.log('Invalid token during logout, clearing cookie anyway');
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    // Clear the authentication cookie
    response.cookies.delete('admin-auth-token');
    
    // Alternative way to clear cookie (more explicit) - FIXED PATH
    response.cookies.set('admin-auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/', // FIXED: Changed from '/admin' to '/' to match verify-otp route
    });

    return response;

  } catch (error) {
    console.error('Admin logout error:', error);
    
    // Even if there's an error, we should still try to clear the cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully',
    });

    response.cookies.delete('admin-auth-token');
    
    // Also clear with explicit settings
    response.cookies.set('admin-auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/', // FIXED: Changed from '/admin' to '/'
    });
    
    return response;
  }
}