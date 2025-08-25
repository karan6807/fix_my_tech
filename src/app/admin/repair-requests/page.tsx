/* eslint-disable react/no-unescaped-entities */

'use client';
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import {
  Users,
  Wrench,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Phone,
  Mail,
  MapPin,
  RefreshCw,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Share2,
  ChevronDown,
  User,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  XCircle as XCircleIcon,
  ArrowRight,
  X
} from 'lucide-react';

// Completion Report Section Component
function CompletionReportSection({ selectedRequest }: { selectedRequest: RepairRequest }) {
  const [proofImages, setProofImages] = useState<ProofImage[]>([]);
  const [loadingImages, setLoadingImages] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fetch proof images when component mounts
  useEffect(() => {
    const fetchProofImages = async () => {
      if (!selectedRequest.completionReport) return;
      
      try {
        setLoadingImages(true);
        const response = await fetch(`/api/admin/repair-proof-images?bookingId=${selectedRequest.id}`);
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
  }, [selectedRequest.id, selectedRequest.completionReport]);

  return (
    <div className="bg-green-50 rounded-lg p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
        <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
        Work Completed
      </h3>
      <div className="space-y-3">
        {(() => {
          const workPerformed = selectedRequest.completionReport!.workPerformed;
          const problemMatch = workPerformed.match(/Problem: ([^\n]+)/);
          const solutionMatch = workPerformed.match(/Solution: ([^\n]+)/);
          
          return (
            <>
              {problemMatch && (
                <div>
                  <label className="text-sm font-medium text-green-800">What was the problem:</label>
                  <p className="text-green-700 mt-1 p-2 bg-white rounded border">{problemMatch[1]}</p>
                </div>
              )}
              {solutionMatch && (
                <div>
                  <label className="text-sm font-medium text-green-800">How it was fixed:</label>
                  <p className="text-green-700 mt-1 p-2 bg-white rounded border">{solutionMatch[1]}</p>
                </div>
              )}
              {!problemMatch && !solutionMatch && (
                <div>
                  <label className="text-sm font-medium text-green-800">Work performed:</label>
                  <p className="text-green-700 mt-1 p-2 bg-white rounded border">{workPerformed}</p>
                </div>
              )}
            </>
          );
        })()}
        {selectedRequest.completionReport!.partsUsed && (
          <div>
            <label className="text-sm font-medium text-green-800">Parts used:</label>
            <p className="text-green-700 mt-1 p-2 bg-white rounded border">{selectedRequest.completionReport!.partsUsed}</p>
          </div>
        )}
        
        {/* Proof Images Section */}
        <div>
          <label className="text-sm font-medium text-green-800">Work Proof Images:</label>
          {loadingImages ? (
            <div className="mt-2 p-4 bg-white rounded border flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
              <span className="text-green-700">Loading images...</span>
            </div>
          ) : proofImages.length > 0 ? (
            <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-3">
              {proofImages.map((image) => (
                <div key={image.id} className="relative group">
                  <Image
                    src={image.imageUrl}
                    alt={image.fileName}
                    width={200}
                    height={176}
                    className="w-full h-44 object-cover rounded-lg border-2 border-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
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
          ) : (
            <div className="mt-2 p-4 bg-white rounded border text-center">
              <p className="text-green-700 text-sm">No proof images uploaded</p>
            </div>
          )}
        </div>
        
        <div className="text-xs text-green-600 mt-2">
          Completed on {new Date(selectedRequest.completionReport!.completedAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>
      
      {/* Image Modal */}
      {showImageModal && selectedImage && (
        <div className="fixed inset-0 bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={selectedImage}
              alt="Proof image"
              width={800}
              height={600}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

interface ProofImage {
  id: string;
  imageUrl: string;
  fileName: string;
  fileSize: number;
  uploadedAt: string;
}

interface RepairRequest {
  id: string;
  customerName: string;
  email: string;
  phone: string;
  device: string;
  serviceType: string;
  issue: string;
  address: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled' | 'hold_on_work' | 'unable_to_complete';
  date: string;
  time: string;
  createdAt: string;
  updatedAt: string;
  assignedEngineer?: string;
  holdReason?: string;
  unableReason?: string;
  completionReport?: {
    workPerformed: string;
    partsUsed?: string;
    paymentAmount?: number;
    completedAt: string;
  };
  proofImages?: ProofImage[];
}

interface Engineer {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  availability: 'available' | 'busy' | 'offline';
  activeJobs: number;
}

export default function RepairRequestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [repairRequests, setRepairRequests] = useState<RepairRequest[]>([]);
  const [engineers, setEngineers] = useState<Engineer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<RepairRequest | null>(null);
  const [showEngineerDropdown, setShowEngineerDropdown] = useState<string | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState<string | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [submittingCancel, setSubmittingCancel] = useState(false);



  const fetchEngineers = async () => {
    try {
      const response = await fetch('/api/admin/fetch-employee');
      if (response.ok) {
        const data = await response.json();
        const formattedEngineers = data.employees.map((emp: { id: string; fullName: string; email: string; phoneNumber: string; specialization: string; status: string }) => ({
          id: emp.id,
          name: emp.fullName,
          email: emp.email,
          phone: emp.phoneNumber,
          specialization: emp.specialization,
          availability: emp.status === 'active' ? 'available' : 'offline',
          activeJobs: Math.floor(Math.random() * 5)
        }));
        setEngineers(formattedEngineers);
      }
    } catch (error) {
      console.error('Error fetching engineers:', error);
    }
  };




  const fetchRepairBookings = async (page = 1) => {
    try {
      console.log('=== FETCHING REPAIR BOOKINGS ===');
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }

      if (searchTerm.trim()) {
        params.append('search', searchTerm.trim());
      }

      const url = `/api/admin/repair-bookings?${params}`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url);
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('API Response:', data);

      if (data.success) {
        console.log('Bookings received:', data.bookings.length);
        data.bookings.forEach((booking: { id: string; customerName: string }, index: number) => {
          console.log(`Booking ${index + 1}: ID=${booking.id}, Customer=${booking.customerName}`);
        });
        
        setRepairRequests(data.bookings);
        setTotalPages(data.pagination.totalPages);
        setTotalCount(data.pagination.total);
        setCurrentPage(data.pagination.page);
      } else {
        console.error('API Error:', data.error);
        setError(data.error || 'Failed to fetch repair bookings');
      }
      console.log('=== END FETCH ===');
    } catch (err) {
      console.error('Network error:', err);
      setError('Network error while fetching repair bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmit = async () => {
    console.log('=== CANCEL SUBMIT STARTED ===');
    console.log('Selected request:', selectedRequest);
    console.log('Cancel reason:', cancelReason);
    
    if (!selectedRequest || !cancelReason.trim()) {
      console.log('Validation failed - missing request or reason');
      setError('Cancellation reason is required');
      return;
    }

    try {
      console.log('Setting submitting to true...');
      setSubmittingCancel(true);
      console.log('Making API call to cancel request...');
      console.log('Request payload:', {
        requestId: selectedRequest.id,
        reason: cancelReason.trim(),
        customerEmail: selectedRequest.email,
        customerName: selectedRequest.customerName
      });
      
      const response = await fetch('/api/admin/cancel-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.id,
          reason: cancelReason.trim(),
          customerEmail: selectedRequest.email,
          customerName: selectedRequest.customerName
        }),
      });
      
      console.log('API response status:', response.status);
      console.log('API response:', response);

      const data = await response.json();
      console.log('API response data:', data);

      if (data.success) {
        console.log('API call successful - updating UI...');
        // Remove cancelled request from UI immediately
        setRepairRequests(prev => prev.filter(request => request.id !== selectedRequest.id));
        setShowCancelModal(false);
        setCancelReason('');
        setSelectedRequest(null);
        setToast({ message: 'Request cancelled and customer notified successfully!', type: 'success' });
        setTimeout(() => setToast(null), 3000);
      } else {
        console.log('API call failed:', data.error);
        setError(data.error || 'Failed to cancel request');
      }
    } catch (err) {
      setError('Network error while cancelling request');
    } finally {
      setSubmittingCancel(false);
    }
  };

  const updateBookingStatus = async (id: string, newStatus: string) => {
    try {
      setUpdating(id);
      const response = await fetch('/api/admin/repair-bookings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchRepairBookings(currentPage);
        setShowStatusDropdown(null);
        const message = newStatus === 'confirmed' ? 'Request confirmed successfully!' : 
                       newStatus === 'cancelled' ? 'Request cancelled successfully!' : 
                       'Status updated successfully!';
        setToast({ message, type: 'success' });
        setTimeout(() => setToast(null), 3000);
      } else {
        setError(data.error || 'Failed to update booking status');
      }
    } catch (err) {
      setError('Network error while updating booking status');
    } finally {
      setUpdating(null);
    }
  };

  const assignEngineer = async (requestId: string, engineerId: string) => {
    try {
      console.log('Assigning engineer:', { requestId, engineerId });
      setUpdating(requestId);
      const selectedEngineer = engineers.find(eng => eng.id === engineerId);
      console.log('Selected engineer:', selectedEngineer);
      
      // Update local state immediately for better UX
      setRepairRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, assignedEngineer: selectedEngineer?.name, status: 'assigned' }
          : request
      ));
      setShowEngineerDropdown(null);
      
      // Save to database
      console.log('Calling API...');
      const response = await fetch('/api/admin/assign-engineer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ requestId, engineerId }),
      });

      const data = await response.json();
      console.log('API response:', data);

      if (!data.success) {
        console.error('API failed:', data.error);
        // Revert local state if API fails
        setRepairRequests(prev => prev.map(request => 
          request.id === requestId 
            ? { ...request, assignedEngineer: undefined, status: 'confirmed' }
            : request
        ));
        setError(data.error || 'Failed to assign engineer');
      } else {
        console.log('Engineer assigned successfully!');
        setToast({ message: `Engineer ${selectedEngineer?.name} assigned successfully!`, type: 'success' });
        setTimeout(() => setToast(null), 3000);
      }
      
    } catch (err) {
      console.error('Error in assignEngineer:', err);
      // Revert local state on error
      setRepairRequests(prev => prev.map(request => 
        request.id === requestId 
          ? { ...request, assignedEngineer: undefined, status: 'confirmed' }
          : request
      ));
      setError('Error assigning engineer');
    } finally {
      setUpdating(null);
    }
  };

  useEffect(() => {
    fetchRepairBookings();
    fetchEngineers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchRepairBookings(1);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, statusFilter]);

  const handleDocumentClick = (event: MouseEvent) => {
    // Don't close dropdown if it's a scroll event
    if (event.type === 'scroll') return;
    
    const target = event.target as Node;
    let shouldCloseEngineer = true;
    let shouldCloseStatus = true;
    
    // Check if click is inside any engineer dropdown
    const engineerDropdowns = document.querySelectorAll('[data-engineer-dropdown]');
    engineerDropdowns.forEach(dropdown => {
      if (dropdown.contains(target)) {
        shouldCloseEngineer = false;
      }
    });
    
    // Check if click is inside any status dropdown
    const statusDropdowns = document.querySelectorAll('[data-status-dropdown]');
    statusDropdowns.forEach(dropdown => {
      if (dropdown.contains(target)) {
        shouldCloseStatus = false;
      }
    });
    
    if (shouldCloseEngineer) {
      setShowEngineerDropdown(null);
    }
    if (shouldCloseStatus) {
      setShowStatusDropdown(null);
    }
  };

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setShowDetailModal(false);
      }
    };

    if (showDetailModal) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [showDetailModal]);

  useEffect(() => {
    document.addEventListener('mousedown', handleDocumentClick);
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'confirmed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'assigned':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-indigo-500" />;
      case 'rejected':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'in_progress':
        return <PlayCircle className="w-4 h-4 text-orange-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      case 'hold_on_work':
        return <PauseCircle className="w-4 h-4 text-yellow-500" />;
      case 'unable_to_complete':
        return <XCircleIcon className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'confirmed':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'assigned':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      case 'accepted':
        return `${baseClasses} bg-indigo-100 text-indigo-800`;
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'in_progress':
        return `${baseClasses} bg-orange-100 text-orange-800`;
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'cancelled':
        return `${baseClasses} bg-red-100 text-red-800`;
      case 'hold_on_work':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'unable_to_complete':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return baseClasses;
    }
  };

  const getEngineerAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available':
        return 'text-green-500';
      case 'busy':
        return 'text-orange-500';
      case 'offline':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const stats = {
    total: totalCount,
    pending: repairRequests.filter(r => r.status === 'pending').length,
    assigned: repairRequests.filter(r => r.status === 'assigned').length,
    inProgress: repairRequests.filter(r => r.status === 'in_progress').length,
    completed: repairRequests.filter(r => r.status === 'completed').length,
    holdOnWork: repairRequests.filter(r => r.status === 'hold_on_work').length,
    unableToComplete: repairRequests.filter(r => r.status === 'unable_to_complete').length
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Repair Requests Management</h1>
          <p className="text-gray-600">Manage all repair requests, update statuses, and assign engineers</p>
        </div>
        <button
          onClick={() => fetchRepairBookings(currentPage)}
          disabled={loading}
          className="flex items-center px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-xl flex justify-between items-center">
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => setError('')}
            className="text-red-600 hover:text-red-800"
          >
            <XCircleIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Assigned</p>
              <p className="text-2xl font-bold text-purple-600">{stats.assigned}</p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <User className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-orange-600">{stats.inProgress}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Wrench className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Hold on Work</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.holdOnWork}</p>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <PauseCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Unable to Complete</p>
              <p className="text-2xl font-bold text-red-600">{stats.unableToComplete}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <XCircleIcon className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">All Repair Requests</h2>
              <p className="text-sm text-gray-600 mt-1">Manage and track all repair requests ({totalCount} total)</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-black"
                />
              </div>
              <div className="relative">
                <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm text-black appearance-none bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="hold_on_work">Hold on Work</option>
                  <option value="unable_to_complete">Unable to Complete</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <p className="ml-3 text-gray-600">Loading repair requests...</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service & Device
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Assigned Engineer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {repairRequests.map((request) => (
                    <tr key={request.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                          <div className="flex items-center text-xs text-gray-500 mt-1">
                            <Mail className="w-3 h-3 mr-1" />
                            {request.email}
                          </div>
                          <div className="flex items-center text-xs text-gray-500">
                            <Phone className="w-3 h-3 mr-1" />
                            {request.phone}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{request.serviceType}</div>
                        <div className="text-sm text-gray-500">{request.device}</div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="relative">
                          <button
                            onClick={() => setShowStatusDropdown(showStatusDropdown === request.id ? null : request.id)}
                            className="flex items-center hover:bg-gray-100 rounded-lg p-1 transition-colors"
                            disabled={updating === request.id}
                          >
                            {getStatusIcon(request.status)}
                            <span className={`ml-2 ${getStatusBadge(request.status)}`}>
                              {request.status.replace('_', ' ')}
                            </span>
                            {request.status === 'hold_on_work' && request.holdReason && (
                              <div 
                                className="cursor-pointer hover:text-yellow-800" 
                                title={`Hold Reason: ${request.holdReason}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Hold Reason: ${request.holdReason}`);
                                }}
                              >
                                <Eye className="w-4 h-4 ml-2 text-yellow-600" />
                              </div>
                            )}
                            {request.status === 'unable_to_complete' && request.unableReason && (
                              <div 
                                className="cursor-pointer hover:text-red-800" 
                                title={`Unable Reason: ${request.unableReason}`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  alert(`Unable to Complete Reason: ${request.unableReason}`);
                                }}
                              >
                                <Eye className="w-4 h-4 ml-2 text-red-600" />
                              </div>
                            )}
                            {(request.status === 'pending' || request.status === 'hold_on_work') && <ChevronDown className="w-4 h-4 ml-1 text-gray-400" />}
                          </button>

                          {/* Status Dropdown */}
                          {showStatusDropdown === request.id && (
                            <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-48" data-status-dropdown>
                              {request.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => updateBookingStatus(request.id, 'confirmed')}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center text-gray-700 rounded-lg"
                                    disabled={updating === request.id}
                                  >
                                    <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                                    <span>Confirm</span>
                                  </button>
                                  <button
                                    onClick={() => {
                                      setSelectedRequest(request);
                                      setShowCancelModal(true);
                                      setShowStatusDropdown(null);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center text-gray-700 rounded-lg"
                                    disabled={updating === request.id}
                                  >
                                    <XCircleIcon className="w-4 h-4 mr-2 text-red-600" />
                                    <span>Cancel</span>
                                  </button>
                                </>
                              )}
                              {request.status === 'hold_on_work' && (
                                <button
                                  onClick={() => updateBookingStatus(request.id, 'in_progress')}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center text-gray-700 rounded-lg"
                                  disabled={updating === request.id}
                                >
                                  <PlayCircle className="w-4 h-4 mr-2" />
                                  <span>Resume Work (In Progress)</span>
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(request.status === 'confirmed' || request.status === 'rejected' || request.status === 'unable_to_complete') && !request.assignedEngineer ? (
                          <div className="relative" data-engineer-dropdown>
                            <button
                              onClick={() => setShowEngineerDropdown(showEngineerDropdown === request.id ? null : request.id)}
                              className="flex items-center px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-xs"
                              disabled={updating === request.id}
                            >
                              <User className="w-3 h-3 mr-1.5" />
                              Assign Engineer
                              <ChevronDown className="w-3 h-3 ml-1.5" />
                            </button>

                            {/* Enhanced Engineer Dropdown */}
                            {showEngineerDropdown === request.id && (
                              <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 z-20 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2" data-engineer-dropdown>
                                <div className="px-3 py-2 border-b border-gray-100">
                                  <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Select Engineer</h4>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                  {engineers.map((engineer) => (
                                    <button
                                      key={engineer.id}
                                      onClick={() => assignEngineer(request.id, engineer.id)}
                                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                                        engineer.availability === 'offline' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-orange-50'
                                      }`}
                                      disabled={updating === request.id || engineer.availability === 'offline'}
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <div className="flex items-center mb-1">
                                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3">
                                              <span className="text-white font-bold text-xs">
                                                {engineer.name.split(' ').map(n => n[0]).join('')}
                                              </span>
                                            </div>
                                            <div>
                                              <span className="font-semibold text-gray-900 text-sm">{engineer.name}</span>
                                              <div className="flex items-center mt-0.5">
                                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                                                  engineer.availability === 'available' ? 'bg-green-400' :
                                                  engineer.availability === 'busy' ? 'bg-orange-400' : 'bg-red-400'
                                                }`}></span>
                                                <span className={`text-xs font-medium capitalize ${
                                                  engineer.availability === 'available' ? 'text-green-600' :
                                                  engineer.availability === 'busy' ? 'text-orange-600' : 'text-red-600'
                                                }`}>
                                                  {engineer.availability}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                          <div className="ml-11">
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                                                {engineer.specialization}
                                              </span>
                                              <span className="text-xs text-gray-500">
                                                {engineer.activeJobs} active jobs
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                        {engineer.availability === 'available' && (
                                          <ArrowRight className="w-4 h-4 text-gray-400 mt-2" />
                                        )}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : request.assignedEngineer ? (
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                              <User className="w-3 h-3 text-green-600" />
                            </div>
                            <span className="text-sm text-gray-900">{request.assignedEngineer}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{new Date(request.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}</div>
                        <div className="text-xs text-gray-400 mt-1">
                          {new Date(request.createdAt).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowDetailModal(true);
                          }}
                          className="text-orange-600 hover:text-orange-800 transition-colors"
                          title="View Details"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Empty State */}
            {repairRequests.length === 0 && !loading && (
              <div className="text-center py-12">
                <Wrench className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No repair requests found</h3>
                <p className="text-gray-500">No requests match your current filters. Try adjusting your search.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalCount)} of {totalCount} results
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => fetchRepairBookings(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-1 text-sm bg-orange-600 text-white rounded-md">
                      {currentPage}
                    </span>
                    <button
                      onClick={() => fetchRepairBookings(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[97vh] overflow-y-auto border-2 border-orange-500">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Repair Request Details</h2>
                <p className="text-sm text-gray-500 mt-1">Request ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  {getStatusIcon(selectedRequest.status)}
                  <span className={`ml-2 ${getStatusBadge(selectedRequest.status)}`}>
                    {selectedRequest.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Created: {new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Email</label>
                    <div className="flex items-center">
                      <Mail className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{selectedRequest.email}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{selectedRequest.phone}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
                      <p className="text-gray-900">{selectedRequest.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Information */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Service Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Device</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.device}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.serviceType}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Issue Description</label>
                    <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{selectedRequest.issue}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Information */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Appointment Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Date</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{selectedRequest.date}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Preferred Time</label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{selectedRequest.time}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assigned Engineer */}
              {selectedRequest.assignedEngineer && (
                <div className="bg-green-50 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Assigned Engineer</h3>
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedRequest.assignedEngineer}</p>
                      <p className="text-sm text-gray-600">Repair Specialist</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hold Reason */}
              {selectedRequest.status === 'hold_on_work' && selectedRequest.holdReason && (
                <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <PauseCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    Work On Hold
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-yellow-800">Reason provided by engineer:</label>
                    <p className="text-yellow-700 mt-1 p-3 bg-white rounded border">{selectedRequest.holdReason}</p>
                  </div>
                </div>
              )}

              {/* Unable Reason */}
              {selectedRequest.status === 'unable_to_complete' && selectedRequest.unableReason && (
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                    Unable to Complete
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-red-800">Reason provided by engineer:</label>
                    <p className="text-red-700 mt-1 p-3 bg-white rounded border">{selectedRequest.unableReason}</p>
                  </div>
                </div>
              )}

              {/* Completion Report */}
              {selectedRequest.status === 'completed' && selectedRequest.completionReport && (
                <CompletionReportSection selectedRequest={selectedRequest} />
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-orange-700 bg-orange-100 rounded-lg hover:bg-orange-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Request Modal */}
      {showCancelModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Cancel Request</h2>
                <p className="text-sm text-gray-500 mt-1">Customer: {selectedRequest.customerName}</p>
              </div>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedRequest(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <div className="mb-4">
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center">
                    <XCircleIcon className="w-5 h-5 text-red-600 mr-2" />
                    <span className="text-sm font-medium text-red-800">This will cancel the repair request</span>
                  </div>
                  <p className="text-sm text-red-700 mt-1">
                    An email notification will be sent to the customer explaining the cancellation.
                  </p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Reason for cancellation *
                </label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g., Unable to service this device type, Customer location not serviceable, Technical limitations..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be included in the email sent to the customer.
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason('');
                  setSelectedRequest(null);
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                disabled={submittingCancel}
              >
                Back
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={submittingCancel || !cancelReason.trim()}
                className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submittingCancel ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Cancelling...
                  </>
                ) : (
                  'Cancel Request & Notify Customer'
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
                <XCircleIcon className="w-5 h-5" />
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