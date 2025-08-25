import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch completed repair bookings with payment information
    const { data: payments, error } = await supabaseAdmin
      .from('repair_bookings')
      .select(`
        id,
        service_type,
        device_type,
        created_at,
        assigned_engineer,
        users!repair_bookings_user_id_fkey (
          name,
          email
        ),
        repair_completion_reports (
          payment_amount,
          completed_at
        )
      `)
      .eq('status', 'completed')
      .not('repair_completion_reports', 'is', null)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payment data' },
        { status: 500 }
      );
    }

    // Transform data to match frontend interface
    const transformedPayments = payments?.map((booking: {
      id: string;
      service_type: string;
      device_type: string;
      created_at: string;
      assigned_engineer: string | null;
      users?: { name: string; email: string };
      repair_completion_reports?: { payment_amount: number; completed_at: string };
    }) => ({
      id: `PAY-${booking.id.slice(-8).toUpperCase()}`,
      orderId: `ORD-${booking.id.slice(-8).toUpperCase()}`,
      customerName: booking.users?.name || 'Unknown Customer',
      customerEmail: booking.users?.email || 'No email',
      amount: booking.repair_completion_reports?.payment_amount || 0,
      paymentMethod: 'Cash', // Since we collect cash payments
      status: 'completed', // All fetched payments are completed
      date: new Date(booking.repair_completion_reports?.completed_at || booking.created_at).toLocaleDateString('en-CA'),
      time: new Date(booking.repair_completion_reports?.completed_at || booking.created_at).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      transactionId: `TXN-${booking.id.slice(-8).toUpperCase()}`,
      serviceType: booking.service_type,
      assignedEngineer: booking.assigned_engineer || 'Unknown Engineer',
      engineerEmail: 'engineer@techservice.com' // Default engineer email
    })) || [];

    return NextResponse.json({
      success: true,
      payments: transformedPayments,
      total: transformedPayments.length
    });

  } catch (error) {
    console.error('Get payments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}