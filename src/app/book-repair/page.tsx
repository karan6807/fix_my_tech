/* eslint-disable react/no-unescaped-entities */

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

// Define Toast type
interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export default function BookRepairPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: '',
    address: '',
    serviceType: '',
    deviceType: '',
    modelNumber: '',
    description: ''
  });

  // Update form data when user data loads
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }));
    }
  }, [user]);

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [loading, isAuthenticated, router]);

  // Toast notification function
  const addToast = (message: string, type: 'success' | 'error' = 'success') => {
    const id = Date.now();
    const newToast: Toast = { id, message, type };

    setToasts(prev => [...prev, newToast]);

    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Show loading while checking auth or if not authenticated
  if (loading || (!loading && !isAuthenticated)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const serviceTypes = [
    'Laptop Repair',
    'Smartphone Repair',
    'Tablet Repair',
    'Gaming Console Repair',
    'Smart TV Repair',
    'Headphone/Speaker Repair',
    'Smartwatch Repair',
    'Desktop Computer Repair',
    'Gaming Laptop Repair',
    'Data Recovery',
    'Printer/Scanner Repair',
    'WiFi Router & Networking Support',
    'Software/OS Installation & Virus Removal',
    'Battery Replacement Service',
    'CCTV & Smart Device Setup'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/book-repair', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Show success toast
        addToast('Your repair service has been booked. We\'ll contact you soon!');

        // Reset form
        setFormData({
          name: user?.name || '',
          email: user?.email || '',
          mobile: '',
          address: '',
          serviceType: '',
          deviceType: '',
          modelNumber: '',
          description: ''
        });
      } else {
        // Show error toast
        addToast(data.error || '❌ Failed to book repair service. Please try again.', 'error');
      }
    } catch (error) {
      // Show network error toast
      addToast('🚫 Network error. Please check your connection and try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-30 px-4">
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`
              min-w-80 max-w-md p-4 rounded-xl shadow-2xl border transform transition-all duration-500 ease-in-out
              ${toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-800'
              }
              animate-slide-in-right
            `}
            style={{
              animation: 'slideInRight 0.5s ease-out'
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3">
                <div className={`
                  flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                  ${toast.type === 'success'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                  }
                `}>
                  {toast.type === 'success' ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium leading-5">{toast.message}</p>
                </div>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className={`
                  flex-shrink-0 ml-4 text-sm font-medium hover:opacity-75 transition-opacity
                  ${toast.type === 'success' ? 'text-green-600' : 'text-red-600'}
                `}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Progress bar */}
            <div className={`
              mt-2 w-full h-1 rounded-full overflow-hidden
              ${toast.type === 'success' ? 'bg-green-200' : 'bg-red-200'}
            `}>
              <div
                className={`
                  h-full rounded-full
                  ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'}
                `}
                style={{
                  animation: 'progressBar 5s linear forwards'
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        @keyframes progressBar {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
        
        .animate-slide-in-right {
          animation: slideInRight 0.5s ease-out;
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* Main Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">

            {/* Left Side - Image (Reduced width) */}
            <div className="lg:col-span-2 relative h-80 lg:h-auto min-h-[400px]">
              <Image
                src="/repair.jpg"
                alt="Professional repair service"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent lg:bg-gradient-to-r lg:from-black/50 lg:via-black/20 lg:to-transparent"></div>

              {/* Overlay Content */}
              <div className="absolute inset-0 flex items-end lg:items-center p-8">
                <div className="text-white">
                  <h3 className="text-2xl font-bold mb-2">Expert Technicians</h3>
                  <p className="text-white/90">Professional repairs with quality guarantee</p>
                </div>
              </div>
            </div>

            {/* Right Side - Form (Increased width) */}
            <div className="lg:col-span-3 p-8 lg:p-12">
              <div className="max-w-2xl">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Book Your Repair Service
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and our experts will get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Row 1: Name and Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-900 mb-2">
                        Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Your full name"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                        Email*
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Your email address"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                      />
                    </div>
                  </div>

                  {/* Row 2: Mobile and Service Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="mobile" className="block text-sm font-medium text-gray-900 mb-2">
                        Mobile*
                      </label>
                      <input
                        type="tel"
                        id="mobile"
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="Your mobile number"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                      />
                    </div>

                    <div>
                      <label htmlFor="serviceType" className="block text-sm font-medium text-gray-900 mb-2">
                        Service Type*
                      </label>
                      <select
                        id="serviceType"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer text-black"
                      >
                        <option value="">Select service type</option>
                        {serviceTypes.map((service) => (
                          <option key={service} value={service}>
                            {service}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Address Field */}
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-900 mb-2">
                      Address*
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Your complete address"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                    />
                  </div>

                  {/* Row 3: Device Type and Model */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="deviceType" className="block text-sm font-medium text-gray-900 mb-2">
                        Device Type*
                      </label>
                      <input
                        type="text"
                        id="deviceType"
                        name="deviceType"
                        value={formData.deviceType}
                        onChange={handleInputChange}
                        placeholder="e.g., iPhone, MacBook"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                      />
                    </div>

                    <div>
                      <label htmlFor="modelNumber" className="block text-sm font-medium text-gray-900 mb-2">
                        Model Number
                      </label>
                      <input
                        type="text"
                        id="modelNumber"
                        name="modelNumber"
                        value={formData.modelNumber}
                        onChange={handleInputChange}
                        placeholder="Model (if known)"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white placeholder-gray-500 text-black"
                      />
                    </div>
                  </div>

                  {/* Description Field */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">
                      Describe the Issue*
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Please describe the issue with your device in detail..."
                      required
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white resize-none placeholder-gray-500 text-black"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:transform-none disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Booking...
                      </div>
                    ) : (
                      'Book Repair Service'
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <svg className="w-10 h-10 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Quality Guarantee</h3>
            <p className="text-gray-600 leading-relaxed">All repairs come with our comprehensive 90-day warranty and satisfaction guarantee</p>
            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <svg className="w-10 h-10 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Fast Turnaround</h3>
            <p className="text-gray-600 leading-relaxed">Most repairs completed within 24-48 hours with express options available</p>
            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>

          <div className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 text-center transform hover:-translate-y-2 border border-gray-100 hover:border-orange-200">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
              <svg className="w-10 h-10 text-orange-600 group-hover:text-orange-700 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Expert Team</h3>
            <p className="text-gray-600 leading-relaxed">Certified technicians with years of experience and ongoing training</p>
            <div className="mt-6 w-16 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="relative mt-20 mb-8">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-50 via-blue-50 to-orange-50 rounded-3xl transform -rotate-1"></div>
          <div className="relative bg-white rounded-3xl shadow-2xl p-8 lg:p-12 border border-gray-100">
            {/* Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">Have questions or need immediate assistance? We're here to help you with all your repair needs.</p>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full mx-auto mt-6"></div>
            </div>

            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Contact */}
                <div className="group text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Email Us</h3>
                  <a href="mailto:hi@cleannest.com" className="text-gray-600 hover:text-orange-600 transition-colors duration-300 font-medium text-lg">
                    hi@cleannest.com
                  </a>
                  <p className="text-sm text-gray-500 mt-2">We'll respond within 24 hours</p>
                </div>

                {/* Telephone */}
                <div className="group text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Call Us</h3>
                  <a href="tel:+12124258617" className="text-gray-600 hover:text-orange-600 transition-colors duration-300 font-medium text-lg">
                    +1 212 425 8617
                  </a>
                  <p className="text-sm text-gray-500 mt-2">Mon-Sat, 9AM-6PM EST</p>
                </div>

                {/* Based in */}
                <div className="group text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start mb-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-md">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-orange-700 transition-colors duration-300">Visit Us</h3>
                  <p className="text-gray-600 font-medium text-lg leading-relaxed">
                    4517 Washington Ave.<br />
                    Manchester, Kentucky 39495
                  </p>
                  <p className="text-sm text-gray-500 mt-2">Free pickup & delivery available</p>
                </div>

              </div>

              {/* Additional CTA Section */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-gray-600 mb-6">Need immediate assistance? Our support team is ready to help!</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                      Start Live Chat
                    </button>
                    <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300">
                      Schedule Callback
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-orange-100 to-transparent rounded-full opacity-50"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-br from-blue-100 to-transparent rounded-full opacity-50"></div>
          </div>
        </div>
      </div>
    </div>

  );
}