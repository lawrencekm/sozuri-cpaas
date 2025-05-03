import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';
import { type WebhookConfig } from '../route'; // Import type from main route

// Mock database reference (assuming it's managed in the main route file for mock purposes)
// In a real app, you'd interact with a DB service here.
// This is highly simplified for placeholder routes.
let mockWebhooks: WebhookConfig[] = [
  { id: 'wh_1', url: 'https://example.com/hook1', description: 'Production Hook', events: ['message.sent', 'message.delivered'], isActive: true, createdAt: new Date(Date.now() - 86400000).toISOString() },
  { id: 'wh_2', url: 'https://example.com/hook2', description: 'Staging Notifications', events: ['message.failed'], isActive: true, createdAt: new Date(Date.now() - 172800000).toISOString() },
  { id: 'wh_3', url: 'https://example.com/hook3', description: 'Testing Endpoint', events: ['message.sent'], isActive: false, createdAt: new Date().toISOString() },
];

interface RouteParams {
  params: { id: string };
}

/**
 * GET /api/webhooks/[id]
 * Retrieves details for a specific webhook.
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  // TODO: Auth checks
  const { id } = params;
  try {
    const webhook = mockWebhooks.find(wh => wh.id === id);
    if (!webhook) {
      return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
    }
    // TODO: Check ownership
    return NextResponse.json(webhook);
  } catch (error) {
    console.error(`Failed to fetch webhook ${id}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT /api/webhooks/[id]
 * Updates a specific webhook configuration.
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
  // TODO: Auth checks
  const { id } = params;
  try {
    const index = mockWebhooks.findIndex(wh => wh.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
    }
    // TODO: Check ownership

    const body = await request.json();
    // TODO: Input validation
    const { url, description, events, isActive } = body;

    const updatedWebhook = { ...mockWebhooks[index] };
    if (url !== undefined) updatedWebhook.url = url;
    if (description !== undefined) updatedWebhook.description = description;
    if (events !== undefined) updatedWebhook.events = events;
    if (isActive !== undefined) updatedWebhook.isActive = isActive;
    
    // TODO: Update in DB
    mockWebhooks[index] = updatedWebhook;
    
    return NextResponse.json(updatedWebhook);
  } catch (error) {
    console.error(`Failed to update webhook ${id}:`, error);
    // TODO: Use/Implement a server-side centralized error handler
    if (error instanceof SyntaxError) {
       return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/webhooks/[id]
 * Deletes a specific webhook.
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  // TODO: Auth checks
  const { id } = params;
  try {
    const index = mockWebhooks.findIndex(wh => wh.id === id);
    if (index === -1) {
      return NextResponse.json({ message: 'Webhook not found' }, { status: 404 });
    }
    // TODO: Check ownership

    // TODO: Delete from DB
    mockWebhooks.splice(index, 1);

    return new NextResponse(null, { status: 204 }); // No Content
  } catch (error) {
    console.error(`Failed to delete webhook ${id}:`, error);
    // TODO: Use/Implement a server-side centralized error handler
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
} 