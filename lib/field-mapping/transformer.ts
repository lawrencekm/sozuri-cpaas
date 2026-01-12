/**
 * Field transformation utilities for converting between API and database formats
 */

import { FIELD_MAPPINGS } from './mappings';
import { FieldMapping } from './types';

export class FieldTransformer {
  /**
   * Transform database record to API format
   */
  static toApiFormat<T = any>(modelName: string, dbRecord: any): T {
    if (!dbRecord || typeof dbRecord !== 'object') {
      return dbRecord;
    }

    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      console.warn(`No field mapping found for model: ${modelName}`);
      return dbRecord;
    }

    return this.transformFields(dbRecord, mapping.toApi);
  }

  /**
   * Transform API data to database format
   */
  static toDbFormat<T = any>(modelName: string, apiData: any): T {
    if (!apiData || typeof apiData !== 'object') {
      return apiData;
    }

    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      console.warn(`No field mapping found for model: ${modelName}`);
      return apiData;
    }

    return this.transformFields(apiData, mapping.toDb);
  }

  /**
   * Transform array of database records to API format
   */
  static toApiFormatArray<T = any>(modelName: string, dbRecords: any[]): T[] {
    if (!Array.isArray(dbRecords)) {
      return dbRecords;
    }

    return dbRecords.map(record => this.toApiFormat<T>(modelName, record));
  }

  /**
   * Transform array of API data to database format
   */
  static toDbFormatArray<T = any>(modelName: string, apiDataArray: any[]): T[] {
    if (!Array.isArray(apiDataArray)) {
      return apiDataArray;
    }

    return apiDataArray.map(data => this.toDbFormat<T>(modelName, data));
  }

  /**
   * Transform fields based on mapping configuration
   */
  private static transformFields(source: any, mapping: FieldMapping): any {
    if (!source || typeof source !== 'object') {
      return source;
    }

    const result: any = {};

    // Handle arrays
    if (Array.isArray(source)) {
      return source.map(item => this.transformFields(item, mapping));
    }

    // Transform mapped fields
    for (const [sourceField, targetField] of Object.entries(mapping)) {
      if (source.hasOwnProperty(sourceField)) {
        const value = source[sourceField];
        
        // Handle nested objects and arrays
        if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          // For nested objects, preserve structure but don't transform fields
          result[targetField] = value;
        } else if (Array.isArray(value)) {
          // For arrays, preserve the array but don't transform nested objects
          result[targetField] = value;
        } else {
          result[targetField] = value;
        }
      }
    }

    // Include unmapped fields (preserve fields not in mapping)
    for (const [key, value] of Object.entries(source)) {
      const isMapped = Object.keys(mapping).includes(key);
      if (!isMapped) {
        result[key] = value;
      }
    }

    return result;
  }

  /**
   * Get field mapping for a specific model
   */
  static getMapping(modelName: string) {
    return FIELD_MAPPINGS[modelName] || null;
  }

  /**
   * Check if a model has field mappings defined
   */
  static hasMapping(modelName: string): boolean {
    return modelName in FIELD_MAPPINGS;
  }

  /**
   * Get API field name from database field name
   */
  static getApiFieldName(modelName: string, dbFieldName: string): string {
    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      return dbFieldName;
    }

    return mapping.toApi[dbFieldName] || dbFieldName;
  }

  /**
   * Get database field name from API field name
   */
  static getDbFieldName(modelName: string, apiFieldName: string): string {
    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      return apiFieldName;
    }

    return mapping.toDb[apiFieldName] || apiFieldName;
  }

  /**
   * Transform query parameters for database queries
   * Converts API field names in query params to database field names
   */
  static transformQueryParams(modelName: string, queryParams: Record<string, any>): Record<string, any> {
    if (!queryParams || typeof queryParams !== 'object') {
      return queryParams;
    }

    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      return queryParams;
    }

    const transformed: Record<string, any> = {};

    for (const [key, value] of Object.entries(queryParams)) {
      const dbFieldName = mapping.toDb[key] || key;
      transformed[dbFieldName] = value;
    }

    return transformed;
  }

  /**
   * Transform sort/order parameters
   */
  static transformSortParams(modelName: string, sortParams: Record<string, 'asc' | 'desc'>): Record<string, 'asc' | 'desc'> {
    if (!sortParams || typeof sortParams !== 'object') {
      return sortParams;
    }

    const mapping = FIELD_MAPPINGS[modelName];
    if (!mapping) {
      return sortParams;
    }

    const transformed: Record<string, 'asc' | 'desc'> = {};

    for (const [field, direction] of Object.entries(sortParams)) {
      const dbFieldName = mapping.toDb[field] || field;
      transformed[dbFieldName] = direction;
    }

    return transformed;
  }
}