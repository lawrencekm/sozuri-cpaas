import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock user data - in our app, this would come from your database
const mockUsers = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    created_at: '2024-01-15T10:30:00Z',
    last_login: '2024-01-20T14:22:00Z',
    company: 'Acme Corporation',
    permissions: ['read', 'write', 'admin', 'impersonate'],
    balance: 0,
    currency: 'USD'
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'user' as const,
    status: 'active' as const,
    created_at: '2024-01-16T09:15:00Z',
    last_login: '2024-01-20T13:45:00Z',
    company: 'Tech Solutions Inc',
    permissions: ['read', 'write'],
    balance: 250.75,
    currency: 'USD',
    project_id: 'proj_1'
  },
  {
    id: 'user_3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'user' as const,
    status: 'active' as const,
    created_at: '2024-01-17T11:20:00Z',
    last_login: '2024-01-20T12:30:00Z',
    company: 'Marketing Agency',
    permissions: ['read', 'write'],
    balance: 89.50,
    currency: 'USD',
    project_id: 'proj_2'
  },
  {
    id: 'user_4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'user' as const,
    status: 'inactive' as const,
    created_at: '2024-01-18T16:45:00Z',
    last_login: '2024-01-19T10:15:00Z',
    company: 'E-commerce Store',
    permissions: ['read'],
    balance: 0,
    currency: 'USD',
    project_id: 'proj_3'
  },
  {
    id: 'user_5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'user' as const,
    status: 'suspended' as const,
    created_at: '2024-01-19T08:30:00Z',
    last_login: '2024-01-19T15:20:00Z',
    company: 'Startup Inc',
    permissions: ['read'],
    balance: 15.25,
    currency: 'USD',
    project_id: 'proj_4'
  }
];

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false; // Simplified check
}

export async function GET(request: NextRequest) {
  try {
    // Check admin permissions
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';

    let filteredUsers = mockUsers;

    // Apply search filter
    if (search) {
      filteredUsers = filteredUsers.filter(user =>
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.company?.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Apply role filter
    if (role) {
      filteredUsers = filteredUsers.filter(user => user.role === role);
    }

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return NextResponse.json({
      users: paginatedUsers,
      total: filteredUsers.length,
      page,
      limit
    });

  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, role, company } = body;

    if (!name || !email || !role) {
      return NextResponse.json({
        message: 'Missing required fields: name, email, role'
      }, { status: 400 });
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name,
      email,
      role,
      status: 'active' as const,
      created_at: new Date().toISOString(),
      last_login: new Date().toISOString(),
      company: company || '',
      permissions: role === 'admin' ? ['read', 'write', 'admin', 'impersonate'] :
                   role === 'supervisor' ? ['read', 'write', 'manage_agents'] :
                   ['read', 'write'],
      balance: 0,
      currency: 'USD',
      project_id: role === 'admin' ? undefined : `proj_${Date.now()}`
    };

    mockUsers.push(newUser);

    return NextResponse.json(newUser, { status: 201 });

  } catch (error) {
    console.error("Failed to create user:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
