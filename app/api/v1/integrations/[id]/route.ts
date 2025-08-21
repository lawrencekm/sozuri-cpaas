import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const integration = await prisma.integration.findUnique({ where: { id: params.id } })
  if (!integration) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(integration)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const integration = await prisma.integration.update({ where: { id: params.id }, data: body })
  return NextResponse.json(integration)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.integration.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}