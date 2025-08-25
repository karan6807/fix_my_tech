import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

export async function GET(req: NextRequest) {
  try {
    // Get token from cookies
    const token = req.cookies.get('employee_token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'No token provided' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verifyToken(token);

    // Type check to ensure 'decoded' is an object before accessing its properties
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    const payload = decoded as JwtPayload;
    const employeeId = payload.userId;

    // Get employee data
    const { data: employee, error: fetchError } = await supabase
      .from('employees')
      .select(`
        id,
        email,
        first_name,
        last_name,
        phone,
        department,
        position,
        is_verified,
        is_active,
        created_at,
        last_login
      `)
      .eq('id', employeeId)
      .single();

    if (fetchError || !employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      );
    }

    // Check if employee is still active
    if (!employee.is_active) {
      return NextResponse.json(
        { error: 'Account is deactivated' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      employee: {
        id: employee.id,
        email: employee.email,
        firstName: employee.first_name,
        lastName: employee.last_name,
        phone: employee.phone,
        department: employee.department,
        position: employee.position,
        isVerified: employee.is_verified,
        isActive: employee.is_active,
        createdAt: employee.created_at,
        lastLogin: employee.last_login
      }
    });

  } catch (error) {
    console.error('Employee me error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
