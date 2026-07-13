# ProjectHub 🎓

ProjectHub is a premium, modern, responsive, and scalable web application built with **Next.js 15 (App Router)** designed to help school, engineering, arts & science, and college students find free projects, request custom creations, and prepare with academic resource materials.

## 🛠 Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, Framer Motion, Lucide Icons
- **Backend & Database ORM**: Next.js Server Actions, Route Handlers, Prisma ORM
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel

---

## 🚀 Key Features

### For Students
1. **Browse Projects**: Advanced search, filtering by domain stream (category), complexity (difficulty), and sorting orders.
2. **Download Deliverables**: Access free source codes (zip files) and formatted IEEE synopsis/project reports.
3. **Demo Playback**: Watch video explanations of running projects.
4. **Custom Requests**: Multi-step request submission form specifying target deadline, tech, budget, and syllabus documents.
5. **Support Chat**: Floating helpdesk widget simulating live conversations with coordinators.
6. **Study Hub**: Interactive Roadmaps, Placement questions, DSA notes, resume templates, and revision materials.
7. **AI Tools Companion**:
   - Project Idea Generator (gives tailored topics and summaries)
   - README & Documentation Generator (outputs markdown guides)
   - Code Explainer & Bug Analyzer (line-by-line breakdown)
   - Viva Voce Questions Generator (top examiner questions)
8. **Premium E-Commerce Marketplace**: Purchase premium source codes, Gerber layout schematics, and study ebooks with dynamic coupon validations (`STUDENT50`, `WELCOME10`).
9. **AI Viva Voce Simulator**: Interactive mock presentation evaluator utilizing **Text-To-Speech (TTS)** voice readouts, **Speech Recognition (STT)** oral inputs, and visual competency rubric scores.
10. **High-Security Coding Sandbox**: Isolation sandbox container that tracks window lost events (`window.onblur`) to prevent cheating, logging compilation metrics and priority queue Dijkstra tests.
11. **Dynamic Tutorial Reader**: Dynamic article reader for DSA, Solidity contracts, and ML deployments with progress checkmarks and celebration alerts.

### For Admins
1. **Analytics Dashboard**: Dynamic timelines representing revenue, downloads, and students.
2. **Project Manager**: CRUD uploading, editing, and deleting project listings.
3. **Request Approval Workflows & Milestones**: Approve, reject, and configure custom development milestones.
4. **Chat Support Console**: Manage student tickets, respond directly to messages, and view audit trail logs.
5. **Billing Invoices Registry**: View billing sheets, coupon codes utilization, and payment methods.

---

## 📁 Repository Directory Structure

```
├── prisma/
│   ├── schema.prisma   # PostgreSQL models
│   ├── schema.sql      # Raw SQL schema for direct Supabase copying
│   └── seed.ts         # TypeScript database seeder script
├── src/
│   ├── app/
│   │   ├── api/        # Auth, projects, messages, and AI endpoints
│   │   ├── projects/   # Catalog and Details pages
│   │   ├── request/    # Custom project requirements form
│   │   ├── learning/   # Roadmap guides & study papers
│   │   ├── ai-tools/   # Idea, readme, and viva Q&A generators
│   │   ├── dashboard/  # Student profile wishlist
│   │   ├── admin/      # Management dashboards & Analytics
│   │   ├── layout.tsx  # Root wrapper with Auth context and Navbar/Footer
│   │   └── globals.css # Theme styles and glassmorphism presets
│   ├── components/     # Navbar, Footer, ProjectCard, SupportChat, Details
│   ├── context/        # Client AuthContext
│   └── lib/
│     ├── db.ts         # Prisma client singleton
│     ├── auth.ts       # Secure cookie JWT session helper
│     ├── services.ts   # Database services with In-Memory fallbacks
│     ├── mockData.ts   # Seed datasets
│     └── aiHelper.ts   # AI Generator connector & simulations
├── .env.example        # Environment layout
├── package.json        # Dependencies list
└── README.md           # Documentation guide
```

---

## ⚙ Development Setup

### 1. Configure Environment Variables
Create a `.env` file in the root folder (using `.env.example` as a template):
```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/db"
JWT_SECRET="generate-a-secure-random-32-character-secret-key-here"
GEMINI_API_KEY="AIzaSyYourGeminiAPIKey"
```

### 2. Install Packages
Ensure Node.js is installed, then run:
```bash
npm install --legacy-peer-deps
```

### 3. Initialize Prisma (Optional)
If you have a PostgreSQL or Supabase instance running:
```bash
npx prisma db push
npx prisma db seed
```
*Note: If no database URL is supplied, the application automatically catches the connection failure and falls back gracefully to a fully functional In-Memory data store, allowing you to run and test all functions instantly.*

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔒 Test Login Accounts

You can test both user flows immediately on the login page:

- **Student Login**: `student@gmail.com` | Password: `password123`
- **Admin Login**: `admin@gmail.com` | Password: `password123`
*(Typing any new email auto-registers a student account for painless onboarding).*

---

## 🌐 Production Deployment

1. Initialize a Git repository, commit the files, and push to GitHub.
2. Link your repository to a new project in the **Vercel Dashboard**.
3. Supply the Environment Variables (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`) in the project settings.
4. Click **Deploy**. Vercel will compile the Next.js static layouts and API endpoints.
