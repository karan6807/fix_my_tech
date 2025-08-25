import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const engineerId = searchParams.get('engineerId');

    if (!engineerId) {
      return NextResponse.json(
        { error: 'Engineer ID is required' },
        { status: 400 }
      );
    }

    // First get the engineer's name from the employees table
    const { data: engineer, error: engineerError } = await supabaseAdmin
      .from('employees')
      .select('first_name, last_name')
      .eq('id', engineerId)
      .single();

    if (engineerError || !engineer) {
      return NextResponse.json({
        success: true,
        requests: []
      });
    }

    const engineerName = `${engineer.first_name} ${engineer.last_name}`;

    // Fetch repair requests assigned to this engineer by name with payment info
    const { data: requests, error } = await supabaseAdmin
      .from('repair_bookings')
      .select(`
        id,
        contact_phone,
        device_type,
        model,
        issue_description,
        address,
        created_at,
        status,
        service_type,
        users!repair_bookings_user_id_fkey (
          name,
          email
        ),
        repair_payments (
          amount
        )
      `)
      .eq('assigned_engineer', engineerName)
      .order('created_at', { ascending: false });

    // If no requests found or error, return empty array
    if (error || !requests) {
      console.log('No requests found for engineer:', engineerName);
      return NextResponse.json({
        success: true,
        requests: []
      });
    }



    // Format the requests data
    const formattedRequests = requests.map((request: {
      id: string;
      contact_phone: string;
      device_type: string;
      model: string;
      issue_description: string;
      address: string;
      created_at: string;
      status: string;
      service_type: string;
      users?: { name: string; email: string };
      repair_payments?: Array<{ amount: number }>;
    }) => ({
      id: request.id,
      customerName: request.users?.name || 'Unknown Customer',
      customerPhone: request.contact_phone,
      deviceType: `${request.device_type} ${request.model !== 'Not specified' ? `- ${request.model}` : ''}`.trim(),
      serviceType: request.service_type,
      issue: request.issue_description,
      address: request.address,
      requestDate: request.created_at,
      status: request.status,
      priority: 'medium', // Default priority since it's not in the schema
      estimatedCost: request.repair_payments?.[0]?.amount || null // Real payment amount
    }));

    return NextResponse.json({
      success: true,
      requests: formattedRequests
    });

  } catch (error) {
    console.error('Error in engineer-requests API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}