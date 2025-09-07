import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/v1/team - Get team members for current project
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 })
    }

    // Verify user has access to this project
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Owner
          { 
            collaborations: {
              some: {
                userId: session.user.id,
                isActive: true
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or access denied' }, { status: 404 })
    }

    // Get team members (collaborations + owner)
    const collaborations = await prisma.collaboration.findMany({
      where: {
        projectId: projectId,
        isActive: true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            avatar: true,
            profileImage: true,
            lastLoginAt: true,
            createdAt: true,
            isActive: true
          }
        }
      },
      orderBy: {
        invitedAt: 'desc'
      }
    })

    // Get project owner
    const owner = await prisma.user.findUnique({
      where: { id: project.userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        avatar: true,
        profileImage: true,
        lastLoginAt: true,
        createdAt: true,
        isActive: true
      }
    })

    const teamMembers = [
      // Project owner
      ...(owner ? [{
        id: owner.id,
        name: owner.name || `${owner.firstName || ''} ${owner.lastName || ''}`.trim() || 'Unknown',
        email: owner.email,
        mobile: owner.mobile,
        avatar: owner.avatar || owner.profileImage,
        role: 'owner',
        permissions: ['all'],
        status: owner.isActive ? 'active' : 'inactive',
        joinedDate: project.createdAt.toISOString(),
        lastActive: owner.lastLoginAt?.toISOString() || owner.createdAt.toISOString(),
        invitedAt: project.createdAt.toISOString(),
        acceptedAt: project.createdAt.toISOString(),
        isOwner: true
      }] : []),
      // Collaborators
      ...collaborations.map(collab => ({
        id: collab.user.id,
        name: collab.user.name || `${collab.user.firstName || ''} ${collab.user.lastName || ''}`.trim() || 'Unknown',
        email: collab.user.email,
        mobile: collab.user.mobile,
        avatar: collab.user.avatar || collab.user.profileImage,
        role: collab.role,
        permissions: collab.permissions,
        status: collab.user.isActive ? (collab.acceptedAt ? 'active' : 'pending') : 'inactive',
        joinedDate: collab.user.createdAt.toISOString(),
        lastActive: collab.user.lastLoginAt?.toISOString() || collab.user.createdAt.toISOString(),
        invitedAt: collab.invitedAt.toISOString(),
        acceptedAt: collab.acceptedAt?.toISOString(),
        isOwner: false,
        collaborationId: collab.id
      }))
    ]

    return NextResponse.json({
      success: true,
      data: {
        teamMembers,
        totalMembers: teamMembers.length,
        activeMembers: teamMembers.filter(m => m.status === 'active').length,
        pendingInvitations: teamMembers.filter(m => m.status === 'pending').length
      }
    })

  } catch (error) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/v1/team - Invite new team member
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, email, role, permissions } = body

    if (!projectId || !email || !role) {
      return NextResponse.json(
        { error: 'Project ID, email, and role are required' },
        { status: 400 }
      )
    }

    // Verify user is project owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id }, // Owner
          { 
            collaborations: {
              some: {
                userId: session.user.id,
                role: { in: ['admin', 'owner'] },
                isActive: true
              }
            }
          }
        ]
      }
    })

    if (!project) {
      return NextResponse.json({ error: 'Project not found or insufficient permissions' }, { status: 404 })
    }

    // Find user by email
    const invitedUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    })

    if (!invitedUser) {
      return NextResponse.json({ error: 'User not found with this email' }, { status: 404 })
    }

    // Check if user is already a collaborator
    const existingCollaboration = await prisma.collaboration.findUnique({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: invitedUser.id
        }
      }
    })

    if (existingCollaboration) {
      return NextResponse.json({ error: 'User is already a team member' }, { status: 400 })
    }

    // Create collaboration
    const collaboration = await prisma.collaboration.create({
      data: {
        projectId: projectId,
        userId: invitedUser.id,
        role: role,
        permissions: permissions || [],
        isActive: true,
        invitedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            firstName: true,
            lastName: true,
            email: true,
            mobile: true,
            avatar: true,
            profileImage: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: collaboration.user.id,
        name: collaboration.user.name || `${collaboration.user.firstName || ''} ${collaboration.user.lastName || ''}`.trim() || 'Unknown',
        email: collaboration.user.email,
        mobile: collaboration.user.mobile,
        avatar: collaboration.user.avatar || collaboration.user.profileImage,
        role: collaboration.role,
        permissions: collaboration.permissions,
        status: 'pending',
        invitedAt: collaboration.invitedAt.toISOString(),
        collaborationId: collaboration.id
      }
    })

  } catch (error) {
    console.error('Error inviting team member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
