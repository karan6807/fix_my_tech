/* eslint-disable react/no-unescaped-entities */

'use client';
import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete, disabled }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (disabled) return;
    
    const newOtp = [...otp];
    
    // Handle pasted content
    if (value.length > 1) {
      const pastedData = value.slice(0, length);
      for (let i = 0; i < length; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtp(newOtp);
      
      // Focus on the last filled input or the first empty one
      const lastFilledIndex = Math.min(pastedData.length - 1, length - 1);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      // Handle single character input
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Move to next input
      if (value !== '' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
    
    // Check if OTP is complete
    const otpValue = newOtp.join('');
    if (otpValue.length === length) {
      onComplete(otpValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-3 justify-center">
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(ref) => {
            inputRefs.current[index] = ref;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value.replace(/[^0-9]/g, ''))}
          onKeyDown={(e) => handleKeyDown(index, e)}
          disabled={disabled}
          className="w-14 h-14 text-center text-xl font-semibold text-black border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
      ))}
    </div>
  );
};

export default function AdminVerifyOTPPage() {
  const [otp, setOtp] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);
  const [adminAuth, setAdminAuth] = useState<{ adminId: string; email: string } | null>(null);
  const router = useRouter();
  const { login } = useAdminAuth();

  useEffect(() => {
    // Get admin auth data from sessionStorage
    const authData = sessionStorage.getItem('adminAuth');
    if (!authData) {
      router.push('/admin/auth/signin');
      return;
    }
    
    try {
      const parsedAuth = JSON.parse(authData);
      setAdminAuth(parsedAuth);
    } catch (error) {
      console.error('Invalid auth data:', error);
      router.push('/admin/auth/signin');
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleOTPComplete = (otpValue: string) => {
    setOtp(otpValue);
    setError('');
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (!adminAuth) {
      setError('Authentication data missing. Please sign in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          otp,
          adminId: adminAuth.adminId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'OTP verification failed');
      }

      // Clear session storage
      sessionStorage.removeItem('adminAuth');
      
      // Update the auth context with the admin data
      if (data.admin) {
        login({
          id: data.admin.id,
          name: data.admin.name,
          email: data.admin.email,
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      
      // Set success state
      setSuccess(true);
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/admin/dashboard');
      }, 1500);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend || !adminAuth) return;

    setIsResending(true);
    setError('');
    setOtp('');

    try {
      const response = await fetch('/api/admin/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          adminId: adminAuth.adminId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to resend OTP');
      }

      // Reset countdown
      setCountdown(60);
      setCanResend(false);

    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsResending(false);
    }
  };

  const handleGoBack = () => {
    sessionStorage.removeItem('adminAuth');
    router.push('/admin/auth/signin');
  };

  if (!adminAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verification Successful!</h2>
            <p className="text-gray-600 mb-6">You will be redirected to the admin dashboard shortly.</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* OTP Verification Form */}
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Verify Your Identity</h2>
            <p className="text-gray-600">
              We've sent a 6-digit verification code to
            </p>
            <p className="text-gray-900 font-medium flex items-center justify-center mt-2">
              <Mail className="w-4 h-4 mr-2 text-orange-600" />
              {adminAuth.email}
            </p>
          </div>

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter Verification Code
              </label>
              <OTPInput 
                length={6} 
                onComplete={handleOTPComplete}
                disabled={isLoading}
              />
              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.length !== 6}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Verifying...
                </>
              ) : (
                'Verify Code'
              )}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <button
                  onClick={handleResendOTP}
                  disabled={isResending}
                  className="inline-flex items-center text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      Resending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Resend Code
                    </>
                  )}
                </button>
              ) : (
                <p className="text-sm text-gray-400">
                  Resend code in {countdown}s
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Need help? Contact{' '}
              <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
                IT Support
              </a>
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