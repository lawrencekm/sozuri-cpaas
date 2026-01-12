import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET(request: Request) {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { searchParams } = new URL(request.url)
        const projectId = searchParams.get('project_id') || searchParams.get('projectId')

        if (!projectId) {
            return NextResponse.json({ error: 'project_id or projectId is required' }, { status: 400 })
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

        const automations = await prisma.automation.findMany({
            where: { projectId },
            orderBy: { createdAt: 'desc' },
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

        return NextResponse.json(automations)
    } catch (error) {
        console.error('Error fetching automations:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch automations' },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()

        // Handle both project_id and projectId for backward compatibility
        const projectId = body.project_id || body.projectId

        // Validate required fields
        if (!projectId || !body.name || !body.trigger_type || !body.action_type) {
            return NextResponse.json({
                error: 'projectId, name, trigger_type, and action_type are required'
            }, { status: 400 })
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

        const automation = await prisma.automation.create({
            data: {
                projectId: projectId,
                userId: session.user.id,
                name: body.name,
                description: body.description,
                triggerType: body.trigger_type,
                triggerConfig: body.trigger_config || {},
                actionType: body.action_type,
                actionConfig: body.action_config || {},
                isActive: body.is_active ?? true
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

        return NextResponse.json(automation, { status: 201 })
    } catch (error) {
        console.error('Error creating automation:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create automation' },
            { status: 500 }
        )
    }
}