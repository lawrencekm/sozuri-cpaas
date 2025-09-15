import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function validateProjectAccess(
  request: NextRequest,
  projectId?: string
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        error: NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      };
    }

    // If no projectId provided, just check authentication
    if (!projectId) {
      return { user };
    }

    // For admin users, allow all access
    if (user.role === 'admin') {
      return { user };
    }

    // Check project access
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: user.id },
          {
            collaborations: {
              some: {
                userId: user.id,
                isActive: true
              }
            }
          }
        ]
      },
      include: {
        collaborations: true
      }
    });

    if (!project) {
      return {
        error: NextResponse.json(
          { message: 'Project not found or access denied' },
          { status: 403 }
        )
      };
    }

    return { user, project };
  } catch (error) {
    console.error('Project access validation failed:', error);
    return {
      error: NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    };
  }
}

export async function validateProjectOwnership(
  request: NextRequest,
  projectId: string
) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return {
        error: NextResponse.json(
          { message: 'Unauthorized' },
          { status: 401 }
        )
      };
    }

    // For admin users, allow all access
    if (user.role === 'admin') {
      return { user };
    }

    // Check project ownership
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId: user.id
      }
    });

    if (!project) {
      return {
        error: NextResponse.json(
          { message: 'Project not found or not owned by user' },
          { status: 403 }
        )
      };
    }

    return { user, project };
  } catch (error) {
    console.error('Project ownership validation failed:', error);
    return {
      error: NextResponse.json(
        { message: 'Internal server error' },
        { status: 500 }
      )
    };
  }
}
