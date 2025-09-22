import * as crypto from 'crypto';
import { ApiKeyV2Data } from './types';

export interface GeneratedApiKey {
  key: string; // The actual API key to give to the user
  keyHash: string; // Hashed version to store in database
  keyPrefix: string; // First 8 characters for display
}

/**
 * Generate a new API key with proper formatting and security
 */
export function generateApiKey(environment: 'live' | 'test' = 'live'): GeneratedApiKey {
  // Generate random bytes for the key
  const randomBytes = crypto.randomBytes(32);
  const keySecret = randomBytes.toString('base64url');
  
  // Create the full API key with prefix
  const prefix = environment === 'live' ? 'ak_live_' : 'ak_test_';
  const key = `${prefix}${keySecret}`;
  
  // Create hash for storage (never store the actual key)
  const keyHash = hashApiKey(key);
  
  // Create display prefix (first 8 characters)
  const keyPrefix = key.substring(0, 8);
  
  return {
    key,
    keyHash,
    keyPrefix
  };
}

/**
 * Hash an API key for secure storage
 */
export function hashApiKey(key: string): string {
  return crypto
    .createHash('sha256')
    .update(key)
    .digest('hex');
}

/**
 * Verify an API key against its hash
 */
export function verifyApiKey(key: string, hash: string): boolean {
  const keyHash = hashApiKey(key);
  return crypto.timingSafeEqual(
    Buffer.from(keyHash, 'hex'),
    Buffer.from(hash, 'hex')
  );
}

/**
 * Extract environment from API key
 */
export function getApiKeyEnvironment(key: string): 'live' | 'test' | 'unknown' {
  if (key.startsWith('ak_live_')) return 'live';
  if (key.startsWith('ak_test_')) return 'test';
  return 'unknown';
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(key: string): boolean {
  // Check if it matches the expected format
  const pattern = /^ak_(live|test)_[A-Za-z0-9_-]{43}$/;
  return pattern.test(key);
}

/**
 * Mask an API key for display purposes
 */
export function maskApiKey(key: string): string {
  if (key.length < 12) return key;
  
  const prefix = key.substring(0, 8);
  const suffix = key.substring(key.length - 4);
  const masked = '•'.repeat(Math.max(0, key.length - 12));
  
  return `${prefix}${masked}${suffix}`;
}

/**
 * Generate a secure random string for various purposes
 */
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('base64url');
}

/**
 * Create API key rotation utilities
 */
export class ApiKeyRotation {
  /**
   * Generate a new API key for rotation
   */
  static generateRotationKey(currentKey: string): GeneratedApiKey {
    const environment = getApiKeyEnvironment(currentKey);
    return generateApiKey(environment === 'unknown' ? 'live' : environment);
  }

  /**
   * Check if an API key should be rotated based on age and usage
   */
  static shouldRotate(apiKey: ApiKeyV2Data, maxAge: number = 90): boolean {
    const now = new Date();
    const createdAt = new Date(apiKey.createdAt);
    const ageInDays = (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
    
    // Rotate if older than maxAge days
    if (ageInDays > maxAge) return true;
    
    // Rotate if usage is very high (potential compromise)
    if (apiKey.usageCount > 1000000) return true;
    
    // Rotate if not used in 30 days (inactive key)
    if (apiKey.lastUsedAt) {
      const lastUsed = new Date(apiKey.lastUsedAt);
      const daysSinceLastUse = (now.getTime() - lastUsed.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceLastUse > 30) return true;
    }
    
    return false;
  }

  /**
   * Generate rotation schedule for API keys
   */
  static getRotationSchedule(apiKey: ApiKeyV2Data): {
    nextRotation: Date;
    isOverdue: boolean;
    daysUntilRotation: number;
  } {
    const createdAt = new Date(apiKey.createdAt);
    const nextRotation = new Date(createdAt.getTime() + (90 * 24 * 60 * 60 * 1000)); // 90 days
    const now = new Date();
    const daysUntilRotation = Math.ceil((nextRotation.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      nextRotation,
      isOverdue: daysUntilRotation < 0,
      daysUntilRotation
    };
  }
}