'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, Clock, BookOpen, User, 
  CheckCircle2, Share2, Bookmark, Sparkles, FileText, ChevronRight 
} from 'lucide-react'
import { useToast } from '@/context/ToastContext'

interface TutorialDetail {
  title: string
  category: string
  readTime: string
  level: 'Beginner' | 'Intermediate' | 'Advanced'
  author: string
  date: string
  intro: string
  sections: { heading: string; paragraph: string; code?: string }[]
  keyTakeaways: string[]
}

const TUTORIAL_DATA: Record<string, TutorialDetail> = {
  'git-guide': {
    title: 'Git & GitHub Complete Student Guide',
    category: 'Programming Tutorials',
    readTime: '12 mins',
    level: 'Beginner',
    author: 'Prof. Rakesh Kumar',
    date: 'July 10, 2026',
    intro: 'Learn how to track source code edits, create features branches, and collaborate securely via GitHub for your college project submissions.',
    sections: [
      {
        heading: '1. What is Version Control?',
        paragraph: 'Version control is a system that records changes to a file or set of files over time so that you can recall specific versions later. In academic projects, it prevents accidental loss of code and lets multiple students work on the same repository concurrently.'
      },
      {
        heading: '2. Configuring Global Credentials',
        paragraph: 'Before committing code, configure your signature using the git config command in your terminal shell:',
        code: `$ git config --global user.name "Sanjay Kumar"
$ git config --global user.email "sanjay@gmail.com"
# Verify configuration settings
$ git config --list`
      },
      {
        heading: '3. Standard Development Commits',
        paragraph: 'Initialize a new local repository, add your project files, and commit the changes with descriptive messages:',
        code: `# Initialize repository
$ git init
# Add files to staging index
$ git add .
# Commit with message
$ git commit -m "feat: initialize Next.js client layout and Prisma schema"`
      },
      {
        heading: '4. Linking to Remote GitHub Server',
        paragraph: 'Connect your local repository to a remote server and push your commit history:',
        code: `# Add remote origin link
$ git remote add origin https://github.com/student/projecthub-setup.git
# Push main branch
$ git branch -M main
$ git push -u origin main`
      }
    ],
    keyTakeaways: [
      'Always pull remote changes before starting local edits.',
      'Write short, active-voice commit messages.',
      'Use .gitignore to hide database keys and node_modules folders.'
    ]
  },
  'dsa-notes': {
    title: 'Top 50 DSA Interview Questions & Solutions',
    category: 'Placement Preparation',
    readTime: '25 mins',
    level: 'Intermediate',
    author: 'Dean R. Srinivasan',
    date: 'June 28, 2026',
    intro: 'Ace your placements with our comprehensive revision cheatsheet covering arrays, linked list reversals, binary heaps, and priority routing paths.',
    sections: [
      {
        heading: '1. Arrays & Hashing',
        paragraph: 'Hash maps provide O(1) average lookup times, making them ideal for search optimizations. A classic question is "Two Sum" where you find two integers in an array that add up to a target value:',
        code: `function twoSum(nums, target) {
    const map = new Map();
    for (let i = 0; i < nums.length; i++) {
        const complement = target - nums[i];
        if (map.has(complement)) {
            return [map.get(complement), i];
        }
        map.set(nums[i], i);
    }
    return [];
}`
      },
      {
        heading: '2. Linked List Operations',
        paragraph: 'Swapping pointers in-place is highly tested. Understand list iteration bounds to avoid infinite loops or null pointer exceptions during head assignments.'
      },
      {
        heading: '3. Dijkstra Pathfinding Algorithm',
        paragraph: 'Dijkstra finds the shortest path weight from a starting node to all other nodes in a weighted graph. It uses a min-heap queue to extract the lowest latency weight:',
        code: `// Dijkstra complexity: O(V log V + E)
class PriorityQueue {
    constructor() { this.values = []; }
    enqueue(val, priority) {
        this.values.push({ val, priority });
        this.sort();
    }
    dequeue() { return this.values.shift(); }
    sort() { this.values.sort((a, b) => a.priority - b.priority); }
}`
      }
    ],
    keyTakeaways: [
      'Verify corner test cases (empty lists, single values, negative inputs).',
      'Optimize recursive depth to prevent stack overflow crashes.',
      'Understand the trade-offs of time vs. space complexity.'
    ]
  },
  'solidity-security': {
    title: 'Solidity Smart Contract Security Best Practices',
    category: 'Cyber Security Notes',
    readTime: '18 mins',
    level: 'Advanced',
    author: 'Advisor A. K. Sundar',
    date: 'July 04, 2026',
    intro: 'Identify and fix major smart contract security vulnerabilities such as reentrancy bounds, arithmetic overflows, and access controls.',
    sections: [
      {
        heading: '1. Preventing Reentrancy Exploits',
        paragraph: 'Reentrancy occurs when a contract sends funds to an untrusted contract before updating its balance state. The receiver contract recursively calls the withdraw function, draining the vault. Always apply the checks-effects-interactions pattern:',
        code: `// SECURITY WARNING: Vulnerable to Reentrancy
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
    balances[msg.sender] -= amount; // Effect after interaction!
}

// SECURE: Checks-Effects-Interactions
function withdrawSecure(uint amount) public {
    require(balances[msg.sender] >= amount);
    balances[msg.sender] -= amount; // Effect first!
    (bool success, ) = msg.sender.call{value: amount}("");
    require(success);
}`
      },
      {
        heading: '2. Access Control Assertions',
        paragraph: 'Restricting sensitive function calls to designated address profiles (like administrators) is paramount. Declare clear owner variables and custom modifiers:',
        code: `address public owner;

constructor() {
    owner = msg.sender;
}

modifier onlyOwner() {
    require(msg.sender == owner, "Caller is not the owner profile");
    _;
}`
      }
    ],
    keyTakeaways: [
      'Write state effects BEFORE external contract call interactions.',
      'Use OpenZeppelin standards for secure mathematical operations.',
      'Test contracts thoroughly in local networks (Hardhat/Foundry) before mainnet deployment.'
    ]
  },
  'ml-deployment': {
    title: 'Machine Learning Model Deployment Guide',
    category: 'AI Notes',
    readTime: '15 mins',
    level: 'Advanced',
    author: 'Dr. Vikram R. Seth',
    date: 'July 12, 2026',
    intro: 'Learn how to wrap deep learning CNN models in Docker containers and serve dynamic predictions using FastAPI pipelines.',
    sections: [
      {
        heading: '1. Model Serialization (Pickling)',
        paragraph: 'Export your trained neural networks to static weight files so they can be loaded instantly in production environments:',
        code: `import pickle
# Save trained weights
with open('retinopathy_model.pkl', 'wb') as file:
    pickle.dump(trained_classifier, file)

# Load weights in prediction API
with open('retinopathy_model.pkl', 'rb') as file:
    model = pickle.load(file)`
      },
      {
        heading: '2. Building predictions API with FastAPI',
        paragraph: 'FastAPI provides highly optimized prediction endpoints. Write a clean input parsing model using Pydantic schemas:',
        code: `from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np

app = FastAPI()

class PredictPayload(BaseModel):
    features: list

@app.post("/predict")
def predict_score(payload: PredictPayload):
    data = np.array(payload.features).reshape(1, -1)
    prediction = model.predict(data)
    return {"class_label": int(prediction[0]), "status": "computed"}`
      }
    ],
    keyTakeaways: [
      'Pin library versions in requirements.txt to prevent package mismatches.',
      'Wrap application layers in Docker containers for standard deployment.',
      'Monitor inference performance metrics to identify data drift issues.'
    ]
  }
}

export default function TutorialDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  
  const slug = params?.slug as string
  const tutorial = TUTORIAL_DATA[slug]

  const [completed, setCompleted] = useState(false)

  if (!tutorial) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 text-center space-y-4">
        <h1 className="text-xl font-bold">Tutorial not found</h1>
        <p className="text-xs text-slate-400">The requested learning document does not exist in our database catalog.</p>
        <Link href="/learning" className="inline-flex items-center text-xs font-semibold text-blue-500 hover:underline">
          <ArrowLeft className="h-4 w-4 mr-1.5" /> Return to Learning Hub
        </Link>
      </div>
    )
  }

  const handleMarkAsCompleted = () => {
    setCompleted(true)
    toast('Congratulations! Tutorial marked as completed. Earned +50 score points!', 'success')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-grid-pattern bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Navigation Headers */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-5 border-b border-slate-200/40 dark:border-slate-850">
        <Link 
          href="/learning" 
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-blue-500 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Learning Hub</span>
        </Link>

        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={handleMarkAsCompleted}
            disabled={completed}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
              completed 
                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/10'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>{completed ? 'Completed' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>

      {/* Main Split Layout */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left column: Article reading pane (8 cols) */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          {/* Header Metadata */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/20 uppercase tracking-wide">
                {tutorial.category}
              </span>
              <span className="text-slate-400 dark:text-slate-500">&bull;</span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-450 uppercase">{tutorial.level} Level</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight dark:text-white leading-tight">
              {tutorial.title}
            </h1>

            <div className="flex items-center space-x-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <span className="flex items-center gap-1"><User className="h-4 w-4 text-blue-500" /> {tutorial.author}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-violet-500" /> {tutorial.readTime} read</span>
              <span>&bull;</span>
              <span>Updated {tutorial.date}</span>
            </div>
          </div>

          {/* Intro Description */}
          <p className="text-sm text-slate-650 dark:text-slate-350 leading-relaxed font-medium bg-slate-50/50 dark:bg-slate-900/30 p-4 rounded-2xl border border-slate-200/40 dark:border-slate-850">
            {tutorial.intro}
          </p>

          {/* Dynamic Article Sections */}
          <div className="space-y-8 pt-4">
            {tutorial.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3.5">
                <h3 className="text-base font-extrabold dark:text-white tracking-tight flex items-center">
                  <ChevronRight className="h-4 w-4 text-blue-500 mr-1 shrink-0" />
                  <span>{sec.heading}</span>
                </h3>
                <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                  {sec.paragraph}
                </p>
                {sec.code && (
                  <div className="rounded-2xl overflow-hidden border border-slate-200/40 dark:border-slate-850 shadow-inner">
                    {/* Header bar */}
                    <div className="bg-slate-900/90 dark:bg-slate-950 border-b border-slate-200/20 px-4 py-2.5 flex items-center justify-between text-[10px] font-mono text-slate-500">
                      <span>Bash/Code Snippet Terminal</span>
                      <div className="flex space-x-1">
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                        <span className="w-2 h-2 rounded-full bg-slate-700" />
                      </div>
                    </div>
                    {/* Code Container */}
                    <pre className="bg-slate-900 dark:bg-slate-950/80 p-4 font-mono text-xs text-emerald-450 dark:text-emerald-400 overflow-x-auto leading-relaxed select-text text-left">
                      <code>{sec.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>

        {/* Right column: Key takeaways, summary, & tools card (4 cols) */}
        <div className="lg:col-span-4 space-y-6 text-left">
          
          {/* Key Takeaways */}
          <div className="rounded-3xl border border-slate-200/40 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 p-5 shadow-md glass space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-violet-500" />
              <span>Key Takeaways</span>
            </h3>
            
            <ul className="space-y-3">
              {tutorial.keyTakeaways.map((item, i) => (
                <li key={i} className="flex items-start text-xs text-slate-650 dark:text-slate-450 leading-relaxed">
                  <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools Callout */}
          <div className="rounded-3xl border border-blue-500/20 bg-gradient-to-br from-blue-500/5 to-violet-500/5 p-5 shadow-md glass space-y-3.5">
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-250 flex items-center gap-1">
              <Sparkles className="h-4 w-4 text-blue-500" />
              <span>Need Synopsis Help?</span>
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Use our AI Academic Companion to write complete README markdowns or generate thesis synopses for this tutorial stream.
            </p>
            <Link 
              href="/ai-tools"
              className="w-full inline-flex items-center justify-center rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs py-2.5 transition-colors cursor-pointer"
            >
              Open AI Tools
            </Link>
          </div>

        </div>

      </div>

    </div>
  )
}
