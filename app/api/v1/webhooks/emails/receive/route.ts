import { NextResponse } from 'next/server'

// Legacy: POST/GET /v1/emails/receive -> ProjectEmailController@store
export async function GET() {
  return NextResponse.json({ status: 'ok', route: '/api/v1/webhooks/emails/receive' })
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'received', route: '/api/v1/webhooks/emails/receive', data: body })
}