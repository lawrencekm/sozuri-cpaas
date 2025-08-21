import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const contact = await prisma.contact.findUnique({ where: { id: params.id } })
  if (!contact) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(contact)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  const body = await request.json()
  const contact = await prisma.contact.update({ where: { id: params.id }, data: body })
  return NextResponse.json(contact)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })
  await prisma.contact.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}