import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

type Params = { id: string }

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'admin') {
    return false
  }
  return true
}

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(user)
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  const { id } = await params
  const body = await request.json()
  const user = await prisma.user.update({ where: { id }, data: body })
  return NextResponse.json(user)
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  if (!(await requireAdmin())) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  const { id } = await params
  await prisma.user.delete({ where: { id } })
  return NextResponse.json({ deleted: true, id })
}