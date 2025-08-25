import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { data: employees, error } = await supabase
      .from('employees')
      .select('id, first_name, last_name, email, phone, position, is_active, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    const formattedEmployees = employees.map((employee: any) => ({
      id: employee.id,
      fullName: `${employee.first_name} ${employee.last_name}`,
      email: employee.email,
      phoneNumber: employee.phone || 'N/A',
      specialization: employee.position || 'General Repair',
      status: employee.is_active ? 'active' : 'inactive',
      completedJobs: Math.floor(Math.random() * 50) + 1, // Placeholder
      rating: (Math.random() * 2 + 3).toFixed(1), // Random rating 3.0-5.0
      joinDate: employee.created_at
    }));

    return NextResponse.json({ employees: formattedEmployees });
  } catch (error) {
    console.error('Error fetching employees:', error);
    return NextResponse.json(
      { error: 'Failed to fetch employees' },
      { status: 500 }
    );
  }
}