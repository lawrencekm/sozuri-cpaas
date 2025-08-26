import { NextResponse } from 'next/server'

// Legacy: GET/POST /projects/{id}/ai/generate -> PromptController@generate
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ projectId: id, status: 'ok', route: `/api/v1/projects/${id}/ai/generate` })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  return NextResponse.json({ projectId: id, status: 'received', route: `/api/v1/projects/${id}/ai/generate`, data: body })
}