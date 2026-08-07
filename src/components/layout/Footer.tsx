'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { GraduationCap, Mail, Phone, MapPin, Send, Check } from 'lucide-react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubscribed(true)
      setEmail('')
      setTimeout(() => setSubscribed(false), 5000)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-900/50 transition-colors duration-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">

          {/* Logo & Info */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl overflow-hidden shadow-md group-hover:scale-110 group-hover:-rotate-3 hover:shadow-blue-500/50 transition-all duration-300 ease-out">
                <img src="/logo.png" alt="Nexora Logo" className="h-full w-full object-cover" />
              </div>
              <span className="text-xl font-bold dark:text-white tracking-tight">
                Nexora
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs leading-relaxed">
              Empowering school, engineering, arts & science, and college students with open-source project codes, custom development, and comprehensive learning resources.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-sm">
                <Mail className="h-4.5 w-4.5 text-blue-500" />
                <span>abdulhalik1541@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-sm">
                <Phone className="h-4.5 w-4.5 text-blue-500" />
                <span>+91 99629 91541</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-500 dark:text-slate-400 text-sm">
                <MapPin className="h-4.5 w-4.5 text-blue-500" />
                <span>Nexora Company, Natham, Dindigul, Tamil Nadu, India</span>
              </div>
            </div>
          </div>

          {/* Links Sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Explore
                </h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link href="/projects" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      Free Projects
                    </Link>
                  </li>
                  <li>
                    <Link href="/request" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      Request Custom Project
                    </Link>
                  </li>
                  <li>
                    <Link href="/learning" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      Study Materials
                    </Link>
                  </li>
                  <li>
                    <Link href="/ai-tools" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      AI Project Companion
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Company
                </h3>
                <ul className="mt-4 space-y-3">
                  <li>
                    <Link href="/about" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      Contact Support
                    </Link>
                  </li>
                  <li>
                    <Link href="/about#team" className="text-sm text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-white transition-colors">
                      Our Team
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter Subscription */}
            <div>
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Newsletter
              </h3>
              <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                Get monthly updates with newly uploaded academic codes, syllabus changes, and interview answers.
              </p>
              <form onSubmit={handleSubscribe} className="mt-4 flex max-w-md">
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <div className="relative flex-grow">
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter student email"
                    className="w-full rounded-l-xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button
                  type="submit"
                  disabled={subscribed}
                  className={`flex items-center justify-center rounded-r-xl px-4 py-2 text-sm font-semibold text-white shadow-md transition-colors ${subscribed
                    ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/10'
                    }`}
                >
                  {subscribed ? <Check className="h-4.5 w-4.5" /> : <Send className="h-4.5 w-4.5" />}
                </button>
              </form>
            </div>
          </div>

        </div>

        <div className="mt-12 border-t border-slate-200/50 dark:border-slate-900/50 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <p>&copy; {new Date().getFullYear()} Nexora. Designed for academic excellence. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-blue-500 transition-colors">Syllabus Guidelines</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
