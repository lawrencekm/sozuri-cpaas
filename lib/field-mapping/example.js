/**
 * Example usage of field mapping utilities
 * This demonstrates how the utilities work in practice
 */

// Since we're using TypeScript modules, this is a conceptual example
// In actual usage, these would be imported from the TypeScript modules

// Example 1: Field Transformation
console.log('=== Field Transformation Example ===');

// Simulated database record (what comes from Prisma)
const dbUser = {
  id: 'user123',
  firstName: 'John',
  lastName: 'Doe',
  createdAt: new Date('2023-01-01'),
  isActive: true,
  email: 'john@example.com'
};

console.log('Database record:', dbUser);

// This would be transformed to API format:
const expectedApiUser = {
  id: 'user123',
  first_name: 'John',
  last_name: 'Doe',
  created_at: new Date('2023-01-01'),
  is_active: true,
  email: 'john@example.com'
};

console.log('Expected API format:', expectedApiUser);

// Example 2: Campaign field mapping (type <-> channel)
console.log('\n=== Campaign Field Mapping Example ===');

const dbCampaign = {
  id: 'campaign123',
  projectId: 'project123',
  type: 'sms',  // Database uses 'type'
  name: 'Test Campaign',
  createdAt: new Date('2023-01-01')
};

console.log('Database campaign:', dbCampaign);

const expectedApiCampaign = {
  id: 'campaign123',
  project_id: 'project123',
  channel: 'sms',  // API uses 'channel'
  name: 'Test Campaign',
  created_at: new Date('2023-01-01')
};

console.log('Expected API campaign:', expectedApiCampaign);

// Example 3: Validation
console.log('\n=== Validation Example ===');

const validUserData = {
  email: 'john@example.com',
  first_name: 'John',
  mobile: '+254700000000'
};

const invalidUserData = {
  email: 'invalid-email',  // Invalid email format
  first_name: '',          // Empty required field
  mobile: 'invalid-phone'  // Invalid phone format
};

console.log('Valid user data:', validUserData);
console.log('Invalid user data:', invalidUserData);

console.log('\nExpected validation results:');
console.log('Valid data: { isValid: true, errors: [] }');
console.log('Invalid data: { isValid: false, errors: [email, phone format errors] }');

// Example 4: Error Handling
console.log('\n=== Error Handling Example ===');

console.log('Prisma P2002 error (duplicate) -> 409 Conflict response');
console.log('Prisma P2025 error (not found) -> 404 Not Found response');
console.log('Validation errors -> 400 Bad Request with field details');
console.log('Auth errors -> 401 Unauthorized');

console.log('\n=== Implementation Complete ===');
console.log('✅ Field mapping utilities created');
console.log('✅ Validation schemas defined');
console.log('✅ Error handling middleware implemented');
console.log('✅ API middleware utilities created');
console.log('✅ Comprehensive type definitions added');