import { query } from './sql.js';

async function addTestData() {
  try {
    console.log('Adding test blood units to inventory...');
    
    // Get some donors to associate with blood units
    const donors = await query('SELECT id FROM donors LIMIT 5');
    
    if (donors.length === 0) {
      console.log('No donors found. Please seed donors first.');
      return;
    }
    
    const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
    const locations = ['Storage Room A', 'Storage Room B', 'Cold Storage 1', 'Cold Storage 2', 'Blood Bank Fridge 1'];
    
    // Add 20 blood units
    for (let i = 0; i < 20; i++) {
      const bloodType = bloodTypes[i % bloodTypes.length];
      const location = locations[i % locations.length];
      const donorId = donors[i % donors.length].id;
      
      // Calculate expiry date (42 days from today)
      const collectionDate = new Date();
      collectionDate.setDate(collectionDate.getDate() - Math.floor(Math.random() * 35)); // Random between 0-35 days ago
      
      const expiryDate = new Date(collectionDate);
      expiryDate.setDate(expiryDate.getDate() + 42);
      
      const collectionDateStr = collectionDate.toISOString().split('T')[0];
      const expiryDateStr = expiryDate.toISOString().split('T')[0];
      
      await query(
        'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [bloodType, 450, location, expiryDateStr, donorId, collectionDateStr, 'available']
      );
      
      console.log(`✓ Added ${bloodType} unit (Expires: ${expiryDateStr})`);
    }
    
    console.log('\nAdding test blood requests...');
    
    // Get a hospital
    const hospitals = await query('SELECT id FROM hospitals LIMIT 1');
    
    if (hospitals.length === 0) {
      console.log('No hospitals found. Please seed hospitals first.');
      return;
    }
    
    const hospitalId = hospitals[0].id;
    const urgencyLevels = ['routine', 'urgent', 'emergency'];
    
    // Add 15 blood requests
    for (let i = 0; i < 15; i++) {
      const bloodType = bloodTypes[i % bloodTypes.length];
      const urgency = urgencyLevels[i % urgencyLevels.length];
      
      // Random request date (within last 10 days)
      const requestDate = new Date();
      requestDate.setDate(requestDate.getDate() - Math.floor(Math.random() * 10));
      
      // Required by date (2-7 days from request date)
      const requiredByDate = new Date(requestDate);
      requiredByDate.setDate(requiredByDate.getDate() + Math.floor(Math.random() * 6) + 2);
      
      const requestDateStr = requestDate.toISOString().replace('T', ' ').split('.')[0];
      const requiredByDateStr = requiredByDate.toISOString().split('T')[0];
      
      const status = ['pending', 'pending', 'fulfilled'][Math.floor(Math.random() * 3)]; // Mostly pending
      
      await query(
        'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [hospitalId, bloodType, 450, urgency, status, requestDateStr, requiredByDateStr, `Test request for ${bloodType} blood`]
      );
      
      console.log(`✓ Added ${urgency} request for ${bloodType} (Status: ${status})`);
    }
    
    console.log('\n✓ Test data added successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('Error adding test data:', error);
    process.exit(1);
  }
}

addTestData();
