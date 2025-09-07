import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/v1/team/[memberId] - Get team member details
export async function GET(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
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
          { userId: session.user.id },
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

    // Get member details
    const member = await prisma.user.findUnique({
      where: { id: params.memberId },
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
        isActive: true,
        about: true
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 })
    }

    // Check if member is owner or collaborator
    let memberRole = null
    let permissions: string[] = []
    let collaborationId = null

    if (project.userId === params.memberId) {
      memberRole = 'owner'
      permissions = ['all']
    } else {
      const collaboration = await prisma.collaboration.findUnique({
        where: {
          projectId_userId: {
            projectId: projectId,
            userId: params.memberId
          }
        }
      })

      if (!collaboration || !collaboration.isActive) {
        return NextResponse.json({ error: 'Member not found in this project' }, { status: 404 })
      }

      memberRole = collaboration.role
      permissions = collaboration.permissions
      collaborationId = collaboration.id
    }

    return NextResponse.json({
      success: true,
      data: {
        id: member.id,
        name: member.name || `${member.firstName || ''} ${member.lastName || ''}`.trim() || 'Unknown',
        email: member.email,
        mobile: member.mobile,
        avatar: member.avatar || member.profileImage,
        about: member.about,
        role: memberRole,
        permissions: permissions,
        status: member.isActive ? 'active' : 'inactive',
        joinedDate: member.createdAt.toISOString(),
        lastActive: member.lastLoginAt?.toISOString() || member.createdAt.toISOString(),
        isOwner: project.userId === params.memberId,
        collaborationId: collaborationId
      }
    })

  } catch (error) {
    console.error('Error fetching member details:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT /api/v1/team/[memberId] - Update team member role/permissions
export async function PUT(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { projectId, role, permissions } = body

    if (!projectId || !role) {
      return NextResponse.json(
        { error: 'Project ID and role are required' },
        { status: 400 }
      )
    }

    // Verify user is project owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
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

    // Cannot update project owner
    if (project.userId === params.memberId) {
      return NextResponse.json({ error: 'Cannot update project owner role' }, { status: 400 })
    }

    // Update collaboration
    const collaboration = await prisma.collaboration.update({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: params.memberId
        }
      },
      data: {
        role: role,
        permissions: permissions || []
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
            isActive: true
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
        role: collaboration.role,
        permissions: collaboration.permissions,
        status: collaboration.user.isActive ? 'active' : 'inactive'
      }
    })

  } catch (error) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/v1/team/[memberId] - Remove team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: { memberId: string } }
) {
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

    // Verify user is project owner or admin
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        OR: [
          { userId: session.user.id },
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

    // Cannot remove project owner
    if (project.userId === params.memberId) {
      return NextResponse.json({ error: 'Cannot remove project owner' }, { status: 400 })
    }

    // Remove collaboration
    await prisma.collaboration.delete({
      where: {
        projectId_userId: {
          projectId: projectId,
          userId: params.memberId
        }
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Team member removed successfully'
    })

  } catch (error) {
    console.error('Error removing team member:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
