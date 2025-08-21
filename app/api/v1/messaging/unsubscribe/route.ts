import { NextResponse } from 'next/server'

// Legacy: GET/POST /v1/messaging/unsubscribe -> SdpController@unsubscribe
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/unsubscribe' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'unsubscribed', route: '/api/v1/messaging/unsubscribe', data: body })
}