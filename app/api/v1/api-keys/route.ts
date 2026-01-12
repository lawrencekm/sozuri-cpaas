import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ApiKeyService } from '@/lib/api-keys/service'
import { CreateApiKeyRequest } from '@/lib/api-keys/types'
import { ApiResponse, ListResponse } from '@/lib/field-mapping/types'

const apiKeyService = new ApiKeyService()

// GET /api/v1/api-keys - List API keys
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      } as ApiResponse, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')

    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse, { status: 400 })
    }

    // List API keys for the project
    const apiKeys = await apiKeyService.listApiKeys(projectId, session.user.id)

    // Transform to match the frontend interface
    const transformedKeys = apiKeys.map(key => ({
      id: key.id,
      name: key.name,
      key: `${key.keyPrefix}...`, // Only show prefix for security
      permissions: key.permissions.length > 0 ? key.permissions[0].actions.join(',') : 'read',
      active: key.isActive,
      created: key.createdAt.toISOString().split('T')[0],
      expires: key.expiresAt ? key.expiresAt.toISOString().split('T')[0] : undefined,
      lastUsed: key.lastUsedAt ? key.lastUsedAt.toISOString().split('T')[0] : undefined
    }))

    const response: ApiResponse<any[]> = {
      success: true,
      data: transformedKeys
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch API keys',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// POST /api/v1/api-keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      } as ApiResponse, { status: 401 })
    }

    const body = await request.json()
    const { name, permissions, expiresIn, projectId } = body

    if (!name || !permissions || !projectId) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: name, permissions, projectId'
      } as ApiResponse, { status: 400 })
    }

    // Map permissions to scopes
    const scopes = []
    if (permissions === 'read') {
      scopes.push('messaging:read', 'contacts:read', 'analytics:read')
    } else if (permissions === 'write') {
      scopes.push('messaging:send', 'messaging:read', 'contacts:read', 'contacts:write')
    } else if (permissions === 'admin') {
      scopes.push('messaging:send', 'messaging:read', 'contacts:read', 'contacts:write', 'campaigns:read', 'campaigns:write', 'analytics:read')
    }

    // Calculate expiration date
    let expiresAt: Date | undefined
    if (expiresIn && expiresIn !== 'never') {
      const now = new Date()
      if (expiresIn === '30days') {
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      } else if (expiresIn === '90days') {
        expiresAt = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000)
      } else if (expiresIn === '1year') {
        expiresAt = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000)
      }
    }

    const createRequest: CreateApiKeyRequest = {
      projectId,
      userId: session.user.id,
      name,
      permissions: [{
        resource: 'api',
        actions: permissions === 'read' ? ['read'] : permissions === 'write' ? ['read', 'write'] : ['read', 'write', 'admin']
      }],
      scopes,
      expiresAt
    }

    const result = await apiKeyService.createApiKey(createRequest)

    const response: ApiResponse = {
      success: true,
      data: {
        key: result.key,
        apiKey: {
          id: result.apiKey.id,
          name: result.apiKey.name,
          permissions: permissions,
          active: result.apiKey.isActive,
          created: result.apiKey.createdAt.toISOString().split('T')[0],
          expires: result.apiKey.expiresAt ? result.apiKey.expiresAt.toISOString().split('T')[0] : undefined
        }
      },
      message: 'API key created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Error creating API key:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create API key',
      message: error.message || 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}