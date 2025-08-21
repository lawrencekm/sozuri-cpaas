import { NextResponse } from 'next/server'

// Legacy: /projects/{id}/ai/whatsappwebhook -> PromptController@whatsappWebhook
export async function GET(_: Request, { params }: { params: { id: string } }) {
  return NextResponse.json({ projectId: params.id, status: 'ok', route: `/api/v1/webhooks/whatsapp/projects/${params.id}` })
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const body = await request.json().catch(() => null)
  return NextResponse.json({ projectId: params.id, status: 'received', route: `/api/v1/webhooks/whatsapp/projects/${params.id}`, data: body })
}