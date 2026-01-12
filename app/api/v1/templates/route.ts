import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function toClient(t: any) {
  return {
    id: t.id,
    project_id: t.projectId,
    name: t.name,
    channel: t.messageType, // sms | whatsapp | email
    type: t.category,       // marketing | transactional | notification
    content: t.content,
    variables: t.variables ?? [],
    created_at: t.createdAt,
    updated_at: t.updatedAt,
  }
}

function toPrisma(body: any) {
  // Accept both client-shape and prisma-shape
  const projectId = body.projectId ?? body.project_id
  const messageType = body.messageType ?? body.channel
  const category = body.category ?? body.type

  const data: any = {
    projectId,
    name: body.name,
    description: body.description,
    messageType,
    subject: body.subject,
    content: body.content,
    variables: body.variables ?? [],
    category,
    language: body.language ?? 'en',
    isValidated: body.isValidated ?? false,
    validationErrors: body.validationErrors ?? [],
    isActive: body.isActive ?? true,
    isArchived: body.isArchived ?? false,
    createdBy: body.createdBy,
    updatedBy: body.updatedBy,
  }
  return data
}

// GET /api/v1/templates?project_id=...&messageType=&category=&search=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('project_id') || undefined
  const messageType = searchParams.get('messageType') || searchParams.get('channel') || undefined
  const category = searchParams.get('category') || searchParams.get('type') || undefined
  const search = searchParams.get('search') || undefined

  const where: any = {}
  if (projectId) where.projectId = projectId
  if (messageType) where.messageType = messageType
  if (category) where.category = category
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ]
  }

  const templates = await prisma.template.findMany({
    where,
    orderBy: { updatedAt: 'desc' }
  })
  return NextResponse.json(templates.map(toClient))
}

// POST /api/v1/templates
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = toPrisma(body)

    // Basic validation
    if (!data?.projectId || typeof data.projectId !== 'string' || !data.projectId.trim()) {
      return NextResponse.json({ error: 'projectId is required' }, { status: 400 })
    }
    if (!data?.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }
    if (!data?.content || typeof data.content !== 'string' || !data.content.trim()) {
      return NextResponse.json({ error: 'content is required' }, { status: 400 })
    }

    const template = await prisma.template.create({ data })
    return NextResponse.json(toClient(template), { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json(
      { error: 'Failed to create template', details: err?.message },
      { status: 500 }
    )
  }
}