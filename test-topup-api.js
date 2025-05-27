// Simple test script to verify the topup API endpoint
// Run with: node test-topup-api.js

const testTopupAPI = async () => {
  const baseURL = 'http://localhost:3000';
  
  console.log('Testing Topup API Endpoint...\n');
  
  // Test 1: Valid request
  try {
    console.log('Test 1: Valid topup request');
    const response = await fetch(`${baseURL}/api/admin/users/user_2/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ amount: 50.00 })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test 1 passed\n');
  } catch (error) {
    console.log('❌ Test 1 failed:', error.message, '\n');
  }
  
  // Test 2: Invalid amount (NaN)
  try {
    console.log('Test 2: Invalid amount (NaN)');
    const response = await fetch(`${baseURL}/api/admin/users/user_2/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ amount: 'invalid' })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test 2 passed (should return 400)\n');
  } catch (error) {
    console.log('❌ Test 2 failed:', error.message, '\n');
  }
  
  // Test 3: Empty body
  try {
    console.log('Test 3: Empty request body');
    const response = await fetch(`${baseURL}/api/admin/users/user_2/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: ''
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test 3 passed (should return 400)\n');
  } catch (error) {
    console.log('❌ Test 3 failed:', error.message, '\n');
  }
  
  // Test 4: Missing Content-Type
  try {
    console.log('Test 4: Missing Content-Type header');
    const response = await fetch(`${baseURL}/api/admin/users/user_2/topup`, {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ amount: 25.00 })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test 4 passed (should return 400)\n');
  } catch (error) {
    console.log('❌ Test 4 failed:', error.message, '\n');
  }
  
  // Test 5: User not found
  try {
    console.log('Test 5: User not found');
    const response = await fetch(`${baseURL}/api/admin/users/nonexistent/topup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token'
      },
      body: JSON.stringify({ amount: 25.00 })
    });
    
    const data = await response.json();
    console.log('Status:', response.status);
    console.log('Response:', data);
    console.log('✅ Test 5 passed (should return 404)\n');
  } catch (error) {
    console.log('❌ Test 5 failed:', error.message, '\n');
  }
  
  console.log('All tests completed!');
};

// Only run if this file is executed directly
if (typeof window === 'undefined') {
  testTopupAPI().catch(console.error);
}
