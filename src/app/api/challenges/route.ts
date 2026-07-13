import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getChallenges, saveChallenge } from '@/lib/services'

export async function GET() {
  try {
    const list = await getChallenges()
    return NextResponse.json({ challenges: list })
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to retrieve challenges' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
      return NextResponse.json({ error: 'Administrative access required' }, { status: 403 })
    }

    const body = await request.json()
    const { title, difficulty, points, description, constraints, template, testCases, verifyCodeRegex } = body

    if (!title || !description || !template) {
      return NextResponse.json({ error: 'Missing challenge variables' }, { status: 400 })
    }

    const success = await saveChallenge({
      title,
      difficulty: difficulty || 'EASY',
      points: points || 100,
      description,
      constraints: typeof constraints === 'string' ? constraints.split('\n').filter(Boolean) : constraints,
      template,
      testCases: typeof testCases === 'string' ? JSON.parse(testCases) : testCases,
      verifyCodeRegex: verifyCodeRegex || 'return'
    })

    if (success) {
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'Failed to write challenge file to disk' }, { status: 500 })

  } catch (error: any) {
    console.error(error)
    return NextResponse.json({ error: error.message || 'Internal challenge saving error' }, { status: 500 })
  }
}
