import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const project = await prisma.project.findFirst({
    where: { id: params.id, userId: session.user.id },
    include: {
      _count: { select: { campaigns: true, messageLogs: true } },
      campaigns: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  })
  if (!project) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const allowedKeys = new Set([
    'name', 'description', 'code', 'timezone', 'currency', 'defaultSenderId', 'webhookUrl', 'webhookSecret',
    'isTrial', 'trialExpiresAt', 'accountType', 'details', 'isActive', 'isArchived', 'suspensionReason'
  ])
  const data: any = {}
  for (const key of Object.keys(body || {})) {
    if (allowedKeys.has(key)) data[key] = body[key]
  }

  const project = await prisma.project.update({
    where: { id: params.id },
    data,
  })
  return NextResponse.json(project)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Ensure ownership before delete
  const existing = await prisma.project.findFirst({ where: { id: params.id, userId: session.user.id } })
  if (!existing) return NextResponse.json({ message: 'Not found' }, { status: 404 })

  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}