import { NextResponse } from 'next/server'

// Legacy: GET /v1/messaging/authtest -> SmsController@authTest
export async function GET() {
  return NextResponse.json({ message: 'Auth OK (mock)', route: '/api/v1/messaging/authtest' })
}