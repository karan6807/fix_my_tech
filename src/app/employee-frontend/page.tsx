'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

export default function EmployeeFrontendPage() {
  const { employee, loading } = useEmployeeAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (employee) {
        // If employee is authenticated, redirect to dashboard
        router.push('/employee-frontend/dashboard');
      } else {
        // If not authenticated, redirect to signin
        router.push('/employee-frontend/auth/signin');
      }
    }
  }, [employee, loading, router]);

  // Show loading while checking auth
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    </div>
  );
}