'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, CheckCircle2, AlertCircle, PlayCircle, XCircle, TrendingUp, Eye, ArrowRight, Smartphone, Laptop, Monitor, BarChart3, X } from 'lucide-react';

interface RepairBooking {
    id: number;
    name: string;
    email: string;
    mobile: string;
    serviceType: string;
    deviceType: string;
    description: string;
    status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    assignedTo?: string;
    estimatedTime?: string;
}

type StatusType = 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled';
type PriorityType = 'high' | 'medium' | 'low';

export default function Dashboard() {
    const [bookings, setBookings] = useState<RepairBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchAssignedTasks = async () => {
        try {
            console.log('=== FETCHING EMPLOYEE TASKS ===');
            setLoading(true);
            const response = await fetch('/api/employee/tasks');
            console.log('Response status:', response.status);
            
            const data = await response.json();
            console.log('API Response:', data);

            if (data.success) {
                console.log('Tasks received:', data.tasks.length);
                // Transform API data to match component interface
                const transformedTasks = data.tasks.map((task: any) => ({
                    id: parseInt(task.id.slice(-8), 16), // Convert UUID to number for display
                    name: task.customerName,
                    email: task.email,
                    mobile: task.phone,
                    serviceType: task.serviceType,
                    deviceType: task.device,
                    description: task.issue,
                    status: task.status === 'confirmed' ? 'confirmed' : 
                           task.status === 'in_progress' ? 'in-progress' : 
                           task.status === 'completed' ? 'completed' : 
                           task.status === 'cancelled' ? 'cancelled' : 'pending',
                    priority: 'medium' as PriorityType,
                    createdAt: task.createdAt,
                    assignedTo: task.assignedEngineer || 'You',
                    estimatedTime: '2-3 hours'
                }));
                console.log('Transformed tasks:', transformedTasks);
                setBookings(transformedTasks);
            } else {
                console.error('API Error:', data.error);
                setError(data.error || 'Failed to fetch assigned tasks');
            }
            console.log('=== END FETCH ===');
        } catch (err) {
            console.error('Network error:', err);
            setError('Network error while fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedTasks();
    }, []);

    // Mock data as fallback
    const mockBookings: RepairBooking[] = [
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@email.com",
            mobile: "9876543210",
            serviceType: "Smartphone Repair",
            deviceType: "iPhone 14 Pro",
            description: "Screen cracked, touch not responding",
            status: "pending",
            priority: "high",
            createdAt: "2025-08-12T09:30:00",
            estimatedTime: "2-3 hours"
        },
        {
            id: 2,
            name: "Sarah Wilson",
            email: "sarah.w@email.com",
            mobile: "8765432109",
            serviceType: "Laptop Repair",
            deviceType: "MacBook Pro",
            description: "Battery drains quickly, unexpected shutdowns",
            status: "confirmed",
            priority: "medium",
            createdAt: "2025-08-11T14:15:00",
            assignedTo: "Tech Team A",
            estimatedTime: "3-4 hours"
        },
        {
            id: 3,
            name: "Mike Johnson",
            email: "mike.johnson@email.com",
            mobile: "7654321098",
            serviceType: "Desktop Repair",
            deviceType: "Custom PC",
            description: "Won't boot, blue screen errors",
            status: "in-progress",
            priority: "high",
            createdAt: "2025-08-10T11:20:00",
            assignedTo: "Tech Team B",
            estimatedTime: "4-5 hours"
        },
        {
            id: 4,
            name: "Emma Davis",
            email: "emma.davis@email.com",
            mobile: "6543210987",
            serviceType: "Tablet Repair",
            deviceType: "iPad Air",
            description: "Charging port loose, sometimes won't charge",
            status: "completed",
            priority: "low",
            createdAt: "2025-08-09T16:45:00",
            assignedTo: "Tech Team A",
            estimatedTime: "1-2 hours"
        },
        {
            id: 5,
            name: "Alex Brown",
            email: "alex.brown@email.com",
            mobile: "5432109876",
            serviceType: "Gaming Console Repair",
            deviceType: "PlayStation 5",
            description: "Console overheats during gaming",
            status: "cancelled",
            priority: "medium",
            createdAt: "2025-08-08T12:30:00"
        },
        {
            id: 6,
            name: "Lisa Kumar",
            email: "lisa.kumar@email.com",
            mobile: "4321098765",
            serviceType: "Smartphone Repair",
            deviceType: "Samsung S23",
            description: "Camera not working properly",
            status: "pending",
            priority: "medium",
            createdAt: "2025-08-13T08:15:00",
            estimatedTime: "1-2 hours"
        },
        {
            id: 7,
            name: "David Chen",
            email: "david.chen@email.com",
            mobile: "3210987654",
            serviceType: "Laptop Repair",
            deviceType: "Dell XPS 13",
            description: "Keyboard keys not working",
            status: "confirmed",
            priority: "low",
            createdAt: "2025-08-12T15:30:00",
            assignedTo: "Tech Team A",
            estimatedTime: "2-3 hours"
        }
    ];

    // Always use real data from API
    const displayBookings = bookings;

    const [selectedBookingId, setSelectedBookingId] = useState<number | null>(null);

    // Derive the selected booking from the ID
    const selectedBooking = selectedBookingId ? displayBookings.find(booking => booking.id === selectedBookingId) : null;

    const statusColors: Record<StatusType, string> = {
        pending: "bg-orange-100 text-orange-700",
        confirmed: "bg-blue-100 text-blue-700",
        "in-progress": "bg-yellow-100 text-yellow-700",
        completed: "bg-green-100 text-green-700",
        cancelled: "bg-red-100 text-red-700"
    };

    const statusIcons: Record<StatusType, React.ReactElement> = {
        pending: <Clock className="w-3 h-3" />,
        confirmed: <AlertCircle className="w-3 h-3" />,
        "in-progress": <PlayCircle className="w-3 h-3" />,
        completed: <CheckCircle2 className="w-3 h-3" />,
        cancelled: <XCircle className="w-3 h-3" />
    };

    const getDeviceIcon = (serviceType: string) => {
        if (serviceType.toLowerCase().includes('smartphone')) return <Smartphone className="w-4 h-4 text-gray-600" />;
        if (serviceType.toLowerCase().includes('laptop')) return <Laptop className="w-4 h-4 text-gray-600" />;
        if (serviceType.toLowerCase().includes('desktop')) return <Monitor className="w-4 h-4 text-gray-600" />;
        return <Wrench className="w-4 h-4 text-gray-600" />;
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getBookingStats = () => {
        const stats = {
            total: displayBookings.length,
            pending: displayBookings.filter(b => b.status === "pending").length,
            confirmed: displayBookings.filter(b => b.status === "confirmed").length,
            inProgress: displayBookings.filter(b => b.status === "in-progress").length,
            completed: displayBookings.filter(b => b.status === "completed").length,
            cancelled: displayBookings.filter(b => b.status === "cancelled").length
        };
        return stats;
    };

    const getRecentBookings = () => {
        return displayBookings
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 8);
    };

    const getAssignedBookings = () => {
        return displayBookings.filter(booking => booking.status !== 'completed' && booking.status !== 'cancelled');
    };

    const stats = getBookingStats();
    const recentBookings = getRecentBookings();
    const assignedBookings = getAssignedBookings();

    return (
        <div className="p-4 lg:p-6 pt-8 lg:pt-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-1">Overview of your assigned repair tasks</p>
                {error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                        </div>
                        <div className="p-2 bg-gray-100 rounded-lg">
                            <Wrench className="w-5 h-5 text-gray-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">+12%</span>
                        <span className="text-xs text-gray-500 ml-1">vs last week</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Pending</p>
                            <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                        </div>
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Clock className="w-5 h-5 text-orange-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Needs attention</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Confirmed</p>
                            <p className="text-2xl font-bold text-blue-600">{stats.confirmed}</p>
                        </div>
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Ready to start</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                        </div>
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <PlayCircle className="w-5 h-5 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Currently working</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2 flex items-center">
                        <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                        <span className="text-xs text-green-600 font-medium">+8%</span>
                        <span className="text-xs text-gray-500 ml-1">this week</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        </div>
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="text-xs text-gray-500">Need follow up</span>
                    </div>
                </div>
            </div>

            {/* Assigned Tasks Table - Full Width */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">Assigned Tasks</h2>
                        <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-600">Manage All Requests →</span>
                            <button className="text-orange-600 hover:text-orange-700 font-medium hover:underline">
                                My Tasks
                            </button>
                        </div>
                    </div>
                </div>
                
                {loading ? (
                    <div className="p-8 text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-3"></div>
                        <p className="text-gray-600">Loading assigned tasks...</p>
                    </div>
                ) : assignedBookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">Customer</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">Service & Device</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">Issue</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">Date</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600 text-sm uppercase tracking-wide">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {assignedBookings.map((booking) => (
                                    <tr key={booking.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-4 px-4">
                                            <div>
                                                <div className="font-medium text-gray-900 text-sm">{booking.name}</div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                    <Mail className="w-3 h-3" />
                                                    {booking.email}
                                                </div>
                                                <div className="text-xs text-gray-500 flex items-center gap-1">
                                                    <Phone className="w-3 h-3" />
                                                    {booking.mobile}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-2">
                                                {getDeviceIcon(booking.serviceType)}
                                                <div>
                                                    <div className="font-medium text-gray-900 text-sm">{booking.serviceType}</div>
                                                    <div className="text-gray-600 text-xs">{booking.deviceType}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-900 max-w-64 truncate" title={booking.description}>
                                                {booking.description}
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="text-sm text-gray-900">{formatDate(booking.createdAt)}</div>
                                            <div className="text-xs text-gray-500">{formatTime(booking.createdAt)}</div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <button 
                                                onClick={() => setSelectedBookingId(booking.id)}
                                                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <Wrench className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-gray-600 font-medium">No assigned tasks</h3>
                        <p className="text-gray-500 text-sm">Tasks will appear here when assigned to teams</p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div className="flex items-center gap-3">
                                {getDeviceIcon(selectedBooking.serviceType)}
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900">Booking #{selectedBooking.id}</h2>
                                    <p className="text-sm text-gray-600">{selectedBooking.serviceType}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setSelectedBookingId(null)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-500" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-6">
                            {/* Customer Information */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Customer Information</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="flex items-center gap-3">
                                        <User className="w-4 h-4 text-gray-500" />
                                        <span className="font-medium text-gray-900">{selectedBooking.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-700">{selectedBooking.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-gray-500" />
                                        <span className="text-gray-700">{selectedBooking.mobile}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Device & Service Details */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Device & Service Details</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Service Type:</span>
                                            <p className="text-gray-900">{selectedBooking.serviceType}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Device:</span>
                                            <p className="text-gray-900">{selectedBooking.deviceType}</p>
                                        </div>
                                    </div>
                                    {selectedBooking.estimatedTime && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Estimated Time:</span>
                                            <p className="text-gray-900">{selectedBooking.estimatedTime}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Issue Description */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Issue Description</h3>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <p className="text-gray-700 leading-relaxed">{selectedBooking.description}</p>
                                </div>
                            </div>

                            {/* Booking Details */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 mb-3">Booking Details</h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-3">

                                    <div>
                                        <span className="text-sm font-medium text-gray-600">Created:</span>
                                        <p className="text-gray-900 flex items-center gap-2 mt-1">
                                            <Calendar className="w-4 h-4 text-gray-500" />
                                            {formatDate(selectedBooking.createdAt)} at {formatTime(selectedBooking.createdAt)}
                                        </p>
                                    </div>
                                    {selectedBooking.assignedTo && (
                                        <div>
                                            <span className="text-sm font-medium text-gray-600">Assigned To:</span>
                                            <p className="text-gray-900 flex items-center gap-2 mt-1">
                                                <User className="w-4 h-4 text-gray-500" />
                                                {selectedBooking.assignedTo}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
                            <button
                                onClick={() => setSelectedBookingId(null)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                            >
                                Close
                            </button>
                            <button className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium">
                                View in My Tasks
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}