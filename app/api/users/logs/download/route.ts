import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const generateUserLogs = (userId: string, count: number = 10000) => {
  const levels = ['debug', 'info', 'warn', 'error'];
  const sources = ['api', 'messaging', 'campaigns', 'billing'];
  const messages = [
    'Campaign message sent successfully',
    'SMS delivery confirmed',
    'Credit balance updated',
    'API request processed',
    'Template created',
    'User login',
    'Project updated',
    'Campaign scheduled'
  ];

  const logs = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const timestamp = new Date(now.getTime() - (i * 60000 + Math.random() * 60000));
    const level = levels[Math.floor(Math.random() * levels.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const message = messages[Math.floor(Math.random() * messages.length)];
    
    logs.push({
      id: `log_${userId}_${i + 1}`,
      timestamp: timestamp.toISOString(),
      level,
      message,
      source,
      userId,
      requestId: `req_${Math.random().toString(36).substr(2, 9)}`,
      context: {
        ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        endpoint: `/${source}/${Math.random().toString(36).substr(2, 5)}`,
        duration: Math.floor(Math.random() * 1000) + 'ms'
      }
    });
  }

  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};

function isAuthenticated(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

function getCurrentUserId(request: NextRequest): string {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.includes('impersonation_token')) {
    const tokenParts = authHeader.split('_');
    if (tokenParts.length >= 3) {
      return tokenParts[2];
    }
  }
  return 'user_1';
}

function logsToCSV(logs: any[]): string {
  const headers = ['ID', 'Timestamp', 'Level', 'Message', 'Source', 'Request ID', 'IP', 'Endpoint', 'Duration'];
  const csvRows = [headers.join(',')];

  logs.forEach(log => {
    const row = [
      log.id,
      log.timestamp,
      log.level,
      `"${log.message.replace(/"/g, '""')}"`,
      log.source || '',
      log.requestId || '',
      log.context?.ip || '',
      log.context?.endpoint || '',
      log.context?.duration || ''
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}

function logsToText(logs: any[]): string {
  return logs.map(log => {
    const timestamp = new Date(log.timestamp).toLocaleString();
    const context = log.context ? ` [${log.context.ip}] ${log.context.endpoint} (${log.context.duration})` : '';
    return `[${timestamp}] ${log.level.toUpperCase()}: ${log.message}${context}`;
  }).join('\n');
}

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getCurrentUserId(request);
    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'json';
    const level = searchParams.get('level') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';

    console.log(`Generating user logs for ${userId}...`);
    
    let userLogs = generateUserLogs(userId, 50000);

    if (level) {
      userLogs = userLogs.filter(log => log.level === level);
    }

    if (startDate) {
      const start = new Date(startDate);
      userLogs = userLogs.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      userLogs = userLogs.filter(log => new Date(log.timestamp) <= end);
    }

    console.log(`Filtered to ${userLogs.length} logs, converting to ${format}...`);

    let content: string;
    let contentType: string;
    let filename: string;

    switch (format.toLowerCase()) {
      case 'csv':
        content = logsToCSV(userLogs);
        contentType = 'text/csv';
        filename = `user_${userId}_logs_${new Date().toISOString().split('T')[0]}.csv`;
        break;
      
      case 'txt':
        content = logsToText(userLogs);
        contentType = 'text/plain';
        filename = `user_${userId}_logs_${new Date().toISOString().split('T')[0]}.txt`;
        break;
      
      case 'json':
      default:
        content = JSON.stringify(userLogs, null, 2);
        contentType = 'application/json';
        filename = `user_${userId}_logs_${new Date().toISOString().split('T')[0]}.json`;
        break;
    }

    console.log(`Generated ${content.length} characters of ${format} content`);

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
    console.error("Failed to download user logs:", error);
    return NextResponse.json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
