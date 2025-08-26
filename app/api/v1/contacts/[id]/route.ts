import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

type Params = { id: string }

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const contact = await prisma.contact.findUnique({ where: { id } })
  if (!contact) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  const body = await request.json()
  const contact = await prisma.contact.update({ where: { id }, data: body })
  return NextResponse.json(contact)
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const { id } = await params
  await prisma.contact.delete({ where: { id } })
  return NextResponse.json({ deleted: true, id })
}