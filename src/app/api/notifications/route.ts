import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import * as services from '@/lib/services'

export async function GET() {
  const user = await getCurrentUser()
  if (!user) {
    return NextResponse.json({ notifications: [] })
  }

  const notifications = await services.getNotifications(user.id)
  return NextResponse.json({ notifications })
}
