import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const projects = await prisma.project.findMany({
      where: { 
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
      },
      orderBy: { createdAt: 'desc' },
      include: { 
        _count: { 
          select: { 
            campaigns: true, 
            messageLogs: true,
            collaborations: true
          } 
        } 
      },
    })
    
    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects' },
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

    // Allow only whitelisted fields
    const allowedKeys = new Set([
      'name', 'description', 'code', 'timezone', 'currency', 'defaultSenderId', 'webhookUrl', 'webhookSecret',
      'isTrial', 'trialExpiresAt', 'accountType', 'details'
    ])
    const data: any = { userId: session.user.id }
    for (const key of Object.keys(body || {})) {
      if (allowedKeys.has(key)) data[key] = body[key]
    }

    if (!data.name || typeof data.name !== 'string' || !data.name.trim()) {
      return NextResponse.json({ error: 'name is required' }, { status: 400 })
    }

    const project = await prisma.project.create({ data })
    return NextResponse.json(project, { status: 201 })
  } catch (err: any) {
    console.error(err)
    return NextResponse.json({ error: 'Failed to create project', details: err?.message }, { status: 500 })
  }
}