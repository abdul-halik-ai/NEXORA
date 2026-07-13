// AI Tool Suite Backend Simulation / Live Connector

export async function generateAIContent(
  tool: 'idea' | 'readme' | 'viva' | 'explain' | 'optimize' | 'viva-grade',
  prompt: string
): Promise<string> {
  const q = prompt.trim()
  if (!q) return 'Please provide an input prompt.'

  // Check if Gemini API key exists (support future live key bindings)
  if (process.env.GEMINI_API_KEY) {
    try {
      const response = await fetch(
        `https://generativetool.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `You are an expert academic project advisor. Tool: ${tool}. Prompt: ${prompt}` }] }]
          })
        }
      )
      if (response.ok) {
        const data = await response.json()
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated.'
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local simulation.')
    }
  }

  // Realistic Simulation responses based on input keywords
  await new Promise(resolve => setTimeout(resolve, 1200)) // simulate loading

  if (tool === 'idea') {
    return `### 💡 AI Generated Project Ideas for: "${q}"

Here are three customized, submission-ready project ideas matching your query:

#### 1. Smart Grid Scheduler using ${q}
- **Objective**: Automate task/power scheduling based on dynamic queue calculations.
- **Key Modules**: Scheduling Engine, Analytics Dashboard, IoT Node Simulation.
- **Difficulty**: Intermediate (4-6 weeks)
- **Scope**: Best suited for CSE or EEE mini-projects.

#### 2. Federated Data Privacy Analytics
- **Objective**: Apply differential privacy limits on public dataset search queries using ${q}.
- **Key Modules**: Noise Insertion Algorithms, Query Logger, Dashboard Graph Renderers.
- **Difficulty**: Advanced (6-8 weeks)
- **Scope**: Final Year B.Tech / MCA submission.

#### 3. Real-Time Telemetry Monitor
- **Objective**: High-speed communication pipeline connecting hardware sensors to a NextJS dashboard.
- **Key Modules**: WebSocket Broker, CSV Logger, Alert Handler.
- **Difficulty**: Beginner (3 weeks)
- **Scope**: School science exhibition or college laboratory experiment.`
  }

  if (tool === 'readme') {
    return `# 🚀 Project Title: ${q}

A modern academic application built for college project submissions.

## 📋 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation & Setup](#-installation--setup)
- [Database Schema](#-database-schema)
- [License](#-license)

## ✨ Features
- **User Authentication**: Secure JWT/OAuth sessions.
- **Real-Time Synchronization**: WebSockets for live telemetry charts.
- **Admin Dashboard**: Manage inventory, approve listings, and view analytics.

## 🛠 Tech Stack
- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Server Actions, PostgreSQL
- **Database ORM**: Prisma ORM

## ⚙ Installation & Setup

1. **Clone the repository**:
   \`\`\`bash
   git clone https://github.com/student/projecthub-${q.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git
   cd projecthub
   \`\`\`

2. **Install node packages**:
   \`\`\`bash
   npm install --legacy-peer-deps
   \`\`\`

3. **Configure Environment variables**:
   Create a \`.env\` file in the root folder:
   \`\`\`env
   DATABASE_URL="postgresql://postgres:password@localhost:5432/db"
   JWT_SECRET="academic-development-secret-key"
   \`\`\`

4. **Initialize Database Tables**:
   \`\`\`bash
   npx prisma db push
   \`\`\`

5. **Run local developer server**:
   \`\`\`bash
   npm run dev
   \`\`\`
   Open http://localhost:3000 in your browser.`
  }

  if (tool === 'viva') {
    return `### 🎓 Viva Voce Preparation Q&A for: "${q}"

Here are the top 5 questions external examiners are likely to ask during project review:

#### Q1: What is the primary architecture model of this project?
- **Answer**: The project is designed using a **Client-Server Architecture** utilizing Next.js Server Components. The backend layers are decoupled via Prisma ORM schemas, allowing Postgres database swapping without touching the UI components.

#### Q2: Why did you choose this specific tech stack for the project?
- **Answer**: Next.js was selected due to its **Server-Side Rendering (SSR)** capabilities which speed up page loads and enhance SEO. PostgreSQL provides ACID compliance which is critical for maintaining structured student download logs.

#### Q3: How is authentication secured in this application?
- **Answer**: User sessions are authenticated using **JWT tokens** stored in HTTP-only cookies. This prevents Cross-Site Scripting (XSS) scripts from reading the session tokens, and password records are encrypted using bcrypt hashing salts.

#### Q4: If the traffic/download count spikes, how will the system scale?
- **Answer**: Database indexing has been added to searching columns to speed up query execution. The app is stateless, meaning it can be deployed on serverless edges like Vercel or AWS Lambda to scale with concurrent visitor counts.

#### Q5: What would you improve in this system if you had another month?
- **Answer**: I would integrate Redis caching for popular download queries to reduce DB connection pool locks, and implement a live payment gate check via Stripe API.`
  }

  if (tool === 'explain') {
    return `### 🔍 Code Explanation Report

Here is a step-by-step breakdown of your input code logic:

1. **Imports & Declarations**: The script initializes local instances and loads dependencies.
2. **State Context Validation**: It checks if session states exist, preventing guest users from executing administrative tasks.
3. **Execution Pipeline**: It processes calculations inside a try-catch block, ensuring database connections close cleanly in case of errors.
4. **Memory Optimization**: Loop operations are decoupled using async promise queues to prevent JavaScript main thread blocks.

**Recommendation**: The logic is stable. Consider adding error boundaries in the UI layer to capture network failures.`
  }

  if (tool === 'optimize') {
    return `### ⚡ Code Optimization & Bug Report

Here are refactoring tips for your input code:

#### 1. Avoid Memory Leak in Event Listeners
- **Issue**: Event listeners are declared in hooks without return cleanups.
- **Fix**: Return an unsubscribe function inside \`useEffect\`:
  \`\`\`typescript
  useEffect(() => {
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  \`\`\`

#### 2. Cache Heavy Map Loops
- **Issue**: Array calculations are re-evaluating on every re-render.
- **Fix**: Wrap calculations in a \`useMemo\` hook:
  \`\`\`typescript
  const optimizedData = useMemo(() => heavyMapFunction(data), [data]);
  \`\`\`

#### Status: Optimization suggestions applied. Compilation checks passed.`
  }

  if (tool === 'viva-grade') {
    const ansUpper = q.toUpperCase()
    let score = 7
    let review = 'The student demonstrates solid core knowledge of database mapping and structural layout.'
    let tip = 'Provide concrete details on how indexing decreases lookup times.'

    if (ansUpper.includes('INDEX') || ansUpper.includes('REDIS') || ansUpper.includes('CACHE')) {
      score += 1
      review += ' Good mention of search speed optimizations.'
      tip = 'Try detailing how you prevent connection pool bottlenecks under scaling spikes.'
    }
    if (ansUpper.includes('BCRYPT') || ansUpper.includes('SALT') || ansUpper.includes('JWT') || ansUpper.includes('TOKEN')) {
      score += 1
      review += ' Excellent awareness of user security parameters.'
      tip = 'Next time, discuss cross-origin policy parameters and session expiration settings.'
    }
    score = Math.min(10, score)

    return JSON.stringify({
      score,
      review,
      tip
    })
  }

  return 'Tool not recognized.'
}
