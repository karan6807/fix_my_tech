'use client';
import React, { useState, useRef, useEffect } from 'react';
import { Shield, ArrowLeft, RotateCcw } from 'lucide-react';

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Get employeeId from URL params
  const [employeeId, setEmployeeId] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('employeeId');
    if (id) {
      setEmployeeId(id);
    }
  }, []);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Only take the last character
    setOtp(newOtp);

    // Clear error when user starts typing
    if (error) setError('');

    // Move to next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input on backspace if current input is empty
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'Enter') {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    
    for (let i = 0; i < 6; i++) {
      newOtp[i] = pastedData[i] || '';
    }
    setOtp(newOtp);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (!employeeId) {
      setError('Employee ID not found. Please try signing in again.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/employee/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId,
          otp: otpString
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect to employee dashboard
        window.location.href = '/employee-frontend/dashboard';
      } else {
        setError(data.error || 'Invalid OTP. Please try again.');
      }
    } catch (error) {
      setError('Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || !employeeId) return;

    setCanResend(false);
    setTimer(60);
    setError('');
    setOtp(['', '', '', '', '', '']);

    try {
      const response = await fetch('/api/employee/auth/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employeeId,
          type: 'verification'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - OTP resent
      } else {
        setError(data.error || 'Error sending OTP. Please try again.');
        setCanResend(true);
        setTimer(0);
      }
    } catch (error) {
      setError('Error sending OTP. Please try again.');
      setCanResend(true);
      setTimer(0);
    }
  };

  const handleBackToLogin = () => {
    window.location.href = '/employee-frontend/auth/signin';
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <button
          onClick={handleBackToLogin}
          className="mb-6 flex items-center text-orange-600 hover:text-orange-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Login
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-orange-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
            <p className="text-gray-600 mb-1">
              We've sent a 6-digit code to
            </p>
            <p className="text-orange-600 font-medium">{email || 'your email'}</p>
          </div>

          {/* OTP Input */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter the 6-digit code
              </label>
              <div className="flex justify-center space-x-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className={`w-12 h-12 text-center text-xl font-bold border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                      error ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
              {error && (
                <p className="mt-3 text-sm text-red-600 text-center">{error}</p>
              )}
            </div>

            {/* Timer and Resend */}
            <div className="text-center">
              {!canResend ? (
                <p className="text-gray-600">
                  Resend OTP in <span className="font-medium text-orange-600">{formatTime(timer)}</span>
                </p>
              ) : (
                <button
                  onClick={handleResend}
                  className="flex items-center justify-center mx-auto text-orange-600 hover:text-orange-700 font-medium transition-colors"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Resend OTP
                </button>
              )}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerify}
              disabled={isLoading || otp.join('').length !== 6}
              className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            {/* Help Text */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <p className="text-sm text-orange-700 text-center">
                Didn't receive the code? Check your spam folder or try resending after the timer expires.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}