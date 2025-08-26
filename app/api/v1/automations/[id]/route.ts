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
  const allowed = new Set([
    'name','description','triggerType','trigger_event','triggerConfig','trigger_config','actionType','action_type','actionConfig','action_config','isActive','is_active'
  ])
  for (const k of Object.keys(body || {})) {
    if (!allowed.has(k)) continue
    if (k === 'trigger_event') data.triggerType = body[k]
    else if (k === 'action_type') data.actionType = body[k]
    else if (k === 'trigger_config') data.triggerConfig = body[k]
    else if (k === 'action_config') data.actionConfig = body[k]
    else if (k === 'is_active') data.isActive = body[k]
    else data[k] = body[k]
  }
  return data
}

// GET /api/v1/automations/:id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const automation = await prisma.automation.findUnique({ where: { id: params.id } })
  if (!automation) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(toClient(automation))
}

// PUT /api/v1/automations/:id
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const data = toPrisma(body)
  const automation = await prisma.automation.update({ where: { id: params.id }, data })
  return NextResponse.json(toClient(automation))
}

// DELETE /api/v1/automations/:id
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.automation.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}