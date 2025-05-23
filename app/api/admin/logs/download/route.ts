import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock log data generator (same as in logs/route.ts)
const generateMockLogs = (count: number = 1000) => {
  const levels = ['debug', 'info', 'warn', 'error', 'fatal'];
  const sources = ['api', 'auth', 'messaging', 'webhooks', 'chat', 'analytics'];
  const messages = [
    'User login successful',
    'SMS message sent successfully',
    'API rate limit exceeded',
    'Database connection timeout',
    'Webhook delivery failed',
    'Chat session started',
    'Campaign created',
    'User registration completed',
    'Payment processed',
    'File upload completed'
  ];

  const logs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 60000 + Math.random() * 60000));
    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];

    logs.push({
      id: `log_${i + 1}`,
      timestamp: timestamp.toISOString(),
      level,
      message,
      source,
      userId: Math.random() > 0.3 ? `user_${Math.floor(Math.random() * 10) + 1}` : undefined,
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      context: {
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        endpoint: `/${source}/${Math.random().toString(36).substr(2, 5)}`,
        duration: Math.floor(Math.random() * 1000) + 'ms'
      }
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

// Helper function to convert logs to CSV format
function logsToCSV(logs: any[]): string {
  const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Source', 'User ID', 'Request ID', 'IP', 'Endpoint', 'Duration'];
  const csvRows = [headers.join(',')];

  logs.forEach(log => {
    const row = [
      log.id,
      log.timestamp,
      log.level,
      `"${log.message.replace(/"/g, '""')}"`, // Escape quotes in message
      log.source || '',
      log.userId || '',
      log.requestId || '',
      log.context?.ip || '',
      log.context?.endpoint || '',
      log.context?.duration || ''
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

// Helper function to convert logs to plain text format
function logsToText(logs: any[]): string {
  return logs.map(log => {
    const timestamp = new Date(log.timestamp).toLocaleString();
    const context = log.context ? ` [${log.context.ip}] ${log.context.endpoint} (${log.context.duration})` : '';
    return `[${timestamp}] ${log.level.toUpperCase()}: ${log.message}${context}`;
  }).join('\n');
}

/**
 * GET /api/admin/logs/download
 * Download logs in various formats (JSON, CSV, TXT)
 */
export async function GET(request: NextRequest) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const level = searchParams.get('level') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    // Generate large dataset for testing (1-2M logs as requested)
    // Limit to a reasonable size for demo purposes to avoid memory issues
    const logCount = Math.min(100000, 1500000); // Start with 100K logs for testing
    console.log(`Generating ${logCount} logs for download...`);

    const allLogs = generateMockLogs(logCount);
    let filteredLogs = [...allLogs];

    // Apply filters
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
    }

    console.log(`Filtered to ${filteredLogs.length} logs, converting to ${format}...`);

    let content: string;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case 'csv':
        content = logsToCSV(filteredLogs);
        contentType = 'text/csv';
        filename = `logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;

      case 'txt':
        content = logsToText(filteredLogs);
        contentType = 'text/plain';
        filename = `logs_${new Date().toISOString().split('T')[0]}.txt`;
        break;

      case 'json':
      default:
        content = JSON.stringify(filteredLogs, null, 2);
        contentType = 'application/json';
        filename = `logs_${new Date().toISOString().split('T')[0]}.json`;
        break;
    }

    console.log(`Generated ${content.length} characters of ${format} content`);

    // Create response with appropriate headers for file download
    const response = new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': content.length.toString(),
      },
    });

    return response;

  } catch (error) {
    console.error("Failed to download logs:", error);
    return NextResponse.json({
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
