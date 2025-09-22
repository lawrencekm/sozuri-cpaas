import { NextRequest, NextResponse } from 'next/server';
import { z, ZodSchema, ZodError } from 'zod';

export interface ValidationRule {
  path: string;
  method?: string;
  headers?: Record<string, string | RegExp>;
  queryParams?: Record<string, string | RegExp>;
  bodySchema?: ZodSchema;
  maxBodySize?: number;
  allowedContentTypes?: string[];
  schema?: ZodSchema;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  data?: any;
  errors?: ValidationError[];
}

export interface RequestValidationConfig {
  enabled: boolean;
  rules: ValidationRule[];
  defaultMaxBodySize: number;
  defaultAllowedContentTypes: string[];
  requestValidation?: boolean;
  responseValidation?: boolean;
  schemaValidation?: boolean;
  customValidators?: ValidationRule[];
}

export class RequestValidationMiddleware {
  private config: RequestValidationConfig;
  private rules: Map<string, ValidationRule>;
  private validationRules: Map<string, ValidationRule>;

  constructor(config: RequestValidationConfig) {
    this.config = config;
    this.rules = new Map();
    this.validationRules = new Map();

    // Register validation rules
    const rulesToRegister = config.rules || config.customValidators || [];
    rulesToRegister.forEach(rule => {
      this.registerRule(rule);
    });
  }

  /**
   * Register a validation rule
   */
  registerRule(rule: ValidationRule): void {
    const key = `${rule.method || 'ALL'}:${rule.path}`;
    this.rules.set(key, rule);
    this.validationRules.set(key, rule);
  }

  /**
   * Validate request based on registered rules
   */
  async validateRequest(request: NextRequest): Promise<NextResponse | null> {
    if (!this.config.enabled && !this.config.requestValidation) {
      return null;
    }

    const { pathname } = request.nextUrl;
    const method = request.method;
    const key = `${method}:${pathname}`;

    // Find matching validation rule
    const rule = this.findMatchingRule(key, pathname, method);
    if (!rule) {
      return null; // No validation rule found, continue
    }

    try {
      // Get request body for validation
      const body = await this.getRequestBody(request);

      // Validate against schema
      const schema = rule.schema || rule.bodySchema;
      if (schema) {
        const validationResult = await this.validateWithSchema(body, schema);

        if (!validationResult.isValid) {
          return this.createValidationErrorResponse(validationResult.errors || []);
        }

        // Add validated data to request headers for downstream handlers
        const response = NextResponse.next();
        response.headers.set('X-Validated-Data', JSON.stringify(validationResult.data));

        return response;
      }

      return null;

    } catch (error) {
      console.error('Request validation error:', error);
      return this.createValidationErrorResponse([{
        field: 'request',
        message: 'Invalid request format',
        code: 'INVALID_REQUEST'
      }]);
    }
  }

  /**
   * Register a new validation rule
   */
  registerValidationRule(rule: ValidationRule): void {
    const key = `${rule.method}:${rule.path}`;
    this.validationRules.set(key, rule);
  }

  /**
   * Remove a validation rule
   */
  removeValidationRule(method: string, path: string): void {
    const key = `${method}:${path}`;
    this.validationRules.delete(key);
  }

  /**
   * Validate data against a Zod schema
   */
  async validateWithSchema(data: any, schema: ZodSchema): Promise<ValidationResult> {
    try {
      const validatedData = schema.parse(data);
      return {
        isValid: true,
        data: validatedData
      };
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: ValidationError[] = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }));

        return {
          isValid: false,
          errors
        };
      }

      return {
        isValid: false,
        errors: [{
          field: 'unknown',
          message: 'Validation failed',
          code: 'VALIDATION_ERROR'
        }]
      };
    }
  }

  /**
   * Find matching validation rule for request
   */
  private findMatchingRule(key: string, pathname: string, method: string): ValidationRule | null {
    // Exact match first
    if (this.validationRules.has(key)) {
      return this.validationRules.get(key)!;
    }

    // Pattern matching for dynamic routes
    for (const [, rule] of this.validationRules.entries()) {
      if (this.matchesPattern(rule.path, pathname) && rule.method === method) {
        return rule;
      }
    }

    return null;
  }

  /**
   * Check if pathname matches a pattern (supports wildcards)
   */
  private matchesPattern(pattern: string, pathname: string): boolean {
    // Convert pattern to regex
    const regexPattern = pattern
      .replace(/\*/g, '.*')
      .replace(/\[([^\]]+)\]/g, '([^/]+)'); // Dynamic segments like [id]

    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(pathname);
  }

  /**
   * Extract request body safely
   */
  private async getRequestBody(request: NextRequest): Promise<any> {
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      try {
        return await request.json();
      } catch {
        return {};
      }
    }

    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      const body: Record<string, any> = {};

      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }

      return body;
    }

    // For GET requests or other methods, use query parameters
    const url = new URL(request.url);
    const queryParams: Record<string, any> = {};

    for (const [key, value] of url.searchParams.entries()) {
      queryParams[key] = value;
    }

    return queryParams;
  }

  /**
   * Create validation error response
   */
  private createValidationErrorResponse(errors: ValidationError[]): NextResponse {
    return NextResponse.json(
      {
        error: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: errors
      },
      { status: 400 }
    );
  }
}

// Common validation schemas
export const CommonSchemas = {
  // Pagination schema
  pagination: z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
    sort: z.string().optional(),
    order: z.enum(['asc', 'desc']).default('desc')
  }),

  // Date range schema
  dateRange: z.object({
    startDate: z.string().datetime().optional(),
    endDate: z.string().datetime().optional()
  }),

  // Message sending schema
  sendMessage: z.object({
    to: z.union([
      z.string().min(1),
      z.array(z.string().min(1)).min(1)
    ]),
    message: z.string().min(1).max(1600),
    from: z.string().optional(),
    mediaUrl: z.string().url().optional(),
    scheduledAt: z.string().datetime().optional(),
    callbackUrl: z.string().url().optional()
  }),

  // Contact creation schema
  createContact: z.object({
    firstName: z.string().min(1).max(100),
    lastName: z.string().min(1).max(100).optional(),
    mobile: z.string().regex(/^\+?[1-9]\d{1,14}$/),
    email: z.string().email().optional(),
    customFields: z.record(z.any()).optional(),
    tags: z.array(z.string()).optional()
  }),

  // Campaign creation schema
  createCampaign: z.object({
    name: z.string().min(1).max(255),
    description: z.string().max(1000).optional(),
    type: z.enum(['sms', 'whatsapp', 'voice', 'email']),
    audience: z.enum(['all', 'list', 'segment', 'custom']),
    contactListIds: z.array(z.string().uuid()).optional(),
    scheduledAt: z.string().datetime().optional(),
    maxBudget: z.number().positive().optional(),
    maxMessages: z.number().positive().optional()
  }),

  // API key creation schema
  createApiKey: z.object({
    name: z.string().min(1).max(255),
    permissions: z.array(z.object({
      resource: z.string(),
      actions: z.array(z.string())
    })),
    scopes: z.array(z.string()),
    expiresAt: z.string().datetime().optional(),
    rateLimit: z.object({
      requests: z.number().positive(),
      window: z.number().positive(),
      burst: z.number().positive().optional()
    }).optional()
  })
};

/**
 * Create request validation middleware with default config
 */
export function createRequestValidationMiddleware(
  customRules: ValidationRule[] = []
): RequestValidationMiddleware {
  const config: RequestValidationConfig = {
    enabled: true,
    rules: [],
    defaultMaxBodySize: 1024 * 1024, // 1MB
    defaultAllowedContentTypes: ['application/json', 'application/x-www-form-urlencoded'],
    requestValidation: true,
    responseValidation: false,
    schemaValidation: true,
    customValidators: [
      // Default validation rules
      {
        path: '/api/v*/messaging/send',
        method: 'POST',
        schema: CommonSchemas.sendMessage
      },
      {
        path: '/api/v*/contacts',
        method: 'POST',
        schema: CommonSchemas.createContact
      },
      {
        path: '/api/v*/campaigns',
        method: 'POST',
        schema: CommonSchemas.createCampaign
      },
      {
        path: '/api/v*/api-keys',
        method: 'POST',
        schema: CommonSchemas.createApiKey
      },
      ...customRules
    ]
  };

  return new RequestValidationMiddleware(config);
}