import { NextResponse } from 'next/server'

// Legacy: GET/POST /projects/{id}/ai/generate -> PromptController@generate
export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ projectId: params.id, status: 'ok', route: `/api/v1/projects/${params.id}/ai/generate` })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ projectId: params.id, status: 'received', route: `/api/v1/projects/${params.id}/ai/generate`, data: body })
}