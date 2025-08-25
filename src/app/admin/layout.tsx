/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AdminAuthProvider } from '@/contexts/AdminAuthContext';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import AdminNavbar from './components/Navbar';
import AdminSidebar from './components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Check if current route is an auth route
  const isAuthRoute = pathname?.includes('/admin/auth/');

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  return (
    <AdminAuthProvider>
      {/* Only protect non-auth routes */}
      {isAuthRoute ? (
        // Auth pages - no protection, no navbar/sidebar
        <div className="min-h-screen">
          {children}
        </div>
      ) : (
        // Protected admin pages - with navbar/sidebar
        <AdminProtectedRoute>
          <div className="min-h-screen bg-gray-50">
            {/* Navbar */}
            <AdminNavbar onToggleSidebar={toggleSidebar} />
            
            <div className="flex h-screen pt-16 lg:pt-16">
              {/* Sidebar */}
              <div className={`fixed inset-y-0 left-0 z-30 pt-28 lg:pt-0 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
                isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
                <AdminSidebar 
                  isCollapsed={isSidebarCollapsed} 
                  onToggle={toggleSidebar} 
                />
              </div>

              {/* Mobile overlay */}
              {isMobileSidebarOpen && (
                <div 
                  className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden" 
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
              )}

              {/* Main content */}
              <div className="flex-1 overflow-auto">
                <main className="p-4 lg:p-6 pt-20 lg:pt-4">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </AdminProtectedRoute>
      )}
    </AdminAuthProvider>
  );
}