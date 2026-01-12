import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { connection, messageQueue } = await import('@/lib/queues/message-queue')
    const ping = await connection.ping()
    const counts = await messageQueue.getJobCounts('waiting','active','completed','failed','delayed')
    return NextResponse.json({ ok: true, redis: ping, counts })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'queue health error' }, { status: 500 })
  }
}