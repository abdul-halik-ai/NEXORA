'use client'

import React, { useState, useEffect, useRef } from 'react'
import { MessageSquare, X, Send, User, Bot, Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

export default function SupportChat() {
  const { user } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [guestId, setGuestId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Establish guest or user session id
  useEffect(() => {
    let id = user?.id
    if (!id) {
      id = localStorage.getItem('projecthub_guest_id') || ''
      if (!id) {
        id = `guest-${Math.random().toString(36).substring(2, 11)}`
        localStorage.setItem('projecthub_guest_id', id)
      }
    }
    setGuestId(id)
  }, [user])

  // Fetch messages
  const fetchMessages = async () => {
    if (!guestId) return
    try {
      const res = await fetch(`/api/messages?senderId=${guestId}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (isOpen && guestId) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 4000) // Poll every 4 seconds
      return () => clearInterval(interval)
    }
  }, [isOpen, guestId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim() || !guestId) return

    const clientMsg = {
      id: `client-${Date.now()}`,
      senderId: guestId,
      senderName: user?.name || 'Guest Student',
      text: text.trim(),
      isFromAdmin: false,
      createdAt: new Date(),
    }

    setMessages(prev => [...prev, clientMsg])
    const promptText = text.trim()
    setText('')
    setLoading(true)

    try {
      // Send to server
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: guestId,
          senderName: user?.name || 'Guest Student',
          text: promptText,
          isFromAdmin: false,
        }),
      })

      if (res.ok) {
        // Trigger automated admin helper response after 1.5 seconds
        setTimeout(async () => {
          let replyText = 'Thanks for your query! An academic support representative will contact you shortly via email.'
          
          const q = promptText.toLowerCase()
          if (q.includes('download') || q.includes('source code')) {
            replyText = 'To download any project, simply go to its page and click "Download Source Code". Free downloads are available for registered students.'
          } else if (q.includes('request') || q.includes('custom')) {
            replyText = 'You can request a custom project by navigating to our "Request Project" page. Fill out your requirements, and our team will quote you within 24 hours.'
          } else if (q.includes('python') || q.includes('machine learning')) {
            replyText = 'We have 20+ Python and ML projects ready! Search under the "AI & Machine Learning" category. They come with full code and Jupyter notebook reports.'
          } else if (q.includes('price') || q.includes('cost') || q.includes('budget')) {
            replyText = 'All catalog projects on ProjectHub are 100% free! Custom projects have flexible student-friendly pricing starting from 1,500 INR.'
          }

          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              senderId: guestId,
              senderName: 'Admin Assistant',
              text: replyText,
              isFromAdmin: true,
            }),
          })
          fetchMessages()
        }, 1500)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-xl shadow-blue-500/20 hover:scale-105 transition-all duration-300 border border-white/10"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Chat Widget */}
      {isOpen && (
        <div className="w-80 sm:w-96 h-[500px] rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-violet-600 px-4 py-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold">Academic Helpdesk</h3>
                <p className="text-[10px] text-blue-100 flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
                  Replies in 1 min
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto space-y-4 bg-slate-50 dark:bg-slate-900/30">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-2">
                <Bot className="h-10 w-10 text-slate-300 dark:text-slate-700" />
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Ask us any query about download keys, setup installation, or custom project requests!</p>
              </div>
            ) : (
              messages.map((msg) => {
                const isAdmin = msg.isFromAdmin
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                    <div className={`flex items-start space-x-2 max-w-[80%] ${isAdmin ? '' : 'flex-row-reverse space-x-reverse'}`}>
                      <div className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-bold ${
                        isAdmin 
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' 
                          : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                      }`}>
                        {isAdmin ? 'AD' : 'ST'}
                      </div>
                      <div className={`rounded-2xl px-3 py-2 text-xs leading-relaxed ${
                        isAdmin 
                          ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200/50 dark:border-slate-800' 
                          : 'bg-blue-600 text-white shadow-md shadow-blue-500/10'
                      }`}>
                        {msg.text}
                      </div>
                    </div>
                  </div>
                )
              })
            )}
            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2 bg-white dark:bg-slate-800 rounded-2xl px-3 py-2 border border-slate-200/50 dark:border-slate-800">
                  <Loader2 className="h-3 w-3 animate-spin text-slate-400" />
                  <span className="text-[10px] text-slate-400">Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900 flex space-x-2">
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask support..."
              className="flex-grow rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-2 flex items-center justify-center shadow-md shadow-blue-500/10"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>

        </div>
      )}
    </div>
  )
}
