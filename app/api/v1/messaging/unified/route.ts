import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ConversationOrchestrator } from '@/lib/services/conversation-orchestrator';
import { ConversationManager } from '@/lib/services/conversation-manager';
import { CustomerJourneyTracker } from '@/lib/services/customer-journey-tracker';

const orchestrator = new ConversationOrchestrator();
const conversationManager = new ConversationManager();
const journeyTracker = new CustomerJourneyTracker();

/**
 * POST /api/v1/messaging/unified
 * Send a message through the unified conversation orchestration system
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      projectId,
      customerId, // Phone number, email, or customer ID
      content,
      messageType = 'text',
      subject,
      priority = 'normal',
      category,
      preferredChannel,
      fallbackChannels,
      context,
      automationId
    } = body;

    // Validate required fields
    if (!projectId || !customerId || !content) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'projectId, customerId, and content are required'
      }, { status: 400 });
    }

    // Validate priority
    if (!['low', 'normal', 'high', 'urgent'].includes(priority)) {
      return NextResponse.json({
        error: 'Invalid priority',
        details: 'Priority must be one of: low, normal, high, urgent'
      }, { status: 400 });
    }

    // Send message through orchestrator
    const result = await orchestrator.sendMessage({
      projectId,
      customerId,
      content,
      messageType,
      subject,
      priority,
      category,
      preferredChannel,
      fallbackChannels,
      context,
      automationId
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          conversationId: result.conversationId,
          messageId: result.messageId,
          channel: result.channel,
          routeId: result.routeId
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

  } catch (error) {
    console.error('Unified messaging API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * GET /api/v1/messaging/unified
 * Get conversations and messages with unified view
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const conversationId = searchParams.get('conversationId');
    const customerId = searchParams.get('customerId');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const category = searchParams.get('category');
    const channel = searchParams.get('channel');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!projectId) {
      return NextResponse.json({
        error: 'Missing projectId parameter'
      }, { status: 400 });
    }

    // If specific conversation requested
    if (conversationId) {
      const conversation = await conversationManager.getConversationWithContext(conversationId);
      return NextResponse.json({
        success: true,
        data: conversation
      });
    }

    // Search conversations
    const result = await conversationManager.searchConversations(projectId, {
      customerId: customerId || undefined,
      status: status || undefined,
      priority: priority || undefined,
      category: category || undefined,
      channel: channel || undefined,
      limit,
      offset
    });

    return NextResponse.json({
      success: true,
      data: {
        conversations: result.conversations,
        total: result.total,
        hasMore: result.hasMore,
        pagination: {
          limit,
          offset,
          total: result.total
        }
      }
    });

  } catch (error) {
    console.error('Unified messaging GET error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * PUT /api/v1/messaging/unified
 * Update conversation or handle incoming messages
 */
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { action, conversationId, ...data } = body;

    if (!action || !conversationId) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'action and conversationId are required'
      }, { status: 400 });
    }

    let result;

    switch (action) {
      case 'update_conversation':
        result = await conversationManager.updateConversation(conversationId, data);
        break;

      case 'transfer_conversation':
        const { newAgentId, reason } = data;
        if (!newAgentId) {
          return NextResponse.json({
            error: 'newAgentId is required for transfer'
          }, { status: 400 });
        }
        result = await conversationManager.transferConversation(conversationId, newAgentId, reason);
        break;

      case 'escalate_conversation':
        const { escalationLevel, escalationReason } = data;
        if (!escalationLevel || !escalationReason) {
          return NextResponse.json({
            error: 'escalationLevel and escalationReason are required'
          }, { status: 400 });
        }
        result = await conversationManager.escalateConversation(conversationId, escalationLevel, escalationReason);
        break;

      case 'archive_conversation':
        const { archiveReason } = data;
        result = await conversationManager.archiveConversation(conversationId, archiveReason);
        break;

      case 'add_participant':
        const { participantId, participantType, role, phoneNumber, email, name } = data;
        if (!participantId || !participantType) {
          return NextResponse.json({
            error: 'participantId and participantType are required'
          }, { status: 400 });
        }
        result = await conversationManager.addParticipant(conversationId, {
          participantId,
          participantType,
          role,
          phoneNumber,
          email,
          name
        });
        break;

      case 'create_state':
        const { state, subState, stateReason, context, customerData, agentNotes } = data;
        if (!state) {
          return NextResponse.json({
            error: 'state is required'
          }, { status: 400 });
        }
        result = await conversationManager.createConversationState(conversationId, {
          state,
          subState,
          reason: stateReason,
          context,
          customerData,
          agentNotes
        });
        break;

      default:
        return NextResponse.json({
          error: 'Invalid action',
          details: 'Supported actions: update_conversation, transfer_conversation, escalate_conversation, archive_conversation, add_participant, create_state'
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Unified messaging PUT error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
