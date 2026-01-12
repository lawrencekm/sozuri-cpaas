import { NextResponse } from 'next/server'

// Legacy: /projects/{id}/ai/whatsappwebhook -> PromptController@whatsappWebhook
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return NextResponse.json({ projectId: id, status: 'ok', route: `/api/v1/webhooks/whatsapp/projects/${id}` })
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json().catch(() => null)
  return NextResponse.json({ projectId: id, status: 'received', route: `/api/v1/webhooks/whatsapp/projects/${id}`, data: body })
}