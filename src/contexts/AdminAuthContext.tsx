// src/contexts/AdminAuthContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface Admin {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface AdminAuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (adminData: Admin) => void;
  logout: () => void;
  signOut: () => void;
  refreshAdmin: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();

  // Check if current path is an auth page
  const isAuthPage = pathname?.includes('/admin/auth');

  // Function to check authentication status
  const checkAuthStatus = async (skipRedirect = false) => {
    try {
      const response = await fetch('/api/admin/auth/me', {
        method: 'GET',
        credentials: 'include', // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        setAdmin(data.admin);
        setIsAuthenticated(true);
        
        // If we're on auth page and authenticated, redirect to dashboard
        if (!skipRedirect && isAuthPage) {
          router.push('/admin/dashboard');
        }
      } else {
        setAdmin(null);
        setIsAuthenticated(false);
        
        // Only redirect to auth if not already on auth page and not skipping redirects
        if (!skipRedirect && !isAuthPage) {
          router.push('/admin/auth/signin');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setAdmin(null);
      setIsAuthenticated(false);
      
      if (!skipRedirect && !isAuthPage) {
        router.push('/admin/auth/signin');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication when pathname changes, but skip redirects to avoid loops
  useEffect(() => {
    if (!isLoading) {
      checkAuthStatus(true);
    }
  }, [pathname]);

  const login = (adminData: Admin) => {
    setAdmin(adminData);
    setIsAuthenticated(true);
    // Force a refresh to make sure we have the latest auth state
    checkAuthStatus(true);
  };

  const logout = async () => {
    try {
      await fetch('/api/admin/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAdmin(null);
      setIsAuthenticated(false);
      router.push('/admin/auth/signin');
    }
  };

  const refreshAdmin = async () => {
    await checkAuthStatus(true);
  };

  const value: AdminAuthContextType = {
    admin,
    isLoading,
    isAuthenticated,
    login,
    logout,
    signOut: logout,
    refreshAdmin,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};