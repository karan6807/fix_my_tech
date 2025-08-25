import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const engineerId = searchParams.get('id');

    if (!engineerId) {
      return NextResponse.json(
        { error: 'Engineer ID is required' },
        { status: 400 }
      );
    }

    // Fetch engineer details from database
    const { data: engineer, error } = await supabaseAdmin
      .from('employees')
      .select('id, first_name, last_name, email, phone, position, is_active, created_at')
      .eq('id', engineerId)
      .single();

    if (error) {
      console.error('Error fetching engineer:', error);
      return NextResponse.json(
        { error: 'Engineer not found' },
        { status: 404 }
      );
    }

    if (!engineer) {
      return NextResponse.json(
        { error: 'Engineer not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      engineer: {
        id: engineer.id,
        fullName: `${engineer.first_name} ${engineer.last_name}`,
        email: engineer.email,
        phoneNumber: engineer.phone || 'N/A',
        specialization: engineer.position || 'General Repair',
        joinDate: engineer.created_at,
        status: engineer.is_active ? 'active' : 'inactive',
        completedJobs: Math.floor(Math.random() * 50) + 1,
        rating: parseFloat((Math.random() * 2 + 3).toFixed(1))
      }
    });

  } catch (error) {
    console.error('Error in engineer-details API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}