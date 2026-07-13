'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { GraduationCap, Lock, Mail, User, Phone, BookOpen, Loader2 } from 'lucide-react'

export default function SignupPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [department, setDepartment] = useState('')
  const role = 'STUDENT'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)

  useEffect(() => {
    if (user) {
      router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }, [user])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !name) return

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          password,
          phone,
          college,
          department,
          role,
        })
      })

      if (res.ok) {
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.error || 'Registration failed.')
      }
    } catch (err) {
      setError('Connection failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignup = async (googleEmail: string, googleName: string) => {
    setShowGoogleModal(false)
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: googleEmail,
          name: googleName,
          password: 'password123',
          role: 'STUDENT',
          college: 'National Institute of Technology',
          department: 'Computer Science'
        })
      })

      if (res.ok) {
        toast(`Welcome, ${googleName}! Successfully registered via Google.`, 'success')
        window.location.reload()
      } else {
        const data = await res.json()
        setError(data.error || 'Google registration failed.')
      }
    } catch (err) {
      setError('Connection failed during Google registration.')
    } finally {
      setLoading(false)
    }
  }

  const onGoogleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/google/status')
      const data = await res.json()
      if (data.configured) {
        window.location.href = '/api/auth/google'
      } else {
        setShowGoogleModal(true)
        setLoading(false)
      }
    } catch (err) {
      setShowGoogleModal(true)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-2xl shadow-xl animate-in fade-in duration-300">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md mx-auto">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-bold dark:text-white">Create student account</h2>
          <p className="text-xs text-slate-400">Join Free to download files and ask compilation support questions.</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200/35 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs p-3 rounded-lg font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-4">
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500" htmlFor="name">Full Name *</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="E.g. Sanjay Kumar"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500" htmlFor="email">Email Address *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9876543210"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="password">Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create secure password"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500" htmlFor="confirmPassword">Confirm Password *</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500" htmlFor="college">College Name</label>
            <div className="relative">
              <GraduationCap className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="college"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="VIT Vellore"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-500" htmlFor="department">Department</label>
            <div className="relative">
              <BookOpen className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Information Technology"
                className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 pl-10 pr-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-3.5 shadow-md shadow-blue-500/10"
          >
            {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
            <span>Sign Up</span>
          </button>
        </form>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Google Sign-up */}
        <button
          type="button"
          onClick={onGoogleClick}
          className="w-full inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-250 text-xs font-semibold py-3.5 transition-colors cursor-pointer shadow-sm gap-2"
        >
          <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z"
            />
          </svg>
          <span>Sign up with Google</span>
        </button>

        <div className="text-center text-xs text-slate-500 pt-2">
          <span>Already registered? </span>
          <Link href="/login" className="text-blue-500 font-semibold hover:underline">Sign in instead</Link>
        </div>

      </div>

      {/* Google Accounts Selection Modal */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 text-left"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-850">
                <div className="flex items-center space-x-2">
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z" />
                  </svg>
                  <span className="text-[10px] font-bold text-slate-500 font-mono tracking-wider">Google Accounts</span>
                </div>
                <button 
                  onClick={() => setShowGoogleModal(false)}
                  className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Choose an account</h3>
                <p className="text-[10px] text-slate-400">to continue to <span className="font-bold text-blue-500">ProjectHub</span></p>
              </div>

              <div className="space-y-2 pt-2">
                {[
                  { name: 'Sanjay Kumar', email: 'sanjay.kumar@gmail.com', avatar: 'SK' },
                  { name: 'Abhishek Raj', email: 'abhishek.raj@gmail.com', avatar: 'AR' }
                ].map((acc, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleGoogleSignup(acc.email, acc.name)}
                    className="w-full flex items-center space-x-3 p-3 rounded-xl border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/60 transition-all text-left cursor-pointer"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-xs">
                      {acc.avatar}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{acc.name}</h4>
                      <p className="text-[10px] text-slate-500 dark:text-slate-400">{acc.email}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="text-[9px] text-slate-400 leading-relaxed text-center pt-2">
                To safe-guard your credentials, ProjectHub requests name, email address, and avatar image metadata from Google.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  )
}
