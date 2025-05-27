import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

function hasPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

const generateDetailedMessageLog = (id: string) => {
  const channels = ['sms', 'whatsapp', 'viber', 'rcs', 'voice'];
  const directions = ['inbound', 'outbound'];
  const statuses = ['pending', 'sent', 'delivered', 'failed', 'read'];
  
  const channel = channels[Math.floor(Math.random() * channels.length)];
  const direction = directions[Math.floor(Math.random() * directions.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  
  const deliveryHistory = [];
  const now = new Date();
  
  if (status !== 'pending') {
    deliveryHistory.push({
      status: 'sent',
      timestamp: new Date(now.getTime() - 300000).toISOString(),
      description: 'Message sent to carrier'
    });
  }
  
  if (status === 'delivered' || status === 'read') {
    deliveryHistory.push({
      status: 'delivered',
      timestamp: new Date(now.getTime() - 120000).toISOString(),
      description: 'Message delivered to recipient'
    });
  }
  
  if (status === 'read') {
    deliveryHistory.push({
      status: 'read',
      timestamp: new Date(now.getTime() - 60000).toISOString(),
      description: 'Message read by recipient'
    });
  }
  
  if (status === 'failed') {
    deliveryHistory.push({
      status: 'failed',
      timestamp: new Date(now.getTime() - 180000).toISOString(),
      description: 'Message delivery failed',
      error_code: 'ERR_404',
      error_message: 'Invalid phone number'
    });
  }

  return {
    id,
    message_id: `msg_${Math.random().toString(36).substring(2, 11)}`,
    channel,
    direction,
    sender: direction === 'outbound' ? 'SOZURI' : `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    recipient: direction === 'inbound' ? 'SOZURI' : `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    content: 'Welcome to our service! Your account has been created successfully. Use code WELCOME10 for 10% off your first purchase.',
    status,
    timestamp: new Date(now.getTime() - 300000).toISOString(),
    cost: direction === 'outbound' ? parseFloat((Math.random() * 0.1 + 0.01).toFixed(4)) : null,
    currency: direction === 'outbound' ? 'USD' : null,
    campaign_id: 'camp_welcome123',
    campaign_name: 'Welcome Campaign',
    template_id: 'tmpl_welcome456',
    template_name: 'Welcome Template',
    user_id: 'user_123',
    project_id: 'proj_456',
    error_code: status === 'failed' ? 'ERR_404' : null,
    error_message: status === 'failed' ? 'Invalid phone number' : null,
    delivery_attempts: status === 'failed' ? 3 : 1,
    metadata: {
      user_agent: channel === 'whatsapp' ? 'WhatsApp/2.21.0' : null,
      device_type: 'mobile',
      ip_address: '192.168.1.100',
      country_code: 'US',
      carrier: 'Verizon',
      message_parts: Math.ceil(Math.random() * 3),
      encoding: 'UTF-8',
      priority: 'normal',
      webhook_url: 'https://api.example.com/webhooks/delivery',
      reference_id: `ref_${Math.random().toString(36).substring(2, 9)}`
    },
    delivery_history: deliveryHistory,
    related_messages: [
      {
        id: `msg_${Math.random().toString(36).substring(2, 11)}`,
        direction: direction === 'inbound' ? 'outbound' : 'inbound',
        content: 'Thank you for your message. We will get back to you soon.',
        timestamp: new Date(now.getTime() - 60000).toISOString(),
        status: 'delivered'
      }
    ]
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ message: 'Message log ID is required' }, { status: 400 });
    }

    const messageLog = generateDetailedMessageLog(id);

    return NextResponse.json(messageLog);

  } catch (error) {
    console.error("Failed to fetch message log:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
