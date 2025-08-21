import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({ where: { id: params.id } })
  if (!campaign) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(campaign)
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json()
  const campaign = await prisma.campaign.update({ where: { id: params.id }, data: body })
  return NextResponse.json(campaign)
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  await prisma.campaign.delete({ where: { id: params.id } })
  return NextResponse.json({ deleted: true, id: params.id })
}