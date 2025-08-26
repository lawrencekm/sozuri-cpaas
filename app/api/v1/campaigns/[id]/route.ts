import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Params = { id: string }

// Map and whitelist only fields that exist on the Campaign model
function buildCampaignUpdateData(body: any) {
  const {
    name,
    description,
    type,
    channel, // legacy/alias for `type`
    goal,
    audience,
    contactListIds,
    filters,
    maxBudget,
    maxMessages,
    dailyLimit,
    scheduledAt,
    timezone,
    status,
    isActive,
    isArchived,
    updatedBy,
  } = body ?? {}

  const data: any = {}

  if (name !== undefined) data.name = name
  if (description !== undefined) data.description = description
  if (type !== undefined) data.type = type
  else if (channel !== undefined) data.type = channel // map legacy key
  if (goal !== undefined) data.goal = goal
  if (audience !== undefined) data.audience = audience
  if (contactListIds !== undefined && Array.isArray(contactListIds)) data.contactListIds = contactListIds
  if (filters !== undefined) data.filters = filters
  if (maxBudget !== undefined) data.maxBudget = maxBudget
  if (maxMessages !== undefined) data.maxMessages = maxMessages
  if (dailyLimit !== undefined) data.dailyLimit = dailyLimit
  if (scheduledAt !== undefined) data.scheduledAt = scheduledAt
  if (timezone !== undefined) data.timezone = timezone
  if (status !== undefined) data.status = status
  if (isActive !== undefined) data.isActive = isActive
  if (isArchived !== undefined) data.isArchived = isArchived
  if (updatedBy !== undefined) data.updatedBy = updatedBy

  return data
}

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const campaign = await prisma.campaign.findUnique({ where: { id } })
  if (!campaign) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(campaign)
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const data = buildCampaignUpdateData(body)
    const campaign = await prisma.campaign.update({ where: { id }, data })
    return NextResponse.json(campaign)
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? 'Update failed' }, { status: 400 })
  }
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  await prisma.campaign.delete({ where: { id } })
  return NextResponse.json({ deleted: true, id })
}