import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// POST /api/v1/payments/mpesa/handle
// Accepts raw M-Pesa callback payload; persists MpesaTransaction
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

  // Required minimal fields; projectId ideally supplied by your earlier request reference or header
  const projectId = (body as any)?.projectId || 'unknown-project'

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
      status: resultCode === '0' ? 'completed' : 'failed',
    }
  })

  return NextResponse.json({ status: 'ok', id: tx.id })
}