import { NextResponse } from 'next/server'

// Legacy inbound: GET/POST /v1/whatsapp/notifications -> WappmessageController@receive
export async function GET(request: Request) {
  return NextResponse.json({ status: 'ok', route: '/api/v1/webhooks/whatsapp/notifications' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  // TODO: verify signature/provider as needed
  return NextResponse.json({ status: 'received', route: '/api/v1/webhooks/whatsapp/notifications', data: body })
}