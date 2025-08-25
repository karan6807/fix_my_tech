import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function PUT(request: NextRequest) {
  try {
    const { bookingId, newStatus, holdReason, unableReason } = await request.json();

    if (!bookingId || !newStatus) {
      return NextResponse.json(
        { error: 'Booking ID and new status are required' },
        { status: 400 }
      );
    }

    // Validate status values
    const validStatuses = ['assigned', 'accepted', 'in_progress', 'completed', 'rejected', 'hold_on_work', 'unable_to_complete'];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Get current booking to track previous status
    const { data: currentBooking } = await supabaseAdmin
      .from('repair_bookings')
      .select('status')
      .eq('id', bookingId)
      .single();

    // Update the booking status and add reasons if applicable
    const updateData = newStatus === 'rejected'
      ? { status: newStatus, assigned_engineer: null }
      : newStatus === 'unable_to_complete' && unableReason
      ? { status: newStatus, assigned_engineer: null, unable_reason: unableReason }
      : newStatus === 'unable_to_complete'
      ? { status: newStatus, assigned_engineer: null }
      : newStatus === 'hold_on_work' && holdReason
      ? { status: newStatus, hold_reason: holdReason }
      : { status: newStatus };

    const { data, error } = await supabaseAdmin
      .from('repair_bookings')
      .update(updateData)
      .eq('id', bookingId)
      .select(`
        *,
        users!repair_bookings_user_id_fkey (
          name,
          email
        )
      `);

    // Log status change to history
    if (data && data[0] && currentBooking) {
      const remarks = holdReason ? `Hold reason: ${holdReason}` :
                     unableReason ? `Unable reason: ${unableReason}` : null;
      
      await supabaseAdmin
        .from('repair_booking_history')
        .insert({
          booking_id: bookingId,
          previous_status: currentBooking.status,
          new_status: newStatus,
          changed_by_type: 'engineer',
          changed_by_name: 'Engineer',
          remarks: remarks
        });
    }

    if (error) {
      console.error('Error updating booking status:', error);
      return NextResponse.json(
        { error: 'Failed to update booking status: ' + error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Send email notification when engineer starts work (status changes to in_progress)
    if (newStatus === 'in_progress' && data[0].users) {
      try {
        // Send email to customer
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data[0].users.email,
            subject: 'Engineer Assigned - Work Started - TechService',
            type: 'engineer_started',
            data: {
              customerName: data[0].users.name,
              serviceType: data[0].service_type,
              device: data[0].device_type,
              bookingId: data[0].id.slice(-8).toUpperCase(),
              engineerName: data[0].assigned_engineer
            }
          })
        });

        // Send email to admin
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'kptestingdw@gmail.com',
            subject: `Work Started - ${data[0].service_type} #${data[0].id.slice(-8).toUpperCase()}`,
            type: 'admin_work_started',
            data: {
              bookingId: data[0].id,
              customerName: data[0].users.name,
              engineerName: data[0].assigned_engineer,
              serviceType: data[0].service_type,
              device: data[0].device_type,
              customerPhone: data[0].contact_phone,
              startedAt: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          })
        });
      } catch (emailError) {
        console.error('Failed to send email:', emailError);
      }
    }

    // Send email notification to admin when engineer rejects task
    if (newStatus === 'rejected' && data[0].users) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'kptestingdw@gmail.com',
            subject: `Task Rejected - ${data[0].service_type} #${data[0].id.slice(-8).toUpperCase()}`,
            type: 'admin_task_rejected',
            data: {
              bookingId: data[0].id,
              customerName: data[0].users.name,
              engineerName: data[0].assigned_engineer || 'Engineer',
              serviceType: data[0].service_type,
              device: data[0].device_type,
              customerPhone: data[0].contact_phone,
              issueDescription: data[0].issue_description,
              rejectedAt: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          })
        });
        console.log('Task rejection email sent to admin');
      } catch (emailError) {
        console.error('Failed to send rejection email:', emailError);
      }
    }

    // Send email notifications when work is put on hold
    if (newStatus === 'hold_on_work' && data[0].users && holdReason) {
      try {
        // Send email to customer
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data[0].users.email,
            subject: `Repair Update - Work Temporarily On Hold #${data[0].id.slice(-8).toUpperCase()}`,
            type: 'customer_work_on_hold',
            data: {
              bookingId: data[0].id,
              customerName: data[0].users.name,
              engineerName: data[0].assigned_engineer || 'TechService Engineer',
              serviceType: data[0].service_type,
              device: data[0].device_type,
              holdReason: holdReason
            }
          })
        });

        // Send email to admin
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'kptestingdw@gmail.com',
            subject: `Work On Hold - ${data[0].service_type} #${data[0].id.slice(-8).toUpperCase()}`,
            type: 'admin_work_on_hold',
            data: {
              bookingId: data[0].id,
              customerName: data[0].users.name,
              engineerName: data[0].assigned_engineer || 'TechService Engineer',
              serviceType: data[0].service_type,
              device: data[0].device_type,
              customerPhone: data[0].contact_phone,
              holdReason: holdReason,
              holdDate: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          })
        });
        console.log('Hold notification emails sent successfully');
      } catch (emailError) {
        console.error('Failed to send hold emails:', emailError);
      }
    }

    // Send email notification to admin when engineer marks as unable to complete
    if (newStatus === 'unable_to_complete' && data[0].users && unableReason) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: 'kptestingdw@gmail.com',
            subject: `Unable to Complete - ${data[0].service_type} #${data[0].id.slice(-8).toUpperCase()}`,
            type: 'admin_unable_to_complete',
            data: {
              bookingId: data[0].id,
              customerName: data[0].users.name,
              engineerName: data[0].assigned_engineer || 'Engineer',
              serviceType: data[0].service_type,
              device: data[0].device_type,
              customerPhone: data[0].contact_phone,
              issueDescription: data[0].issue_description,
              unableReason: unableReason,
              reportedAt: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            }
          })
        });
        console.log('Unable to complete email sent to admin');
      } catch (emailError) {
        console.error('Failed to send unable to complete email:', emailError);
      }
    }

    // Send email notification when repair is completed
    console.log('Checking completion email:', { newStatus, hasUser: !!data[0].users });
    if (newStatus === 'completed' && data[0].users) {
      console.log('Sending completion email to:', data[0].users.email);
      try {
        const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: data[0].users.email,
            subject: 'Repair Completed Successfully - TechService',
            type: 'repair_completed',
            data: {
              customerName: data[0].users.name,
              serviceType: data[0].service_type,
              device: data[0].device_type,
              bookingId: data[0].id.slice(-8).toUpperCase(),
              engineerName: data[0].assigned_engineer,
              issueDescription: data[0].issue_description,
              completedDate: new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          })
        });
        console.log('Email response status:', emailResponse.status);
        const emailResult = await emailResponse.json();
        console.log('Email result:', emailResult);
      } catch (emailError) {
        console.error('Failed to send completion email:', emailError);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Status updated successfully',
      updatedBooking: data[0]
    });

  } catch (error) {
    console.error('Error in update status API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}