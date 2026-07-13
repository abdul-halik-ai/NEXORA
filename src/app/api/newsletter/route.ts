import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Trigger notification mock
    await services.createNotification(
      'default-student-id', 
      'Newsletter Subscribed', 
      `Successfully registered email ${email} for the ProjectHub academic bulletin.`
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
