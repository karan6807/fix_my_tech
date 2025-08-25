import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Type definitions
interface User {
  name: string;
  email: string;
}

interface RepairBooking {
  id: string;
  user_id: string;
  device_type: string;
  model: string;
  issue_description: string;
  contact_phone: string;
  preferred_date: string;
  preferred_time: string;
  address: string;
  status: string;
  created_at: string;
  updated_at: string;
  service_type: string;
  users?: User;
}

export async function GET(request: NextRequest) {
  try {
    // You can add admin authentication here if needed
    // For now, I'll assume admin routes are protected by your AdminAuthContext

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = (page - 1) * limit;

    let query = supabaseAdmin
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
          completed_at
        )
      `)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false });

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    // Search functionality
    if (search) {
      query = query.or(`
        device_type.ilike.%${search}%,
        model.ilike.%${search}%,
        issue_description.ilike.%${search}%,
        users.name.ilike.%${search}%
      `);
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data: bookings, error, count } = await query;

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch repair bookings' },
        { status: 500 }
      );
    }

    // Get total count for pagination (excluding cancelled)
    const { count: totalCount } = await supabaseAdmin
      .from('repair_bookings')
      .select('*', { count: 'exact', head: true })
      .neq('status', 'cancelled');

    // Transform data to match frontend interface
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
      holdReason: booking.hold_reason,
      unableReason: booking.unable_reason,
      completionReport: booking.repair_completion_reports ? {
        workPerformed: booking.repair_completion_reports.work_performed,
        partsUsed: booking.repair_completion_reports.parts_used,
        paymentAmount: booking.repair_completion_reports.payment_amount,
        completedAt: booking.repair_completion_reports.completed_at
      } : null
    })) || [];

    return NextResponse.json({
      success: true,
      bookings: transformedBookings,
      pagination: {
        page,
        limit,
        total: totalCount || 0,
        totalPages: Math.ceil((totalCount || 0) / limit)
      }
    });

  } catch (error) {
    console.error('Get repair bookings error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Optional: Add PUT method to update booking status
export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json(
        { error: 'ID and status are required' },
        { status: 400 }
      );
    }

    const validStatuses = ['pending', 'confirmed', 'in_progress', 'completed', 'cancelled', 'hold_on_work', 'unable_to_complete'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get current booking to track previous status
    const { data: currentBooking } = await supabaseAdmin
      .from('repair_bookings')
      .select('status')
      .eq('id', id)
      .single();

    const { data, error } = await supabaseAdmin
      .from('repair_bookings')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select(`
        *,
        users!repair_bookings_user_id_fkey (
          name,
          email
        )
      `)
      .single();

    // Log status change to history
    if (data && currentBooking) {
      await supabaseAdmin
        .from('repair_booking_history')
        .insert({
          booking_id: id,
          previous_status: currentBooking.status,
          new_status: status,
          changed_by_type: 'admin',
          changed_by_name: 'Admin',
          remarks: null
        });
    }

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to update booking status' },
        { status: 500 }
      );
    }

    // Send email notification when status changes to confirmed
    if (status === 'confirmed' && data.users) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data.users.email,
            subject: 'Repair Request Confirmed - TechService',
            type: 'status_update',
            data: {
              customerName: data.users.name,
              serviceType: data.service_type,
              device: data.device_type,
              bookingId: data.id.slice(-8).toUpperCase()
            }
          })
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    // Send email notifications when work is resumed from hold
    if (status === 'in_progress' && currentBooking?.status === 'hold_on_work' && data.users && data.assigned_engineer) {
      try {
        // Get engineer email
        const { data: engineer } = await supabaseAdmin
          .from('employees')
          .select('email, first_name, last_name')
          .ilike('first_name', data.assigned_engineer.split(' ')[0])
          .ilike('last_name', data.assigned_engineer.split(' ')[1] || '')
          .single();

        const resumedDate = new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        });

        // Send email to customer
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data.users.email,
            subject: `Great News! Repair Work Resumed #${data.id.slice(-8).toUpperCase()}`,
            type: 'customer_work_resumed',
            data: {
              bookingId: data.id,
              customerName: data.users.name,
              engineerName: data.assigned_engineer,
              serviceType: data.service_type,
              device: data.device_type,
              resumedDate: resumedDate
            }
          })
        });

        // Send email to engineer if found
        if (engineer?.email) {
          await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: engineer.email,
              subject: `Work Resumed - Continue Task #${data.id.slice(-8).toUpperCase()}`,
              type: 'engineer_work_resumed',
              data: {
                bookingId: data.id,
                engineerName: data.assigned_engineer,
                customerName: data.users.name,
                serviceType: data.service_type,
                device: data.device_type,
                customerPhone: data.contact_phone,
                resumedDate: resumedDate
              }
            })
          });
        }
        console.log('Work resumed emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send work resumed emails:', emailError);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Booking status updated successfully',
      booking: data
    });

  } catch (error) {
    console.error('Update booking error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}