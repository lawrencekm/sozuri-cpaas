import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const automation = await prisma.automation.findFirst({
      where: {
        id: params.id,
        project: {
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
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        project: true
      }
    })

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    return NextResponse.json(automation)
  } catch (error) {
    console.error('Error fetching automation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch automation' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Verify automation exists and user has access
    const existingAutomation = await prisma.automation.findFirst({
      where: {
        id: params.id,
        project: {
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
      }
    })

    if (!existingAutomation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    const automation = await prisma.automation.update({
      where: { id: params.id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description && { description: body.description }),
        ...(body.trigger_type && { triggerType: body.trigger_type }),
        ...(body.trigger_config && { triggerConfig: body.trigger_config }),
        ...(body.action_type && { actionType: body.action_type }),
        ...(body.action_config && { actionConfig: body.action_config }),
        ...(typeof body.is_active === 'boolean' && { isActive: body.is_active }),
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json(automation)
  } catch (error) {
    console.error('Error updating automation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update automation' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Verify automation exists and user has access
    const automation = await prisma.automation.findFirst({
      where: {
        id: params.id,
        project: {
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
      }
    })

    if (!automation) {
      return NextResponse.json({ error: 'Automation not found' }, { status: 404 })
    }

    await prisma.automation.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting automation:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete automation' },
      { status: 500 }
    )
  }
}