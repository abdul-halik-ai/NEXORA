'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useToast } from '@/context/ToastContext'
import { 
  Target, Eye, Users, ChevronRight, Briefcase, 
  Code, ShieldCheck, HeartHandshake, Rocket, Sparkles, BookOpen
} from 'lucide-react'

export default function AboutPage() {
  const { toast } = useToast()
  const [selectedJob, setSelectedJob] = useState<any | null>(null)

  const coreValues = [
    { icon: Code, title: 'Craftsmanship', desc: 'No placeholder codes. We build real, production-ready systems using modern frameworks.' },
    { icon: ShieldCheck, title: 'Academic Integrity', desc: 'Every codebase is double-checked for security, licensing, and clean documentation.' },
    { icon: HeartHandshake, title: 'Mentorship-First', desc: 'We do not just hand over ZIP files; we help you understand the core system architecture.' },
    { icon: Rocket, title: 'Pioneering AI', desc: 'Connecting modern LLM engines to help students generate synopsis PDFs and viva questions.' },
  ]

  const workflow = [
    { step: '01', title: 'Requirement Scope', desc: 'Review of student specifications, budget guidelines, and college submission rules.' },
    { step: '02', title: 'Architecture Blueprint', desc: 'We detail database structures, entity relationship diagrams, and technology layouts.' },
    { step: '03', title: 'Active Development', desc: 'Writing clean code blocks, integrating Supabase connections, and responsive layouts.' },
    { step: '04', title: 'QA & External Audit', desc: 'Rigorous compilation checks, testing API routes, and compiling installation readmes.' },
    { step: '05', title: 'Viva & Submission Prep', desc: 'Preparing students with one-to-one viva sessions and slides to present to external examiners.' },
  ]

  const team = [
    { name: 'Prof. A. K. Sundar', role: 'Head Academic Advisor', desc: 'Retired Dean of Engineering, guiding our curriculum relevance and IEEE documentation standards.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
    { name: 'Abdul Halik', role: 'Principal Software Engineer', desc: 'Full-stack developer specialized in NextJS App Router optimization and database scaling.', img: '/founder.jpg' },
    { name: 'Dr. Meera Nair', role: 'IoT & Robotics Lead', desc: 'Hardware designer coordinating our ESP32, Arduino microcontrollers, and circuit tutorials.', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  ]

  const jobs = [
    { id: 'job-1', title: 'Full Stack React Intern', type: 'Remote (India)', stipend: '₹12,000 - ₹18,000/month', duration: '6 Months', desc: 'Help build responsive student tools using Next.js 15, TailwindCSS v4, and Prisma ORM. You will collaborate with senior developers on real projects.' },
    { id: 'job-2', title: 'Technical Documentation Writer', type: 'Remote', stipend: '₹8,000 - ₹12,000/month', duration: '3 Months', desc: 'Draft comprehensive project installation guides, README.md markdowns, and IEEE style project synopses for CSE/ECE domains.' },
    { id: 'job-3', title: 'Arduino/ESP32 IoT Developer', type: 'Part-time', stipend: '₹15,000 - ₹22,000/month', duration: '6 Months', desc: 'Develop embedded C++ scripts, sensor calibrations, and circuit schematics using EasyEDA or Fritzing for customized projects.' }
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
          <Sparkles className="h-3 w-3" /> About Nexora
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
          We Build the Future of Student Engineering
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Nexora is not just a project downloader. We are a complete academic ecosystem bridge helping school, engineering, and diploma students learn to code, launch products, and ace examinations with clean code structures.
        </p>
      </div>

      {/* Mission & Vision (Glassmorphism Cards) */}
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500">
            <Target className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Mission</h3>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            To provide students with production-ready codebase architectures, comprehensive reports, and interactive AI utilities. We strive to make engineering practical, open-source, and accessible.
          </p>
        </div>

        <div className="relative group overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-500">
            <Eye className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Our Vision</h3>
          <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
            To build India’s largest repository of practical academic guides, assisting schools and universities to transition towards active project-based learning curriculums.
          </p>
        </div>
      </div>

      {/* Core Values */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold dark:text-white">Our Core Values</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Principles that guide our engineering process and student support models.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {coreValues.map((val, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl p-6 space-y-4">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-slate-500/10 text-slate-700 dark:text-slate-300">
                <val.icon className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{val.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Workflow Process */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold dark:text-white">Our Development Workflow</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">How we design, develop, and deliver high-scoring project repositories.</p>
        </div>
        <div className="grid md:grid-cols-5 gap-6">
          {workflow.map((flow, idx) => (
            <div key={idx} className="relative bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-850 p-6 rounded-2xl space-y-4">
              <span className="text-3xl font-black text-slate-200 dark:text-slate-800">{flow.step}</span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">{flow.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{flow.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Core Team */}
      <div className="space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h2 className="text-3xl font-extrabold dark:text-white">Academic Advisors & Developers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">The team backing curriculum-relevant guides and firmware scripts.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {team.map((t, idx) => (
            <div 
              key={idx} 
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 flex flex-col items-center text-center space-y-4 hover:border-blue-500/20 transition-all duration-300"
            >
              <img src={t.img} alt={t.name} className="h-24 w-24 rounded-full object-cover border-2 border-slate-200 dark:border-slate-800 shadow-sm" />
              <div>
                <h4 className="text-base font-bold text-slate-900 dark:text-white">{t.name}</h4>
                <p className="text-xs font-semibold text-blue-500 dark:text-blue-400 uppercase tracking-wide mt-1">{t.role}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Careers Section */}
      <div className="bg-slate-50 dark:bg-slate-900/40 rounded-3xl border border-slate-200/60 dark:border-slate-800 p-8 lg:p-12 space-y-8">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-3xl font-extrabold dark:text-white">Active Internships & Careers</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Are you a passionate computer science or electronics student? Join us to create educational resources, coding tools, and custom SaaS modules.
          </p>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-950">
          {jobs.map((job) => (
            <div key={job.id} className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors duration-200">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white">{job.title}</h4>
                <div className="flex flex-wrap gap-2.5 mt-2 text-xs text-slate-500 dark:text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{job.type}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{job.stipend}</span>
                  <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{job.duration}</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedJob(job)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-200"
              >
                View details <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Job Details */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-xl">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">{selectedJob.title}</h3>
              <p className="text-xs text-slate-500 mt-1">{selectedJob.type} | {selectedJob.duration}</p>
            </div>
            
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Stipend & Hours</span>
              <p className="text-sm dark:text-slate-350">{selectedJob.stipend}</p>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role Description</span>
              <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400">{selectedJob.desc}</p>
            </div>

            <div className="flex gap-3 pt-2">
              <button 
                onClick={() => {
                  toast('Application recorded! Please email your portfolio to careers@nexora.in', 'success')
                  setSelectedJob(null)
                }}
                className="flex-1 px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl transition-all duration-200 shadow-sm"
              >
                Apply Now
              </button>
              <button 
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
