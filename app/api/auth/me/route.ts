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
  }
];

// Helper function to get current user from token
function getCurrentUserFromToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  // In a real app, you would decode the JWT token to get user info
  // For demo purposes, we'll return the admin user if there's any auth header
  if (authHeader?.includes('Bearer')) {
    // Check if it's an impersonation token
    if (authHeader.includes('impersonation_token')) {
      // Extract user ID from impersonation token (simplified)
      const tokenParts = authHeader.split('_');
      if (tokenParts.length >= 3) {
        const userId = tokenParts[2];
        return mockUsers.find(u => u.id === userId) || mockUsers[0];
      }
    }
    
    // Return default admin user
    return mockUsers[0];
  }
  
  return null;
}

/**
 * GET /api/auth/me
 * Get current user profile information
 */
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.includes('Bearer')) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const user = getCurrentUserFromToken(request);
    
    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Check if currently impersonating
    const isImpersonating = authHeader.includes('impersonation_token');
    
    const response = {
      ...user,
      isImpersonating,
      originalUserId: isImpersonating ? 'user_1' : undefined,
      originalUserName: isImpersonating ? 'John Doe' : undefined
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error("Failed to get user profile:", error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
