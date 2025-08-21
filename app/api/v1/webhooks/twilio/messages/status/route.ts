import { NextResponse } from 'next/server'

// Legacy: POST /v1/tw/messages/status -> WhatsappmessageController@statusupdate
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'ack', provider: 'twilio', route: '/api/v1/webhooks/twilio/messages/status', data: body })
}