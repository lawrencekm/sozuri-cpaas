import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

const mockProjects = [
  {
    id: 'proj_1',
    name: 'Customer Onboarding',
    description: 'Welcome messages and setup guides for new customers',
    campaigns: 3,
    messages: 2451,
    engagement: 76,
    created: '2024-01-16T09:15:00Z',
    updated: '2024-01-20T13:45:00Z',
    user_id: 'user_2',
    status: 'active' as const,
    balance: 250.75,
    currency: 'USD'
  },
  {
    id: 'proj_2',
    name: 'Marketing Campaigns',
    description: 'Promotional messages and marketing automation',
    campaigns: 5,
    messages: 8920,
    engagement: 68,
    created: '2024-01-17T11:20:00Z',
    updated: '2024-01-20T12:30:00Z',
    user_id: 'user_3',
    status: 'active' as const,
    balance: 89.50,
    currency: 'USD'
  },
  {
    id: 'proj_3',
    name: 'Order Notifications',
    description: 'Transactional messages for order updates',
    campaigns: 2,
    messages: 1205,
    engagement: 95,
    created: '2024-01-18T16:45:00Z',
    updated: '2024-01-19T10:15:00Z',
    user_id: 'user_4',
    status: 'inactive' as const,
    balance: 0,
    currency: 'USD'
  },
  {
    id: 'proj_4',
    name: 'Support Alerts',
    description: 'Customer support and service notifications',
    campaigns: 1,
    messages: 456,
    engagement: 82,
    created: '2024-01-19T08:30:00Z',
    updated: '2024-01-19T15:20:00Z',
    user_id: 'user_5',
    status: 'suspended' as const,
    balance: 15.25,
    currency: 'USD'
  }
];

function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

export async function GET(request: NextRequest) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const user_id = searchParams.get('user_id') || '';

    let filteredProjects = mockProjects;

    if (search) {
      filteredProjects = filteredProjects.filter(project =>
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (user_id) {
      filteredProjects = filteredProjects.filter(project => project.user_id === user_id);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

    return NextResponse.json({
      projects: paginatedProjects,
      total: filteredProjects.length,
      page,
      limit
    });

  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
