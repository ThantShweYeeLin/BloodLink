#!/usr/bin/env node

/**
 * Test script to verify login flow works end-to-end
 */

const http = require('http');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: body
        });
      });
    });
    
    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing Life Link Login Flow\n');
  
  // Test 1: Check backend is running
  console.log('Test 1: Backend Server Status');
  try {
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET'
    });
    console.log(`✓ Backend responding on port 3000 (status: ${res.status})\n`);
  } catch (error) {
    console.error('✗ Backend not responding:', error.message);
    console.error('Make sure to run: cd backend && node server.js\n');
    return;
  }
  
  // Test 2: Test donor login endpoint
  console.log('Test 2: Donor Login Endpoint');
  try {
    const loginData = JSON.stringify({
      email: 'alex@donor.com',
      password: 'Test123!'
    });
    
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/login/donor',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);
    
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      console.log(`✓ Login successful (status: ${res.status})`);
      console.log(`  - Message: ${data.message}`);
      console.log(`  - Donor ID: ${data.donorId}`);
      console.log(`  - Full Name: ${data.fullName}`);
      console.log(`  - Token: ${data.token.substring(0, 20)}...`);
      console.log(`  - Token Valid: ${data.success}\n`);
    } else {
      console.error(`✗ Login failed (status: ${res.status})`);
      console.error(`  Response: ${res.body}\n`);
    }
  } catch (error) {
    console.error('✗ Login endpoint error:', error.message, '\n');
  }
  
  // Test 3: Test hospital login endpoint
  console.log('Test 3: Hospital Login Endpoint');
  try {
    const loginData = JSON.stringify({
      email: 'contact@citygen.hospital',
      password: 'HospitalPass123'
    });
    
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/login/hospital',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);
    
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      if (data.success) {
        console.log(`✓ Hospital login successful (status: ${res.status})`);
        console.log(`  - Hospital ID: ${data.hospitalId}`);
        console.log(`  - Hospital Name: ${data.hospitalName}\n`);
      } else {
        console.error(`✗ Hospital login failed: ${data.message}\n`);
      }
    } else {
      console.error(`✗ Hospital login error (status: ${res.status})\n`);
    }
  } catch (error) {
    console.error('✗ Hospital endpoint error:', error.message, '\n');
  }
  
  // Test 4: Test staff login endpoint  
  console.log('Test 4: Staff Login Endpoint');
  try {
    const loginData = JSON.stringify({
      email: 'taylor@lifelink.staff',
      password: 'StaffPass123'
    });
    
    const res = await makeRequest({
      hostname: 'localhost',
      port: 3000,
      path: '/api/login/staff',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, loginData);
    
    if (res.status === 200) {
      const data = JSON.parse(res.body);
      if (data.success) {
        console.log(`✓ Staff login successful (status: ${res.status})`);
        console.log(`  - Staff ID: ${data.staffId}`);
        console.log(`  - Full Name: ${data.fullName}\n`);
      } else {
        console.error(`✗ Staff login failed: ${data.message}\n`);
      }
    } else {
      console.error(`✗ Staff login error (status: ${res.status})\n`);
    }
  } catch (error) {
    console.error('✗ Staff endpoint error:', error.message, '\n');
  }
  
  console.log('✓ All tests completed!');
  console.log('\nNext steps:');
  console.log('1. Open http://localhost:5173/BloodLink/public/donor/login-donor.html');
  console.log('2. Open browser DevTools (F12) and check Console tab');
  console.log('3. Try logging in with:');
  console.log('   - Email: alex@donor.com');
  console.log('   - Password: Test123!');
  console.log('4. Check console logs to see:');
  console.log('   - [API Base Init] message');
  console.log('   - [handleLogin] messages showing login flow');
  console.log('5. Should redirect to dashboard.html after login');
}

runTests().catch(console.error);
