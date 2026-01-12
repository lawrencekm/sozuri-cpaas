import { Redis } from 'ioredis';
import { RateLimitConfig } from './types';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
  totalRequests: number;
}

export class RateLimiter {
  private redis: Redis;

  constructor() {
    // Initialize Redis connection
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
  }

  /**
   * Check if a request is allowed under the rate limit
   */
  async checkRateLimit(
    keyId: string, 
    config: RateLimitConfig
  ): Promise<RateLimitResult> {
    const key = `rate_limit:${keyId}`;
    const now = Math.floor(Date.now() / 1000);
    const window = config.window;
    const limit = config.requests;
    const windowStart = now - (now % window);
    const windowKey = `${key}:${windowStart}`;

    try {
      // Use Redis pipeline for atomic operations
      const pipeline = this.redis.pipeline();
      
      // Increment the counter for this window
      pipeline.incr(windowKey);
      pipeline.expire(windowKey, window * 2); // Keep for 2 windows
      
      const results = await pipeline.exec();
      const currentCount = results?.[0]?.[1] as number || 0;

      const remaining = Math.max(0, limit - currentCount);
      const resetTime = windowStart + window;

      return {
        allowed: currentCount <= limit,
        remaining,
        resetTime,
        totalRequests: currentCount
      };

    } catch (error) {
      console.error('Rate limiter error:', error);
      // Fail open - allow the request if Redis is down
      return {
        allowed: true,
        remaining: limit,
        resetTime: now + window,
        totalRequests: 0
      };
    }
  }
}