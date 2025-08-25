// src/app/api/admin/auth/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';

export async function POST(request: NextRequest) {
  try {
    const { otp, adminId, email, purpose } = await request.json();

    // Validation
    if (!otp) {
      return NextResponse.json(
        { error: 'OTP is required' },
        { status: 400 }
      );
    }

    // Handle password reset OTP verification
    if (purpose === 'password_reset' && email) {
      const { data: otpRecord, error: otpError } = await supabaseAdmin
        .from('admin_otps')
        .select('*')
        .eq('email', email)
        .eq('otp', otp)
        .eq('purpose', 'password_reset')
        .eq('used', false)
        .single();

      if (otpError || !otpRecord) {
        return NextResponse.json(
          { error: 'Invalid or expired OTP' },
          { status: 400 }
        );
      }

      // Check if OTP is expired using database time
      const { data: timeCheck } = await supabaseAdmin
        .from('admin_otps')
        .select('expires_at')
        .eq('id', otpRecord.id)
        .gt('expires_at', new Date().toISOString())
        .single();
      
      if (!timeCheck) {
        console.log('OTP has expired - Current:', new Date().toISOString(), 'Expires:', otpRecord.expires_at);
        return NextResponse.json(
          { error: 'OTP has expired' },
          { status: 400 }
        );
      }
      
      console.log('OTP is valid - Current:', new Date().toISOString(), 'Expires:', otpRecord.expires_at);

      // Extend OTP validity by 15 more minutes for password reset
      const newExpiryTime = new Date(Date.now() + 15 * 60 * 1000);
      await supabaseAdmin
        .from('admin_otps')
        .update({ expires_at: newExpiryTime })
        .eq('id', otpRecord.id);

      return NextResponse.json({
        success: true,
        message: 'OTP verified for password reset'
      });
    }

    if (!adminId) {
      return NextResponse.json(
        { error: 'Admin ID is required for login verification' },
        { status: 400 }
      );
    }

    // Find valid OTP
    const { data: otpRecord, error: otpError } = await supabase
      .from('admin_otps')
      .select(`
        *,
        admin_users!inner (
          id,
          name,
          email,
          is_active
        )
      `)
      .eq('admin_id', adminId)
      .eq('otp', otp)
      .eq('is_verified', false)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (otpError || !otpRecord) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Check if admin is still active
    if (!otpRecord.admin_users.is_active) {
      return NextResponse.json(
        { error: 'Admin account is deactivated' },
        { status: 401 }
      );
    }

    // Mark OTP as verified
    const { error: updateError } = await supabase
      .from('admin_otps')
      .update({ is_verified: true })
      .eq('id', otpRecord.id);

    if (updateError) {
      console.error('OTP verification update error:', updateError);
      return NextResponse.json(
        { error: 'Failed to verify OTP' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        adminId: otpRecord.admin_users.id,
        email: otpRecord.admin_users.email,
        name: otpRecord.admin_users.name,
        type: 'admin',
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'OTP verified successfully',
      admin: {
        id: otpRecord.admin_users.id,
        name: otpRecord.admin_users.name,
        email: otpRecord.admin_users.email,
      },
      token,
    });

    // Set HTTP-only cookie with correct path
    response.cookies.set('admin-auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/', // Changed from '/admin' to '/' so API routes can access it
    });

    // Clean up other OTPs for this admin
    await supabase
      .from('admin_otps')
      .delete()
      .eq('admin_id', adminId)
      .neq('id', otpRecord.id);

    return response;

  } catch (error) {
    console.error('Admin OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}