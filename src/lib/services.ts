import { db } from './db'
import { mockCategories, mockProjects, mockTestimonials } from './mockData'

// In-Memory Storage Fallbacks for Local Development
let inMemCategories = [...mockCategories]
let inMemProjects = [...mockProjects]
let inMemTestimonials = [...mockTestimonials]

// In-Memory Products (Marketplace)
let inMemProducts: any[] = [
  {
    id: 'prod-1',
    name: 'Premium NextJS SaaS Boilerplate UI Kit',
    slug: 'premium-nextjs-saas-boilerplate',
    description: 'A Vercel-like dashboard ui template built using Tailwind CSS v4, Framer Motion, and React Hook Forms. Ready for production.',
    price: 999.0,
    discountPrice: 499.0,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    fileUrl: '#',
    downloadCount: 142,
    rating: 4.8,
    version: '1.2.0',
    license: 'Commercial License',
    isActive: true,
    categoryId: 'cat-3',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-2',
    name: 'Diabetic Retinopathy CNN Model Weights & Report',
    slug: 'diabetic-retinopathy-cnn-model',
    description: 'Trained ResNet50 neural network weights in Keras .h5 format, along with a complete 80-page IEEE format synopsis report.',
    price: 1999.0,
    discountPrice: 1499.0,
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    fileUrl: '#',
    downloadCount: 89,
    rating: 4.9,
    version: '2.1.0',
    license: 'Academic Submission License',
    isActive: true,
    categoryId: 'cat-4',
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'prod-3',
    name: 'ESP32 Smart Irrigation PCB Gerber Files',
    slug: 'esp32-irrigation-pcb-gerber',
    description: 'Complete Fritzing schematics, EasyEDA PCB layouts, and Gerber files for manufacturing an automated ESP32 soil moisture controller board.',
    price: 599.0,
    discountPrice: 299.0,
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    fileUrl: '#',
    downloadCount: 54,
    rating: 4.6,
    version: '1.0.0',
    license: 'Personal Hobby License',
    isActive: true,
    categoryId: 'cat-6',
    createdAt: new Date(),
    updatedAt: new Date()
  }
]

let inMemRequests: any[] = [
  {
    id: 'req-1',
    studentName: 'Amit Patel',
    email: 'amit@gmail.com',
    phone: '+91 98765 43210',
    college: 'PSG College of Technology',
    department: 'Information Technology',
    year: '4th Year',
    projectTitle: 'Deep Learning System for Diabetic Retinopathy Detection',
    description: 'Needs a python Flask backend with a CNN model (ResNet50) and a Next.js front-end for uploading retina photos and getting reports.',
    technologies: ['Python', 'TensorFlow', 'Flask', 'Next.js'],
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    budget: 8000.0,
    status: 'PENDING',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'req-2',
    studentName: 'Kavitha R',
    email: 'kavi@gmail.com',
    phone: '+91 99998 88877',
    college: 'CEG Guindy',
    department: 'Electronics & Communication',
    year: '3rd Year',
    projectTitle: 'Smart Water Irrigation IoT using ESP32',
    description: 'An IoT project connecting soil moisture sensors to ESP32 microcontrollers, reporting telemetry to an dashboard.',
    technologies: ['Arduino', 'ESP32', 'C++', 'NodeJS'],
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    budget: 4500.0,
    status: 'APPROVED',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    updatedAt: new Date(),
  }
]

// Request Milestones Mocks
let inMemMilestones: any[] = [
  { id: 'ms-1', requestId: 'req-2', title: 'Hardware Board Assembly', description: 'Procuring ESP32, soil moisture sensors, and compiling basic sensor reading firmware.', status: 'Completed', percent: 100, updatedAt: new Date() },
  { id: 'ms-2', requestId: 'req-2', title: 'MQTT Telemetry Integration', description: 'Connecting microcontrollers to the MQTT broker, publishing sensor feeds.', status: 'In Progress', percent: 50, updatedAt: new Date() },
  { id: 'ms-3', requestId: 'req-2', title: 'Web Dashboard & Reports', description: 'Designing the Next.js visual graphs, and writing the submission documentation.', status: 'Pending', percent: 0, updatedAt: new Date() }
]

let inMemDownloads: any[] = []
let inMemFavorites: any[] = []
let inMemReviews: any[] = [
  {
    id: 'rev-1',
    userId: 'user-sanjay',
    userName: 'Sanjay Kumar',
    projectId: 'proj-1',
    rating: 5,
    comment: 'Brilliant NLP plagiarism checker code. Easy to deploy!',
    createdAt: new Date('2026-03-10'),
  }
]
let inMemComments: any[] = [
  {
    id: 'comm-1',
    text: 'Can we run this on a Raspberry Pi Zero?',
    userId: 'user-sanjay',
    userName: 'Sanjay Kumar',
    projectId: 'proj-2',
    parentId: null,
    createdAt: new Date('2026-03-20'),
  }
]

// Support Tickets Mocks
let inMemTickets: any[] = [
  { id: 'tkt-1', userId: 'default-student-id', subject: 'Gerber Files extraction error', category: 'Installation', priority: 'Medium', status: 'OPEN', createdAt: new Date(), updatedAt: new Date() }
]
let inMemTicketMessages: any[] = [
  { id: 'tmsg-1', ticketId: 'tkt-1', senderId: 'default-student-id', senderName: 'Sanjay Kumar', text: 'Hi support team, I downloaded the Gerber files for the ESP32 project but the drill holes layer seems to throw import warnings in JLCPCB. Can you verify?', isFromStaff: false, createdAt: new Date() }
]

// Orders & Invoices Mocks
let inMemOrders: any[] = []
let inMemOrderItems: any[] = []
let inMemPayments: any[] = []
let inMemInvoices: any[] = []
let inMemCoupons: any[] = [
  { id: 'cpn-1', code: 'STUDENT50', discountPercent: 50.0, maxDiscountAmount: 1000.0, minOrderAmount: 100.0, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), usageLimit: 500, usageCount: 22, isActive: true },
  { id: 'cpn-2', code: 'WELCOME10', discountPercent: 10.0, maxDiscountAmount: 200.0, minOrderAmount: 50.0, expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), usageLimit: 1000, usageCount: 45, isActive: true }
]

let inMemActivityLogs: any[] = []
let inMemAuditLogs: any[] = []
let inMemMessages: any[] = []
let inMemNotifications: any[] = [
  { id: 'not-1', userId: 'default-student-id', title: 'Welcome to ProjectHub!', message: 'Explore our latest academic projects and find resources for your development.', read: false, createdAt: new Date() }
]

// HELPER: Try database query or catch connection failure
async function runSafe(dbQuery: () => Promise<any>, fallback: () => any): Promise<any> {
  try {
    if (!process.env.DATABASE_URL) {
      return fallback()
    }
    return await dbQuery()
  } catch (error) {
    console.warn('Database connection failed, falling back to In-Memory store.')
    return fallback()
  }
}

// 1. Categories
export async function getCategories(): Promise<any[]> {
  return runSafe(
    () => db.category.findMany({ include: { projects: true } }),
    () => inMemCategories.map(c => ({
      ...c,
      projects: inMemProjects.filter(p => p.categoryId === c.id)
    }))
  )
}

// 2. Browse projects with filters
export async function getProjects(filters: {
  categorySlug?: string
  difficulty?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  search?: string
  technology?: string
  sort?: 'latest' | 'popular' | 'downloaded'
} = {}): Promise<any[]> {
  return runSafe(
    async () => {
      const where: any = { isApproved: true }

      if (filters.categorySlug) {
        where.category = { slug: filters.categorySlug }
      }
      if (filters.difficulty) {
        where.difficulty = filters.difficulty
      }
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ]
      }
      if (filters.technology) {
        where.technologies = { has: filters.technology }
      }

      let orderBy: any = { createdAt: 'desc' }
      if (filters.sort === 'popular') {
        orderBy = { reviews: { _count: 'desc' } }
      } else if (filters.sort === 'downloaded') {
        orderBy = { downloadCount: 'desc' }
      }

      return db.project.findMany({
        where,
        orderBy,
        include: { category: true },
      })
    },
    () => {
      let filtered = [...inMemProjects].filter(p => p.isApproved)

      if (filters.categorySlug) {
        const cat = inMemCategories.find(c => c.slug === filters.categorySlug)
        filtered = filtered.filter(p => p.categoryId === cat?.id)
      }
      if (filters.difficulty) {
        filtered = filtered.filter(p => p.difficulty === filters.difficulty)
      }
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
        )
      }
      if (filters.technology) {
        filtered = filtered.filter(p =>
          p.technologies.some(t => t.toLowerCase() === filters.technology?.toLowerCase())
        )
      }

      if (filters.sort === 'downloaded') {
        filtered.sort((a, b) => b.downloadCount - a.downloadCount)
      } else if (filters.sort === 'popular') {
        filtered.sort((a, b) => b.downloadCount - a.downloadCount)
      } else {
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      }

      return filtered.map(p => ({
        ...p,
        category: inMemCategories.find(c => c.id === p.categoryId)
      }))
    }
  )
}

// 3. Project details
export async function getProjectBySlug(slug: string): Promise<any> {
  return runSafe(
    () => db.project.findUnique({
      where: { slug },
      include: { category: true }
    }),
    () => {
      const proj = inMemProjects.find(p => p.slug === slug)
      if (!proj) return null
      return {
        ...proj,
        category: inMemCategories.find(c => c.id === proj.categoryId)
      }
    }
  )
}

// 4. Admin CRUD Actions
export async function createProject(projectData: any) {
  return runSafe(
    () => db.project.create({ data: projectData }),
    () => {
      const newProj = {
        id: `proj-${Date.now()}`,
        downloadCount: 0,
        isApproved: true,
        createdAt: new Date(),
        ...projectData,
        features: Array.isArray(projectData.features) ? projectData.features : [projectData.features],
        technologies: Array.isArray(projectData.technologies) ? projectData.technologies : [projectData.technologies],
      }
      inMemProjects.push(newProj)
      return newProj
    }
  )
}

export async function updateProject(id: string, projectData: any) {
  return runSafe(
    () => db.project.update({ where: { id }, data: projectData }),
    () => {
      const idx = inMemProjects.findIndex(p => p.id === id)
      if (idx === -1) throw new Error('Project not found')
      inMemProjects[idx] = {
        ...inMemProjects[idx],
        ...projectData,
        features: Array.isArray(projectData.features) ? projectData.features : inMemProjects[idx].features,
        technologies: Array.isArray(projectData.technologies) ? projectData.technologies : inMemProjects[idx].technologies,
      }
      return inMemProjects[idx]
    }
  )
}

export async function deleteProject(id: string) {
  return runSafe(
    () => db.project.delete({ where: { id } }),
    () => {
      inMemProjects = inMemProjects.filter(p => p.id !== id)
      return { id }
    }
  )
}

// 5. Download logger
export async function incrementDownloadCount(projectId: string, userId?: string) {
  return runSafe(
    async () => {
      const updated = await db.project.update({
        where: { id: projectId },
        data: { downloadCount: { increment: 1 } },
      })
      if (userId) {
        await db.download.create({
          data: { userId, projectId },
        })
      }
      return updated
    },
    () => {
      const proj = inMemProjects.find(p => p.id === projectId)
      if (proj) {
        proj.downloadCount++
      }
      if (userId) {
        inMemDownloads.push({
          id: `dl-${Date.now()}`,
          userId,
          projectId,
          downloadedAt: new Date()
        })
      }
      return proj
    }
  )
}

export async function getDownloadsForUser(userId: string): Promise<any[]> {
  return runSafe(
    () => db.download.findMany({
      where: { userId },
      include: { project: { include: { category: true } } },
      orderBy: { downloadedAt: 'desc' },
    }),
    () => inMemDownloads
      .filter(d => d.userId === userId)
      .map(d => ({
        ...d,
        project: {
          ...inMemProjects.find(p => p.id === d.projectId),
          category: inMemCategories.find(c => c.id === (inMemProjects.find(p => p.id === d.projectId)?.categoryId))
        }
      }))
  )
}

// 6. Favorites
export async function toggleFavorite(userId: string, projectId: string) {
  return runSafe(
    async () => {
      const existing = await db.favorite.findUnique({
        where: { userId_projectId: { userId, projectId } },
      })
      if (existing) {
        await db.favorite.delete({
          where: { id: existing.id },
        })
        return { favorited: false }
      } else {
        await db.favorite.create({
          data: { userId, projectId },
        })
        return { favorited: true }
      }
    },
    () => {
      const idx = inMemFavorites.findIndex(f => f.userId === userId && f.projectId === projectId)
      if (idx !== -1) {
        inMemFavorites.splice(idx, 1)
        return { favorited: false }
      } else {
        inMemFavorites.push({
          id: `fav-${Date.now()}`,
          userId,
          projectId,
          createdAt: new Date()
        })
        return { favorited: true }
      }
    }
  )
}

export async function getFavoritesForUser(userId: string): Promise<any[]> {
  return runSafe(
    () => db.favorite.findMany({
      where: { userId },
      include: { project: { include: { category: true } } },
    }),
    () => inMemFavorites
      .filter(f => f.userId === userId)
      .map(f => ({
        ...f,
        project: {
          ...inMemProjects.find(p => p.id === f.projectId),
          category: inMemCategories.find(c => c.id === (inMemProjects.find(p => p.id === f.projectId)?.categoryId))
        }
      }))
  )
}

// 7. Reviews & Ratings
export async function getReviewsForProject(projectId: string): Promise<any[]> {
  return runSafe(
    () => db.review.findMany({
      where: { projectId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    () => inMemReviews
      .filter(r => r.projectId === projectId)
      .map(r => ({
        ...r,
        user: { name: r.userName || 'Anonymous Student' }
      }))
  )
}

export async function createReview(userId: string, projectId: string, rating: number, comment: string, userName: string = 'Student') {
  return runSafe(
    () => db.review.upsert({
      where: { userId_projectId: { userId, projectId } },
      update: { rating, comment, createdAt: new Date() },
      create: { userId, projectId, rating, comment },
    }),
    () => {
      const existingIdx = inMemReviews.findIndex(r => r.userId === userId && r.projectId === projectId)
      const reviewObj = {
        id: existingIdx !== -1 ? inMemReviews[existingIdx].id : `rev-${Date.now()}`,
        userId,
        userName,
        projectId,
        rating,
        comment,
        createdAt: new Date()
      }

      if (existingIdx !== -1) {
        inMemReviews[existingIdx] = reviewObj
      } else {
        inMemReviews.push(reviewObj)
      }
      return reviewObj
    }
  )
}

// 8. Comments
export async function getCommentsForProject(projectId: string) {
  return runSafe(
    () => db.comment.findMany({
      where: { projectId },
      include: { user: { select: { name: true } } },
      orderBy: { createdAt: 'asc' },
    }),
    () => inMemComments
      .filter(c => c.projectId === projectId)
      .map(c => ({
        ...c,
        user: { name: c.userName || 'Student' }
      }))
  )
}

export async function createComment(userId: string, projectId: string, text: string, parentId: string | null, userName: string = 'Student') {
  return runSafe(
    () => db.comment.create({
      data: { userId, projectId, text, parentId },
    }),
    () => {
      const newComment = {
        id: `comm-${Date.now()}`,
        text,
        userId,
        userName,
        projectId,
        parentId,
        createdAt: new Date()
      }
      inMemComments.push(newComment)
      return newComment
    }
  )
}

// 9. Custom Requests
export async function createRequest(requestData: any) {
  return runSafe(
    () => db.request.create({ data: requestData }),
    () => {
      const newReq = {
        id: `req-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...requestData,
      }
      inMemRequests.push(newReq)
      return newReq
    }
  )
}

export async function getRequests(studentEmail?: string) {
  return runSafe(
    () => {
      if (studentEmail) {
        return db.request.findMany({
          where: { email: studentEmail },
          orderBy: { createdAt: 'desc' },
        })
      }
      return db.request.findMany({ orderBy: { createdAt: 'desc' } })
    },
    () => {
      if (studentEmail) {
        return inMemRequests
          .filter(r => r.email.toLowerCase() === studentEmail.toLowerCase())
          .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      }
      return [...inMemRequests].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    }
  )
}

export async function updateRequestStatus(id: string, status: 'PENDING' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'REJECTED') {
  return runSafe(
    () => db.request.update({
      where: { id },
      data: { status, updatedAt: new Date() }
    }),
    () => {
      const req = inMemRequests.find(r => r.id === id)
      if (req) {
        req.status = status
        req.updatedAt = new Date()
      }
      return req
    }
  )
}

// 10. Messages (Chat Support)
export async function getMessages(senderId: string) {
  return runSafe(
    () => db.message.findMany({
      where: {
        OR: [
          { senderId },
          { receiverId: senderId }
        ]
      },
      orderBy: { createdAt: 'asc' }
    }),
    () => inMemMessages
      .filter(m => m.senderId === senderId || m.receiverId === senderId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  )
}

export async function getAllMessages() {
  return runSafe(
    () => db.message.findMany({ orderBy: { createdAt: 'asc' } }),
    () => [...inMemMessages].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  )
}

export async function sendMessage(senderId: string, senderName: string, text: string, isFromAdmin: boolean = false, receiverId: string | null = null) {
  return runSafe(
    () => db.message.create({
      data: { senderId, senderName, text, isFromAdmin, receiverId }
    }),
    () => {
      const newMsg = {
        id: `msg-${Date.now()}`,
        senderId,
        senderName,
        receiverId,
        text,
        isFromAdmin,
        createdAt: new Date()
      }
      inMemMessages.push(newMsg)
      return newMsg
    }
  )
}

// 11. Notifications
export async function getNotifications(userId: string) {
  return runSafe(
    () => db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    }),
    () => inMemNotifications
      .filter(n => n.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  )
}

export async function createNotification(userId: string, title: string, message: string) {
  return runSafe(
    () => db.notification.create({
      data: { userId, title, message }
    }),
    () => {
      const newNot = {
        id: `not-${Date.now()}`,
        userId,
        title,
        message,
        read: false,
        createdAt: new Date()
      }
      inMemNotifications.push(newNot)
      return newNot
    }
  )
}

export async function markNotificationRead(id: string) {
  return runSafe(
    () => db.notification.update({
      where: { id },
      data: { read: true }
    }),
    () => {
      const n = inMemNotifications.find(x => x.id === id)
      if (n) n.read = true
      return n
    }
  )
}

// 12. Testimonials
export async function getTestimonials(featuredOnly: boolean = false) {
  return runSafe(
    () => db.testimonial.findMany({
      where: featuredOnly ? { isFeatured: true } : {},
      orderBy: { createdAt: 'desc' }
    }),
    () => {
      if (featuredOnly) {
        return inMemTestimonials.filter(t => t.isFeatured)
      }
      return [...inMemTestimonials]
    }
  )
}

// ==========================================
// NEW SaaS SERVICES (COUPONS, INVOICES, PORTFOLIO, MESSAGES, TICKETS)
// ==========================================

// Product Marketplace Catalog
export async function getProducts(): Promise<any[]> {
  return runSafe(
    () => db.product.findMany({ include: { category: true } }),
    () => inMemProducts.map(p => ({
      ...p,
      category: inMemCategories.find(c => c.id === p.categoryId)
    }))
  )
}

export async function getProductBySlug(slug: string): Promise<any> {
  return runSafe(
    () => db.product.findUnique({
      where: { slug },
      include: { category: true }
    }),
    () => {
      const prod = inMemProducts.find(p => p.slug === slug)
      if (!prod) return null
      return {
        ...prod,
        category: inMemCategories.find(c => c.id === prod.categoryId)
      }
    }
  )
}

// Coupons
export async function checkCoupon(code: string): Promise<any> {
  return runSafe(
    () => db.coupon.findUnique({ where: { code } }),
    () => {
      const c = inMemCoupons.find(x => x.code.toUpperCase() === code.toUpperCase() && x.isActive)
      if (!c) return null
      if (new Date(c.expiryDate).getTime() < Date.now()) return null
      return c
    }
  )
}

// Orders, Payments and Invoices
export async function createOrder(orderData: any): Promise<any> {
  return runSafe(
    () => db.order.create({ data: orderData }),
    () => {
      const newOrder = {
        id: `ord-${Date.now()}`,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...orderData
      }
      inMemOrders.push(newOrder)
      return newOrder
    }
  )
}

export async function updateOrderPayment(orderId: string, paymentData: any): Promise<any> {
  return runSafe(
    async () => {
      await db.order.update({
        where: { id: orderId },
        data: { status: 'PAID', paymentId: paymentData.transactionId }
      })
      return db.payment.create({ data: { orderId, ...paymentData } })
    },
    () => {
      const idx = inMemOrders.findIndex(o => o.id === orderId)
      if (idx !== -1) {
        inMemOrders[idx].status = 'PAID'
        inMemOrders[idx].paymentId = paymentData.transactionId
      }
      const paymentObj = {
        id: `pay-${Date.now()}`,
        orderId,
        createdAt: new Date(),
        ...paymentData
      }
      inMemPayments.push(paymentObj)
      return paymentObj
    }
  )
}

export async function createInvoice(invoiceData: any): Promise<any> {
  return runSafe(
    () => db.invoice.create({ data: invoiceData }),
    () => {
      const invoiceObj = {
        id: `inv-${Date.now()}`,
        invoiceNumber: `INV-${Date.now()}`,
        createdAt: new Date(),
        ...invoiceData
      }
      inMemInvoices.push(invoiceObj)
      
      // Link back to Order in memory
      const idx = inMemOrders.findIndex(o => o.id === invoiceData.orderId)
      if (idx !== -1) {
        inMemOrders[idx].invoiceId = invoiceObj.id
      }
      return invoiceObj
    }
  )
}

export async function getInvoicesForUser(userId: string): Promise<any[]> {
  return runSafe(
    () => db.invoice.findMany({
      where: { order: { userId } },
      include: { order: true }
    }),
    () => inMemInvoices
      .filter(inv => {
        const order = inMemOrders.find(o => o.id === inv.orderId)
        return order && order.userId === userId
      })
      .map(inv => ({
        ...inv,
        order: inMemOrders.find(o => o.id === inv.orderId)
      }))
  )
}

// Request Milestones
export async function getMilestonesForRequest(requestId: string): Promise<any[]> {
  return runSafe(
    () => db.requestMilestone.findMany({ where: { requestId }, orderBy: { createdAt: 'asc' } }),
    () => inMemMilestones.filter(m => m.requestId === requestId)
  )
}

export async function createMilestone(milestoneData: any): Promise<any> {
  return runSafe(
    () => db.requestMilestone.create({ data: milestoneData }),
    () => {
      const ms = {
        id: `ms-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...milestoneData
      }
      inMemMilestones.push(ms)
      return ms
    }
  )
}

export async function updateMilestoneProgress(id: string, percent: number, status: string): Promise<any> {
  return runSafe(
    () => db.requestMilestone.update({
      where: { id },
      data: { percent, status, updatedAt: new Date() }
    }),
    () => {
      const ms = inMemMilestones.find(x => x.id === id)
      if (ms) {
        ms.percent = percent
        ms.status = status
        ms.updatedAt = new Date()
      }
      return ms
    }
  )
}

// Support Tickets
export async function createSupportTicket(ticketData: any): Promise<any> {
  return runSafe(
    () => db.supportTicket.create({ data: ticketData }),
    () => {
      const newTkt = {
        id: `tkt-${Date.now()}`,
        status: 'OPEN',
        createdAt: new Date(),
        updatedAt: new Date(),
        ...ticketData
      }
      inMemTickets.push(newTkt)
      return newTkt
    }
  )
}

export async function getTicketsForUser(userId: string): Promise<any[]> {
  return runSafe(
    () => db.supportTicket.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' } }),
    () => inMemTickets.filter(t => t.userId === userId).sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  )
}

export async function getAllTickets(): Promise<any[]> {
  return runSafe(
    () => db.supportTicket.findMany({ orderBy: { updatedAt: 'desc' } }),
    () => [...inMemTickets].sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
  )
}

export async function addTicketMessage(ticketId: string, senderId: string, senderName: string, text: string, isFromStaff: boolean = false): Promise<any> {
  return runSafe(
    async () => {
      await db.supportTicket.update({
        where: { id: ticketId },
        data: { updatedAt: new Date(), status: isFromStaff ? 'IN_PROGRESS' : 'OPEN' }
      })
      return db.ticketMessage.create({
        data: { ticketId, senderId, senderName, text, isFromStaff }
      })
    },
    () => {
      const t = inMemTickets.find(x => x.id === ticketId)
      if (t) {
        t.status = isFromStaff ? 'IN_PROGRESS' : 'OPEN'
        t.updatedAt = new Date()
      }
      const newMsg = {
        id: `tmsg-${Date.now()}`,
        ticketId,
        senderId,
        senderName,
        text,
        isFromStaff,
        createdAt: new Date()
      }
      inMemTicketMessages.push(newMsg)
      return newMsg
    }
  )
}

export async function getTicketMessages(ticketId: string): Promise<any[]> {
  return runSafe(
    () => db.ticketMessage.findMany({ where: { ticketId }, orderBy: { createdAt: 'asc' } }),
    () => inMemTicketMessages.filter(m => m.ticketId === ticketId).sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
  )
}

// Activity & Audit Logging
export async function logActivity(userId: string, activity: string, logType: 'USER_EVENT' | 'SECURITY_EVENT' | 'TRANSACT_EVENT' = 'USER_EVENT', ip?: string, ua?: string): Promise<any> {
  return runSafe(
    () => db.activityLog.create({
      data: { userId, activity, logType, ipAddress: ip, userAgent: ua }
    }),
    () => {
      const log = {
        id: `act-${Date.now()}`,
        userId,
        activity,
        logType,
        ipAddress: ip,
        userAgent: ua,
        createdAt: new Date()
      }
      inMemActivityLogs.push(log)
      return log
    }
  )
}

export async function getAuditLogs(): Promise<any[]> {
  return runSafe(
    () => db.auditLog.findMany({ orderBy: { createdAt: 'desc' }, include: { admin: { include: { user: true } } } }),
    () => [...inMemAuditLogs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
  )
}

// 13. Dashboards Analytics
export async function getAnalytics() {
  return runSafe(
    async () => {
      const totalProjects = await db.project.count()
      const totalDownloads = await db.download.count()
      const totalUsers = await db.user.count()
      const pendingRequests = await db.request.count({ where: { status: 'PENDING' } })
      const completedRequests = await db.request.count({ where: { status: 'COMPLETED' } })

      const downloadsOverTime = [
        { label: 'Jan', value: 240 },
        { label: 'Feb', value: 450 },
        { label: 'Mar', value: 590 },
        { label: 'Apr', value: 820 },
        { label: 'May', value: 1100 },
        { label: 'Jun', value: 1350 },
      ]

      const revenueOverTime = [
        { label: 'Jan', value: 12000 },
        { label: 'Feb', value: 19000 },
        { label: 'Mar', value: 32000 },
        { label: 'Apr', value: 28000 },
        { label: 'May', value: 45000 },
        { label: 'Jun', value: 64000 },
      ]

      return {
        totalProjects,
        totalDownloads,
        totalUsers,
        pendingRequests,
        completedRequests,
        downloadsOverTime,
        revenueOverTime,
      }
    },
    () => {
      return {
        totalProjects: inMemProjects.length,
        totalDownloads: 3412 + inMemDownloads.length,
        totalUsers: 1423,
        pendingRequests: inMemRequests.filter(r => r.status === 'PENDING').length,
        completedRequests: inMemRequests.filter(r => r.status === 'COMPLETED').length,
        downloadsOverTime: [
          { label: 'Jan', value: 240 },
          { label: 'Feb', value: 450 },
          { label: 'Mar', value: 590 },
          { label: 'Apr', value: 820 },
          { label: 'May', value: 1100 },
          { label: 'Jun', value: 1350 },
        ],
        revenueOverTime: [
          { label: 'Jan', value: 12000 },
          { label: 'Feb', value: 19000 },
          { label: 'Mar', value: 32000 },
          { label: 'Apr', value: 28000 },
          { label: 'May', value: 45000 },
          { label: 'Jun', value: 64000 },
        ],
      }
    }
  )
}

// Coding Challenges Services
export async function getChallenges(): Promise<any[]> {
  const defaultChallenges = [
    {
      id: 'chal-1',
      title: 'In-Place Linked List Reversal',
      difficulty: 'EASY',
      points: 100,
      description: 'Given the head of a singly linked list, reverse the list in-place and return its new head node. The operation must operate under O(1) auxiliary memory constraints.',
      constraints: [
        'The number of nodes in the list is in the range [0, 5000].',
        '-5000 <= Node.val <= 5000',
        'Memory complexity must be O(1).'
      ],
      template: `/**\n * Definition for singly-linked list.\n * function ListNode(val, next) {\n *     this.val = (val===undefined ? 0 : val)\n *     this.next = (next===undefined ? null : next)\n * }\n */\nfunction reverseList(head) {\n    let prev = null;\n    let current = head;\n    \n    // Write your high-security code here\n    \n    return prev;\n}`,
      testCases: [
        { input: 'head = [1,2,3,4,5]', expected: '[5,4,3,2,1]' },
        { input: 'head = [1,2]', expected: '[2,1]' }
      ],
      verifyCodeRegex: 'current=|current.next|while'
    },
    {
      id: 'chal-2',
      title: 'Dijkstra Grid Shortest Path',
      difficulty: 'MEDIUM',
      points: 250,
      description: 'Find the shortest path weight in a 2D grid from coordinate [0,0] to [n-1, n-1]. Each cell has an energy cost. Minimize the sum of costs along the path.',
      constraints: [
        'Grid size is n x n, where 2 <= n <= 100.',
        'Cell values represent movement latency weights.',
        'Complexity should be O(V log V + E) using priority queues.'
      ],
      template: `function shortestPath(grid) {\n    const n = grid.length;\n    const distances = Array(n).fill().map(() => Array(n).fill(Infinity));\n    \n    // Enter pathfinder priority queue algorithm here\n    \n    return distances[n-1][n-1];\n}`,
      testCases: [
        { input: 'grid = [[1,3,1],[1,5,1],[4,2,1]]', expected: '7' },
        { input: 'grid = [[1,2],[3,4]]', expected: '7' }
      ],
      verifyCodeRegex: 'Infinity|distances\\[|queue'
    }
  ]

  if (typeof window !== 'undefined') return defaultChallenges

  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'src/lib/challenges.json')
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    } else {
      const dirPath = path.dirname(filePath)
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true })
      }
      fs.writeFileSync(filePath, JSON.stringify(defaultChallenges, null, 2), 'utf-8')
      return defaultChallenges
    }
  } catch (err) {
    console.error('Error reading challenges.json:', err)
    return defaultChallenges
  }
}

export async function saveChallenge(challengeData: any): Promise<boolean> {
  if (typeof window !== 'undefined') return false

  try {
    const fs = require('fs')
    const path = require('path')
    const filePath = path.join(process.cwd(), 'src/lib/challenges.json')
    
    const challenges = await getChallenges()
    const newChal = {
      id: `chal-${Date.now()}`,
      title: challengeData.title,
      difficulty: challengeData.difficulty,
      points: Number(challengeData.points),
      description: challengeData.description,
      constraints: challengeData.constraints || [],
      template: challengeData.template,
      testCases: challengeData.testCases || [],
      verifyCodeRegex: challengeData.verifyCodeRegex || 'return'
    }
    
    challenges.push(newChal)
    fs.writeFileSync(filePath, JSON.stringify(challenges, null, 2), 'utf-8')
    return true
  } catch (err) {
    console.error('Error writing challenges.json:', err)
    return false
  }
}

