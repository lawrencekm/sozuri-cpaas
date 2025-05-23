// Simple test script to verify admin functionality
// Run this with: node test-admin-functionality.js

const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

async function testAdminFunctionality() {
  console.log('🧪 Testing Admin Functionality...\n');

  try {
    // Test 1: Get all users
    console.log('1. Testing user list API...');
    const usersResponse = await axios.get(`${BASE_URL}/api/admin/users`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    console.log(`✅ Users API: ${usersResponse.data.users.length} users found`);

    // Test 2: Get specific user
    console.log('\n2. Testing specific user API...');
    const userResponse = await axios.get(`${BASE_URL}/api/admin/users/user_1`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    console.log(`✅ User API: Found user ${userResponse.data.name}`);

    // Test 3: Test impersonation
    console.log('\n3. Testing impersonation API...');
    const impersonateResponse = await axios.post(`${BASE_URL}/api/auth/impersonate`, 
      { userId: 'user_2' },
      { headers: { 'Authorization': 'Bearer test-token' } }
    );
    console.log(`✅ Impersonation API: Now impersonating ${impersonateResponse.data.user.name}`);

    // Test 4: Test logs API
    console.log('\n4. Testing logs API...');
    const logsResponse = await axios.get(`${BASE_URL}/api/admin/logs`, {
      headers: { 'Authorization': 'Bearer test-token' }
    });
    console.log(`✅ Logs API: ${logsResponse.data.logs.length} logs found (Total: ${logsResponse.data.total})`);

    // Test 5: Test log download (small sample)
    console.log('\n5. Testing log download API...');
    const downloadResponse = await axios.get(`${BASE_URL}/api/admin/logs/download?format=json&limit=100`, {
      headers: { 'Authorization': 'Bearer test-token' },
      responseType: 'text'
    });
    const downloadSize = downloadResponse.data.length;
    console.log(`✅ Log Download API: Downloaded ${downloadSize} characters of JSON data`);

    console.log('\n🎉 All tests passed! Admin functionality is working correctly.');
    
    // Performance test for large log download
    console.log('\n6. Testing large log download performance...');
    const startTime = Date.now();
    const largeDownloadResponse = await axios.get(`${BASE_URL}/api/admin/logs/download?format=csv`, {
      headers: { 'Authorization': 'Bearer test-token' },
      responseType: 'text',
      timeout: 60000 // 60 second timeout
    });
    const endTime = Date.now();
    const downloadTime = (endTime - startTime) / 1000;
    const downloadSizeMB = (largeDownloadResponse.data.length / 1024 / 1024).toFixed(2);
    
    console.log(`✅ Large Download Test: Downloaded ${downloadSizeMB}MB in ${downloadTime}s`);
    console.log(`   Performance: ${(downloadSizeMB / downloadTime).toFixed(2)} MB/s`);

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    if (error.response?.status) {
      console.error(`   Status: ${error.response.status}`);
    }
  }
}

// Run the tests
testAdminFunctionality();
