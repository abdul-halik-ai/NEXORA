import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from './db'

const JWT_SECRET = process.env.JWT_SECRET || 'projecthub-secret-key-for-jwt-signing'
const COOKIE_NAME = 'projecthub_session'

export interface JWTPayload {
  userId: string
  email: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN'
  name: string
}

// Generate default mock password hashes on startup
const STUDENT_PASSWORD_HASH = bcrypt.hashSync('password123', 10)
const ADMIN_PASSWORD_HASH = bcrypt.hashSync('adminPassword123', 10)

export const inMemUsers = [
  {
    id: 'user-student-id',
    email: 'student@gmail.com',
    passwordHash: STUDENT_PASSWORD_HASH,
    name: 'Academic Student',
    role: 'STUDENT' as const,
    college: 'National Institute of Technology',
    department: 'Computer Science',
    year: '3rd Year',
    phone: '+91 99999 88888',
    createdAt: new Date()
  },
  {
    id: 'user-admin-id',
    email: 'admin@gmail.com',
    passwordHash: ADMIN_PASSWORD_HASH,
    name: 'Admin Desk Staff',
    role: 'ADMIN' as const,
    permissions: ['manage_projects', 'manage_payments'],
    createdAt: new Date()
  }
]

// Get the current user server-side
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) return null

    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload
    
    // Safely query user from DB, falling back to local list if DB is offline
    try {
      const user = await db.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          college: true,
          department: true,
          year: true,
          phone: true,
          createdAt: true,
        },
      })
      if (user) return user
    } catch (dbError) {
      console.warn('Prisma DB offline, falling back to in-memory user lookup')
    }

    const fallbackUser = inMemUsers.find(u => u.id === payload.userId)
    if (fallbackUser) {
      const { passwordHash, ...userWithoutPassword } = fallbackUser
      return userWithoutPassword
    }

    return null
  } catch (error) {
    return null
  }
}

// Check if user is Admin
export async function isAdmin() {
  const user = await getCurrentUser()
  return user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN'
}

// Generate token and set HTTP-only cookie
export async function createSession(userId: string, email: string, role: 'STUDENT' | 'MENTOR' | 'ADMIN' | 'SUPER_ADMIN', name: string) {
  const payload: JWTPayload = { userId, email, role, name }
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
  
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  })
}

// Destroy session
export async function destroySession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    maxAge: 0,
    path: '/',
  })
}

// Helper to hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

// Helper to compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}
