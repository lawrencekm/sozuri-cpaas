import { NextRequest, NextResponse } from 'next/server';
import { ApiVersioningMiddleware, ApiVersion, VersionedRequest, createApiVersioningMiddleware } from './api-versioning';

export interface ApiGatewayConfig {
  versioning: {
    enabled: boolean;
    middleware: ApiVersioningMiddleware;
  };
  routing: {
    v1Prefix: string;
    v2Prefix: string;
  };
  fallback: {
    enabled: boolean;
    fallbackVersion: ApiVersion;
  };
}

export class ApiGateway {
  private config: ApiGatewayConfig;

  constructor(config: ApiGatewayConfig) {
    this.config = config;
  }

  /**
   * Check if the request is an API request
   */
  private isApiRequest(request: NextRequest): boolean {
    return request.nextUrl.pathname.startsWith('/api/');
  }

  /**
   * Check if the request is already versioned
   */
  private isVersionedRequest(request: NextRequest): boolean {
    const { pathname } = request.nextUrl;
    return /^\/api\/v\d+\//.test(pathname);
  }

  /**
   * Rewrite URL for version-specific routing
   */
  private rewriteUrlForVersion(request: NextRequest, version: ApiVersion): NextRequest {
    const { pathname, search } = request.nextUrl;
    
    // If already versioned, return as-is
    if (this.isVersionedRequest(request)) {
      return request;
    }

    // Remove /api prefix and add version prefix
    const newPathname = pathname.replace(/^\/api\//, `/api/${version}/`);
    
    // Create new URL with version prefix
    const newUrl = new URL(newPathname + search, request.url);
    
    // Create new request with rewritten URL
    const newRequest = new NextRequest(newUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
    });

    return newRequest;
  }

  /**
   * Handle API request routing and versioning
   */
  public async handleRequest(request: NextRequest): Promise<NextResponse | null> {
    // Skip non-API requests
    if (!this.isApiRequest(request)) {
      return null;
    }

    // Skip if versioning is disabled
    if (!this.config.versioning.enabled) {
      return null;
    }

    try {
      // Process versioning
      const versioningResult = this.config.versioning.middleware.process(request);
      
      // If there's an error response from versioning, return it
      if (versioningResult.response) {
        return versioningResult.response;
      }

      const { version, enhancedRequest } = versioningResult;

      // For already versioned requests, just add version info and continue
      if (this.isVersionedRequest(request)) {
        // Add version info to request headers for downstream handlers
        const response = NextResponse.next();
        response.headers.set('X-API-Version', version);
        response.headers.set('X-API-Version-Deprecated', enhancedRequest.isVersionDeprecated.toString());
        
        return this.config.versioning.middleware.createVersionedResponse(response, version);
      }

      // Rewrite URL for version-specific routing
      const rewrittenRequest = this.rewriteUrlForVersion(request, version);
      
      // Create rewrite response
      const response = NextResponse.rewrite(rewrittenRequest.url);
      
      // Add version headers
      response.headers.set('X-API-Version', version);
      response.headers.set('X-API-Version-Deprecated', enhancedRequest.isVersionDeprecated.toString());
      
      if (enhancedRequest.deprecationInfo) {
        response.headers.set('X-API-Deprecation-Sunset', enhancedRequest.deprecationInfo.sunsetDate.toISOString());
        response.headers.set('X-API-Migration-Guide', enhancedRequest.deprecationInfo.migrationGuide);
      }

      return this.config.versioning.middleware.createVersionedResponse(response, version);

    } catch (error) {
      console.error('API Gateway error:', error);
      
      // Return error response
      const errorResponse = NextResponse.json(
        {
          error: 'API Gateway error',
          code: 'GATEWAY_ERROR',
          message: 'An error occurred while processing the API request'
        },
        { status: 500 }
      );

      return errorResponse;
    }
  }
}

/**
 * Default API Gateway configuration
 */
export const defaultApiGatewayConfig: ApiGatewayConfig = {
  versioning: {
    enabled: true,
    middleware: createApiVersioningMiddleware()
  },
  routing: {
    v1Prefix: '/api/v1',
    v2Prefix: '/api/v2'
  },
  fallback: {
    enabled: true,
    fallbackVersion: 'v1'
  }
};

/**
 * Create API Gateway instance
 */
export function createApiGateway(config?: Partial<ApiGatewayConfig>): ApiGateway {
  const finalConfig = { ...defaultApiGatewayConfig, ...config };
  return new ApiGateway(finalConfig);
}

/**
 * Utility function to get API version from request in route handlers
 */
export function getApiVersionFromRequest(request: NextRequest): ApiVersion {
  // Check headers set by the gateway
  const versionHeader = request.headers.get('X-API-Version');
  if (versionHeader) {
    return versionHeader as ApiVersion;
  }

  // Fallback to URL parsing
  const { pathname } = request.nextUrl;
  const pathVersionMatch = pathname.match(/^\/api\/(v\d+)\//);
  if (pathVersionMatch) {
    return pathVersionMatch[1] as ApiVersion;
  }

  // Default fallback
  return 'v1';
}

/**
 * Utility function to check if API version is deprecated
 */
export function isApiVersionDeprecated(request: NextRequest): boolean {
  const deprecatedHeader = request.headers.get('X-API-Version-Deprecated');
  return deprecatedHeader === 'true';
}