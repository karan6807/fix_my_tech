import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabaseAdmin } from './supabase';

const JWT_SECRET = process.env.JWT_SECRET || 'your-employee-secret-key';

export interface EmployeeUser {
  id: string;
  name: string;
  email: string;
  employee_id: string;
  department: string;
  role: string;
  email_verified: boolean;
}

export interface EmployeeAuthResult {
  success: boolean;
  user?: EmployeeUser;
  token?: string;
  error?: string;
  needsVerification?: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateEmployeeToken(userId: string, email: string): string {
  return jwt.sign(
    { userId, email, type: 'employee' },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyEmployeeToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function authenticateEmployee(email: string, password: string): Promise<EmployeeAuthResult> {
  try {
    const { data: employee, error } = await supabaseAdmin
      .from('employee_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .single();

    if (error || !employee) {
      return { success: false, error: 'Invalid email or password' };
    }

    const isValidPassword = await verifyPassword(password, employee.password_hash);
    if (!isValidPassword) {
      return { success: false, error: 'Invalid email or password' };
    }

    if (!employee.email_verified) {
      return { 
        success: false, 
        error: 'Please verify your email first',
        needsVerification: true 
      };
    }

    const token = generateEmployeeToken(employee.id, employee.email);

    return {
      success: true,
      user: {
        id: employee.id,
        name: employee.name,
        email: employee.email,
        employee_id: employee.employee_id,
        department: employee.department,
        role: employee.role,
        email_verified: employee.email_verified
      },
      token
    };

  } catch (error) {
    console.error('Employee authentication error:', error);
    return { success: false, error: 'Authentication failed' };
  }
}