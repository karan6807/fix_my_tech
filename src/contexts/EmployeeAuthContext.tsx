'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface Employee {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  department: string
  position: string
  isVerified: boolean
  isActive: boolean
  createdAt: string
  lastLogin?: string
}

interface EmployeeAuthContextType {
  employee: Employee | null
  loading: boolean
  signOut: () => Promise<void>
  refreshEmployee: () => Promise<void>
  isAuthenticated: boolean
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType>({
  employee: null,
  loading: true,
  signOut: async () => {},
  refreshEmployee: async () => {},
  isAuthenticated: false
})

export function EmployeeAuthProvider({ children }: { children: ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshEmployee = async () => {
    try {
      const response = await fetch('/api/employee/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const data = await response.json()
        setEmployee(data.employee)
      } else {
        setEmployee(null)
      }
    } catch (error) {
      console.error('Error refreshing employee:', error)
      setEmployee(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshEmployee()
  }, [])

  const signOut = async () => {
    try {
      await fetch('/api/employee/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      setEmployee(null)
      router.push('/employee-frontend/auth/signin')
    } catch (error) {
      console.error('Error signing out employee:', error)
      setEmployee(null)
      router.push('/employee-frontend/auth/signin')
    }
  }

  const value = {
    employee,
    loading,
    signOut,
    refreshEmployee,
    isAuthenticated: !!employee && !loading
  }

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  )
}

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext)
  if (!context) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider')
  }
  return context
}