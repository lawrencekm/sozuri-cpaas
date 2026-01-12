import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { messageQueue } = await import('@/lib/queues/message-queue')
    const [counts, repeatable, workers] = await Promise.all([
      messageQueue.getJobCounts('waiting','active','completed','failed','delayed'),
      messageQueue.getRepeatableJobs(),
      messageQueue.getWorkers(),
    ])
    return NextResponse.json({ ok: true, counts, repeatable, workers })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'queue metrics error' }, { status: 500 })
  }
}