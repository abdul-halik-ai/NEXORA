'use client'

import React, { useState } from 'react'
import {
  Mail, Phone, MapPin, MessageCircle, Clock,
  Send, AlertCircle, CheckCircle2
} from 'lucide-react'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSuccess('')

    // Simulate backend email handler API
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSuccess('Thank you! Your academic ticket has been raised. Check email for updates.')

    setName('')
    setEmail('')
    setSubject('')
    setMessage('')
    setSubmitting(false)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Helpdesk Support</span>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white sm:text-4xl">Get in Touch</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Have questions about code setups, zip file compilation errors, or custom submissions? Contact us here.</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 items-start">

        {/* Info Credentials Sidebar */}
        <div className="lg:col-span-1 space-y-6">

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 space-y-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">Support Info</h3>

            <div className="space-y-4">
              <div className="flex items-start space-x-3.5 text-xs">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Email Address</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">abdulhalik1541@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 text-xs">
                <Phone className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Phone Support</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5">+91 99629 91541</p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 text-xs">
                <MapPin className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Office Location</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Nexora Company <br />
                    Natham, Dindigul - 624401
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 text-xs">
                <Clock className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">Academic Support Hours</h4>
                  <p className="text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 10:00 AM - 2:00 PM
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* WhatsApp Direct Help */}
          <a
            href="https://wa.me/919962991541"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 w-full rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 text-sm font-semibold shadow-md transition-colors"
          >
            <MessageCircle className="h-5 w-5 fill-current" />
            <span>Chat on WhatsApp</span>
          </a>

        </div>

        {/* Form Container */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">Send a Message</h3>

            {success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-4 flex items-start space-x-2 mb-4">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
                <span>{success}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="name">Your Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Sanjay Kumar"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500" htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="E.g. sanjay@gmail.com"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="subject">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="E.g. Code syntax error on plagiarism detector"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-500" htmlFor="message">Message Description</label>
                <textarea
                  id="message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  placeholder="Elaborate your academic ticket description..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 p-3 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="text-right">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-5 py-3 shadow-md shadow-blue-500/10"
                >
                  <Send className="mr-1.5 h-3.5 w-3.5" />
                  <span>{submitting ? 'Sending Ticket...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          </div>

          {/* Simulated Google Map representation */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm aspect-[21/9] flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
              <div className="text-center space-y-2">
                <MapPin className="h-8 w-8 text-rose-500 mx-auto animate-bounce" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Google Map Location</span>
                <p className="text-xs text-slate-400">IIT Madras Research Park, Chennai, India</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  )
}
