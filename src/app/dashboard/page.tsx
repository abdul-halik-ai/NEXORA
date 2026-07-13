'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  User, Download, Sparkles, Heart, Bell, Settings, 
  Award, FileText, ArrowRight, Clock, MapPin, IndianRupee, 
  Loader2, CheckCircle2, AlertCircle, HelpCircle, MessageSquare,
  Plus, Calendar, ChevronDown, ChevronUp
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

export default function StudentDashboard() {
  const { toast } = useToast()
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'downloads' | 'requests' | 'purchases' | 'tickets' | 'wishlist' | 'certificates' | 'notifications' | 'settings'>('profile')

  // Data States
  const [downloads, setDownloads] = useState<any[]>([])
  const [requests, setRequests] = useState<any[]>([])
  const [wishlist, setWishlist] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [newTicketMsg, setNewTicketMsg] = useState('')

  // Expandable Request Milestones Tracker
  const [expandedRequest, setExpandedRequest] = useState<string | null>(null)
  
  // Modals
  const [showNewTicketModal, setShowNewTicketModal] = useState(false)
  const [newTicketSubject, setNewTicketSubject] = useState('')
  const [newTicketCategory, setNewTicketCategory] = useState('Installation')
  const [newTicketPriority, setNewTicketPriority] = useState('Medium')
  const [newTicketText, setNewTicketText] = useState('')

  // Profile Form
  const [phone, setPhone] = useState('')
  const [college, setCollege] = useState('')
  const [department, setDepartment] = useState('')
  const [year, setYear] = useState('3rd Year')
  const [updating, setUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState('')

  // Load Dashboard Data
  useEffect(() => {
    if (user) {
      setPhone(user.phone || '')
      setCollege(user.college || '')
      setDepartment(user.department || '')
      setYear(user.year || '3rd Year')

      // Fetch projects to populate logs
      fetch(`/api/projects?sort=latest`)
        .then(res => res.json())
        .then(data => {
          if (data.projects) {
            setDownloads([
              { id: 'dl-1', downloadedAt: new Date(Date.now() - 3600000 * 24), project: data.projects[0] }
            ])
            if (data.projects[1]) {
              setWishlist([data.projects[1]])
            }
          }
        })

      // Fetch custom requests
      fetch(`/api/requests?email=${user.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.requests) {
            // Map with mock milestones
            const requestsWithMilestones = data.requests.map((r: any) => ({
              ...r,
              milestones: r.id === 'req-2' || r.status === 'APPROVED' ? [
                { title: 'Hardware Board Assembly', desc: 'Procuring microcontroller, soil sensors, and soldering components.', status: 'Completed', percent: 100 },
                { title: 'MQTT Telemetry Integration', desc: 'Connecting ESP32 to cloud dashboards to post values.', status: 'In Progress', percent: 50 },
                { title: 'Web Dashboard & Documentation', desc: 'Setting up Next.js graph layouts, writing synopses.', status: 'Pending', percent: 0 }
              ] : []
            }))
            setRequests(requestsWithMilestones)
          }
        })

      // Fetch notifications
      fetch(`/api/notifications`)
        .then(res => res.json())
        .then(data => {
          if (data.notifications) setNotifications(data.notifications)
        })

      // Mock Premium Purchases
      setPurchases([
        {
          id: 'ord-101',
          invoiceNumber: 'INV-40912',
          date: '2026-06-12',
          productName: 'Premium NextJS SaaS Boilerplate UI Kit',
          amount: 499,
          coupon: 'STUDENT50',
          status: 'PAID'
        }
      ])

      // Mock Support Tickets
      setTickets([
        {
          id: 'tkt-1',
          subject: 'Gerber Files extraction error',
          category: 'Installation',
          priority: 'Medium',
          status: 'OPEN',
          updatedAt: new Date(),
          messages: [
            { senderName: 'Sanjay Kumar', text: 'Hi support team, I downloaded the Gerber files for the ESP32 project but the drill holes layer seems to throw import warnings in JLCPCB. Can you verify?', isFromStaff: false, createdAt: new Date(Date.now() - 3600000 * 2) },
            { senderName: 'Coordinator Rakesh', text: 'Hey Sanjay! Let me check the layout parameters. We are re-exporting the files with absolute drill offsets. I will attach the fix shortly.', isFromStaff: true, createdAt: new Date(Date.now() - 3600000) }
          ]
        }
      ])
    }
  }, [user])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setUpdating(true)
    setUpdateSuccess('')
    await new Promise(resolve => setTimeout(resolve, 800))
    setUpdateSuccess('Profile settings updated successfully!')
    setUpdating(false)
  }

  // Raise new Support ticket
  const handleRaiseTicket = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketSubject || !newTicketText) return

    const newTkt = {
      id: `tkt-${Date.now()}`,
      subject: newTicketSubject,
      category: newTicketCategory,
      priority: newTicketPriority,
      status: 'OPEN',
      updatedAt: new Date(),
      messages: [
        { senderName: user?.name || 'Student', text: newTicketText, isFromStaff: false, createdAt: new Date() }
      ]
    }

    setTickets([newTkt, ...tickets])
    setShowNewTicketModal(false)
    setNewTicketSubject('')
    setNewTicketText('')
    toast('Support ticket raised successfully! Our mentors are reviewing your query.', 'success')
  }

  // Send message inside selected ticket
  const handleSendTicketMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTicketMsg.trim() || !selectedTicket) return

    const updatedMessages = [
      ...selectedTicket.messages,
      { senderName: user?.name || 'Student', text: newTicketMsg, isFromStaff: false, createdAt: new Date() }
    ]

    const updatedTicket = {
      ...selectedTicket,
      messages: updatedMessages,
      updatedAt: new Date()
    }

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t))
    setSelectedTicket(updatedTicket)
    setNewTicketMsg('')
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <User className="h-12 w-12 text-slate-350 dark:text-slate-700 mx-auto" />
        <h1 className="text-xl font-bold dark:text-white">Student Sign In Required</h1>
        <p className="text-xs text-slate-505 dark:text-slate-400 max-w-xs mx-auto">Please login to access download codes, order history, and track custom project milestones.</p>
        <Link 
          href="/login" 
          className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500"
        >
          Sign In
        </Link>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    const colors: any = {
      PENDING: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      APPROVED: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      IN_PROGRESS: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      COMPLETED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      REJECTED: 'bg-rose-500/10 text-rose-450 border-rose-500/20',
      OPEN: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
      RESOLVED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
    }
    return colors[status] || 'bg-slate-500/10 text-slate-400'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Info */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between shadow-md">
        <div className="space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-blue-100 bg-white/10 px-2.5 py-1 rounded-full">Student Desk</span>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name}!</h1>
          <p className="text-xs text-blue-100">Review project deadlines, access digital invoices, and track hardware milestones.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            href="/projects"
            className="inline-flex items-center justify-center rounded-xl bg-white text-blue-600 text-xs font-bold px-4 py-2.5 shadow-sm hover:bg-slate-50"
          >
            Browse Projects <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-8 items-start">
        
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'profile', label: 'Student Profile', icon: User },
            { id: 'downloads', label: `Downloads (${downloads.length})`, icon: Download },
            { id: 'requests', label: `Custom Projects (${requests.length})`, icon: Clock },
            { id: 'purchases', label: `Order History (${purchases.length})`, icon: FileText },
            { id: 'tickets', label: `Support Tickets (${tickets.length})`, icon: HelpCircle },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart },
            { id: 'certificates', label: 'My Certificates', icon: Award },
            { id: 'notifications', label: `Notifications (${notifications.filter(n => !n.read).length})`, icon: Bell },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  isActive 
                    ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-3">
          
          {activeTab === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Details</h3>
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">Name</span>
                  <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">Email</span>
                  <p className="font-bold text-slate-900 dark:text-white">{user.email}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">College</span>
                  <p className="font-bold text-slate-900 dark:text-white">{college || 'Not set'}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">Department Stream</span>
                  <p className="font-bold text-slate-900 dark:text-white">{department || 'Not set'}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">Academic Year</span>
                  <p className="font-bold text-slate-900 dark:text-white">{year}</p>
                </div>
                <div className="space-y-1 text-xs">
                  <span className="font-semibold text-slate-400 uppercase text-[10px]">WhatsApp Mobile</span>
                  <p className="font-bold text-slate-900 dark:text-white">{phone || 'Not set'}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'downloads' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Download Logs</h3>
              {downloads.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">You haven't downloaded any free project source codes yet.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {downloads.map((dl) => (
                    <div key={dl.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{dl.project?.title}</h4>
                        <span className="text-[10px] text-slate-400">Downloaded: {new Date(dl.downloadedAt).toLocaleDateString()}</span>
                      </div>
                      <Link href={`/projects/${dl.project?.slug}`} className="text-blue-500 font-bold hover:underline">Details</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Custom Requests Milestones Tracking */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Project Milestones Tracking</h3>
                <Link href="/request" className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> Request Custom Project
                </Link>
              </div>

              {requests.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No custom requests logged yet.</p>
              ) : (
                <div className="space-y-6">
                  {requests.map((req) => {
                    const isExpanded = expandedRequest === req.id
                    return (
                      <div key={req.id} className="border border-slate-200 dark:border-slate-850 rounded-2xl overflow-hidden bg-slate-50/30 dark:bg-slate-950/20">
                        
                        {/* Summary Header */}
                        <div 
                          onClick={() => setExpandedRequest(isExpanded ? null : req.id)}
                          className="p-5 flex justify-between items-center cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/30 transition-all duration-200"
                        >
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{req.projectTitle}</h4>
                            <div className="flex gap-3 text-[10px] text-slate-400">
                              <span>Budget: ₹{req.budget}</span>
                              <span>•</span>
                              <span>Deadline: {new Date(req.deadline).toLocaleDateString()}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                            {isExpanded ? <ChevronUp className="h-4 w-4 text-slate-450" /> : <ChevronDown className="h-4 w-4 text-slate-455" />}
                          </div>
                        </div>

                        {/* Expandable Milestones Timeline */}
                        {isExpanded && (
                          <div className="p-5 border-t border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-900 space-y-6 animate-in slide-in-from-top-2 duration-300">
                            <div className="flex justify-between items-center text-xs">
                              <span className="font-bold text-slate-500">Live Project Progress Timeline:</span>
                              <span className="font-black text-blue-600 dark:text-blue-400">
                                {req.status === 'COMPLETED' ? '100% Completed' : req.status === 'IN_PROGRESS' ? '50% Developed' : '0% (Awaiting approval)'}
                              </span>
                            </div>

                            {req.milestones.length === 0 ? (
                              <div className="p-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-2">
                                <AlertCircle className="h-5 w-5 text-slate-400 mx-auto" />
                                <p className="text-[11px] text-slate-500">Once your budget is approved by our academic advisor, developers will publish active milestones here.</p>
                              </div>
                            ) : (
                              <div className="relative pl-6 border-l border-slate-200 dark:border-slate-800 space-y-6">
                                {req.milestones.map((ms: any, index: number) => (
                                  <div key={index} className="relative space-y-1">
                                    {/* Circular Check Bullet */}
                                    <span className={`absolute -left-[31px] top-0.5 h-4.5 w-4.5 rounded-full flex items-center justify-center text-[9px] font-bold border ${
                                      ms.status === 'Completed'
                                        ? 'bg-emerald-500 text-white border-emerald-500'
                                        : ms.status === 'In Progress'
                                        ? 'bg-blue-500 text-white border-blue-500 animate-pulse'
                                        : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-200 dark:border-slate-800'
                                    }`}>
                                      {ms.status === 'Completed' ? '✓' : index + 1}
                                    </span>
                                    
                                    <div className="flex justify-between items-baseline">
                                      <h5 className="text-xs font-bold text-slate-900 dark:text-white">{ms.title}</h5>
                                      <span className="text-[9px] font-bold text-slate-450 uppercase">{ms.status}</span>
                                    </div>
                                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">{ms.desc}</p>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Completed Download Links */}
                            {req.status === 'COMPLETED' && (
                              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                                <div>
                                  <p className="font-bold text-emerald-800 dark:text-emerald-300">Deliverables ready for download!</p>
                                  <p className="text-[10px] text-emerald-600 dark:text-emerald-450">Includes full source code zip and draft synopsis report.</p>
                                </div>
                                <button 
                                  onClick={() => toast('Custom project package downloaded successfully!', 'success')}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all"
                                >
                                  Download Files
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Premium Order Billing History */}
          {activeTab === 'purchases' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">E-Commerce Purchases & Invoices</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[9px] tracking-wider">
                      <th className="pb-3">Invoice No</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {purchases.map((p) => (
                      <tr key={p.id} className="text-slate-700 dark:text-slate-350">
                        <td className="py-4 font-mono font-bold text-slate-900 dark:text-white">{p.invoiceNumber}</td>
                        <td className="py-4 font-bold text-slate-900 dark:text-white truncate max-w-[200px]">{p.productName}</td>
                        <td className="py-4">₹{p.amount}</td>
                        <td className="py-4">{p.date}</td>
                        <td className="py-4 text-right">
                          <button 
                            onClick={() => toast(`GST Invoice PDF (${p.invoiceNumber}) downloaded successfully!`, 'success')}
                            className="inline-flex items-center gap-1 font-bold text-blue-500 hover:underline"
                          >
                            <FileText className="h-3.5 w-3.5" /> PDF Invoice
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Support Ticket Center */}
          {activeTab === 'tickets' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              {!selectedTicket ? (
                <>
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Helpdesk Support Tickets</h3>
                    <button 
                      onClick={() => setShowNewTicketModal(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" /> Open Ticket
                    </button>
                  </div>

                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tickets.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTicket(t)}
                        className="py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-800/10 px-2 rounded-xl"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white hover:text-blue-500">{t.subject}</h4>
                          <div className="flex gap-3 text-[9px] text-slate-450">
                            <span>Category: {t.category}</span>
                            <span>•</span>
                            <span>Priority: {t.priority}</span>
                          </div>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusColor(t.status)}`}>
                          {t.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <button 
                      onClick={() => setSelectedTicket(null)}
                      className="text-xs font-bold text-slate-550 dark:text-slate-400 flex items-center gap-1"
                    >
                      ← Back to Tickets
                    </button>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                    <p className="text-[10px] text-slate-400">Raised under {selectedTicket.category} | Priority {selectedTicket.priority}</p>
                  </div>

                  {/* Messaging Logs */}
                  <div className="border border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/20 p-4 rounded-2xl h-64 overflow-y-auto space-y-4 text-xs">
                    {selectedTicket.messages.map((msg: any, idx: number) => (
                      <div key={idx} className={`space-y-1 ${msg.isFromStaff ? 'bg-blue-500/5 border border-blue-500/10 p-3 rounded-2xl' : 'bg-white dark:bg-slate-900 p-3 rounded-2xl'}`}>
                        <div className="flex justify-between items-baseline">
                          <span className={`font-bold ${msg.isFromStaff ? 'text-blue-500' : 'text-slate-900 dark:text-white'}`}>
                            {msg.senderName} {msg.isFromStaff && '• Staff'}
                          </span>
                          <span className="text-[9px] text-slate-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="text-slate-650 dark:text-slate-350 leading-relaxed text-xs">{msg.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Messaging Reply Form */}
                  <form onSubmit={handleSendTicketMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newTicketMsg}
                      onChange={(e) => setNewTicketMsg(e.target.value)}
                      placeholder="Type your reply to staff..."
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-colors"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {activeTab === 'wishlist' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">My Wishlist</h3>
              {wishlist.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Your wishlist is empty.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {wishlist.map((proj) => (
                    <div key={proj.id} className="py-3 flex justify-between items-center text-xs">
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white">{proj.title}</h4>
                        <span className="text-[10px] text-slate-400">{proj.difficulty} &bull; {proj.duration}</span>
                      </div>
                      <Link href={`/projects/${proj.slug}`} className="text-blue-500 font-bold hover:underline">Open</Link>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Academic Completion Certificates</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Complete tasks to unlock certificates recognized by student partner networks.</p>
              
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl p-5 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col sm:flex-row items-center sm:justify-between space-y-4 sm:space-y-0">
                <div className="flex items-center space-x-3.5 text-center sm:text-left flex-col sm:flex-row">
                  <div className="h-12 w-12 rounded-xl bg-violet-50 dark:bg-violet-900/20 text-violet-600 dark:text-violet-400 flex items-center justify-center mb-2.5 sm:mb-0">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">Practical Project Developer Certificate</h4>
                    <p className="text-[10px] text-slate-400">Locked. Requires downloading 2 projects and scoring 80% on 1 Q&A test.</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast('Requires downloading at least 2 project files to initialize completion tests.', 'info')}
                  className="rounded-xl bg-blue-600 text-white text-xs font-bold px-4 py-2 shadow-sm hover:bg-blue-500"
                >
                  Generate
                </button>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Notifications Inbox</h3>
              {notifications.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-6">Inbox is empty.</p>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {notifications.map((notif) => (
                    <div key={notif.id} className={`py-3.5 space-y-1 ${!notif.read ? 'bg-blue-50/10 dark:bg-blue-900/5 px-2 rounded-lg' : ''}`}>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">{notif.title}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{notif.message}</p>
                      <span className="text-[9px] text-slate-400 block pt-1">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Update Academic Profile</h3>
              
              {updateSuccess && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold">
                  {updateSuccess}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Contact WhatsApp Mobile</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">College / Institution</label>
                    <input
                      type="text"
                      value={college}
                      onChange={(e) => setCollege(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Department</label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Academic Year</label>
                    <select
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                      <option value="Post Graduate">Post Graduate</option>
                    </select>
                  </div>
                </div>

                <div className="text-right pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 shadow-sm"
                  >
                    {updating ? 'Saving Settings...' : 'Save Settings'}
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>

      </div>

      {/* New Support Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-white">Open Support Ticket</h3>
            
            <form onSubmit={handleRaiseTicket} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500">Ticket Subject</label>
                <input
                  type="text"
                  required
                  value={newTicketSubject}
                  onChange={(e) => setNewTicketSubject(e.target.value)}
                  placeholder="e.g. Missing drill holes in ESP32 PCB"
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Category</label>
                  <select
                    value={newTicketCategory}
                    onChange={(e) => setNewTicketCategory(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Installation">Installation</option>
                    <option value="Billing / Payment">Billing / Payment</option>
                    <option value="Custom Code Fix">Custom Code Fix</option>
                    <option value="Feedback">Feedback</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Priority</label>
                  <select
                    value={newTicketPriority}
                    onChange={(e) => setNewTicketPriority(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-500">Explain your Issue</label>
                <textarea
                  required
                  rows={4}
                  value={newTicketText}
                  onChange={(e) => setNewTicketText(e.target.value)}
                  placeholder="Explain what components are misbehaving or missing..."
                  className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl"
                >
                  Raise Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
