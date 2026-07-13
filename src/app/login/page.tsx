'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'
import { 
  GraduationCap, Lock, Mail, Loader2, UserCheck, 
  ShieldCheck, ArrowRight, ChevronLeft, ShieldAlert, KeyRound 
} from 'lucide-react'

type LoginStep = 'EMAIL' | 'PASSWORD' | 'OTP'

export default function LoginPage() {
  const { user, login } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'STUDENT' | 'ADMIN'>('STUDENT')
  
  // Amazon login steps
  const [step, setStep] = useState<LoginStep>('EMAIL')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showGoogleModal, setShowGoogleModal] = useState(false)

  // OTP Verification States
  const [otpCode, setOtpCode] = useState<string[]>(Array(6).fill(''))
  const [generatedOtp, setGeneratedOtp] = useState('')
  const [resendTimer, setResendTimer] = useState(60)

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push(user.role === 'ADMIN' ? '/admin' : '/dashboard')
    }
  }, [user])

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (step === 'OTP' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [step, resendTimer])

  // Move from Email step to Password step
  const handleEmailContinue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    
    // Simple email regex check
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    if (!isEmailValid) {
      setError('Please enter a valid email address.')
      return
    }
    setError('')
    setStep('PASSWORD')
  }

  // Handle standard password sign-in
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) return

    setLoading(true)
    setError('')

    try {
      const success = await login(email, password, role)
      if (success) {
        toast('Logged in successfully!', 'success')
        router.refresh()
      } else {
        setError('Authentication failed. Check your password or try another email.')
      }
    } catch (err) {
      setError('An unexpected connection error occurred.')
    } finally {
      setLoading(false)
    }
  }

  // Trigger Mock OTP delivery
  const handleSendOtp = () => {
    setError('')
    setLoading(true)
    
    // Generate a random 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setGeneratedOtp(code)
    setResendTimer(60)

    setTimeout(() => {
      setLoading(false)
      setStep('OTP')
      toast(`🔐 SECURITY CODE: Your ProjectHub verification code is ${code}. It expires in 10 minutes.`, 'success')
    }, 900)
  }

  // Verify OTP input
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    const entered = otpCode.join('')
    if (entered.length < 6) {
      setError('Please fill in the 6-digit OTP code.')
      return
    }

    if (entered !== generatedOtp) {
      setError('The security code you entered is invalid.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Log in with mock session
      const success = await login(email, 'password123', role)
      if (success) {
        toast('OTP verified successfully!', 'success')
        router.refresh()
      } else {
        setError('Failed to establish session credentials.')
      }
    } catch (err) {
      setError('Connection timeout verifying token.')
    } finally {
      setLoading(false)
    }
  }

  // Handle individual digit input focus shifting
  const handleOtpChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    const newOtp = [...otpCode]
    newOtp[index] = element.value
    setOtpCode(newOtp)

    // Focus next input box
    if (element.value !== '' && element.nextSibling) {
      (element.nextSibling as HTMLInputElement).focus()
    }
  }

  // Dynamic Google Login handler
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

  const handleGoogleLogin = async (googleEmail: string, googleName: string) => {
    setShowGoogleModal(false)
    setLoading(true)
    setError('')

    try {
      const success = await login(googleEmail, 'password123', 'STUDENT')
      if (success) {
        toast(`Welcome back, ${googleName}! Successfully logged in via Google.`, 'success')
        router.refresh()
      } else {
        setError('Google authentication failed.')
      }
    } catch (err) {
      setError('Connection timeout on Google authorization servers.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-grid-pattern dark:bg-slate-950">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-8 rounded-3xl shadow-xl animate-in fade-in duration-300 relative text-left">
        
        {/* Header Logo */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md mx-auto">
            <GraduationCap className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-black tracking-tight dark:text-white">ProjectHub Verification</h2>
          <p className="text-xs text-slate-400">Secure student identity & e-portfolio compiler access</p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-955/20 border border-red-200/35 dark:border-red-900/40 text-red-600 dark:text-red-400 text-xs p-3.5 rounded-xl font-semibold mb-4">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* Step 1: Email Identification */}
          {step === 'EMAIL' && (
            <motion.form
              key="email-step"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onSubmit={handleEmailContinue}
              className="space-y-4"
            >
              {/* Role selector tab */}
              <div className="grid grid-cols-2 gap-2 border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setRole('STUDENT')}
                  className={`flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'STUDENT'
                      ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <UserCheck className="h-4 w-4" />
                  <span>Student</span>
                </button>
                
                <button
                  type="button"
                  onClick={() => setRole('ADMIN')}
                  className={`flex items-center justify-center space-x-1.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    role === 'ADMIN'
                      ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Admin</span>
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-550" htmlFor="email">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@gmail.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 pl-11 pr-3 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 shadow-md shadow-blue-500/10 cursor-pointer gap-1.5"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
                <span className="flex-shrink mx-4 text-slate-500 text-[10px] font-bold uppercase tracking-wider">or</span>
                <div className="flex-grow border-t border-slate-100 dark:border-slate-800"></div>
              </div>

              {/* Google Sign-in */}
              <button
                type="button"
                onClick={onGoogleClick}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-250 text-xs font-bold py-3.5 transition-colors cursor-pointer shadow-sm gap-2"
              >
                {loading ? (
                  <Loader2 className="h-4.5 w-4.5 animate-spin text-slate-400" />
                ) : (
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z" />
                  </svg>
                )}
                <span>Continue with Google</span>
              </button>

              <div className="text-center text-xs text-slate-500 pt-2">
                <span>First time here? </span>
                <Link href="/signup" className="text-blue-500 font-bold hover:underline">Create a student account</Link>
              </div>
            </motion.form>
          )}

          {/* Step 2: Password Verification */}
          {step === 'PASSWORD' && (
            <motion.form
              key="password-step"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {/* Back Link */}
              <button 
                type="button" 
                onClick={() => setStep('EMAIL')}
                className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 hover:text-blue-500 transition-colors"
              >
                <ChevronLeft className="h-4.5 w-4.5" /> Change email ({email})
              </button>

              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-bold text-slate-550 animate-fade-in" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="password"
                    id="password"
                    required
                    autoFocus
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 pl-11 pr-3 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-500 pt-0.5">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-blue-600 focus:ring-0" />
                  <span>Keep me signed in</span>
                </label>
                <button type="button" className="hover:underline font-bold text-blue-500">Forgot Password?</button>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Default password is: <span className="font-bold text-blue-500">{role === 'ADMIN' ? 'adminPassword123' : 'password123'}</span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 shadow-md shadow-blue-500/10 cursor-pointer"
              >
                {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                <span>Sign In</span>
              </button>

              {/* OTP Alternative Choice */}
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/20 dark:bg-slate-900/10 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-250 text-xs font-bold py-3 transition-colors cursor-pointer gap-1.5 shadow-sm"
              >
                <KeyRound className="h-4.5 w-4.5 text-blue-500" />
                <span>Get OTP Code on Email</span>
              </button>
            </motion.form>
          )}

          {/* Step 3: OTP Verification Grid */}
          {step === 'OTP' && (
            <motion.form
              key="otp-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onSubmit={handleVerifyOtp}
              className="space-y-6 text-center"
            >
              <div className="space-y-1.5 text-left">
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest block">Two-Factor Authentication</span>
                <h3 className="text-sm font-extrabold dark:text-white">Verify Security Code</h3>
                <p className="text-[11px] text-slate-500 leading-relaxed">
                  We have dispatched a 6-digit OTP code to <span className="font-bold text-slate-800 dark:text-slate-200">{email}</span>. Please input it below.
                </p>
              </div>

              {/* 6 Digit Box input grid */}
              <div className="flex justify-between gap-2 max-w-xs mx-auto">
                {otpCode.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={data}
                    onChange={e => handleOtpChange(e.target, index)}
                    onFocus={e => e.target.select()}
                    className="w-10 h-12 text-center text-lg font-bold rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-slate-950 dark:text-white"
                  />
                ))}
              </div>

              <div className="space-y-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-3.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  <span>Verify Code & Sign In</span>
                </button>

                <div className="text-[10px] text-slate-500">
                  {resendTimer > 0 ? (
                    <p>Resend code available in <span className="font-bold text-slate-800 dark:text-slate-200">{resendTimer}s</span></p>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleSendOtp}
                      className="text-blue-500 font-bold hover:underline cursor-pointer"
                    >
                      Resend Verification Code
                    </button>
                  )}
                </div>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

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
                    onClick={() => handleGoogleLogin(acc.email, acc.name)}
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
