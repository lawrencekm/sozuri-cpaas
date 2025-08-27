import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/v1/payments/billing/summary?projectId=...
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const projectId = searchParams.get('projectId')
  if (!projectId) return NextResponse.json({ message: 'projectId required' }, { status: 400 })

  // Compute balance from transactions (credit - debit)
  const txs = await prisma.transaction.findMany({
    where: { projectId, status: 'completed' },
    select: {
      amount: true,
      currency: true,
      transactionType: {
        select: {
          name: true
        }
      }
    },
  })

  const currency = txs[0]?.currency ?? 'KES'
  const balance = txs.reduce((sum, t) => sum + (t.transactionType.name === 'credit' ? Number(t.amount) : -Number(t.amount)), 0)

  return NextResponse.json({
    balance,
    currency,
    billingCycle: 'Monthly',
    nextInvoiceDate: null,
    currentUsage: 0,
    paymentMethods: [],
  })
}