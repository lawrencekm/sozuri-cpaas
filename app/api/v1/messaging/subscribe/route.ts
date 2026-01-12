import { NextResponse } from 'next/server'

// Legacy: GET/POST /v1/messaging/subscribe -> SdpController@subscribe
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/subscribe' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'subscribed', route: '/api/v1/messaging/subscribe', data: body })
}