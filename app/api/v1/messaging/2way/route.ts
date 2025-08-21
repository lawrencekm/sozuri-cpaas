import { NextResponse } from 'next/server'

// Legacy: GET/POST /v1/messaging/2way -> SdpController@sendpremium (2-way)
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/2way' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'accepted', route: '/api/v1/messaging/2way', data: body })
}