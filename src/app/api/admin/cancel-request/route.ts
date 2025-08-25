import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { requestId, reason, customerEmail, customerName } = await request.json();

    if (!requestId || !reason || !customerEmail || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the booking status to cancelled in database
    console.log('Attempting to cancel booking:', requestId);
    console.log('Cancellation reason:', reason);
    
    const { data: updateData, error: updateError } = await supabaseAdmin
      .from('repair_bookings')
      .update({ 
        status: 'cancelled',
        cancellation_reason: reason,
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select();

    console.log('Update result:', { updateData, updateError });

    if (updateError) {
      console.error('Database update error:', updateError);
      return NextResponse.json(
        { success: false, error: `Failed to update booking status: ${updateError.message}` },
        { status: 500 }
      );
    }

    if (!updateData || updateData.length === 0) {
      console.error('No rows updated - booking not found:', requestId);
      return NextResponse.json(
        { success: false, error: 'Booking not found or already cancelled' },
        { status: 404 }
      );
    }

    console.log('Successfully updated booking:', updateData[0]);

    // Send cancellation email to customer using the same email system
    try {
      const emailResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: customerEmail,
          subject: 'Repair Request Cancelled - TechFix Services',
          type: 'request_cancelled',
          data: {
            customerName,
            reason,
            requestId: requestId.slice(-8).toUpperCase()
          }
        }),
      });

      if (!emailResponse.ok) {
        console.error('Email sending failed, but booking was cancelled');
      }
    } catch (emailError) {
      console.error('Email sending error:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Request cancelled successfully'
    });

  } catch (error) {
    console.error('Cancel request error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}