import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FieldTransformer } from '@/lib/field-mapping/transformer'
import { DataValidator } from '@/lib/validation/validator'
import { ApiResponse } from '@/lib/field-mapping/types'

// GET /api/v1/users/[id] - Get user by ID
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

    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      } as ApiResponse, { status: 400 })
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        nickname: true,
        name: true,
        firstName: true,
        middleName: true,
        lastName: true,
        avatar: true,
        mobile: true,
        email: true,
        about: true,
        country: true,
        isActive: true,
        isArchived: true,
        lastLoginAt: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            projects: true,
            contacts: true,
            roles: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse, { status: 404 })
    }

    // Transform to API format
    const transformedUser = FieldTransformer.toApiFormat('user', user)

    const response: ApiResponse = {
      success: true,
      data: transformedUser
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// PUT /api/v1/users/[id] - Update user
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

    const { id } = params
    const body = await request.json()

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      } as ApiResponse, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isActive: true }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse, { status: 404 })
    }

    // Validate input data
    const validation = DataValidator.validateUpdate('user', body)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Validation failed',
        errors: validation.errors
      } as ApiResponse, { status: 400 })
    }

    // Transform API data to database format
    const dbData = FieldTransformer.toDbFormat('user', validation.data)

    // Add metadata
    dbData.updatedBy = session.user.id

    // Update user
    const user = await prisma.user.update({
      where: { id },
      data: dbData,
      select: {
        id: true,
        nickname: true,
        name: true,
        firstName: true,
        middleName: true,
        lastName: true,
        avatar: true,
        mobile: true,
        email: true,
        about: true,
        country: true,
        isActive: true,
        isArchived: true,
        lastLoginAt: true,
        emailVerified: true,
        onboardingCompleted: true,
        createdAt: true,
        updatedAt: true
      }
    })

    // Transform to API format
    const transformedUser = FieldTransformer.toApiFormat('user', user)

    const response: ApiResponse = {
      success: true,
      data: transformedUser,
      message: 'User updated successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error updating user:', error)

    // Handle Prisma unique constraint violations
    if (error.code === 'P2002') {
      const field = error.meta?.target?.[0] || 'field'
      return NextResponse.json({
        success: false,
        error: 'Duplicate entry',
        message: `A user with this ${field} already exists`,
        errors: [{
          field,
          message: `${field} must be unique`,
          code: 'DUPLICATE_ENTRY'
        }]
      } as ApiResponse, { status: 409 })
    }

    // Handle record not found
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse, { status: 404 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to update user',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// DELETE /api/v1/users/[id] - Delete user (soft delete)
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

    const { id } = params

    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      } as ApiResponse, { status: 400 })
    }

    // Prevent users from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json({
        success: false,
        error: 'Cannot delete your own account'
      } as ApiResponse, { status: 400 })
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id },
      select: { id: true, isActive: true, isArchived: true }
    })

    if (!existingUser) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse, { status: 404 })
    }

    if (existingUser.isArchived) {
      return NextResponse.json({
        success: false,
        error: 'User is already deleted'
      } as ApiResponse, { status: 400 })
    }

    // Soft delete user by setting isActive to false and isArchived to true
    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive: false,
        isArchived: true,
        updatedBy: session.user.id
      },
      select: {
        id: true,
        isActive: true,
        isArchived: true,
        updatedAt: true
      }
    })

    const response: ApiResponse = {
      success: true,
      data: {
        id: user.id,
        deleted: true,
        deleted_at: user.updatedAt
      },
      message: 'User deleted successfully'
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Error deleting user:', error)

    // Handle record not found
    if (error.code === 'P2025') {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      } as ApiResponse, { status: 404 })
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to delete user',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}