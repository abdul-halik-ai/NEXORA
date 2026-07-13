'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthUser {
  id: string
  email: string
  name: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN'
  college?: string | null
  department?: string | null
  year?: string | null
  phone?: string | null
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password?: string, role?: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN') => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const refreshUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (err) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const login = async (
    email: string, 
    password?: string, 
    role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN' = 'STUDENT'
  ): Promise<boolean> => {
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      })
      if (res.ok) {
        await refreshUser()
        return true
      }
      return false
    } catch (err) {
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      router.push('/')
      router.refresh()
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
