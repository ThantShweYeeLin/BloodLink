import { query } from './sql.js';

(async () => {
  try {
    console.log('Adding test emergency requests...\n');
    
    // Get a hospital ID from the database
    const hospitals = await query('SELECT id FROM hospitals LIMIT 1', []);
    if (hospitals.length === 0) {
      console.log('No hospitals found in database. Please create a hospital first.');
      process.exit(1);
    }
    
    const hospitalId = hospitals[0].id;
    console.log(`Using hospital ID: ${hospitalId}`);
    
    // Add emergency requests with 'emergency' urgency
    const emergencyRequests = [
      {
        hospital_id: hospitalId,
        blood_type: 'O-',
        quantity_ml: 1800,
        urgency: 'emergency',
        notes: 'Patient: John Doe - Critical trauma case, immediate transfusion required',
        status: 'pending'
      },
      {
        hospital_id: hospitalId,
        blood_type: 'A+',
        quantity_ml: 1350,
        urgency: 'emergency',
        notes: 'Patient: Jane Smith - Post-operative bleeding, urgent response needed',
        status: 'pending'
      },
      {
        hospital_id: hospitalId,
        blood_type: 'B-',
        quantity_ml: 900,
        urgency: 'emergency',
        notes: 'Patient: Michael Johnson - Motor vehicle accident victim',
        status: 'pending'
      },
      {
        hospital_id: hospitalId,
        blood_type: 'AB+',
        quantity_ml: 450,
        urgency: 'emergency',
        notes: 'Patient: Sarah Williams - Rare blood type, critical condition',
        status: 'pending'
      }
    ];
    
    for (const req of emergencyRequests) {
      await query(
        `INSERT INTO blood_requests 
         (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) 
         VALUES (?, ?, ?, ?, ?, NOW(), DATE_ADD(NOW(), INTERVAL 6 HOUR), ?)`,
        [req.hospital_id, req.blood_type, req.quantity_ml, req.urgency, req.status, req.notes]
      );
      console.log(`✓ Added emergency request for ${req.blood_type}`);
    }
    
    console.log('\n✓ All emergency requests added successfully!');
    console.log('You can now test the emergency requests page.');
    
    process.exit(0);
  } catch (err) {
    console.error('Error adding emergency requests:', err);
    process.exit(1);
  }
})();
