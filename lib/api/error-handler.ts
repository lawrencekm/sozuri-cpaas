/**
 * Standardized API error handling middleware
 */

import { NextResponse } from 'next/server';
import { ValidationError, ApiResponse } from '../field-mapping/types';

export enum ApiErrorCode {
  // Authentication & Authorization
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  
  // Validation
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_INPUT = 'INVALID_INPUT',
  MISSING_REQUIRED_FIELD = 'MISSING_REQUIRED_FIELD',
  
  // Database
  NOT_FOUND = 'NOT_FOUND',
  DUPLICATE_ENTRY = 'DUPLICATE_ENTRY',
  FOREIGN_KEY_CONSTRAINT = 'FOREIGN_KEY_CONSTRAINT',
  DATABASE_ERROR = 'DATABASE_ERROR',
  
  // Business Logic
  INSUFFICIENT_CREDITS = 'INSUFFICIENT_CREDITS',
  PROJECT_SUSPENDED = 'PROJECT_SUSPENDED',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  
  // System
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT'
}

export interface ApiError {
  code: ApiErrorCode;
  message: string;
  details?: any;
  field?: string;
  statusCode: number;
}

export class ApiErrorHandler {
  /**
   * Create standardized error response
   */
  static createErrorResponse(error: ApiError): NextResponse {
    const response: ApiResponse = {
      success: false,
      error: error.message,
      message: error.message
    };

    // Add validation errors if present
    if (error.details && Array.isArray(error.details)) {
      response.errors = error.details;
    }

    return NextResponse.json(response, { status: error.statusCode });
  }

  /**
   * Handle Prisma database errors
   */
  static handlePrismaError(error: any): NextResponse {
    console.error('Prisma error:', error);

    switch (error.code) {
      case 'P2002': // Unique constraint violation
        return this.createErrorResponse({
          code: ApiErrorCode.DUPLICATE_ENTRY,
          message: 'A record with this value already exists',
          details: error.meta?.target ? `Duplicate value for: ${error.meta.target.join(', ')}` : undefined,
          statusCode: 409
        });

      case 'P2025': // Record not found
        return this.createErrorResponse({
          code: ApiErrorCode.NOT_FOUND,
          message: 'The requested record was not found',
          statusCode: 404
        });

      case 'P2003': // Foreign key constraint violation
        return this.createErrorResponse({
          code: ApiErrorCode.FOREIGN_KEY_CONSTRAINT,
          message: 'Referenced record does not exist',
          details: error.meta?.field_name ? `Invalid reference: ${error.meta.field_name}` : undefined,
          statusCode: 400
        });

      case 'P2014': // Required relation missing
        return this.createErrorResponse({
          code: ApiErrorCode.VALIDATION_ERROR,
          message: 'Required relationship is missing',
          details: error.meta?.relation_name ? `Missing relation: ${error.meta.relation_name}` : undefined,
          statusCode: 400
        });

      default:
        return this.createErrorResponse({
          code: ApiErrorCode.DATABASE_ERROR,
          message: 'Database operation failed',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined,
          statusCode: 500
        });
    }
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(errors: ValidationError[]): NextResponse {
    return this.createErrorResponse({
      code: ApiErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details: errors,
      statusCode: 400
    });
  }

  /**
   * Handle authentication errors
   */
  static handleAuthError(message: string = 'Authentication required'): NextResponse {
    return this.createErrorResponse({
      code: ApiErrorCode.UNAUTHORIZED,
      message,
      statusCode: 401
    });
  }

  /**
   * Handle authorization errors
   */
  static handleForbiddenError(message: string = 'Access denied'): NextResponse {
    return this.createErrorResponse({
      code: ApiErrorCode.FORBIDDEN,
      message,
      statusCode: 403
    });
  }

  /**
   * Handle not found errors
   */
  static handleNotFoundError(resource: string = 'Resource'): NextResponse {
    return this.createErrorResponse({
      code: ApiErrorCode.NOT_FOUND,
      message: `${resource} not found`,
      statusCode: 404
    });
  }

  /**
   * Handle rate limiting errors
   */
  static handleRateLimitError(message: string = 'Rate limit exceeded'): NextResponse {
    return this.createErrorResponse({
      code: ApiErrorCode.RATE_LIMIT_EXCEEDED,
      message,
      statusCode: 429
    });
  }

  /**
   * Handle business logic errors
   */
  static handleBusinessError(code: ApiErrorCode, message: string, statusCode: number = 400): NextResponse {
    return this.createErrorResponse({
      code,
      message,
      statusCode
    });
  }

  /**
   * Handle generic errors
   */
  static handleGenericError(error: any): NextResponse {
    console.error('Generic error:', error);

    // Check if it's a known Prisma error
    if (error.code && error.code.startsWith('P')) {
      return this.handlePrismaError(error);
    }

    // Check if it's a validation error
    if (error.name === 'ValidationError' || (error.errors && Array.isArray(error.errors))) {
      return this.handleValidationError(error.errors || []);
    }

    // Default internal server error
    return this.createErrorResponse({
      code: ApiErrorCode.INTERNAL_ERROR,
      message: 'An unexpected error occurred',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      statusCode: 500
    });
  }

  /**
   * Create success response
   */
  static createSuccessResponse<T>(data: T, message?: string, statusCode: number = 200): NextResponse {
    const response: ApiResponse<T> = {
      success: true,
      data,
      ...(message && { message })
    };

    return NextResponse.json(response, { status: statusCode });
  }

  /**
   * Create paginated success response
   */
  static createPaginatedResponse<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
    message?: string
  ): NextResponse {
    const totalPages = Math.ceil(total / limit);
    
    const response: ApiResponse<T[]> = {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages
      },
      ...(message && { message })
    };

    return NextResponse.json(response);
  }

  /**
   * Wrap async route handler with error handling
   */
  static wrapHandler(handler: Function) {
    return async (...args: any[]) => {
      try {
        return await handler(...args);
      } catch (error) {
        return this.handleGenericError(error);
      }
    };
  }
}