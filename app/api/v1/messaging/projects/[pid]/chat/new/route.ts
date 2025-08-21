import { NextResponse } from 'next/server'

// Legacy: GET /v1/messaging/projects/{pid}/chat/new -> returns recent messages
export async function GET(_: Request, { params }: { params: { pid: string } }) {
  // TODO: fetch messages for project
  return NextResponse.json({ projectId: params.pid, messages: [] })
}