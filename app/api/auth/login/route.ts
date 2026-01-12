import { NextResponse } from 'next/server';
import { type NextRequest } from 'next/server';

// Mock user database removed for security. Use real DB only.

// Generate a simple token (in real app, use JWT)
function generateToken(user: any): string {
  return `Bearer_${user.id}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// POST handler removed: use real DB authentication only.

// GET handler removed: demo credentials endpoint disabled for security.
