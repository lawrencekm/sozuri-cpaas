import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock user data
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
  }
];

// Helper function to get current user from token
function getCurrentUser(request: NextRequest) {
  // In a real app, you would decode the JWT token to get user info
  // For demo purposes, we'll return the admin user
  return mockUsers.find(u => u.role === 'admin');
}

// Helper function to check if currently impersonating
function isImpersonating(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  // In a real app, you would check the JWT token for impersonation context
  return authHeader?.includes('impersonation_token') || false;
}

/**
 * POST /api/auth/stop-impersonation
 * Stop impersonating and return to original user
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.includes('Bearer')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    if (!isImpersonating(request)) {
      return NextResponse.json({ 
        message: 'Not currently impersonating any user' 
      }, { status: 400 });
    }

    // In a real app, you would:
    // 1. Decode the impersonation token
    // 2. Extract the original user ID
    // 3. Create a new regular JWT token for the original user
    // 4. Invalidate the impersonation token

    const originalUser = getCurrentUser(request);
    if (!originalUser) {
      return NextResponse.json({ message: 'Original user not found' }, { status: 404 });
    }

    const regularToken = `regular_token_${originalUser.id}_${Date.now()}`;

    return NextResponse.json({
      user: {
        ...originalUser,
        isImpersonating: false
      },
      token: regularToken
    });

  } catch (error) {
    console.error("Failed to stop impersonation:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
