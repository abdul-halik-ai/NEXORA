import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database started...')

  // Clear existing records
  await prisma.download.deleteMany({})
  await prisma.favorite.deleteMany({})
  await prisma.review.deleteMany({})
  await prisma.comment.deleteMany({})
  await prisma.request.deleteMany({})
  await prisma.notification.deleteMany({})
  await prisma.message.deleteMany({})
  await prisma.project.deleteMany({})
  await prisma.category.deleteMany({})
  await prisma.testimonial.deleteMany({})
  await prisma.user.deleteMany({})

  console.log('Cleared existing database records.')

  // Hash passwords
  const salt = await bcrypt.genSalt(10)
  const studentPasswordHash = await bcrypt.hash('password123', salt)
  const adminPasswordHash = await bcrypt.hash('adminPassword123', salt)

  // Seed Users
  const student = await prisma.user.create({
    data: {
      email: 'student@gmail.com',
      passwordHash: studentPasswordHash,
      name: 'Sanjay Kumar',
      role: 'STUDENT',
      college: 'VIT Vellore',
      department: 'Information Technology',
      year: '3rd Year',
      phone: '+91 98765 43210'
    }
  })

  const admin = await prisma.user.create({
    data: {
      email: 'admin@gmail.com',
      passwordHash: adminPasswordHash,
      name: 'Admin Assistant',
      role: 'ADMIN',
      phone: '+91 44 2490 8593'
    }
  })

  console.log('Seeded users:', { student: student.email, admin: admin.email })

  // Seed Categories
  const catCpp = await prisma.category.create({ data: { name: 'C & C++', slug: 'c-cpp', icon: 'Code' } })
  const catPy = await prisma.category.create({ data: { name: 'Python & Data Science', slug: 'python-ds', icon: 'Terminal' } })
  const catWeb = await prisma.category.create({ data: { name: 'Web Development', slug: 'web-dev', icon: 'Globe' } })
  const catAI = await prisma.category.create({ data: { name: 'AI & Machine Learning', slug: 'ai-ml', icon: 'Brain' } })
  const catSec = await prisma.category.create({ data: { name: 'Cyber Security & Cloud', slug: 'security-cloud', icon: 'ShieldCheck' } })
  const catIoT = await prisma.category.create({ data: { name: 'IoT & Robotics', slug: 'iot-robotics', icon: 'Cpu' } })
  const catMob = await prisma.category.create({ data: { name: 'Mobile Apps (Flutter/Android)', slug: 'mobile-apps', icon: 'Smartphone' } })

  console.log('Seeded categories.')

  // Seed Projects
  const proj1 = await prisma.project.create({
    data: {
      title: 'AI-Powered Smart Plagiarism Detector',
      slug: 'ai-smart-plagiarism-detector',
      description: 'An advanced Python application using natural language processing to identify semantic similarity and copy-pasted content across document databases.',
      longDescription: 'The AI-Powered Smart Plagiarism Detector is a comprehensive final-year project designed to go beyond simple exact-match checking. By utilizing deep learning and natural language processing (NLP), this system analyzes the semantic meaning, sentence structure, and vocabulary patterns of document submissions. It provides instructors with an interactive dashboard that flags potential plagiarized text, highlights matching source URLs, and calculates an overall similarity index.',
      features: [
        'Semantic Similarity Matching: cos similarity and BERT embeddings',
        'Interactive PDF Highlight Reports: Visual highlights in document',
        'Web Scraping & API Integration: Scrapes public search engines to find online source material',
        'Admin Dashboard: Management tools to review reports'
      ],
      technologies: ['Python', 'Flask', 'NLTK', 'scikit-learn', 'PyPDF2', 'React'],
      difficulty: 'ADVANCED',
      duration: '6 Weeks',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
      ],
      demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      docUrl: '#',
      codeUrl: '#',
      categoryId: catAI.id,
      downloadCount: 1245,
      isApproved: true
    }
  })

  const proj2 = await prisma.project.create({
    data: {
      title: 'Autonomous Home Automation IoT Hub',
      slug: 'autonomous-home-automation-iot',
      description: 'A complete IoT solution built using Raspberry Pi and Arduino, featuring a web dashboard to control lights, security locks, and temperature sensors.',
      longDescription: 'This project is a hardware-and-software home automation hub designed for electronics and IoT enthusiasts. Utilizing a Raspberry Pi as the central broker running a Node.js dashboard, and multiple ESP8266/Arduino microcontrollers as node sensor controllers. It communicates via MQTT to publish and subscribe to sensor feeds.',
      features: [
        'MQTT Protocol Communication: Ultra-low latency transmission',
        'Real-time Dashboard: Built with React and Chart.js using WebSockets',
        'Security Trigger Alerts: Sends automated email and push notifications if gas or motion is detected',
        'Voice Command Integration: Expandable API to connect with smart assistants'
      ],
      technologies: ['C++', 'Arduino', 'Node.js', 'Raspberry Pi', 'MQTT', 'React', 'MongoDB'],
      difficulty: 'INTERMEDIATE',
      duration: '4 Weeks',
      image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
      screenshots: [
        'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
      ],
      demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      docUrl: '#',
      codeUrl: '#',
      categoryId: catIoT.id,
      downloadCount: 843,
      isApproved: true
    }
  })

  console.log('Seeded projects.')

  // Seed Testimonials
  await prisma.testimonial.create({
    data: {
      studentName: 'Sanjay Kumar',
      college: 'VIT Vellore',
      role: 'B.Tech CSE Student',
      comment: 'ProjectHub saved me weeks of coding! I downloaded the Smart Plagiarism Detector as a base, extended the NLP engine, and aced my final year presentation.',
      rating: 5,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      isFeatured: true
    }
  })

  console.log('Seeding database completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
