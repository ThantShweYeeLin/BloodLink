// Test emergency requests
(async () => {
  try {
    // Login as staff
    const loginRes = await fetch('http://localhost:3000/api/login/staff', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'james@bloodbank.com', password: 'Test123!' })
    });
    const loginData = await loginRes.json();
    if (!loginData.token) {
      console.log('Login failed:', loginData);
      process.exit(1);
    }
    
    console.log('✓ Logged in as staff');
    
    // Get emergency requests
    const reqRes = await fetch('http://localhost:3000/api/requests', {
      headers: { 'Authorization': 'Bearer ' + loginData.token }
    });
    const requests = await reqRes.json();
    
    // Filter for emergency requests
    const emergencyReqs = requests.filter(r => r.urgency === 'emergency');
    console.log(`✓ Found ${emergencyReqs.length} emergency requests:\n`);
    emergencyReqs.forEach(r => {
      console.log(`  ID ${r.id}: ${r.blood_type} (${r.urgency}) - Status: ${r.status}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
