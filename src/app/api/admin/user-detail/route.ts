import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) {
      console.error('User fetch error:', userError);
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's repair requests with payments for cost
    const { data: requestsData, error: requestsError } = await supabaseAdmin
      .from('repair_bookings')
      .select(`
        *,
        repair_payments (
          amount,
          payment_status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (requestsError) {
      console.error('Requests fetch error:', requestsError);
      return NextResponse.json(
        { success: false, error: 'Failed to fetch user requests' },
        { status: 500 }
      );
    }

    // Transform user data
    const user = {
      id: userData.id,
      name: userData.name,
      email: userData.email,
      phone: userData.phone || 'N/A',
      address: userData.address || 'N/A',
      registrationDate: userData.created_at?.split('T')[0] || 'N/A',
      status: userData.is_active ? 'Active' : 'Inactive',
      totalRequests: requestsData?.length || 0,
      lastActivity: userData.updated_at?.split('T')[0] || 'N/A',
      satisfactionRate: 85, // Mock for now
      totalSpent: requestsData?.reduce((sum: number, req: {
        repair_payments?: Array<{ amount: string }>;
      }) => {
        const cost = req.repair_payments && req.repair_payments.length > 0 ? parseFloat(req.repair_payments[0].amount) || 0 : 0;
        return sum + cost;
      }, 0) || 0
    };

    // Transform requests data
    const requests = requestsData?.map((request: {
      id: string;
      service_type?: string;
      device_type: string;
      model?: string;
      issue_description: string;
      status: string;
      created_at?: string;
      updated_at?: string;
      assigned_engineer?: string;
      repair_payments?: Array<{ amount: string }>;
    }) => {
      console.log('Processing request:', request.id);
      console.log('Request repair_payments:', request.repair_payments);
      console.log('Payment amount:', request.repair_payments?.amount);
      
      const cost = request.repair_payments && request.repair_payments.length > 0 ? parseFloat(request.repair_payments[0].amount) || 0 : 0;
      console.log('Final cost:', cost);
      
      return {
        id: request.id,
        serviceType: request.service_type || 'General Repair',
        deviceType: `${request.device_type} ${request.model !== 'Not specified' ? `- ${request.model}` : ''}`.trim(),
        issueDescription: request.issue_description,
        status: request.status === 'completed' ? 'Completed' : 
                request.status === 'in_progress' ? 'In Progress' :
                request.status === 'pending' ? 'Pending' :
                request.status === 'cancelled' ? 'Cancelled' : 'Pending',
        priority: 'Medium', // Mock for now
        requestDate: request.created_at?.split('T')[0] || 'N/A',
        completedDate: request.status === 'completed' ? request.updated_at?.split('T')[0] : undefined,
        cost: cost,
        technician: request.assigned_engineer || 'Not Assigned'
      };
    }) || [];

    return NextResponse.json({
      success: true,
      user,
      requests
    });

  } catch (error) {
    console.error('User detail API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}