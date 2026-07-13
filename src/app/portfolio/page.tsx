'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Monitor, Smartphone, Cpu, BrainCircuit, Globe,
  Star, Quote, ExternalLink, Award, FileCode, CheckCircle
} from 'lucide-react'

export default function PortfolioPage() {
  const [filter, setFilter] = useState<'ALL' | 'WEBSITES' | 'SAAS' | 'IOT' | 'AI_MOBILE'>('ALL')

  const metrics = [
    { label: 'Completed Deliverables', value: '180+' },
    { label: 'Client Satisfaction Rating', value: '4.95/5' },
    { label: 'Active Enterprise Clients', value: '42' },
    { label: 'National Tech Awards', value: '6' }
  ]

  const categories = [
    { id: 'ALL', label: 'All Projects' },
    { id: 'WEBSITES', label: 'Websites & Portals' },
    { id: 'SAAS', label: 'SaaS & ERPs' },
    { id: 'IOT', label: 'IoT & Firmware' },
    { id: 'AI_MOBILE', label: 'AI & Mobile Apps' }
  ]

  const items = [
    {
      id: 'port-1',
      title: 'MedVitals Hospital ERP System',
      category: 'SAAS',
      desc: 'An automated billing, inpatient telemetry tracker, and pharmacy stocks coordinator. Built for a multi-specialty hospital in Bangalore.',
      tech: ['React', 'NextJS', 'Prisma', 'PostgreSQL'],
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      client: 'MedVitals Hospital Chain',
      rating: 5,
      review: 'The inventory controls and live telemetry reduced scheduling conflicts by 40%. A masterpiece ERP.'
    },
    {
      id: 'port-2',
      title: 'AgroFeed Smart Drip Irrigation Controller',
      category: 'IOT',
      desc: 'An ESP32-powered micro-controller with automated soil moisture calibration and MQTT updates. Deployed across 15 acres of farmlands.',
      tech: ['C++', 'ESP32', 'AWS IoT', 'Arduino'],
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      client: 'AgroFeed Tech Farms',
      rating: 5,
      review: 'Highly stable PCB layouts. The water savings this season matched our yearly targets ahead of time.'
    },
    {
      id: 'port-3',
      title: 'LegalDraft AI Synopsis Engine',
      category: 'AI_MOBILE',
      desc: 'NLP engine converting complex court proceeding transcripts into structured 3-page summary synopses with citation tags.',
      tech: ['Python', 'FastAPI', 'Gemini API', 'Tailwind'],
      image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      client: 'Sundar & Associates Law Firm',
      rating: 5,
      review: 'Legal accuracy is top tier. Our research associates save hours drafting preliminary documents.'
    },
    {
      id: 'port-4',
      title: 'E-Shopify Multi-Vendor Craft Store',
      category: 'WEBSITES',
      desc: 'Responsive online marketplace for local handicraft vendors featuring stripe payments, dashboard shipping trackers, and SMS receipts.',
      tech: ['NextJS 15', 'Tailwind v4', 'Stripe', 'Supabase'],
      image: 'https://images.unsplash.com/photo-1472851294608-062f824d296e?auto=format&fit=crop&w=800&q=80',
      client: 'IndieCrafts Cooperative',
      rating: 5,
      review: 'Smooth onboard templates for our rural vendors. The transaction checkout is fast and reliable.'
    },
    {
      id: 'port-5',
      title: 'EduTrack School Management App',
      category: 'SAAS',
      desc: 'ERP portal tracking student attendance, digital exam scorecards, fee invoices, and direct teacher-parent communication nodes.',
      tech: ['React Native', 'Node.js', 'Express', 'MongoDB'],
      image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=800&q=80',
      client: 'Vikas Public School Group',
      rating: 4,
      review: 'Parents love the push notifications for fee deadlines and grade reporting.'
    }
  ]

  const filteredItems = filter === 'ALL' ? items : items.filter(x => x.category === filter)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-24">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Award className="h-3 w-3" /> Our Engineering Portfolio
        </span>
        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl dark:text-white">
          Enterprise Systems Built by Our Team
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          From multi-tenant SaaS ERP dashboards to telemetry micro-controller PCB design, explore the custom software we have shipped for corporations, hospitals, and startup founders.
        </p>
      </div>

      {/* Grid Statistics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 bg-slate-50 dark:bg-slate-900/40 rounded-3xl p-8 border border-slate-200/50 dark:border-slate-800">
        {metrics.map((m, idx) => (
          <div key={idx} className="text-center space-y-2">
            <span className="text-3xl lg:text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              {m.value}
            </span>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">
              {m.label}
            </p>
          </div>
        ))}
      </div>

      {/* Categories Filter Tabs */}
      <div className="space-y-12">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-full border transition-all duration-300 ${
                filter === cat.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={item.id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="relative h-48 bg-slate-100 dark:bg-slate-950 overflow-hidden">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-4 left-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/70 backdrop-blur-sm text-white">
                    {item.category === 'SAAS' ? 'SaaS / ERP' : item.category === 'IOT' ? 'IoT Board' : item.category === 'WEBSITES' ? 'Web App' : 'AI / Mobile'}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{item.title}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {item.tech.map((t, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Client Review Embedded */}
                  <div className="bg-slate-50 dark:bg-slate-950/50 p-4 rounded-2xl border border-slate-100 dark:border-slate-850 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client Feedback</span>
                      <div className="flex text-amber-500">
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-[11px] italic text-slate-500 dark:text-slate-450 leading-relaxed">
                      "{item.review}"
                    </p>
                    <p className="text-[10px] font-bold text-slate-600 dark:text-slate-350 text-right">
                      - {item.client}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Call to Action (Hire Us) */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 lg:p-12 text-center text-white space-y-6 shadow-md relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <div className="relative space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-extrabold">Need Custom Software for Your Enterprise?</h2>
          <p className="text-sm text-blue-100 leading-relaxed">
            Our software development unit helps organizations, schools, and hospitals build billing gateways, attendance controllers, and dashboard telemetry solutions with dedicated support.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <a 
              href="/contact"
              className="px-6 py-2.5 rounded-xl bg-white text-blue-600 font-bold text-xs hover:bg-slate-55 transition-all shadow-sm"
            >
              Get Free Quote
            </a>
            <a 
              href="/request"
              className="px-6 py-2.5 rounded-xl bg-blue-500/20 text-white border border-blue-400/30 font-bold text-xs hover:bg-blue-500/30 transition-all"
            >
              Request Student Project
            </a>
          </div>
        </div>
      </div>

    </div>
  )
}
