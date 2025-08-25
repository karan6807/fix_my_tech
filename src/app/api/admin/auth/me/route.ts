// src/app/api/admin/auth/me/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    const token = 
      request.cookies.get('admin-auth-token')?.value ||
      request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return NextResponse.json(
        { error: 'No authentication token provided' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decodedToken: { type: string; adminId: string };
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as { type: string; adminId: string };
    } catch (jwtError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    // Check if it's an admin token
    if (decodedToken.type !== 'admin') {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: 401 }
      );
    }

    // Get admin details from database
    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('id, name, email, is_active, created_at, updated_at')
      .eq('id', decodedToken.adminId)
      .eq('is_active', true)
      .single();

    if (adminError || !admin) {
      return NextResponse.json(
        { error: 'Admin not found or deactivated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        isActive: admin.is_active,
        createdAt: admin.created_at,
        updatedAt: admin.updated_at,
      },
    });

  } catch (error) {
    console.error('Admin me API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}