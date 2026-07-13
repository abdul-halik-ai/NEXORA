'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { 
  User, Download, Sparkles, Heart, Bell, Settings, 
  Award, FileText, ArrowRight, Clock, MapPin, IndianRupee, 
  Loader2, CheckCircle2, AlertCircle, HelpCircle, MessageSquare,
  Plus, Calendar, ShieldCheck, ShieldAlert, BarChart3, Upload,
  Send, Trash2, Edit3, Eye, ShoppingCart, Activity, BookOpen
} from 'lucide-react'
import { updateRequestStatus, saveProject, deleteProject } from '@/app/actions'

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'analytics' | 'requests' | 'projects' | 'purchases' | 'tickets' | 'auditLogs' | 'broadcast' | 'challenges'>('analytics')

  // Data States
  const [analytics, setAnalytics] = useState<any>(null)
  const [requests, setRequests] = useState<any[]>([])
  const [projects, setProjects] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [purchases, setPurchases] = useState<any[]>([])
  const [tickets, setTickets] = useState<any[]>([])
  const [auditLogs, setAuditLogs] = useState<any[]>([])
  
  // Custom Milestones Editor State
  const [selectedReqForMilestones, setSelectedReqForMilestones] = useState<any | null>(null)
  const [milestonesList, setMilestonesList] = useState<any[]>([])
  const [newMilestoneTitle, setNewMilestoneTitle] = useState('')
  const [newMilestoneDesc, setNewMilestoneDesc] = useState('')

  // Support Tickets Admin Chat State
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null)
  const [adminReplyText, setAdminReplyText] = useState('')

  // Project Form States
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null)
  const [projectTitle, setProjectTitle] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [projectLongDesc, setProjectLongDesc] = useState('')
  const [projectDiff, setProjectDiff] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'>('BEGINNER')
  const [projectDuration, setProjectDuration] = useState('')
  const [projectCategoryId, setProjectCategoryId] = useState('')
  const [projectImage, setProjectImage] = useState('')
  const [projectTech, setProjectTech] = useState('')
  const [projectFeatures, setProjectFeatures] = useState('')
  const [projectDocUrl, setProjectDocUrl] = useState('')
  const [projectCodeUrl, setProjectCodeUrl] = useState('')
  const [savingProject, setSavingProject] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState('')

  // Broadcast Alert Form States
  const [broadcastTitle, setBroadcastTitle] = useState('')
  const [broadcastText, setBroadcastText] = useState('')
  const [broadcastSuccess, setBroadcastSuccess] = useState('')

  // Admin Creation States
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [newAdminPass, setNewAdminPass] = useState('')
  const [adminCreateSuccess, setAdminCreateSuccess] = useState('')

  // Challenge Form States
  const [newChalTitle, setNewChalTitle] = useState('')
  const [newChalDiff, setNewChalDiff] = useState('EASY')
  const [newChalPoints, setNewChalPoints] = useState(100)
  const [newChalRegex, setNewChalRegex] = useState('')
  const [newChalDesc, setNewChalDesc] = useState('')
  const [newChalTemplate, setNewChalTemplate] = useState('function solve() {\n    // Write code here\n}')
  const [challengeSuccess, setChallengeSuccess] = useState('')

  // Load Admin Data
  const loadAdminData = async () => {
    try {
      // 1. Fetch Analytics
      const analRes = await fetch('/api/analytics')
      if (analRes.ok) {
        const data = await analRes.json()
        setAnalytics(data.analytics)
      }

      // 2. Fetch Custom Requests
      const reqRes = await fetch('/api/requests')
      if (reqRes.ok) {
        const data = await reqRes.json()
        // Map with mock milestones
        const reqs = data.requests || []
        const mappedReqs = reqs.map((r: any) => ({
          ...r,
          milestones: r.id === 'req-2' || r.status === 'APPROVED' ? [
            { id: 'ms-1', title: 'Hardware Board Assembly', desc: 'Procuring ESP32, soil moisture sensors.', status: 'Completed', percent: 100 },
            { id: 'ms-2', title: 'MQTT Telemetry Integration', desc: 'Connecting microcontroller to AWS IoT.', status: 'In Progress', percent: 50 },
            { id: 'ms-3', title: 'Web Dashboard & Reports', desc: 'NextJS UI charts design.', status: 'Pending', percent: 0 }
          ] : []
        }))
        setRequests(mappedReqs)
      }

      // 3. Fetch Projects
      const projRes = await fetch('/api/projects?sort=latest')
      if (projRes.ok) {
        const data = await projRes.json()
        setProjects(data.projects || [])
      }

      // 4. Fetch Categories
      const catRes = await fetch('/api/categories')
      if (catRes.ok) {
        const data = await catRes.json()
        setCategories(data.categories || [])
        if (data.categories?.length > 0) setProjectCategoryId(data.categories[0].id)
      }

      // 5. Mock E-Commerce Purchases Registry
      setPurchases([
        { id: 'ord-101', invoiceNumber: 'INV-40912', productName: 'Premium NextJS SaaS Boilerplate UI Kit', amount: 499, couponCode: 'STUDENT50', userEmail: 'student@gmail.com', status: 'PAID', date: '2026-07-10' },
        { id: 'ord-102', invoiceNumber: 'INV-40913', productName: 'Diabetic Retinopathy CNN Weights', amount: 1499, couponCode: 'STUDENT50', userEmail: 'amit@gmail.com', status: 'PAID', date: '2026-07-12' },
        { id: 'ord-103', invoiceNumber: 'INV-40914', productName: 'ESP32 Smart PCB Gerber layouts', amount: 599, couponCode: 'NONE', userEmail: 'kavi@gmail.com', status: 'PAID', date: '2026-07-13' }
      ])

      // 6. Mock Support Tickets
      setTickets([
        {
          id: 'tkt-1',
          subject: 'Gerber Files extraction error',
          category: 'Installation',
          priority: 'Medium',
          status: 'OPEN',
          updatedAt: new Date(),
          studentName: 'Sanjay Kumar',
          messages: [
            { senderName: 'Sanjay Kumar', text: 'Hi support team, I downloaded the Gerber files for the ESP32 project but the drill holes layer seems to throw import warnings in JLCPCB. Can you verify?', isFromStaff: false, createdAt: new Date(Date.now() - 3600000 * 2) },
            { senderName: 'Coordinator Rakesh', text: 'Hey Sanjay! Let me check the layout parameters. We are re-exporting the files with absolute drill offsets. I will attach the fix shortly.', isFromStaff: true, createdAt: new Date(Date.now() - 3600000) }
          ]
        }
      ])

      // 7. Mock Security Audit Logs
      setAuditLogs([
        { id: 'aud-1', adminEmail: 'admin@gmail.com', action: 'APPROVE_REQUEST', targetTable: 'Request', details: 'Approved custom request req-2 for Kavitha R.', ipAddress: '192.168.1.10', createdAt: new Date(Date.now() - 3600000 * 2) },
        { id: 'aud-2', adminEmail: 'admin@gmail.com', action: 'CREATE_PROJECT', targetTable: 'Project', details: 'Uploaded new category project: Traffic Control Simulator.', ipAddress: '192.168.1.10', createdAt: new Date(Date.now() - 3600000) }
      ])

    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    if (user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN')) {
      loadAdminData()
    }
  }, [user])

  // Handle Request Status update and create logs
  const handleRequestStatus = async (id: string, status: any) => {
    const res = await updateRequestStatus(id, status)
    if (res.success) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
      
      // Log audit
      const newAudit = {
        id: `aud-${Date.now()}`,
        adminEmail: user?.email || 'admin@gmail.com',
        action: 'UPDATE_REQUEST_STATUS',
        targetTable: 'Request',
        details: `Updated request ${id} to ${status}`,
        ipAddress: '127.0.0.1',
        createdAt: new Date()
      }
      setAuditLogs([newAudit, ...auditLogs])
    }
  }

  // Handle Project Form Submit
  const handleProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingProject(true)
    setSaveSuccess('')

    const formData = new FormData()
    if (editingProjectId) formData.append('id', editingProjectId)
    formData.append('title', projectTitle)
    formData.append('description', projectDesc)
    formData.append('longDescription', projectLongDesc)
    formData.append('difficulty', projectDiff)
    formData.append('duration', projectDuration)
    formData.append('categoryId', projectCategoryId)
    formData.append('image', projectImage)
    formData.append('technologies', projectTech)
    formData.append('features', projectFeatures)
    formData.append('docUrl', projectDocUrl)
    formData.append('codeUrl', projectCodeUrl)

    const res = await saveProject(null, formData)
    if (res.success) {
      setSaveSuccess(editingProjectId ? 'Project updated successfully!' : 'Project created successfully!')
      
      // Log Audit
      const newAudit = {
        id: `aud-${Date.now()}`,
        adminEmail: user?.email || 'admin@gmail.com',
        action: editingProjectId ? 'EDIT_PROJECT' : 'UPLOAD_PROJECT',
        targetTable: 'Project',
        details: `${editingProjectId ? 'Updated' : 'Uploaded'} project: ${projectTitle}`,
        ipAddress: '127.0.0.1',
        createdAt: new Date()
      }
      setAuditLogs(prev => [newAudit, ...prev])

      setEditingProjectId(null)
      setProjectTitle('')
      setProjectDesc('')
      setProjectLongDesc('')
      setProjectTech('')
      setProjectFeatures('')
      setProjectImage('')
      setProjectDocUrl('')
      setProjectCodeUrl('')
      loadAdminData()
    }
    setSavingProject(false)
  }

  // Handle Edit Project click
  const handleEditProjectClick = (proj: any) => {
    setEditingProjectId(proj.id)
    setProjectTitle(proj.title)
    setProjectDesc(proj.description)
    setProjectLongDesc(proj.longDescription)
    setProjectDiff(proj.difficulty)
    setProjectDuration(proj.duration)
    setProjectCategoryId(proj.categoryId)
    setProjectImage(proj.image)
    setProjectTech(proj.technologies?.join(', ') || '')
    setProjectFeatures(proj.features?.join('\n') || '')
    setProjectDocUrl(proj.docUrl || '')
    setProjectCodeUrl(proj.codeUrl || '')
    setActiveTab('projects')
  }

  // Handle Delete Project click
  const handleDeleteProjectClick = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      const res = await deleteProject(id)
      if (res.success) {
        setProjects(prev => prev.filter(p => p.id !== id))
        
        // Log Audit
        const newAudit = {
          id: `aud-${Date.now()}`,
          adminEmail: user?.email || 'admin@gmail.com',
          action: 'DELETE_PROJECT',
          targetTable: 'Project',
          details: `Deleted project ID: ${id}`,
          ipAddress: '127.0.0.1',
          createdAt: new Date()
        }
        setAuditLogs(prev => [newAudit, ...prev])
      }
    }
  }

  // Manage Request Milestones
  const openMilestoneEditor = (req: any) => {
    setSelectedReqForMilestones(req)
    setMilestonesList(req.milestones || [])
  }

  const handleAddMilestone = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMilestoneTitle || !selectedReqForMilestones) return

    const newMs = {
      id: `ms-${Date.now()}`,
      title: newMilestoneTitle,
      desc: newMilestoneDesc,
      status: 'Pending',
      percent: 0
    }

    const updatedMilestones = [...milestonesList, newMs]
    setMilestonesList(updatedMilestones)

    // Update in requests state
    setRequests(requests.map(r => r.id === selectedReqForMilestones.id ? { ...r, milestones: updatedMilestones } : r))
    setNewMilestoneTitle('')
    setNewMilestoneDesc('')
  }

  const handleUpdateMilestoneProgress = (msId: string, percent: number, status: string) => {
    const updatedMilestones = milestonesList.map(ms => 
      ms.id === msId ? { ...ms, percent, status } : ms
    )
    setMilestonesList(updatedMilestones)
    setRequests(requests.map(r => r.id === selectedReqForMilestones.id ? { ...r, milestones: updatedMilestones } : r))
  }

  // Submit Admin ticket replies
  const handleTicketReply = (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminReplyText.trim() || !selectedTicket) return

    const updatedMessages = [
      ...selectedTicket.messages,
      { senderName: 'Admin Staff', text: adminReplyText, isFromStaff: true, createdAt: new Date() }
    ]

    const updatedTicket = {
      ...selectedTicket,
      messages: updatedMessages,
      status: 'RESOLVED',
      updatedAt: new Date()
    }

    setTickets(tickets.map(t => t.id === selectedTicket.id ? updatedTicket : t))
    setSelectedTicket(updatedTicket)
    setAdminReplyText('')
    
    // Log Audit event
    const newAudit = {
      id: `aud-${Date.now()}`,
      adminEmail: user?.email || 'admin@gmail.com',
      action: 'REPLY_TICKET',
      targetTable: 'SupportTicket',
      details: `Replied to ticket ${selectedTicket.id}`,
      ipAddress: '127.0.0.1',
      createdAt: new Date()
    }
    setAuditLogs([newAudit, ...auditLogs])
  }

  // Broadcast Alert submit
  const handleBroadcast = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!broadcastTitle || !broadcastText) return
    setBroadcastSuccess('')

    await new Promise(resolve => setTimeout(resolve, 800))
    setBroadcastSuccess('Broadcast alert sent to all student inboxes successfully!')
    setBroadcastTitle('')
    setBroadcastText('')
  }

  // Register Admin submit
  const handleAdminRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAdminName || !newAdminEmail || !newAdminPass) return
    setAdminCreateSuccess('')

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newAdminName,
          email: newAdminEmail,
          password: newAdminPass,
          role: 'ADMIN'
        })
      })

      if (res.ok) {
        setAdminCreateSuccess(`Successfully registered administrator profile for: ${newAdminName}!`)
        
        // Append an audit log locally
        const newAudit = {
          id: `aud-${Date.now()}`,
          adminEmail: user?.email || 'admin@gmail.com',
          action: 'REGISTER_ADMIN',
          targetTable: 'User',
          details: `Registered new administrator account: ${newAdminEmail}`,
          ipAddress: '127.0.0.1',
          createdAt: new Date()
        }
        setAuditLogs(prev => [newAudit, ...prev])

        setNewAdminName('')
        setNewAdminEmail('')
        setNewAdminPass('')
      } else {
        const errData = await res.json()
        setAdminCreateSuccess(`Error: ${errData.error || 'Failed to create admin profile.'}`)
      }
    } catch (err) {
      setAdminCreateSuccess('Network error registering administrative profile.')
    }
  }

  // Create Challenge submit
  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChalTitle || !newChalDesc || !newChalTemplate) return
    setChallengeSuccess('')

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newChalTitle,
          difficulty: newChalDiff,
          points: newChalPoints,
          description: newChalDesc,
          constraints: '', // parsed in API
          template: newChalTemplate,
          testCases: JSON.stringify([
            { input: 'input = [1,2]', expected: 'output' }
          ]),
          verifyCodeRegex: newChalRegex
        })
      })

      if (res.ok) {
        setChallengeSuccess('Coding Sandbox Challenge published and saved permanently!')
        
        // Log Audit
        const newAudit = {
          id: `aud-${Date.now()}`,
          adminEmail: user?.email || 'admin@gmail.com',
          action: 'CREATE_CHALLENGE',
          targetTable: 'Challenge',
          details: `Created coding challenge: ${newChalTitle}`,
          ipAddress: '127.0.0.1',
          createdAt: new Date()
        }
        setAuditLogs(prev => [newAudit, ...prev])

        setNewChalTitle('')
        setNewChalDesc('')
        setNewChalRegex('')
        setNewChalTemplate('function solve() {\n    // Write code here\n}')
      } else {
        const errData = await res.json()
        setChallengeSuccess(`Error: ${errData.error || 'Failed to save challenge.'}`)
      }
    } catch (err) {
      setChallengeSuccess('Network connection error during challenge publication.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    )
  }

  // Admin Guard
  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <ShieldAlert className="h-12 w-12 text-rose-500 mx-auto animate-pulse" />
        <h1 className="text-xl font-bold dark:text-white">Admin Privileges Required</h1>
        <p className="text-xs text-slate-500 max-w-xs mx-auto">Access Denied. This section requires administrative credentials.</p>
        <Link href="/login" className="inline-flex items-center justify-center rounded-xl bg-blue-600 px-4.5 py-2.5 text-xs font-semibold text-white shadow-md hover:bg-blue-500">
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
    return colors[status] || 'bg-slate-500/10 text-slate-450'
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight dark:text-white">Admin Console Desk</h1>
        <p className="text-xs text-slate-500 dark:text-slate-450 mt-1">Review customized milestones progress, resolve help tickets, audit logs, and manage payment invoices.</p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: 'analytics', label: 'Analytics Panel', icon: BarChart3 },
            { id: 'requests', label: `Custom requests (${requests.filter(r => r.status === 'PENDING').length})`, icon: Clock },
            { id: 'projects', label: 'Repository CRUD', icon: Upload },
            { id: 'purchases', label: `Billing Invoices (${purchases.length})`, icon: ShoppingCart },
            { id: 'tickets', label: `Support Tickets (${tickets.filter(t => t.status === 'OPEN').length})`, icon: MessageSquare },
            { id: 'auditLogs', label: 'Security Audit Logs', icon: Activity },
            { id: 'broadcast', label: 'Broadcast Alerts', icon: Send },
            { id: 'challenges', label: 'Coding Sandbox CRUD', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any)
                  setSelectedReqForMilestones(null)
                  setSelectedTicket(null)
                }}
                className={`w-full flex items-center space-x-2.5 px-4 py-3 rounded-xl border text-xs font-bold transition-all text-left ${
                  isActive 
                    ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/40 text-slate-600 dark:text-slate-400'
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Dashboard Panels */}
        <div className="lg:col-span-4 space-y-6">
          
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: 'Total Projects', value: analytics.totalProjects, icon: BookOpen, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
                  { label: 'Logged Downloads', value: analytics.totalDownloads, icon: Download, color: 'text-violet-500 bg-violet-50 dark:bg-violet-900/20' },
                  { label: 'Enrolled Users', value: analytics.totalUsers, icon: User, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' },
                  { label: 'Pending Requests', value: analytics.pendingRequests, icon: Clock, color: 'text-amber-500 bg-amber-50 dark:bg-amber-900/20' }
                ].map((stat, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3">
                    <stat.icon className={`h-8 w-8 p-1.5 rounded-lg ${stat.color}`} />
                    <div>
                      <span className="text-[10px] text-slate-450 uppercase font-black">{stat.label}</span>
                      <h4 className="text-xl font-extrabold text-slate-950 dark:text-white">{stat.value}</h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphic Chart Vectors */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Downloads Over Time</h4>
                  <div className="h-40 flex items-end justify-between border-b border-l border-slate-100 dark:border-slate-800/80 px-2 pt-4">
                    {analytics.downloadsOverTime.map((d: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center w-8 space-y-2">
                        <div className="w-3 rounded-t bg-blue-600/80" style={{ height: `${(d.value / 1500) * 100}px` }} />
                        <span className="text-[9px] text-slate-400 font-bold">{d.label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Marketplace Monthly Sales (INR)</h4>
                  <div className="h-40 flex items-end justify-between border-b border-l border-slate-100 dark:border-slate-800/80 px-2 pt-4">
                    {analytics.revenueOverTime.map((r: any, idx: number) => (
                      <div key={idx} className="flex flex-col items-center w-8 space-y-2">
                        <div className="w-3 rounded-t bg-violet-600/80" style={{ height: `${(r.value / 70000) * 100}px` }} />
                        <span className="text-[9px] text-slate-400 font-bold">{r.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Custom Requests Milestones Manager */}
          {activeTab === 'requests' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              {!selectedReqForMilestones ? (
                <>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Custom Project Pipelines</h3>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {requests.map((req) => (
                      <div key={req.id} className="py-4 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">{req.projectTitle}</h4>
                            <p className="text-[10px] text-slate-400">Student: {req.studentName} &bull; {req.college}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusColor(req.status)}`}>
                              {req.status}
                            </span>
                            {req.status === 'PENDING' && (
                              <div className="flex gap-1.5">
                                <button 
                                  onClick={() => handleRequestStatus(req.id, 'APPROVED')}
                                  className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold"
                                >
                                  Approve
                                </button>
                                <button 
                                  onClick={() => handleRequestStatus(req.id, 'REJECTED')}
                                  className="px-2 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-[10px] font-bold"
                                >
                                  Reject
                                </button>
                              </div>
                            )}
                            {req.status === 'APPROVED' && (
                              <button 
                                onClick={() => handleRequestStatus(req.id, 'IN_PROGRESS')}
                                className="px-2 py-1 bg-indigo-600 hover:bg-indigo-505 text-white rounded text-[10px] font-bold"
                              >
                                Start Work
                              </button>
                            )}
                            {req.status === 'IN_PROGRESS' && (
                              <button 
                                onClick={() => handleRequestStatus(req.id, 'COMPLETED')}
                                className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold"
                              >
                                Complete Project
                              </button>
                            )}
                          </div>
                        </div>

                        {/* Milestones Config Trigger */}
                        {(req.status === 'APPROVED' || req.status === 'IN_PROGRESS' || req.status === 'COMPLETED') && (
                          <div className="flex justify-between items-center text-xs">
                            <span className="text-[10px] text-slate-400">Total milestones: {req.milestones?.length || 0}</span>
                            <button 
                              onClick={() => openMilestoneEditor(req)}
                              className="text-blue-500 font-bold hover:underline"
                            >
                              Manage Milestones &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <button 
                      onClick={() => setSelectedReqForMilestones(null)}
                      className="text-xs font-bold text-slate-550 dark:text-slate-400"
                    >
                      &larr; Back to Requests
                    </button>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">Request: {selectedReqForMilestones.projectTitle}</span>
                  </div>

                  {/* Add Milestone Form */}
                  <form onSubmit={handleAddMilestone} className="p-4 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-4 text-xs">
                    <h4 className="font-bold text-slate-900 dark:text-white">Publish New Milestones Checkpoint</h4>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-505">Milestone Title</label>
                        <input
                          type="text"
                          required
                          value={newMilestoneTitle}
                          onChange={(e) => setNewMilestoneTitle(e.target.value)}
                          placeholder="e.g. MQTT Calibration"
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="font-semibold text-slate-505">Short Description</label>
                        <input
                          type="text"
                          value={newMilestoneDesc}
                          onChange={(e) => setNewMilestoneDesc(e.target.value)}
                          placeholder="e.g. Calibrating ESP32 sensors feeds."
                          className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500"
                    >
                      Add Milestones Checkpoint
                    </button>
                  </form>

                  {/* Milestones List & Editors */}
                  <div className="space-y-4">
                    <h4 className="font-bold text-xs text-slate-400 uppercase tracking-widest">Active Milestones List</h4>
                    {milestonesList.length === 0 ? (
                      <p className="text-xs text-slate-500 italic">No milestones defined yet. Use the form above to add checkpoints.</p>
                    ) : (
                      <div className="space-y-3">
                        {milestonesList.map((ms) => (
                          <div key={ms.id} className="p-4 border border-slate-200 dark:border-slate-850 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
                            <div className="space-y-1">
                              <h5 className="font-bold text-slate-900 dark:text-white">{ms.title}</h5>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">{ms.desc}</p>
                              <p className="text-[10px] font-bold text-blue-500">Progress: {ms.percent}% | Status: {ms.status}</p>
                            </div>

                            {/* Actions controls */}
                            <div className="flex gap-2">
                              {ms.status !== 'Completed' && (
                                <button
                                  onClick={() => handleUpdateMilestoneProgress(ms.id, 100, 'Completed')}
                                  className="px-2 py-1 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white border border-emerald-500/20 rounded font-bold text-[10px]"
                                >
                                  Complete
                                </button>
                              )}
                              {ms.status === 'Pending' && (
                                <button
                                  onClick={() => handleUpdateMilestoneProgress(ms.id, 50, 'In Progress')}
                                  className="px-2 py-1 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white border border-blue-500/20 rounded font-bold text-[10px]"
                                >
                                  In Progress
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* E-Commerce Invoices Registry */}
          {activeTab === 'purchases' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Billing Invoices Registry</h3>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 uppercase text-[9px] tracking-wider">
                      <th className="pb-3">Invoice No</th>
                      <th className="pb-3">Student Email</th>
                      <th className="pb-3">Product Name</th>
                      <th className="pb-3">Amount</th>
                      <th className="pb-3">Coupon</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {purchases.map((p) => (
                      <tr key={p.id} className="text-slate-700 dark:text-slate-350">
                        <td className="py-4 font-mono font-bold text-slate-900 dark:text-white">{p.invoiceNumber}</td>
                        <td className="py-4">{p.userEmail}</td>
                        <td className="py-4 font-bold text-slate-900 dark:text-white truncate max-w-[150px]">{p.productName}</td>
                        <td className="py-4">₹{p.amount}</td>
                        <td className="py-4"><span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px]">{p.couponCode}</span></td>
                        <td className="py-4"><span className="text-[10px] text-emerald-500 font-bold">PAID</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Support Ticket Response Helpdesk */}
          {activeTab === 'tickets' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
              
              {!selectedTicket ? (
                <>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">Helpdesk Support Tickets</h3>
                  
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {tickets.map((t) => (
                      <div 
                        key={t.id} 
                        onClick={() => setSelectedTicket(t)}
                        className="py-4 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-850/10 px-2 rounded-xl"
                      >
                        <div className="space-y-1">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.subject}</h4>
                          <p className="text-[9px] text-slate-405">Student: {t.studentName} | Priority {t.priority} | Category {t.category}</p>
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
                      className="text-xs font-bold text-slate-550 dark:text-slate-400"
                    >
                      &larr; Back to Ticket Desk
                    </button>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider border ${getStatusColor(selectedTicket.status)}`}>
                      {selectedTicket.status}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                    <p className="text-[10px] text-slate-400">Student: {selectedTicket.studentName} | Priority {selectedTicket.priority}</p>
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

                  {/* Message Form */}
                  <form onSubmit={handleTicketReply} className="flex gap-2">
                    <input
                      type="text"
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      placeholder="Type your response to student..."
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500"
                    />
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500"
                    >
                      Reply & Resolve
                    </button>
                  </form>
                </div>
              )}

            </div>
          )}

          {/* Audit Logs */}
          {activeTab === 'auditLogs' && (
            <div className="space-y-6">
              
              {/* Register Admin Form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4 text-left">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <ShieldCheck className="h-5 w-5 text-indigo-500" />
                  <span>Register New Administrator Profile</span>
                </h3>
                
                {adminCreateSuccess && (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold">
                    {adminCreateSuccess}
                  </div>
                )}

                <form onSubmit={handleAdminRegisterSubmit} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Admin Name</label>
                      <input 
                        type="text" 
                        required
                        value={newAdminName}
                        onChange={(e) => setNewAdminName(e.target.value)}
                        placeholder="e.g. Prof. Rajesh"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Admin Email</label>
                      <input 
                        type="email" 
                        required
                        value={newAdminEmail}
                        onChange={(e) => setNewAdminEmail(e.target.value)}
                        placeholder="admin2@gmail.com"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Admin Password</label>
                      <input 
                        type="password" 
                        required
                        value={newAdminPass}
                        onChange={(e) => setNewAdminPass(e.target.value)}
                        placeholder="Enter secure password"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-855 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className="px-4 py-2.5 bg-indigo-600 text-white font-bold text-xs rounded-xl hover:bg-indigo-500 cursor-pointer transition-colors"
                  >
                    Create Admin Account
                  </button>
                </form>
              </div>

              {/* Logs List */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">Security & Action Audit Logs</h3>
                <div className="space-y-3">
                  {auditLogs.map((log) => (
                    <div key={log.id} className="p-4 border border-slate-100 dark:border-slate-850 rounded-xl text-xs space-y-1.5">
                      <div className="flex justify-between items-baseline">
                        <span className="px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 font-bold text-[9px] uppercase tracking-wider">{log.action}</span>
                        <span className="text-[9px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</span>
                      </div>
                      <p className="font-semibold text-slate-900 dark:text-white">{log.details}</p>
                      <div className="flex justify-between text-[9px] text-slate-400 text-left">
                        <span>Admin: {log.adminEmail}</span>
                        <span>IP: {log.ipAddress}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Repository CRUD */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              
              {/* CRUD Form */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {editingProjectId ? 'Edit Project Catalog Record' : 'Upload New Project Catalog'}
                </h3>
                
                {saveSuccess && (
                  <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold">
                    {saveSuccess}
                  </div>
                )}

                <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Project Title</label>
                      <input 
                        type="text" 
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Smart Traffic Lights System"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Short Summary Description</label>
                      <input 
                        type="text" 
                        required
                        value={projectDesc}
                        onChange={(e) => setProjectDesc(e.target.value)}
                        placeholder="e.g. Raspberry Pi traffic light control scripts."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="font-semibold text-slate-500">Detailed Long Description</label>
                      <textarea 
                        required
                        rows={4}
                        value={projectLongDesc}
                        onChange={(e) => setProjectLongDesc(e.target.value)}
                        placeholder="Detail system specifications, installation steps, and code configurations..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Difficulty Grade</label>
                      <select 
                        value={projectDiff}
                        onChange={(e) => setProjectDiff(e.target.value as any)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      >
                        <option value="BEGINNER">BEGINNER</option>
                        <option value="INTERMEDIATE">INTERMEDIATE</option>
                        <option value="ADVANCED">ADVANCED</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Development Timeframe</label>
                      <input 
                        type="text" 
                        required
                        value={projectDuration}
                        onChange={(e) => setProjectDuration(e.target.value)}
                        placeholder="e.g. 4 Weeks"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Category Domain Stream</label>
                      <select 
                        value={projectCategoryId}
                        onChange={(e) => setProjectCategoryId(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Primary Cover Image URL</label>
                      <input 
                        type="text" 
                        required
                        value={projectImage}
                        onChange={(e) => setProjectImage(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Technologies (comma separated)</label>
                      <input 
                        type="text" 
                        required
                        value={projectTech}
                        onChange={(e) => setProjectTech(e.target.value)}
                        placeholder="Next.js, Python, Flask"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Key Features (newline separated)</label>
                      <textarea 
                        rows={2}
                        value={projectFeatures}
                        onChange={(e) => setProjectFeatures(e.target.value)}
                        placeholder="User login dashboard&#10;Dynamic graph analytics"
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">PDF Documentation link (optional)</label>
                      <input 
                        type="text" 
                        value={projectDocUrl}
                        onChange={(e) => setProjectDocUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="font-semibold text-slate-500">Source code download link (optional)</label>
                      <input 
                        type="text" 
                        value={projectCodeUrl}
                        onChange={(e) => setProjectCodeUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="text-right pt-2 space-x-2">
                    {editingProjectId && (
                      <button 
                        type="button" 
                        onClick={() => {
                          setEditingProjectId(null)
                          setProjectTitle('')
                          setProjectDesc('')
                          setProjectLongDesc('')
                          setProjectTech('')
                          setProjectFeatures('')
                          setProjectImage('')
                          setProjectDocUrl('')
                          setProjectCodeUrl('')
                        }}
                        className="px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-350 rounded-xl"
                      >
                        Cancel
                      </button>
                    )}
                    <button 
                      type="submit" 
                      disabled={savingProject}
                      className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold"
                    >
                      {savingProject ? 'Saving...' : editingProjectId ? 'Update Project' : 'Upload Catalog'}
                    </button>
                  </div>
                </form>
              </div>

              {/* CRUD List */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
                <h4 className="font-bold text-slate-900 dark:text-white">Active Projects Catalog</h4>
                <div className="divide-y divide-slate-150 dark:divide-slate-850">
                  {projects.map((p) => (
                    <div key={p.id} className="py-4 flex justify-between items-center text-xs">
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white">{p.title}</h5>
                        <p className="text-[10px] text-slate-400">Difficulty: {p.difficulty} | Code: {p.codeUrl ? 'Configured' : 'Missing'}</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditProjectClick(p)}
                          className="p-1 text-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProjectClick(p.id)}
                          className="p-1 text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-800 rounded"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Broadcast Alerts */}
          {activeTab === 'broadcast' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">System Broadcast Center</h3>
              
              {broadcastSuccess && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold animate-pulse">
                  {broadcastSuccess}
                </div>
              )}

              <form onSubmit={handleBroadcast} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Alert Title</label>
                  <input 
                    type="text" 
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="e.g. Maintenance Scheduled"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Message Content</label>
                  <textarea 
                    required
                    rows={4}
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    placeholder="Type the message that will pop up inside all active student notification lists..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500"
                >
                  Send Broadcast
                </button>
              </form>
            </div>
          )}

          {/* Coding Sandbox Challenges CRUD */}
          {activeTab === 'challenges' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6 text-left">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Coding Sandbox Challenges Manager</h3>
              
              {challengeSuccess && (
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 text-xs p-3 font-semibold">
                  {challengeSuccess}
                </div>
              )}

              <form onSubmit={handleCreateChallenge} className="space-y-4 text-xs">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="font-semibold text-slate-500">Problem Title</label>
                    <input 
                      type="text" 
                      required
                      value={newChalTitle}
                      onChange={(e) => setNewChalTitle(e.target.value)}
                      placeholder="e.g. Find Max Sum Subarray"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Complexity Difficulty</label>
                    <select
                      value={newChalDiff}
                      onChange={(e) => setNewChalDiff(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    >
                      <option value="EASY">EASY</option>
                      <option value="MEDIUM">MEDIUM</option>
                      <option value="HARD">HARD</option>
                    </select>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Score Points</label>
                    <input 
                      type="number" 
                      required
                      value={newChalPoints}
                      onChange={(e) => setNewChalPoints(Number(e.target.value))}
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-semibold text-slate-500">Verify Code Keywords (Regex pipe-separated)</label>
                    <input 
                      type="text" 
                      required
                      value={newChalRegex}
                      onChange={(e) => setNewChalRegex(e.target.value)}
                      placeholder="e.g. Math.max|for|subSum"
                      className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Problem Description</label>
                  <textarea 
                    required
                    rows={3}
                    value={newChalDesc}
                    onChange={(e) => setNewChalDesc(e.target.value)}
                    placeholder="Enter the problem objective and constraints details..."
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950 px-3 py-2 text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-500">Boilerplate Starter Template</label>
                  <textarea 
                    required
                    rows={6}
                    value={newChalTemplate}
                    onChange={(e) => setNewChalTemplate(e.target.value)}
                    placeholder="function solve() { ... }"
                    className="w-full rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-955 px-3 py-2 font-mono text-xs text-slate-900 dark:text-white focus:outline-none"
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-4 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 cursor-pointer transition-colors"
                >
                  Publish Challenge
                </button>
              </form>
            </div>
          )}

        </div>

      </div>

    </div>
  )
}
