import { NextResponse } from 'next/server';
import { ConversationOrchestrator } from '@/lib/services/conversation-orchestrator';

const orchestrator = new ConversationOrchestrator();

/**
 * POST /api/v1/messaging/unified/incoming
 * Handle incoming messages from all channels (webhooks)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      projectId,
      channel, // sms, whatsapp, email, voice
      fromIdentifier, // Phone number, email, etc.
      toIdentifier, // Business number, email, etc.
      content,
      messageType = 'text',
      externalId, // Provider's message ID
      timestamp,
      metadata
    } = body;

    // Validate required fields
    if (!projectId || !channel || !fromIdentifier || !toIdentifier || !content) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'projectId, channel, fromIdentifier, toIdentifier, and content are required'
      }, { status: 400 });
    }

    // Process incoming message through orchestrator
    const result = await orchestrator.handleIncomingMessage({
      projectId,
      channel,
      fromIdentifier,
      toIdentifier,
      content: { ...content, metadata },
      messageType,
      externalId,
      timestamp: timestamp ? new Date(timestamp) : new Date()
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          conversationId: result.conversationId,
          messageId: result.messageId
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: 'Failed to process incoming message'
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Incoming message processing error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
