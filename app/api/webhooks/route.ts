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

// Mock database - Replace with actual database logic
let mockWebhooks: WebhookConfig[] = [
  { id: 'wh_1', url: 'https://example.com/hook1', description: 'Production Hook', events: ['message.sent', 'message.delivered'], isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh_2', url: 'https://example.com/hook2', description: 'Staging Notifications', events: ['message.failed'], isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'wh_3', url: 'https://example.com/hook3', description: 'Testing Endpoint', events: ['message.sent'], isActive: false, createdAt: new Date().toISOString() },
];

/**
 * GET /api/webhooks
 * Retrieves a list of configured webhooks for the authenticated user.
 */
export async function GET(request: NextRequest) {
  // TODO: Implement Authentication & Authorization check
  try {
    // TODO: Replace with actual database query
    const webhooks = mockWebhooks;
    return NextResponse.json(webhooks);
  } catch (error) {
    console.error("Failed to fetch webhooks:", error);
    // TODO: Use/Implement a server-side centralized error handler
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/webhooks
 * Creates a new webhook configuration.
 */
export async function POST(request: NextRequest) {
    // TODO: Implement Authentication & Authorization check
    try {
        const body = await request.json();
        // TODO: Input validation (Zod)
        const { url, description, events, isActive = true } = body;

        if (!url || !Array.isArray(events) || events.length === 0) {
             return NextResponse.json({ message: 'Missing required fields: url, events' }, { status: 400 });
        }

        // TODO: Implement actual creation logic (DB save)
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
        // TODO: Use/Implement a server-side centralized error handler
        if (error instanceof SyntaxError) {
           return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
} 