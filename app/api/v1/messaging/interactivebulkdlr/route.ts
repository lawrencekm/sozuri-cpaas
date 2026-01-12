import { NextResponse } from 'next/server'

// Legacy: GET|POST /interactivebulkdlr -> SdpController@interactivebulkdlr (delivery notification)
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/messaging/interactivebulkdlr' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'ack', route: '/api/v1/messaging/interactivebulkdlr', data: body })
}