/* eslint-disable react/no-unescaped-entities */

'use client';
import React, { useState } from 'react';
import { Mail, ArrowLeft, Shield, Send, CheckCircle } from 'lucide-react';

interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

export default function ForgotPasswordPage() {
  const [formData, setFormData] = useState<FormData>({
    email: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isEmailSent, setIsEmailSent] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        // Redirect to OTP verification page
        window.location.href = `/admin/auth/verify-otp?email=${encodeURIComponent(formData.email)}&purpose=password_reset`;
      } else {
        const data = await response.json();
        setErrors({ email: data.error || 'Failed to send OTP' });
      }
    } catch (error) {
      setErrors({ email: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoBack = () => {
    window.location.href = '/admin/auth/signin';
  };

  const handleResendEmail = () => {
    // TODO: Implement resend email functionality
    console.log('Resending email to:', formData.email);
    setIsEmailSent(false);
    const mockEvent = {
      preventDefault: () => {}
    } as React.MouseEvent<HTMLButtonElement>;
    handleSubmit(mockEvent);
  };

  if (isEmailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Back Button */}
            <button
              onClick={handleGoBack}
              className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </button>

            {/* Success Content */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Check Your Email</h2>
              <p className="text-gray-600 mb-4">
                We've sent password reset instructions to
              </p>
              <p className="text-gray-900 font-medium flex items-center justify-center mb-6">
                <Mail className="w-4 h-4 mr-2 text-orange-600" />
                {formData.email}
              </p>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or
                </p>
                <button
                  onClick={handleResendEmail}
                  className="text-orange-600 hover:text-orange-500 font-medium transition-colors"
                >
                  Resend Email
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Need help? Contact{' '}
                <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                  IT Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Back Button */}
          <button
            onClick={handleGoBack}
            className="flex items-center text-orange-600 hover:text-orange-700 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </button>

          {/* Header inside card */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-600 rounded-xl mb-4 shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TechService</h1>
            <p className="text-gray-600">Admin Panel Access</p>
          </div>

          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Forgot Password?</h2>
            <p className="text-gray-600">
              Enter your email address and we'll send you instructions to reset your password.
            </p>
          </div>

          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="admin@techservice.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending Instructions...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Reset Instructions
                </>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Remember your password?{' '}
              <button 
                onClick={handleGoBack}
                className="font-medium text-orange-600 hover:text-orange-500"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center px-3 py-2 rounded-lg bg-orange-50 border border-orange-200">
            <Shield className="w-4 h-4 text-orange-600 mr-2" />
            <span className="text-sm text-orange-700">Secure Admin Access</span>
          </div>
        </div>
      </div>
    </div>
  );
}