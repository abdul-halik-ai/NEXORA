import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'Google OAuth Client ID is not configured in .env' }, { status: 400 })
  }

  const redirectUri = `${request.nextUrl.origin}/api/auth/google/callback`

  const targetUrl = 
    `https://accounts.google.com/o/oauth2/v2/auth?` + 
    `client_id=${clientId}&` +
    `redirect_uri=${encodeURIComponent(redirectUri)}&` +
    `response_type=code&` +
    `scope=email%20profile`

  return NextResponse.redirect(targetUrl)
}
