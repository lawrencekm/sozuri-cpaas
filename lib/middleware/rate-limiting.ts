import { NextRequest, NextResponse } from 'next/server';
import { Redis } from 'ioredis';

export interface RateLimitRule {
  path: string;
  method?: string;
  requests: number;
  window: number; // seconds
  burst?: number;
  keyGenerator: 'ip' | 'api_key' | 'user' | 'custom';
  customKeyGenerator?: (request: NextRequest) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  message?: string;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalRequests: number;
  retryAfter?: number;
}

export interface RateLimitConfig {
  enabled: boolean;
  redis: {
    url: string;
    keyPrefix: string;
  };
  defaultRules: RateLimitRule[];
  globalLimit?: RateLimitRule;
}

export class RateLimitingMiddleware {
  private redis: Redis;
  private config: RateLimitConfig;
  private rules: Map<string, RateLimitRule>;

  constructor(config: RateLimitConfig) {
    this.config = config;
    this.redis = new Redis(config.redis.url);
    this.rules = new Map();

    // Register default rules
    config.defaultRules.forEach(rule => {
      this.registerRule(rule);
    });
  }

  /**
   * Process rate limiting for a request
   */
  async processRequest(request: NextRequest): Promise<NextResponse | null> {
    if (!this.config.enabled) {
      return null;
    }

    try {
      const { pathname } = request.nextUrl;
      const method = request.method;

      // Find applicable rate limit rules
      const applicableRules = this.findApplicableRules(pathname, method);
      
      // Check global limit first if configured
      if (this.config.globalLimit) {
        const globalResult = await this.checkRateLimit(request, this.config.globalLimit);
        if (!globalResult.allowed) {
          return this.createRateLimitResponse(globalResult, this.config.globalLimit);
        }
      }

      // Check each applicable rule
      for (const rule of applicableRules) {
        const result = await this.checkRateLimit(request, rule);
        if (!result.allowed) {
          return this.createRateLimitResponse(result, rule);
        }
      }

      // All checks passed, add rate limit headers to response
      const response = NextResponse.next();
      
      // Add rate limit headers from the most restrictive rule
      if (applicableRules.length > 0) {
        const mostRestrictive = applicableRules.reduce((prev, curr) => 
          prev.requests < curr.requests ? prev : curr
        );
        
        const result = await this.checkRateLimit(request, mostRestrictive);
        this.addRateLimitHeaders(response, result);
      }

      return response;

    } catch (error) {
      console.error('Rate limiting error:', error);
      // Fail open - allow request if rate limiting fails
      return null;
    }
  }

  /**
   * Register a new rate limit rule
   */
  registerRule(rule: RateLimitRule): void {
    const key = `${rule.method || '*'}:${rule.path}`;
    this.rules.set(key, rule);
  }

  /**
   * Remove a rate limit rule
   */
  removeRule(path: string, method?: string): void {
    const key = `${method || '*'}:${path}`;
    this.rules.delete(key);
  }

  /**
   * Check rate limit for a specific rule
   */
  async checkRateLimit(request: NextRequest, rule: RateLimitRule): Promise<RateLimitResult> {
    const key = this.generateRateLimitKey(request, rule);
    const now = Math.floor(Date.now() / 1000);
    const window = rule.window;
    const limit = rule.requests;
    const windowStart = now - (now % window);
    const windowKey = `${this.config.redis.keyPrefix}:${key}:${windowStart}`;

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline();
      
      // Get current count
      pipeline.get(windowKey);
      
      // Increment counter
      pipeline.incr(windowKey);
      pipeline.expire(windowKey, window * 2); // Keep for 2 windows
      
      const results = await pipeline.exec();
      const currentCount = parseInt(results?.[1]?.[1] as string || '0');

      const remaining = Math.max(0, limit - currentCount);
      const resetTime = windowStart + window;
      const retryAfter = currentCount > limit ? resetTime - now : undefined;

      return {
        allowed: currentCount <= limit,
        remaining,
        resetTime,
        totalRequests: currentCount,
        retryAfter
      };

    } catch (error) {
      console.error('Rate limit check error:', error);
      // Fail open
      return {
        allowed: true,
        remaining: limit,
        resetTime: now + window,
        totalRequests: 0
      };
    }
  }

  /**
   * Generate rate limit key based on rule configuration
   */
  private generateRateLimitKey(request: NextRequest, rule: RateLimitRule): string {
    switch (rule.keyGenerator) {
      case 'ip':
        return this.getClientIP(request);
      
      case 'api_key':
        return this.getApiKey(request) || this.getClientIP(request);
      
      case 'user':
        return this.getUserId(request) || this.getClientIP(request);
      
      case 'custom':
        return rule.customKeyGenerator?.(request) || this.getClientIP(request);
      
      default:
        return this.getClientIP(request);
    }
  }

  /**
   * Find applicable rate limit rules for a request
   */
  private findApplicableRules(pathname: string, method: string): RateLimitRule[] {
    const applicableRules: RateLimitRule[] = [];

    for (const [key, rule] of this.rules.entries()) {
      const [ruleMethod, rulePath] = key.split(':', 2);
      
      // Check method match
      if (ruleMethod !== '*' && ruleMethod !== method) {
        continue;
      }

      // Check path match
      if (this.matchesPattern(rulePath, pathname)) {
        applicableRules.push(rule);
      }
    }

    return applicableRules;
  }

  /**
   * Check if pathname matches a pattern
   */
  private matchesPattern(pattern: string, pathname: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\[([^\]]+)\]/g, '([^/]+)'); // Dynamic segments
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  /**
   * Get client IP address
   */
  private getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const clientIP = request.headers.get('x-client-ip');
    
    if (forwarded) {
      return forwarded.split(',')[0].trim();
    }
    
    return realIP || clientIP || 'unknown';
  }

  /**
   * Get API key from request
   */
  private getApiKey(request: NextRequest): string | null {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }
    
    return request.headers.get('x-api-key');
  }

  /**
   * Get user ID from request (from JWT or session)
   */
  private getUserId(request: NextRequest): string | null {
    // This would typically decode JWT or get from session
    // For now, return null and fall back to IP
    return null;
  }

  /**
   * Create rate limit exceeded response
   */
  private createRateLimitResponse(result: RateLimitResult, rule: RateLimitRule): NextResponse {
    const response = NextResponse.json(
      {
        error: 'Rate limit exceeded',
        code: 'RATE_LIMIT_EXCEEDED',
        message: rule.message || `Too many requests. Limit: ${rule.requests} per ${rule.window} seconds`,
        retryAfter: result.retryAfter
      },
      { status: 429 }
    );

    this.addRateLimitHeaders(response, result);
    
    if (result.retryAfter) {
      response.headers.set('Retry-After', result.retryAfter.toString());
    }

    return response;
  }

  /**
   * Add rate limit headers to response
   */
  private addRateLimitHeaders(response: NextResponse, result: RateLimitResult): void {
    response.headers.set('X-RateLimit-Limit', result.totalRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', result.resetTime.toString());
  }
}

/**
 * Default rate limiting configuration
 */
export const defaultRateLimitConfig: RateLimitConfig = {
  enabled: true,
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    keyPrefix: 'rate_limit'
  },
  defaultRules: [
    // API endpoints
    {
      path: '/api/v*/messaging/send',
      method: 'POST',
      requests: 100,
      window: 60, // 1 minute
      keyGenerator: 'api_key',
      message: 'Message sending rate limit exceeded'
    },
    {
      path: '/api/v*/contacts',
      method: 'POST',
      requests: 50,
      window: 60,
      keyGenerator: 'api_key'
    },
    {
      path: '/api/v*/campaigns',
      method: 'POST',
      requests: 10,
      window: 60,
      keyGenerator: 'api_key'
    },
    // General API rate limit
    {
      path: '/api/v*/*',
      requests: 1000,
      window: 3600, // 1 hour
      keyGenerator: 'api_key'
    },
    // Authentication endpoints
    {
      path: '/api/auth/login',
      method: 'POST',
      requests: 5,
      window: 300, // 5 minutes
      keyGenerator: 'ip',
      message: 'Too many login attempts'
    },
    // General IP-based limit
    {
      path: '/api/*',
      requests: 100,
      window: 60,
      keyGenerator: 'ip'
    }
  ],
  globalLimit: {
    path: '*',
    requests: 10000,
    window: 3600,
    keyGenerator: 'ip',
    message: 'Global rate limit exceeded'
  }
};

/**
 * Create rate limiting middleware with default config
 */
export function createRateLimitingMiddleware(
  customConfig?: Partial<RateLimitConfig>
): RateLimitingMiddleware {
  const config = { ...defaultRateLimitConfig, ...customConfig };
  return new RateLimitingMiddleware(config);
}