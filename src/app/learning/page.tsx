'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { 
  BookOpen, GitPullRequest, Award, FileText, CheckCircle2, 
  Map, Terminal, Shield, Briefcase, GraduationCap, ArrowRight, Download, Sparkles
} from 'lucide-react'
import { mockRoadmaps, mockTutorials } from '@/lib/mockData'
import { useToast } from '@/context/ToastContext'

export default function LearningPage() {
  const { toast } = useToast()
  const [selectedRoadmap, setSelectedRoadmap] = useState<number>(0)

  const studyMaterials = [
    { title: 'Data Structures & Algorithms Cheat Sheet', type: 'DSA Notes', format: 'PDF', size: '2.4 MB' },
    { title: 'Artificial Intelligence & Neural Nets Handout', type: 'AI Notes', format: 'PDF', size: '3.1 MB' },
    { title: 'Intro to Cryptography & Network Layers', type: 'Cyber Security Notes', format: 'PDF', size: '1.8 MB' },
    { title: 'Vellore University 2025 Computer Network Paper', type: 'Previous Year Papers', format: 'PDF', size: '840 KB' },
    { title: 'Standard Single-Page Software Engineer Template', type: 'Resume Templates', format: 'DOCX', size: '1.2 MB' },
  ]

  const codingChallenges = [
    { title: 'Reverse a Linked List in Place', difficulty: 'Easy', points: 100 },
    { title: 'Find the Shortest Path in Gridlock (Dijkstra)', difficulty: 'Medium', points: 250 },
    { title: 'Implement a Simple Blockchain Contract', difficulty: 'Hard', points: 500 },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Student Portal</span>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">Academic Resource Center</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Boost your placement prep, reference study papers, follow tech roadmaps, and download resume files.</p>
      </div>

      {/* AI Viva Callout Banner */}
      <div className="mb-16 rounded-3xl border border-blue-500/25 bg-gradient-to-r from-blue-500/10 via-violet-500/10 to-pink-500/10 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 glow-card glass">
        <div className="space-y-3 max-w-xl text-left">
          <div className="inline-flex items-center space-x-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-[10px] font-bold text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Exclusive SaaS Feature</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight dark:text-white">AI-Powered Viva Voce Exam Simulator</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Practice defending your projects before the semester ends. Choose an external evaluator, type your responses, and get instant marks along with focus tips to impress real college professors.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          {/* Avatar stack */}
          <div className="flex -space-x-3 select-none">
            <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=80&q=80" alt="Examiner" />
            <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80" alt="Examiner" />
            <img className="h-10 w-10 rounded-full border-2 border-white dark:border-slate-900 object-cover" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80" alt="Examiner" />
          </div>
          <Link 
            href="/learning/viva-simulator"
            className="w-full sm:w-auto text-center inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-5 py-3 shadow-md shadow-blue-500/10 cursor-pointer"
          >
            Launch Evaluator
          </Link>
        </div>
      </div>

      {/* Roadmaps Interactive Widget */}
      <div className="mb-16">
        <div className="flex items-center space-x-2.5 mb-6">
          <Map className="h-5 w-5 text-blue-500" />
          <h2 className="text-xl font-bold dark:text-white">Domain Learning Roadmaps</h2>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* List of roadmaps */}
          <div className="space-y-3.5 lg:col-span-1">
            {mockRoadmaps.map((rm, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedRoadmap(idx)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedRoadmap === idx 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50/20 dark:bg-blue-900/10 shadow-sm' 
                    : 'border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40'
                }`}
              >
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rm.title}</h4>
                <p className="text-[10px] text-slate-400 mt-1">{rm.steps.length} roadmap milestones</p>
              </button>
            ))}
          </div>

          {/* Details visual milestones */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-6">
              {mockRoadmaps[selectedRoadmap].title}
            </h3>
            
            <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-6">
              {mockRoadmaps[selectedRoadmap].steps.map((step, idx) => (
                <div key={idx} className="relative">
                  <div className="absolute -left-[31px] top-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-sm ring-4 ring-white dark:ring-slate-900">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Explore free tutorials and projects relating to this milestone.</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tutorials & Coding Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        
        {/* Tutorials */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <Terminal className="h-5 w-5 text-violet-500" />
            <h2 className="text-xl font-bold dark:text-white">Programming Tutorials</h2>
          </div>

          <div className="grid gap-4">
            {mockTutorials.map((tut, idx) => (
              <Link 
                key={idx} 
                href={tut.link}
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between hover:border-blue-500/20 transition-all duration-350 hover:shadow-md cursor-pointer block"
              >
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500">{tut.type}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{tut.title}</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-2">
                    <span>{tut.readTime}</span>
                    <span>&bull;</span>
                    <span>{tut.level}</span>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 hover:text-blue-500 transition-colors" />
              </Link>
            ))}
          </div>
        </div>

        {/* Coding Challenges */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2.5 mb-2">
            <Award className="h-5 w-5 text-pink-500" />
            <h2 className="text-xl font-bold dark:text-white">Coding Challenges</h2>
          </div>

          <div className="grid gap-4">
            {codingChallenges.map((chal, idx) => (
              <div 
                key={idx} 
                className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 p-4 shadow-sm flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{chal.title}</h4>
                  <div className="flex items-center space-x-3 text-[10px] text-slate-400 mt-1">
                    <span className={`font-semibold ${chal.difficulty === 'Easy' ? 'text-emerald-500' : chal.difficulty === 'Medium' ? 'text-amber-500' : 'text-rose-500'}`}>{chal.difficulty}</span>
                    <span>&bull;</span>
                    <span>+{chal.points} score points</span>
                  </div>
                </div>
                <Link 
                  href="/learning/coding-portal"
                  className="rounded-lg bg-slate-100 dark:bg-slate-850 hover:bg-blue-600 hover:text-white text-xs font-semibold text-slate-700 dark:text-slate-300 px-3.5 py-1.5 transition-colors"
                >
                  Enter Sandbox
                </Link>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Study Materials & Downloads */}
      <div>
        <div className="flex items-center space-x-2.5 mb-6">
          <FileText className="h-5 w-5 text-emerald-500" />
          <h2 className="text-xl font-bold dark:text-white">Revision Notes & Materials</h2>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/60 dark:border-slate-800 overflow-hidden shadow-sm">
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {studyMaterials.map((mat, idx) => (
              <div key={idx} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-850/40 transition-colors">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase">{mat.type}</span>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5">{mat.title}</h4>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-[10px] text-slate-400 font-semibold">{mat.format} &bull; {mat.size}</span>
                  <button 
                    onClick={() => toast(`Downloading revision file: ${mat.title}.${mat.format.toLowerCase()}`, 'success')}
                    className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-blue-500 transition-colors"
                  >
                    <Download className="h-4.5 w-4.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}
