import { NextRequest, NextResponse } from 'next/server';
import { ApiKeyService } from '@/lib/api-keys/service';

export interface ApiAuthConfig {
  enabled: boolean;
  publicPaths: string[];
  requireApiKey: boolean;
}

export class ApiAuthMiddleware {
  private config: ApiAuthConfig;
  private apiKeyService: ApiKeyService;

  constructor(config: ApiAuthConfig) {
    this.config = config;
    this.apiKeyService = new ApiKeyService();
  }

  /**
   * Process API authentication for a request
   */
  async processRequest(request: NextRequest): Promise<NextResponse | null> {
    if (!this.config.enabled) {
      return null;
    }

    const { pathname } = request.nextUrl;

    // Skip authentication for public paths
    if (this.isPublicPath(pathname)) {
      return null;
    }

    // Skip if not an API request
    if (!pathname.startsWith('/api/')) {
      return null;
    }

    try {
      // Extract API key from request
      const apiKey = this.extractApiKey(request);

      if (!apiKey && this.config.requireApiKey) {
        return this.createUnauthorizedResponse('API key required');
      }

      if (apiKey) {
        // Validate API key
        const validationResult = await this.apiKeyService.validateApiKey(apiKey);

        if (!validationResult.isValid) {
          return this.createUnauthorizedResponse(validationResult.error || 'Invalid API key');
        }

        // Add API key info to request headers for downstream handlers
        const response = NextResponse.next();
        response.headers.set('X-API-Key-ID', validationResult.apiKey?.id || '');
        response.headers.set('X-API-Key-User-ID', validationResult.apiKey?.userId || '');
        response.headers.set('X-API-Key-Project-ID', validationResult.apiKey?.projectId || '');
        
        return response;
      }

      return null;

    } catch (error) {
      console.error('API authentication error:', error);
      return this.createUnauthorizedResponse('Authentication error');
    }
  }

  /**
   * Extract API key from request headers
   */
  private extractApiKey(request: NextRequest): string | null {
    // Check Authorization header (Bearer token)
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Check X-API-Key header
    const apiKeyHeader = request.headers.get('x-api-key');
    if (apiKeyHeader) {
      return apiKeyHeader;
    }

    // Check query parameter (less secure, but sometimes needed)
    const url = new URL(request.url);
    const apiKeyParam = url.searchParams.get('api_key');
    if (apiKeyParam) {
      return apiKeyParam;
    }

    return null;
  }

  /**
   * Check if path is public (doesn't require authentication)
   */
  private isPublicPath(pathname: string): boolean {
    return this.config.publicPaths.some(path => {
      if (path.endsWith('/**')) {
        return pathname.startsWith(path.slice(0, -3));
      }
      return pathname === path;
    });
  }

  /**
   * Create unauthorized response
   */
  private createUnauthorizedResponse(message: string): NextResponse {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        code: 'UNAUTHORIZED',
        message
      },
      { status: 401 }
    );
  }
}

/**
 * Default API authentication configuration
 */
export const defaultApiAuthConfig: ApiAuthConfig = {
  enabled: true,
  publicPaths: [
    '/api/auth/**',
    '/api/health',
    '/api/status'
  ],
  requireApiKey: false // Set to true to require API keys for all API endpoints
};

/**
 * Create API authentication middleware with default config
 */
export function createApiAuthMiddleware(
  customConfig?: Partial<ApiAuthConfig>
): ApiAuthMiddleware {
  const config = { ...defaultApiAuthConfig, ...customConfig };
  return new ApiAuthMiddleware(config);
}