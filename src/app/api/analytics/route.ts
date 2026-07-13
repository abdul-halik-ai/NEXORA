import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function GET() {
  try {
    const analytics = await services.getAnalytics()
    return NextResponse.json({ analytics })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
