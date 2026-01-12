import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Params = { id: string }

function toClient(t: any) {
  return {
    id: t.id,
    project_id: t.projectId,
    name: t.name,
    channel: t.messageType,
    type: t.category,
    content: t.content,
    variables: t.variables ?? [],
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }
}

function toPrisma(body: any) {
  const messageType = body.messageType ?? body.channel
  const category = body.category ?? body.type
  const data: any = {}
  const allowed = new Set([
    'name','description','subject','content','variables','language','isValidated','validationErrors','isActive','isArchived','updatedBy'
  ])
  for (const k of Object.keys(body || {})) {
    if (allowed.has(k)) data[k] = body[k]
  }
  if (messageType !== undefined) data.messageType = messageType
  if (category !== undefined) data.category = category
  return data
}

// GET /api/v1/templates/:id
export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const template = await prisma.template.findUnique({ where: { id } })
  if (!template) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(toClient(template))
}

// PUT /api/v1/templates/:id
export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const body = await request.json()
  const data = toPrisma(body)
  const template = await prisma.template.update({ where: { id }, data })
  return NextResponse.json(toClient(template))
}

// DELETE /api/v1/templates/:id
export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  await prisma.template.delete({ where: { id } })
  return NextResponse.json({ deleted: true, id })
}