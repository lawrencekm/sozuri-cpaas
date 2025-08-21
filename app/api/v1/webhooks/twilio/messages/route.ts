import { NextResponse } from 'next/server'

// Legacy: POST /v1/tw/messages -> WhatsappmessageController@update (Twilio inbound)
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'received', provider: 'twilio', route: '/api/v1/webhooks/twilio/messages', data: body })
}