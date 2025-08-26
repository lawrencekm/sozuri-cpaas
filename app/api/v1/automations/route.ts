import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function toClient(a: any) {
  return {
    id: a.id,
    project_id: a.projectId,
    user_id: a.userId,
    name: a.name,
    description: a.description,
    trigger_event: a.triggerType,
    // expose trigger config and action config if needed by client
    trigger_config: a.triggerConfig,
    action_type: a.actionType,
    action_config: a.actionConfig,
    is_active: a.isActive,
    last_triggered: a.lastTriggered,
    execution_count: a.executionCount,
    created_at: a.createdAt,
    updated_at: a.updatedAt,
  }
}

function toPrisma(body: any) {
  const data: any = {}
  // Accept both client and prisma shapes
  data.projectId = body.projectId ?? body.project_id
  data.userId = body.userId ?? body.user_id
  data.name = body.name
  data.description = body.description
  data.triggerType = body.triggerType ?? body.trigger_event
  data.triggerConfig = body.triggerConfig ?? body.trigger_config ?? {}
  data.actionType = body.actionType ?? body.action_type
  data.actionConfig = body.actionConfig ?? body.action_config ?? {}
  if (body.isActive !== undefined) data.isActive = body.isActive
  if (body.is_active !== undefined) data.isActive = body.is_active
  return data
}

// GET /api/v1/automations?project_id=...&isActive=true
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id') || undefined
  const isActiveParam = searchParams.get('isActive') ?? searchParams.get('is_active')

  const where: any = {}
  if (projectId) where.projectId = projectId
  if (isActiveParam !== null) where.isActive = isActiveParam === 'true'

  const automations = await prisma.automation.findMany({
    where,
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(automations.map(toClient))
}

// POST /api/v1/automations
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = toPrisma(body)

    // Basic validation
    if (!data?.projectId || typeof data.projectId !== 'string' || !data.projectId.trim()) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }
    if (!data?.userId || typeof data.userId !== 'string' || !data.userId.trim()) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }
    if (!data?.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    if (!data?.triggerType || typeof data.triggerType !== 'string') {
      return NextResponse.json({ error: 'triggerType is required' }, { status: 400 })
    }
    if (!data?.actionType || typeof data.actionType !== 'string') {
      return NextResponse.json({ error: 'actionType is required' }, { status: 400 })
    }

    const automation = await prisma.automation.create({ data })
    return NextResponse.json(toClient(automation), { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to create automation', details: err?.message },
      { status: 500 }
    )
  }
}