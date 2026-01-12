import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { ApiKeyService } from '@/lib/api-keys/service'
import { ApiResponse } from '@/lib/field-mapping/types'

const apiKeyService = new ApiKeyService()

// GET /api/v1/api-keys/[id] - Get specific API key
export async function GET(
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

    const apiKey = await apiKeyService.getApiKey(params.id, projectId)

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'API key not found'
      } as ApiResponse, { status: 404 })
    }

    // Transform to match frontend interface
    const transformedKey = {
      id: apiKey.id,
      name: apiKey.name,
      key: `${apiKey.keyPrefix}...`, // Only show prefix for security
      permissions: apiKey.permissions.length > 0 ? apiKey.permissions[0].actions.join(',') : 'read',
      active: apiKey.isActive,
      created: apiKey.createdAt.toISOString().split('T')[0],
      expires: apiKey.expiresAt ? apiKey.expiresAt.toISOString().split('T')[0] : undefined,
      lastUsed: apiKey.lastUsedAt ? apiKey.lastUsedAt.toISOString().split('T')[0] : undefined
    }

    const response: ApiResponse = {
      success: true,
      data: transformedKey
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching API key:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch API key',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// DELETE /api/v1/api-keys/[id] - Delete API key
export async function DELETE(
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

    await apiKeyService.deleteApiKey(params.id, projectId)

    const response: ApiResponse = {
      success: true,
      message: 'API key deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error deleting API key:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete API key',
      message: error.message || 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// PUT /api/v1/api-keys/[id] - Update API key
export async function PUT(
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

    const body = await request.json()
    const { projectId, ...updateData } = body

    if (!projectId) {
      return NextResponse.json({
        success: false,
        error: 'Project ID is required'
      } as ApiResponse, { status: 400 })
    }

    const updatedKey = await apiKeyService.updateApiKey(params.id, projectId, updateData)

    // Transform to match frontend interface
    const transformedKey = {
      id: updatedKey.id,
      name: updatedKey.name,
      key: `${updatedKey.keyPrefix}...`,
      permissions: updatedKey.permissions.length > 0 ? updatedKey.permissions[0].actions.join(',') : 'read',
      active: updatedKey.isActive,
      created: updatedKey.createdAt.toISOString().split('T')[0],
      expires: updatedKey.expiresAt ? updatedKey.expiresAt.toISOString().split('T')[0] : undefined,
      lastUsed: updatedKey.lastUsedAt ? updatedKey.lastUsedAt.toISOString().split('T')[0] : undefined
    }

    const response: ApiResponse = {
      success: true,
      data: transformedKey,
      message: 'API key updated successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error updating API key:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update API key',
      message: error.message || 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}