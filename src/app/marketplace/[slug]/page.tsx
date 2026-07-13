'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeft, Star, Download, ShieldCheck, Ticket, 
  CreditCard, Sparkles, CheckCircle2, FileText, Lock
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/context/ToastContext'

export default function ProductDetailPage() {
  const { toast } = useToast()
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const { user } = useAuth()

  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponSuccess, setCouponSuccess] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'NET_BANKING'>('UPI')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [orderCompleted, setOrderCompleted] = useState<any>(null)

  // Fetch product locally
  useEffect(() => {
    // Local list lookup
    const localItems = [
      {
        id: 'prod-1',
        name: 'Premium NextJS SaaS Boilerplate UI Kit',
        slug: 'premium-nextjs-saas-boilerplate',
        description: 'Vercel-like dashboard ui template built using Tailwind CSS v4, Framer Motion, and React Hook Forms. Ready for production.',
        longDescription: 'A premium-grade NextJS starter kit designed specifically for student developers looking to build scalable software. Built using Tailwind v4, clsx, and Framer Motion, this boilerplate includes standard JWT authorization context layers, client notifications dashboards, support ticket forums, and clean folder conventions aligned with enterprise Next.js App Router rules.',
        price: 999.0,
        discountPrice: 499.0,
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
        downloads: 142,
        rating: 4.8,
        version: '1.2.0',
        license: 'Commercial License',
        includes: ['Full Next.js source code zip', '12 UI dashboards', 'Auth Middlewares', 'Documentation PDF'],
        tech: ['Next.js 15', 'React 19', 'Tailwind v4', 'JWT Auth']
      },
      {
        id: 'prod-2',
        name: 'Diabetic Retinopathy CNN Model Weights & Report',
        slug: 'diabetic-retinopathy-cnn-model',
        description: 'Trained ResNet50 neural network weights in Keras .h5 format, along with a complete 80-page IEEE format synopsis report.',
        longDescription: 'This academic research bundle contains a deep learning model trained on the APTOS blindness detection database. It includes trained convolutional neural network (CNN) model weights (ResNet50 architecture) with 94.2% test accuracy, a complete Flask microservice backend routing script, a modern Next.js client upload dashboard, and a fully structured 80-page project documentation report in Word format matching standard Indian university formats.',
        price: 1999.0,
        discountPrice: 1499.0,
        image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
        downloads: 89,
        rating: 4.9,
        version: '2.1.0',
        license: 'Academic Submission License',
        includes: ['Trained ResNet50 Weights (.h5)', 'Flask python API router script', 'Next.js upload dashboard code', '80-page Word Synopsis Report'],
        tech: ['Python', 'TensorFlow', 'Keras', 'Flask', 'Next.js']
      },
      {
        id: 'prod-3',
        name: 'ESP32 Smart Irrigation PCB Gerber Files',
        slug: 'esp32-irrigation-pcb-gerber',
        description: 'Complete Fritzing schematics, EasyEDA PCB layouts, and Gerber files for manufacturing automated irrigation boards.',
        longDescription: 'An industry-grade IoT telemetry project design. This contains the full Gerber files compatible with JLCPCB/PCBWay, Fritzing circuit schematics, bill of materials (BOM), C++ Arduino IDE sensor telemetry codes for moisture calibration, and deep sleep battery optimization configurations.',
        price: 599.0,
        discountPrice: 299.0,
        image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
        downloads: 54,
        rating: 4.6,
        version: '1.0.0',
        license: 'Hobbyist License',
        includes: ['Gerber PCB manufacturing files', 'Fritzing Schematics', 'BOM components list', 'ESP32 firmware script C++'],
        tech: ['C++', 'Arduino IDE', 'ESP32', 'EasyEDA']
      }
    ]

    const item = localItems.find(x => x.slug === slug)
    if (item) {
      setProduct(item)
    }
    setLoading(false)
  }, [slug])

  // Apply Coupon Code
  const handleApplyCoupon = () => {
    setCouponError('')
    setCouponSuccess('')
    
    const code = couponCode.trim().toUpperCase()
    if (!code) return

    if (code === 'STUDENT50') {
      setAppliedCoupon({ code: 'STUDENT50', percent: 50 })
      setCouponSuccess('Coupon applied successfully! 50% discount deducted.')
    } else if (code === 'WELCOME10') {
      setAppliedCoupon({ code: 'WELCOME10', percent: 10 })
      setCouponSuccess('Coupon applied successfully! 10% discount deducted.')
    } else {
      setCouponError('Invalid or expired coupon code.')
    }
  }

  // Calculate Prices
  const getPricing = () => {
    if (!product) return { original: 0, current: 0, discount: 0, final: 0 }
    const original = product.price
    const current = product.discountPrice || product.price
    let discount = original - current
    let final = current

    if (appliedCoupon) {
      const couponDeduction = current * (appliedCoupon.percent / 100)
      discount += couponDeduction
      final = current - couponDeduction
    }

    return {
      original,
      current,
      discount,
      final: Math.round(final)
    }
  }

  // Handle Simulated checkout
  const handleCheckout = async () => {
    if (!user) {
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
      return
    }

    setIsSubmitting(true)
    setCouponError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          price: product.price,
          discountPrice: product.discountPrice,
          couponCode: appliedCoupon?.code || null,
          paymentMethod
        })
      })

      if (res.ok) {
        const data = await res.json()
        setOrderCompleted(data)
      } else {
        const errData = await res.json()
        setCouponError(errData.error || 'Failed to complete transaction checkout.')
      }
    } catch (err) {
      setCouponError('Network error during checkout processing.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center">
        <p className="text-slate-500 animate-pulse">Loading product specifications...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <Link href="/marketplace" className="text-blue-500 hover:underline">Back to Store</Link>
      </div>
    )
  }

  const prices = getPricing()

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Back button */}
      <Link 
        href="/marketplace"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-800"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Store
      </Link>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Product Details Columns */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1 text-amber-500 font-bold"><Star className="h-3.5 w-3.5 fill-current" /> {product.rating} (Reviews)</span>
              <span className="flex items-center gap-1"><Download className="h-3.5 w-3.5 text-blue-500" /> {product.downloads} downloads</span>
              <span>Version {product.version}</span>
            </div>
          </div>

          <div className="aspect-video rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Product Description</h3>
            <p className="text-sm leading-relaxed text-slate-650 dark:text-slate-350">
              {product.longDescription}
            </p>
          </div>

          {/* Included Files */}
          <div className="bg-slate-50 dark:bg-slate-900/30 rounded-3xl p-6 border border-slate-200/50 dark:border-slate-800/80 space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">What's Included in the Download Bundle:</h4>
            <ul className="grid sm:grid-cols-2 gap-3">
              {product.includes.map((inc: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                  <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" /> {inc}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* E-Commerce Billing & Checkout Column */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Order Summary</h3>

            {/* Pricing Summary */}
            <div className="space-y-3.5 border-b border-slate-100 dark:border-slate-800/80 pb-4">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Original Price</span>
                <span className="line-through">₹{prices.original}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Domain Discount</span>
                <span className="text-emerald-500">-₹{Math.round(prices.original - prices.current)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-xs text-slate-500">
                  <span>Coupon ({appliedCoupon.code})</span>
                  <span className="text-emerald-500">-₹{Math.round(prices.current - prices.final)}</span>
                </div>
              )}
              <div className="flex justify-between items-baseline pt-2">
                <span className="text-sm font-bold text-slate-900 dark:text-white">Total Amount</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">₹{prices.final}</span>
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Apply Code</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. STUDENT50" 
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3.5 py-2 text-xs rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button 
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all"
                >
                  Apply
                </button>
              </div>
              {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
              {couponSuccess && <p className="text-[10px] text-emerald-500 font-medium">{couponSuccess}</p>}
              <p className="text-[10px] text-slate-400 italic">Try "STUDENT50" for 50% discount!</p>
            </div>

            {/* Simulated Payment Methods */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Select Payment Gateway</label>
              <div className="grid grid-cols-3 gap-2">
                {['UPI', 'CARD', 'NET_BANKING'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method as any)}
                    className={`py-2 text-[10px] font-bold rounded-xl border text-center transition-all ${
                      paymentMethod === method
                        ? 'border-blue-500 bg-blue-500/5 text-blue-600 dark:text-blue-400'
                        : 'border-slate-200 dark:border-slate-800 text-slate-500 hover:border-slate-300'
                    }`}
                  >
                    {method === 'UPI' ? 'BHIM UPI' : method === 'CARD' ? 'Card' : 'NetBank'}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              disabled={isSubmitting}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-100 dark:disabled:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              {isSubmitting ? (
                <span>Routing Payment...</span>
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" /> Secure Checkout
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Order Success Dialog Box */}
      {orderCompleted && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-500">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Purchase Confirmed!</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Your payment of ₹{orderCompleted.amount} was authenticated successfully via {orderCompleted.method}.
              </p>
            </div>

            {/* Receipt Summary Box */}
            <div className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 p-4 rounded-2xl text-left space-y-2.5 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex justify-between">
                <span className="font-semibold">Invoice Number</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white">{orderCompleted.invoiceNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Product Purchased</span>
                <span className="truncate max-w-[180px] font-bold text-slate-900 dark:text-white">{orderCompleted.productName}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Billing Date</span>
                <span>{orderCompleted.date}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button 
                onClick={() => {
                  toast(`GST Invoice PDF (${orderCompleted.invoiceNumber}) downloaded!`, 'success')
                }}
                className="w-full py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-350 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <FileText className="h-4 w-4" /> Download GST Invoice
              </button>
              <button 
                onClick={() => {
                  toast('ZIP code installation bundle downloaded successfully!', 'success')
                  setOrderCompleted(null)
                  router.push('/dashboard')
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4" /> Download Source Code ZIP
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
