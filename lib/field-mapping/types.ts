/**
 * Field mapping and validation types
 */

export interface FieldMapping {
  [dbField: string]: string; // dbField -> apiField
}

export interface ModelFieldMappings {
  [modelName: string]: {
    toApi: FieldMapping;
    toDb: FieldMapping;
  };
}

export interface ValidationRule {
  field: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object' | 'date' | 'email' | 'phone' | 'enum';
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  enumValues?: string[];
  customValidator?: (value: any) => boolean | string;
}

export interface ModelValidationSchema {
  [modelName: string]: {
    create: ValidationRule[];
    update: ValidationRule[];
    query?: ValidationRule[];
  };
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  data?: any;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  errors?: ValidationError[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ListResponse<T = any> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}