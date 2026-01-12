export interface ApiKeyPermission {
  resource: string; // e.g., 'sms', 'contacts', 'campaigns', 'analytics'
  actions: string[]; // e.g., ['read', 'write', 'delete']
  conditions?: Record<string, any>; // Optional conditions for fine-grained access
}

export interface ApiKeyScope {
  name: string; // e.g., 'messaging:send', 'contacts:read', 'analytics:read'
  description: string;
}

export interface RateLimitConfig {
  requests: number;
  window: number; // seconds
  burst?: number;
  keyGenerator?: 'ip' | 'key' | 'user';
}

export interface ApiKeyV2Data {
  id: string;
  projectId: string;
  userId?: string;
  name: string;
  keyHash: string;
  keyPrefix: string;
  permissions: ApiKeyPermission[];
  scopes: ApiKeyScope[];
  rateLimit?: RateLimitConfig;
  expiresAt?: Date;
  lastUsedAt?: Date;
  usageCount: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateApiKeyRequest {
  projectId: string;
  userId?: string;
  name: string;
  permissions: ApiKeyPermission[];
  scopes: string[]; // Array of scope names
  rateLimit?: RateLimitConfig;
  expiresAt?: Date;
}

export interface UpdateApiKeyRequest {
  name?: string;
  permissions?: ApiKeyPermission[];
  scopes?: string[];
  rateLimit?: RateLimitConfig;
  expiresAt?: Date;
  isActive?: boolean;
}

export interface ApiKeyValidationResult {
  isValid: boolean;
  apiKey?: ApiKeyV2Data;
  error?: string;
  isExpired?: boolean;
  isRateLimited?: boolean;
  remainingRequests?: number;
}

export interface ApiKeyUsageStats {
  totalRequests: number;
  requestsToday: number;
  requestsThisMonth: number;
  averageResponseTime: number;
  errorRate: number;
  lastUsed?: Date;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    averageResponseTime: number;
  }>;
}

// Predefined scopes for the API
export const API_SCOPES: Record<string, ApiKeyScope> = {
  // Messaging scopes
  'messaging:send': {
    name: 'messaging:send',
    description: 'Send messages via SMS, WhatsApp, or other channels'
  },
  'messaging:read': {
    name: 'messaging:read',
    description: 'Read message logs and delivery status'
  },
  'messaging:webhook': {
    name: 'messaging:webhook',
    description: 'Receive webhook notifications for message events'
  },

  // Contacts scopes
  'contacts:read': {
    name: 'contacts:read',
    description: 'Read contact information and lists'
  },
  'contacts:write': {
    name: 'contacts:write',
    description: 'Create and update contacts and lists'
  },
  'contacts:delete': {
    name: 'contacts:delete',
    description: 'Delete contacts and lists'
  },

  // Campaigns scopes
  'campaigns:read': {
    name: 'campaigns:read',
    description: 'Read campaign information and statistics'
  },
  'campaigns:write': {
    name: 'campaigns:write',
    description: 'Create and update campaigns'
  },
  'campaigns:execute': {
    name: 'campaigns:execute',
    description: 'Start, pause, and stop campaigns'
  },

  // Analytics scopes
  'analytics:read': {
    name: 'analytics:read',
    description: 'Read analytics data and reports'
  },
  'analytics:export': {
    name: 'analytics:export',
    description: 'Export analytics data'
  },

  // Project scopes
  'project:read': {
    name: 'project:read',
    description: 'Read project information and settings'
  },
  'project:write': {
    name: 'project:write',
    description: 'Update project settings'
  },

  // Webhook scopes
  'webhooks:read': {
    name: 'webhooks:read',
    description: 'Read webhook configurations'
  },
  'webhooks:write': {
    name: 'webhooks:write',
    description: 'Create and update webhook configurations'
  },

  // Admin scopes (for elevated access)
  'admin:users': {
    name: 'admin:users',
    description: 'Manage users and permissions'
  },
  'admin:billing': {
    name: 'admin:billing',
    description: 'Access billing and payment information'
  }
};

// Default rate limits by scope
export const DEFAULT_RATE_LIMITS: Record<string, RateLimitConfig> = {
  'messaging:send': {
    requests: 1000,
    window: 3600, // 1 hour
    burst: 100
  },
  'messaging:read': {
    requests: 5000,
    window: 3600,
    burst: 500
  },
  'contacts:write': {
    requests: 500,
    window: 3600,
    burst: 50
  },
  'analytics:read': {
    requests: 1000,
    window: 3600,
    burst: 100
  },
  default: {
    requests: 1000,
    window: 3600,
    burst: 100
  }
};