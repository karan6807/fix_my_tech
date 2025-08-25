import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // Fetch payments with booking and user details
    const { data: payments, error } = await supabaseAdmin
      .from('repair_payments')
      .select(`
        *,
        repair_bookings!inner (
          id,
          service_type,
          device_type,
          assigned_engineer,
          contact_phone,
          users!inner (
            name,
            email
          )
        )
      `)
      .order('recorded_at', { ascending: false });

    if (error) {
      console.error('Error fetching payments:', error);
      return NextResponse.json(
        { error: 'Failed to fetch payments: ' + error.message },
        { status: 500 }
      );
    }

    // Format the data for the frontend
    const formattedPayments = payments.map((payment: {
      id: string;
      booking_id: string;
      amount: string;
      payment_method: string;
      payment_status: string;
      recorded_at: string;
      upi_transaction_id?: string;
      repair_bookings: {
        id: string;
        service_type: string;
        device_type: string;
        assigned_engineer?: string;
        contact_phone: string;
        users: {
          name: string;
          email: string;
        };
      };
    }) => ({
      id: payment.id,
      orderId: payment.booking_id.slice(-8).toUpperCase(),
      customerName: payment.repair_bookings.users.name,
      customerEmail: payment.repair_bookings.users.email,
      customerPhone: payment.repair_bookings.contact_phone,
      amount: parseFloat(payment.amount),
      paymentMethod: payment.payment_method === 'cash' ? 'Cash' : 'UPI',
      status: payment.payment_status,
      date: new Date(payment.recorded_at).toLocaleDateString('en-US'),
      time: new Date(payment.recorded_at).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      transactionId: payment.upi_transaction_id || `CASH-${payment.id.slice(-8)}`,
      serviceType: payment.repair_bookings.service_type,
      assignedEngineer: payment.repair_bookings.assigned_engineer || 'Not Assigned',
      engineerEmail: 'engineer@company.com' // You can add this to your schema if needed
    }));

    return NextResponse.json({
      success: true,
      payments: formattedPayments
    });

  } catch (error) {
    console.error('Error in repair-payments API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}