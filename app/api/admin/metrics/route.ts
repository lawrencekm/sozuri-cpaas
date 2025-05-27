import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock real-time metrics data generator
const generateRealTimeMetrics = () => {
  const now = new Date();
  const baseMetrics = {
    timestamp: now.toISOString(),
    system: {
      cpu_usage: Math.random() * 100,
      memory_usage: Math.random() * 100,
      disk_usage: Math.random() * 100,
      network_in: Math.random() * 1000,
      network_out: Math.random() * 1000,
      active_connections: Math.floor(Math.random() * 1000) + 100,
      uptime: Math.floor(Math.random() * 86400) + 3600, // 1-24 hours in seconds
    },
    messaging: {
      sms: {
        sent_last_hour: Math.floor(Math.random() * 10000) + 1000,
        delivered_last_hour: Math.floor(Math.random() * 9500) + 900,
        failed_last_hour: Math.floor(Math.random() * 500) + 10,
        delivery_rate: (95 + Math.random() * 4).toFixed(2) + '%',
        avg_latency: (Math.random() * 2000 + 500).toFixed(0) + 'ms',
        cost_per_message: (0.01 + Math.random() * 0.05).toFixed(4),
        throughput: Math.floor(Math.random() * 1000) + 100,
        error_rate: (Math.random() * 5).toFixed(2) + '%',
        conversion_rate: (Math.random() * 15 + 5).toFixed(2) + '%',
      },
      whatsapp: {
        sent_last_hour: Math.floor(Math.random() * 5000) + 500,
        delivered_last_hour: Math.floor(Math.random() * 4800) + 450,
        failed_last_hour: Math.floor(Math.random() * 200) + 5,
        delivery_rate: (92 + Math.random() * 6).toFixed(2) + '%',
        avg_latency: (Math.random() * 3000 + 1000).toFixed(0) + 'ms',
        cost_per_message: (0.02 + Math.random() * 0.08).toFixed(4),
        throughput: Math.floor(Math.random() * 500) + 50,
        error_rate: (Math.random() * 8).toFixed(2) + '%',
        conversion_rate: (Math.random() * 20 + 10).toFixed(2) + '%',
      },
      voice: {
        calls_last_hour: Math.floor(Math.random() * 1000) + 100,
        completed_last_hour: Math.floor(Math.random() * 900) + 80,
        failed_last_hour: Math.floor(Math.random() * 100) + 5,
        completion_rate: (85 + Math.random() * 10).toFixed(2) + '%',
        avg_duration: (Math.random() * 300 + 30).toFixed(0) + 's',
        cost_per_minute: (0.05 + Math.random() * 0.15).toFixed(4),
        throughput: Math.floor(Math.random() * 200) + 20,
        error_rate: (Math.random() * 15).toFixed(2) + '%',
        conversion_rate: (Math.random() * 25 + 15).toFixed(2) + '%',
      }
    },
    users: {
      total_active: Math.floor(Math.random() * 10000) + 5000,
      online_now: Math.floor(Math.random() * 1000) + 100,
      new_registrations_today: Math.floor(Math.random() * 100) + 10,
      total_balance: (Math.random() * 1000000 + 100000).toFixed(2),
      avg_balance_per_user: (Math.random() * 1000 + 100).toFixed(2),
    },
    projects: {
      total_active: Math.floor(Math.random() * 1000) + 500,
      campaigns_running: Math.floor(Math.random() * 200) + 50,
      messages_queued: Math.floor(Math.random() * 50000) + 1000,
      avg_engagement_rate: (Math.random() * 30 + 10).toFixed(2) + '%',
    },
    financial: {
      revenue_today: (Math.random() * 10000 + 1000).toFixed(2),
      revenue_this_month: (Math.random() * 300000 + 50000).toFixed(2),
      total_transactions_today: Math.floor(Math.random() * 5000) + 500,
      avg_transaction_value: (Math.random() * 50 + 5).toFixed(2),
      pending_payments: (Math.random() * 5000 + 100).toFixed(2),
    }
  };

  return baseMetrics;
};

// Generate time series data for charts
const generateTimeSeriesData = (hours: number = 24) => {
  const data = [];
  const now = new Date();
  
  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - (i * 3600000));
    data.push({
      timestamp: timestamp.toISOString(),
      hour: timestamp.getHours(),
      sms_sent: Math.floor(Math.random() * 1000) + 100,
      sms_delivered: Math.floor(Math.random() * 950) + 90,
      whatsapp_sent: Math.floor(Math.random() * 500) + 50,
      whatsapp_delivered: Math.floor(Math.random() * 480) + 45,
      voice_calls: Math.floor(Math.random() * 100) + 10,
      voice_completed: Math.floor(Math.random() * 90) + 8,
      active_users: Math.floor(Math.random() * 200) + 50,
      revenue: (Math.random() * 1000 + 100).toFixed(2),
      cpu_usage: Math.random() * 100,
      memory_usage: Math.random() * 100,
      error_rate: Math.random() * 10,
    });
  }
  
  return data;
};

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

/**
 * GET /api/admin/metrics
 * Get real-time system metrics for admin dashboard
 */
export async function GET(request: NextRequest) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'overview';
    const timeframe = searchParams.get('timeframe') || '24h';

    switch (type) {
      case 'overview':
        return NextResponse.json({
          metrics: generateRealTimeMetrics(),
          last_updated: new Date().toISOString()
        });

      case 'timeseries':
        const hours = timeframe === '1h' ? 1 : 
                     timeframe === '6h' ? 6 : 
                     timeframe === '12h' ? 12 : 24;
        return NextResponse.json({
          data: generateTimeSeriesData(hours),
          timeframe,
          last_updated: new Date().toISOString()
        });

      case 'alerts':
        // Generate mock alerts
        const alerts = [
          {
            id: 'alert_1',
            type: 'warning',
            message: 'SMS delivery rate below 95%',
            timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
            severity: 'medium'
          },
          {
            id: 'alert_2',
            type: 'info',
            message: 'High traffic detected on WhatsApp channel',
            timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
            severity: 'low'
          }
        ];
        return NextResponse.json({ alerts });

      default:
        return NextResponse.json({ message: 'Invalid metrics type' }, { status: 400 });
    }

  } catch (error) {
    console.error("Failed to fetch admin metrics:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
