'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

// Icons
const ArrowLeftIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
  </svg>
);

const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BadgeCheckIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const EyeIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const XIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const MapPinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

interface Engineer {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  specialization: string;
  joinDate: string;
  status: 'active' | 'inactive';
  completedJobs: number;
  rating: number;
}

interface Request {
  id: string;
  customerName: string;
  customerPhone: string;
  deviceType: string;
  serviceType: string;
  issue: string;
  address: string;
  requestDate: string;
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  estimatedCost?: number;
}

export default function EngineerDetailPage() {
  const searchParams = useSearchParams();
  const engineerId = searchParams.get('id');
  const [engineer, setEngineer] = useState<Engineer | null>(null);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestsLoading, setRequestsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchEngineerDetails = async () => {
      if (!engineerId) {
        setError('Engineer ID not provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/admin/engineer-details?id=${engineerId}`);
        const data = await response.json();

        if (data.success) {
          setEngineer(data.engineer);
        } else {
          setError(data.error || 'Failed to fetch engineer details');
        }
      } catch (err) {
        setError('Network error while fetching engineer details');
      } finally {
        setLoading(false);
      }
    };

    const fetchEngineerRequests = async () => {
      if (!engineerId) return;

      try {
        setRequestsLoading(true);
        const response = await fetch(`/api/admin/engineer-requests?engineerId=${engineerId}`);
        const data = await response.json();

        if (data.success) {
          setRequests(data.requests || []);
        } else {
          console.error('Failed to fetch engineer requests:', data.error);
        }
      } catch (err) {
        console.error('Network error while fetching engineer requests:', err);
      } finally {
        setRequestsLoading(false);
      }
    };

    fetchEngineerDetails();
    fetchEngineerRequests();
  }, [engineerId]);

  const getSpecializationColor = (specialization: string) => {
    const colors = {
      'Mobile Repair': 'bg-blue-100 text-blue-800',
      'Laptop Repair': 'bg-green-100 text-green-800',
      'Desktop Repair': 'bg-purple-100 text-purple-800',
      'Tablet Repair': 'bg-yellow-100 text-yellow-800',
      'All Devices': 'bg-orange-100 text-orange-800'
    };
    return colors[specialization as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'accepted': 'bg-blue-100 text-blue-800',
      'completed': 'bg-green-100 text-green-800',
      'rejected': 'bg-red-100 text-red-800'
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-red-100 text-red-800'
    };
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
          <p className="ml-3 text-gray-600">Loading engineer details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!engineer) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Engineer not found</h3>
          <p className="text-gray-500">The requested engineer could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-orange-600 text-sm hover:text-orange-800 mb-3 gap-2">
          <ArrowLeftIcon/>
          Back to Engineer List
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Engineer Details</h1>
      </div>

      {/* Engineer Profile Card */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {engineer.fullName ? engineer.fullName.split(' ').map(n => n[0]).join('') : 'N/A'}
            </span>
          </div>

          {/* Basic Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{engineer.fullName || 'Name Not Available'}</h2>
                <p className="text-gray-500">Engineer ID: {engineer.id}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getSpecializationColor(engineer.specialization || 'All Devices')}`}>
                  {engineer.specialization || 'Not Specified'}
                </span>
                <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${
                  engineer.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {engineer.status}
                </span>
              </div>
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center text-gray-600">
                <MailIcon className="w-4 h-4 mr-2" />
                <span>{engineer.email}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <PhoneIcon className="w-4 h-4 mr-2" />
                <span>{engineer.phoneNumber}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <CalendarIcon className="w-4 h-4 mr-2" />
                <span>Joined: {engineer.joinDate ? new Date(engineer.joinDate).toLocaleDateString('en-IN') : 'Not Available'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <BadgeCheckIcon className="w-4 h-4 mr-2" />
                <span>{engineer.completedJobs} Jobs Completed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">{engineer.completedJobs}</div>
            <div className="text-sm text-gray-600">Total Jobs</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-600 mb-1">{engineer.rating}</div>
            <div className="text-sm text-gray-600">Average Rating</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {engineer.joinDate ? Math.floor((Date.now() - new Date(engineer.joinDate).getTime()) / (1000 * 60 * 60 * 24)) : 0}
            </div>
            <div className="text-sm text-gray-600">Days Active</div>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Service Requests</h3>
          <p className="text-sm text-gray-600 mt-1">All requests assigned to this engineer</p>
        </div>
        
        <div className="overflow-x-auto">
          {requestsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-600"></div>
              <p className="ml-3 text-gray-600">Loading requests...</p>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No requests found for this engineer</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service & Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.customerName}</div>
                        <div className="text-sm text-gray-500">{request.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.serviceType || 'General Service'}</div>
                        <div className="text-sm text-gray-500">{request.deviceType}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(request.requestDate).toLocaleDateString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(request.status)}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {request.estimatedCost ? `₹${request.estimatedCost}` : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          setSelectedRequest(request);
                          setShowRequestModal(true);
                        }}
                        className="text-orange-600 hover:text-orange-900 flex items-center"
                      >
                        <EyeIcon className="w-4 h-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Specialization</h4>
            <p className="text-gray-900">{engineer.specialization || 'Not Specified'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Account Status</h4>
            <p className="text-gray-900 capitalize">{engineer.status}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Join Date</h4>
            <p className="text-gray-900">{engineer.joinDate ? new Date(engineer.joinDate).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }) : 'Not Available'}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">Performance</h4>
            <p className="text-gray-900">{engineer.rating}/5.0 Rating</p>
          </div>
        </div>
      </div>

      {/* Request Detail Modal */}
      {showRequestModal && selectedRequest && (
        <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 border-orange-500">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Request Details</h2>
                <p className="text-sm text-gray-500 mt-1">Request ID: {selectedRequest.id}</p>
              </div>
              <button
                onClick={() => setShowRequestModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.customerName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Phone</label>
                    <div className="flex items-center">
                      <PhoneIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{selectedRequest.customerPhone}</p>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Address</label>
                    <div className="flex items-start">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />
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
                    <label className="text-sm font-medium text-gray-600">Device Type</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.deviceType}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Service Type</label>
                    <p className="text-gray-900 font-medium">{selectedRequest.serviceType || 'General Service'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Issue Description</label>
                    <p className="text-gray-900 mt-1 p-3 bg-white rounded border">{selectedRequest.issue}</p>
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Request Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Request Date</label>
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <p className="text-gray-900">{new Date(selectedRequest.requestDate).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Priority</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getPriorityColor(selectedRequest.priority)}`}>
                      {selectedRequest.priority}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full capitalize ${getStatusColor(selectedRequest.status)}`}>
                      {selectedRequest.status}
                    </span>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estimated Cost</label>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedRequest.estimatedCost ? `₹${selectedRequest.estimatedCost.toLocaleString()}` : 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}