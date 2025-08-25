// src/components/AdminProtectedRoute.tsx
'use client';

import React, { useEffect } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { useRouter, usePathname } from 'next/navigation';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { admin, isLoading, isAuthenticated } = useAdminAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage = pathname?.includes('/admin/auth');

  // Handle redirects in useEffect to avoid render-time state updates
  useEffect(() => {
    if (isLoading) return; // Wait for auth check to complete

    // If on auth page and already authenticated, redirect to dashboard
    if (isAuthPage && isAuthenticated && admin) {
      router.push('/admin');
      return;
    }

    // If not on auth page and not authenticated, redirect to signin
    if (!isAuthPage && (!isAuthenticated || !admin)) {
      router.push('/admin/auth/signin');
      return;
    }
  }, [isLoading, isAuthPage, isAuthenticated, admin, router]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // If on auth page, allow access regardless of authentication status
  if (isAuthPage) {
    // If already authenticated and on auth page, show redirect message
    if (isAuthenticated && admin) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </div>
        </div>
      );
    }
    return <>{children}</>;
  }

  // If not on auth page and not authenticated, show redirect message
  if (!isAuthenticated || !admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting to sign in...</p>
        </div>
      </div>
    );
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}