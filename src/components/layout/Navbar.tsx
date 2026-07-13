'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  Menu, X, Sun, Moon, Bell, LogOut, User, 
  GraduationCap, MessageSquare, ChevronRight, Settings, Grid
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [notifications, setNotifications] = useState<any[]>([])

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark'
    setTheme(savedTheme as 'light' | 'dark')
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Toggle theme
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Load notifications
  useEffect(() => {
    if (user) {
      fetch('/api/notifications')
        .then(res => res.json())
        .then(data => {
          if (data.notifications) {
            setNotifications(data.notifications)
          }
        })
        .catch(err => console.error(err))
    }
  }, [user])

  const unreadCount = notifications.filter(n => !n.read).length

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' })
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    } catch (err) {
      console.error(err)
    }
  }

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Projects', href: '/projects' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Portfolio', href: '/portfolio' },
    { name: 'Request Project', href: '/request' },
    { name: 'Learning', href: '/learning' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/40 dark:border-slate-800/40 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 tracking-tight">
                Project<span className="text-blue-600 dark:text-blue-400">Hub</span>
              </span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-blue-600 dark:hover:text-blue-400 ${
                    isActive 
                      ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 py-1' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Notifications Center */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors relative"
                >
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white dark:ring-slate-950">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                      <span className="font-semibold text-sm text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{unreadCount} unread</span>}
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-400">No new notifications</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            onClick={() => handleMarkAsRead(notif.id)}
                            className={`px-4 py-3 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors ${!notif.read ? 'bg-blue-50/20 dark:bg-blue-900/10' : ''}`}
                          >
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-white">{notif.title}</h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="px-4 py-1.5 border-t border-slate-200 dark:border-slate-800 text-center">
                      <Link href="/dashboard" className="text-[11px] text-blue-600 dark:text-blue-400 font-medium hover:underline" onClick={() => setNotificationsOpen(false)}>
                        View Student Dashboard
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Auth / Dashboard buttons */}
            {user ? (
              <div className="flex items-center space-x-3">
                <Link
                  href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                  className="flex items-center space-x-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 bg-slate-50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20 transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4.5 w-4.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-sm font-semibold text-white px-4 py-2 shadow-md shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300"
                >
                  Join Free
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <hr className="border-slate-200 dark:border-slate-800" />
          {user ? (
            <div className="space-y-2">
              <Link
                href={user.role === 'ADMIN' ? '/admin' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
              >
                <User className="h-5 w-5" />
                <span>Dashboard ({user.name})</span>
              </Link>
              <button
                onClick={() => {
                  logout()
                  setMobileMenuOpen(false)
                }}
                className="flex w-full items-center space-x-2 rounded-lg px-3 py-2 text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/10"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
