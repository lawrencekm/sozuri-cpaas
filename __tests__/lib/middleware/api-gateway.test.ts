import { NextRequest } from 'next/server';
import { 
  ApiGateway, 
  createApiGateway, 
  getApiVersionFromRequest, 
  isApiVersionDeprecated 
} from '@/lib/middleware/api-gateway';

// Mock NextRequest
function createMockRequest(url: string, headers: Record<string, string> = {}): NextRequest {
  const request = new NextRequest(url);
  Object.entries(headers).forEach(([key, value]) => {
    request.headers.set(key, value);
  });
  return request;
}

describe('ApiGateway', () => {
  let gateway: ApiGateway;

  beforeEach(() => {
    gateway = createApiGateway();
  });

  describe('Request Routing', () => {
    it('should handle API requests', async () => {
      const request = createMockRequest('https://example.com/api/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response).toBeDefined();
      expect(response?.headers.get('X-API-Version')).toBe('v1'); // default version
    });

    it('should skip non-API requests', async () => {
      const request = createMockRequest('https://example.com/dashboard');
      const response = await gateway.handleRequest(request);
      
      expect(response).toBeNull();
    });

    it('should handle versioned API requests', async () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response).toBeDefined();
      expect(response?.headers.get('X-API-Version')).toBe('v2');
    });

    it('should rewrite unversioned API requests', async () => {
      const request = createMockRequest('https://example.com/api/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response).toBeDefined();
      // Should rewrite to v1 (default version)
      expect(response?.headers.get('X-API-Version')).toBe('v1');
    });
  });

  describe('Version Detection', () => {
    it('should detect version from URL path', async () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response?.headers.get('X-API-Version')).toBe('v2');
    });

    it('should detect version from headers', async () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'Accept-Version': 'v2'
      });
      const response = await gateway.handleRequest(request);
      
      expect(response?.headers.get('X-API-Version')).toBe('v2');
    });

    it('should use default version when none specified', async () => {
      const request = createMockRequest('https://example.com/api/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response?.headers.get('X-API-Version')).toBe('v1');
    });
  });

  describe('Error Handling', () => {
    it('should handle unsupported versions', async () => {
      const request = createMockRequest('https://example.com/api/v99/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response?.status).toBe(400);
      
      const body = await response?.json();
      expect(body.error).toBe('Unsupported API version');
      expect(body.code).toBe('UNSUPPORTED_VERSION');
    });

    it('should handle gateway errors gracefully', async () => {
      // Create a gateway with invalid config to trigger an error
      const invalidGateway = createApiGateway({
        versioning: {
          enabled: true,
          middleware: null as any // This will cause an error
        }
      });

      const request = createMockRequest('https://example.com/api/projects');
      const response = await invalidGateway.handleRequest(request);
      
      expect(response?.status).toBe(500);
      
      const body = await response?.json();
      expect(body.error).toBe('API Gateway error');
      expect(body.code).toBe('GATEWAY_ERROR');
    });
  });

  describe('Deprecation Handling', () => {
    it('should add deprecation headers for deprecated versions', async () => {
      // Create gateway with deprecated v1
      const deprecatedGateway = createApiGateway({
        versioning: {
          enabled: true,
          middleware: require('@/lib/middleware/api-versioning').createApiVersioningMiddleware({
            deprecatedVersions: {
              v1: {
                sunsetDate: new Date('2024-12-31'),
                migrationGuide: '/docs/migration/v1-to-v2'
              }
            }
          })
        }
      });

      const request = createMockRequest('https://example.com/api/v1/projects');
      const response = await deprecatedGateway.handleRequest(request);
      
      expect(response?.headers.get('X-API-Version-Deprecated')).toBe('true');
      expect(response?.headers.get('X-API-Deprecation-Sunset')).toBe('2024-12-31T00:00:00.000Z');
      expect(response?.headers.get('X-API-Migration-Guide')).toBe('/docs/migration/v1-to-v2');
    });

    it('should not add deprecation headers for non-deprecated versions', async () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      const response = await gateway.handleRequest(request);
      
      expect(response?.headers.get('X-API-Version-Deprecated')).toBe('false');
      expect(response?.headers.get('X-API-Deprecation-Sunset')).toBeNull();
      expect(response?.headers.get('X-API-Migration-Guide')).toBeNull();
    });
  });

  describe('Configuration', () => {
    it('should respect disabled versioning', async () => {
      const disabledGateway = createApiGateway({
        versioning: {
          enabled: false,
          middleware: require('@/lib/middleware/api-versioning').createApiVersioningMiddleware()
        }
      });

      const request = createMockRequest('https://example.com/api/projects');
      const response = await disabledGateway.handleRequest(request);
      
      expect(response).toBeNull();
    });
  });
});

describe('Utility Functions', () => {
  describe('getApiVersionFromRequest', () => {
    it('should get version from X-API-Version header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'X-API-Version': 'v2'
      });
      
      const version = getApiVersionFromRequest(request);
      expect(version).toBe('v2');
    });

    it('should get version from URL path', () => {
      const request = createMockRequest('https://example.com/api/v2/projects');
      
      const version = getApiVersionFromRequest(request);
      expect(version).toBe('v2');
    });

    it('should return default version when none found', () => {
      const request = createMockRequest('https://example.com/api/projects');
      
      const version = getApiVersionFromRequest(request);
      expect(version).toBe('v1');
    });
  });

  describe('isApiVersionDeprecated', () => {
    it('should detect deprecated version from header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'X-API-Version-Deprecated': 'true'
      });
      
      const isDeprecated = isApiVersionDeprecated(request);
      expect(isDeprecated).toBe(true);
    });

    it('should detect non-deprecated version from header', () => {
      const request = createMockRequest('https://example.com/api/projects', {
        'X-API-Version-Deprecated': 'false'
      });
      
      const isDeprecated = isApiVersionDeprecated(request);
      expect(isDeprecated).toBe(false);
    });

    it('should return false when header is missing', () => {
      const request = createMockRequest('https://example.com/api/projects');
      
      const isDeprecated = isApiVersionDeprecated(request);
      expect(isDeprecated).toBe(false);
    });
  });
});

describe('createApiGateway', () => {
  it('should create gateway with default config', () => {
    const gateway = createApiGateway();
    expect(gateway).toBeInstanceOf(ApiGateway);
  });

  it('should create gateway with custom config', () => {
    const customConfig = {
      versioning: {
        enabled: false,
        middleware: require('@/lib/middleware/api-versioning').createApiVersioningMiddleware()
      }
    };
    
    const gateway = createApiGateway(customConfig);
    expect(gateway).toBeInstanceOf(ApiGateway);
  });
});