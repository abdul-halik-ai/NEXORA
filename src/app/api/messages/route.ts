import { NextResponse } from 'next/server'
import * as services from '@/lib/services'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const senderId = searchParams.get('senderId')

  if (!senderId) {
    // Admin checking all messages
    const messages = await services.getAllMessages()
    return NextResponse.json({ messages })
  }

  const messages = await services.getMessages(senderId)
  return NextResponse.json({ messages })
}

export async function POST(req: Request) {
  try {
    const { senderId, senderName, text, isFromAdmin, receiverId } = await req.json()

    if (!senderId || !text) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    const message = await services.sendMessage(senderId, senderName, text, isFromAdmin, receiverId)
    return NextResponse.json({ success: true, message })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
