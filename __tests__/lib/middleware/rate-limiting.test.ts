import { NextRequest } from 'next/server';
import { 
  RateLimitingMiddleware, 
  defaultRateLimitConfig,
  createRateLimitingMiddleware 
} from '@/lib/middleware/rate-limiting';

// Mock Redis
jest.mock('ioredis', () => {
  return {
    Redis: jest.fn().mockImplementation(() => ({
      pipeline: jest.fn().mockReturnValue({
        get: jest.fn(),
        incr: jest.fn(),
        expire: jest.fn(),
        exec: jest.fn().mockResolvedValue([
          [null, '0'], // get result
          [null, '1'], // incr result
          [null, 'OK'] // expire result
        ])
      })
    }))
  };
});

// Mock NextRequest
function createMockRequest(
  url: string,
  method: string = 'GET',
  headers: Record<string, string> = {}
): NextRequest {
  return new NextRequest(url, {
    method,
    headers: {
      'x-forwarded-for': '127.0.0.1',
      ...headers
    }
  });
}

describe('RateLimitingMiddleware', () => {
  let middleware: RateLimitingMiddleware;
  let mockRedis: any;

  beforeEach(() => {
    jest.clearAllMocks();
    middleware = createRateLimitingMiddleware();
    mockRedis = require('ioredis').Redis.mock.results[0].value;
  });

  describe('processRequest', () => {
    it('should allow requests within rate limit', async () => {
      // Mock Redis to return low count
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '0'], // get
        [null, '1'], // incr
        [null, 'OK'] // expire
      ]);

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await middleware.processRequest(request);

      expect(response?.status).not.toBe(429);
    });

    it('should block requests exceeding rate limit', async () => {
      // Mock Redis to return high count (exceeding limit)
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '100'], // get
        [null, '101'], // incr (exceeds limit of 100)
        [null, 'OK'] // expire
      ]);

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await middleware.processRequest(request);

      expect(response?.status).toBe(429);
      
      const responseBody = await response?.json();
      expect(responseBody.error).toBe('Rate limit exceeded');
      expect(responseBody.code).toBe('RATE_LIMIT_EXCEEDED');
    });

    it('should add rate limit headers to successful responses', async () => {
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '0'],
        [null, '1'],
        [null, 'OK']
      ]);

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await middleware.processRequest(request);

      expect(response?.headers.get('X-RateLimit-Limit')).toBeDefined();
      expect(response?.headers.get('X-RateLimit-Remaining')).toBeDefined();
      expect(response?.headers.get('X-RateLimit-Reset')).toBeDefined();
    });

    it('should handle different key generators', async () => {
      // Test API key generator
      const requestWithApiKey = createMockRequest(
        'https://example.com/api/v2/messaging/send',
        'POST',
        { 'authorization': 'Bearer ak_live_test123' }
      );

      await middleware.processRequest(requestWithApiKey);

      // Verify Redis was called with API key in the key
      expect(mockRedis.pipeline).toHaveBeenCalled();
    });

    it('should skip rate limiting when disabled', async () => {
      const disabledMiddleware = createRateLimitingMiddleware({
        enabled: false
      });

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await disabledMiddleware.processRequest(request);

      expect(response).toBeNull();
      expect(mockRedis.pipeline).not.toHaveBeenCalled();
    });

    it('should fail open on Redis errors', async () => {
      // Mock Redis to throw error
      mockRedis.pipeline().exec.mockRejectedValue(new Error('Redis connection failed'));

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await middleware.processRequest(request);

      // Should not block the request
      expect(response).toBeNull();
    });
  });

  describe('checkRateLimit', () => {
    it('should return correct rate limit result', async () => {
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '5'], // get
        [null, '6'], // incr
        [null, 'OK'] // expire
      ]);

      const rule = {
        path: '/test',
        requests: 10,
        window: 60,
        keyGenerator: 'ip' as const
      };

      const request = createMockRequest('https://example.com/test');
      const result = await middleware.checkRateLimit(request, rule);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4); // 10 - 6
      expect(result.totalRequests).toBe(6);
    });

    it('should handle burst limits', async () => {
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '10'],
        [null, '11'], // Exceeds limit
        [null, 'OK']
      ]);

      const rule = {
        path: '/test',
        requests: 10,
        window: 60,
        burst: 5,
        keyGenerator: 'ip' as const
      };

      const request = createMockRequest('https://example.com/test');
      const result = await middleware.checkRateLimit(request, rule);

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
      expect(result.retryAfter).toBeDefined();
    });
  });

  describe('registerRule', () => {
    it('should register custom rate limit rule', async () => {
      const customRule = {
        path: '/api/v2/custom',
        method: 'POST',
        requests: 5,
        window: 60,
        keyGenerator: 'ip' as const
      };

      middleware.registerRule(customRule);

      // Mock high usage to trigger rate limit
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '5'],
        [null, '6'], // Exceeds limit of 5
        [null, 'OK']
      ]);

      const request = createMockRequest('https://example.com/api/v2/custom', 'POST');
      const response = await middleware.processRequest(request);

      expect(response?.status).toBe(429);
    });
  });

  describe('pattern matching', () => {
    it('should match wildcard patterns', async () => {
      const rule = {
        path: '/api/v*/messaging/*',
        requests: 10,
        window: 60,
        keyGenerator: 'ip' as const
      };

      middleware.registerRule(rule);

      const request1 = createMockRequest('https://example.com/api/v1/messaging/send');
      const request2 = createMockRequest('https://example.com/api/v2/messaging/bulk');

      // Both should match the pattern
      await middleware.processRequest(request1);
      await middleware.processRequest(request2);

      expect(mockRedis.pipeline).toHaveBeenCalledTimes(2);
    });

    it('should match dynamic segments', async () => {
      const rule = {
        path: '/api/v2/users/[id]/messages',
        requests: 10,
        window: 60,
        keyGenerator: 'ip' as const
      };

      middleware.registerRule(rule);

      const request = createMockRequest('https://example.com/api/v2/users/123/messages');
      await middleware.processRequest(request);

      expect(mockRedis.pipeline).toHaveBeenCalled();
    });
  });

  describe('key generation', () => {
    it('should generate IP-based keys', async () => {
      const request = createMockRequest(
        'https://example.com/api/test',
        'GET',
        { 'x-forwarded-for': '192.168.1.1, 10.0.0.1' }
      );

      const rule = {
        path: '/api/test',
        requests: 10,
        window: 60,
        keyGenerator: 'ip' as const
      };

      await middleware.checkRateLimit(request, rule);

      // Should use the first IP from x-forwarded-for
      expect(mockRedis.pipeline).toHaveBeenCalled();
    });

    it('should generate API key-based keys', async () => {
      const request = createMockRequest(
        'https://example.com/api/test',
        'GET',
        { 'authorization': 'Bearer ak_live_test123' }
      );

      const rule = {
        path: '/api/test',
        requests: 10,
        window: 60,
        keyGenerator: 'api_key' as const
      };

      await middleware.checkRateLimit(request, rule);

      expect(mockRedis.pipeline).toHaveBeenCalled();
    });

    it('should use custom key generator', async () => {
      const customKeyGenerator = jest.fn().mockReturnValue('custom-key');
      
      const rule = {
        path: '/api/test',
        requests: 10,
        window: 60,
        keyGenerator: 'custom' as const,
        customKeyGenerator
      };

      const request = createMockRequest('https://example.com/api/test');
      await middleware.checkRateLimit(request, rule);

      expect(customKeyGenerator).toHaveBeenCalledWith(request);
    });
  });

  describe('global rate limit', () => {
    it('should enforce global rate limit', async () => {
      const middlewareWithGlobal = createRateLimitingMiddleware({
        globalLimit: {
          path: '*',
          requests: 1,
          window: 60,
          keyGenerator: 'ip'
        }
      });

      // Mock to exceed global limit
      mockRedis.pipeline().exec.mockResolvedValue([
        [null, '1'],
        [null, '2'], // Exceeds global limit of 1
        [null, 'OK']
      ]);

      const request = createMockRequest('https://example.com/api/v2/messaging/send', 'POST');
      const response = await middlewareWithGlobal.processRequest(request);

      expect(response?.status).toBe(429);
    });
  });
});