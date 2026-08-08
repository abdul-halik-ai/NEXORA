'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, ChevronLeft, Sparkles, Brain, Cpu, Database, Zap, BookOpen } from 'lucide-react'
import Link from 'next/link'

const slides = [
  {
    id: 1,
    title: 'NEXORA',
    subtitle: 'The Future of Academic Projects',
    content: (
      <div className="flex flex-col items-center text-center space-y-6">
        <div className="relative mb-8">
          <div className="absolute -inset-1 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-full blur-xl opacity-70 animate-pulse"></div>
          <div className="relative bg-slate-900/50 p-6 rounded-full border border-violet-500/30 glass">
            <Sparkles className="w-20 h-20 text-violet-400" />
          </div>
        </div>
        <p className="text-xl md:text-3xl text-slate-300 font-light max-w-3xl leading-relaxed">
          A revolutionary platform leveraging AI to guide students from ideation to final submission.
        </p>
      </div>
    )
  },
  {
    id: 2,
    title: 'The Problem',
    subtitle: 'Why Students Struggle',
    content: (
      <ul className="space-y-6 text-xl text-slate-300">
        {[
          "❌ Finding unique, non-plagiarized project ideas is difficult.",
          "❌ Setting up technical architecture requires expert guidance.",
          "❌ Writing comprehensive documentation (READMEs) is tedious.",
          "❌ Preparing for technical Viva Voce reviews is stressful and unpredictable."
        ].map((item, i) => (
          <motion.li 
            key={i}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 + 0.3 }}
            className="flex items-center gap-4 bg-slate-900/40 p-4 rounded-xl border border-rose-500/10"
          >
            {item}
          </motion.li>
        ))}
      </ul>
    )
  },
  {
    id: 3,
    title: 'The Solution',
    subtitle: 'AI-Powered Academic Intelligence',
    content: (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl">
        {[
          { icon: <Brain />, title: "Instant Ideation", desc: "Generates custom, submission-ready topics." },
          { icon: <BookOpen />, title: "Smart Documentation", desc: "Auto-generates GitHub-style READMEs." },
          { icon: <Cpu />, title: "Code Explanation", desc: "Breaks down complex code blocks visually." },
          { icon: <Zap />, title: "Viva Preparation", desc: "Simulates strict examiner Q&A sessions." }
        ].map((feat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}
            className="glow-card glass p-8 rounded-2xl flex flex-col items-center text-center space-y-4"
          >
            <div className="p-4 bg-violet-500/10 rounded-full text-violet-400">
              {feat.icon}
            </div>
            <h3 className="text-2xl font-bold text-white">{feat.title}</h3>
            <p className="text-slate-400">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: 4,
    title: 'Technical Architecture',
    subtitle: 'Built for Performance & Scale',
    content: (
      <div className="flex flex-col items-center space-y-8 w-full max-w-4xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
          {[
            { name: "Next.js 15", role: "Frontend & API" },
            { name: "Tailwind CSS", role: "Glassmorphism UI" },
            { name: "Prisma & Postgres", role: "Database Layer" },
            { name: "Gemini 2.5 Flash", role: "AI Core Engine" }
          ].map((tech, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.3, type: 'spring' }}
              className="bg-slate-900/60 border border-slate-700 p-6 rounded-2xl text-center flex flex-col justify-center items-center h-40"
            >
              <h4 className="text-xl font-bold text-white mb-2">{tech.name}</h4>
              <p className="text-sm text-slate-400">{tech.role}</p>
            </motion.div>
          ))}
        </div>
        <motion.div 
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ delay: 1 }}
           className="p-6 bg-violet-900/20 border border-violet-500/30 rounded-xl w-full text-center"
        >
          <Database className="w-8 h-8 text-violet-400 mx-auto mb-3" />
          <p className="text-slate-300 text-lg">Fully deployed on Vercel Edge Infrastructure</p>
        </motion.div>
      </div>
    )
  },
  {
    id: 5,
    title: 'Ready to Upgrade?',
    subtitle: 'The ultimate tool for your next academic milestone.',
    content: (
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col items-center space-y-8"
      >
        <div className="relative">
          <div className="absolute -inset-4 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-xl blur-lg opacity-50 animate-pulse"></div>
          <Link 
            href="/dashboard" 
            className="relative bg-slate-900 border border-violet-500/50 hover:bg-violet-900/40 text-white px-10 py-5 rounded-xl text-2xl font-bold transition-all duration-300 flex items-center gap-3 shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.6)]"
          >
            Launch Nexora Dashboard
            <ChevronRight className="w-6 h-6" />
          </Link>
        </div>
      </motion.div>
    )
  }
]

export default function PresentationPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [direction, setDirection] = useState(1) // 1 for next, -1 for prev

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1)
      setCurrentSlide(prev => prev + 1)
    }
  }

  const prevSlide = () => {
    if (currentSlide > 0) {
      setDirection(-1)
      setCurrentSlide(prev => prev - 1)
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') nextSlide()
      if (e.key === 'ArrowLeft') prevSlide()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentSlide])

  return (
    <div className="min-h-screen bg-grid-pattern mesh-gradient flex flex-col overflow-hidden relative">
      {/* Top Progress Bar */}
      <div className="absolute top-0 left-0 h-1.5 bg-violet-500/20 w-full z-50">
        <motion.div 
          className="h-full bg-gradient-to-r from-violet-500 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / slides.length) * 100}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>

      {/* Main Slide Content Area */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 relative z-10 w-full max-w-7xl mx-auto">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            initial={{ opacity: 0, x: direction * 100, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: direction * -100, filter: 'blur(10px)' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full flex flex-col items-center"
          >
            <motion.h1 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight mb-4 text-center"
            >
              {slides[currentSlide].title}
            </motion.h1>
            
            {slides[currentSlide].subtitle && (
              <motion.h2 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-2xl md:text-3xl text-violet-400 font-medium mb-16 text-center"
              >
                {slides[currentSlide].subtitle}
              </motion.h2>
            )}

            <div className="w-full flex justify-center mt-4">
              {slides[currentSlide].content}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-10 left-0 w-full flex justify-between items-center px-12 z-50 pointer-events-none">
        
        <button 
          onClick={prevSlide}
          disabled={currentSlide === 0}
          className="pointer-events-auto p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-violet-600/50 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-0 transition-all duration-300 backdrop-blur-md"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>

        <div className="flex gap-3">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${currentSlide === idx ? 'bg-violet-500 scale-125 shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 'bg-slate-700'}`} 
            />
          ))}
        </div>

        <button 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
          className="pointer-events-auto p-4 rounded-full bg-slate-900/80 border border-slate-700 text-white hover:bg-violet-600/50 hover:border-violet-400 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] disabled:opacity-0 transition-all duration-300 backdrop-blur-md"
        >
          <ChevronRight className="w-8 h-8" />
        </button>

      </div>
      
      {/* Background ambient decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
