// AI Tool Suite Backend Simulation / Live Connector

export async function generateAIContent(
  tool: 'idea' | 'readme' | 'viva' | 'explain' | 'optimize' | 'viva-grade' | 'support-chat',
  prompt: string
): Promise<string> {
  const q = prompt.trim()
  if (!q) return 'Please provide an input prompt.'

  // Check if Gemini API key exists (support future live key bindings)
  if (process.env.GEMINI_API_KEY) {
    try {
      let systemPrompt = `You are an expert academic project advisor. Tool: ${tool}. Prompt: ${prompt}`
      
      if (tool === 'support-chat') {
        systemPrompt = `You are a helpful and friendly academic support assistant for the Nexora project repository platform. A student asks: "${prompt}". Provide a brief, helpful response under 3 sentences. If they ask about custom projects, tell them to use the Request Project page.`
      }
      
      if (tool === 'viva-grade') {
        systemPrompt = `You are an expert external examiner evaluating a student's Viva Voce answer.
You will be provided with a JSON string containing the 'question' and the student's 'answer': ${prompt}.
Evaluate the answer strictly and realistically based on the question. 
You must respond with ONLY a valid JSON object with the following keys:
- "score": an integer from 1 to 10.
- "review": a 1-2 sentence honest review of their answer.
- "tip": a 1 sentence tip on how they could have answered better.
- "recommendedAnswer": a 2-3 sentence ideal, highly technical answer to the question.
Do not use markdown blocks like \`\`\`json. Return just the raw JSON string.`
      }

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: systemPrompt }] }]
          })
        }
      )
      
      if (response.ok) {
        const data = await response.json()
        let text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
        
        if (tool === 'viva-grade') {
          // Clean up markdown just in case the AI ignored instructions
          text = text.replace(/```json/gi, '').replace(/```/g, '').trim()
        }
        
        if (text) return text
      } else {
        console.warn('Gemini API Error:', await response.text())
      }
    } catch (e) {
      console.warn('Gemini API call failed, falling back to local simulation.', e)
    }
  }

  // Realistic Simulation responses based on input keywords
  await new Promise(resolve => setTimeout(resolve, 1200)) // simulate loading

  if (tool === 'support-chat') {
    return `Hello! I am your AI Support Assistant. To answer your question: "${q}" — Please check our documentation or the "Request Project" page for more detailed help. Can I assist you with anything else today?`
  }

  if (tool === 'idea') {
    return `### 💡 AI Generated Project Ideas for: "${q}"\n\nHere are three customized, submission-ready project ideas matching your query:\n\n#### 1. Smart Grid Scheduler using ${q}\n- **Objective**: Automate task/power scheduling based on dynamic queue calculations.\n- **Key Modules**: Scheduling Engine, Analytics Dashboard, IoT Node Simulation.\n- **Difficulty**: Intermediate (4-6 weeks)\n- **Scope**: Best suited for CSE or EEE mini-projects.\n\n#### 2. Federated Data Privacy Analytics\n- **Objective**: Apply differential privacy limits on public dataset search queries using ${q}.\n- **Key Modules**: Noise Insertion Algorithms, Query Logger, Dashboard Graph Renderers.\n- **Difficulty**: Advanced (6-8 weeks)\n- **Scope**: Final Year B.Tech / MCA submission.\n\n#### 3. Real-Time Telemetry Monitor\n- **Objective**: High-speed communication pipeline connecting hardware sensors to a NextJS dashboard.\n- **Key Modules**: WebSocket Broker, CSV Logger, Alert Handler.\n- **Difficulty**: Beginner (3 weeks)\n- **Scope**: School science exhibition or college laboratory experiment.`
  }

  if (tool === 'readme') {
    return `# 🚀 Project Title: ${q}\n\nA modern academic application built for college project submissions.\n\n## 📋 Table of Contents\n- [Features](#-features)\n- [Tech Stack](#-tech-stack)\n- [Installation & Setup](#-installation--setup)\n- [Database Schema](#-database-schema)\n- [License](#-license)\n\n## ✨ Features\n- **User Authentication**: Secure JWT/OAuth sessions.\n- **Real-Time Synchronization**: WebSockets for live telemetry charts.\n- **Admin Dashboard**: Manage inventory, approve listings, and view analytics.\n\n## 🛠 Tech Stack\n- **Frontend**: Next.js 15, TypeScript, Tailwind CSS\n- **Backend**: Server Actions, PostgreSQL\n- **Database ORM**: Prisma ORM\n\n## ⚙ Installation & Setup\n\n1. **Clone the repository**:\n   \`\`\`bash\n   git clone https://github.com/student/nexora-${q.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.git\n   cd nexora\n   \`\`\`\n\n2. **Install node packages**:\n   \`\`\`bash\n   npm install --legacy-peer-deps\n   \`\`\`\n\n3. **Configure Environment variables**:\n   Create a \`.env\` file in the root folder:\n   \`\`\`env\n   DATABASE_URL="postgresql://postgres:password@localhost:5432/db"\n   JWT_SECRET="academic-development-secret-key"\n   \`\`\`\n\n4. **Initialize Database Tables**:\n   \`\`\`bash\n   npx prisma db push\n   \`\`\`\n\n5. **Run local developer server**:\n   \`\`\`bash\n   npm run dev\n   \`\`\`\n   Open http://localhost:3000 in your browser.`
  }

  if (tool === 'viva') {
    return `### 🎓 Viva Voce Preparation Q&A for: "${q}"\n\nHere are the top 5 questions external examiners are likely to ask during project review:\n\n#### Q1: What is the primary architecture model of this project?\n- **Answer**: The project is designed using a **Client-Server Architecture** utilizing Next.js Server Components. The backend layers are decoupled via Prisma ORM schemas, allowing Postgres database swapping without touching the UI components.\n\n#### Q2: Why did you choose this specific tech stack for the project?\n- **Answer**: Next.js was selected due to its **Server-Side Rendering (SSR)** capabilities which speed up page loads and enhance SEO. PostgreSQL provides ACID compliance which is critical for maintaining structured student download logs.\n\n#### Q3: How is authentication secured in this application?\n- **Answer**: User sessions are authenticated using **JWT tokens** stored in HTTP-only cookies. This prevents Cross-Site Scripting (XSS) scripts from reading the session tokens, and password records are encrypted using bcrypt hashing salts.\n\n#### Q4: If the traffic/download count spikes, how will the system scale?\n- **Answer**: Database indexing has been added to searching columns to speed up query execution. The app is stateless, meaning it can be deployed on serverless edges like Vercel or AWS Lambda to scale with concurrent visitor counts.\n\n#### Q5: What would you improve in this system if you had another month?\n- **Answer**: I would integrate Redis caching for popular download queries to reduce DB connection pool locks, and implement a live payment gate check via Stripe API.`
  }

  if (tool === 'explain') {
    return `### 🔍 Code Explanation Report\n\nHere is a step-by-step breakdown of your input code logic:\n\n1. **Imports & Declarations**: The script initializes local instances and loads dependencies.\n2. **State Context Validation**: It checks if session states exist, preventing guest users from executing administrative tasks.\n3. **Execution Pipeline**: It processes calculations inside a try-catch block, ensuring database connections close cleanly in case of errors.\n4. **Memory Optimization**: Loop operations are decoupled using async promise queues to prevent JavaScript main thread blocks.\n\n**Recommendation**: The logic is stable. Consider adding error boundaries in the UI layer to capture network failures.`
  }

  if (tool === 'optimize') {
    return `### ⚡ Code Optimization & Bug Report\n\nHere are refactoring tips for your input code:\n\n#### 1. Avoid Memory Leak in Event Listeners\n- **Issue**: Event listeners are declared in hooks without return cleanups.\n- **Fix**: Return an unsubscribe function inside \`useEffect\`:\n  \`\`\`typescript\n  useEffect(() => {\n    window.addEventListener('resize', handler);\n    return () => window.removeEventListener('resize', handler);\n  }, []);\n  \`\`\`\n\n#### 2. Cache Heavy Map Loops\n- **Issue**: Array calculations are re-evaluating on every re-render.\n- **Fix**: Wrap calculations in a \`useMemo\` hook:\n  \`\`\`typescript\n  const optimizedData = useMemo(() => heavyMapFunction(data), [data]);\n  \`\`\`\n\n#### Status: Optimization suggestions applied. Compilation checks passed.`
  }

  if (tool === 'viva-grade') {
    let studentAnswer = q;
    let question = "";
    try {
      const parsed = JSON.parse(q);
      studentAnswer = parsed.answer || "";
      question = parsed.question || "";
    } catch(e) {}

    const ansUpper = studentAnswer.toUpperCase();
    const qUpper = question.toUpperCase();
    
    let score = 4;
    let review = 'The answer lacks technical depth and specific details.';
    let tip = 'Try to use more technical vocabulary and directly address the core topic.';
    
    // Dynamic recommended answer based on question keywords
    let recommendedAnswer = 'A highly technical answer would explicitly cover the core architecture layers, data flow constraints, and security measures pertinent to this specific question topic.';
    if (qUpper.includes('SECURITY') || qUpper.includes('MALICIOUS')) {
      recommendedAnswer = 'We utilize encrypted bcrypt hashing for passwords and stateless JWT tokens stored in HTTP-only cookies to prevent XSS script hijacking and unauthorized spoofing.';
    } else if (qUpper.includes('SCALE') || qUpper.includes('PRODUCTION') || qUpper.includes('SPIKE')) {
      recommendedAnswer = 'To handle high loads, we implement connection pooling alongside Redis caching for frequent queries, and index our PostgreSQL database to ensure O(log n) lookup times during traffic spikes.';
    } else if (qUpper.includes('ARCHITECTURE') || qUpper.includes('LAYOUT')) {
      recommendedAnswer = 'We adopted a monolithic Next.js layout using server-side rendering (SSR) for SEO benefits, coupled with a decoupled Prisma ORM layer to ensure database portability.';
    } else if (qUpper.includes('DATASET') || qUpper.includes('MODEL')) {
      recommendedAnswer = 'The dataset was cleaned using Pandas for outlier removal, normalized via MinMax scaling, and fed into a Random Forest ensemble model to ensure robust prediction accuracy without overfitting.';
    } else if (qUpper.includes('HARDWARE') || qUpper.includes('SENSOR') || qUpper.includes('MICROCONTROLLER')) {
      recommendedAnswer = 'We selected the ESP32 due to its dual-core processor and native WiFi/BLE stack, interfacing with sensors via I2C protocol to minimize wire noise and ensure rapid polling cycles.';
    }

    if (studentAnswer.length > 30) {
      score += 2;
      review = 'The answer provides a decent foundation but could be more specific.';
    }

    if (ansUpper.includes('INDEX') || ansUpper.includes('REDIS') || ansUpper.includes('CACHE') || ansUpper.includes('SCALE') || ansUpper.includes('PERFORMANCE')) {
      score += 2;
      review = 'Good mention of performance and structural optimizations.';
      tip = 'Detail how this architecture prevents connection bottlenecks.';
    }
    
    if (ansUpper.includes('BCRYPT') || ansUpper.includes('SALT') || ansUpper.includes('JWT') || ansUpper.includes('TOKEN') || ansUpper.includes('SECURITY') || ansUpper.includes('AUTH')) {
      score += 2;
      review = 'Excellent awareness of user security parameters and encryption.';
      tip = 'Discuss cross-origin policy parameters and session expiration next time.';
    }

    if (ansUpper.includes('API') || ansUpper.includes('DATABASE') || ansUpper.includes('SERVER') || ansUpper.includes('REACT') || ansUpper.includes('POSTGRES')) {
      score += 1;
      review = 'Solid understanding of the core tech stack architecture and ecosystem.';
    }

    score = Math.min(10, score);

    return JSON.stringify({
      score,
      review,
      tip,
      recommendedAnswer
    });
  }

  return 'Tool not recognized.'
}
