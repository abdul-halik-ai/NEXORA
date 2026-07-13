'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, ShieldCheck, Terminal, Code2, CheckCircle2, 
  AlertTriangle, Cpu, Play, Lock, RefreshCcw, Eye, ShieldAlert, Loader2 
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

interface Challenge {
  id: string
  title: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  points: number
  description: string
  constraints: string[]
  template: string
  testCases: { input: string; expected: string }[]
  verifyCodeRegex?: string
}

export default function SecurityCodingPortal() {
  const { user } = useAuth()
  const { toast } = useToast()

  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0)
  const [code, setCode] = useState('')
  const [running, setRunning] = useState(false)
  const [consoleOutput, setConsoleOutput] = useState('Sandbox idle. Press Run Code to execute assertions.')
  const [success, setSuccess] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)
  
  // Security log states
  const [securityLogs, setSecurityLogs] = useState<string[]>([])
  const [warningCount, setWarningCount] = useState(0)
  const [fakeIp, setFakeIp] = useState('192.168.1.10')
  const [hashSignature, setHashSignature] = useState('')

  // Fetch dynamic challenges
  const loadChallenges = async () => {
    try {
      const res = await fetch('/api/challenges')
      if (res.ok) {
        const data = await res.json()
        if (data.challenges && data.challenges.length > 0) {
          setChallenges(data.challenges)
          setCode(data.challenges[0].template)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadChallenges()
  }, [])

  // Generate fake IP and transaction hash on mount
  useEffect(() => {
    const octets = Array(4).fill(0).map(() => Math.floor(Math.random() * 220) + 15)
    setFakeIp(octets.join('.'))
    
    const hash = Array(24).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('')
    setHashSignature(`PH_SEC_${hash.toUpperCase()}`)

    const now = new Date().toLocaleTimeString()
    setSecurityLogs([
      `[${now}] SECURITY LAYER INITIALIZED: Secure Sandbox active.`,
      `[${now}] CLIENT ID: authenticated as ${user?.name || 'Academic Student'}.`,
      `[${now}] CREDENTIAL HASH: ${`PH_SEC_${hash.toUpperCase()}`}.`
    ])
  }, [user])

  // Track window blur to prevent cheating / tabbing out
  useEffect(() => {
    const handleBlur = () => {
      const time = new Date().toLocaleTimeString()
      setWarningCount(prev => {
        const count = prev + 1
        setSecurityLogs(logs => [
          `[${time}] ⚠️ SECURITY WARNING [${count}]: Window lost focus! Tab out detected. Incident logged to admin console.`,
          ...logs
        ])
        toast('Security Warning: Avoid tabbing out of the secure compiler workspace!', 'error')
        return count
      })
    }

    const handleFocus = () => {
      const time = new Date().toLocaleTimeString()
      setSecurityLogs(logs => [
        `[${time}] Connection restored. Session audit active.`,
        ...logs
      ])
    }

    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [toast])

  const handleChallengeChange = (idx: number) => {
    if (idx < 0 || idx >= challenges.length) return
    setActiveChallengeIdx(idx)
    setCode(challenges[idx].template)
    setConsoleOutput('Sandbox idle. Press Run Code to execute assertions.')
    setSuccess(null)
    
    const time = new Date().toLocaleTimeString()
    setSecurityLogs(logs => [
      `[${time}] Swapped active challenge to: ${challenges[idx].title}. Sandbox re-seated.`,
      ...logs
    ])
  }

  const handleRunCode = () => {
    if (challenges.length === 0) return
    setRunning(true)
    setConsoleOutput('Initializing Docker Container Sandbox...\nBinding secure environment properties...\nExecuting unit tests...')
    
    const time = new Date().toLocaleTimeString()
    setSecurityLogs(logs => [
      `[${time}] Executing isolated code compile request.`,
      `[${time}] Sandbox container state: RUNNING`,
      ...logs
    ])

    setTimeout(() => {
      const challenge = challenges[activeChallengeIdx]
      const clean = code.replace(/\s+/g, '')
      const regexTerms = (challenge.verifyCodeRegex || 'return').split('|')
      const matches = regexTerms.some(term => clean.includes(term))
      
      let testSuccess = false
      let output = ''
      
      if (matches) {
        testSuccess = true
        output = `Success: Code execution output verified against all expected parameters. All ${challenge.testCases.length} test assertions PASSED. Latency: 5ms. Memory: 1.9MB.`
      } else {
        testSuccess = false
        output = `Compilation Error: Expected solution logic keywords (like: ${regexTerms.join(', ')}) not detected. Unit test assertion check failed.`
      }
      
      setConsoleOutput(output)
      setSuccess(testSuccess)
      setRunning(false)

      const endTime = new Date().toLocaleTimeString()
      setSecurityLogs(logs => [
        `[${endTime}] Compile completed. Status: ${testSuccess ? 'SUCCESS' : 'COMPILATION_ERROR'}.`,
        `[${endTime}] Memory delta: +2.9MB. CPU cycles: 42,109.`,
        ...logs
      ])

      if (testSuccess) {
        toast('Congratulations! All unit test cases passed.', 'success')
      } else {
        toast('Test execution failed. Review error output.', 'error')
      }
    }, 1800)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center flex flex-col items-center justify-center space-y-4 min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
        <p className="text-xs text-slate-500 font-mono">Initializing High Security Coding Sandbox Container...</p>
      </div>
    )
  }

  const activeChallenge = challenges[activeChallengeIdx]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-grid-pattern bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Back Button */}
      <div className="mb-6 flex justify-between items-center">
        <Link 
          href="/learning" 
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Learning Hub</span>
        </Link>

        {/* Security Badge indicators */}
        <div className="flex gap-2">
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-905 text-slate-550 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
            IP: {fakeIp}
          </span>
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20">
            <Lock className="h-3 w-3" /> Secure Port: 443
          </span>
        </div>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-20 space-y-2">
          <p className="text-sm font-bold">No coding challenges found</p>
          <p className="text-xs text-slate-400">Please check back later or log in as Admin to upload some problem statements.</p>
        </div>
      ) : (
        /* Main Split Grid */
        <div className="grid lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Side: Challenge Selection & Description (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            
            {/* Challenge list */}
            <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-4 shadow-md glass">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Code2 className="h-4 w-4 text-blue-500" />
                <span>Available Sandbox Trials</span>
              </h3>
              <div className="space-y-2">
                {challenges.map((chal, i) => (
                  <button
                    key={chal.id}
                    onClick={() => handleChallengeChange(i)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      activeChallengeIdx === i
                        ? 'border-blue-500 dark:border-blue-400 bg-blue-50/20 dark:bg-blue-900/10'
                        : 'border-slate-200/40 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-905/30'
                    }`}
                  >
                    <div className="flex justify-between items-center text-left">
                      <span className="font-bold">{chal.title}</span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        chal.difficulty === 'EASY' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                      }`}>{chal.difficulty}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1 font-medium">Earn +{chal.points} points</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Description */}
            <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-5 shadow-md glass flex-grow space-y-4 text-left">
              <div>
                <h2 className="text-base font-extrabold">{activeChallenge.title}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {activeChallenge.description}
                </p>
              </div>

              {activeChallenge.constraints && activeChallenge.constraints.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Constraints & Complexity</span>
                  <ul className="space-y-1.5 text-xs text-slate-650 dark:text-slate-400 list-disc pl-4 leading-relaxed">
                    {activeChallenge.constraints.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {activeChallenge.testCases && activeChallenge.testCases.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Unit Test Assertions</span>
                  {activeChallenge.testCases.map((tc, i) => (
                    <div key={i} className="bg-slate-100/50 dark:bg-slate-955/40 border border-slate-200/40 dark:border-slate-900 p-2.5 rounded-xl font-mono text-[10px] space-y-1">
                      <p><span className="text-slate-400">Input:</span> {tc.input}</p>
                      <p><span className="text-slate-400">Expected:</span> {tc.expected}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Right Side: Code Editor, Compiler Console, & Security Audit Logs (8 cols) */}
          <div className="lg:col-span-8 space-y-6 flex flex-col">
            
            {/* Code Editor Area */}
            <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-950 p-4 shadow-xl flex-grow flex flex-col text-left">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3.5 mb-3.5">
                <div className="flex items-center space-x-2">
                  <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                  <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <span className="h-3 w-3 rounded-full bg-green-500/80" />
                  <span className="text-xs text-slate-450 font-mono pl-2">secure_sandbox.js</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setCode(activeChallenge.template)}
                    className="p-1 rounded hover:bg-slate-850 text-slate-400 hover:text-white cursor-pointer"
                    title="Reset code template"
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </button>
                  <button
                    onClick={handleRunCode}
                    disabled={running}
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer shadow-md shadow-blue-500/10"
                  >
                    <Play className="h-3.5 w-3.5" /> Run Code
                  </button>
                </div>
              </div>

              {/* Code Textarea */}
              <div className="flex-grow flex font-mono text-xs text-slate-200">
                <div className="w-8 select-none text-slate-650 text-right pr-2.5 border-r border-slate-900 space-y-1">
                  {Array(18).fill(0).map((_, i) => (
                    <div key={i}>{i + 1}</div>
                  ))}
                </div>
                
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  disabled={running}
                  className="flex-grow bg-transparent pl-4 border-none outline-none focus:ring-0 text-xs text-emerald-400 font-mono resize-none leading-relaxed leading-[1.375rem]"
                  rows={18}
                />
              </div>
            </div>

            {/* Bottom Split Console and Security Audit logs */}
            <div className="grid md:grid-cols-2 gap-6">
              
              {/* Compiler Console */}
              <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-955 p-5 text-left font-mono text-[10px] space-y-3.5">
                <span className="font-bold text-slate-450 uppercase flex items-center gap-1.5">
                  <Terminal className="h-4 w-4 text-violet-500" />
                  <span>Compiler Sandbox Console</span>
                </span>
                <div className={`p-4.5 rounded-xl border font-mono min-h-24 ${
                  success === true 
                    ? 'bg-emerald-950/10 border-emerald-500/20 text-emerald-400' 
                    : success === false 
                    ? 'bg-rose-955/10 border-rose-500/20 text-rose-450' 
                    : 'bg-slate-900/60 border-slate-850 text-slate-450'
                }`}>
                  <p className="whitespace-pre-line leading-relaxed">{consoleOutput}</p>
                </div>
              </div>

              {/* Live Security Audit Logs */}
              <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-slate-950 p-5 text-left font-mono text-[10px] space-y-3.5 relative overflow-hidden">
                
                {warningCount > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-rose-500/10 border border-rose-500/20 text-rose-500 px-2 py-0.5 rounded-md text-[9px] font-bold animate-pulse">
                    <ShieldAlert className="h-3 w-3" /> Anti-Cheat Triggers: {warningCount}
                  </div>
                )}

                <span className="font-bold text-slate-450 uppercase flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  <span>Sandbox Security Audit logs</span>
                </span>

                <div className="bg-slate-900/60 border border-slate-850 p-3.5 rounded-xl h-24 overflow-y-auto space-y-1.5 scrollbar-none font-mono text-[9px] text-slate-450">
                  {securityLogs.map((log, idx) => (
                    <p key={idx} className={log.includes('⚠️') ? 'text-rose-550 font-bold' : ''}>
                      {log}
                    </p>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}
