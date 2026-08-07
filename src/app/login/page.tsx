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
      toast(`🔐 SECURITY CODE: Your Nexora verification code is ${code}. It expires in 10 minutes.`, 'success')
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
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-slate-950 overflow-hidden">
      
      {/* Left Panel: Branding & Animated Visuals */}
      <div className="hidden md:flex flex-1 relative overflow-hidden bg-slate-950 items-center justify-center">
        {/* Animated Background Gradient/Orbs */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900 to-black z-0"></div>
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[40%] left-[50%] w-72 h-72 bg-cyan-500/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Glassmorphic Brand Card */}
        <div className="relative z-10 w-full max-w-lg p-10 rounded-[2.5rem] border border-white/10 bg-white/5 backdrop-blur-md shadow-2xl mx-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl overflow-hidden shadow-lg shadow-blue-500/30 bg-black/20 border border-white/10 p-1 hover:scale-110 hover:-rotate-3 hover:shadow-blue-500/50 transition-all duration-300 ease-out cursor-pointer">
              <img src="/logo.png" alt="Nexora Logo" className="h-full w-full object-cover rounded-xl" />
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl font-black text-white tracking-tight leading-tight">
                The Next Era of <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400">
                  Learning.
                </span>
              </h1>
              <p className="text-slate-300 text-sm leading-relaxed max-w-sm">
                Access premium engineering projects, request custom software solutions, and leverage AI-powered study materials, all in one modern ecosystem.
              </p>
            </div>

            <div className="pt-6 border-t border-white/10 flex items-center gap-6 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-blue-500/20 text-blue-400"><ShieldCheck className="h-4 w-4"/></div>
                Secure Access
              </div>
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-md bg-violet-500/20 text-violet-400"><UserCheck className="h-4 w-4"/></div>
                Verified Profiles
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Panel: Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative bg-slate-50 dark:bg-slate-950">
        
        <div className="w-full max-w-md space-y-8 relative z-10">
          
          {/* Mobile Logo */}
          <div className="md:hidden text-center mb-8">
             <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl overflow-hidden shadow-md mx-auto mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 hover:scale-110 hover:-rotate-3 hover:shadow-blue-500/50 transition-all duration-300 ease-out cursor-pointer">
              <img src="/logo.png" alt="Nexora Logo" className="h-full w-full object-cover rounded-xl" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome Back</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Please sign in to your account to continue.</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-50 dark:bg-red-950/40 border border-red-200/50 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs p-4 rounded-2xl font-semibold shadow-sm flex items-start gap-3">
              <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5 text-red-500" />
              <span className="leading-relaxed">{error}</span>
            </motion.div>
          )}

          <div className="bg-white dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/80 p-6 md:p-8 rounded-[2rem] shadow-xl backdrop-blur-xl">
            <AnimatePresence mode="wait">
              {/* Step 1: Email Identification */}
              {step === 'EMAIL' && (
                <motion.form
                  key="email-step"
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 15 }}
                  onSubmit={handleEmailContinue}
                  className="space-y-5"
                >
                  {/* Role selector tab */}
                  <div className="grid grid-cols-2 gap-2 border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 p-1.5 rounded-2xl">
                    <button
                      type="button"
                      onClick={() => setRole('STUDENT')}
                      className={`flex items-center justify-center space-x-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        role === 'STUDENT'
                          ? 'bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <UserCheck className="h-4 w-4" />
                      <span>Student</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setRole('ADMIN')}
                      className={`flex items-center justify-center space-x-2 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                        role === 'ADMIN'
                          ? 'bg-white dark:bg-slate-800 text-violet-600 dark:text-violet-400 shadow-sm border border-slate-200/50 dark:border-slate-700/50'
                          : 'text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                      }`}
                    >
                      <ShieldCheck className="h-4 w-4" />
                      <span>Admin</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="email">Email Address</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="email"
                        id="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@example.com"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold py-4 shadow-lg shadow-blue-500/25 cursor-pointer gap-2 transition-all hover:-translate-y-0.5"
                  >
                    <span>Continue with Email</span>
                    <ArrowRight className="h-4.5 w-4.5" />
                  </button>

                  <div className="relative flex py-3 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  </div>

                  {/* Google Sign-in */}
                  <button
                    type="button"
                    onClick={onGoogleClick}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold py-4 transition-all cursor-pointer shadow-sm gap-3 hover:-translate-y-0.5"
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                    ) : (
                      <svg className="h-5 w-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z" />
                      </svg>
                    )}
                    <span>Continue with Google</span>
                  </button>

                  <div className="text-center text-xs text-slate-500 pt-3">
                    <span>First time here? </span>
                    <Link href="/signup" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">Create a student account</Link>
                  </div>
                </motion.form>
              )}

              {/* Step 2: Password Verification */}
              {step === 'PASSWORD' && (
                <motion.form
                  key="password-step"
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  {/* Back Link */}
                  <button 
                    type="button" 
                    onClick={() => setStep('EMAIL')}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-900/50 py-1.5 px-3 rounded-full border border-slate-200 dark:border-slate-800"
                  >
                    <ChevronLeft className="h-4 w-4" /> Change email <span className="font-medium opacity-70 border-l border-slate-300 dark:border-slate-700 pl-1.5 ml-1">{email}</span>
                  </button>

                  <div className="space-y-2 pt-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300" htmlFor="password">Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-3.5 h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                      <input
                        type="password"
                        id="password"
                        required
                        autoFocus
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-slate-900 dark:text-white transition-all shadow-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-blue-600 focus:ring-0 h-4 w-4" />
                      <span className="font-medium">Keep me signed in</span>
                    </label>
                    <button type="button" className="hover:underline font-bold text-blue-600 dark:text-blue-400 transition-colors">Forgot Password?</button>
                  </div>
                  <div className="text-[10px] text-slate-400/80 mt-1 bg-slate-50 dark:bg-slate-950/50 p-2 rounded-lg border border-slate-100 dark:border-slate-900">
                    Default password is: <span className="font-bold text-blue-500 dark:text-blue-400">{role === 'ADMIN' ? 'adminPassword123' : 'password123'}</span>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold py-4 shadow-lg shadow-blue-500/25 cursor-pointer transition-all hover:-translate-y-0.5"
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <span>Secure Sign In</span>
                  </button>

                  <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                    <span className="flex-shrink mx-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">or</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
                  </div>

                  {/* OTP Alternative Choice */}
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-sm font-bold py-3.5 transition-all cursor-pointer gap-2 shadow-sm hover:-translate-y-0.5"
                  >
                    <KeyRound className="h-5 w-5 text-blue-500" />
                    <span>Get Magic Link / OTP Code</span>
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
                  className="space-y-8 text-center"
                >
                  <div className="space-y-2 text-left">
                    <span className="inline-block px-2.5 py-1 rounded-full bg-blue-500/10 text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">Two-Factor Auth</span>
                    <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">Verify Security Code</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      We have dispatched a 6-digit OTP code to <span className="font-bold text-slate-800 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">{email}</span>. Please input it below.
                    </p>
                  </div>

                  {/* 6 Digit Box input grid */}
                  <div className="flex justify-between gap-3 max-w-sm mx-auto">
                    {otpCode.map((data, index) => (
                      <input
                        key={index}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        className="w-12 h-14 text-center text-xl font-black rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 focus:bg-white dark:focus:bg-slate-900 focus:ring-0 focus:border-blue-500 text-slate-900 dark:text-white transition-all shadow-sm"
                      />
                    ))}
                  </div>

                  <div className="space-y-5">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center rounded-2xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-bold py-4 shadow-lg shadow-blue-500/25 cursor-pointer transition-all hover:-translate-y-0.5"
                    >
                      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      <span>Verify Code & Sign In</span>
                    </button>

                    <div className="text-xs text-slate-500">
                      {resendTimer > 0 ? (
                        <p>Resend code available in <span className="font-bold text-slate-800 dark:text-slate-200">{resendTimer}s</span></p>
                      ) : (
                        <button 
                          type="button" 
                          onClick={handleSendOtp}
                          className="text-blue-600 dark:text-blue-400 font-bold hover:underline cursor-pointer"
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
        </div>

        {/* Google Accounts Selection Modal */}
        <AnimatePresence>
          {showGoogleModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="w-full max-w-sm bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-7 shadow-2xl space-y-5 text-left backdrop-blur-xl"
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800/80">
                  <div className="flex items-center space-x-2.5">
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.13-4.53z" />
                    </svg>
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300 font-mono tracking-wider">Google Accounts</span>
                  </div>
                  <button 
                    onClick={() => setShowGoogleModal(false)}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-base font-extrabold text-slate-800 dark:text-white tracking-tight">Choose an account</h3>
                  <p className="text-[11px] text-slate-500 font-medium">to continue to <span className="font-bold text-blue-600 dark:text-blue-400">Nexora</span></p>
                </div>

                <div className="space-y-2.5 pt-2">
                  {[
                    { name: 'Sanjay Kumar', email: 'sanjay.kumar@gmail.com', avatar: 'SK' },
                    { name: 'Abhishek Raj', email: 'abhishek.raj@gmail.com', avatar: 'AR' }
                  ].map((acc, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleGoogleLogin(acc.email, acc.name)}
                      className="w-full flex items-center space-x-3.5 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 hover:border-blue-500/30 transition-all text-left cursor-pointer group"
                    >
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {acc.avatar}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">{acc.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{acc.email}</p>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="text-[10px] text-slate-400/80 leading-relaxed text-center pt-3 font-medium">
                  To safeguard your credentials, Nexora requests name, email address, and avatar image metadata from Google.
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}
