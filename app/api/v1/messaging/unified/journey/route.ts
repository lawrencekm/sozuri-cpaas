import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { CustomerJourneyTracker } from '@/lib/services/customer-journey-tracker';

const journeyTracker = new CustomerJourneyTracker();

/**
 * GET /api/v1/messaging/unified/journey
 * Get customer journey analytics
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('projectId');
    const customerId = searchParams.get('customerId');
    const conversationId = searchParams.get('conversationId');
    const action = searchParams.get('action');

    if (!projectId) {
      return NextResponse.json({
        error: 'Missing projectId parameter'
      }, { status: 400 });
    }

    switch (action) {
      case 'customer_journey':
        if (!customerId) {
          return NextResponse.json({
            error: 'customerId is required for customer journey'
          }, { status: 400 });
        }
        
        const journey = await journeyTracker.getCustomerJourneyAnalytics(projectId, customerId);
        return NextResponse.json({
          success: true,
          data: journey
        });

      case 'project_analytics':
        const dateFrom = searchParams.get('dateFrom') ? new Date(searchParams.get('dateFrom')!) : undefined;
        const dateTo = searchParams.get('dateTo') ? new Date(searchParams.get('dateTo')!) : undefined;
        const stage = searchParams.get('stage') || undefined;
        const channel = searchParams.get('channel') || undefined;

        const analytics = await journeyTracker.getJourneyAnalytics(projectId, {
          dateFrom,
          dateTo,
          stage,
          channel
        });

        return NextResponse.json({
          success: true,
          data: analytics
        });

      case 'next_best_action':
        if (!customerId || !conversationId) {
          return NextResponse.json({
            error: 'customerId and conversationId are required for next best action'
          }, { status: 400 });
        }

        const recommendation = await journeyTracker.predictNextBestAction(customerId, conversationId);
        return NextResponse.json({
          success: true,
          data: recommendation
        });

      default:
        return NextResponse.json({
          error: 'Invalid action',
          details: 'Supported actions: customer_journey, project_analytics, next_best_action'
        }, { status: 400 });
    }

  } catch (error) {
    console.error('Journey API error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

/**
 * POST /api/v1/messaging/unified/journey
 * Track custom journey events
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      conversationId,
      customerId,
      channel,
      messageType,
      success,
      direction = 'outbound',
      metadata
    } = body;

    if (!conversationId || !customerId || !channel || !messageType) {
      return NextResponse.json({
        error: 'Missing required fields',
        details: 'conversationId, customerId, channel, and messageType are required'
      }, { status: 400 });
    }

    await journeyTracker.trackMessageEvent({
      conversationId,
      customerId,
      channel,
      messageType,
      success: success !== false, // Default to true if not specified
      direction,
      timestamp: new Date(),
      metadata
    });

    return NextResponse.json({
      success: true,
      message: 'Journey event tracked successfully'
    });

  } catch (error) {
    console.error('Journey tracking error:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
