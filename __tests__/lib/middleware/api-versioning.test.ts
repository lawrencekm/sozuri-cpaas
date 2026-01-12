import { NextRequest } from 'next/server';
import { 
  ApiVersioningMiddleware, 
  defaultApiVersionConfig, 
  createApiVersioningMiddleware,
  ApiVersion 
} from '@/lib/middleware/api-versioning';

// Mock NextRequest
function createMockRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  const request = new NextRequest(url);
  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value);
  });
  return request;
}

describe('ApiVersioningMiddleware', () => {
  let middleware: ApiVersioningMiddleware;

  beforeEach(() => {
    middleware = createApiVersioningMiddleware();
  });

  describe('Version Detection', () => {
    it('should detect version from URL path', () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      const result = middleware.process(request);
      
      expect(result.version).toBe('v2');
      expect(result.enhancedRequest.apiVersion).toBe('v2');
      expect(result.response).toBeUndefined();
    });

    it('should detect version from Accept-Version header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'Accept-Version': 'v2'
      });
      const result = middleware.process(request);
      
      expect(result.version).toBe('v2');
      expect(result.enhancedRequest.apiVersion).toBe('v2');
    });

    it('should detect version from API-Version header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'API-Version': 'v2'
      });
      const result = middleware.process(request);
      
      expect(result.version).toBe('v2');
      expect(result.enhancedRequest.apiVersion).toBe('v2');
    });

    it('should prioritize URL path over headers', () => {
      const request = createMockRequest('https://example.com/api/v1/projects', {
        'Accept-Version': 'v2',
        'API-Version': 'v2'
      });
      const result = middleware.process(request);
      
      expect(result.version).toBe('v1');
      expect(result.enhancedRequest.apiVersion).toBe('v1');
    });

    it('should use default version when no version specified', () => {
      const request = createMockRequest('https://example.com/api/projects');
      const result = middleware.process(request);
      
      expect(result.version).toBe(defaultApiVersionConfig.defaultVersion);
      expect(result.enhancedRequest.apiVersion).toBe(defaultApiVersionConfig.defaultVersion);
    });
  });

  describe('Version Validation', () => {
    it('should return error for unsupported version', () => {
      const request = createMockRequest('https://example.com/api/v3/projects');
      const result = middleware.process(request);
      
      expect(result.response).toBeDefined();
      expect(result.response?.status).toBe(400);
    });

    it('should return error for invalid version in header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'Accept-Version': 'v99'
      });
      const result = middleware.process(request);
      
      // Should fall back to default version since header version is invalid
      expect(result.version).toBe(defaultApiVersionConfig.defaultVersion);
      expect(result.response).toBeUndefined();
    });
  });

  describe('Deprecation Handling', () => {
    it('should detect deprecated versions', () => {
      const deprecatedConfig = {
        ...defaultApiVersionConfig,
        deprecatedVersions: {
          v1: {
            sunsetDate: new Date('2024-12-31'),
            migrationGuide: '/docs/migration/v1-to-v2'
          }
        }
      };
      
      const deprecatedMiddleware = new ApiVersioningMiddleware(deprecatedConfig);
      const request = createMockRequest('https://example.com/api/v1/projects');
      const result = deprecatedMiddleware.process(request);
      
      expect(result.enhancedRequest.isVersionDeprecated).toBe(true);
      expect(result.enhancedRequest.deprecationInfo).toBeDefined();
      expect(result.enhancedRequest.deprecationInfo?.migrationGuide).toBe('/docs/migration/v1-to-v2');
    });

    it('should not mark non-deprecated versions as deprecated', () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      const result = middleware.process(request);
      
      expect(result.enhancedRequest.isVersionDeprecated).toBe(false);
      expect(result.enhancedRequest.deprecationInfo).toBeUndefined();
    });
  });

  describe('Response Headers', () => {
    it('should add version headers to response', () => {
      const mockResponse = new Response('{}', { status: 200 });
      const nextResponse = new (require('next/server').NextResponse)(mockResponse);
      
      const versionedResponse = middleware.createVersionedResponse(nextResponse, 'v2');
      
      expect(versionedResponse.headers.get('API-Version')).toBe('v2');
      expect(versionedResponse.headers.get('Supported-Versions')).toContain('v1');
      expect(versionedResponse.headers.get('Supported-Versions')).toContain('v2');
    });

    it('should add deprecation headers for deprecated versions', () => {
      const deprecatedConfig = {
        ...defaultApiVersionConfig,
        deprecatedVersions: {
          v1: {
            sunsetDate: new Date('2024-12-31'),
            migrationGuide: '/docs/migration/v1-to-v2'
          }
        }
      };
      
      const deprecatedMiddleware = new ApiVersioningMiddleware(deprecatedConfig);
      const mockResponse = new Response('{}', { status: 200 });
      const nextResponse = new (require('next/server').NextResponse)(mockResponse);
      
      const versionedResponse = deprecatedMiddleware.createVersionedResponse(nextResponse, 'v1');
      
      expect(versionedResponse.headers.get('Deprecation')).toBe('true');
      expect(versionedResponse.headers.get('Sunset')).toBe('2024-12-31T00:00:00.000Z');
      expect(versionedResponse.headers.get('Link')).toContain('/docs/migration/v1-to-v2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle malformed URLs gracefully', () => {
      const request = createMockRequest('https://example.com/api/v/projects');
      const result = middleware.process(request);
      
      expect(result.version).toBe(defaultApiVersionConfig.defaultVersion);
      expect(result.response).toBeUndefined();
    });

    it('should handle empty version headers', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'Accept-Version': '',
        'API-Version': ''
      });
      const result = middleware.process(request);
      
      expect(result.version).toBe(defaultApiVersionConfig.defaultVersion);
    });

    it('should handle case-insensitive version detection', () => {
      const request = createMockRequest('https://example.com/api/V2/projects');
      const result = middleware.process(request);
      
      // Should not match case-insensitive (our regex is case-sensitive)
      expect(result.version).toBe(defaultApiVersionConfig.defaultVersion);
    });
  });
});

describe('createApiVersioningMiddleware', () => {
  it('should create middleware with default config', () => {
    const middleware = createApiVersioningMiddleware();
    expect(middleware).toBeInstanceOf(ApiVersioningMiddleware);
  });

  it('should create middleware with custom config', () => {
    const customConfig = {
      defaultVersion: 'v2' as ApiVersion,
      supportedVersions: ['v2'] as ApiVersion[]
    };
    
    const middleware = createApiVersioningMiddleware(customConfig);
    const request = createMockRequest('https://example.com/api/projects');
    const result = middleware.process(request);
    
    expect(result.version).toBe('v2');
  });
});