import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET /api/v1/users/logs?userId=&level=&page=&limit=&startDate=&endDate=&search=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get('userId') || undefined
  const level = searchParams.get('level') || undefined
  const startDate = searchParams.get('startDate')
  const endDate = searchParams.get('endDate')
  const search = searchParams.get('search') || undefined
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
  const skip = (page - 1) * limit

  const where: any = {
    ...(userId ? { userId } : {}),
    ...(level ? { level } : {}),
    ...(startDate || endDate ? {
      createdAt: {
        ...(startDate ? { gte: new Date(startDate) } : {}),
        ...(endDate ? { lte: new Date(endDate) } : {}),
      }
    } : {}),
    ...(search ? { OR: [ { message: { contains: search } } ] } : {}),
  }

  const [total, logs] = await Promise.all([
    prisma.logEntry.count({ where }),
    prisma.logEntry.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
  ])

  return NextResponse.json({ logs, total, page, limit })
}