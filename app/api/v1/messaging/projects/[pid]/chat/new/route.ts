import { NextResponse } from 'next/server'

// Legacy: GET /v1/messaging/projects/{pid}/chat/new -> returns recent messages
export async function GET(_: Request, { params }: { params: Promise<{ pid: string }> }) {
  // TODO: fetch messages for project
  const { pid } = await params
  return NextResponse.json({ projectId: pid, messages: [] })
}