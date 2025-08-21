import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  const integrations = await prisma.integration.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(integrations)
}

export async function POST(request: Request) {
  const body = await request.json()
  const integration = await prisma.integration.create({ data: body })
  return NextResponse.json(integration, { status: 201 })
}