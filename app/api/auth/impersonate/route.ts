import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

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
  }
];

// Helper function to check if user has impersonation permissions
function hasImpersonationPermissions(request: NextRequest): boolean {
  // In a real app, you would verify the JWT token and check user permissions
  const authHeader = request.headers.get('authorization');
  return authHeader?.includes('Bearer') || false;
}

// Helper function to get current user from token
function getCurrentUser(request: NextRequest) {
  return mockUsers.find(u => u.role === 'admin');
}

export async function POST(request: NextRequest) {
  try {
    if (!hasImpersonationPermissions(request)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const currentUser = getCurrentUser(request);
    if (!currentUser || !currentUser.permissions?.includes('impersonate')) {
      return NextResponse.json({ 
        message: 'Insufficient permissions to impersonate users' 
      }, { status: 403 });
    }

    const body = await request.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ 
        message: 'Missing required field: userId' 
      }, { status: 400 });
    }

    const targetUser = mockUsers.find(u => u.id === userId);
    if (!targetUser) {
      return NextResponse.json({ message: 'Target user not found' }, { status: 404 });
    }

    if (targetUser.status !== 'active') {
      return NextResponse.json({ 
        message: 'Cannot impersonate inactive user' 
      }, { status: 400 });
    }

    // Prevent impersonating another admin (optional security measure)
    if (targetUser.role === 'admin' && currentUser.id !== targetUser.id) {
      return NextResponse.json({ 
        message: 'Cannot impersonate another admin user' 
      }, { status: 403 });
    }

    const impersonationToken = `impersonation_token_${targetUser.id}_${Date.now()}`;

    return NextResponse.json({
      user: {
        ...targetUser,
        isImpersonating: true,
        originalUserId: currentUser.id,
        originalUserName: currentUser.name
      },
      token: impersonationToken
    });

  } catch (error) {
    console.error("Failed to start impersonation:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
