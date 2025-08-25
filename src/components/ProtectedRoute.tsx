// src/components/ProtectedRoute.tsx
'use client';

import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  requireEmailVerification?: boolean;
}

const ProtectedRoute = ({ 
  children, 
  redirectTo = '/auth/signin',
  requireEmailVerification = true 
}: ProtectedRouteProps) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Not authenticated, redirect to sign in
        router.push(redirectTo);
      } else if (requireEmailVerification && user && !user.email_verified) {
        // Email not verified, redirect to verification page
        router.push(`/auth/verify-otp?email=${encodeURIComponent(user.email)}&purpose=email_verification`);
      }
    }
  }, [user, loading, isAuthenticated, router, redirectTo, requireEmailVerification]);

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authenticated or email not verified
  if (!isAuthenticated || (requireEmailVerification && user && !user.email_verified)) {
    return null;
  }

  // User is authenticated and email is verified (if required)
  return <>{children}</>;
};

export default ProtectedRoute;