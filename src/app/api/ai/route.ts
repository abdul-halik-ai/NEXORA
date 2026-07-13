import { NextResponse } from 'next/server'
import { generateAIContent } from '@/lib/aiHelper'

export async function POST(req: Request) {
  try {
    const { tool, prompt } = await req.json()

    if (!tool || !prompt) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const result = await generateAIContent(tool, prompt)
    return NextResponse.json({ result })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
