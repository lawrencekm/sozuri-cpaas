import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ApiKeyService } from '@/lib/api-keys/service'
import { ApiResponse } from '@/lib/field-mapping/types'

const apiKeyService = new ApiKeyService()

// POST /api/v1/api-keys/[id]/regenerate - Regenerate API key
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const result = await apiKeyService.rotateApiKey(params.id, projectId)

    // Transform to match frontend interface
    const transformedKey = {
      id: result.apiKey.id,
      name: result.apiKey.name,
      key: `${result.apiKey.keyPrefix}...`,
      permissions: result.apiKey.permissions.length > 0 ? result.apiKey.permissions[0].actions.join(',') : 'read',
      active: result.apiKey.isActive,
      created: result.apiKey.createdAt.toISOString().split('T')[0],
      expires: result.apiKey.expiresAt ? result.apiKey.expiresAt.toISOString().split('T')[0] : undefined,
      lastUsed: result.apiKey.lastUsedAt ? result.apiKey.lastUsedAt.toISOString().split('T')[0] : undefined
    }

    const response: ApiResponse = {
      success: true,
      data: {
        key: result.key, // Return the new full key
        apiKey: transformedKey
      },
      message: 'API key regenerated successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error regenerating API key:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to regenerate API key',
      message: error.message || 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}