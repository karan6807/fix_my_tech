// src/components/EmployeeProtectedRoute.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

interface EmployeeProtectedRouteProps {
  children: React.ReactNode;
  requireActive?: boolean;
  allowedDepartments?: string[];
  fallbackUrl?: string;
}

export default function EmployeeProtectedRoute({ 
  children, 
  requireActive = true,
  allowedDepartments,
  fallbackUrl = '/employee-frontend/auth/signin'
}: EmployeeProtectedRouteProps) {
  const { employee, loading } = useEmployeeAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    if (loading) return;

    // If no employee is authenticated
    if (!employee) {
      router.push(fallbackUrl);
      return;
    }

    // If employee account is not active and we require active status
    if (requireActive && !employee.isActive) {
      router.push('/employee-frontend/account-inactive');
      return;
    }

    // If employee is not verified
    if (!employee.isVerified) {
      router.push('/employee-frontend/auth/verify-otp');
      return;
    }

    // Check department restrictions
    if (allowedDepartments && !allowedDepartments.includes(employee.department)) {
      router.push('/employee-frontend/unauthorized');
      return;
    }

    setIsChecking(false);
  }, [employee, loading, router, requireActive, allowedDepartments, fallbackUrl]);

  // Show loading state
  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render children if employee is not properly authenticated
  if (!employee || (requireActive && !employee.isActive) || !employee.isVerified) {
    return null;
  }

  // Check department access
  if (allowedDepartments && !allowedDepartments.includes(employee.department)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this area.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Higher-order component version
export function withEmployeeProtection<P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireActive?: boolean;
    allowedDepartments?: string[];
    fallbackUrl?: string;
  }
) {
  return function ProtectedComponent(props: P) {
    return (
      <EmployeeProtectedRoute {...options}>
        <Component {...props} />
      </EmployeeProtectedRoute>
    );
  };
}