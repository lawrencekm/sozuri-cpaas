import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

// GET /api/v1/contacts?projectId=&page=&limit=
export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId') || undefined
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const skip = (page - 1) * limit

  const where = projectId ? { projectId } : {}

  const [total, contacts] = await Promise.all([
    prisma.contact.count({ where }),
    prisma.contact.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({ contacts, total, page, limit })
}

// POST /api/v1/contacts
export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const contact = await prisma.contact.create({ data: body })
  return NextResponse.json(contact, { status: 201 })
}