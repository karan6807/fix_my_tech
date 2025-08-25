import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyEmployeeToken } from '@/lib/employeeAuth';

export async function GET(request: NextRequest) {
  try {
    // Get token from httpOnly cookie (employee token)
    const token = request.cookies.get('employee_token')?.value;
    
    if (!token) {
      return NextResponse.json({ error: 'Employee authentication required' }, { status: 401 });
    }

    // Verify employee token
    const decoded = verifyEmployeeToken(token);
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json({ error: 'Invalid employee token' }, { status: 401 });
    }

    const { userId, email } = decoded as { userId: string; email: string };

    // Get employee name from employees table
    const { data: employee } = await supabaseAdmin
      .from('employees')
      .select('first_name, last_name')
      .eq('id', userId)
      .single();

    const userName = employee ? `${employee.first_name} ${employee.last_name}` : '';
    console.log('=== EMPLOYEE TASKS API DEBUG ===');
    console.log('User ID:', userId);
    console.log('User name from DB:', userName);

    // First, let's see what assignments exist
    const { data: allAssignments } = await supabaseAdmin
      .from('repair_bookings')
      .select('id, assigned_engineer')
      .not('assigned_engineer', 'is', null)
      .limit(10);
    
    console.log('All assignments in database:');
    allAssignments?.forEach((assignment: any, index: number) => {
      console.log(`${index + 1}. ID: ${assignment.id}, Assigned to: "${assignment.assigned_engineer}"`);
    });
    
    console.log('Looking for assignments to:', `"${userName}"`);

    // Fetch repair bookings assigned to this user (by name) with completion reports and payments
    const { data: bookings, error } = await supabaseAdmin
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
        ),
        repair_payments (
          amount,
          payment_method,
          recorded_at
        )
      `)
      .eq('assigned_engineer', userName)
      .order('created_at', { ascending: false });
      
    console.log('Bookings found for user:', bookings?.length || 0);
    console.log('=== END API DEBUG ===');

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch assigned tasks' },
        { status: 500 }
      );
    }

    // Transform data to match frontend interface
    const transformedTasks = bookings?.map((booking: any) => ({
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
        paymentAmount: booking.repair_payments?.[0]?.amount || null,
        completedAt: booking.repair_completion_reports.completed_at
      } : null
    })) || [];

    return NextResponse.json({
      success: true,
      tasks: transformedTasks,
      total: transformedTasks.length
    });

  } catch (error) {
    console.error('Get employee tasks error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}