import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock log data - in a real app, this would come from your logging system
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

const mockLogs = generateMockLogs(2000); // Generate 2000 mock logs

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

/**
 * GET /api/admin/logs
 * Get system logs with pagination and filtering
 */
export async function GET(request: NextRequest) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const level = searchParams.get('level') || '';
    const startDate = searchParams.get('startDate') || '';
    const endDate = searchParams.get('endDate') || '';
    const search = searchParams.get('search') || '';
    const userId = searchParams.get('userId') || '';

    let filteredLogs = [...mockLogs];

    // Apply level filter
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }

    // Apply date range filter
    if (startDate) {
      const start = new Date(startDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) >= start);
    }

    if (endDate) {
      const end = new Date(endDate);
      filteredLogs = filteredLogs.filter(log => new Date(log.timestamp) <= end);
    }

    // Apply user filter
    if (userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === userId);
    }

    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filteredLogs = filteredLogs.filter(log =>
        log.message.toLowerCase().includes(searchLower) ||
        log.source?.toLowerCase().includes(searchLower) ||
        log.userId?.toLowerCase().includes(searchLower) ||
        log.requestId?.toLowerCase().includes(searchLower)
      );
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedLogs = filteredLogs.slice(startIndex, endIndex);

    return NextResponse.json({
      logs: paginatedLogs,
      total: filteredLogs.length,
      page,
      limit,
      totalPages: Math.ceil(filteredLogs.length / limit)
    });

  } catch (error) {
    console.error("Failed to fetch logs:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
