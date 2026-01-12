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
  const userId = searchParams.get('user_id') || undefined
  const where: any = userId ? { userId } : {}
  const projects = await prisma.project.findMany({ where, orderBy: { createdAt: 'desc' } })

  // Align with client expectation: { projects, total, page, limit }
  return NextResponse.json({
    projects,
    total: projects.length,
    page: 1,
    limit: projects.length,
  })
}