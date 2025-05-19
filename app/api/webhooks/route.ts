import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Placeholder type for a webhook configuration
export interface WebhookConfig {
  id: string;
  url: string;
  description: string | null;
  events: string[]; // e.g., ['message.sent', 'message.delivered']
  isActive: boolean;
  createdAt: string;
}

// Mock database
const mockWebhooks: WebhookConfig[] = [
  { id: 'wh_1', url: 'https://example.com/hook1', description: 'Production Hook', events: ['message.sent', 'message.delivered'], isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh_2', url: 'https://example.com/hook2', description: 'Staging Notifications', events: ['message.failed'], isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'wh_3', url: 'https://example.com/hook3', description: 'Testing Endpoint', events: ['message.sent'], isActive: false, createdAt: new Date().toISOString() },
];

/**
 * GET /api/webhooks
 */
export async function GET() {
  try {
    const webhooks = mockWebhooks;
    return NextResponse.json(webhooks);
  } catch (error) {
    console.error("Failed to fetch webhooks:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/webhooks
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { url, description, events, isActive = true } = body;

        if (!url || !Array.isArray(events) || events.length === 0) {
             return NextResponse.json({ message: 'Missing required fields: url, events' }, { status: 400 });
        }

        const newWebhook: WebhookConfig = {
            id: `wh_${Date.now()}`,
            url,
            description: description || null,
            events,
            isActive,
            createdAt: new Date().toISOString(),
        };
        mockWebhooks.push(newWebhook);
        return NextResponse.json(newWebhook, { status: 201 });

    } catch (error) {
        console.error("Failed to create webhook:", error);
        if (error instanceof SyntaxError) {
           return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}