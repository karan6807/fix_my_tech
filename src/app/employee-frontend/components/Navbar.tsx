/* eslint-disable react/no-unescaped-entities */

// src/app/employee/components/Navbar.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext';

// Type for all icons
type IconProps = { className?: string };

// Custom SVG Icons
const MenuIcon = ({ className = 'w-6 h-6' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

const WrenchIcon = ({ className = 'w-8 h-8 text-orange-600' }: IconProps) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20 18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"/>
    <path d="M12 8.5c-1.4 0-2.5 1.1-2.5 2.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5-1.1-2.5-2.5-2.5zm0 3.5c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"/>
    <path d="M8 9h1v1H8zM15 9h1v1h-1zM8 12h1v1H8zM15 12h1v1h-1z"/>
  </svg>
);

const BellIcon = ({ className = 'w-6 h-6' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
);

const SearchIcon = ({ className = 'w-5 h-5 text-black' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
);

const UserIcon = ({ className = 'w-6 h-6' }: IconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
    </svg>
);

const SettingsIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
);

const LogoutIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 01-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
    </svg>
);

const ChevronDownIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
);

const ClockIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const CalendarIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);



const StarIcon = ({ className = 'w-4 h-4' }: IconProps) => (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

interface NavbarProps {
    onToggleSidebar: () => void;
}

export default function EmployeeNavbar({ onToggleSidebar }: NavbarProps) {
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
    const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const router = useRouter();
    const { employee, signOut } = useEmployeeAuth();

    // Demo employee data
    const demoEmployee = {
        name: `${employee?.firstName || 'John'} ${employee?.lastName || 'Smith'}`,
        email: employee?.email || "john.smith@techservice.com",
        id: employee?.id || "EMP001",
        specialization: employee?.position || "Mobile & Laptop Repair",
        rating: 4.8,
        status: "active", // active, on_break, offline
        todayTasks: 5,
        completedToday: 2
    };

    const handleLogout = async () => {
        await signOut();
    };

    const fetchNotifications = async () => {
        try {
            const engineerId = employee?.id || 'engineer-id';
            const response = await fetch(`/api/notifications?userId=${engineerId}&userType=engineer&unreadOnly=true`);
            const data = await response.json();
            if (data.success) {
                setNotifications(data.notifications);
                setNotificationCount(data.notifications.length);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const markAsRead = async (notificationIds?: string[]) => {
        try {
            const engineerId = employee?.id || 'engineer-id';
            await fetch('/api/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    notificationIds, 
                    userId: engineerId, 
                    userType: 'engineer' 
                })
            });
            fetchNotifications();
        } catch (error) {
            console.error('Error marking notifications as read:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, [employee?.id, fetchNotifications]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'on_break':
                return 'bg-yellow-100 text-yellow-800';
            case 'offline':
                return 'bg-gray-100 text-gray-800';
            default:
                return 'bg-orange-100 text-orange-800';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'active':
                return 'Active';
            case 'on_break':
                return 'On Break';
            case 'offline':
                return 'Offline';
            default:
                return 'Active';
        }
    };

    return (
        <nav className="w-full bg-white shadow-sm border-b border-gray-200 fixed top-0 z-40">
            <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center min-w-0">
                        <button
                            onClick={onToggleSidebar}
                            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 mr-3 flex-shrink-0"
                        >
                            <MenuIcon />
                        </button>

                        <div className="flex items-center min-w-0">
                            <WrenchIcon />
                            <div className="flex items-center ml-3 min-w-0">
                                <span className="text-base sm:text-lg md:text-xl font-bold text-gray-900 whitespace-nowrap overflow-hidden">
                                    <span className="inline sm:hidden">TS</span>
                                    <span className="hidden sm:inline">TechService</span>
                                </span>
                                <span className="ml-2 px-2 py-1 text-xs font-medium bg-orange-100 text-orange-800 rounded-full flex-shrink-0">
                                    Employee
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Center search */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-4 lg:mx-8">
                        <div className="relative w-full">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                placeholder="Search tasks, customers..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                            />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
                        {/* Notifications */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
                                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <BellIcon />
                                {notificationCount > 0 && (
                                    <span className="absolute -top-0 -right-0 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {notificationCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200 max-h-96 overflow-y-auto">
                                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                        <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                                        {notificationCount > 0 && (
                                            <button 
                                                onClick={() => markAsRead()}
                                                className="text-xs text-orange-600 hover:text-orange-700"
                                            >
                                                Mark all read
                                            </button>
                                        )}
                                    </div>
                                    
                                    {notifications.length > 0 ? (
                                        notifications.map((notification: { id: string; title: string; message: string; created_at: string }) => (
                                            <div key={notification.id} className="px-4 py-3 hover:bg-gray-50 border-b border-gray-50 last:border-b-0">
                                                <div className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-gray-900">{notification.title}</p>
                                                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {new Date(notification.created_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="px-4 py-8 text-center">
                                            <BellIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-500">No new notifications</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                className="flex items-center space-x-2 sm:space-x-3 p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 min-w-0"
                            >
                                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <UserIcon className="w-5 h-5 text-orange-600" />
                                </div>
                                <div className="hidden sm:block text-left min-w-0">
                                    <div className="text-sm font-medium text-gray-900 truncate">{demoEmployee.name}</div>
                                    <div className="text-xs text-gray-500 truncate">{demoEmployee.email}</div>
                                </div>
                                <ChevronDownIcon />
                            </button>

                            {isProfileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg py-2 z-50 border border-gray-200">
                                    {/* Profile Header */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                                <UserIcon className="w-6 h-6 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium text-gray-900 truncate">{demoEmployee.name}</div>
                                                <div className="text-xs text-gray-500 truncate">{demoEmployee.email}</div>
                                                <div className="text-xs text-gray-500 truncate">ID: {demoEmployee.id}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center justify-between">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(demoEmployee.status)}`}>
                                                {getStatusText(demoEmployee.status)}
                                            </span>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <StarIcon className="w-3 h-3 mr-1 text-yellow-500" />
                                                {demoEmployee.rating} rating
                                            </div>
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="px-4 py-3 border-b border-gray-100">
                                        <div className="text-xs font-medium text-gray-700 mb-2">Today's Progress</div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-orange-600">{demoEmployee.todayTasks}</div>
                                                <div className="text-xs text-gray-500">Total Tasks</div>
                                            </div>
                                            <div className="text-center">
                                                <div className="text-lg font-bold text-green-600">{demoEmployee.completedToday}</div>
                                                <div className="text-xs text-gray-500">Completed</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Specialization */}
                                    <div className="px-4 py-2 border-b border-gray-100">
                                        <div className="text-xs text-gray-500">Specialization</div>
                                        <div className="text-sm font-medium text-gray-900">{demoEmployee.specialization}</div>
                                    </div>

                                    {/* Menu Items */}
                                    <div className="py-2">
                                        <button
                                            onClick={() => {
                                                router.push('/employee/profile');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <UserIcon className="w-4 h-4 mr-3" />
                                            View Profile
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/employee/schedule');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <CalendarIcon className="w-4 h-4 mr-3" />
                                            My Schedule
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/employee/timesheet');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ClockIcon className="w-4 h-4 mr-3" />
                                            Timesheet
                                        </button>
                                        <button
                                            onClick={() => {
                                                router.push('/employee/settings');
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <SettingsIcon className="w-4 h-4 mr-3" />
                                            Settings
                                        </button>
                                    </div>

                                    {/* Logout */}
                                    <div className="border-t border-gray-100 pt-2">
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsProfileDropdownOpen(false);
                                            }}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <LogoutIcon className="w-4 h-4 mr-3" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Mobile search */}
                <div className="lg:hidden pb-3">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                        <input
                            type="text"
                            placeholder="Search tasks, customers..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                        />
                    </div>
                </div>
            </div>
        </nav>
    );
}