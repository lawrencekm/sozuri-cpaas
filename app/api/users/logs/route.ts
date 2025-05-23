import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const generateUserLogs = (userId: string, count: number = 100) => {
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

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticated(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const userId = getCurrentUserId(request);
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const level = searchParams.get('level') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const search = searchParams.get('search') || '';

    let userLogs = generateUserLogs(userId, 500);

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

    if (search) {
      const searchLower = search.toLowerCase();
      userLogs = userLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.source?.toLowerCase().includes(searchLower)
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = userLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      logs: paginatedLogs,
      total: userLogs.length,
      page,
      limit,
      totalPages: Math.ceil(userLogs.length / limit)
    });

  } catch (error) {
    console.error("Failed to fetch user logs:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
