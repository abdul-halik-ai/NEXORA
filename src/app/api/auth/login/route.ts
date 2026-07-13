import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSession, hashPassword, comparePassword, getCurrentUser } from '@/lib/auth'

export async function POST(req: Request) {
  try {
    const { email, password, name, role, college, department, year, phone } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    const testPassword = password || 'password123'
    const userRole = role || 'STUDENT'
    const userName = name || email.split('@')[0]

    // Find user safely
    let user: any = null
    try {
      user = await db.user.findUnique({
        where: { email },
      })
    } catch (dbError) {
      console.warn('Prisma DB query failed, falling back to in-memory user check')
      const { inMemUsers } = require('@/lib/auth')
      user = inMemUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
    }

    if (!user) {
      // Secure Role Check: Only existing admins can register other admin profiles
      if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
        const caller = await getCurrentUser()
        if (!caller || (caller.role !== 'ADMIN' && caller.role !== 'SUPER_ADMIN')) {
          return NextResponse.json({ error: 'Administrative privilege required to register admin accounts.' }, { status: 403 })
        }
      }
      // Auto-register for easy dev onboarding
      const passwordHash = await hashPassword(testPassword)
      try {
        user = await db.user.create({
          data: {
            email,
            name: userName,
            passwordHash,
            role: userRole,
            college: college || 'National Institute of Technology',
            department: department || 'Computer Science',
            year: year || '3rd Year',
            phone: phone || '+1234567890',
          },
        })
      } catch (dbCreateError) {
        console.warn('Prisma DB insert failed, writing to in-memory user registry')
        const { inMemUsers } = require('@/lib/auth')
        user = {
          id: `user-${Date.now()}`,
          email,
          name: userName,
          passwordHash,
          role: userRole,
          college: college || 'National Institute of Technology',
          department: department || 'Computer Science',
          year: year || '3rd Year',
          phone: phone || '+1234567890',
        }
        inMemUsers.push(user)
      }
    } else {
      // Check password
      const isMatch = await comparePassword(testPassword, user.passwordHash)
      if (!isMatch) {
        return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
      }
    }

    // Create session
    await createSession(user.id, user.email, user.role, user.name)

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    })
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json({ error: error.message || 'Authentication failed' }, { status: 500 })
  }
}
