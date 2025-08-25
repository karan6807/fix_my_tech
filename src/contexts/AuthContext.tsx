'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  email_verified: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUser: async () => {},
  isAuthenticated: false
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      console.log('Refreshing user...')

      // Verify token and get user info (token is read from httpOnly cookie)
      const response = await fetch('/api/auth/me', {
        credentials: 'include' // Include cookies in the request
      })

      console.log('Auth response status:', response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log('User data received:', userData.user)
        setUser(userData.user)
      } else {
        // Token is invalid or expired
        console.log('No valid token found')
        setUser(null)
      }
    } catch (error) {
      console.error('Error refreshing user:', error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Check for existing auth on mount
    console.log('AuthContext: Initial user check')
    refreshUser()
  }, [])

  const signOut = async () => {
    try {
      console.log('Signing out user')
      
      // Call logout API to clear httpOnly cookie
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
      
      // Redirect to home page
      router.push('/')
    } catch (error) {
      console.error('Error signing out:', error)
      setUser(null)
      router.push('/')
    }
  }

  const value = {
    user,
    loading,
    signOut,
    refreshUser,
    isAuthenticated: !!user && !loading
  }

  console.log('AuthContext current state:', {
    user: user ? user.name : 'null',
    loading,
    isAuthenticated: value.isAuthenticated
  })

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}