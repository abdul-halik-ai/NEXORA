'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { 
  ShoppingBag, Star, Download, Tag as TagIcon, Sparkles, BookOpen, 
  FileSpreadsheet, ShieldAlert, Cpu, ArrowRight
} from 'lucide-react'

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedType, setSelectedType] = useState<string>('ALL')

  useEffect(() => {
    async function fetchProducts() {
        // Custom marketplace products (mock/db combined)
        // If DATABASE_URL is active it pulls from category, otherwise falls back to services mock
        
        // We will seed custom items locally if API is basic
        // We will seed custom items locally if API is basic
        setProducts([
          {
            id: 'prod-1',
            name: 'Premium NextJS SaaS Boilerplate UI Kit',
            slug: 'premium-nextjs-saas-boilerplate',
            description: 'Vercel-like dashboard ui template built using Tailwind CSS v4, Framer Motion, and React Hook Forms. Ready for production.',
            price: 999.0,
            discountPrice: 499.0,
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            downloads: 142,
            rating: 4.8,
            version: '1.2.0',
            license: 'Commercial License',
            type: 'UI_KITS'
          },
          {
            id: 'prod-2',
            name: 'Diabetic Retinopathy CNN Model Weights & Report',
            slug: 'diabetic-retinopathy-cnn-model',
            description: 'Trained ResNet50 neural network weights in Keras .h5 format, along with a complete 80-page IEEE format synopsis report.',
            price: 1999.0,
            discountPrice: 1499.0,
            image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
            downloads: 89,
            rating: 4.9,
            version: '2.1.0',
            license: 'Academic Submission License',
            type: 'PROJECTS'
          },
          {
            id: 'prod-3',
            name: 'ESP32 Smart Irrigation PCB Gerber Files',
            slug: 'esp32-irrigation-pcb-gerber',
            description: 'Complete Fritzing schematics, EasyEDA PCB layouts, and Gerber files for manufacturing automated irrigation boards.',
            price: 599.0,
            discountPrice: 299.0,
            image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
            downloads: 54,
            rating: 4.6,
            version: '1.0.0',
            license: 'Hobbyist License',
            type: 'SCHEMATICS'
          },
          {
            id: 'prod-4',
            name: 'IEEE Formatting Word Document Template',
            slug: 'ieee-formatting-template',
            description: 'Pre-formatted IEEE journal and conference paper Word template, including auto-numbering headers, citation lists, and figure tags.',
            price: 199.0,
            discountPrice: 99.0,
            image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
            downloads: 310,
            rating: 4.7,
            version: '3.0.1',
            license: 'Personal Use',
            type: 'DOCUMENTATION'
          },
          {
            id: 'prod-5',
            name: 'DSA Placement Preparation E-Book',
            slug: 'dsa-placement-ebook',
            description: 'Crack coding interviews with 150+ solved challenges in Java, Python, and C++, detailing complex graph algorithms and structures.',
            price: 399.0,
            discountPrice: 199.0,
            image: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=800&q=80',
            downloads: 520,
            rating: 5.0,
            version: '4.0.0',
            license: 'Single User Ebook',
            type: 'EBOOKS'
          }
        ])
        setLoading(false)
    }
    fetchProducts()
  }, [])

  const types = [
    { id: 'ALL', label: 'All Products' },
    { id: 'PROJECTS', label: 'Premium Projects' },
    { id: 'UI_KITS', label: 'UI Kits / Code' },
    { id: 'SCHEMATICS', label: 'IoT Schematics' },
    { id: 'DOCUMENTATION', label: 'Word Templates' },
    { id: 'EBOOKS', label: 'Study Ebooks' }
  ]

  const filteredProducts = selectedType === 'ALL' ? products : products.filter(x => x.type === selectedType)

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 p-8 lg:p-12 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_-20%,rgba(59,130,246,0.2),rgba(255,255,255,0))]"></div>
        <div className="relative max-w-2xl space-y-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <Sparkles className="h-3 w-3" /> Premium Resource Store
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight">
            Purchase Premium Source Codes & E-Books
          </h1>
          <p className="text-sm text-slate-350 leading-relaxed">
            Boost your project grades and career prep with fully documented IEEE project synopses, circuit board layouts, Vercel-style UI kits, and solved interview ebooks.
          </p>
          <div className="flex gap-4">
            <span className="text-xs text-slate-400">⚡ Instant Downloads</span>
            <span className="text-xs text-slate-400">🛡 Verified Licenses</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2.5 items-center justify-start border-b border-slate-200 dark:border-slate-800 pb-6">
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              selectedType === t.id
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 hover:bg-slate-100 text-slate-650 dark:text-slate-350'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Catalog Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl h-80"></div>
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={p.id}
                className="flex flex-col bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-blue-500/20 transition-all duration-300"
              >
                <div className="relative h-48 bg-slate-100 dark:bg-slate-950">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span className="absolute top-4 left-4 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-950/70 backdrop-blur-sm text-white flex items-center gap-1">
                    <TagIcon className="h-2.5 w-2.5" /> {p.type}
                  </span>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5 text-blue-500" /> {p.downloads} purchased</span>
                      <span className="flex items-center gap-1 text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /> {p.rating}</span>
                    </div>
                    <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">{p.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{p.description}</p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 flex items-center justify-between">
                    <div>
                      {p.discountPrice ? (
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-black text-slate-900 dark:text-white">₹{p.discountPrice}</span>
                          <span className="text-xs line-through text-slate-400">₹{p.price}</span>
                        </div>
                      ) : (
                        <span className="text-base font-black text-slate-900 dark:text-white">₹{p.price}</span>
                      )}
                      <p className="text-[10px] text-slate-400">{p.license} | v{p.version}</p>
                    </div>

                    <Link 
                      href={`/marketplace/${p.slug}`}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 transition-all duration-200"
                    >
                      Buy Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  )
}
