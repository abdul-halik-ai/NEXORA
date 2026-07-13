import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function GET() {
  try {
    const categories = await services.getCategories()
    return NextResponse.json({ categories })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
