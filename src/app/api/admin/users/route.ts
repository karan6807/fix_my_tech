import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    // Fetch users with their repair request counts
    const { data: users, error } = await supabaseAdmin
      .from('users')
      .select(`
        id,
        name,
        email,
        created_at,
        email_verified,
        repair_bookings(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Transform data to match frontend interface
    const transformedUsers = users?.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: 'Not provided', // Users table doesn't have phone, it's in repair_bookings
      address: 'Not provided', // Users table doesn't have address, it's in repair_bookings
      registrationDate: new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }),
      status: user.email_verified ? 'Active' : 'Inactive',
      totalRequests: user.repair_bookings?.[0]?.count || 0,
      lastActivity: new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    })) || [];

    return NextResponse.json({
      success: true,
      users: transformedUsers
    });

  } catch (error) {
    console.error('Get users error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}