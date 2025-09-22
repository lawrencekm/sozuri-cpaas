/**
 * Field mapping and validation utilities
 * 
 * This module provides comprehensive field mapping and validation infrastructure
 * for converting between API and database field formats, with standardized
 * error handling and validation schemas.
 */

// Types
export * from './types';

// Field mappings
export { FIELD_MAPPINGS } from './mappings';

// Field transformation utilities
export { FieldTransformer } from './transformer';

// Validation
export { VALIDATION_SCHEMAS } from '../validation/schemas';
export { DataValidator } from '../validation/validator';

// API utilities
export { ApiErrorHandler, ApiErrorCode } from '../api/error-handler';
export { ApiMiddleware } from '../api/middleware';

// Import the classes first
import { FieldTransformer } from './transformer';
import { DataValidator } from '../validation/validator';
import { ApiErrorHandler } from '../api/error-handler';
import { ApiMiddleware } from '../api/middleware';

// Convenience functions for common operations
export const fieldMapping = {
  /**
   * Transform database record to API format
   */
  toApi: <T = any>(model: string, data: any): T => {
    return FieldTransformer.toApiFormat<T>(model, data);
  },

  /**
   * Transform API data to database format
   */
  toDb: <T = any>(model: string, data: any): T => {
    return FieldTransformer.toDbFormat<T>(model, data);
  },

  /**
   * Transform array of records to API format
   */
  toApiArray: <T = any>(model: string, data: any[]): T[] => {
    return FieldTransformer.toApiFormatArray<T>(model, data);
  },

  /**
   * Transform array of records to database format
   */
  toDbArray: <T = any>(model: string, data: any[]): T[] => {
    return FieldTransformer.toDbFormatArray<T>(model, data);
  }
};

export const validation = {
  /**
   * Validate data for create operation
   */
  create: (model: string, data: any) => {
    return DataValidator.validateCreate(model, data);
  },

  /**
   * Validate data for update operation
   */
  update: (model: string, data: any) => {
    return DataValidator.validateUpdate(model, data);
  },

  /**
   * Validate query parameters
   */
  query: (model: string, data: any) => {
    return DataValidator.validateQuery(model, data);
  },

  /**
   * Sanitize data by removing invalid fields
   */
  sanitize: (model: string, operation: 'create' | 'update' | 'query', data: any) => {
    return DataValidator.sanitize(model, operation, data);
  }
};

export const errorHandling = {
  /**
   * Handle Prisma database errors
   */
  prisma: (error: any) => {
    return ApiErrorHandler.handlePrismaError(error);
  },

  /**
   * Handle validation errors
   */
  validation: (errors: any[]) => {
    return ApiErrorHandler.handleValidationError(errors);
  },

  /**
   * Handle authentication errors
   */
  auth: (message?: string) => {
    return ApiErrorHandler.handleAuthError(message);
  },

  /**
   * Handle authorization errors
   */
  forbidden: (message?: string) => {
    return ApiErrorHandler.handleForbiddenError(message);
  },

  /**
   * Handle not found errors
   */
  notFound: (resource?: string) => {
    return ApiErrorHandler.handleNotFoundError(resource);
  },

  /**
   * Create success response
   */
  success: <T>(data: T, message?: string, statusCode?: number) => {
    return ApiErrorHandler.createSuccessResponse(data, message, statusCode);
  },

  /**
   * Create paginated response
   */
  paginated: <T>(items: T[], total: number, page: number, limit: number, message?: string) => {
    return ApiErrorHandler.createPaginatedResponse(items, total, page, limit, message);
  }
};

// Default export with all utilities
export default {
  fieldMapping,
  validation,
  errorHandling,
  FieldTransformer,
  DataValidator,
  ApiErrorHandler,
  ApiMiddleware
};