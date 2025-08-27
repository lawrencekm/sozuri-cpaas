import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST /api/v1/payments/mpesa/handle
// Accepts raw M-Pesa callback payload; persists MpesaTransaction and creates credit Transaction on success
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}))

  // Try to map common STK callback fields; fallback to raw
  const stk = (body as any)?.Body?.stkCallback
  const amount = stk?.CallbackMetadata?.Item?.find?.((i: any) => i?.Name === 'Amount')?.Value
  const mpesaReceipt = stk?.CallbackMetadata?.Item?.find?.((i: any) => i?.Name === 'MpesaReceiptNumber')?.Value
  const phoneNumber = stk?.CallbackMetadata?.Item?.find?.((i: any) => i?.Name === 'PhoneNumber')?.Value
  const resultCode = stk?.ResultCode?.toString?.()
  const resultDesc = stk?.ResultDesc
  const merchantRequestId = stk?.MerchantRequestID
  const checkoutRequestId = stk?.CheckoutRequestID

  // Prefer explicit projectId; otherwise unknown-project (you may enrich this later)
  const projectId = (body as any)?.projectId || 'unknown-project'

  const status = resultCode === '0' ? 'completed' : 'failed'
  const tx = await prisma.mpesaTransaction.create({
    data: {
      projectId,
      transactionType: 'STK_PUSH',
      transactionId: mpesaReceipt || merchantRequestId || checkoutRequestId || `stk_${Date.now()}`,
      transactionTime: new Date(),
      amount: amount ?? 0,
      phoneNumber: phoneNumber?.toString?.() || 'unknown',
      resultCode: resultCode,
      resultDescription: resultDesc,
      merchantRequestId,
      checkoutRequestId,
      rawData: body,
      status,
    }
  })

  // 1:1 credits for successful M-Pesa payments -> create a credit Transaction
  if (status === 'completed' && projectId !== 'unknown-project' && amount) {
    await prisma.transaction.create({
      data: {
        projectId,
        transactionTypeId: 'credit',
        userId: 'UNKNOWN_USER', // Required field based on schema
        amount: amount,
        currency: 'KES',
        reference: tx.transactionId,
        description: 'M-Pesa top-up',
        status: 'completed',
      }
    })
  }

  return NextResponse.json({ status: 'ok', id: tx.id })
}