import { NextResponse } from 'next/server'

// Legacy: POST bulkdlr -> ProcessBulkdlr job
export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ status: 'Success', description: 'Acknowledged (mock)', data: body })
}