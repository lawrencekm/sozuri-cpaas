import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const generateMessageLogs = (count: number = 200) => {
  const channels = ['sms', 'whatsapp', 'viber', 'rcs', 'voice'];
  const directions = ['inbound', 'outbound'];
  const statuses = ['pending', 'sent', 'delivered', 'failed', 'read'];
  const senders = ['SOZURI', 'COMPANY', 'SUPPORT', 'ALERTS', 'PROMO'];
  const campaigns = ['Welcome Campaign', 'Promo Blast', 'Reminder Series', 'Support Follow-up', 'Newsletter'];
  const templates = ['Welcome Template', 'Promo Template', 'Reminder Template', 'Support Template'];
  
  const sampleMessages = [
    'Welcome to our service! Your account has been created successfully.',
    'Your order #12345 has been confirmed and will be shipped within 2 business days.',
    'Reminder: Your appointment is scheduled for tomorrow at 2:00 PM.',
    'Thank you for your purchase! Use code SAVE10 for 10% off your next order.',
    'Your verification code is: 123456. Do not share this code with anyone.',
    'Your payment of $29.99 has been processed successfully.',
    'Limited time offer: 50% off all items. Shop now!',
    'Your subscription will expire in 3 days. Renew now to continue service.',
    'Thank you for contacting support. We will respond within 24 hours.',
    'Your delivery is on its way! Track your package with code ABC123.'
  ];

  const logs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 300000 + Math.random() * 300000));
    const channel = channels[Math.floor(Math.random() * channels.length)];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const sender = direction === 'outbound' ? senders[Math.floor(Math.random() * senders.length)] : 
                   `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const recipient = direction === 'inbound' ? senders[Math.floor(Math.random() * senders.length)] : 
                     `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`;
    const content = sampleMessages[Math.floor(Math.random() * sampleMessages.length)];
    const campaign = Math.random() > 0.3 ? campaigns[Math.floor(Math.random() * campaigns.length)] : null;
    const template = Math.random() > 0.4 ? templates[Math.floor(Math.random() * templates.length)] : null;

    logs.push({
      id: `log_${Date.now()}_${i}`,
      message_id: `msg_${Math.random().toString(36).substring(2, 11)}`,
      channel,
      direction,
      sender,
      recipient,
      content,
      status,
      timestamp: timestamp.toISOString(),
      cost: direction === 'outbound' ? parseFloat((Math.random() * 0.1 + 0.01).toFixed(4)) : null,
      currency: direction === 'outbound' ? 'USD' : null,
      campaign_id: campaign ? `camp_${Math.random().toString(36).substring(2, 9)}` : null,
      campaign_name: campaign,
      template_id: template ? `tmpl_${Math.random().toString(36).substring(2, 9)}` : null,
      template_name: template,
      user_id: `user_${Math.floor(Math.random() * 100) + 1}`,
      project_id: `proj_${Math.floor(Math.random() * 20) + 1}`,
      error_code: status === 'failed' ? `ERR_${Math.floor(Math.random() * 999) + 100}` : null,
      error_message: status === 'failed' ? 'Message delivery failed due to invalid number' : null,
      delivery_attempts: Math.floor(Math.random() * 3) + 1,
      metadata: {
        user_agent: channel === 'whatsapp' ? 'WhatsApp/2.21.0' : null,
        device_type: Math.random() > 0.5 ? 'mobile' : 'desktop',
        ip_address: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        country_code: ['US', 'CA', 'GB', 'AU', 'DE'][Math.floor(Math.random() * 5)]
      }
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

function hasPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

export async function GET(request: NextRequest) {
  try {
    if (!hasPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '25');
    const channel = searchParams.get('channel') || '';
    const direction = searchParams.get('direction') || '';
    const status = searchParams.get('status') || '';
    const sender = searchParams.get('sender') || '';
    const recipient = searchParams.get('recipient') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const search = searchParams.get('search') || '';
    const campaign_id = searchParams.get('campaign_id') || '';
    const template_id = searchParams.get('template_id') || '';

    let logs = generateMessageLogs(1000);

    if (channel) {
      logs = logs.filter(log => log.channel === channel);
    }

    if (direction) {
      logs = logs.filter(log => log.direction === direction);
    }

    if (status) {
      logs = logs.filter(log => log.status === status);
    }

    if (sender) {
      logs = logs.filter(log => log.sender.toLowerCase().includes(sender.toLowerCase()));
    }

    if (recipient) {
      logs = logs.filter(log => log.recipient.toLowerCase().includes(recipient.toLowerCase()));
    }

    if (startDate) {
      const start = new Date(startDate);
      logs = logs.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      logs = logs.filter(log => new Date(log.timestamp) <= end);
    }

    if (campaign_id) {
      logs = logs.filter(log => log.campaign_id === campaign_id);
    }

    if (template_id) {
      logs = logs.filter(log => log.template_id === template_id);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      logs = logs.filter(log =>
        log.content.toLowerCase().includes(searchLower) ||
        log.sender.toLowerCase().includes(searchLower) ||
        log.recipient.toLowerCase().includes(searchLower) ||
        log.campaign_name?.toLowerCase().includes(searchLower) ||
        log.template_name?.toLowerCase().includes(searchLower) ||
        log.message_id.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = logs.slice(startIndex, endIndex);

    const summary = {
      total_messages: logs.length,
      sent: logs.filter(l => l.status === 'sent').length,
      delivered: logs.filter(l => l.status === 'delivered').length,
      failed: logs.filter(l => l.status === 'failed').length,
      pending: logs.filter(l => l.status === 'pending').length,
      total_cost: logs.filter(l => l.cost).reduce((sum, l) => sum + (l.cost || 0), 0),
      channels: {
        sms: logs.filter(l => l.channel === 'sms').length,
        whatsapp: logs.filter(l => l.channel === 'whatsapp').length,
        viber: logs.filter(l => l.channel === 'viber').length,
        rcs: logs.filter(l => l.channel === 'rcs').length,
        voice: logs.filter(l => l.channel === 'voice').length,
      },
      directions: {
        inbound: logs.filter(l => l.direction === 'inbound').length,
        outbound: logs.filter(l => l.direction === 'outbound').length,
      }
    };

    return NextResponse.json({
      logs: paginatedLogs,
      total: logs.length,
      page,
      limit,
      totalPages: Math.ceil(logs.length / limit),
      summary
    });

  } catch (error) {
    console.error("Failed to fetch message logs:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
