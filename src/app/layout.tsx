// src/app/layout.tsx
'use client';
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { AuthProvider } from '../contexts/AuthContext'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const inter = Inter({ subsets: ['latin'] })


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Check if current route is an admin or employee route
  const isAdminRoute = pathname?.startsWith('/admin')
  const isEmployeeRoute = pathname?.startsWith('/employee-frontend')
  const isSpecialRoute = isAdminRoute || isEmployeeRoute

  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* Only show main navbar and footer if NOT on admin or employee routes */}
          {!isSpecialRoute && <Navbar />}
          <main className={!isSpecialRoute ? "min-h-screen" : ""}>
            {children}
          </main>
          {!isSpecialRoute && <Footer />}
        </AuthProvider>
      </body>
    </html>
  )
}