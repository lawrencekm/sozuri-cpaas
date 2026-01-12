/**
 * Tests for data validation utilities
 */

import { DataValidator } from '../../validation/validator';

describe('DataValidator', () => {
  describe('validateCreate', () => {
    it('should validate user creation data successfully', () => {
      const userData = {
        email: 'john@example.com',
        first_name: 'John',
        last_name: 'Doe',
        mobile: '+254700000000'
      };

      const result = DataValidator.validateCreate('user', userData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.data).toEqual(userData);
    });

    it('should fail validation for missing required fields', () => {
      const userData = {
        first_name: 'John'
        // Missing required email
      };

      const result = DataValidator.validateCreate('user', userData);

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe('email');
      expect(result.errors[0].code).toBe('REQUIRED_FIELD');
    });

    it('should validate project creation data', () => {
      const projectData = {
        name: 'Test Project',
        description: 'A test project',
        timezone: 'Africa/Nairobi',
        currency: 'KES'
      };

      const result = DataValidator.validateCreate('project', projectData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail validation for invalid enum values', () => {
      const projectData = {
        name: 'Test Project',
        currency: 'INVALID_CURRENCY'
      };

      const result = DataValidator.validateCreate('project', projectData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_ENUM')).toBe(true);
    });
  });

  describe('validateUpdate', () => {
    it('should validate user update data', () => {
      const updateData = {
        id: 'user123',
        first_name: 'Jane',
        is_active: false
      };

      const result = DataValidator.validateUpdate('user', updateData);

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should allow partial updates', () => {
      const updateData = {
        id: 'user123',
        first_name: 'Jane'
        // Only updating first name
      };

      const result = DataValidator.validateUpdate('user', updateData);

      expect(result.isValid).toBe(true);
    });
  });

  describe('validateQuery', () => {
    it('should validate query parameters', () => {
      const queryData = {
        is_active: true,
        search: 'john'
      };

      const result = DataValidator.validateQuery('user', queryData);

      expect(result.isValid).toBe(true);
    });
  });

  describe('field validation', () => {
    it('should validate email format', () => {
      const userData = {
        email: 'invalid-email'
      };

      const result = DataValidator.validateCreate('user', userData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_EMAIL')).toBe(true);
    });

    it('should validate phone format', () => {
      const contactData = {
        project_id: 'proj123',
        user_id: 'user123',
        mobile: 'invalid-phone'
      };

      const result = DataValidator.validateCreate('contact', contactData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_PHONE')).toBe(true);
    });

    it('should validate string length constraints', () => {
      const userData = {
        email: 'test@example.com',
        first_name: 'A'.repeat(101) // Exceeds maxLength of 100
      };

      const result = DataValidator.validateCreate('user', userData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MAX_LENGTH')).toBe(true);
    });

    it('should validate number constraints', () => {
      const campaignData = {
        project_id: 'proj123',
        name: 'Test Campaign',
        max_budget: -100 // Negative value, should fail min constraint
      };

      const result = DataValidator.validateCreate('campaign', campaignData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'MIN_VALUE')).toBe(true);
    });

    it('should validate array types', () => {
      const campaignData = {
        project_id: 'proj123',
        name: 'Test Campaign',
        contact_list_ids: 'not-an-array' // Should be array
      };

      const result = DataValidator.validateCreate('campaign', campaignData);

      expect(result.isValid).toBe(false);
      expect(result.errors.some(e => e.code === 'INVALID_TYPE')).toBe(true);
    });
  });

  describe('sanitize', () => {
    it('should remove fields not in schema', () => {
      const userData = {
        email: 'test@example.com',
        first_name: 'John',
        invalidField: 'should be removed',
        anotherInvalidField: 123
      };

      const sanitized = DataValidator.sanitize('user', 'create', userData);

      expect(sanitized.email).toBe('test@example.com');
      expect(sanitized.first_name).toBe('John');
      expect(sanitized.invalidField).toBeUndefined();
      expect(sanitized.anotherInvalidField).toBeUndefined();
    });
  });

  describe('hasSchema', () => {
    it('should return true for models with schemas', () => {
      expect(DataValidator.hasSchema('user')).toBe(true);
      expect(DataValidator.hasSchema('project')).toBe(true);
      expect(DataValidator.hasSchema('campaign')).toBe(true);
    });

    it('should return false for models without schemas', () => {
      expect(DataValidator.hasSchema('unknownModel')).toBe(false);
    });
  });
});