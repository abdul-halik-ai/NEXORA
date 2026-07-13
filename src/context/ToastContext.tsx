'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toast: (message: string, type?: 'success' | 'error' | 'info') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {/* Floating Toast Portal Container */}
      <div className="fixed bottom-6 right-6 z-55 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border backdrop-blur-md shadow-lg ${
                t.type === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400'
                  : t.type === 'error'
                  ? 'bg-rose-500/10 border-rose-500/20 text-rose-700 dark:text-rose-450'
                  : 'bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-400'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {t.type === 'success' ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                ) : t.type === 'error' ? (
                  <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500 shrink-0" />
                )}
                <span className="text-xs font-bold leading-relaxed">{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
