// Redis client singleton using ioredis
// Supports local Redis (Docker) and cloud providers via REDIS_URL

import Redis from 'ioredis'

declare global {
  // eslint-disable-next-line no-var
  var __redisClient: Redis | undefined
}

export type RedisClient = Redis

export function getRedis(): RedisClient {
  if (!global.__redisClient) {
    const url = process.env.REDIS_URL || 'redis://localhost:6379'

    // Allow optional TLS for hosted providers (rediss)
    const isRediss = url.startsWith('rediss://')

    global.__redisClient = new Redis(url, {
      // Avoid noisy reconnect spam in dev
      retryStrategy(times) {
        const delay = Math.min(times * 200, 2000)
        return delay
      },
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      tls: isRediss ? {} : undefined,
    })

    global.__redisClient.on('error', (err) => {
      if (process.env.NODE_ENV !== 'test') {
        console.error('[redis] client error:', err)
      }
    })
  }
  return global.__redisClient
}

export default getRedis()