import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/v1/messaging/logs?projectId=&userId=&messageType=&status=&page=&limit=&search=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId') || undefined
  const userId = searchParams.get('userId') || undefined
  const messageType = searchParams.get('messageType') || undefined
  const status = searchParams.get('status') || undefined
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const skip = (page - 1) * limit

  const where: any = {
    ...(projectId ? { projectId } : {}),
    ...(userId ? { userId } : {}),
    ...(messageType ? { messageType } : {}),
    ...(status ? { status } : {}),
    ...(search ? { OR: [ { to: { contains: search } }, { from: { contains: search } }, { content: { contains: search } } ] } : {}),
  }

  const [total, logs] = await Promise.all([
    prisma.messageLog.count({ where }),
    prisma.messageLog.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({ logs, total, page, limit })
}