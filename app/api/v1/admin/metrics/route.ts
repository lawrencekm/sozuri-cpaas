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
  const type = searchParams.get('type') || 'overview'
  const timeframe = searchParams.get('timeframe') || '24h'

  const [users, projects, contacts, campaigns, messages] = await Promise.all([
    prisma.user.count(),
    prisma.project.count(),
    prisma.contact.count(),
    prisma.campaign.count(),
    prisma.messageLog.count(),
  ])

  return NextResponse.json({ type, timeframe, totals: { users, projects, contacts, campaigns, messages } })
}