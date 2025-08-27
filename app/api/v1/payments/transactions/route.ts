import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/v1/payments/transactions?projectId=...&page=1&limit=10
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  const page = Number(searchParams.get('page') || '1')
  const limit = Number(searchParams.get('limit') || '10')
  if (!projectId) return NextResponse.json({ message: 'projectId required' }, { status: 400 })

  const where = { projectId }
  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where }),
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ])

  return NextResponse.json({
    transactions,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  })
}