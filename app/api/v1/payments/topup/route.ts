import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/v1/payments/topup
// Body: { projectId, amount, creditsAmount, currency?, method?, topupProductId }
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))
  const { projectId, amount, creditsAmount, currency = 'KES', method, topupProductId } = body || {}

  if (!projectId || !amount || !creditsAmount || !topupProductId) {
    return NextResponse.json({ 
      message: 'projectId, amount, creditsAmount, and topupProductId are required' 
    }, { status: 400 })
  }

  const data = {
    projectId,
    amount,
    creditsAmount,
    currency,
    topupProductId,
    status: 'pending' as const,
    ...(method ? { method } : {})
  }

  const topup = await prisma.topup.create({ data })

  // For M-Pesa only: in real flow, initiate STK and set providerRef, then await callback
  return NextResponse.json({ status: 'pending', topup })
}