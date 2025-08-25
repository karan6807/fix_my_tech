import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded as { userId: string };

    const { data: bookings, error } = await supabaseAdmin
      .from('repair_bookings')
      .select(`
        *,
        users!repair_bookings_user_id_fkey (
          name,
          email
        ),
        repair_completion_reports (
          work_performed,
          parts_used,
          payment_amount,
          completed_at
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json({ error: 'Failed to fetch your bookings' }, { status: 500 });
    }

    const transformedBookings = bookings?.map((booking: any) => ({
      id: booking.id,
      customerName: booking.users?.name || 'Unknown',
      email: booking.users?.email || 'No email',
      phone: booking.contact_phone,
      device: `${booking.device_type} ${booking.model !== 'Not specified' ? `- ${booking.model}` : ''}`.trim(),
      serviceType: booking.service_type,
      issue: booking.issue_description,
      address: booking.address,
      status: booking.status,
      date: booking.preferred_date,
      time: booking.preferred_time,
      createdAt: booking.created_at,
      updatedAt: booking.updated_at,
      assignedEngineer: booking.assigned_engineer,
      completionReport: booking.repair_completion_reports ? {
        workPerformed: booking.repair_completion_reports.work_performed,
        partsUsed: booking.repair_completion_reports.parts_used,
        paymentAmount: booking.repair_completion_reports.payment_amount,
        completedAt: booking.repair_completion_reports.completed_at
      } : null
    })) || [];

    return NextResponse.json({
      success: true,
      bookings: transformedBookings
    });

  } catch (error) {
    console.error('Get user bookings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}