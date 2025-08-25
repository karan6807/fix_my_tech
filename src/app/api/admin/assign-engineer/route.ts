import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { requestId, engineerId } = await request.json();

    console.log('=== ASSIGN ENGINEER DEBUG ===');
    console.log('Request:', { requestId, engineerId });
    
    // Show all repair bookings in database
    const { data: allBookings } = await supabaseAdmin
      .from('repair_bookings')
      .select('id, status, assigned_engineer')
      .limit(10);
    
    console.log('All repair bookings in database:', allBookings?.length || 0, 'records');
    if (allBookings && allBookings.length > 0) {
      allBookings.forEach((booking: { id: string; status: string; assigned_engineer: string | null }, index: number) => {
        console.log(`${index + 1}. ID: ${booking.id}, Status: ${booking.status}, Assigned: ${booking.assigned_engineer || 'NULL'}`);
      });
    } else {
      console.log('NO REPAIR BOOKINGS FOUND IN DATABASE!');
    }

    if (!requestId || !engineerId) {
      return NextResponse.json(
        { error: 'Request ID and Engineer ID are required' },
        { status: 400 }
      );
    }

    // Get engineer details
    const { data: engineer, error: engineerError } = await supabaseAdmin
      .from('employees')
      .select('first_name, last_name, email')
      .eq('id', engineerId)
      .single();

    if (engineerError) {
      console.error('Error fetching engineer:', engineerError);
      return NextResponse.json(
        { error: 'Engineer not found' },
        { status: 404 }
      );
    }

    const engineerName = `${engineer.first_name} ${engineer.last_name}`;
    console.log('Engineer name:', engineerName);

    // Try to update the booking directly - assign engineer and change status to 'assigned'
    const { data, error } = await supabaseAdmin
      .from('repair_bookings')
      .update({ 
        assigned_engineer: engineerName,
        status: 'assigned'
      })
      .eq('id', requestId)
      .select();

    console.log('Update result:', { data, error });
    console.log('Updated records count:', data?.length || 0);

    if (error) {
      console.error('Update error:', error);
      return NextResponse.json(
        { error: 'Failed to assign engineer: ' + error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      console.log('No records were updated - booking ID not found');
      return NextResponse.json(
        { error: 'Booking not found with ID: ' + requestId },
        { status: 404 }
      );
    }

    // Get complete booking and engineer details for notifications
    const { data: fullBookingData } = await supabaseAdmin
      .from('repair_bookings')
      .select(`
        *,
        users!repair_bookings_user_id_fkey (
          name,
          email
        )
      `)
      .eq('id', requestId)
      .single();

    // Create notification for engineer
    try {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: engineerId,
          user_type: 'engineer',
          title: 'New Task Assigned',
          message: `You have been assigned a ${fullBookingData?.service_type} task for ${fullBookingData?.device_type}`,
          type: 'task_assigned',
          related_booking_id: requestId
        });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    // Send email notification to engineer
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: engineer.email || `${engineer.first_name.toLowerCase()}.${engineer.last_name.toLowerCase()}@techservice.com`,
          subject: `New Task Assigned - ${fullBookingData?.service_type} #${requestId.slice(-8).toUpperCase()}`,
          type: 'engineer_assignment',
          data: {
            bookingId: requestId,
            engineerName: engineerName,
            customerName: fullBookingData?.users?.name || 'Customer',
            serviceType: fullBookingData?.service_type,
            device: fullBookingData?.device_type,
            model: fullBookingData?.model || 'Not specified',
            customerPhone: fullBookingData?.contact_phone,
            address: fullBookingData?.address,
            issueDescription: fullBookingData?.issue_description
          }
        })
      });
      console.log('Engineer assignment email sent successfully');
    } catch (emailError) {
      console.error('Failed to send engineer email:', emailError);
    }

    console.log('SUCCESS: Engineer assigned to booking');
    console.log('=== END DEBUG ===');

    return NextResponse.json({ 
      success: true, 
      message: 'Engineer assigned successfully',
      engineerName,
      updatedBooking: data
    });

  } catch (error) {
    console.error('Error in assign engineer API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}