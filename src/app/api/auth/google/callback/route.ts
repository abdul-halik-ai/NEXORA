import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { createSession, hashPassword } from '@/lib/auth'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (!code) {
    return NextResponse.redirect(new URL('/login?error=oauth_cancelled', request.url))
  }

  const clientId = process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  const host = request.headers.get('host') || 'localhost:3000'
  const protocol = host.startsWith('localhost') || host.startsWith('127.0.0.1') ? 'http' : 'https'
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`

  try {
    // 1. Exchange authorization code for token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId!,
        client_secret: clientSecret!,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      })
    })

    if (!tokenResponse.ok) {
      const err = await tokenResponse.json()
      console.error('Google token exchange error:', err)
      return NextResponse.redirect(new URL('/login?error=token_exchange_failed', request.url))
    }

    const { access_token } = await tokenResponse.json()

    // 2. Fetch profile info
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` }
    })

    if (!userResponse.ok) {
      return NextResponse.redirect(new URL('/login?error=user_info_failed', request.url))
    }

    const googleUser = await userResponse.json()
    const { email, name, picture } = googleUser

    if (!email) {
      return NextResponse.redirect(new URL('/login?error=email_missing', request.url))
    }

    // 3. Find or register the user
    let user: any = null
    try {
      user = await db.user.findUnique({ where: { email } })
    } catch (dbError) {
      const { inMemUsers } = require('@/lib/auth')
      user = inMemUsers.find((u: any) => u.email.toLowerCase() === email.toLowerCase())
    }

    if (!user) {
      const mockPassword = await hashPassword(`google-${Date.now()}`)
      try {
        user = await db.user.create({
          data: {
            email,
            name: name || email.split('@')[0],
            passwordHash: mockPassword,
            role: 'STUDENT',
            avatar: picture || null,
            college: 'National Institute of Technology',
            department: 'Computer Science',
            year: '3rd Year',
            phone: '+91 99999 88888',
          }
        })
      } catch (createError) {
        const { inMemUsers } = require('@/lib/auth')
        user = {
          id: `google-user-${Date.now()}`,
          email,
          name: name || email.split('@')[0],
          passwordHash: mockPassword,
          role: 'STUDENT',
          avatar: picture || null,
          college: 'National Institute of Technology',
          department: 'Computer Science',
          year: '3rd Year',
          phone: '+91 99999 88888',
        }
        inMemUsers.push(user)
      }
    }

    // 4. Bind session properties
    await createSession(user.id, user.email, user.role, user.name)

    // 5. Success redirect
    return NextResponse.redirect(new URL('/dashboard', request.url))

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=oauth_internal_error', request.url))
  }
}
