'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Sparkles, Brain, Lightbulb, Code2, AlertTriangle, 
  HelpCircle, FileCode, Copy, Check, Loader2 
} from 'lucide-react'

export default function AIToolsPage() {
  const [activeTool, setActiveTool] = useState<'idea' | 'readme' | 'viva' | 'explain' | 'optimize'>('idea')
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setResult('')
    setCopied(false)

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool: activeTool, prompt }),
      })
      if (res.ok) {
        const data = await res.json()
        setResult(data.result || 'No response generated.')
      } else {
        setResult('Generation failed. Please try again.')
      }
    } catch (err) {
      setResult('Connection failed. Please check your network.')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const toolsConfig = {
    idea: {
      title: 'Project Idea Generator',
      description: 'Input domain streams or tech keywords (e.g. Python, OpenCV, Civil) to generate 3 customized submit-ready academic project titles & synopses.',
      placeholder: 'Enter keywords (e.g. Flutter Bluetooth, IoT Irrigation, React Node)...',
      buttonText: 'Generate Ideas',
      icon: Lightbulb
    },
    readme: {
      title: 'README & Documentation Generator',
      description: 'Input your project title to generate a complete, structured academic README file in markdown format.',
      placeholder: 'Enter project title (e.g. AI-Powered Smart Parking Hub)...',
      buttonText: 'Generate README.md',
      icon: FileCode
    },
    viva: {
      title: 'Viva Questions Generator',
      description: 'Input your project topic to generate the top 5 most common viva voce questions along with detailed answers.',
      placeholder: 'Enter project topic (e.g. cosine similarity plagiarism detector)...',
      buttonText: 'Generate Questions',
      icon: HelpCircle
    },
    explain: {
      title: 'Code Explainer',
      description: 'Paste any complex script blocks (C, C++, Java, Python, JS) to receive a line-by-line logical analysis report.',
      placeholder: 'Paste your code script here...',
      buttonText: 'Explain Code',
      icon: Code2
    },
    optimize: {
      title: 'Bug Finder & Optimizer',
      description: 'Paste your code script to locate syntax warnings, optimization issues, and get refactoring code blocks.',
      placeholder: 'Paste your code script here...',
      buttonText: 'Find Bugs & Optimize',
      icon: AlertTriangle
    }
  }

  const CurrentIcon = toolsConfig[activeTool].icon

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-12">
        <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400">
          <Brain className="h-6 w-6 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">AI Academic Companion</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Generate idea synopses, write README files, study viva preparation answers, and analyze complex code errors instantly.</p>
      </div>

      {/* Grid Layout */}
      <div className="grid lg:grid-cols-4 gap-8">
        
        {/* Tool Selector list */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'idea', label: 'Idea Generator', icon: Lightbulb },
            { id: 'readme', label: 'README Generator', icon: FileCode },
            { id: 'viva', label: 'Viva Q&A Prep', icon: HelpCircle },
            { id: 'explain', label: 'Code Explainer', icon: Code2 },
            { id: 'optimize', label: 'Bug & Optimize', icon: AlertTriangle },
          ].map((tool) => {
            const Icon = tool.icon
            const isActive = activeTool === tool.id
            return (
              <button
                key={tool.id}
                onClick={() => {
                  setActiveTool(tool.id as any)
                  setPrompt('')
                  setResult('')
                }}
                className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                  isActive 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50/20 dark:bg-blue-900/10 text-blue-600 dark:text-blue-400' 
                    : 'border-slate-200/60 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tool.label}</span>
              </button>
            )
          })}
        </div>

        {/* Input Form & Generation Area */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Form */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <CurrentIcon className="h-4.5 w-4.5" />
              </div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">{toolsConfig[activeTool].title}</h2>
            </div>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{toolsConfig[activeTool].description}</p>
            
            <form onSubmit={handleGenerate} className="space-y-4">
              {activeTool === 'explain' || activeTool === 'optimize' ? (
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  rows={8}
                  placeholder={toolsConfig[activeTool].placeholder}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              ) : (
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  required
                  placeholder={toolsConfig[activeTool].placeholder}
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              )}
              
              <div className="text-right">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-xs font-semibold text-white px-5 py-3 shadow-md shadow-blue-500/10 transition-colors"
                >
                  {loading && <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />}
                  <span>{toolsConfig[activeTool].buttonText}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Results Box */}
          {(result || loading) && (
            <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in duration-300">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center">
                  <Sparkles className="h-3.5 w-3.5 text-blue-400 mr-1.5" />
                  <span>AI Generated Output</span>
                </span>
                {result && !loading && (
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center space-x-1 text-[10px] font-bold text-slate-400 hover:text-white"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                )}
              </div>

              {loading ? (
                <div className="space-y-3.5 py-4 animate-pulse">
                  <div className="h-3.5 bg-slate-800 rounded-lg w-3/4"></div>
                  <div className="h-3.5 bg-slate-800 rounded-lg w-5/6"></div>
                  <div className="h-3.5 bg-slate-800 rounded-lg w-2/3"></div>
                  <div className="h-3.5 bg-slate-800 rounded-lg w-4/5"></div>
                  <p className="text-[10px] text-slate-500 font-mono pt-2">Streaming structured response from Gemini API...</p>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-w-none"
                >
                  {result}
                </motion.div>
              )}
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
