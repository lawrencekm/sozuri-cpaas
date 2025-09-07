import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const channel = searchParams.get('channel') || undefined
  const projectId = searchParams.get('projectId') || undefined

  // Get user's projects to filter campaigns
  const userProjects = await prisma.project.findMany({
    where: { userId: session.user.id },
    select: { id: true }
  })
  
  const projectIds = userProjects.map(p => p.id)
  
  if (projectIds.length === 0) {
    return NextResponse.json([])
  }

  const campaigns = await prisma.campaign.findMany({
    where: {
      projectId: projectId ? projectId : { in: projectIds }, // Filter by user's projects
      ...(status ? { status } as any : {}),
      ...(channel ? { type: channel } as any : {}),
    },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      projectId: true,
      name: true,
      description: true,
      type: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      totalSent: true,
      totalDelivered: true,
      totalFailed: true
    }
  })

  // Return standardized response format
  return NextResponse.json(campaigns)
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Map legacy/front-end field `channel` -> Prisma field `type` and whitelist fields
    const { channel, ...rest } = body || {}
    const data: any = {
      ...rest,
      ...(channel ? { type: channel } : {}),
    }

    // Ensure required scalar lists have safe defaults
    if (data.contactListIds === undefined) data.contactListIds = []

    // Allow only fields defined on Campaign model to avoid Prisma unknown-arg errors
    const allowedKeys = new Set([
      'id', 'projectId', 'name', 'description', 'type', 'goal', 'audience', 'contactListIds', 'filters',
      'maxBudget', 'maxMessages', 'dailyLimit', 'scheduledAt', 'timezone', 'status', 'totalSent',
      'totalDelivered', 'totalFailed', 'totalCost', 'isActive', 'isArchived', 'createdBy', 'updatedBy',
      'createdAt', 'updatedAt'
    ])
    const cleaned: any = {}
    for (const key of Object.keys(data)) {
      if (allowedKeys.has(key)) cleaned[key] = data[key]
    }

    // Basic validation
    if (!cleaned?.projectId || typeof cleaned.projectId !== 'string' || !cleaned.projectId.trim()) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }
    if (!cleaned?.name || typeof cleaned.name !== 'string' || !cleaned.name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    // Verify project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: cleaned.projectId,
        userId: session.user.id
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 403 })
    }

    // Add user context to campaign
    cleaned.createdBy = session.user.id

    const campaign = await prisma.campaign.create({ data: cleaned })
    return NextResponse.json(campaign, { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to create campaign', details: err?.message },
      { status: 500 }
    )
  }
}