import { NextResponse } from 'next/server'

// Legacy: GET/POST /v1/messaging/whatsapp -> WappmessageController@send
export async function GET() {
  return NextResponse.json({ status: 'ok', channel: 'whatsapp', route: '/api/v1/messaging/whatsapp' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'accepted', channel: 'whatsapp', route: '/api/v1/messaging/whatsapp', data: body })
}