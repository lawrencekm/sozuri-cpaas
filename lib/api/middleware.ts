/**
 * API middleware utilities for field mapping and validation
 */

import { NextRequest, NextResponse } from 'next/server';
import { FieldTransformer } from '../field-mapping/transformer';
import { DataValidator } from '../validation/validator';
import { ApiErrorHandler } from './error-handler';
import { ValidationResult } from '../field-mapping/types';

export interface ApiMiddlewareOptions {
  model: string;
  operation: 'create' | 'update' | 'query';
  transformFields?: boolean;
  validateData?: boolean;
  requireAuth?: boolean;
}

export class ApiMiddleware {
  /**
   * Process request data with field transformation and validation
   */
  static async processRequest(
    request: NextRequest,
    options: ApiMiddlewareOptions
  ): Promise<{ data: any; errors?: any }> {
    let data: any = {};

    // Extract data based on HTTP method
    if (request.method === 'GET') {
      // Extract query parameters
      const url = new URL(request.url);
      data = Object.fromEntries(url.searchParams.entries());
      
      // Convert array parameters (e.g., ?tags=tag1&tags=tag2)
      const params = new URLSearchParams(url.search);
      for (const [key, value] of params.entries()) {
        if (params.getAll(key).length > 1) {
          data[key] = params.getAll(key);
        }
      }
    } else {
      // Extract JSON body for POST/PUT/PATCH
      try {
        data = await request.json();
      } catch (error) {
        return {
          data: null,
          errors: ApiErrorHandler.createErrorResponse({
            code: ApiErrorHandler.ApiErrorCode.INVALID_INPUT,
            message: 'Invalid JSON in request body',
            statusCode: 400
          })
        };
      }
    }

    // Transform API fields to database fields if enabled
    if (options.transformFields && FieldTransformer.hasMapping(options.model)) {
      data = FieldTransformer.toDbFormat(options.model, data);
    }

    // Validate data if enabled
    if (options.validateData && DataValidator.hasSchema(options.model)) {
      const validationResult = DataValidator.validate(options.model, options.operation, data);
      
      if (!validationResult.isValid) {
        return {
          data: null,
          errors: ApiErrorHandler.handleValidationError(validationResult.errors)
        };
      }
      
      data = validationResult.data;
    }

    return { data };
  }

  /**
   * Process response data with field transformation
   */
  static processResponse(
    data: any,
    model: string,
    transformFields: boolean = true
  ): any {
    if (!transformFields || !FieldTransformer.hasMapping(model)) {
      return data;
    }

    // Handle arrays
    if (Array.isArray(data)) {
      return FieldTransformer.toApiFormatArray(model, data);
    }

    // Handle single objects
    if (data && typeof data === 'object') {
      return FieldTransformer.toApiFormat(model, data);
    }

    return data;
  }

  /**
   * Create middleware function for route handlers
   */
  static createHandler(options: ApiMiddlewareOptions) {
    return (handler: Function) => {
      return ApiErrorHandler.wrapHandler(async (request: NextRequest, context?: any) => {
        // Process request
        const { data, errors } = await this.processRequest(request, options);
        
        if (errors) {
          return errors;
        }

        // Call the actual handler with processed data
        const result = await handler(request, { ...context, validatedData: data });

        // If result is a NextResponse, check if we need to transform the response data
        if (result instanceof NextResponse) {
          if (options.transformFields) {
            try {
              const responseData = await result.json();
              if (responseData.data) {
                responseData.data = this.processResponse(responseData.data, options.model, true);
              }
              return NextResponse.json(responseData, { status: result.status });
            } catch {
              // If we can't parse JSON, return original response
              return result;
            }
          }
        }

        return result;
      });
    };
  }

  /**
   * Validate and transform query parameters
   */
  static processQueryParams(
    searchParams: URLSearchParams,
    model: string,
    validateQuery: boolean = true
  ): { params: any; errors?: NextResponse } {
    const params: any = {};
    
    // Extract all parameters
    for (const [key, value] of searchParams.entries()) {
      const allValues = searchParams.getAll(key);
      params[key] = allValues.length > 1 ? allValues : value;
    }

    // Transform field names if mapping exists
    if (FieldTransformer.hasMapping(model)) {
      const transformedParams = FieldTransformer.transformQueryParams(model, params);
      Object.assign(params, transformedParams);
    }

    // Validate query parameters
    if (validateQuery && DataValidator.hasSchema(model)) {
      const validationResult = DataValidator.validateQuery(model, params);
      
      if (!validationResult.isValid) {
        return {
          params: null,
          errors: ApiErrorHandler.handleValidationError(validationResult.errors)
        };
      }
      
      return { params: validationResult.data };
    }

    return { params };
  }

  /**
   * Create standardized pagination parameters
   */
  static processPaginationParams(searchParams: URLSearchParams) {
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10', 10)));
    const skip = (page - 1) * limit;

    return { page, limit, skip };
  }

  /**
   * Create standardized sort parameters
   */
  static processSortParams(
    searchParams: URLSearchParams,
    model: string,
    defaultSort: Record<string, 'asc' | 'desc'> = { createdAt: 'desc' }
  ) {
    const sortBy = searchParams.get('sortBy') || searchParams.get('sort');
    const sortOrder = (searchParams.get('sortOrder') || searchParams.get('order') || 'desc') as 'asc' | 'desc';

    let orderBy = defaultSort;

    if (sortBy) {
      orderBy = { [sortBy]: sortOrder };
      
      // Transform sort field names if mapping exists
      if (FieldTransformer.hasMapping(model)) {
        orderBy = FieldTransformer.transformSortParams(model, orderBy);
      }
    }

    return orderBy;
  }

  /**
   * Create search/filter conditions
   */
  static processSearchParams(
    searchParams: URLSearchParams,
    model: string,
    searchableFields: string[] = ['name', 'description']
  ) {
    const search = searchParams.get('search') || searchParams.get('q');
    
    if (!search) {
      return {};
    }

    // Transform searchable field names if mapping exists
    let transformedFields = searchableFields;
    if (FieldTransformer.hasMapping(model)) {
      transformedFields = searchableFields.map(field => 
        FieldTransformer.getDbFieldName(model, field)
      );
    }

    return {
      OR: transformedFields.map(field => ({
        [field]: {
          contains: search,
          mode: 'insensitive' as const
        }
      }))
    };
  }
}