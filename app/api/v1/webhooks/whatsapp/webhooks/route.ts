import { NextResponse } from 'next/server'

// Legacy inbound alias: GET/POST /v1/whatsapp/webhooks -> WappmessageController@receive
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/webhooks/whatsapp/webhooks' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'received', route: '/api/v1/webhooks/whatsapp/webhooks', data: body })
}