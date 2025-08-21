import { NextResponse } from 'next/server'

// Legacy: GET /v1/messages/smpp/receive/airtel -> SdpController@receiveAirtelMo
export async function GET() {
  return NextResponse.json({ status: 'ok', provider: 'smpp-airtel', route: '/api/v1/webhooks/smpp/airtel/receive' })
}