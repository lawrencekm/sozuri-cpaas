# Field Mapping and Validation Infrastructure

This module provides comprehensive field mapping and validation infrastructure for converting between API and database field formats, with standardized error handling and validation schemas.

## Features

- **Field Transformation**: Convert between database field names (camelCase) and API field names (snake_case)
- **Data Validation**: Comprehensive validation schemas for all database models
- **Error Handling**: Standardized error responses with proper HTTP status codes
- **API Middleware**: Utilities for processing requests and responses
- **Type Safety**: Full TypeScript support with proper type definitions

## Quick Start

```typescript
import { fieldMapping, validation, errorHandling } from '@/lib/field-mapping';

// Transform database record to API format
const apiUser = fieldMapping.toApi('user', dbUser);

// Validate data before database operations
const result = validation.create('user', userData);
if (!result.isValid) {
  return errorHandling.validation(result.errors);
}

// Handle database errors
try {
  const user = await prisma.user.create({ data });
} catch (error) {
  return errorHandling.prisma(error);
}
```

## Field Mappings

The system handles inconsistent field naming between API and database layers:

### User Model
- `firstName` ↔ `first_name`
- `lastName` ↔ `last_name`
- `createdAt` ↔ `created_at`
- `isActive` ↔ `is_active`

### Campaign Model
- `projectId` ↔ `project_id`
- `type` ↔ `channel` (special mapping for UI consistency)
- `createdAt` ↔ `created_at`
- `totalSent` ↔ `total_sent`

### Template Model
- `projectId` ↔ `project_id`
- `messageType` ↔ `channel`
- `category` ↔ `type`

## Usage Examples

### 1. Field Transformation

```typescript
import { FieldTransformer } from '@/lib/field-mapping';

// Database to API
const dbUser = {
  id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date(),
  isActive: true
};

const apiUser = FieldTransformer.toApiFormat('user', dbUser);
// Result: { id: 'user123', first_name: 'John', last_name: 'Doe', created_at: Date, is_active: true }

// API to Database
const apiData = {
  first_name: 'Jane',
  last_name: 'Smith',
  is_active: false
};

const dbData = FieldTransformer.toDbFormat('user', apiData);
// Result: { firstName: 'Jane', lastName: 'Smith', isActive: false }

// Transform arrays
const apiUsers = FieldTransformer.toApiFormatArray('user', dbUsers);
```

### 2. Data Validation

```typescript
import { DataValidator } from '@/lib/field-mapping';

// Validate user creation
const userData = {
  email: 'john@example.com',
  first_name: 'John',
  mobile: '+254700000000'
};

const result = DataValidator.validateCreate('user', userData);
if (result.isValid) {
  // Data is valid, proceed with creation
  const user = await prisma.user.create({ data: result.data });
} else {
  // Handle validation errors
  console.log(result.errors);
}

// Validate updates
const updateResult = DataValidator.validateUpdate('user', updateData);

// Validate query parameters
const queryResult = DataValidator.validateQuery('user', queryParams);
```

### 3. Error Handling

```typescript
import { ApiErrorHandler } from '@/lib/field-mapping';

// Handle Prisma errors
try {
  const user = await prisma.user.create({ data });
} catch (error) {
  return ApiErrorHandler.handlePrismaError(error);
}

// Handle validation errors
if (!validationResult.isValid) {
  return ApiErrorHandler.handleValidationError(validationResult.errors);
}

// Create success responses
return ApiErrorHandler.createSuccessResponse(user, 'User created successfully', 201);

// Create paginated responses
return ApiErrorHandler.createPaginatedResponse(users, total, page, limit);
```

### 4. API Route Implementation

```typescript
import { ApiMiddleware } from '@/lib/field-mapping';

export const POST = ApiMiddleware.createHandler({
  model: 'user',
  operation: 'create',
  transformFields: true,
  validateData: true
})(async (request, { validatedData }) => {
  try {
    const user = await prisma.user.create({ data: validatedData });
    return ApiErrorHandler.createSuccessResponse(user, 'User created', 201);
  } catch (error) {
    return ApiErrorHandler.handlePrismaError(error);
  }
});
```

### 5. Manual Request Processing

```typescript
import { ApiMiddleware } from '@/lib/field-mapping';

export async function GET(request: NextRequest) {
  // Process query parameters
  const { searchParams } = new URL(request.url);
  const { params, errors } = ApiMiddleware.processQueryParams(searchParams, 'user');
  
  if (errors) return errors;

  // Process pagination
  const { page, limit, skip } = ApiMiddleware.processPaginationParams(searchParams);
  
  // Process sorting
  const orderBy = ApiMiddleware.processSortParams(searchParams, 'user');
  
  // Process search
  const searchConditions = ApiMiddleware.processSearchParams(
    searchParams, 
    'user', 
    ['first_name', 'last_name', 'email']
  );

  const users = await prisma.user.findMany({
    where: { ...params, ...searchConditions },
    orderBy,
    skip,
    take: limit
  });

  const total = await prisma.user.count({ where: { ...params, ...searchConditions } });
  
  return ApiErrorHandler.createPaginatedResponse(
    ApiMiddleware.processResponse(users, 'user'),
    total,
    page,
    limit
  );
}
```

## Validation Rules

### Supported Field Types
- `string`: Text fields with length constraints
- `number`: Numeric fields with min/max constraints
- `boolean`: Boolean fields
- `array`: Array fields
- `object`: Object fields
- `date`: Date fields
- `email`: Email validation with format checking
- `phone`: Phone number validation
- `enum`: Enumeration with allowed values

### Validation Constraints
- `required`: Field is required
- `minLength`/`maxLength`: String length constraints
- `min`/`max`: Numeric value constraints
- `pattern`: Regular expression pattern matching
- `enumValues`: Array of allowed values for enum fields
- `customValidator`: Custom validation function

## Error Codes

### Authentication & Authorization
- `UNAUTHORIZED`: Authentication required
- `FORBIDDEN`: Access denied
- `INVALID_TOKEN`: Invalid authentication token

### Validation
- `VALIDATION_ERROR`: General validation failure
- `INVALID_INPUT`: Invalid input format
- `MISSING_REQUIRED_FIELD`: Required field missing

### Database
- `NOT_FOUND`: Record not found
- `DUPLICATE_ENTRY`: Unique constraint violation
- `FOREIGN_KEY_CONSTRAINT`: Foreign key constraint violation
- `DATABASE_ERROR`: General database error

### Business Logic
- `INSUFFICIENT_CREDITS`: Not enough credits
- `PROJECT_SUSPENDED`: Project is suspended
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded

### System
- `INTERNAL_ERROR`: Internal server error
- `SERVICE_UNAVAILABLE`: Service unavailable
- `TIMEOUT`: Request timeout

## Adding New Models

### 1. Add Field Mappings

```typescript
// In lib/field-mapping/mappings.ts
export const FIELD_MAPPINGS = {
  // ... existing mappings
  newModel: {
    toApi: {
      dbField: 'api_field',
      createdAt: 'created_at'
    },
    toDb: {
      api_field: 'dbField',
      created_at: 'createdAt'
    }
  }
};
```

### 2. Add Validation Schema

```typescript
// In lib/validation/schemas.ts
export const VALIDATION_SCHEMAS = {
  // ... existing schemas
  newModel: {
    create: [
      { field: 'name', type: 'string', required: true, maxLength: 255 },
      { field: 'email', type: 'email', required: true }
    ],
    update: [
      { field: 'name', type: 'string', required: false, maxLength: 255 }
    ],
    query: [
      { field: 'is_active', type: 'boolean', required: false }
    ]
  }
};
```

## Best Practices

1. **Always validate data** before database operations
2. **Use field transformations** for consistent API responses
3. **Handle errors gracefully** with appropriate HTTP status codes
4. **Sanitize input data** to remove unknown fields
5. **Use pagination** for list endpoints
6. **Implement proper authentication** and authorization checks
7. **Log errors** for debugging while hiding sensitive details from API responses

## Testing

The utilities include comprehensive test coverage. Run tests with:

```bash
npm test lib/field-mapping/__tests__/
```

## Migration Guide

To migrate existing API routes to use these utilities:

1. **Replace manual field mapping** with `FieldTransformer`
2. **Add validation** using `DataValidator`
3. **Standardize error handling** with `ApiErrorHandler`
4. **Use middleware** for common operations
5. **Update response formats** to use standardized structure