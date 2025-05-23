import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock user data - in a real app, this would come from your database
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
    permissions: ['read', 'write', 'admin', 'impersonate']
  },
  {
    id: 'user_2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'supervisor' as const,
    status: 'active' as const,
    created_at: '2024-01-16T09:15:00Z',
    last_login: '2024-01-20T13:45:00Z',
    company: 'Tech Solutions Inc',
    permissions: ['read', 'write', 'manage_agents']
  },
  {
    id: 'user_3',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    role: 'agent' as const,
    status: 'active' as const,
    created_at: '2024-01-17T11:20:00Z',
    last_login: '2024-01-20T12:30:00Z',
    company: 'Support Team Ltd',
    permissions: ['read', 'write']
  },
  {
    id: 'user_4',
    name: 'Alice Brown',
    email: 'alice.brown@example.com',
    role: 'user' as const,
    status: 'inactive' as const,
    created_at: '2024-01-18T16:45:00Z',
    last_login: '2024-01-19T10:15:00Z',
    company: 'Customer Corp',
    permissions: ['read']
  },
  {
    id: 'user_5',
    name: 'Charlie Wilson',
    email: 'charlie.wilson@example.com',
    role: 'agent' as const,
    status: 'suspended' as const,
    created_at: '2024-01-19T08:30:00Z',
    last_login: '2024-01-19T15:20:00Z',
    company: 'Support Team Ltd',
    permissions: ['read']
  }
];

// Helper function to check if user has admin permissions
function hasAdminPermissions(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

/**
 * GET /api/admin/users/[id]
 * Get a specific user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const user = mockUsers.find(u => u.id === id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);

  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT /api/admin/users/[id]
 * Update a specific user
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedUser = { ...mockUsers[userIndex], ...body };

    // Update permissions based on role if role changed
    if (body.role && body.role !== mockUsers[userIndex].role) {
      updatedUser.permissions = body.role === 'admin' ? ['read', 'write', 'admin', 'impersonate'] :
                                body.role === 'supervisor' ? ['read', 'write', 'manage_agents'] :
                                ['read', 'write'];
    }

    mockUsers[userIndex] = updatedUser;

    return NextResponse.json(updatedUser);

  } catch (error) {
    console.error("Failed to update user:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a specific user
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!hasAdminPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const userIndex = mockUsers.findIndex(u => u.id === id);

    if (userIndex === -1) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prevent deleting the last admin
    const user = mockUsers[userIndex];
    if (user.role === 'admin') {
      const adminCount = mockUsers.filter(u => u.role === 'admin').length;
      if (adminCount <= 1) {
        return NextResponse.json({
          message: 'Cannot delete the last admin user'
        }, { status: 400 });
      }
    }

    mockUsers.splice(userIndex, 1);

    return NextResponse.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error("Failed to delete user:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
