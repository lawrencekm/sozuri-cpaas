import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { cacheDel, withCache, buildKey } from '@/lib/cache'

const prisma = new PrismaClient()

// POST /api/v1/messaging -> enqueue or store SMS request into MessageLog (basic)
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const { projectId, userId = session.user.id, to, from = 'SOZURI', content, messageType = 'sms' } = body

  if (!projectId || !to || !content) {
    return NextResponse.json({ message: 'projectId, to, content are required' }, { status: 400 })
  }

  const log = await prisma.messageLog.create({
    data: {
      projectId,
      userId,
      to,
      from,
      content,
      messageType,
      status: 'pending',
    },
  })

  // Invalidate recent logs cache for this project
  const listKey = buildKey(['messaging','logs','recent', projectId || 'all'])
  await cacheDel(listKey)

  return NextResponse.json({ status: 'queued', id: log.id })
}

// Simple GET: list recent messages
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId') || 'all'
  const listKey = buildKey(['messaging','logs','recent', projectId])

  const logs = await withCache(listKey, async () => {
    return prisma.messageLog.findMany({
      where: { ...(projectId !== 'all' ? { projectId } : {}) },
      orderBy: { createdAt: 'desc' },
      take: 50,
    })
  }, { ttlSeconds: 10 })

  return NextResponse.json({ logs })
}