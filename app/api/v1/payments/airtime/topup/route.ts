import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/v1/payments/airtime/topup
// Body: { projectId, userId, topupProductId, amount, creditsAmount, currency? }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { projectId, topupProductId, amount, creditsAmount, currency = 'KES' } = body
  if (!projectId || !topupProductId || !amount || !creditsAmount) {
    return NextResponse.json({ message: 'projectId, topupProductId, amount, creditsAmount required' }, { status: 400 })
  }

  const topup = await prisma.topup.create({
    data: {
      projectId,
      topupProductId,
      amount,
      creditsAmount,
      currency,
      status: 'pending',
    }
  })

  // TODO: link to Transaction and payment flow
  return NextResponse.json({ status: 'pending', topup })
}

export async function GET() {
  const topups = await prisma.topup.findMany({ orderBy: { createdAt: 'desc' }, take: 50 })
  return NextResponse.json({ topups })
}