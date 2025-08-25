'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useGSAP } from "@gsap/react";
import gsap from "gsap";


const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  const [showSignInMessage, setShowSignInMessage] = useState(false);
  const { user, loading, signOut, isAuthenticated } = useAuth();

  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesMenuRef = useRef<HTMLDivElement>(null);
  const pagesMenuRef = useRef<HTMLDivElement>(null);
  const signInMessageRef = useRef<HTMLDivElement>(null);


  useGSAP(() => {
    gsap.from('#navbar', {
      y: -104.8,
      duration: 1.5,
    })
  })
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (servicesMenuRef.current && !servicesMenuRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (pagesMenuRef.current && !pagesMenuRef.current.contains(event.target as Node)) {
        setIsPagesOpen(false);
      }
      if (signInMessageRef.current && !signInMessageRef.current.contains(event.target as Node)) {
        setShowSignInMessage(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <div id="navbar" className="absolute top-0 left-0 z-50 w-full">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-10 text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>+012 345 6789</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
                <span>info@example.com</span>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-4 text-gray-300">
              <Link href="/" className="hover:text-orange-400 transition-colors">Home</Link>
              <span>/</span>
              <Link href="/terms" className="hover:text-orange-400 transition-colors">Terms</Link>
              <span>/</span>
              <Link href="/privacy" className="hover:text-orange-400 transition-colors">Privacy</Link>
              <span>/</span>
              <Link href="/support" className="hover:text-orange-400 transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="bg-white shadow-lg border-b border-gray-200 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <div className="mr-3">
                  <img
                    src="/Main-Icon.png"
                    alt="FixMyTech Logo"
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                </div>
                <span className="text-2xl font-bold text-slate-900">FixMyTech</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link href="/" className="text-orange-500 hover:text-orange-600 px-3 py-2 text-base font-medium transition-colors duration-200">
                  Home
                </Link>

                <Link href="/about-us" className="text-gray-600 hover:text-orange-500 px-3 py-2 text-base font-medium transition-colors duration-200">
                  About Us
                </Link>

                {/* Our Services Dropdown */}
                <div className="relative" ref={servicesMenuRef}>
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="text-gray-600 hover:text-orange-500 px-3 py-2 text-base font-medium flex items-center transition-colors duration-200"
                  >
                    Our Services
                    <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Services Dropdown Menu - Grid Layout */}
                  {isServicesOpen && (
                    <div className="absolute left-1/2 transform -translate-x-1/2 mt-2 w-[900px] bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                      <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">Our Services</h3>
                        <div className="grid grid-cols-3 gap-3">
                          <Link
                            href="/services/laptop-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium">Laptop Repair</span>
                          </Link>

                          <Link
                            href="/services/smartphone-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
                              </svg>
                            </div>
                            <span className="font-medium">Smartphone Repair</span>
                          </Link>

                          <Link
                            href="/services/tablet-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium">Tablet Repair</span>
                          </Link>

                          <Link
                            href="/services/gaming-console-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-medium">Gaming Console</span>
                          </Link>

                          <Link
                            href="/services/smart-tv-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium">Smart TV Repair</span>
                          </Link>

                          <Link
                            href="/services/headphone-speaker-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5 12h4l3 3h4V9h-4l-3-3H5v6z" />
                              </svg>
                            </div>
                            <span className="font-medium">Audio Devices</span>
                          </Link>

                          <Link
                            href="/services/smartwatch-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <span className="font-medium">Smartwatch Repair</span>
                          </Link>

                          <Link
                            href="/services/desktop-computer-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                              </svg>
                            </div>
                            <span className="font-medium">Desktop Computer</span>
                          </Link>

                          <Link
                            href="/services/gaming-laptop-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium">Gaming Laptop</span>
                          </Link>

                          <Link
                            href="/services/data-recovery"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                              </svg>
                            </div>
                            <span className="font-medium">Data Recovery</span>
                          </Link>

                          <Link
                            href="/services/printer-scanner-repair"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                              </svg>
                            </div>
                            <span className="font-medium">Printer/Scanner</span>
                          </Link>

                          <Link
                            href="/services/wifi-router-networking"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
                              </svg>
                            </div>
                            <span className="font-medium">WiFi & Networking</span>
                          </Link>

                          <Link
                            href="/services/software-installation-virus-removal"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                              </svg>
                            </div>
                            <span className="font-medium">Software & Security</span>
                          </Link>

                          <Link
                            href="/services/battery-replacement"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                              </svg>
                            </div>
                            <span className="font-medium">Battery Replacement</span>
                          </Link>

                          <Link
                            href="/services/cctv-smart-device-setup"
                            className="group flex items-center p-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-all duration-200 border border-transparent hover:border-orange-200"
                            onClick={() => setIsServicesOpen(false)}
                          >
                            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3 group-hover:bg-orange-200 transition-colors duration-200">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className="font-medium">CCTV & Smart Setup</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Pages Dropdown */}
                <div className="relative" ref={pagesMenuRef}>
                  <button
                    onClick={() => setIsPagesOpen(!isPagesOpen)}
                    className="text-gray-600 hover:text-orange-500 px-3 py-2 text-base font-medium flex items-center transition-colors duration-200"
                  >
                    Pages
                    <svg className={`w-4 h-4 ml-1 transform transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Pages Dropdown Menu */}
                  {isPagesOpen && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                      <div className="py-1">
                        <Link
                          href="/locations"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                          onClick={() => setIsPagesOpen(false)}
                        >
                          Locations
                        </Link>
                        <Link
                          href="/blog"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                          onClick={() => setIsPagesOpen(false)}
                        >
                          Blog
                        </Link>
                        <Link
                          href="/testimonials"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                          onClick={() => setIsPagesOpen(false)}
                        >
                          Testimonials
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Desktop Right Side */}
            <div className="hidden md:flex items-center space-x-4">
              {loading ? (
                // Loading state
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                  <div className="w-20 h-8 bg-gray-200 rounded animate-pulse"></div>
                </div>
              ) : isAuthenticated && user ? (
                // Authenticated state - User is logged in
                <div className="flex items-center space-x-4">
                  <Link
                    href="/book-repair"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                  >
                    Book Repair
                  </Link>

                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-2 text-gray-700 hover:text-orange-500 focus:outline-none transition-colors duration-200"
                    >
                      <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {getUserInitials(user.name || 'U')}
                      </div>
                      <span className="text-sm font-medium max-w-24 truncate">{user.name}</span>
                      <svg className={`w-4 h-4 transform transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                        <div className="py-1">
                          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                            <p className="font-medium text-gray-900 truncate">{user.name}</p>
                            <p className="truncate">{user.email}</p>
                          </div>
                          <Link
                            href="/dashboard"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
                            </svg>
                            Dashboard
                          </Link>
                          <Link
                            href="/profile"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                          </Link>
                          <Link
                            href="/bookings"
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v6a2 2 0 002 2h6a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            My Bookings
                          </Link>
                          <div className="border-t border-gray-100">
                            <button
                              onClick={handleSignOut}
                              className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                            >
                              <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                              Sign Out
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                // Not authenticated state - User is NOT logged in
                <div className="flex items-center space-x-3">
                  <div className="relative" ref={signInMessageRef}>
                    <button
                      onClick={() => setShowSignInMessage(!showSignInMessage)}
                      className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                    >
                      Book Repair
                    </button>

                    {showSignInMessage && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                        <div className="p-4">
                          <div className="flex items-center mb-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <h3 className="text-sm font-medium text-gray-900">Sign In Required</h3>
                          </div>
                          <p className="text-sm text-gray-600 mb-4">Please sign in to book a repair service.</p>
                          <Link
                            href="/auth/signin"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 block text-center"
                            onClick={() => setShowSignInMessage(false)}
                          >
                            Sign In
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>

                  <Link
                    href="/auth/signin"
                    className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 border border-gray-300"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-gray-900 p-2 transition-colors duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                <Link href="/" className="text-orange-500 hover:text-orange-600 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>

                <Link href="/about-us" className="text-gray-600 hover:text-orange-500 block px-3 py-2 text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  About Us
                </Link>

                {/* Mobile Services Menu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsServicesOpen(!isServicesOpen)}
                    className="text-gray-600 hover:text-orange-500 flex items-center justify-between w-full px-3 py-2 text-base font-medium"
                  >
                    Our Services
                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isServicesOpen && (
                    <div className="pl-6 space-y-1">
                      <Link href="/services/laptop-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Laptop Repair
                      </Link>
                      <Link href="/services/smartphone-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Smartphone Repair
                      </Link>
                      <Link href="/services/tablet-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Tablet Repair
                      </Link>
                      <Link href="/services/gaming-console-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Gaming Console Repair
                      </Link>
                      <Link href="/services/smart-tv-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Smart TV Repair
                      </Link>
                      <Link href="/services/headphone-speaker-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Headphone/Speaker Repair
                      </Link>
                      <Link href="/services/smartwatch-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Smartwatch Repair
                      </Link>
                      <Link href="/services/desktop-computer-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Desktop Computer Repair
                      </Link>
                      <Link href="/services/gaming-laptop-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Gaming Laptop Repair
                      </Link>
                      <Link href="/services/data-recovery" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Data Recovery
                      </Link>
                      <Link href="/services/printer-scanner-repair" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Printer/Scanner Repair
                      </Link>
                      <Link href="/services/wifi-router-networking" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        WiFi Router & Networking Support
                      </Link>
                      <Link href="/services/software-installation-virus-removal" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Software/OS Installation & Virus Removal
                      </Link>
                      <Link href="/services/battery-replacement" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Battery Replacement Service
                      </Link>
                      <Link href="/services/cctv-smart-device-setup" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        CCTV & Smart Device Setup
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Pages Menu */}
                <div className="space-y-1">
                  <button
                    onClick={() => setIsPagesOpen(!isPagesOpen)}
                    className="text-gray-600 hover:text-orange-500 flex items-center justify-between w-full px-3 py-2 text-base font-medium"
                  >
                    Pages
                    <svg className={`w-4 h-4 transform transition-transform duration-200 ${isPagesOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isPagesOpen && (
                    <div className="pl-6 space-y-1">
                      <Link href="/locations" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Locations
                      </Link>
                      <Link href="/blog" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Blog
                      </Link>
                      <Link href="/testimonials" className="text-gray-500 hover:text-orange-500 block px-3 py-2 text-sm" onClick={() => setIsMenuOpen(false)}>
                        Testimonials
                      </Link>
                    </div>
                  )}
                </div>

                {/* Mobile Contact and Auth Section */}
                <div className="border-t border-gray-200 pt-4 pb-3">
                  {/* Mobile Top Bar Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center px-3 py-2 text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-sm font-medium">+012 345 6789</span>
                    </div>
                    <div className="flex items-center px-3 py-2 text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                      <span className="text-sm">info@example.com</span>
                    </div>
                  </div>

                  {loading ? (
                    <div className="space-y-3 mx-3">
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                    </div>
                  ) : isAuthenticated && user ? (
                    // Mobile Authenticated State
                    <div className="space-y-3 mx-3">
                      <div className="flex items-center space-x-3 px-3 py-2">
                        <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                          {getUserInitials(user.name || 'U')}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      </div>

                      <Link
                        href="/book-repair"
                        className="bg-orange-500 hover:bg-orange-600 text-white block px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors duration-200 w-full"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Book Repair
                      </Link>

                      <div className="space-y-1">
                        <Link
                          href="/dashboard"
                          className="text-gray-600 hover:text-orange-500 block px-4 py-2 text-sm transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Dashboard
                        </Link>
                        <Link
                          href="/profile"
                          className="text-gray-600 hover:text-orange-500 block px-4 py-2 text-sm transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Profile
                        </Link>
                        <Link
                          href="/bookings"
                          className="text-gray-600 hover:text-orange-500 block px-4 py-2 text-sm transition-colors duration-200"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          My Bookings
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="text-red-600 hover:text-red-700 block px-4 py-2 text-sm w-full text-left transition-colors duration-200"
                        >
                          Sign Out
                        </button>
                      </div>
                    </div>
                  ) : (
                    // Mobile Not Authenticated State
                    <div className="space-y-3 mx-3">
                      <button
                        onClick={() => setShowSignInMessage(!showSignInMessage)}
                        className="bg-orange-500 hover:bg-orange-600 text-white block px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors duration-200 w-full"
                      >
                        Book Repair
                      </button>

                      {showSignInMessage && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                          <div className="flex items-center mb-2">
                            <svg className="w-4 h-4 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                            <span className="text-sm font-medium text-orange-800">Sign In Required</span>
                          </div>
                          <p className="text-sm text-orange-700 mb-3">Please sign in to book a repair service.</p>
                          <Link
                            href="/auth/signin"
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 block text-center"
                            onClick={() => {
                              setShowSignInMessage(false);
                              setIsMenuOpen(false);
                            }}
                          >
                            Sign In
                          </Link>
                        </div>
                      )}

                      <Link
                        href="/auth/signin"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 block px-4 py-3 rounded-lg text-sm font-medium text-center transition-colors duration-200 border border-gray-300"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;