import { NextRequest, NextResponse } from 'next/server';
import { Campaign } from '@/lib/api';

// Mock campaign data
const mockCampaigns: Campaign[] = [
  {
    id: 'camp_001',
    name: 'Welcome Message',
    description: 'Initial welcome message sent to new customers',
    channel: 'sms',
    status: 'active',
    created_at: '2023-05-15T10:30:00Z',
    updated_at: '2023-05-15T10:30:00Z',
    content: 'Welcome to our service! We\'re excited to have you on board. Reply HELP for assistance or STOP to unsubscribe.',
    audience: {
      total: 1245,
      delivered: 1200,
      failed: 45,
      opened: 980,
      clicked: 650
    },
    schedule: {
      type: 'immediate',
      sentAt: '2023-05-15T10:30:00Z'
    }
  },
  {
    id: 'camp_002',
    name: 'Product Launch',
    description: 'Announcing our new product features',
    channel: 'sms',
    status: 'completed',
    created_at: '2023-05-10T14:20:00Z',
    updated_at: '2023-05-10T14:20:00Z',
    content: 'Exciting news! Check out our new features. Visit our website to learn more.',
    audience: {
      total: 2500,
      delivered: 2450,
      failed: 50,
      opened: 1800,
      clicked: 1200
    },
    schedule: {
      type: 'scheduled',
      sentAt: '2023-05-10T14:20:00Z',
      scheduledFor: '2023-05-10T14:00:00Z'
    }
  },
  {
    id: 'camp_003',
    name: 'Monthly Newsletter',
    description: 'Monthly updates and tips for customers',
    channel: 'email',
    status: 'draft',
    created_at: '2023-05-20T09:15:00Z',
    updated_at: '2023-05-20T09:15:00Z',
    content: 'Here are this month\'s highlights and tips to get the most out of our service.',
    audience: {
      total: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0
    },
    schedule: {
      type: 'scheduled',
      scheduledFor: '2023-06-01T10:00:00Z'
    }
  },
  {
    id: 'camp_004',
    name: 'Flash Sale Alert',
    description: 'Limited time offer notification',
    channel: 'whatsapp',
    status: 'paused',
    created_at: '2023-05-18T16:45:00Z',
    updated_at: '2023-05-18T16:45:00Z',
    content: '🔥 Flash Sale! 50% off all premium features. Limited time only!',
    audience: {
      total: 800,
      delivered: 750,
      failed: 50,
      opened: 600,
      clicked: 400
    },
    schedule: {
      type: 'immediate'
    }
  },
  {
    id: 'camp_005',
    name: 'Customer Feedback',
    description: 'Survey request for customer satisfaction',
    channel: 'sms',
    status: 'active',
    created_at: '2023-05-22T11:30:00Z',
    updated_at: '2023-05-22T11:30:00Z',
    content: 'We value your feedback! Please take 2 minutes to complete our survey: [link]',
    audience: {
      total: 1500,
      delivered: 1480,
      failed: 20,
      opened: 1100,
      clicked: 850
    },
    schedule: {
      type: 'recurring'
    }
  }
];

/**
 * GET /api/campaigns
 * Get all campaigns
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const channel = searchParams.get('channel');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    let filteredCampaigns = [...mockCampaigns];

    // Filter by status
    if (status && status !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === status);
    }

    // Filter by channel
    if (channel && channel !== 'all') {
      filteredCampaigns = filteredCampaigns.filter(campaign => campaign.channel === channel);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedCampaigns = filteredCampaigns.slice(startIndex, endIndex);

    // Return campaigns directly for the useCampaigns hook
    return NextResponse.json(paginatedCampaigns);

  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/campaigns
 * Create a new campaign
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, channel, content, schedule } = body;

    if (!name || !description || !channel || !content) {
      return NextResponse.json({
        message: 'Missing required fields: name, description, channel, content'
      }, { status: 400 });
    }

    const newCampaign: Campaign = {
      id: `camp_${Date.now()}`,
      name,
      description,
      channel,
      content,
      status: 'draft',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      audience: {
        total: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
        clicked: 0
      },
      schedule: schedule || { type: 'immediate' }
    };

    mockCampaigns.push(newCampaign);

    return NextResponse.json(newCampaign, { status: 201 });

  } catch (error) {
    console.error("Failed to create campaign:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
