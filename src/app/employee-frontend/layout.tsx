'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { EmployeeAuthProvider } from '@/contexts/EmployeeAuthContext';
import EmployeeProtectedRoute from '@/components/EmployeeProtectedRoute';
import EmployeeNavbar from './components/Navbar';
import EmployeeSidebar from './components/Sidebar';

function EmployeeLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();
  
  // Check if current page is an auth page
  const isAuthPage = pathname?.includes('/auth/');

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsMobileSidebarOpen(!isMobileSidebarOpen);
    } else {
      setIsSidebarCollapsed(!isSidebarCollapsed);
    }
  };

  // For auth pages, just render children without layout
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <EmployeeProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Navbar */}
        <EmployeeNavbar onToggleSidebar={toggleSidebar} />
        
        <div className="flex h-screen pt-16 lg:pt-16">
          {/* Sidebar */}
          <div className={`fixed inset-y-0 left-0 z-30 pt-28 lg:pt-0 transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } ${isSidebarCollapsed ? 'lg:w-16' : 'lg:w-64'}`}>
            <EmployeeSidebar 
              isCollapsed={isSidebarCollapsed} 
              onToggle={toggleSidebar} 
            />
          </div>

          {/* Mobile overlay */}
          {isMobileSidebarOpen && (
            <div 
              className="fixed inset-0 z-20 bg-opacity-50 lg:hidden" 
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Main content */}
          <div className="flex-1 overflow-auto">
            <main className="p-4 lg:p-6 pt-4 lg:pt-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </EmployeeProtectedRoute>
  );
}

export default function EmployeeFrontendLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EmployeeAuthProvider>
      <EmployeeLayoutContent>
        {children}
      </EmployeeLayoutContent>
    </EmployeeAuthProvider>
  );
}