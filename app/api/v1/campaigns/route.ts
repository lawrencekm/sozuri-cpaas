import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status') || undefined
  const channel = searchParams.get('channel') || undefined

  const campaigns = await prisma.campaign.findMany({
    where: {
      ...(status ? { status } as any : {}),
      ...(channel ? { type: channel } : {}),
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(campaigns)
}

export async function POST(request: Request) {
  try {
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