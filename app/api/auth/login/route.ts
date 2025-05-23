import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock user database
const mockUsers = [
  {
    id: 'user_1',
    name: 'John Doe',
    email: 'admin@demo.com',
    password: 'admin123', // In real app, this would be hashed
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
    email: 'user@demo.com',
    password: 'user123',
    role: 'user' as const,
    status: 'active' as const,
    created_at: '2024-01-16T09:15:00Z',
    last_login: '2024-01-20T13:45:00Z',
    company: 'Tech Solutions Inc',
    permissions: ['read', 'write']
  },
  {
    id: 'user_3',
    name: 'Demo Admin',
    email: 'demo@admin.com',
    password: 'demo123',
    role: 'admin' as const,
    status: 'active' as const,
    created_at: '2024-01-17T11:20:00Z',
    last_login: '2024-01-20T12:30:00Z',
    company: 'SOZURI',
    permissions: ['read', 'write', 'admin', 'impersonate']
  }
];

// Generate a simple token (in real app, use JWT)
function generateToken(user: any): string {
  return `Bearer_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * POST /api/auth/login
 * Authenticate user and return token
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        message: 'Email and password are required'
      }, { status: 400 });
    }

    // Find user by email
    const user = mockUsers.find(u => u.email === email);
    
    if (!user) {
      return NextResponse.json({
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Check password (in real app, compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json({
        message: 'Invalid credentials'
      }, { status: 401 });
    }

    // Generate token
    const token = generateToken(user);

    // Update last login
    user.last_login = new Date().toISOString();

    // Return user data and token (exclude password)
    const { password: _, ...userWithoutPassword } = user;
    
    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: 'Login successful'
    });

  } catch (error) {
    console.error("Login error:", error);
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        message: 'Invalid JSON body'
      }, { status: 400 });
    }
    return NextResponse.json({
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}

/**
 * GET /api/auth/login
 * Get demo login credentials for development
 */
export async function GET() {
  return NextResponse.json({
    message: 'Demo login credentials',
    credentials: [
      {
        email: 'admin@demo.com',
        password: 'admin123',
        role: 'admin',
        description: 'Admin user with full access'
      },
      {
        email: 'demo@admin.com',
        password: 'demo123',
        role: 'admin',
        description: 'Demo admin user'
      },
      {
        email: 'user@demo.com',
        password: 'user123',
        role: 'user',
        description: 'Regular user'
      }
    ]
  });
}
