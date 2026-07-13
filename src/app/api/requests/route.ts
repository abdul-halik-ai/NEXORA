import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email') || undefined

  try {
    const requests = await services.getRequests(email)
    return NextResponse.json({ requests })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
