'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowRight, Download, Laptop, Cpu, Shield, Sparkles, 
  HelpCircle, Star, GraduationCap, Users, BookOpen, Check
} from 'lucide-react'
import ProjectCard from '@/components/shared/ProjectCard'
import { mockProjects, mockTestimonials } from '@/lib/mockData'

export default function HomePage() {
  const [featuredProjects, setFeaturedProjects] = useState<any[]>([])
  const [activeFaq, setActiveFaq] = useState<number | null>(null)

  useEffect(() => {
    // Load top 3 projects for homepage
    setFeaturedProjects(mockProjects.slice(0, 3))
  }, [])

  const stats = [
    { label: 'Students Assisted', value: '10,000+', icon: Users },
    { label: 'Free Project Codes', value: '2,000+', icon: BookOpen },
    { label: 'Colleges Represented', value: '500+', icon: GraduationCap },
    { label: 'Student Satisfaction', value: '98%', icon: Star },
  ]

  const pricingPlans = [
    {
      name: 'Free Catalog',
      price: '₹0',
      description: 'Access our growing list of community and academic source codes.',
      features: [
        'Download any open-source code',
        'Basic setup readme documents',
        'Watch project demo videos',
        'Standard community support chat',
        'Categorized searching tools'
      ],
      cta: 'Browse Free Code',
      href: '/projects',
      popular: false,
    },
    {
      name: 'Custom Mini Project',
      price: '₹1,499',
      description: 'Tailor-made project with custom features built by our engineering team.',
      features: [
        'Custom code modifications',
        'Fully working source database',
        'Project report & synopsis PDF',
        '10-minute explanation video',
        '3 days testing warranty'
      ],
      cta: 'Request Project',
      href: '/request',
      popular: true,
    },
    {
      name: 'Final Year Premium',
      price: '₹3,999',
      description: 'The complete package for your final year submission and presentations.',
      features: [
        'End-to-end custom development',
        '100-page IEEE standard report',
        'Submission PPT slides deck',
        'Viva voce prep Q&A checklist',
        '1-on-1 remote installation support',
        '7 days bug-fix guarantee'
      ],
      cta: 'Request Project',
      href: '/request',
      popular: false,
    }
  ]

  const faqs = [
    {
      q: 'Are the source codes really free to download?',
      a: 'Yes! All projects in our default catalog are open-source and free to download. Simply create a student account to get access keys and zip downloads instantly.'
    },
    {
      q: 'How long does a custom project request take?',
      a: 'Mini projects typically take 3 to 5 days, while complex final-year engineering projects (such as Machine Learning systems or IoT setups) take 7 to 14 days. You can specify your target deadline in the request form.'
    },
    {
      q: 'Do you provide the project report and PPT along with the code?',
      a: 'Yes, our "Final Year Premium" plan includes a fully-formatted, submission-ready project report (IEEE standard format), a project synopsis, and presentation PPT slides, along with a custom Viva Voce preparation guide.'
    },
    {
      q: 'Can I get help with setting up the project on my laptop?',
      a: 'Absolutely. We provide a step-by-step README and setup instructions for all projects. For custom requests, we offer remote configuration support via AnyDesk or Zoom to ensure the project runs flawlessly.'
    }
  ]

  return (
    <div className="relative overflow-hidden bg-grid-pattern bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 min-h-screen">
      
      {/* Background Blobs */}
      <div className="absolute top-0 left-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-blue-500/10 dark:bg-blue-500/5 blur-[120px]" />
      <div className="absolute top-80 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-violet-500/10 dark:bg-violet-500/5 blur-[150px]" />

      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center space-x-2 rounded-full border border-blue-200/50 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-900/10 px-4 py-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-violet-500" />
            <span>100% Free Projects & Customized Submissions</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-5xl md:text-6xl max-w-4xl mx-auto leading-[1.1]"
          >
            Build Your Academic <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 dark:from-blue-400 dark:via-violet-400 dark:to-pink-400">Project Faster</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-base sm:text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            Find free open-source codes, request customized mini and final year projects, and boost your viva scores with interactive learning tools.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <Link
              href="/projects"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-700 text-sm font-semibold text-white px-6 py-3.5 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300 group"
            >
              <span>Browse Projects</span>
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/request"
              className="inline-flex w-full sm:w-auto items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md text-sm font-semibold text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-850 px-6 py-3.5 shadow-sm hover:shadow-md transition-all duration-300"
            >
              Request Custom Project
            </Link>
          </motion.div>

          {/* Hero Float Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative mx-auto max-w-4xl rounded-2xl border border-slate-200/55 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-950/40 p-2 shadow-2xl backdrop-blur-sm"
          >
            <div className="absolute -top-6 -left-6 hidden md:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-lg backdrop-blur-md max-w-xs text-left">
              <span className="text-[10px] font-bold text-blue-500 uppercase">Interactive Roadmaps</span>
              <p className="text-xs font-semibold mt-1">Full-Stack web development roadmaps ready to explore.</p>
            </div>
            
            <div className="absolute -bottom-6 -right-6 hidden md:block rounded-xl border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 p-4 shadow-lg backdrop-blur-md max-w-xs text-left">
              <span className="text-[10px] font-bold text-violet-500 uppercase">AI Synopses Generator</span>
              <p className="text-xs font-semibold mt-1">Generate complete synopsis reports in seconds.</p>
            </div>

            <div className="rounded-xl overflow-hidden bg-slate-950 shadow-inner aspect-[16/9] flex items-center justify-center p-4">
              <div className="w-full h-full flex flex-col justify-between text-left font-mono text-xs text-blue-400 select-none">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2 text-[10px] text-slate-500">
                  <span>nexora-setup.py</span>
                  <div className="flex space-x-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
                  </div>
                </div>
                <div className="flex-grow space-y-1.5 overflow-hidden leading-relaxed text-slate-300">
                  <p><span className="text-violet-500">import</span> tensorflow <span className="text-violet-500">as</span> tf</p>
                  <p><span className="text-violet-500">from</span> nexora.nlp <span className="text-violet-500">import</span> PlagiarismDetector</p>
                  <p className="text-slate-500"># Load dataset and NLP weights</p>
                  <p>detector = PlagiarismDetector(model=<span className="text-emerald-400">"BERT-base-uncased"</span>)</p>
                  <p>detector.load_weights(<span className="text-emerald-400">"./weights/retrained-nlp.h5"</span>)</p>
                  <p>print(<span className="text-emerald-400">"Analyzing document similarity..."</span>)</p>
                  <p className="text-emerald-500">&gt;&gt;&gt; Found 94.2% semantic similarity match with public paper #1042</p>
                  <p className="text-slate-500"># Generate submission PDF report</p>
                  <p>report = detector.generate_report(file=<span className="text-emerald-400">"student_thesis.pdf"</span>)</p>
                  <p>report.export_to_pdf(<span className="text-emerald-400">"./downloads/plagiarism_report.pdf"</span>)</p>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 border-y border-slate-200/50 dark:border-slate-900 bg-white/30 dark:bg-slate-900/10 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => {
              const Icon = stat.icon
              return (
                <div key={idx} className="text-center space-y-2">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-3xl font-extrabold text-slate-950 dark:text-white tracking-tight">{stat.value}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects Grid */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Free Source Codes</span>
            <h2 className="text-3xl font-extrabold dark:text-white sm:text-4xl tracking-tight">Featured Student Projects</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Explore complete, step-by-step documented project code downloads from multiple academic domains.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/projects"
              className="inline-flex items-center text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
            >
              <span>Explore all projects</span>
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Academic Pricing / Package Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-y border-slate-200/50 dark:border-slate-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Student Budgets</span>
            <h2 className="text-3xl font-extrabold dark:text-white sm:text-4xl tracking-tight">Flexible Submission Pricing</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Whether you want a free catalog script or need customized project files prepared, we support every student budget.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {pricingPlans.map((plan, idx) => (
              <div
                key={idx}
                className={`rounded-3xl border p-6 flex flex-col justify-between shadow-sm relative glow-card glass ${
                  plan.popular 
                    ? 'border-blue-500/30 dark:border-blue-400/30 ring-1 ring-blue-500/10' 
                    : 'border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30'
                }`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 rounded-full bg-blue-600 text-white text-[10px] font-extrabold tracking-wide uppercase px-3 py-1 shadow-sm">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-4 flex items-baseline">
                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                  </div>
                  <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">{plan.description}</p>
                  
                  <ul className="mt-6 space-y-3.5">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start text-xs text-slate-600 dark:text-slate-400">
                        <Check className="h-4 w-4 text-emerald-500 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Link
                    href={plan.href}
                    className={`w-full inline-flex items-center justify-center rounded-xl py-3 text-xs font-semibold transition-all ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-500/10' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-4 mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Testimonials</span>
            <h2 className="text-3xl font-extrabold dark:text-white sm:text-4xl tracking-tight">Approved by 10,000+ Students</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Hear from college, engineering, and arts students who aced their semesters using our repository.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {mockTestimonials.map((t) => (
              <div 
                key={t.id} 
                className="rounded-3xl border border-slate-200/40 dark:border-slate-800/85 bg-white/30 dark:bg-slate-900/20 backdrop-blur-md p-6 space-y-4 shadow-sm glow-card glass"
              >
                <div className="flex items-center space-x-1.5 text-amber-500">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-4.5 w-4.5 fill-current" />
                  ))}
                </div>
                <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-400">"{t.comment}"</p>
                <div className="flex items-center space-x-3 pt-2">
                  <img src={t.avatar} alt={t.studentName} className="h-10 w-10 rounded-full object-cover border border-slate-200 dark:border-slate-800" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{t.studentName}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">{t.role} &bull; {t.college}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-slate-50/50 dark:bg-slate-950/40 border-t border-slate-200/50 dark:border-slate-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Support FAQ</span>
            <h2 className="text-3xl font-extrabold dark:text-white tracking-tight">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 overflow-hidden transition-all duration-300 glass"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left font-semibold text-sm text-slate-900 dark:text-white focus:outline-none"
                  >
                    <span>{faq.q}</span>
                    <HelpCircle className={`h-4.5 w-4.5 text-blue-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 border-t border-slate-100 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

    </div>
  )
}
