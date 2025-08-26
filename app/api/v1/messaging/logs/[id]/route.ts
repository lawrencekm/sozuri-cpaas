import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

type Params = { id: string }

export async function GET(_: Request, { params }: { params: Promise<Params> }) {
  const { id } = await params
  const log = await prisma.messageLog.findUnique({ where: { id } })
  if (!log) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(log)
}