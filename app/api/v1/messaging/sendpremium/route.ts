import { NextResponse } from 'next/server'

// Legacy: GET/POST /v1/messaging/sendpremium -> SdpController@sendpremium
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/sendpremium' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'queued', route: '/api/v1/messaging/sendpremium', data: body })
}