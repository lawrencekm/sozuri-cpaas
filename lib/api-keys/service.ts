import { prisma } from '../prisma';
import { 
  ApiKeyV2Data, 
  CreateApiKeyRequest, 
  UpdateApiKeyRequest, 
  ApiKeyValidationResult,
  ApiKeyUsageStats,
  API_SCOPES,
  DEFAULT_RATE_LIMITS
} from './types';
import { generateApiKey, hashApiKey, GeneratedApiKey } from './generator';
import { RateLimiter } from './rate-limiter';

export class ApiKeyService {
  private rateLimiter: RateLimiter;

  constructor() {
    this.rateLimiter = new RateLimiter();
  }

  /**
   * Create a new API key
   */
  async createApiKey(request: CreateApiKeyRequest): Promise<{ apiKey: ApiKeyV2Data; key: string }> {
    // Validate scopes
    const invalidScopes = request.scopes.filter(scope => !API_SCOPES[scope]);
    if (invalidScopes.length > 0) {
      throw new Error(`Invalid scopes: ${invalidScopes.join(', ')}`);
    }

    // Generate the API key
    const generated: GeneratedApiKey = generateApiKey();

    // Determine rate limit
    const rateLimit = request.rateLimit || this.getDefaultRateLimit(request.scopes);

    // Create the API key in database
    const apiKey = await prisma.apiKeyV2.create({
      data: {
        projectId: request.projectId,
        userId: request.userId,
        name: request.name,
        keyHash: generated.keyHash,
        keyPrefix: generated.keyPrefix,
        permissions: request.permissions as any,
        scopes: request.scopes.map(scope => API_SCOPES[scope]) as any,
        rateLimit: rateLimit as any,
        expiresAt: request.expiresAt,
        isActive: true
      }
    });

    return {
      apiKey: this.mapPrismaToApiKey(apiKey),
      key: generated.key
    };
  }

  /**
   * Get API key by ID
   */
  async getApiKey(id: string, projectId: string): Promise<ApiKeyV2Data | null> {
    const apiKey = await prisma.apiKeyV2.findFirst({
      where: {
        id,
        projectId,
        isActive: true
      }
    });

    return apiKey ? this.mapPrismaToApiKey(apiKey) : null;
  }

  /**
   * List API keys for a project
   */
  async listApiKeys(projectId: string, userId?: string): Promise<ApiKeyV2Data[]> {
    const apiKeys = await prisma.apiKeyV2.findMany({
      where: {
        projectId,
        ...(userId && { userId }),
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return apiKeys.map(this.mapPrismaToApiKey);
  }

  /**
   * Update an API key
   */
  async updateApiKey(id: string, projectId: string, request: UpdateApiKeyRequest): Promise<ApiKeyV2Data> {
    // Validate scopes if provided
    if (request.scopes) {
      const invalidScopes = request.scopes.filter(scope => !API_SCOPES[scope]);
      if (invalidScopes.length > 0) {
        throw new Error(`Invalid scopes: ${invalidScopes.join(', ')}`);
      }
    }

    const updateData: any = {};
    
    if (request.name !== undefined) updateData.name = request.name;
    if (request.permissions !== undefined) updateData.permissions = request.permissions as any;
    if (request.scopes !== undefined) {
      updateData.scopes = request.scopes.map(scope => API_SCOPES[scope]) as any;
    }
    if (request.rateLimit !== undefined) updateData.rateLimit = request.rateLimit as any;
    if (request.expiresAt !== undefined) updateData.expiresAt = request.expiresAt;
    if (request.isActive !== undefined) updateData.isActive = request.isActive;

    const apiKey = await prisma.apiKeyV2.update({
      where: {
        id,
        projectId
      },
      data: updateData
    });

    return this.mapPrismaToApiKey(apiKey);
  }

  /**
   * Delete (deactivate) an API key
   */
  async deleteApiKey(id: string, projectId: string): Promise<void> {
    await prisma.apiKeyV2.update({
      where: {
        id,
        projectId
      },
      data: {
        isActive: false
      }
    });
  }

  /**
   * Validate an API key and return validation result
   */
  async validateApiKey(key: string): Promise<ApiKeyValidationResult> {
    try {
      const keyHash = hashApiKey(key);
      
      const apiKey = await prisma.apiKeyV2.findFirst({
        where: {
          keyHash,
          isActive: true
        }
      });

      if (!apiKey) {
        return {
          isValid: false,
          error: 'Invalid API key'
        };
      }

      // Check expiration
      if (apiKey.expiresAt && new Date() > apiKey.expiresAt) {
        return {
          isValid: false,
          error: 'API key has expired',
          isExpired: true
        };
      }

      // Check rate limiting
      const rateLimitResult = await this.rateLimiter.checkRateLimit(
        apiKey.id,
        apiKey.rateLimit as any
      );

      if (!rateLimitResult.allowed) {
        return {
          isValid: false,
          error: 'Rate limit exceeded',
          isRateLimited: true,
          remainingRequests: rateLimitResult.remaining
        };
      }

      // Update usage statistics
      await this.updateUsageStats(apiKey.id);

      return {
        isValid: true,
        apiKey: this.mapPrismaToApiKey(apiKey),
        remainingRequests: rateLimitResult.remaining
      };

    } catch (error) {
      console.error('API key validation error:', error);
      return {
        isValid: false,
        error: 'Internal validation error'
      };
    }
  }

  /**
   * Rotate an API key (generate new key, keep same permissions)
   */
  async rotateApiKey(id: string, projectId: string): Promise<{ apiKey: ApiKeyV2Data; key: string }> {
    const existingKey = await prisma.apiKeyV2.findFirst({
      where: {
        id,
        projectId,
        isActive: true
      }
    });

    if (!existingKey) {
      throw new Error('API key not found');
    }

    // Generate new key
    const generated: GeneratedApiKey = generateApiKey();

    // Update the existing key with new hash
    const updatedKey = await prisma.apiKeyV2.update({
      where: {
        id
      },
      data: {
        keyHash: generated.keyHash,
        keyPrefix: generated.keyPrefix,
        usageCount: 0, // Reset usage count
        lastUsedAt: null // Reset last used
      }
    });

    return {
      apiKey: this.mapPrismaToApiKey(updatedKey),
      key: generated.key
    };
  }

  /**
   * Get usage statistics for an API key
   */
  async getUsageStats(id: string, projectId: string, days: number = 30): Promise<ApiKeyUsageStats> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const [totalStats, dailyStats, topEndpoints] = await Promise.all([
      // Total usage stats
      prisma.apiUsageAnalytics.aggregate({
        where: {
          apiKeyId: id,
          projectId,
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        _avg: {
          responseTimeMs: true
        }
      }),

      // Today's stats
      prisma.apiUsageAnalytics.aggregate({
        where: {
          apiKeyId: id,
          projectId,
          timestamp: {
            gte: new Date(new Date().setHours(0, 0, 0, 0))
          }
        },
        _count: {
          id: true
        }
      }),

      // Top endpoints
      prisma.apiUsageAnalytics.groupBy({
        by: ['endpoint'],
        where: {
          apiKeyId: id,
          projectId,
          timestamp: {
            gte: startDate
          }
        },
        _count: {
          id: true
        },
        _avg: {
          responseTimeMs: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calculate error rate
    const errorCount = await prisma.apiUsageAnalytics.count({
      where: {
        apiKeyId: id,
        projectId,
        timestamp: {
          gte: startDate
        },
        statusCode: {
          gte: 400
        }
      }
    });

    const errorRate = totalStats._count.id > 0 ? (errorCount / totalStats._count.id) * 100 : 0;

    // Get last used date
    const lastUsage = await prisma.apiUsageAnalytics.findFirst({
      where: {
        apiKeyId: id,
        projectId
      },
      orderBy: {
        timestamp: 'desc'
      },
      select: {
        timestamp: true
      }
    });

    return {
      totalRequests: totalStats._count.id || 0,
      requestsToday: dailyStats._count.id || 0,
      requestsThisMonth: totalStats._count.id || 0,
      averageResponseTime: totalStats._avg.responseTimeMs || 0,
      errorRate,
      lastUsed: lastUsage?.timestamp,
      topEndpoints: topEndpoints.map(endpoint => ({
        endpoint: endpoint.endpoint,
        count: endpoint._count.id,
        averageResponseTime: endpoint._avg.responseTimeMs || 0
      }))
    };
  }

  /**
   * Record API usage for analytics
   */
  async recordUsage(
    apiKeyId: string,
    projectId: string,
    endpoint: string,
    method: string,
    statusCode: number,
    responseTimeMs?: number,
    requestSizeBytes?: number,
    responseSizeBytes?: number,
    userAgent?: string,
    ipAddress?: string,
    apiVersion?: string
  ): Promise<void> {
    await prisma.apiUsageAnalytics.create({
      data: {
        projectId,
        apiKeyId,
        endpoint,
        method,
        statusCode,
        responseTimeMs,
        requestSizeBytes,
        responseSizeBytes,
        userAgent,
        ipAddress,
        apiVersion
      }
    });
  }

  /**
   * Get default rate limit based on scopes
   */
  private getDefaultRateLimit(scopes: string[]) {
    // Find the most restrictive rate limit among the scopes
    let minRequests = Infinity;
    let window = 3600; // Default 1 hour
    let burst = 100;

    for (const scope of scopes) {
      const limit = DEFAULT_RATE_LIMITS[scope] || DEFAULT_RATE_LIMITS.default;
      if (limit.requests < minRequests) {
        minRequests = limit.requests;
        window = limit.window;
        burst = limit.burst || 100;
      }
    }

    return {
      requests: minRequests === Infinity ? DEFAULT_RATE_LIMITS.default.requests : minRequests,
      window,
      burst
    };
  }

  /**
   * Update usage statistics for an API key
   */
  private async updateUsageStats(apiKeyId: string): Promise<void> {
    await prisma.apiKeyV2.update({
      where: {
        id: apiKeyId
      },
      data: {
        usageCount: {
          increment: 1
        },
        lastUsedAt: new Date()
      }
    });
  }

  /**
   * Map Prisma model to API key data
   */
  private mapPrismaToApiKey(apiKey: any): ApiKeyV2Data {
    return {
      id: apiKey.id,
      projectId: apiKey.projectId,
      userId: apiKey.userId,
      name: apiKey.name,
      keyHash: apiKey.keyHash,
      keyPrefix: apiKey.keyPrefix,
      permissions: apiKey.permissions as any,
      scopes: apiKey.scopes as any,
      rateLimit: apiKey.rateLimit as any,
      expiresAt: apiKey.expiresAt,
      lastUsedAt: apiKey.lastUsedAt,
      usageCount: apiKey.usageCount,
      isActive: apiKey.isActive,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt
    };
  }
}