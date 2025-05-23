import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

/**
 * POST /api/auth/logout
 * Logout user and invalidate token
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader?.includes('Bearer')) {
      return NextResponse.json({
        message: 'No active session found'
      }, { status: 401 });
    }

    // In a real app, you would:
    // 1. Add the token to a blacklist
    // 2. Update user's last logout time
    // 3. Clear any session data

    return NextResponse.json({
      message: 'Logout successful'
    });

  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json({
      message: 'Internal Server Error'
    }, { status: 500 });
  }
}
