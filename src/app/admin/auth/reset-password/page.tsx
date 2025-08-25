/* eslint-disable react/no-unescaped-entities */

'use client';
import React, { useState } from 'react';
import { Lock, Eye, EyeOff, Shield, CheckCircle, ArrowLeft } from 'lucide-react';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
}

export default function ResetPasswordPage() {
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isPasswordReset, setIsPasswordReset] = useState<boolean>(false);

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
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Get email and OTP from URL params
      const urlParams = new URLSearchParams(window.location.search);
      const email = urlParams.get('email');
      const otp = urlParams.get('otp');

      const response = await fetch('/api/admin/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp,
          newPassword: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsPasswordReset(true);
      } else {
        setErrors({ password: data.error || 'Failed to reset password' });
      }
    } catch (error) {
      setErrors({ password: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToSignIn = () => {
    window.location.href = '/admin/auth/signin';
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    let strengthText = 'Very Weak';
    let strengthColor = 'bg-red-500';

    if (password.length >= 8) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;

    switch (strength) {
      case 0:
      case 1:
        strengthText = 'Very Weak';
        strengthColor = 'bg-red-500';
        break;
      case 2:
        strengthText = 'Weak';
        strengthColor = 'bg-orange-500';
        break;
      case 3:
        strengthText = 'Fair';
        strengthColor = 'bg-yellow-500';
        break;
      case 4:
        strengthText = 'Good';
        strengthColor = 'bg-blue-500';
        break;
      case 5:
        strengthText = 'Strong';
        strengthColor = 'bg-green-500';
        break;
    }

    return { strength, strengthText, strengthColor };
  };

  const passwordStrength = getPasswordStrength(formData.password);

  if (isPasswordReset) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            {/* Success Content */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">Password Reset Successful</h2>
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              
              <button
                onClick={handleGoToSignIn}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200"
              >
                Continue to Sign In
              </button>
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
        {/* Reset Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {/* Back Button */}
          <button
            onClick={handleGoToSignIn}
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
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Reset Your Password</h2>
            <p className="text-gray-600">
              Enter your new password below. Make sure it's strong and secure.
            </p>
          </div>

          <div className="space-y-6">
            {/* New Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>

              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">Password Strength:</span>
                    <span className={`text-xs font-medium ${passwordStrength.strengthColor.replace('bg-', 'text-')}`}>
                      {passwordStrength.strengthText}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${passwordStrength.strengthColor}`}
                      style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}

              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-10 py-3 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your new password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Password Requirements:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center ${formData.password.length >= 8 ? 'text-green-600' : ''}`}>
                  <span className={`w-1 h-1 rounded-full mr-2 ${formData.password.length >= 8 ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                  At least 8 characters long
                </li>
                <li className={`flex items-center ${/[a-z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className={`w-1 h-1 rounded-full mr-2 ${/[a-z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                  One lowercase letter
                </li>
                <li className={`flex items-center ${/[A-Z]/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className={`w-1 h-1 rounded-full mr-2 ${/[A-Z]/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                  One uppercase letter
                </li>
                <li className={`flex items-center ${/\d/.test(formData.password) ? 'text-green-600' : ''}`}>
                  <span className={`w-1 h-1 rounded-full mr-2 ${/\d/.test(formData.password) ? 'bg-green-600' : 'bg-gray-400'}`}></span>
                  One number
                </li>
              </ul>
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
                  Resetting Password...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
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