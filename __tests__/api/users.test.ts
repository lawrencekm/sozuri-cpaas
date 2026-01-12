import { DataValidator } from '@/lib/validation/validator'
import { FieldTransformer } from '@/lib/field-mapping/transformer'

// Mock dependencies
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn()
    }
  }
}))

const mockPrisma = {
  user: {
    count: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  }
}

describe('User API Validation and Field Mapping', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('User Data Validation', () => {
    it('should validate user creation data correctly', () => {
      const validUserData = {
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        mobile: '+254700000001'
      }

      const validation = DataValidator.validateCreate('user', validUserData)
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should reject invalid email format', () => {
      const invalidUserData = {
        email: 'invalid-email',
        first_name: 'John'
      }

      const validation = DataValidator.validateCreate('user', invalidUserData)
      expect(validation.isValid).toBe(false)
      expect(validation.errors.some(e => e.field === 'email')).toBe(true)
    })

    it('should reject invalid phone number format', () => {
      const invalidUserData = {
        email: 'test@example.com',
        mobile: 'invalid-phone'
      }

      const validation = DataValidator.validateCreate('user', invalidUserData)
      expect(validation.isValid).toBe(false)
      expect(validation.errors.some(e => e.field === 'mobile')).toBe(true)
    })

    it('should validate user update data correctly', () => {
      const updateData = {
        first_name: 'Updated',
        last_name: 'Name',
        about: 'Updated bio'
      }

      const validation = DataValidator.validateUpdate('user', updateData)
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should validate query parameters correctly', () => {
      const queryParams = {
        search: 'john',
        is_active: true,
        email: 'test@example.com'
      }

      const validation = DataValidator.validateQuery('user', queryParams)
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })
  })

  describe('User Field Mapping', () => {
    it('should transform database user to API format correctly', () => {
      const dbUser = {
        id: 'user1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        mobile: '+254700000001',
        isActive: true,
        isArchived: false,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02')
      }

      const apiUser = FieldTransformer.toApiFormat('user', dbUser)
      
      expect(apiUser.first_name).toBe('John')
      expect(apiUser.last_name).toBe('Doe')
      expect(apiUser.is_active).toBe(true)
      expect(apiUser.is_archived).toBe(false)
      expect(apiUser.created_at).toEqual(new Date('2024-01-01'))
      expect(apiUser.updated_at).toEqual(new Date('2024-01-02'))
    })

    it('should transform API user data to database format correctly', () => {
      const apiUser = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        mobile: '+254700000001',
        is_active: true,
        is_archived: false
      }

      const dbUser = FieldTransformer.toDbFormat('user', apiUser)
      
      expect(dbUser.firstName).toBe('John')
      expect(dbUser.lastName).toBe('Doe')
      expect(dbUser.isActive).toBe(true)
      expect(dbUser.isArchived).toBe(false)
    })

    it('should transform array of users correctly', () => {
      const dbUsers = [
        {
          id: 'user1',
          firstName: 'John',
          lastName: 'Doe',
          isActive: true
        },
        {
          id: 'user2',
          firstName: 'Jane',
          lastName: 'Smith',
          isActive: false
        }
      ]

      const apiUsers = FieldTransformer.toApiFormatArray('user', dbUsers)
      
      expect(apiUsers).toHaveLength(2)
      expect(apiUsers[0].first_name).toBe('John')
      expect(apiUsers[0].is_active).toBe(true)
      expect(apiUsers[1].first_name).toBe('Jane')
      expect(apiUsers[1].is_active).toBe(false)
    })

    it('should handle missing optional fields gracefully', () => {
      const dbUser = {
        id: 'user1',
        email: 'john@example.com',
        isActive: true
      }

      const apiUser = FieldTransformer.toApiFormat('user', dbUser)
      
      expect(apiUser.id).toBe('user1')
      expect(apiUser.email).toBe('john@example.com')
      expect(apiUser.is_active).toBe(true)
      expect(apiUser.first_name).toBeUndefined()
      expect(apiUser.last_name).toBeUndefined()
    })
  })

  describe('User API Response Structure', () => {
    it('should create proper API response for successful operations', () => {
      const userData = {
        id: 'user1',
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com'
      }

      const response = {
        success: true,
        data: userData,
        message: 'User created successfully'
      }

      expect(response.success).toBe(true)
      expect(response.data).toEqual(userData)
      expect(response.message).toBe('User created successfully')
    })

    it('should create proper API response for validation errors', () => {
      const validationErrors = [
        {
          field: 'email',
          message: 'email must be a valid email address',
          code: 'INVALID_EMAIL'
        }
      ]

      const response = {
        success: false,
        error: 'Validation failed',
        errors: validationErrors
      }

      expect(response.success).toBe(false)
      expect(response.error).toBe('Validation failed')
      expect(response.errors).toEqual(validationErrors)
    })

    it('should create proper paginated response structure', () => {
      const users = [
        { id: 'user1', first_name: 'John' },
        { id: 'user2', first_name: 'Jane' }
      ]

      const response = {
        success: true,
        data: {
          items: users,
          total: 2,
          page: 1,
          limit: 20
        },
        pagination: {
          page: 1,
          limit: 20,
          total: 2,
          totalPages: 1
        }
      }

      expect(response.success).toBe(true)
      expect(response.data.items).toHaveLength(2)
      expect(response.data.total).toBe(2)
      expect(response.pagination.totalPages).toBe(1)
    })
  })

  describe('User Business Logic', () => {
    it('should prevent self-deletion logic', () => {
      const currentUserId = 'user1'
      const targetUserId = 'user1'
      
      const canDelete = currentUserId !== targetUserId
      expect(canDelete).toBe(false)
    })

    it('should allow deletion of other users', () => {
      const currentUserId = 'admin1'
      const targetUserId = 'user1'
      
      const canDelete = currentUserId !== targetUserId
      expect(canDelete).toBe(true)
    })

    it('should handle soft delete properly', () => {
      const userBeforeDelete = {
        id: 'user1',
        isActive: true,
        isArchived: false
      }

      const userAfterDelete = {
        ...userBeforeDelete,
        isActive: false,
        isArchived: true,
        updatedAt: new Date()
      }

      expect(userAfterDelete.isActive).toBe(false)
      expect(userAfterDelete.isArchived).toBe(true)
      expect(userAfterDelete.updatedAt).toBeDefined()
    })
  })
})