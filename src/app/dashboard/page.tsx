/* eslint-disable react/no-unescaped-entities */

'use client';
import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Phone, Mail, MapPin, Clock, CheckCircle, XCircle, AlertCircle, RefreshCw, Wrench, Calendar } from 'lucide-react';

type Status = 'pending' | 'confirmed' | 'assigned' | 'accepted' | 'in-progress' | 'completed' | 'hold_on_work' | 'unable_to_complete';


interface Booking {
  id: string;
  name: string;
  email: string;
  mobile: string;
  address: string;
  serviceType: string;
  deviceType: string;
  modelNumber: string;
  description: string;
  status: Status;
  submittedAt: string;
  assignedEngineer?: string;
  completionReport?: {
    workPerformed: string;
    partsUsed?: string;
    paymentAmount?: number;
    completedAt: string;
  };
}

const RepairDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/my-bookings');
      const data = await response.json();

      if (data.success) {
        const transformedBookings = data.bookings.map((booking: any) => ({
          id: booking.id.slice(-6).toUpperCase(),
          name: booking.customerName,
          email: booking.email,
          mobile: booking.phone || 'No phone',
          address: booking.address || 'No address',
          serviceType: booking.serviceType,
          deviceType: booking.device,
          modelNumber: booking.device.split(' - ')[1] || 'Not specified',
          description: booking.issue,
          status: booking.status === 'pending' ? 'pending' :
                 booking.status === 'confirmed' ? 'confirmed' :
                 booking.status === 'assigned' ? 'assigned' :
                 booking.status === 'rejected' ? 'assigned' :
                 booking.status === 'accepted' ? 'accepted' :
                 booking.status === 'in_progress' ? 'in-progress' : 
                 booking.status === 'completed' ? 'completed' :
                 booking.status === 'hold_on_work' ? 'hold_on_work' :
                 booking.status === 'unable_to_complete' ? 'unable_to_complete' : 'pending',
          submittedAt: new Date(booking.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          assignedEngineer: booking.assignedEngineer,
          completionReport: booking.completionReport ? {
            workPerformed: booking.completionReport.workPerformed,
            partsUsed: booking.completionReport.partsUsed,
            paymentAmount: booking.completionReport.paymentAmount,
            completedAt: booking.completionReport.completedAt
          } : undefined
        }));
        setBookings(transformedBookings);
      } else {
        setError(data.error || 'Failed to fetch your bookings');
      }
    } catch (err) {
      setError('Network error while fetching your bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBookings().finally(() => {
      setIsRefreshing(false);
    });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const serviceTypes = [
    'Laptop Repair', 'Smartphone Repair', 'Tablet Repair', 'Gaming Console Repair',
    'Smart TV Repair', 'Headphone/Speaker Repair', 'Smartwatch Repair',
    'Desktop Computer Repair', 'Gaming Laptop Repair', 'Data Recovery'
  ];

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'assigned': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'accepted': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'hold_on_work': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'unable_to_complete': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Status) => {
    switch (status) {
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'assigned': return <Clock className="w-4 h-4" />;
      case 'accepted': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'hold_on_work': return <Clock className="w-4 h-4" />;
      case 'unable_to_complete': return <XCircle className="w-4 h-4" />;
      default: return <XCircle className="w-4 h-4" />;
    }
  };



  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    const matchesService = serviceFilter === 'all' || booking.serviceType === serviceFilter;
    
    return matchesSearch && matchesStatus && matchesService;
  });

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    assigned: bookings.filter(b => b.status === 'assigned').length,
    accepted: bookings.filter(b => b.status === 'accepted').length,
    'in-progress': bookings.filter(b => b.status === 'in-progress').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    'hold_on_work': bookings.filter(b => b.status === 'hold_on_work').length,
    'unable_to_complete': bookings.filter(b => b.status === 'unable_to_complete').length
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-40 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-orange-600 rounded-lg">
                  <Wrench className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">My Repair Requests</h1>
              </div>
              <p className="text-gray-600">Track and manage your repair service bookings</p>
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <XCircle className="w-4 h-4 text-red-500" />
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                </div>
              )}
            </div>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Requests</p>
                <p className="text-xl font-semibold text-gray-900">{statusCounts.all}</p>
                <p className="text-xs text-gray-500">All time</p>
              </div>
              <Eye className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-xl font-semibold text-yellow-600">{statusCounts.pending}</p>
                <p className="text-xs text-gray-500">Awaiting review</p>
              </div>
              <AlertCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-xl font-semibold text-orange-600">{statusCounts['in-progress']}</p>
                <p className="text-xs text-gray-500">Being repaired</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-xl font-semibold text-green-600">{statusCounts.completed}</p>
                <p className="text-xs text-gray-500">Successfully fixed</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Filters - Only show when there are bookings */}
        {bookings.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by name, email, or booking ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white appearance-none"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="accepted">Accepted</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="hold_on_work">Hold on Work</option>
                  <option value="unable_to_complete">Unable to Complete</option>
                </select>
              </div>

              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-50 focus:bg-white appearance-none"
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
              >
                <option value="all">All Services</option>
                {serviceTypes.map(service => (
                  <option key={service} value={service}>{service}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <RefreshCw className="w-12 h-12 animate-spin text-orange-600" />
              <h3 className="text-lg font-medium text-gray-900">Loading your bookings...</h3>
              <p className="text-gray-500">Please wait while we fetch the latest data</p>
            </div>
          </div>
        )}

        {/* Bookings List or Empty State */}
        {!loading && (
          <div className="space-y-4">
            {bookings.length > 0 ? (
              <>
                {filteredBookings.map(booking => (
                  <div key={booking.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                        <div className="flex items-center space-x-3 mb-2 sm:mb-0">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1 ${getStatusColor(booking.status)}`}>
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status === 'hold_on_work' ? 'Hold on Work' : booking.status === 'unable_to_complete' ? 'Reassignment in Progress' : booking.status.replace('-', ' ')}</span>
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-sm font-mono rounded">
                            #{booking.id}
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{booking.submittedAt}</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left Side - Customer Info & Issue Description */}
                        <div>
                          <h3 className="font-semibold text-lg text-gray-900 mb-3">{booking.name}</h3>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4 text-orange-500" />
                              <span>{booking.email}</span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Phone className="w-4 h-4 text-green-500" />
                              <span>{booking.mobile}</span>
                            </div>
                            <div className="flex items-start space-x-2 text-sm text-gray-600">
                              <MapPin className="w-4 h-4 text-purple-500 mt-0.5" />
                              <span>{booking.address}</span>
                            </div>
                          </div>
                          
                          <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                            <h4 className="font-medium text-gray-900 mb-2">Issue Description</h4>
                            <p className="text-sm text-gray-700">{booking.description}</p>
                          </div>
                        </div>

                        {/* Right Side - Service Details */}
                        <div>
                          <div className="bg-gray-50 rounded-lg p-4 border">
                            <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                              <Wrench className="w-4 h-4 mr-2 text-orange-600" />
                              Service Details
                            </h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-gray-600">Service Type:</span>
                                <span className="font-medium text-gray-900">{booking.serviceType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Device:</span>
                                <span className="font-medium text-gray-900">{booking.deviceType}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-gray-600">Model:</span>
                                <span className="font-medium text-gray-900">{booking.modelNumber}</span>
                              </div>
                              {booking.assignedEngineer && (
                                <div className="flex justify-between">
                                  <span className="text-gray-600">Assigned Engineer:</span>
                                  <span className="font-medium text-gray-900">{booking.assignedEngineer}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Completion Report for completed bookings */}
                      {booking.status === 'completed' && booking.completionReport && (
                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                          <h4 className="font-medium text-green-900 mb-3 flex items-center">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Work Completed
                          </h4>
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
                            <div>
                              <span className="text-sm font-medium text-green-800">Payment collected:</span>
                              <p className="text-sm text-green-700 mt-1 font-semibold">
                                ₹{booking.completionReport.paymentAmount !== null && booking.completionReport.paymentAmount !== undefined 
                                    ? booking.completionReport.paymentAmount 
                                    : '0.00'}
                              </p>
                            </div>
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

                      {/* Actions */}
                      <div className="mt-4 pt-4 border-t border-gray-200 flex justify-end space-x-2">
                        <button className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700">
                          Cancel Request
                        </button>
                      </div>
                    </div>
                  </div>
                ))}

                {filteredBookings.length === 0 && (
                  <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                    <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filter criteria to find what you're looking for
                    </p>
                  </div>
                )}
              </>
            ) : (
              // Empty State - No bookings at all
              <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-orange-50 rounded-full">
                    <Wrench className="w-12 h-12 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">No Repair Requests Yet</h3>
                  <p className="text-gray-500 max-w-md">
                    You haven't submitted any repair requests yet. When you book a repair service, 
                    your requests will appear here for easy tracking.
                  </p>
                  <button className="mt-4 px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
                    Book Your First Repair
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RepairDashboard;