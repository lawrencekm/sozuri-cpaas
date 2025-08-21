import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({ where: { id: params.id } })
  if (!project) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const project = await prisma.project.update({ where: { id: params.id }, data: body })
  return NextResponse.json(project)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.project.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}