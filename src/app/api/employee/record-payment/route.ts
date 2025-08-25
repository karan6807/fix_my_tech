import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const { bookingId, paymentMethod, amount, upiTransactionId, completeTask } = await request.json();

    if (!bookingId || !paymentMethod || !amount) {
      return NextResponse.json(
        { error: 'Booking ID, payment method, and amount are required' },
        { status: 400 }
      );
    }

    if (paymentMethod === 'upi' && !upiTransactionId) {
      return NextResponse.json(
        { error: 'UPI Transaction ID is required for UPI payments' },
        { status: 400 }
      );
    }

    // Calculate commission split (30% engineer, 70% company)
    const totalAmount = parseFloat(amount);
    const engineerCommission = totalAmount * 0.30;
    const companyCommission = totalAmount * 0.70;

    // Record payment in database with commission split
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('repair_payments')
      .insert({
        booking_id: bookingId,
        payment_method: paymentMethod,
        amount: totalAmount,
        upi_transaction_id: upiTransactionId || null,
        payment_status: 'completed',
        engineer_commission: engineerCommission,
        company_commission: companyCommission,
        commission_rate: 0.30,
        recorded_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error recording payment:', paymentError);
      return NextResponse.json(
        { error: 'Failed to record payment: ' + paymentError.message },
        { status: 500 }
      );
    }

    // If completeTask flag is true, update status to completed and send emails
    if (completeTask) {
      // Update booking status to completed
      const { error: statusError } = await supabaseAdmin
        .from('repair_bookings')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', bookingId);

      if (statusError) {
        console.error('Error updating booking status:', statusError);
      } else {
        // Get booking and completion report details for email
        const { data: booking, error: bookingError } = await supabaseAdmin
          .from('repair_bookings')
          .select(`
            *,
            users!repair_bookings_user_id_fkey (
              name,
              email
            ),
            repair_completion_reports (
              work_performed,
              completed_at
            )
          `)
          .eq('id', bookingId)
          .single();

        console.log('Booking data for email:', JSON.stringify(booking, null, 2));
        console.log('Booking error:', bookingError);

        if (booking && booking.users) {
          const completionReport = booking.repair_completion_reports?.[0];
          const completionDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
          
          console.log('Email data being sent:', {
            issue: booking.issue_description,
            completedBy: booking.assigned_engineer,
            completionDate: completionDate
          });

          try {
            // Send completion email to customer
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: booking.users.email,
                subject: `Repair Completed - ${booking.service_type} Service`,
                type: 'repair_completed',
                data: {
                  customerName: booking.users.name,
                  serviceType: booking.service_type,
                  device: booking.device_type,
                  bookingId: booking.id.slice(-8).toUpperCase(),
                  paymentAmount: totalAmount,
                  paymentMethod: paymentMethod.toUpperCase(),
                  issueDescription: booking.issue_description || 'Device repair',
                  engineerName: booking.assigned_engineer || 'Technical Team',
                  completedDate: completionDate
                }
              })
            });

            // Send notification to admin
            await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                to: 'kptestingdw@gmail.com',
                subject: `Repair Completed & Payment Received - ${booking.id.slice(-8).toUpperCase()}`,
                type: 'admin_work_completed',
                data: {
                  customerName: booking.users.name,
                  serviceType: booking.service_type,
                  device: booking.device_type,
                  bookingId: booking.id.slice(-8).toUpperCase(),
                  engineerName: booking.assigned_engineer || 'Technical Team',
                  paymentAmount: totalAmount,
                  paymentMethod: paymentMethod.toUpperCase(),
                  engineerCommission: engineerCommission,
                  companyCommission: companyCommission,
                  issueDescription: booking.issue_description || 'Device repair',
                  completedDate: completionDate,
                  customerPhone: booking.contact_phone
                }
              })
            });

            console.log('Both customer and admin emails sent successfully');
          } catch (emailError) {
            console.error('Email sending failed:', emailError);
          }

        }
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: completeTask ? 'Payment recorded and task completed successfully' : 'Payment recorded successfully',
      payment
    });

  } catch (error) {
    console.error('Error in record-payment API:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}