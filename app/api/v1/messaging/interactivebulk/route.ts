import { NextResponse } from 'next/server'

// Legacy: GET|POST /interactivebulk -> SdpController@interactivebulk
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/interactivebulk' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'received', route: '/api/v1/messaging/interactivebulk', data: body })
}