import { NextResponse } from 'next/server'

// Legacy: GET /v1/messages/smpp/dlr/airtel -> SdpController@receiveAirtelDlr
export async function GET() {
  return NextResponse.json({ status: 'ok', provider: 'smpp-airtel', route: '/api/v1/webhooks/smpp/airtel/dlr' })
}