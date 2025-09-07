import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

// GET /api/v1/team/roles - Get available roles and permissions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all active roles
    const roles = await prisma.role.findMany({
      where: {
        isActive: true,
        isArchived: false
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Get all permissions
    const permissions = await prisma.permission.findMany({
      orderBy: [
        { resource: 'asc' },
        { action: 'asc' }
      ]
    })

    // Define default project roles (these are used in collaborations)
    const projectRoles = [
      {
        id: 'owner',
        name: 'Owner',
        description: 'Full access to all project features and settings',
        permissions: ['all'],
        isSystemRole: true
      },
      {
        id: 'admin',
        name: 'Administrator',
        description: 'Can manage team members, settings, and all project features',
        permissions: [
          'projects.read', 'projects.update', 'projects.delete',
          'campaigns.create', 'campaigns.read', 'campaigns.update', 'campaigns.delete',
          'contacts.create', 'contacts.read', 'contacts.update', 'contacts.delete',
          'messages.create', 'messages.read', 'messages.update', 'messages.delete',
          'templates.create', 'templates.read', 'templates.update', 'templates.delete',
          'analytics.read', 'webhooks.create', 'webhooks.read', 'webhooks.update', 'webhooks.delete',
          'team.invite', 'team.manage', 'team.remove'
        ],
        isSystemRole: true
      },
      {
        id: 'manager',
        name: 'Manager',
        description: 'Can create and manage campaigns, contacts, and view analytics',
        permissions: [
          'projects.read',
          'campaigns.create', 'campaigns.read', 'campaigns.update',
          'contacts.create', 'contacts.read', 'contacts.update',
          'messages.create', 'messages.read', 'messages.update',
          'templates.create', 'templates.read', 'templates.update',
          'analytics.read'
        ],
        isSystemRole: true
      },
      {
        id: 'editor',
        name: 'Editor',
        description: 'Can create and edit content but cannot delete or manage settings',
        permissions: [
          'projects.read',
          'campaigns.create', 'campaigns.read', 'campaigns.update',
          'contacts.create', 'contacts.read', 'contacts.update',
          'messages.create', 'messages.read',
          'templates.create', 'templates.read', 'templates.update'
        ],
        isSystemRole: true
      },
      {
        id: 'viewer',
        name: 'Viewer',
        description: 'Read-only access to project data and analytics',
        permissions: [
          'projects.read',
          'campaigns.read',
          'contacts.read',
          'messages.read',
          'templates.read',
          'analytics.read'
        ],
        isSystemRole: true
      }
    ]

    return NextResponse.json({
      success: true,
      data: {
        systemRoles: roles.map(role => ({
          id: role.id,
          name: role.name,
          description: role.description,
          permissions: role.permissions.map(rp => rp.permission.name),
          isSystemRole: false
        })),
        projectRoles: projectRoles,
        availablePermissions: permissions.map(permission => ({
          id: permission.id,
          name: permission.name,
          description: permission.description,
          resource: permission.resource,
          action: permission.action
        }))
      }
    })

  } catch (error) {
    console.error('Error fetching roles:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/v1/team/roles - Create custom role
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, description, permissions } = body

    if (!name || !permissions || !Array.isArray(permissions)) {
      return NextResponse.json(
        { error: 'Name and permissions array are required' },
        { status: 400 }
      )
    }

    // Check if role name already exists
    const existingRole = await prisma.role.findUnique({
      where: { name: name }
    })

    if (existingRole) {
      return NextResponse.json({ error: 'Role name already exists' }, { status: 400 })
    }

    // Verify permissions exist
    const validPermissions = await prisma.permission.findMany({
      where: {
        id: { in: permissions }
      }
    })

    if (validPermissions.length !== permissions.length) {
      return NextResponse.json({ error: 'Some permissions are invalid' }, { status: 400 })
    }

    // Create role
    const role = await prisma.role.create({
      data: {
        name: name,
        description: description,
        isActive: true,
        permissions: {
          create: permissions.map((permissionId: string) => ({
            permissionId: permissionId
          }))
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions.map(rp => rp.permission.name),
        isSystemRole: false
      }
    })

  } catch (error) {
    console.error('Error creating role:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
