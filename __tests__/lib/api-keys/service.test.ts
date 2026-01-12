import { ApiKeyService } from '@/lib/api-keys/service';
import { CreateApiKeyRequest, API_SCOPES } from '@/lib/api-keys/types';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    apiKeyV2: {
      create: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    apiUsageAnalytics: {
      create: jest.fn(),
      aggregate: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    }
  }
}));

// Mock rate limiter
jest.mock('@/lib/api-keys/rate-limiter', () => ({
  RateLimiter: jest.fn().mockImplementation(() => ({
    checkRateLimit: jest.fn().mockResolvedValue({
      allowed: true,
      remaining: 100,
      resetTime: Date.now() + 3600,
      totalRequests: 1
    })
  }))
}));

describe('ApiKeyService', () => {
  let service: ApiKeyService;
  const mockPrisma = require('@/lib/prisma').prisma;

  beforeEach(() => {
    service = new ApiKeyService();
    jest.clearAllMocks();
  });

  describe('createApiKey', () => {
    const validRequest: CreateApiKeyRequest = {
      projectId: 'project-123',
      userId: 'user-123',
      name: 'Test API Key',
      permissions: [{
        resource: 'messaging',
        actions: ['send', 'read']
      }],
      scopes: ['messaging:send', 'messaging:read']
    };

    it('should create API key successfully', async () => {
      const mockCreatedKey = {
        id: 'key-123',
        projectId: 'project-123',
        userId: 'user-123',
        name: 'Test API Key',
        keyHash: 'hash123',
        keyPrefix: 'ak_live_',
        permissions: validRequest.permissions,
        scopes: validRequest.scopes.map(scope => API_SCOPES[scope]),
        rateLimit: { requests: 1000, window: 3600, burst: 100 },
        expiresAt: null,
        lastUsedAt: null,
        usageCount: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.apiKeyV2.create.mockResolvedValue(mockCreatedKey);

      const result = await service.createApiKey(validRequest);

      expect(result.apiKey.id).toBe('key-123');
      expect(result.key).toMatch(/^ak_live_/);
      expect(mockPrisma.apiKeyV2.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          projectId: 'project-123',
          name: 'Test API Key',
          permissions: validRequest.permissions,
          scopes: validRequest.scopes.map(scope => API_SCOPES[scope])
        })
      });
    });

    it('should reject invalid scopes', async () => {
      const invalidRequest = {
        ...validRequest,
        scopes: ['invalid:scope']
      };

      await expect(service.createApiKey(invalidRequest))
        .rejects.toThrow('Invalid scopes: invalid:scope');
    });
  });

  describe('validateApiKey', () => {
    it('should validate correct API key', async () => {
      const mockApiKey = {
        id: 'key-123',
        projectId: 'project-123',
        keyHash: 'hash123',
        expiresAt: null,
        rateLimit: { requests: 1000, window: 3600 },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.apiKeyV2.findFirst.mockResolvedValue(mockApiKey);
      mockPrisma.apiKeyV2.update.mockResolvedValue(mockApiKey);

      const result = await service.validateApiKey('ak_live_test123');

      expect(result.isValid).toBe(true);
      expect(result.apiKey).toBeDefined();
      expect(result.error).toBeUndefined();
    });

    it('should reject invalid API key', async () => {
      mockPrisma.apiKeyV2.findFirst.mockResolvedValue(null);

      const result = await service.validateApiKey('invalid_key');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid API key');
    });

    it('should reject expired API key', async () => {
      const expiredKey = {
        id: 'key-123',
        expiresAt: new Date('2023-01-01'), // Past date
        isActive: true
      };

      mockPrisma.apiKeyV2.findFirst.mockResolvedValue(expiredKey);

      const result = await service.validateApiKey('ak_live_test123');

      expect(result.isValid).toBe(false);
      expect(result.error).toBe('API key has expired');
      expect(result.isExpired).toBe(true);
    });
  });

  describe('listApiKeys', () => {
    it('should list API keys for project', async () => {
      const mockKeys = [
        {
          id: 'key-1',
          projectId: 'project-123',
          name: 'Key 1',
          isActive: true,
          createdAt: new Date()
        },
        {
          id: 'key-2',
          projectId: 'project-123',
          name: 'Key 2',
          isActive: true,
          createdAt: new Date()
        }
      ];

      mockPrisma.apiKeyV2.findMany.mockResolvedValue(mockKeys);

      const result = await service.listApiKeys('project-123');

      expect(result).toHaveLength(2);
      expect(mockPrisma.apiKeyV2.findMany).toHaveBeenCalledWith({
        where: {
          projectId: 'project-123',
          isActive: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    });
  });

  describe('updateApiKey', () => {
    it('should update API key successfully', async () => {
      const updateRequest = {
        name: 'Updated Key Name',
        scopes: ['messaging:read']
      };

      const mockUpdatedKey = {
        id: 'key-123',
        name: 'Updated Key Name',
        scopes: [API_SCOPES['messaging:read']],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockPrisma.apiKeyV2.update.mockResolvedValue(mockUpdatedKey);

      const result = await service.updateApiKey('key-123', 'project-123', updateRequest);

      expect(result.name).toBe('Updated Key Name');
      expect(mockPrisma.apiKeyV2.update).toHaveBeenCalledWith({
        where: {
          id: 'key-123',
          projectId: 'project-123'
        },
        data: {
          name: 'Updated Key Name',
          scopes: [API_SCOPES['messaging:read']]
        }
      });
    });
  });

  describe('rotateApiKey', () => {
    it('should rotate API key successfully', async () => {
      const existingKey = {
        id: 'key-123',
        projectId: 'project-123',
        isActive: true
      };

      const rotatedKey = {
        ...existingKey,
        keyHash: 'new-hash',
        keyPrefix: 'ak_live_',
        usageCount: 0,
        lastUsedAt: null
      };

      mockPrisma.apiKeyV2.findFirst.mockResolvedValue(existingKey);
      mockPrisma.apiKeyV2.update.mockResolvedValue(rotatedKey);

      const result = await service.rotateApiKey('key-123', 'project-123');

      expect(result.key).toMatch(/^ak_live_/);
      expect(mockPrisma.apiKeyV2.update).toHaveBeenCalledWith({
        where: { id: 'key-123' },
        data: expect.objectContaining({
          usageCount: 0,
          lastUsedAt: null
        })
      });
    });

    it('should throw error for non-existent key', async () => {
      mockPrisma.apiKeyV2.findFirst.mockResolvedValue(null);

      await expect(service.rotateApiKey('key-123', 'project-123'))
        .rejects.toThrow('API key not found');
    });
  });

  describe('recordUsage', () => {
    it('should record API usage', async () => {
      mockPrisma.apiUsageAnalytics.create.mockResolvedValue({});

      await service.recordUsage(
        'key-123',
        'project-123',
        '/api/v2/messaging/send',
        'POST',
        200,
        150,
        1024,
        512,
        'test-agent',
        '127.0.0.1',
        'v2'
      );

      expect(mockPrisma.apiUsageAnalytics.create).toHaveBeenCalledWith({
        data: {
          projectId: 'project-123',
          apiKeyId: 'key-123',
          endpoint: '/api/v2/messaging/send',
          method: 'POST',
          statusCode: 200,
          responseTimeMs: 150,
          requestSizeBytes: 1024,
          responseSizeBytes: 512,
          userAgent: 'test-agent',
          ipAddress: '127.0.0.1',
          apiVersion: 'v2'
        }
      });
    });
  });
});