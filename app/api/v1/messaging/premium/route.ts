import { NextResponse } from 'next/server'

// Legacy: POST /v1/premium -> SdpController@fetch
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/premium', data: body })
}