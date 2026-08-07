import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const user = await getCurrentUser()
  return NextResponse.json({ user })
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { phone, college, department, year } = body

    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        phone,
        college,
        department,
        year
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        college: true,
        department: true,
        year: true,
        phone: true
      }
    })

    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}
