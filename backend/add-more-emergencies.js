import { query } from './sql.js';

(async () => {
  try {
    console.log('Adding more emergency requests from hospitals...\n');
    
    // Get all hospitals from the database
    const hospitals = await query('SELECT id, hospital_name FROM hospitals LIMIT 10', []);
    if (hospitals.length === 0) {
      console.log('No hospitals found in database.');
      process.exit(1);
    }
    
    console.log(`Found ${hospitals.length} hospitals\n`);
    
    // Emergency request templates
    const bloodTypes = ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'];
    const emergencyReasons = [
      'Severe trauma case - multiple transfusions needed',
      'Post-operative hemorrhage - urgent',
      'Motor vehicle accident victim - critical condition',
      'Major burns - immediate transfusion required',
      'Internal bleeding - patient unstable',
      'Childbirth complications - maternal emergency',
      'Emergency surgery - blood loss during procedure',
      'Accident victim - multiple injuries',
      'Surgical complication - immediate transfusion needed',
      'Critical care patient - ongoing bleeding'
    ];
    
    const patientNames = [
      'Robert Thompson',
      'Maria Garcia',
      'James Wilson',
      'Sarah Anderson',
      'Michael Chen',
      'Jennifer Lee',
      'David Martinez',
      'Emily Rodriguez',
      'Christopher Brown',
      'Jessica Taylor',
      'Daniel Johnson',
      'Laura White',
      'William Harris',
      'Amanda Clark',
      'Joseph Lewis'
    ];
    
    let addedCount = 0;
    
    // Add multiple emergency requests per hospital
    for (let i = 0; i < hospitals.length; i++) {
      const hospital = hospitals[i];
      const numRequests = 2 + Math.floor(Math.random() * 3); // 2-4 requests per hospital
      
      for (let j = 0; j < numRequests; j++) {
        const bloodType = bloodTypes[Math.floor(Math.random() * bloodTypes.length)];
        const quantity = [450, 900, 1350, 1800][Math.floor(Math.random() * 4)];
        const reason = emergencyReasons[Math.floor(Math.random() * emergencyReasons.length)];
        const patientName = patientNames[Math.floor(Math.random() * patientNames.length)];
        
        await query(
          `INSERT INTO blood_requests 
           (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) 
           VALUES (?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 4 HOUR), ?)`,
          [hospital.id, bloodType, quantity, 'emergency', 'pending', `Patient: ${patientName} - ${reason}`]
        );
        addedCount++;
        console.log(`✓ Added: ${hospital.hospital_name} - ${bloodType} (${quantity}ml)`);
      }
    }
    
    console.log(`\n✓ Successfully added ${addedCount} emergency requests!`);
    process.exit(0);
  } catch (err) {
    console.error('Error adding emergency requests:', err);
    process.exit(1);
  }
})();
