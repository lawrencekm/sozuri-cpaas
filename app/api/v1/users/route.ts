import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { prisma } from '@/lib/prisma'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { FieldTransformer } from '@/lib/field-mapping/transformer'
import { DataValidator } from '@/lib/validation/validator'
import { ApiResponse, ListResponse } from '@/lib/field-mapping/types'

// GET /api/v1/users - List users with filtering and pagination
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
    
    // Extract and validate query parameters
    const queryParams = {
      page: searchParams.get('page') || '1',
      limit: searchParams.get('limit') || '20',
      search: searchParams.get('search') || undefined,
      email: searchParams.get('email') || undefined,
      mobile: searchParams.get('mobile') || undefined,
      is_active: searchParams.get('is_active') || undefined,
      sort_by: searchParams.get('sort_by') || 'created_at',
      sort_order: searchParams.get('sort_order') || 'desc'
    }

    // Validate query parameters
    const validation = DataValidator.validateQuery('user', queryParams)
    if (!validation.isValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid query parameters',
        errors: validation.errors
      } as ApiResponse, { status: 400 })
    }

    // Parse pagination parameters
    const page = Math.max(1, parseInt(queryParams.page, 10))
    const limit = Math.min(100, Math.max(1, parseInt(queryParams.limit, 10)))
    const skip = (page - 1) * limit

    // Build where clause for filtering
    const where: any = {}
    
    if (queryParams.search) {
      where.OR = [
        { name: { contains: queryParams.search, mode: 'insensitive' } },
        { firstName: { contains: queryParams.search, mode: 'insensitive' } },
        { lastName: { contains: queryParams.search, mode: 'insensitive' } },
        { email: { contains: queryParams.search, mode: 'insensitive' } }
      ]
    }

    if (queryParams.email) {
      where.email = { contains: queryParams.email, mode: 'insensitive' }
    }

    if (queryParams.mobile) {
      where.mobile = { contains: queryParams.mobile }
    }

    if (queryParams.is_active !== undefined) {
      where.isActive = queryParams.is_active === 'true'
    }

    // Build orderBy clause
    const orderBy: any = {}
    const sortField = FieldTransformer.getDbFieldName('user', queryParams.sort_by)
    orderBy[sortField] = queryParams.sort_order === 'asc' ? 'asc' : 'desc'

    // Execute queries
    const [total, users] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
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
              contacts: true
            }
          }
        }
      })
    ])

    // Transform to API format
    const transformedUsers = FieldTransformer.toApiFormatArray('user', users)

    const response: ApiResponse<ListResponse> = {
      success: true,
      data: {
        items: transformedUsers,
        total,
        page,
        limit
      },
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch users',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}

// POST /api/v1/users - Create new user
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

    // Validate input data
    const validation = DataValidator.validateCreate('user', body)
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
    dbData.createdBy = session.user.id
    dbData.updatedBy = session.user.id

    // Create user
    const user = await prisma.user.create({
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
      message: 'User created successfully'
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error: any) {
    console.error('Error creating user:', error)

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

    return NextResponse.json({
      success: false,
      error: 'Failed to create user',
      message: 'An internal server error occurred'
    } as ApiResponse, { status: 500 })
  }
}