import { NextResponse } from 'next/server'

// Legacy delivery: GET/POST /v1/whatsapp/delivery -> WmessageController@delivery
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/webhooks/whatsapp/delivery' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'ack', route: '/api/v1/webhooks/whatsapp/delivery', data: body })
}