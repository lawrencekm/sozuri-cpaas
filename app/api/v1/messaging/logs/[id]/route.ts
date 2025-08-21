import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const log = await prisma.messageLog.findUnique({ where: { id: params.id } })
  if (!log) return NextResponse.json({ message: 'Not found' }, { status: 404 })
  return NextResponse.json(log)
}