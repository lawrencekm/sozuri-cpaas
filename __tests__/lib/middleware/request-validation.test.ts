import { NextRequest } from 'next/server';
import { z } from 'zod';
import { 
  RequestValidationMiddleware, 
  CommonSchemas,
  createRequestValidationMiddleware 
} from '@/lib/middleware/request-validation';

// Mock NextRequest
function createMockRequest(
  url: string, 
  method: string = 'GET',
  body?: any,
  headers: Record<string, string> = {}
): NextRequest {
  const request = new NextRequest(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers
    },
    body: body ? JSON.stringify(body) : undefined
  });
  
  return request;
}

describe('RequestValidationMiddleware', () => {
  let middleware: RequestValidationMiddleware;

  beforeEach(() => {
    middleware = createRequestValidationMiddleware();
  });

  describe('validateRequest', () => {
    it('should validate valid message sending request', async () => {
      const validBody = {
        to: '+1234567890',
        message: 'Hello, World!',
        from: 'TestSender'
      };

      const request = createMockRequest(
        'https://example.com/api/v2/messaging/send',
        'POST',
        validBody
      );

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).not.toBe(400);
    });

    it('should reject invalid message sending request', async () => {
      const invalidBody = {
        to: '', // Empty recipient
        message: '', // Empty message
      };

      const request = createMockRequest(
        'https://example.com/api/v2/messaging/send',
        'POST',
        invalidBody
      );

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).toBe(400);
      
      const responseBody = await response?.json();
      expect(responseBody.error).toBe('Validation failed');
      expect(responseBody.details).toBeInstanceOf(Array);
    });

    it('should validate contact creation request', async () => {
      const validBody = {
        firstName: 'John',
        lastName: 'Doe',
        mobile: '+1234567890',
        email: 'john@example.com'
      };

      const request = createMockRequest(
        'https://example.com/api/v2/contacts',
        'POST',
        validBody
      );

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).not.toBe(400);
    });

    it('should reject invalid contact creation request', async () => {
      const invalidBody = {
        firstName: '', // Empty name
        mobile: 'invalid-phone', // Invalid phone format
        email: 'invalid-email' // Invalid email format
      };

      const request = createMockRequest(
        'https://example.com/api/v2/contacts',
        'POST',
        invalidBody
      );

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).toBe(400);
    });

    it('should skip validation for unmatched routes', async () => {
      const request = createMockRequest(
        'https://example.com/api/v2/unmatched-route',
        'GET'
      );

      const response = await middleware.validateRequest(request);
      
      expect(response).toBeNull();
    });

    it('should handle form data requests', async () => {
      const request = new NextRequest('https://example.com/api/v2/messaging/send', {
        method: 'POST',
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        body: 'to=%2B1234567890&message=Hello'
      });

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).not.toBe(400);
    });
  });

  describe('validateWithSchema', () => {
    it('should validate data against schema successfully', async () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(0)
      });

      const validData = { name: 'John', age: 25 };
      
      const result = await middleware.validateWithSchema(validData, schema);
      
      expect(result.isValid).toBe(true);
      expect(result.data).toEqual(validData);
      expect(result.errors).toBeUndefined();
    });

    it('should return errors for invalid data', async () => {
      const schema = z.object({
        name: z.string().min(1),
        age: z.number().min(0)
      });

      const invalidData = { name: '', age: -1 };
      
      const result = await middleware.validateWithSchema(invalidData, schema);
      
      expect(result.isValid).toBe(false);
      expect(result.errors).toBeInstanceOf(Array);
      expect(result.errors?.length).toBeGreaterThan(0);
    });
  });

  describe('registerValidationRule', () => {
    it('should register custom validation rule', async () => {
      const customSchema = z.object({
        customField: z.string().min(1)
      });

      middleware.registerValidationRule({
        path: '/api/v2/custom',
        method: 'POST',
        schema: customSchema
      });

      const request = createMockRequest(
        'https://example.com/api/v2/custom',
        'POST',
        { customField: '' } // Invalid
      );

      const response = await middleware.validateRequest(request);
      
      expect(response?.status).toBe(400);
    });
  });
});

describe('CommonSchemas', () => {
  describe('pagination', () => {
    it('should validate valid pagination parameters', () => {
      const validData = { page: 1, limit: 20, sort: 'createdAt', order: 'desc' };
      
      const result = CommonSchemas.pagination.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should apply defaults for missing parameters', () => {
      const result = CommonSchemas.pagination.safeParse({});
      
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.page).toBe(1);
        expect(result.data.limit).toBe(20);
        expect(result.data.order).toBe('desc');
      }
    });

    it('should reject invalid pagination parameters', () => {
      const invalidData = { page: 0, limit: 101 }; // page < 1, limit > 100
      
      const result = CommonSchemas.pagination.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('sendMessage', () => {
    it('should validate single recipient message', () => {
      const validData = {
        to: '+1234567890',
        message: 'Hello, World!'
      };
      
      const result = CommonSchemas.sendMessage.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should validate multiple recipients message', () => {
      const validData = {
        to: ['+1234567890', '+0987654321'],
        message: 'Hello, World!'
      };
      
      const result = CommonSchemas.sendMessage.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject empty message', () => {
      const invalidData = {
        to: '+1234567890',
        message: ''
      };
      
      const result = CommonSchemas.sendMessage.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject message too long', () => {
      const invalidData = {
        to: '+1234567890',
        message: 'x'.repeat(1601) // Too long
      };
      
      const result = CommonSchemas.sendMessage.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('createContact', () => {
    it('should validate valid contact data', () => {
      const validData = {
        firstName: 'John',
        lastName: 'Doe',
        mobile: '+1234567890',
        email: 'john@example.com'
      };
      
      const result = CommonSchemas.createContact.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid mobile number', () => {
      const invalidData = {
        firstName: 'John',
        mobile: 'invalid-phone'
      };
      
      const result = CommonSchemas.createContact.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });

    it('should reject invalid email', () => {
      const invalidData = {
        firstName: 'John',
        mobile: '+1234567890',
        email: 'invalid-email'
      };
      
      const result = CommonSchemas.createContact.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });
});