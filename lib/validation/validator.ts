/**
 * Data validation utilities
 */

import { ValidationRule, ValidationError, ValidationResult } from '../field-mapping/types';
import { VALIDATION_SCHEMAS } from './schemas';

export class DataValidator {
  /**
   * Validate data against model schema
   */
  static validate(
    modelName: string, 
    operation: 'create' | 'update' | 'query', 
    data: any
  ): ValidationResult {
    const schema = VALIDATION_SCHEMAS[modelName];
    if (!schema) {
      return {
        isValid: false,
        errors: [{ field: 'model', message: `No validation schema found for model: ${modelName}`, code: 'SCHEMA_NOT_FOUND' }]
      };
    }

    const rules = schema[operation];
    if (!rules) {
      return {
        isValid: false,
        errors: [{ field: 'operation', message: `No validation rules found for operation: ${operation}`, code: 'RULES_NOT_FOUND' }]
      };
    }

    const errors: ValidationError[] = [];
    const validatedData: any = {};

    // Validate each field according to rules
    for (const rule of rules) {
      const fieldValue = data[rule.field];
      const fieldErrors = this.validateField(rule, fieldValue);
      
      if (fieldErrors.length > 0) {
        errors.push(...fieldErrors);
      } else if (fieldValue !== undefined) {
        validatedData[rule.field] = fieldValue;
      }
    }

    // Check for unknown fields (not in schema)
    const allowedFields = new Set(rules.map(rule => rule.field));
    for (const field in data) {
      if (!allowedFields.has(field)) {
        // Allow unknown fields but warn
        validatedData[field] = data[field];
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      data: validatedData
    };
  }

  /**
   * Validate a single field against its rule
   */
  private static validateField(rule: ValidationRule, value: any): ValidationError[] {
    const errors: ValidationError[] = [];

    // Check required fields
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push({
        field: rule.field,
        message: `${rule.field} is required`,
        code: 'REQUIRED_FIELD'
      });
      return errors; // Don't validate further if required field is missing
    }

    // Skip validation if field is not provided and not required
    if (value === undefined || value === null) {
      return errors;
    }

    // Type validation
    const typeError = this.validateType(rule, value);
    if (typeError) {
      errors.push(typeError);
      return errors; // Don't validate further if type is wrong
    }

    // String validations
    if (rule.type === 'string' && typeof value === 'string') {
      if (rule.minLength && value.length < rule.minLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be at least ${rule.minLength} characters long`,
          code: 'MIN_LENGTH'
        });
      }

      if (rule.maxLength && value.length > rule.maxLength) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must not exceed ${rule.maxLength} characters`,
          code: 'MAX_LENGTH'
        });
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} format is invalid`,
          code: 'INVALID_FORMAT'
        });
      }
    }

    // Number validations
    if (rule.type === 'number' && typeof value === 'number') {
      if (rule.min !== undefined && value < rule.min) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be at least ${rule.min}`,
          code: 'MIN_VALUE'
        });
      }

      if (rule.max !== undefined && value > rule.max) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must not exceed ${rule.max}`,
          code: 'MAX_VALUE'
        });
      }
    }

    // Enum validation
    if (rule.type === 'enum' && rule.enumValues) {
      if (!rule.enumValues.includes(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be one of: ${rule.enumValues.join(', ')}`,
          code: 'INVALID_ENUM'
        });
      }
    }

    // Email validation
    if (rule.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be a valid email address`,
          code: 'INVALID_EMAIL'
        });
      }
    }

    // Phone validation
    if (rule.type === 'phone') {
      const phoneRegex = /^\+?[1-9]\d{1,14}$/; // Basic international phone format
      if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
        errors.push({
          field: rule.field,
          message: `${rule.field} must be a valid phone number`,
          code: 'INVALID_PHONE'
        });
      }
    }

    // Custom validation
    if (rule.customValidator) {
      const customResult = rule.customValidator(value);
      if (customResult !== true) {
        errors.push({
          field: rule.field,
          message: typeof customResult === 'string' ? customResult : `${rule.field} is invalid`,
          code: 'CUSTOM_VALIDATION'
        });
      }
    }

    return errors;
  }

  /**
   * Validate field type
   */
  private static validateType(rule: ValidationRule, value: any): ValidationError | null {
    switch (rule.type) {
      case 'string':
      case 'email':
      case 'phone':
        if (typeof value !== 'string') {
          return {
            field: rule.field,
            message: `${rule.field} must be a string`,
            code: 'INVALID_TYPE'
          };
        }
        break;

      case 'number':
        if (typeof value !== 'number' || isNaN(value)) {
          return {
            field: rule.field,
            message: `${rule.field} must be a number`,
            code: 'INVALID_TYPE'
          };
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          return {
            field: rule.field,
            message: `${rule.field} must be a boolean`,
            code: 'INVALID_TYPE'
          };
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          return {
            field: rule.field,
            message: `${rule.field} must be an array`,
            code: 'INVALID_TYPE'
          };
        }
        break;

      case 'object':
        if (typeof value !== 'object' || Array.isArray(value) || value === null) {
          return {
            field: rule.field,
            message: `${rule.field} must be an object`,
            code: 'INVALID_TYPE'
          };
        }
        break;

      case 'date':
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          return {
            field: rule.field,
            message: `${rule.field} must be a valid date`,
            code: 'INVALID_DATE'
          };
        }
        break;

      case 'enum':
        // Enum validation is handled separately
        break;

      default:
        return {
          field: rule.field,
          message: `Unknown validation type: ${rule.type}`,
          code: 'UNKNOWN_TYPE'
        };
    }

    return null;
  }

  /**
   * Validate query parameters
   */
  static validateQuery(modelName: string, queryParams: any): ValidationResult {
    return this.validate(modelName, 'query', queryParams);
  }

  /**
   * Validate create data
   */
  static validateCreate(modelName: string, data: any): ValidationResult {
    return this.validate(modelName, 'create', data);
  }

  /**
   * Validate update data
   */
  static validateUpdate(modelName: string, data: any): ValidationResult {
    return this.validate(modelName, 'update', data);
  }

  /**
   * Get validation schema for a model
   */
  static getSchema(modelName: string) {
    return VALIDATION_SCHEMAS[modelName] || null;
  }

  /**
   * Check if a model has validation schema
   */
  static hasSchema(modelName: string): boolean {
    return modelName in VALIDATION_SCHEMAS;
  }

  /**
   * Sanitize data by removing invalid fields
   */
  static sanitize(modelName: string, operation: 'create' | 'update' | 'query', data: any): any {
    const schema = VALIDATION_SCHEMAS[modelName];
    if (!schema || !schema[operation]) {
      return data;
    }

    const allowedFields = new Set(schema[operation].map(rule => rule.field));
    const sanitized: any = {};

    for (const [key, value] of Object.entries(data || {})) {
      if (allowedFields.has(key)) {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}