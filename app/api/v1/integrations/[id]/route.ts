import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Params = { id: string }

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const integration = await prisma.integration.findUnique({ where: { id } })
  if (!integration) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(integration)
}

export async function PUT(request: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const body = await request.json()
  const integration = await prisma.integration.update({ where: { id }, data: body })
  return NextResponse.json(integration)
}

export async function DELETE(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  await prisma.integration.delete({ where: { id } })
  return NextResponse.json({ deleted: true, id })
}