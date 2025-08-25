import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    // Get token from httpOnly cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { userId } = decoded as { userId: string };
    const { name, email, mobile, address, serviceType, deviceType, modelNumber, description } = await request.json();

    // Validation
    if (!name || !email || !mobile || !address || !serviceType || !deviceType || !description) {
      return NextResponse.json(
        { error: 'All required fields must be filled' },
        { status: 400 }
      );
    }

    // Insert repair booking
    const { data, error } = await supabaseAdmin
      .from('repair_bookings')
      .insert({
        user_id: userId,
        service_type: serviceType, // Predefined dropdown (Laptop Repair, etc.)
        device_type: deviceType,   // User manual input (iPhone, MacBook, etc.)
        model: modelNumber || 'Not specified',
        issue_description: description,
        contact_phone: mobile,
        preferred_date: new Date().toISOString().split('T')[0], // Today's date
        preferred_time: '09:00-17:00',
        address: address,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to book repair service' },
        { status: 500 }
      );
    }

    // Create notification for admin (using the known admin ID)
    try {
      await supabaseAdmin
        .from('notifications')
        .insert({
          user_id: '42bca4c0-677b-4850-b234-8838099bc5c4',
          user_type: 'admin',
          title: 'New Repair Request',
          message: `New ${serviceType} request from ${name} for ${deviceType}`,
          type: 'new_request',
          related_booking_id: data.id
        });
    } catch (notifError) {
      console.error('Failed to create notification:', notifError);
    }

    // Send email notification to admin
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/send-email`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: 'kptestingdw@gmail.com', // Admin email address
          subject: `New Repair Request #${data.id.slice(-8).toUpperCase()} - ${serviceType}`,
          type: 'admin_new_booking',
          data: {
            bookingId: data.id,
            customerName: name,
            customerEmail: email,
            customerPhone: mobile,
            serviceType: serviceType,
            device: deviceType,
            model: modelNumber || 'Not specified',
            address: address,
            issueDescription: description
          }
        })
      });
      console.log('Admin notification email sent successfully');
    } catch (emailError) {
      console.error('Failed to send admin email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Repair service booked successfully!',
      booking: data
    });

  } catch (error) {
    console.error('Book repair error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}