export interface Category {
  id: string
  name: string
  slug: string
  icon: string
}

export interface Project {
  id: string
  title: string
  slug: string
  description: string
  longDescription: string
  features: string[]
  technologies: string[]
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  duration: string
  image: string
  screenshots: string[]
  demoVideo?: string
  docUrl?: string
  codeUrl?: string
  categoryId: string
  downloadCount: number
  isApproved: boolean
  createdAt: Date
}

export interface Testimonial {
  id: string
  studentName: string
  college: string
  role: string
  comment: string
  rating: number
  avatar?: string
  isFeatured: boolean
}

export const mockCategories: Category[] = [
  { id: 'cat-1', name: 'C & C++', slug: 'c-cpp', icon: 'Code' },
  { id: 'cat-2', name: 'Python & Data Science', slug: 'python-ds', icon: 'Terminal' },
  { id: 'cat-3', name: 'Web Development', slug: 'web-dev', icon: 'Globe' },
  { id: 'cat-4', name: 'AI & Machine Learning', slug: 'ai-ml', icon: 'Brain' },
  { id: 'cat-5', name: 'Cyber Security & Cloud', slug: 'security-cloud', icon: 'ShieldCheck' },
  { id: 'cat-6', name: 'IoT & Robotics', slug: 'iot-robotics', icon: 'Cpu' },
  { id: 'cat-7', name: 'Mobile Apps (Flutter/Android)', slug: 'mobile-apps', icon: 'Smartphone' },
  { id: 'cat-8', name: 'Final Year & Academic', slug: 'academic-projects', icon: 'GraduationCap' },
]

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'AI-Powered Smart Plagiarism Detector',
    slug: 'ai-smart-plagiarism-detector',
    description: 'An advanced Python application using natural language processing to identify semantic similarity and copy-pasted content across document databases.',
    longDescription: `The AI-Powered Smart Plagiarism Detector is a comprehensive final-year project designed to go beyond simple exact-match checking. By utilizing deep learning and natural language processing (NLP), this system analyzes the semantic meaning, sentence structure, and vocabulary patterns of document submissions. 

It provides school and college instructors with an interactive dashboard that flags potential plagiarized text, highlights matching source URLs, and calculates an overall similarity index. The system supports PDF, DOCX, and TXT files, performing high-speed vector space comparison against an indexed local database and web pages.`,
    features: [
      'Semantic Similarity Matching: Flags paraphrased text using cosine similarity and BERT embeddings.',
      'Interactive PDF Highlight Reports: Visual highlights of matching phrases directly in the document.',
      'Web Scraping & API Integration: Scrapes public search engines to find online source material.',
      'Admin Dashboard: Management tools for teachers to review and approve submission reports.'
    ],
    technologies: ['Python', 'Flask', 'NLTK', 'scikit-learn', 'PyPDF2', 'Tailwind CSS', 'React'],
    difficulty: 'ADVANCED',
    duration: '6 Weeks',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    docUrl: '#',
    codeUrl: '#',
    categoryId: 'cat-4',
    downloadCount: 1245,
    isApproved: true,
    createdAt: new Date('2026-01-15'),
  },
  {
    id: 'proj-2',
    title: 'Autonomous Home Automation IoT Hub',
    slug: 'autonomous-home-automation-iot',
    description: 'A complete IoT solution built using Raspberry Pi and Arduino, featuring a web dashboard to control lights, security locks, and temperature sensors.',
    longDescription: `This project is a hardware-and-software home automation hub designed for electronics and IoT enthusiasts. Utilizing a Raspberry Pi as the central broker running a Node.js dashboard, and multiple ESP8266/Arduino microcontrollers as node sensor controllers.

It communicates via MQTT to publish and subscribe to sensor feeds. The dashboard lets students and researchers test light switches, view real-time temperature/humidity charts, monitor door lock status, and set up automated rules (e.g., sound an alarm if motion is detected after 10 PM).`,
    features: [
      'MQTT Protocol Communication: Ultra-low latency transmission of control commands and sensor telemetry.',
      'Real-time Dashboard: Built with React and Chart.js, featuring WebSockets for instant updates.',
      'Security Trigger Alerts: Sends automated email and push notifications if gas or motion is detected.',
      'Voice Command Integration: Expandable API to connect with smart assistants like Google Home.'
    ],
    technologies: ['C++', 'Arduino', 'Node.js', 'Raspberry Pi', 'MQTT', 'WebSockets', 'React', 'MongoDB'],
    difficulty: 'INTERMEDIATE',
    duration: '4 Weeks',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    docUrl: '#',
    codeUrl: '#',
    categoryId: 'cat-6',
    downloadCount: 843,
    isApproved: true,
    createdAt: new Date('2026-02-10'),
  },
  {
    id: 'proj-3',
    title: 'Decentralized Blockchain Voting System',
    slug: 'decentralized-blockchain-voting',
    description: 'A secure, tamper-proof, transparent college election voting system running on Ethereum smart contracts using Solidity and React.',
    longDescription: `Decentralized Blockchain Voting System is an advanced cybersecurity project addressing the vulnerability of digital election boards. By moving voter records and tallies to a distributed ledger, we ensure that votes cannot be modified, deleted, or double-counted.

Students can register securely, verify their identity, and cast their vote using MetaMask or built-in private keys. The backend smart contracts are written in Solidity, compile with Hardhat, and are tested for common reentrancy and security issues.`,
    features: [
      'Smart Contract Votes: Solidified on the Ethereum blockchain, making election counts immutable.',
      'Zero Knowledge Proof Concepts: Validates voter eligibility without exposing their identity or candidate choice.',
      'Live Count Charts: Renders dynamic charts of election results once the voting window closes.',
      'Gas Optimization: Highly optimized functions to reduce transaction cost during elections.'
    ],
    technologies: ['Solidity', 'React', 'Web3.js', 'Ethers.js', 'Tailwind CSS', 'Hardhat', 'Next.js'],
    difficulty: 'ADVANCED',
    duration: '8 Weeks',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    docUrl: '#',
    codeUrl: '#',
    categoryId: 'cat-5',
    downloadCount: 654,
    isApproved: true,
    createdAt: new Date('2026-03-01'),
  },
  {
    id: 'proj-4',
    title: 'SaaS E-Commerce microservices Engine',
    slug: 'saas-ecommerce-microservices',
    description: 'A production-ready web application built using Next.js 15, Prisma, and Stripe, showcasing scalable multi-vendor management.',
    longDescription: `The SaaS E-Commerce microservices Engine is a modern web development project focusing on architecture design. It features an App Router setup with server components, lazy loading images, full cart state management, and Stripe checkout hooks.

Admins can log in to upload products, monitor user purchase history, approve vendor applications, and view analytics charts. It represents a fully integrated product ready for standard deployment.`,
    features: [
      'Multi-Vendor Support: Separate dashboard access for sellers to update stock and price tags.',
      'Secure Stripe Checkouts: Standard integration with stripe webhook events handling.',
      'Database Cache Optimization: Speeds up heavy category filtering queries by utilizing indexing.'
    ],
    technologies: ['Next.js', 'React', 'Prisma', 'PostgreSQL', 'Tailwind CSS', 'Stripe', 'Framer Motion'],
    difficulty: 'INTERMEDIATE',
    duration: '5 Weeks',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80',
    screenshots: [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    ],
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    docUrl: '#',
    codeUrl: '#',
    categoryId: 'cat-3',
    downloadCount: 1932,
    isApproved: true,
    createdAt: new Date('2026-03-12'),
  },
  {
    id: 'proj-5',
    title: 'Real-time Traffic Congestion Manager',
    slug: 'real-time-traffic-congestion-manager',
    description: 'A structural C++ project utilizing advanced graph theory algorithms to optimize vehicle pathing and reduce light delay.',
    longDescription: `A simulation software designed for computer science and civil engineering coursework. Using standard algorithms like Dijkstra and A* Search, it simulates peak-hour gridlock and adjusts red/green light intervals to maximize traffic throughput.`,
    features: [
      'Dijkstra Shortest Pathing: Instantly redirects vehicles away from blocked nodes.',
      'Interactive Canvas Renderer: 2D simulation of cars moving through a street grid.'
    ],
    technologies: ['C++', 'Qt Creator', 'Graph Algorithms', 'SFML Graphics'],
    difficulty: 'BEGINNER',
    duration: '3 Weeks',
    image: 'https://images.unsplash.com/photo-1494783367193-149034c05e8f?auto=format&fit=crop&w=800&q=80',
    screenshots: [],
    demoVideo: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    docUrl: '#',
    codeUrl: '#',
    categoryId: 'cat-1',
    downloadCount: 382,
    isApproved: true,
    createdAt: new Date('2026-04-05'),
  }
]

export const mockTestimonials: Testimonial[] = [
  {
    id: 'test-1',
    studentName: 'Sanjay Kumar',
    college: 'IIT Madras',
    role: 'B.Tech CSE Student',
    comment: 'ProjectHub saved me weeks of coding! I downloaded the Smart Plagiarism Detector as a base, extended the NLP engine, and aced my final year presentation.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    isFeatured: true,
  },
  {
    id: 'test-2',
    studentName: 'Priya Sharma',
    college: 'BITS Pilani',
    role: 'Electronics & Communication',
    comment: 'The Raspberry Pi smart hub code was so clean. The circuit diagrams in the documentation matched the pins perfectly. Highly recommended for IoT beginners!',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    isFeatured: true,
  },
  {
    id: 'test-3',
    studentName: 'Rohit Sen',
    college: 'VIT Vellore',
    role: 'MCA Student',
    comment: 'I requested a custom Blockchain voting script. The ProjectHub developers delivered it in 5 days, within my tight student budget, and explained the smart contract deployment step-by-step.',
    rating: 5,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    isFeatured: true,
  }
]

export const mockTutorials = [
  { title: 'Git & GitHub Complete Student Guide', type: 'Programming Tutorials', readTime: '12 mins', level: 'Beginner', link: '/learning/tutorials/git-guide' },
  { title: 'Top 50 Data Structures & Algorithms (DSA) Interview Questions', type: 'Placement Preparation', readTime: '25 mins', level: 'Intermediate', link: '/learning/tutorials/dsa-notes' },
  { title: 'Solidity Smart Contract Security Best Practices', type: 'Cyber Security Notes', readTime: '18 mins', level: 'Advanced', link: '/learning/tutorials/solidity-security' },
  { title: 'Machine Learning Model Deployment on AWS & GCP', type: 'AI Notes', readTime: '15 mins', level: 'Advanced', link: '/learning/tutorials/ml-deployment' }
]

export const mockRoadmaps = [
  { title: 'Full Stack Web Developer Roadmap (React & Node.js)', steps: ['HTML/CSS/JS', 'React & Tailwind', 'Next.js App Router', 'Node.js & Express', 'Prisma & SQL/MongoDB', 'DevOps & Deploy'], color: 'from-blue-600 to-indigo-600' },
  { title: 'Artificial Intelligence & Data Science Roadmap', steps: ['Python Core', 'Linear Algebra & Statistics', 'Pandas & Numpy', 'Machine Learning (Scikit)', 'Deep Learning (PyTorch)', 'MLOps & Pipelines'], color: 'from-purple-600 to-pink-600' },
  { title: 'Cyber Security Analyst Roadmap', steps: ['Networking Basics', 'Linux Command Line', 'Penetration Testing', 'Identity & Access Management', 'Smart Contract Auditing', 'SIEM & Threat Hunting'], color: 'from-emerald-600 to-teal-600' }
]
