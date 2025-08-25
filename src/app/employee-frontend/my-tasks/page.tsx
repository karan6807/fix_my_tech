'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, MapPin, Wrench, CheckCircle2, AlertCircle, PlayCircle, XCircle, Eye, Search, Filter, Download, MoreVertical, Smartphone, Laptop, Monitor, X, PauseCircle } from 'lucide-react';

// Component to display proof images for completed tasks
function CompletedTaskImages({ bookingId }: { bookingId: string }) {
    const [proofImages, setProofImages] = useState<any[]>([]);
    const [loadingImages, setLoadingImages] = useState(false);
    const [showImageModal, setShowImageModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        const fetchProofImages = async () => {
            try {
                setLoadingImages(true);
                const response = await fetch(`/api/admin/repair-proof-images?bookingId=${bookingId}`);
                const data = await response.json();
                
                if (data.success) {
                    setProofImages(data.images);
                }
            } catch (error) {
                console.error('Error fetching proof images:', error);
            } finally {
                setLoadingImages(false);
            }
        };

        fetchProofImages();
    }, [bookingId]);

    if (loadingImages) {
        return (
            <div className="mt-2">
                <span className="text-sm font-medium text-green-800">Work proof images:</span>
                <div className="mt-1 p-3 bg-white rounded border flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                    <span className="text-green-700 text-sm">Loading images...</span>
                </div>
            </div>
        );
    }

    if (proofImages.length === 0) {
        return null;
    }

    return (
        <>
            <div>
                <span className="text-sm font-medium text-green-800">Work proof images:</span>
                <div className="mt-1 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {proofImages.map((image) => (
                        <div key={image.id} className="relative group">
                            <img
                                src={image.imageUrl}
                                alt={image.fileName}
                                className="w-full h-54 object-cover rounded-lg border-2 border-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                onClick={() => {
                                    setSelectedImage(image.imageUrl);
                                    setShowImageModal(true);
                                }}
                            />
                            <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-20 transition-all rounded-lg flex items-center justify-center">
                                <Eye className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <div className="absolute bottom-1 left-1 right-1">
                                <div className="bg-opacity-60 text-white text-xs px-2 py-1 rounded truncate">
                                    {image.fileName}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Image Modal */}
            {showImageModal && selectedImage && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
                    <div className="relative max-w-4xl max-h-full">
                        <img
                            src={selectedImage}
                            alt="Proof image"
                            className="max-w-full max-h-full object-contain rounded-lg"
                        />
                        <button
                            onClick={() => setShowImageModal(false)}
                            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}

interface RepairBooking {
    id: string;
    displayId?: number;
    name: string;
    email: string;
    mobile: string;
    address: string;
    serviceType: string;
    deviceType: string;
    modelNumber?: string;
    description: string;
    status: 'Assigned' | 'Accepted' | 'in-progress' | 'completed' | 'cancelled' | 'hold_on_work' | 'unable_to_complete';
    priority: 'high' | 'medium' | 'low';
    createdAt: string;
    assignedTo?: string;
    estimatedTime?: string;
    notes?: string;
    holdReason?: string;
    unableReason?: string;
    completionReport?: {
        workPerformed: string;
        partsUsed?: string;
        paymentAmount?: number;
        completedAt: string;
    };
}

type StatusType = 'Assigned' | 'Accepted' | 'in-progress' | 'completed' | 'cancelled' | 'hold_on_work' | 'unable_to_complete';
type PriorityType = 'high' | 'medium' | 'low';

export default function Dashboard() {
    const [bookings, setBookings] = useState<RepairBooking[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCompletionModal, setShowCompletionModal] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState<RepairBooking | null>(null);
    const [completionForm, setCompletionForm] = useState({
        problem: '',
        solution: '',
        partsUsed: '',
        proofImages: [] as File[]
    });
    const [submittingCompletion, setSubmittingCompletion] = useState(false);
    const [showHoldModal, setShowHoldModal] = useState(false);
    const [holdReason, setHoldReason] = useState('');
    const [submittingHold, setSubmittingHold] = useState(false);
    const [showUnableModal, setShowUnableModal] = useState(false);
    const [unableReason, setUnableReason] = useState('');
    const [submittingUnable, setSubmittingUnable] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    
    // Payment form states
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentForm, setPaymentForm] = useState({
        paymentMethod: 'cash' as 'cash' | 'upi',
        amount: '',
        upiTransactionId: ''
    });
    const [submittingPayment, setSubmittingPayment] = useState(false);

    const fetchAssignedTasks = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/employee/tasks');
            const data = await response.json();

            if (data.success) {
                const transformedTasks = data.tasks.map((task: any) => ({
                    id: task.id,
                    displayId: parseInt(task.id.slice(-8), 16),
                    name: task.customerName,
                    email: task.email,
                    mobile: task.phone,
                    address: task.address,
                    serviceType: task.serviceType,
                    deviceType: task.device,
                    modelNumber: task.device.split(' - ')[1] || 'Not specified',
                    description: task.issue,
                    status: task.status === 'assigned' ? 'Assigned' :
                        task.status === 'accepted' ? 'Accepted' :
                            task.status === 'in_progress' ? 'in-progress' :
                                task.status === 'completed' ? 'completed' :
                                    task.status === 'cancelled' ? 'cancelled' :
                                        task.status === 'hold_on_work' ? 'hold_on_work' :
                                            task.status === 'unable_to_complete' ? 'unable_to_complete' : 'Assigned',
                    priority: 'medium' as PriorityType,
                    createdAt: task.createdAt,
                    assignedTo: task.assignedEngineer,
                    holdReason: task.holdReason,
                    unableReason: task.unableReason,
                    completionReport: task.completionReport ? {
                        workPerformed: task.completionReport.workPerformed,
                        partsUsed: task.completionReport.partsUsed,
                        paymentAmount: task.completionReport.paymentAmount,
                        completedAt: task.completionReport.completedAt
                    } : undefined
                }));
                setBookings(transformedTasks);
            } else {
                setError(data.error || 'Failed to fetch assigned tasks');
            }
        } catch (err) {
            setError('Network error while fetching tasks');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignedTasks();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchAssignedTasks();
        setIsRefreshing(false);
    };

    const displayBookings = bookings.length > 0 ? bookings : [];
    const [filterStatus, setFilterStatus] = useState<string>("all");
    const [searchTerm, setSearchTerm] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    const statusColors: Record<StatusType, string> = {
        Assigned: "bg-orange-100 text-orange-800 border-orange-200",
        Accepted: "bg-blue-100 text-blue-800 border-blue-200",
        "in-progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
        completed: "bg-green-100 text-green-800 border-green-200",
        cancelled: "bg-red-100 text-red-800 border-red-200",
        hold_on_work: "bg-yellow-100 text-yellow-800 border-yellow-200",
        unable_to_complete: "bg-red-100 text-red-800 border-red-200"
    };

    const statusIcons: Record<StatusType, React.ReactElement> = {
        Assigned: <Clock className="w-4 h-4" />,
        Accepted: <AlertCircle className="w-4 h-4" />,
        "in-progress": <PlayCircle className="w-4 h-4" />,
        completed: <CheckCircle2 className="w-4 h-4" />,
        cancelled: <XCircle className="w-4 h-4" />,
        hold_on_work: <Clock className="w-4 h-4" />,
        unable_to_complete: <XCircle className="w-4 h-4" />
    };

    const getDeviceIcon = (serviceType: string) => {
        if (serviceType.toLowerCase().includes('smartphone')) return <Smartphone className="w-5 h-5" />;
        if (serviceType.toLowerCase().includes('laptop')) return <Laptop className="w-5 h-5" />;
        if (serviceType.toLowerCase().includes('desktop')) return <Monitor className="w-5 h-5" />;
        return <Wrench className="w-5 h-5" />;
    };

    const handleCompletionSubmit = async () => {
        if (!selectedBooking || !completionForm.problem.trim() || !completionForm.solution.trim() || completionForm.proofImages.length === 0) {
            setError('Problem, solution, and proof images are required');
            return;
        }

        try {
            setSubmittingCompletion(true);
            const engineerId = 'c05612ac-a0b5-4c36-ac5c-04f04d700477';

            // Create FormData for file upload
            const formData = new FormData();
            formData.append('bookingId', selectedBooking.id);
            formData.append('engineerId', engineerId);
            formData.append('workPerformed', `Problem: ${completionForm.problem}\n\nSolution: ${completionForm.solution}`);
            formData.append('partsUsed', completionForm.partsUsed || '');
            formData.append('timeSpent', '');
            formData.append('completionNotes', '');
            formData.append('customerInstructions', '');
            
            // Add images to FormData
            completionForm.proofImages.forEach((file, index) => {
                formData.append(`proofImage_${index}`, file);
            });

            const response = await fetch('/api/employee/save-completion-report', {
                method: 'POST',
                body: formData, // Send FormData instead of JSON
            });

            const data = await response.json();

            if (data.success) {
                // Close completion modal and open payment modal
                setShowCompletionModal(false);
                setShowPaymentModal(true);
                
                // Reset completion form
                setCompletionForm({
                    problem: '',
                    solution: '',
                    partsUsed: '',
                    proofImages: []
                });
                
                setToast({ message: 'Work completion saved! Now record payment to complete.', type: 'success' });
                setTimeout(() => setToast(null), 3000);
            } else {
                setError(data.error || 'Failed to complete repair');
            }
        } catch (err) {
            setError('Network error while completing repair');
        } finally {
            setSubmittingCompletion(false);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!selectedBooking || !paymentForm.amount.trim()) {
            setError('Payment amount is required');
            return;
        }

        if (paymentForm.paymentMethod === 'upi' && !paymentForm.upiTransactionId.trim()) {
            setError('UPI Transaction ID is required for UPI payments');
            return;
        }

        try {
            setSubmittingPayment(true);
            
            const response = await fetch('/api/employee/record-payment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: selectedBooking.id,
                    paymentMethod: paymentForm.paymentMethod,
                    amount: parseFloat(paymentForm.amount),
                    upiTransactionId: paymentForm.upiTransactionId || null,
                    completeTask: true // Flag to complete task and send emails
                }),
            });

            const data = await response.json();

            if (data.success) {
                // Update booking status to completed
                setBookings(prev => prev.map(b =>
                    b.id === selectedBooking.id ? { ...b, status: 'completed' } : b
                ));

                // Reset forms and close modals
                setPaymentForm({
                    paymentMethod: 'cash',
                    amount: '',
                    upiTransactionId: ''
                });
                setShowPaymentModal(false);
                setSelectedBooking(null);
                
                const engineerEarning = (parseFloat(paymentForm.amount) * 0.30).toFixed(2);
                const companyEarning = (parseFloat(paymentForm.amount) * 0.70).toFixed(2);
                setToast({ 
                  message: `Payment recorded! Engineer earns ₹${engineerEarning} (30%), Company earns ₹${companyEarning} (70%)`, 
                  type: 'success' 
                });
                setTimeout(() => setToast(null), 3000);
            } else {
                setError(data.error || 'Failed to record payment');
            }
        } catch (err) {
            setError('Network error while recording payment');
        } finally {
            setSubmittingPayment(false);
        }
    };

    const handleHoldSubmit = async () => {
        if (!selectedBooking || !holdReason.trim()) {
            setError('Hold reason is required');
            return;
        }

        try {
            setSubmittingHold(true);

            const response = await fetch('/api/employee/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: selectedBooking.id,
                    newStatus: 'hold_on_work',
                    holdReason: holdReason.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                setBookings(prev => prev.map(b =>
                    b.id === selectedBooking.id ? { ...b, status: 'hold_on_work' as StatusType } : b
                ));

                setHoldReason('');
                setShowHoldModal(false);
                setSelectedBooking(null);
                
                setToast({ message: 'Work put on hold successfully!', type: 'success' });
                setTimeout(() => setToast(null), 3000);
            } else {
                setError(data.error || 'Failed to put work on hold');
            }
        } catch (err) {
            setError('Network error while updating status');
        } finally {
            setSubmittingHold(false);
        }
    };

    const handleUnableSubmit = async () => {
        if (!selectedBooking || !unableReason.trim()) {
            setError('Unable to complete reason is required');
            return;
        }

        try {
            setSubmittingUnable(true);

            const response = await fetch('/api/employee/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: selectedBooking.id,
                    newStatus: 'unable_to_complete',
                    unableReason: unableReason.trim()
                }),
            });

            const data = await response.json();

            if (data.success) {
                setBookings(prev => prev.map(b =>
                    b.id === selectedBooking.id ? { ...b, status: 'unable_to_complete' as StatusType } : b
                ));

                setUnableReason('');
                setShowUnableModal(false);
                setSelectedBooking(null);
                
                setToast({ message: 'Task marked as unable to complete successfully!', type: 'success' });
                setTimeout(() => setToast(null), 3000);
            } else {
                setError(data.error || 'Failed to mark as unable to complete');
            }
        } catch (err) {
            setError('Network error while updating status');
        } finally {
            setSubmittingUnable(false);
        }
    };

    const updateBookingStatus = async (bookingId: string, newStatus: StatusType) => {
        try {
            const booking = bookings.find(b => b.id === bookingId);
            if (!booking) {
                setError('Booking not found');
                return;
            }

            const dbStatus = newStatus === 'Assigned' ? 'assigned' :
                newStatus === 'Accepted' ? 'accepted' :
                    newStatus === 'in-progress' ? 'in_progress' :
                        newStatus === 'completed' ? 'completed' :
                            newStatus === 'cancelled' ? 'rejected' :
                                newStatus === 'hold_on_work' ? 'hold_on_work' :
                                    newStatus === 'unable_to_complete' ? 'unable_to_complete' : newStatus;

            setBookings(prev => prev.map(b =>
                b.id === bookingId ? { ...b, status: newStatus } : b
            ));

            const response = await fetch('/api/employee/update-status', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    bookingId: bookingId,
                    newStatus: dbStatus
                }),
            });

            const data = await response.json();

            if (!data.success) {
                setBookings(prev => prev.map(b =>
                    b.id === bookingId ? { ...b, status: booking.status } : b
                ));
                setError(data.error || 'Failed to update status');
            } else {
                const actionMessages = {
                    'Accepted': 'Task accepted successfully!',
                    'cancelled': 'Task rejected successfully!',
                    'in-progress': 'Work started successfully!'
                };
                const message = actionMessages[newStatus as keyof typeof actionMessages] || 'Status updated successfully!';
                setToast({ message, type: 'success' });
                setTimeout(() => setToast(null), 3000);
            }
        } catch (err) {
            const originalBooking = bookings.find(b => b.id === bookingId);
            if (originalBooking) {
                setBookings(prev => prev.map(b =>
                    b.id === bookingId ? { ...b, status: originalBooking.status } : b
                ));
            }
            setError('Network error while updating status');
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredBookings = displayBookings.filter(booking => {
        const matchesStatus = filterStatus === "all" || booking.status === filterStatus;
        const matchesSearch = searchTerm === "" ||
            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.deviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesStatus && matchesSearch;
    });

    const getBookingStats = () => {
        const stats = {
            total: displayBookings.length,
            Assigned: displayBookings.filter(b => b.status === "Assigned").length,
            Accepted: displayBookings.filter(b => b.status === "Accepted").length,
            inProgress: displayBookings.filter(b => b.status === "in-progress").length,
            completed: displayBookings.filter(b => b.status === "completed").length,
            cancelled: displayBookings.filter(b => b.status === "cancelled").length,
            holdOnWork: displayBookings.filter(b => b.status === "hold_on_work").length,
            unableToComplete: displayBookings.filter(b => b.status === "unable_to_complete").length
        };
        return stats;
    };

    const stats = getBookingStats();

    return (
        <div className="p-4 lg:p-6 pt-8 lg:pt-10 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Assigned Tasks</h1>
                <p className="text-gray-600 mt-1">Manage and track your assigned repair tasks</p>
                {error && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 text-sm">{error}</p>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-3 lg:gap-4 mb-6">
                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-gray-600">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Total</p>
                            <p className="text-xl lg:text-2xl font-bold text-gray-700">{stats.total}</p>
                        </div>
                        <Wrench className="w-5 lg:w-6 h-5 lg:h-6 text-gray-600" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-orange-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Assigned</p>
                            <p className="text-xl lg:text-2xl font-bold text-orange-600">{stats.Assigned}</p>
                        </div>
                        <Clock className="w-5 lg:w-6 h-5 lg:h-6 text-orange-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-blue-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Accepted</p>
                            <p className="text-xl lg:text-2xl font-bold text-blue-600">{stats.Accepted}</p>
                        </div>
                        <AlertCircle className="w-5 lg:w-6 h-5 lg:h-6 text-blue-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-yellow-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">In Progress</p>
                            <p className="text-xl lg:text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
                        </div>
                        <PlayCircle className="w-5 lg:w-6 h-5 lg:h-6 text-yellow-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-green-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Completed</p>
                            <p className="text-xl lg:text-2xl font-bold text-green-600">{stats.completed}</p>
                        </div>
                        <CheckCircle2 className="w-5 lg:w-6 h-5 lg:h-6 text-green-500" />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-3 lg:p-4 border-l-4 border-red-500">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs lg:text-sm font-medium text-gray-600">Cancelled</p>
                            <p className="text-xl lg:text-2xl font-bold text-red-600">{stats.cancelled}</p>
                        </div>
                        <XCircle className="w-5 lg:w-6 h-5 lg:h-6 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-lg shadow mb-6 p-4">
                <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2 w-full lg:w-auto">
                        <button
                            onClick={handleRefresh}
                            disabled={isRefreshing}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`}>
                                {isRefreshing ? (
                                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                    </svg>
                                )}
                            </div>
                            <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                        >
                            <Filter className="w-4 h-4" />
                            <span>Filter</span>
                        </button>
                        <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Export</span>
                        </button>
                    </div>
                </div>

                {/* Filter Tabs */}
                {showFilters && (
                    <div className="border-t border-gray-200 mt-4 pt-4">
                        <div className="flex flex-wrap gap-2">
                            {["all", "Assigned", "Accepted", "in-progress", "completed", "cancelled", "hold_on_work", "unable_to_complete"].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilterStatus(status)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${filterStatus === status
                                        ? "bg-orange-100 text-orange-700 border border-orange-200"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {status === "all" ? "All Bookings" :
                                        status === "hold_on_work" ? "Hold on Work" :
                                            status === "unable_to_complete" ? "Unable to Complete" :
                                                status.replace("-", " ")}
                                    <span className="ml-1 text-xs">
                                        ({status === "all" ? displayBookings.length : displayBookings.filter(b => b.status === status).length})
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Bookings List */}
            <div className="space-y-4">
                {filteredBookings.map((booking) => (
                    <div
                        key={booking.id}
                        className="bg-white rounded-lg shadow border-l-4 border-gray-200 transition-all hover:shadow-md"
                    >
                        <div className="p-4 lg:p-6">
                            {/* Booking Header */}
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4 gap-3">
                                <div className="flex items-center gap-3">
                                    <div className="flex items-center gap-2">
                                        {getDeviceIcon(booking.serviceType)}
                                        <span className="font-semibold text-gray-900">#{booking.displayId || booking.id.slice(-8)}</span>
                                    </div>

                                    <div className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[booking.status]}`}>
                                        <div className="flex items-center gap-1">
                                            {statusIcons[booking.status]}
                                            <span className="capitalize">{booking.status.replace("-", " ")}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(booking.createdAt)}</span>
                                </div>
                            </div>

                            {/* Booking Content */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                                {/* Customer Info */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Customer Details</h3>
                                    <div className="space-y-1 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="w-3 h-3 text-gray-500" />
                                            <span className="text-gray-900">{booking.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="w-3 h-3 text-gray-500" />
                                            <span className="text-gray-600 truncate">{booking.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="w-3 h-3 text-gray-500" />
                                            <span className="text-gray-600">{booking.mobile}</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-gray-600 text-xs">{booking.address}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Service Details */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Service Details</h3>
                                    <div className="space-y-1 text-sm">
                                        <div>
                                            <span className="text-gray-500">Service:</span>
                                            <span className="ml-1 text-gray-900 font-medium">{booking.serviceType}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Device:</span>
                                            <span className="ml-1 text-gray-900">{booking.deviceType}</span>
                                        </div>
                                        {booking.modelNumber && (
                                            <div>
                                                <span className="text-gray-500">Model:</span>
                                                <span className="ml-1 text-gray-900">{booking.modelNumber}</span>
                                            </div>
                                        )}
                                        {booking.assignedTo && (
                                            <div>
                                                <span className="text-gray-500">Assigned:</span>
                                                <span className="ml-1 text-gray-900">{booking.assignedTo}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Issue Description */}
                                <div>
                                    <h3 className="font-medium text-gray-900 mb-2">Issue Description</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{booking.description}</p>
                                </div>
                            </div>

                            {/* Hold Reason for hold_on_work tasks */}
                            {booking.status === 'hold_on_work' && booking.holdReason && (
                                <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                    <h3 className="font-medium text-yellow-900 mb-3 flex items-center">
                                        <PauseCircle className="w-4 h-4 mr-2" />
                                        Work Put On Hold
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-yellow-800">Reason for putting work on hold:</span>
                                            <p className="text-sm text-yellow-700 mt-1 p-3 bg-white rounded border leading-relaxed">{booking.holdReason}</p>
                                        </div>
                                        <div className="text-xs text-yellow-600 mt-2">
                                            Work paused - waiting for admin action to resume
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Unable Reason for unable_to_complete tasks */}
                            {booking.status === 'unable_to_complete' && booking.unableReason && (
                                <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
                                    <h3 className="font-medium text-red-900 mb-3 flex items-center">
                                        <XCircle className="w-4 h-4 mr-2" />
                                        Unable to Complete Repair
                                    </h3>
                                    <div className="space-y-2">
                                        <div>
                                            <span className="text-sm font-medium text-red-800">Reason why repair cannot be completed:</span>
                                            <p className="text-sm text-red-700 mt-1 p-3 bg-white rounded border leading-relaxed">{booking.unableReason}</p>
                                        </div>
                                        <div className="text-xs text-red-600 mt-2">
                                            Task marked as unable to complete - admin will reassign or close
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Completion Report for completed tasks */}
                            {booking.status === 'completed' && booking.completionReport && (
                                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                    <h3 className="font-medium text-green-900 mb-3 flex items-center">
                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                        Work Completed
                                    </h3>
                                    <div className="space-y-2">
                                        {(() => {
                                            const workPerformed = booking.completionReport.workPerformed;
                                            if (!workPerformed) return null;
                                            const problemMatch = workPerformed.match(/Problem: ([^\n]+)/);
                                            const solutionMatch = workPerformed.match(/Solution: ([^\n]+)/);

                                            return (
                                                <>
                                                    {problemMatch && (
                                                        <div>
                                                            <span className="text-sm font-medium text-green-800">What was the problem:</span>
                                                            <p className="text-sm text-green-700 mt-1">{problemMatch[1]}</p>
                                                        </div>
                                                    )}
                                                    {solutionMatch && (
                                                        <div>
                                                            <span className="text-sm font-medium text-green-800">How it was fixed:</span>
                                                            <p className="text-sm text-green-700 mt-1">{solutionMatch[1]}</p>
                                                        </div>
                                                    )}
                                                    {!problemMatch && !solutionMatch && (
                                                        <div>
                                                            <span className="text-sm font-medium text-green-800">What was done:</span>
                                                            <p className="text-sm text-green-700 mt-1">{workPerformed}</p>
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })()}
                                        {booking.completionReport.partsUsed && (
                                            <div>
                                                <span className="text-sm font-medium text-green-800">Parts used:</span>
                                                <p className="text-sm text-green-700 mt-1">{booking.completionReport.partsUsed}</p>
                                            </div>
                                        )}
                                        
                                        {booking.completionReport.paymentAmount && (
                                            <div>
                                                <span className="text-sm font-medium text-green-800">Payment received:</span>
                                                <p className="text-sm text-green-700 mt-1 font-semibold">₹{booking.completionReport.paymentAmount}</p>
                                            </div>
                                        )}
                                        
                                        <CompletedTaskImages bookingId={booking.id} />

                                        <div className="text-xs text-green-600 mt-2">
                                            {booking.completionReport.completedAt ? (
                                                `Completed on ${new Date(booking.completionReport.completedAt).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}`
                                            ) : (
                                                'Completion date not available'
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-gray-200 gap-3">
                                <div className="flex flex-wrap gap-2">
                                    {booking.status === "Assigned" && (
                                        <>
                                            <button
                                                onClick={() => updateBookingStatus(booking.id, "Accepted")}
                                                className="bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                            >
                                                Accept
                                            </button>
                                            <button
                                                onClick={() => updateBookingStatus(booking.id, "cancelled")}
                                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Reject
                                            </button>
                                        </>
                                    )}

                                    {booking.status === "Accepted" && (
                                        <button
                                            onClick={() => updateBookingStatus(booking.id, "in-progress")}
                                            className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                        >
                                            Start Work
                                        </button>
                                    )}

                                    {booking.status === "in-progress" && (
                                        <>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowCompletionModal(true);
                                                }}
                                                className="bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors text-sm"
                                            >
                                                Complete
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowHoldModal(true);
                                                }}
                                                className="bg-yellow-600 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                                            >
                                                Hold Work
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setSelectedBooking(booking);
                                                    setShowUnableModal(true);
                                                }}
                                                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 transition-colors text-sm"
                                            >
                                                Unable to Complete
                                            </button>
                                        </>
                                    )}

                                    {booking.status === "hold_on_work" && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-yellow-600 text-sm font-medium">Work is on hold - waiting for admin action</span>
                                        </div>
                                    )}

                                    {booking.status === "unable_to_complete" && (
                                        <div className="flex items-center gap-2">
                                            <span className="text-red-600 text-sm font-medium">Unable to complete - admin will reassign</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredBookings.length === 0 && (
                <div className="text-center py-12">
                    <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-600">
                        {searchTerm || filterStatus !== "all"
                            ? "Try adjusting your search or filter criteria."
                            : "No repair bookings have been submitted yet."}
                    </p>
                </div>
            )}

            {/* Completion Modal */}
            {showCompletionModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Complete Repair</h2>
                                <p className="text-sm text-gray-500 mt-1">#{selectedBooking.displayId || selectedBooking.id.slice(-8)} - {selectedBooking.deviceType}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    setSelectedBooking(null);
                                    setCompletionForm({
                                        problem: '',
                                        solution: '',
                                        partsUsed: '',
                                        proofImages: []
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* What was Problem */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    What was the problem? *
                                </label>
                                <textarea
                                    value={completionForm.problem}
                                    onChange={(e) => setCompletionForm(prev => ({ ...prev, problem: e.target.value }))}
                                    placeholder="e.g., Screen was cracked, Battery not charging, Software corrupted..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            {/* How did you fix it */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    How did you fix it? *
                                </label>
                                <textarea
                                    value={completionForm.solution}
                                    onChange={(e) => setCompletionForm(prev => ({ ...prev, solution: e.target.value }))}
                                    placeholder="e.g., Replaced the screen, Fixed loose wire, Reinstalled software..."
                                    rows={2}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>

                            {/* Parts Used */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Parts used
                                </label>
                                <input
                                    type="text"
                                    value={completionForm.partsUsed}
                                    onChange={(e) => setCompletionForm(prev => ({ ...prev, partsUsed: e.target.value }))}
                                    placeholder="e.g., Screen, Battery, Wire, None"
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            {/* Proof Images Upload */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    📸 Upload Work Proof Images *
                                </label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-500 transition-colors">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={(e) => {
                                            const files = Array.from(e.target.files || []);
                                            setCompletionForm(prev => ({ ...prev, proofImages: files }));
                                        }}
                                        className="hidden"
                                        id="proof-images-upload"
                                    />
                                    <label htmlFor="proof-images-upload" className="cursor-pointer">
                                        <div className="text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                            <p className="text-lg font-medium">Click to upload work proof images</p>
                                            <p className="text-sm">PNG, JPG up to 10MB each (Multiple images allowed)</p>
                                        </div>
                                    </label>
                                </div>
                                {completionForm.proofImages.length > 0 && (
                                    <div className="mt-3">
                                        <p className="text-sm font-medium text-green-600 mb-2">
                                            {completionForm.proofImages.length} image(s) selected:
                                        </p>
                                        <div className="space-y-1">
                                            {completionForm.proofImages.map((file, index) => (
                                                <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded-lg">
                                                    <span className="text-sm text-green-700">{file.name}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setCompletionForm(prev => ({
                                                                ...prev,
                                                                proofImages: prev.proofImages.filter((_, i) => i !== index)
                                                            }));
                                                        }}
                                                        className="text-red-500 hover:text-red-700"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-2">Upload before/after images of the repair work as proof</p>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowCompletionModal(false);
                                    setSelectedBooking(null);
                                    setCompletionForm({
                                        problem: '',
                                        solution: '',
                                        partsUsed: '',
                                        proofImages: []
                                    });
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={submittingCompletion}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCompletionSubmit}
                                disabled={submittingCompletion || !completionForm.problem.trim() || !completionForm.solution.trim() || completionForm.proofImages.length === 0}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {submittingCompletion ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Completing...
                                    </>
                                ) : (
                                    'Complete Repair'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Hold Work Modal */}
            {showHoldModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Hold Work</h2>
                                <p className="text-sm text-gray-500 mt-1">#{selectedBooking.displayId || selectedBooking.id.slice(-8)} - {selectedBooking.deviceType}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowHoldModal(false);
                                    setSelectedBooking(null);
                                    setHoldReason('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Why are you putting this work on hold? *
                                </label>
                                <textarea
                                    value={holdReason}
                                    onChange={(e) => setHoldReason(e.target.value)}
                                    placeholder="e.g., Waiting for parts, Need customer approval, Technical issue requires consultation..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowHoldModal(false);
                                    setSelectedBooking(null);
                                    setHoldReason('');
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={submittingHold}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleHoldSubmit}
                                disabled={submittingHold || !holdReason.trim()}
                                className="px-6 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {submittingHold ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Putting on Hold...
                                    </>
                                ) : (
                                    'Put on Hold'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Unable to Complete Modal */}
            {showUnableModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Unable to Complete</h2>
                                <p className="text-sm text-gray-500 mt-1">#{selectedBooking.displayId || selectedBooking.id.slice(-8)} - {selectedBooking.deviceType}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowUnableModal(false);
                                    setSelectedBooking(null);
                                    setUnableReason('');
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Why are you unable to complete this repair? *
                                </label>
                                <textarea
                                    value={unableReason}
                                    onChange={(e) => setUnableReason(e.target.value)}
                                    placeholder="e.g., Device is beyond repair, Missing specialized tools, Hardware damage too extensive..."
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                                    required
                                />
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowUnableModal(false);
                                    setSelectedBooking(null);
                                    setUnableReason('');
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={submittingUnable}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUnableSubmit}
                                disabled={submittingUnable || !unableReason.trim()}
                                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {submittingUnable ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Submitting...
                                    </>
                                ) : (
                                    'Mark as Unable to Complete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Modal */}
            {showPaymentModal && selectedBooking && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Record Payment</h2>
                                <p className="text-sm text-gray-500 mt-1">#{selectedBooking.displayId || selectedBooking.id.slice(-8)} - {selectedBooking.deviceType}</p>
                            </div>
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedBooking(null);
                                    setPaymentForm({
                                        paymentMethod: 'cash',
                                        amount: '',
                                        upiTransactionId: ''
                                    });
                                }}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6 space-y-4">
                            {/* Customer Info (Auto-filled) */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-900 mb-3">Customer Details</h3>
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Name:</span>
                                        <span className="font-medium">{selectedBooking.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Email:</span>
                                        <span className="font-medium">{selectedBooking.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Phone:</span>
                                        <span className="font-medium">{selectedBooking.mobile}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Service:</span>
                                        <span className="font-medium">{selectedBooking.serviceType}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Payment Method *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'cash', upiTransactionId: '' }))}
                                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                                            paymentForm.paymentMethod === 'cash'
                                                ? 'border-green-500 bg-green-50 text-green-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="font-medium">💵 Cash</div>
                                        <div className="text-xs text-gray-500 mt-1">Physical payment</div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentForm(prev => ({ ...prev, paymentMethod: 'upi' }))}
                                        className={`p-3 border-2 rounded-lg text-center transition-colors ${
                                            paymentForm.paymentMethod === 'upi'
                                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                                : 'border-gray-200 hover:border-gray-300'
                                        }`}
                                    >
                                        <div className="font-medium">📱 UPI</div>
                                        <div className="text-xs text-gray-500 mt-1">Digital payment</div>
                                    </button>
                                </div>
                            </div>

                            {/* Payment Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-900 mb-2">
                                    Payment Amount *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                                    <input
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={paymentForm.amount}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                                        placeholder="0.00"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                </div>
                            </div>

                            {/* UPI Transaction ID (only for UPI) */}
                            {paymentForm.paymentMethod === 'upi' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-900 mb-2">
                                        UPI Transaction ID *
                                    </label>
                                    <input
                                        type="text"
                                        value={paymentForm.upiTransactionId}
                                        onChange={(e) => setPaymentForm(prev => ({ ...prev, upiTransactionId: e.target.value }))}
                                        placeholder="e.g., 123456789012"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                        required
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter the UPI transaction reference ID</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
                            <button
                                onClick={() => {
                                    setShowPaymentModal(false);
                                    setSelectedBooking(null);
                                    setPaymentForm({
                                        paymentMethod: 'cash',
                                        amount: '',
                                        upiTransactionId: ''
                                    });
                                }}
                                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                disabled={submittingPayment}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handlePaymentSubmit}
                                disabled={submittingPayment || !paymentForm.amount.trim() || (paymentForm.paymentMethod === 'upi' && !paymentForm.upiTransactionId.trim())}
                                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                            >
                                {submittingPayment ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Recording Payment...
                                    </>
                                ) : (
                                    'Record Payment & Complete'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
                    <div className={`flex items-center p-4 rounded-lg shadow-lg border-l-4 ${
                        toast.type === 'success' 
                            ? 'bg-white border-green-500 text-green-800' 
                            : 'bg-white border-red-500 text-red-800'
                    }`}>
                        <div className={`flex-shrink-0 w-5 h-5 mr-3 ${
                            toast.type === 'success' ? 'text-green-500' : 'text-red-500'
                        }`}>
                            {toast.type === 'success' ? (
                                <CheckCircle2 className="w-5 h-5" />
                            ) : (
                                <XCircle className="w-5 h-5" />
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium">{toast.message}</p>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            className={`ml-4 text-sm ${
                                toast.type === 'success' ? 'text-green-600 hover:text-green-800' : 'text-red-600 hover:text-red-800'
                            }`}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}