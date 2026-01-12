// Simple cache helpers on top of Redis
// - get/set with JSON
// - withCache helper with TTL
// - namespacing for safer keys across environments

import type { Redis } from 'ioredis'
import { getRedis } from './redis'

export interface CacheOptions<T> {
  ttlSeconds?: number
  staleTtlSeconds?: number // reserved for future stale-while-revalidate
  serialize?: (v: T) => string
  deserialize?: (s: string) => T
}

const defaultSerialize = <T>(v: T) => JSON.stringify(v)
const defaultDeserialize = <T>(s: string) => JSON.parse(s) as T

function prefix(): string {
  const env = process.env.NODE_ENV || 'development'
  return `sozuri:${env}`
}

export function buildKey(parts: Array<string | number | undefined | null>) {
  return [prefix(), ...parts.filter(Boolean)].join(':')
}

export async function cacheGet<T>(key: string, opts?: CacheOptions<T>): Promise<T | null> {
  const redis = getRedis()
  const raw = await redis.get(key)
  if (!raw) return null
  const deserialize = opts?.deserialize || defaultDeserialize<T>
  try {
    return deserialize(raw)
  } catch {
    return null
  }
}

export async function cacheSet<T>(key: string, value: T, opts?: CacheOptions<T>) {
  const redis = getRedis()
  const serialize = opts?.serialize || defaultSerialize<T>
  const payload = serialize(value)
  if (opts?.ttlSeconds && opts.ttlSeconds > 0) {
    await redis.set(key, payload, 'EX', opts.ttlSeconds)
  } else {
    await redis.set(key, payload)
  }
}

export async function cacheDel(key: string) {
  const redis = getRedis()
  await redis.del(key)
}

export async function withCache<T>(
  key: string,
  compute: () => Promise<T>,
  opts?: CacheOptions<T>
): Promise<T> {
  const hit = await cacheGet<T>(key, opts)
  if (hit !== null) return hit
  const data = await compute()
  await cacheSet<T>(key, data, opts)
  return data
}

export async function cachePing(): Promise<boolean> {
  const redis = getRedis()
  try {
    const pong = await redis.ping()
    return pong === 'PONG'
  } catch {
    return false
  }
}