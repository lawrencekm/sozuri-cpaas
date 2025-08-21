import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 })
  }
  const { searchParams } = new URL(request.url)
  const level = searchParams.get('level') || undefined
  const userId = searchParams.get('userId') || undefined
  const where: any = { ...(level ? { level } : {}), ...(userId ? { userId } : {}) }
  const logs = await prisma.logEntry.findMany({ where, orderBy: { createdAt: 'desc' }, take: 200 })
  return NextResponse.json({ logs })
}