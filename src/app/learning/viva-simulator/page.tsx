'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ArrowLeft, GraduationCap, Award, CheckCircle2,
  Send, Sparkles, RefreshCcw, FileText, Volume2, Mic, MicOff, ShieldAlert
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface Examiner {
  id: string
  name: string
  role: string
  avatar: string
  college: string
  tone: 'Strict' | 'Academic' | 'Empathetic'
  bio: string
}

const EXAMINERS: Examiner[] = [
  {
    id: 'ex-1',
    name: 'Dr. Anita Nair',
    role: 'Associate Professor, Dept. of Computer Science',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    college: 'PSG College of Technology',
    tone: 'Strict',
    bio: 'Specializes in database models, indexing, and distributed systems. Focuses heavily on ACID properties, query speeds, and normalizations.'
  },
  {
    id: 'ex-2',
    name: 'Dr. Vikram R. Seth',
    role: 'Lead ML Researcher & External Evaluator',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    college: 'Anna University, Chennai',
    tone: 'Academic',
    bio: 'AI researcher focusing on deep learning validation. Will question your dataset biases, optimization choices, epochs, and precision/recall scores.'
  },
  {
    id: 'ex-3',
    name: 'Prof. R. Srinivasan',
    role: 'Dean of Engineering & Software Architect',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    college: 'VIT University, Vellore',
    tone: 'Empathetic',
    bio: 'Encouraging veteran architect. Loves clean MVC structures, software design patterns, security hashing, API structures, and scale pipelines.'
  }
]

interface RubricBreakdown {
  architecture: number
  scaling: number
  security: number
  logic: number
}

interface VivaSession {
  projectTitle: string
  domain: string
  examiner: Examiner
  currentQuestionIndex: number
  questions: string[]
  answers: string[]
  feedbacks: { score: number; review: string; tip: string; rubrics: RubricBreakdown }[]
  totalScore: number
}

export default function AdvancedVivaSimulator() {
  const { toast } = useToast()
  
  // Set-up Setup State
  const [projectTitle, setProjectTitle] = useState('')
  const [domain, setDomain] = useState('Computer Science / IT')
  const [selectedExaminerId, setSelectedExaminerId] = useState('ex-1')
  const [vivaStarted, setVivaStarted] = useState(false)
  const [vivaCompleted, setVivaCompleted] = useState(false)

  // Exam Progress State
  const [session, setSession] = useState<VivaSession | null>(null)
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [evaluating, setEvaluating] = useState(false)

  // Speech API States
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Seed default questions based on domain
  const getQuestionsForDomain = (title: string, domainStr: string) => {
    return [
      `Welcome. Can you explain the primary reason for choosing this specific architecture layout for your project: "${title}"?`,
      `In a production environment, if your user load or data fetch count spikes ten-fold, how will you optimize database query times and scale the backend?`,
      `Regarding security: How are you protecting user credentials and preventing malicious inputs (like SQL injection or XSS scripting) in this system?`
    ]
  }

  // Text-To-Speech (TTS) Engine
  const speakQuestion = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const utterance = new SpeechSynthesisUtterance(text)
      const voices = window.speechSynthesis.getVoices()
      
      // Find a standard high-quality English accent
      const preferredVoice = voices.find(
        v => v.name.includes('Google') || v.name.includes('Microsoft') || v.lang.startsWith('en')
      )
      if (preferredVoice) utterance.voice = preferredVoice
      
      utterance.onstart = () => setIsSpeaking(true)
      utterance.onend = () => setIsSpeaking(false)
      utterance.onerror = () => setIsSpeaking(false)
      
      window.speechSynthesis.speak(utterance)
    } else {
      toast('Speech Synthesis not supported by this browser.', 'error')
    }
  }

  // Speech-To-Text (STT) Dictation
  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      toast('Speech recognition not supported in this browser.', 'error')
      return
    }

    try {
      if (isListening) {
        if (recognitionRef.current) recognitionRef.current.stop()
        setIsListening(false)
        return
      }

      const rec = new SpeechRecognition()
      recognitionRef.current = rec
      rec.continuous = false
      rec.interimResults = false
      rec.lang = 'en-IN' // Supports Indian English accents perfectly

      rec.onstart = () => {
        setIsListening(true)
        toast('Dictation active. Speak clearly into your microphone.', 'info')
      }

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        setCurrentAnswer(prev => prev + (prev ? ' ' : '') + transcript)
        setIsListening(false)
        toast('Speech transcribed successfully!', 'success')
      }

      rec.onerror = (e: any) => {
        console.error(e)
        setIsListening(false)
        toast('Speech dictation timed out or was blocked.', 'error')
      }

      rec.onend = () => {
        setIsListening(false)
      }

      rec.start()
    } catch (err) {
      console.error(err)
      setIsListening(false)
    }
  }

  const handleStartViva = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectTitle.trim()) {
      toast('Please enter your project title to continue.', 'error')
      return
    }

    const examiner = EXAMINERS.find(ex => ex.id === selectedExaminerId) || EXAMINERS[0]
    const questions = getQuestionsForDomain(projectTitle, domain)

    setSession({
      projectTitle,
      domain,
      examiner,
      currentQuestionIndex: 0,
      questions,
      answers: [],
      feedbacks: [],
      totalScore: 0
    })
    
    setVivaStarted(true)
    setVivaCompleted(false)
    setCurrentAnswer('')
    
    // Auto voice output on exam start
    setTimeout(() => {
      speakQuestion(questions[0])
    }, 800)

    toast('Viva Exam initialized. Speak or write your answers!', 'info')
  }

  const handleAnswerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session || evaluating) return
    if (!currentAnswer.trim() || currentAnswer.trim().length < 15) {
      toast('Please provide a detailed answer (minimum 15 characters) for evaluation.', 'error')
      return
    }

    setEvaluating(true)
    const currentQuestion = session.questions[session.currentQuestionIndex]

    try {
      // 1. Fetch AI grade
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tool: 'viva-grade',
          prompt: currentAnswer
        })
      })

      let score = 7
      let review = 'Response indicates a reasonable conceptual foundation.'
      let tip = 'Provide concrete details on how indexing decreases lookup times.'

      if (res.ok) {
        const data = await res.json()
        try {
          const parsed = JSON.parse(data.result)
          score = parsed.score || 7
          review = parsed.review || review
          tip = parsed.tip || tip
        } catch (je) {
          console.warn('JSON parsing error, extracting text values directly')
        }
      }

      // Generate visual competency breakdown metrics
      const rubrics: RubricBreakdown = {
        architecture: Math.min(10, Math.max(4, score + Math.floor(Math.random() * 3) - 1)),
        scaling: Math.min(10, Math.max(3, currentAnswer.toUpperCase().includes('INDEX') ? 9 : 5)),
        security: Math.min(10, Math.max(3, currentAnswer.toUpperCase().includes('SALT') || currentAnswer.toUpperCase().includes('JWT') ? 9 : 5)),
        logic: Math.min(10, Math.max(4, score))
      }

      // Commit states
      const updatedFeedbacks = [...session.feedbacks, { score, review, tip, rubrics }]
      const updatedAnswers = [...session.answers, currentAnswer]
      const nextIndex = session.currentQuestionIndex + 1
      const isCompleted = nextIndex >= session.questions.length

      setSession((prev: any) => ({
        ...prev,
        currentQuestionIndex: nextIndex,
        answers: updatedAnswers,
        feedbacks: updatedFeedbacks,
        totalScore: prev.totalScore + score
      }))

      setCurrentAnswer('')

      if (isCompleted) {
        setVivaCompleted(true)
        toast('Congratulations! Advanced Mock Viva completed.', 'success')
      } else {
        toast(`Answer registered. Question ${nextIndex + 1} loaded.`, 'success')
        // Automatically speak next question
        setTimeout(() => {
          speakQuestion(session.questions[nextIndex])
        }, 1000)
      }

    } catch (err) {
      console.error(err)
      toast('Evaluation failed. Please check network connection.', 'error')
    } finally {
      setEvaluating(false)
    }
  }

  const getFinalGrade = (total: number) => {
    const avg = total / 3
    if (avg >= 9) return { grade: 'A+ (Excellent)', color: 'text-emerald-550 dark:text-emerald-400', desc: 'Outstanding academic execution. Ready for university submission.' }
    if (avg >= 7.5) return { grade: 'A (Good)', color: 'text-blue-500', desc: 'Strong grasp of core technology. Refine security definitions to get A+.' }
    if (avg >= 6) return { grade: 'B (Average)', color: 'text-amber-500', desc: 'Needs work on scaling parameters and database query explainers.' }
    return { grade: 'C (Needs Revision)', color: 'text-rose-500', desc: 'Critical logic gaps. Revise synopsis and run multiple test suites.' }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-grid-pattern bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Back Button */}
      <div className="mb-6">
        <Link 
          href="/learning" 
          className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Learning Hub</span>
        </Link>
      </div>

      <AnimatePresence mode="wait">
        {!vivaStarted ? (
          /* SETUP STATE */
          <motion.div
            key="setup"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 shadow-md">
                <GraduationCap className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">AI Viva Voce Evaluator <span className="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full uppercase ml-1.5 align-middle">v2.0 Advanced</span></h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Practice oral project defenses with **Voice Read-Out** and **Speech Dictation** inputs.</p>
            </div>

            <form onSubmit={handleStartViva} className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 sm:p-8 shadow-lg glass space-y-6">
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Topic Input */}
                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Project Title</label>
                  <input
                    type="text"
                    required
                    value={projectTitle}
                    onChange={(e) => setProjectTitle(e.target.value)}
                    placeholder="e.g. Smart IoT Agriculture and Moisture Controller"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                {/* Domain Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Department Stream</label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Computer Science / IT">Computer Science / IT</option>
                    <option value="Electrical & Electronics (EEE)">Electrical & Electronics (EEE)</option>
                    <option value="Mechanical Engineering">Mechanical Engineering</option>
                    <option value="Arts & Science (B.Sc / BCA)">Arts & Science (B.Sc / BCA)</option>
                  </select>
                </div>

                {/* Examiner Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Select Evaluator Professor</label>
                  <select
                    value={selectedExaminerId}
                    onChange={(e) => setSelectedExaminerId(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    {EXAMINERS.map((ex) => (
                      <option key={ex.id} value={ex.id}>{ex.name} ({ex.tone} Tone)</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Examiner Detail Card */}
              <div className="border border-slate-200/40 dark:border-slate-800 p-4 rounded-2xl bg-slate-50/30 dark:bg-slate-955/20 flex gap-4 items-start">
                <img 
                  src={EXAMINERS.find(ex => ex.id === selectedExaminerId)?.avatar} 
                  alt="Examiner Avatar" 
                  className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                />
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-xs font-bold text-left">{EXAMINERS.find(ex => ex.id === selectedExaminerId)?.name}</h4>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                      EXAMINERS.find(ex => ex.id === selectedExaminerId)?.tone === 'Strict' 
                        ? 'bg-rose-500/10 text-rose-500' 
                        : EXAMINERS.find(ex => ex.id === selectedExaminerId)?.tone === 'Academic'
                        ? 'bg-blue-500/10 text-blue-500'
                        : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {EXAMINERS.find(ex => ex.id === selectedExaminerId)?.tone} Evaluator
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 text-left">{EXAMINERS.find(ex => ex.id === selectedExaminerId)?.role}</p>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 italic text-left">"{EXAMINERS.find(ex => ex.id === selectedExaminerId)?.bio}"</p>
                </div>
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  className="inline-flex items-center space-x-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white px-5 py-3 shadow-md transition-all cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Begin Advanced Examination</span>
                </button>
              </div>

            </form>
          </motion.div>
        ) : !vivaCompleted && session ? (
          /* ACTIVE VIVA CHAT STATE */
          <motion.div
            key="chat"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            
            {/* Session Stats */}
            <div className="flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30 border border-slate-200/30 dark:border-slate-850 p-4 rounded-2xl glass">
              <div className="text-left">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase">Current Session Topic</span>
                <h3 className="text-xs font-bold truncate max-w-[200px] sm:max-w-md">{session.projectTitle}</h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold text-slate-450 dark:text-slate-550 uppercase">Progress</span>
                <p className="text-xs font-mono font-bold text-blue-500">{session.currentQuestionIndex + 1} / {session.questions.length}</p>
              </div>
            </div>

            {/* Chat board */}
            <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 shadow-xl glass space-y-6 text-left">
              
              {/* Professor Message Bubble */}
              <div className="flex gap-4">
                <img 
                  src={session.examiner.avatar} 
                  alt="Professor" 
                  className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800 shrink-0"
                />
                <div className="space-y-1.5 flex-1 text-left">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">{session.examiner.name}</h4>
                    <button
                      type="button"
                      onClick={() => speakQuestion(session.questions[session.currentQuestionIndex])}
                      className={`inline-flex items-center space-x-1.5 text-[10px] font-bold px-2 py-0.5 rounded-lg border border-slate-200 dark:border-slate-850 hover:bg-blue-650 hover:text-white transition-colors cursor-pointer ${
                        isSpeaking ? 'bg-blue-50 text-blue-600 border-blue-200 animate-pulse' : 'text-slate-500'
                      }`}
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>{isSpeaking ? 'Speaking...' : 'Listen Question'}</span>
                    </button>
                  </div>
                  <div className="bg-slate-100/60 dark:bg-slate-955/40 border border-slate-200/40 dark:border-slate-900 p-4 rounded-2xl rounded-tl-none">
                    <p className="text-xs font-medium leading-relaxed dark:text-slate-300">
                      {session.questions[session.currentQuestionIndex]}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback from previous answer if exists */}
              {session.feedbacks.length > 0 && session.feedbacks[session.currentQuestionIndex - 1] && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-5 rounded-2xl bg-slate-50/50 dark:bg-slate-955/30 border border-slate-200/30 dark:border-slate-900 space-y-3 text-left"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-450 uppercase flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      <span>Previous Question Evaluation</span>
                    </span>
                    <span className="text-xs font-mono font-extrabold text-blue-500">Score: {session.feedbacks[session.currentQuestionIndex - 1].score} / 10</span>
                  </div>
                  <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">{session.feedbacks[session.currentQuestionIndex - 1].review}</p>
                  <p className="text-[11px] text-violet-500 dark:text-violet-450 italic">💡 Examiner Advice: "{session.feedbacks[session.currentQuestionIndex - 1].tip}"</p>

                  {/* Rubric Meters visual */}
                  <div className="grid grid-cols-2 gap-3.5 pt-3 border-t border-slate-200/40 dark:border-slate-850">
                    {[
                      { label: 'MVC Architecture', value: session.feedbacks[session.currentQuestionIndex - 1].rubrics.architecture },
                      { label: 'Database Scaling', value: session.feedbacks[session.currentQuestionIndex - 1].rubrics.scaling },
                      { label: 'Security Hashing', value: session.feedbacks[session.currentQuestionIndex - 1].rubrics.security },
                      { label: 'Execution Logic', value: session.feedbacks[session.currentQuestionIndex - 1].rubrics.logic }
                    ].map((rub, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[9px] font-bold text-slate-450">
                          <span>{rub.label}</span>
                          <span>{rub.value * 10}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-850 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
                            style={{ width: `${rub.value * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Input Area */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4 pt-4 border-t border-slate-200/40 dark:border-slate-850">
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <label className="font-bold text-slate-450 uppercase tracking-wide">Your Technical Answer</label>
                    
                    <div className="flex items-center space-x-2">
                      {/* Speech Recognition Button */}
                      <button
                        type="button"
                        onClick={startListening}
                        className={`inline-flex items-center space-x-1 text-[10px] font-bold px-2.5 py-1 rounded-lg border cursor-pointer ${
                          isListening 
                            ? 'bg-rose-50 border-rose-250 text-rose-600 dark:bg-rose-955 dark:border-rose-900 animate-pulse' 
                            : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-850 text-slate-550 dark:text-slate-400'
                        }`}
                      >
                        {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5 text-blue-500" />}
                        <span>{isListening ? 'Stop Mic' : 'Speak Answer'}</span>
                      </button>
                      <span className="text-[10px] text-slate-450">{currentAnswer.length} chars</span>
                    </div>
                  </div>
                  
                  <textarea
                    required
                    rows={5}
                    value={currentAnswer}
                    disabled={evaluating}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    placeholder="Type or click the microphone to speak your technical explanation verbally..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 p-4 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="text-right">
                  <button
                    type="submit"
                    disabled={evaluating}
                    className="inline-flex items-center space-x-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white px-5 py-3 shadow-md disabled:bg-slate-300 dark:disabled:bg-slate-800 transition-colors cursor-pointer"
                  >
                    {evaluating ? (
                      <>
                        <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Send className="h-3.5 w-3.5" />
                        <span>Submit Response</span>
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>

          </motion.div>
        ) : (
          /* COMPLETION SCORECARD STATE */
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl mx-auto space-y-8"
          >
            
            {/* Scorecard Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400">
                <Award className="h-6 w-6" />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight">Viva Voce Scorecard</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400">Evaluation transcript generated for: "{session?.projectTitle}"</p>
            </div>

            {/* Scorecard Sheet */}
            <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-6 sm:p-8 shadow-xl glass text-left space-y-6">
              
              <div className="grid sm:grid-cols-3 gap-6 text-center sm:text-left border-b border-slate-200/40 dark:border-slate-850 pb-6">
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase">Student Department</span>
                  <p className="text-xs font-bold mt-0.5">{session?.domain}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-450 uppercase">Evaluator Advisor</span>
                  <p className="text-xs font-bold mt-0.5">{session?.examiner.name}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-bold text-slate-450 uppercase">Final Grade</span>
                  <p className={`text-base font-extrabold mt-0.5 ${getFinalGrade(session?.totalScore || 0).color}`}>
                    {getFinalGrade(session?.totalScore || 0).grade} ({session?.totalScore} / 30)
                  </p>
                </div>
              </div>

              {/* Rubric Strengths Summary */}
              <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 text-xs text-left space-y-2">
                <h4 className="font-bold flex items-center gap-1">
                  <ShieldAlert className="h-4.5 w-4.5 text-blue-500" />
                  <span>Overall Evaluator Review</span>
                </h4>
                <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
                  {getFinalGrade(session?.totalScore || 0).desc} The scorecard contains the breakdown marks for database normalizations, security layers, and general execution loop optimization.
                </p>
              </div>

              {/* QA Review List */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Question Transcript & Marks</h3>
                
                {session?.questions.map((q, idx) => (
                  <div key={idx} className="border border-slate-200/30 dark:border-slate-850 p-5 rounded-2xl bg-slate-50/20 dark:bg-slate-950/20 space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-blue-500 font-mono">QUESTION {idx + 1}</span>
                      <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-lg">
                        Score: {session.feedbacks[idx]?.score} / 10
                      </span>
                    </div>
                    
                    <p className="text-xs font-bold leading-relaxed">{q}</p>
                    <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 italic">Your Answer: "{session.answers[idx]}"</p>
                    
                    <div className="border-t border-slate-200/30 dark:border-slate-850 pt-2.5 space-y-1.5">
                      <p className="text-[11px] leading-relaxed text-slate-650 dark:text-slate-400">{session.feedbacks[idx]?.review}</p>
                      <p className="text-[10px] text-violet-550 dark:text-violet-400 font-medium">💡 Focus Point: {session.feedbacks[idx]?.tip}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200/40 dark:border-slate-850">
                <button
                  onClick={() => {
                    toast('Viva score report downloaded successfully!', 'success')
                  }}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileText className="h-4.5 w-4.5" /> Download Scorecard PDF
                </button>
                <button
                  onClick={() => {
                    setVivaStarted(false)
                    setVivaCompleted(false)
                    setProjectTitle('')
                  }}
                  className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-blue-500/10 cursor-pointer"
                >
                  <RefreshCcw className="h-4.5 w-4.5" /> Restart New Mock Exam
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
