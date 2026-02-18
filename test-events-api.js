(async () => {
  // First login as staff to get token
  const loginRes = await fetch('http://localhost:3000/api/login/staff', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({email: 'james@bloodbank.com', password: 'Test123!'})
  });
  const loginData = await loginRes.json();
  console.log('Login status:', loginRes.status);
  
  if (!loginData.token) {
    console.log('Login failed:', loginData);
    return;
  }
  
  const token = loginData.token;
  console.log('Got token, fetching events...');
  
  // Now fetch events
  const eventsRes = await fetch('http://localhost:3000/api/events', {
    headers: {'Authorization': 'Bearer ' + token}
  });
  const eventsData = await eventsRes.json();
  console.log('Events status:', eventsRes.status);
  console.log('Events response:');
  console.log(JSON.stringify(eventsData, null, 2));
})();
