import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const userType = searchParams.get('userType');
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    if (!userId || !userType) {
      return NextResponse.json({ error: 'User ID and user type are required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .order('created_at', { ascending: false });

    if (unreadOnly) {
      query = query.eq('is_read', false);
    }

    const { data: notifications, error } = await query;

    if (error) {
      console.error('Database error:', error);
      // If table doesn't exist, return empty array
      if (error.code === '42P01') {
        return NextResponse.json({ success: true, notifications: [] });
      }
      return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
    }

    return NextResponse.json({ success: true, notifications: notifications || [] });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId, userType, title, message, type, relatedBookingId } = await request.json();

    if (!userId || !userType || !title || !message || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('notifications')
      .insert({
        user_id: userId,
        user_type: userType,
        title,
        message,
        type,
        related_booking_id: relatedBookingId || null
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Failed to create notification' }, { status: 500 });
    }

    return NextResponse.json({ success: true, notification: data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { notificationIds, userId, userType } = await request.json();

    if (!userId || !userType) {
      return NextResponse.json({ error: 'User ID and user type are required' }, { status: 400 });
    }

    let query = supabaseAdmin
      .from('notifications')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId)
      .eq('user_type', userType);

    if (notificationIds && notificationIds.length > 0) {
      query = query.in('id', notificationIds);
    }

    const { error } = await query;

    if (error) {
      return NextResponse.json({ error: 'Failed to mark notifications as read' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Notifications marked as read' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}