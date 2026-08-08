import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'nexora_session'

// Lightweight base64 decode to make it Edge Runtime compatible without external modules
function decodeJWT(token: string) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAME)?.value
  const { pathname } = request.nextUrl

  // 1. Protected Admin Routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const payload = decodeJWT(token)
    if (!payload || (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN')) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }
  }

  // 2. Protected Student Dashboards
  if (pathname.startsWith('/dashboard')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    const payload = decodeJWT(token)
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // 3. Protected Content (Project Details, Marketplace Items, Learning Tools, AI)
  const isProtectedContent = 
    (pathname.startsWith('/projects/') && pathname !== '/projects') ||
    (pathname.startsWith('/marketplace/') && pathname !== '/marketplace') ||
    pathname.startsWith('/learning') ||
    pathname.startsWith('/ai-tools');

  if (isProtectedContent) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

// Intercept only protected areas to keep static layouts and public APIs extremely fast
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/admin/:path*',
    '/projects/:path*',
    '/marketplace/:path*',
    '/learning/:path*',
    '/ai-tools/:path*'
  ],
}
