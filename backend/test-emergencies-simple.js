// Test emergency requests - simple version
(async () => {
  try {
    console.log('Testing emergency requests...\n');
    
    // Get emergency requests without auth first
    const reqRes = await fetch('http://localhost:3000/api/requests');
    console.log('GET /api/requests status:', reqRes.status);
    
    if (!reqRes.ok) {
      console.log('Response:', await reqRes.json());
      process.exit(1);
    }
    
    const requests = await reqRes.json();
    console.log(`Total requests: ${requests.length}`);
    
    // Filter for emergency requests
    const emergencyReqs = requests.filter(r => r.urgency === 'emergency');
    console.log(`Emergency requests: ${emergencyReqs.length}\n`);
    
    if (emergencyReqs.length > 0) {
      console.log('Emergency Requests:');
      emergencyReqs.forEach(r => {
        console.log(`  ID ${r.id}: ${r.blood_type} (${r.urgency}) - ${r.status}`);
      });
    } else {
      console.log('No emergency requests found!');
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
