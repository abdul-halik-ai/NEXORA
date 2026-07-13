'use client'

import React, { useActionState, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Send, Sparkles, AlertCircle, FileText, CheckCircle2, 
  HelpCircle, Calendar, IndianRupee, Layers, Check 
} from 'lucide-react'
import { submitProjectRequest } from '@/app/actions'
import { useToast } from '@/context/ToastContext'

const initialState: any = {
  success: false,
  error: '',
}

export default function RequestPage() {
  const { toast } = useToast()
  const [state, formAction, isPending] = useActionState(submitProjectRequest, initialState)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [techInput, setTechInput] = useState('')

  const handleAddTech = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      const val = techInput.trim()
      if (val && !technologies.includes(val)) {
        setTechnologies([...technologies, val])
        setTechInput('')
      }
    }
  }

  const handleRemoveTech = (index: number) => {
    setTechnologies(technologies.filter((_, i) => i !== index))
  }

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Background decoration */}
      <div className="absolute top-20 right-1/4 -z-10 h-80 w-80 rounded-full bg-violet-500/5 blur-[100px]" />

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Custom Development</span>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">Request a Custom Project</h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">Can't find what you need in our catalog? Our team of developers can design and write customized codes matching your requirements.</p>
      </div>

      {state?.success ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 backdrop-blur-md p-8 text-center space-y-4 shadow-xl"
        >
          <div className="h-14 w-14 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Project Request Submitted!</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Thank you for submitting your custom requirement! An academic coordinator will review your syllabus guidelines, deadline, and tech stack, and email you a price quote within 24 hours.
          </p>
          <div className="pt-4 flex justify-center space-x-4">
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4.5 py-2.5 shadow-md shadow-blue-500/10"
            >
              Go to Dashboard
            </a>
            <a
              href="/projects"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold px-4.5 py-2.5"
            >
              Browse Catalog
            </a>
          </div>
        </motion.div>
      ) : (
        <form action={formAction} className="space-y-6">
          
          {/* Action State Error */}
          {state?.error && (
            <div className="rounded-xl border border-red-500/20 bg-red-50/50 dark:bg-red-950/20 text-red-600 dark:text-red-400 text-xs p-4 flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          {/* Student Profile Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="h-5 w-5 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center mr-2 text-[10px] font-bold">1</span>
              <span>Student Profile Details</span>
            </h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="studentName">Full Name *</label>
                <input
                  type="text"
                  name="studentName"
                  id="studentName"
                  required
                  placeholder="E.g. Sanjay Kumar"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  placeholder="E.g. sanjay@gmail.com"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="phone">Phone / WhatsApp *</label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  required
                  placeholder="E.g. +91 98765 43210"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="college">College / University Name</label>
                <input
                  type="text"
                  name="college"
                  id="college"
                  placeholder="E.g. VIT Vellore"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="department">Department</label>
                  <input
                    type="text"
                    name="department"
                    id="department"
                    placeholder="E.g. Computer Science"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="year">Year of Study</label>
                  <select
                    name="year"
                    id="year"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Post Graduate">Post Graduate / MCA</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Project Details Block */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <span className="h-5 w-5 rounded bg-violet-500/10 text-violet-500 flex items-center justify-center mr-2 text-[10px] font-bold">2</span>
              <span>Project Requirements</span>
            </h3>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="projectTitle">Project Title *</label>
                <input
                  type="text"
                  name="projectTitle"
                  id="projectTitle"
                  required
                  placeholder="E.g. Real-Time Object Detection for Visually Impaired"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="description">Requirement Specifications *</label>
                <textarea
                  name="description"
                  id="description"
                  required
                  rows={4}
                  placeholder="List down the detailed requirements of the system, hardware components (if IoT/Arduino), syllabus constraints, database requirements, and features..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              {/* Technologies Tag Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="technologies">Required Technologies (Press Enter to add)</label>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-2 flex flex-wrap gap-1.5 items-center">
                  {technologies.map((tech, index) => (
                    <span 
                      key={index} 
                      className="rounded bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 flex items-center space-x-1"
                    >
                      <span>{tech}</span>
                      <button type="button" onClick={() => handleRemoveTech(index)} className="hover:text-red-500 font-extrabold text-[9px] ml-1">x</button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={handleAddTech}
                    placeholder="E.g. Python, Flutter, OpenCV"
                    className="flex-grow bg-transparent border-none outline-none text-xs text-slate-900 dark:text-white py-0.5 px-1.5 min-w-[120px]"
                  />
                </div>
                <input type="hidden" name="technologies" value={technologies.join(',')} />
              </div>

              {/* Deadline & Budget */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="deadline">Target Submission Deadline</label>
                  <div className="relative">
                    <input
                      type="date"
                      name="deadline"
                      id="deadline"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="budget">Target Budget (INR)</label>
                  <div className="relative">
                    <input
                      type="number"
                      name="budget"
                      id="budget"
                      placeholder="E.g. 3000"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* File upload mock */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500">Upload Project Syllabus / Documents</label>
                <div className="border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 rounded-xl p-4 text-center">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Drag and drop syllabus PDF, Word DOCX, or images up to 5MB here.</p>
                  <input 
                    type="file" 
                    className="mt-2 text-[10px] text-slate-400"
                    onChange={() => toast('Syllabus document pre-uploaded successfully!', 'success')}
                  />
                </div>
              </div>

            </div>
          </div>

          <div className="text-right">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-sm font-semibold text-white px-6 py-3 shadow-lg shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
            >
              {isPending ? 'Submitting Request...' : 'Submit Project Request'}
            </button>
          </div>

        </form>
      )}

    </div>
  )
}
