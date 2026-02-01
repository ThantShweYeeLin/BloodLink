import bcrypt from 'bcryptjs';
import { query } from './sql.js';

async function seed() {
  const passwordHash = await bcrypt.hash('Test123!', 10);

  const [{ count: donorCount }] = await query('SELECT COUNT(*)::int AS count FROM donors');
  if (donorCount === 0) {
    await query(
      'INSERT INTO donors (full_name, email, phone, date_of_birth, blood_type, address, city, password_hash, registration_date, last_donation_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, TRUE)',
      ['Alex Donor', 'alex@donor.com', '5551112222', '1996-04-12', 'O+', '123 Main St', 'Richmond', passwordHash, '2025-12-15']
    );
    await query(
      'INSERT INTO donors (full_name, email, phone, date_of_birth, blood_type, address, city, password_hash, registration_date, last_donation_date, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, TRUE)',
      ['Jamie Donor', 'jamie@donor.com', '5553334444', '1994-09-22', 'A-', '456 Oak Ave', 'Norfolk', passwordHash, '2026-01-10']
    );
  }

  const [{ count: staffCount }] = await query('SELECT COUNT(*)::int AS count FROM staff');
  if (staffCount === 0) {
    await query(
      'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Taylor Staff', 'EMP-001', 'Certified Phlebotomist', 'staff@bloodlink.com', '5557778888', 'Life Link Central', 'collection', '789 Pine Rd', passwordHash]
    );
    await query(
      'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Jordan Smith', 'EMP-002', 'Medical Laboratory Technician', 'jordan.smith@lifelink.com', '5558881111', 'Life Link Central', 'testing', '234 Elm St', passwordHash]
    );
    await query(
      'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Casey Martinez', 'EMP-003', 'Blood Bank Manager', 'casey.martinez@lifelink.com', '5552223333', 'Life Link Central', 'admin', '567 Maple Ave', passwordHash]
    );
    await query(
      'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Riley Johnson', 'EMP-004', 'Certified Phlebotomist', 'riley.johnson@lifelink.com', '5554445555', 'Life Link West Branch', 'collection', '890 Oak Blvd', passwordHash]
    );
    await query(
      'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Sam Lee', 'EMP-005', 'Quality Assurance Specialist', 'sam.lee@lifelink.com', '5556667777', 'Life Link Central', 'processing', '123 Cedar Ln', passwordHash]
    );
  } else if (staffCount < 5) {
    // Add additional staff if we have fewer than 5
    const [{ exists: emp002 }] = await query('SELECT EXISTS(SELECT 1 FROM staff WHERE employee_id = ?) AS exists', ['EMP-002']);
    if (!emp002) {
      await query(
        'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Jordan Smith', 'EMP-002', 'Medical Laboratory Technician', 'jordan.smith@lifelink.com', '5558881111', 'Life Link Central', 'testing', '234 Elm St', passwordHash]
      );
    }
    const [{ exists: emp003 }] = await query('SELECT EXISTS(SELECT 1 FROM staff WHERE employee_id = ?) AS exists', ['EMP-003']);
    if (!emp003) {
      await query(
        'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Casey Martinez', 'EMP-003', 'Blood Bank Manager', 'casey.martinez@lifelink.com', '5552223333', 'Life Link Central', 'admin', '567 Maple Ave', passwordHash]
      );
    }
    const [{ exists: emp004 }] = await query('SELECT EXISTS(SELECT 1 FROM staff WHERE employee_id = ?) AS exists', ['EMP-004']);
    if (!emp004) {
      await query(
        'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Riley Johnson', 'EMP-004', 'Certified Phlebotomist', 'riley.johnson@lifelink.com', '5554445555', 'Life Link West Branch', 'collection', '890 Oak Blvd', passwordHash]
      );
    }
    const [{ exists: emp005 }] = await query('SELECT EXISTS(SELECT 1 FROM staff WHERE employee_id = ?) AS exists', ['EMP-005']);
    if (!emp005) {
      await query(
        'INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Sam Lee', 'EMP-005', 'Quality Assurance Specialist', 'sam.lee@lifelink.com', '5556667777', 'Life Link Central', 'processing', '123 Cedar Ln', passwordHash]
      );
    }
  }

  const [{ count: hospitalCount }] = await query('SELECT COUNT(*)::int AS count FROM hospitals');
  if (hospitalCount === 0) {
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['City General Hospital', 'LIC-12345', 'Dr. Morgan', 'hospital@bloodlink.com', '5559990000', '100 Medical Way', 'Richmond', 250, passwordHash]
    );
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['St. Mary\'s Medical Center', 'LIC-23456', 'Dr. Sarah Chen', 'contact@stmarys.com', '5551234567', '250 Healthcare Dr', 'Norfolk', 400, passwordHash]
    );
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Memorial Hospital', 'LIC-34567', 'Dr. James Rodriguez', 'info@memorial.org', '5559876543', '500 Memorial Blvd', 'Virginia Beach', 300, passwordHash]
    );
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['County Children\'s Hospital', 'LIC-45678', 'Dr. Emily Watson', 'admin@childrens.org', '5552468135', '75 Pediatric Way', 'Chesapeake', 150, passwordHash]
    );
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['Regional Trauma Center', 'LIC-56789', 'Dr. Michael Thompson', 'emergency@traumacenter.com', '5557891234', '1000 Emergency Ave', 'Newport News', 500, passwordHash]
    );
  } else if (hospitalCount < 5) {
    // Add additional hospitals if we have fewer than 5
    const [{ exists: lic23456 }] = await query('SELECT EXISTS(SELECT 1 FROM hospitals WHERE license_number = ?) AS exists', ['LIC-23456']);
    if (!lic23456) {
      await query(
        'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['St. Mary\'s Medical Center', 'LIC-23456', 'Dr. Sarah Chen', 'contact@stmarys.com', '5551234567', '250 Healthcare Dr', 'Norfolk', 400, passwordHash]
      );
    }
    const [{ exists: lic34567 }] = await query('SELECT EXISTS(SELECT 1 FROM hospitals WHERE license_number = ?) AS exists', ['LIC-34567']);
    if (!lic34567) {
      await query(
        'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Memorial Hospital', 'LIC-34567', 'Dr. James Rodriguez', 'info@memorial.org', '5559876543', '500 Memorial Blvd', 'Virginia Beach', 300, passwordHash]
      );
    }
    const [{ exists: lic45678 }] = await query('SELECT EXISTS(SELECT 1 FROM hospitals WHERE license_number = ?) AS exists', ['LIC-45678']);
    if (!lic45678) {
      await query(
        'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['County Children\'s Hospital', 'LIC-45678', 'Dr. Emily Watson', 'admin@childrens.org', '5552468135', '75 Pediatric Way', 'Chesapeake', 150, passwordHash]
      );
    }
    const [{ exists: lic56789 }] = await query('SELECT EXISTS(SELECT 1 FROM hospitals WHERE license_number = ?) AS exists', ['LIC-56789']);
    if (!lic56789) {
      await query(
        'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
        ['Regional Trauma Center', 'LIC-56789', 'Dr. Michael Thompson', 'emergency@traumacenter.com', '5557891234', '1000 Emergency Ave', 'Newport News', 500, passwordHash]
      );
    }
  }

  const [{ count: eventCount }] = await query('SELECT COUNT(*)::int AS count FROM events');
  if (eventCount === 0) {
    await query(
      'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['Downtown Blood Drive', '2026-02-15', '09:00', '14:00', 'Downtown Center', 120, 'Walk-ins welcome', 'staff', 1, 'Taylor Staff']
    );
    await query(
      'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['Campus Donation Day', '2026-03-01', '10:00', '16:00', 'State University', 200, 'Student donors', 'staff', 1, 'Taylor Staff']
    );
    await query(
      'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['Corporate Blood Drive - TechCorp', '2026-02-20', '08:00', '12:00', 'TechCorp Headquarters', 80, 'Employee donation', 'staff', 2, 'Jordan Smith']
    );
    await query(
      'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['Community Health Fair', '2026-03-10', '10:00', '17:00', 'City Park', 150, 'Free screening & donation', 'staff', 1, 'Taylor Staff']
    );
    await query(
      'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['High School Blood Drive', '2026-02-25', '14:00', '18:00', 'Jefferson High School', 100, '16+ years old welcome', 'staff', 3, 'Casey Martinez']
    );
  } else if (eventCount < 5) {
    // Add additional events if we have fewer than 5
    const [{ exists: ev3 }] = await query('SELECT EXISTS(SELECT 1 FROM events WHERE title = ?) AS exists', ['Corporate Blood Drive - TechCorp']);
    if (!ev3) {
      await query(
        'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['Corporate Blood Drive - TechCorp', '2026-02-20', '08:00', '12:00', 'TechCorp Headquarters', 80, 'Employee donation', 'staff', 2, 'Jordan Smith']
      );
    }
    const [{ exists: ev4 }] = await query('SELECT EXISTS(SELECT 1 FROM events WHERE title = ?) AS exists', ['Community Health Fair']);
    if (!ev4) {
      await query(
        'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['Community Health Fair', '2026-03-10', '10:00', '17:00', 'City Park', 150, 'Free screening & donation', 'staff', 1, 'Taylor Staff']
      );
    }
    const [{ exists: ev5 }] = await query('SELECT EXISTS(SELECT 1 FROM events WHERE title = ?) AS exists', ['High School Blood Drive']);
    if (!ev5) {
      await query(
        'INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['High School Blood Drive', '2026-02-25', '14:00', '18:00', 'Jefferson High School', 100, '16+ years old welcome', 'staff', 3, 'Casey Martinez']
      );
    }
  }

  const [{ count: donationCount }] = await query('SELECT COUNT(*)::int AS count FROM donation_history');
  if (donationCount === 0) {
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [1, '2026-01-15', 'O+', 450, 'Life Link Center', 1, 'Routine donation']
    );
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [2, '2026-01-20', 'A-', 450, 'Campus Drive', 1, 'First-time donor']
    );
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [1, '2026-01-08', 'O+', 450, 'Life Link Center', 3, 'Regular donor']
    );
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [2, '2025-12-28', 'A-', 450, 'Mobile Unit', 4, 'Community drive']
    );
  } else if (donationCount < 4) {
    // Add more donations if we have fewer than 4
    const [{ count: existingDonations }] = await query('SELECT COUNT(*)::int AS count FROM donation_history WHERE donor_id = 1 AND donation_date = $1', ['2026-01-08']);
    if (existingDonations === 0) {
      await query(
        'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [1, '2026-01-08', 'O+', 450, 'Life Link Center', 3, 'Regular donor']
      );
    }
    const [{ count: existingDonations2 }] = await query('SELECT COUNT(*)::int AS count FROM donation_history WHERE donor_id = 2 AND donation_date = $1', ['2025-12-28']);
    if (existingDonations2 === 0) {
      await query(
        'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
        [2, '2025-12-28', 'A-', 450, 'Mobile Unit', 4, 'Community drive']
      );
    }
  }

  const [{ count: inventoryCount }] = await query('SELECT COUNT(*)::int AS count FROM blood_inventory');
  if (inventoryCount === 0) {
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['O+', 900, 'Life Link Central', '2026-03-15', 1, '2026-01-15', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['A-', 450, 'Life Link Central', '2026-03-20', 2, '2026-01-20', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['B+', 1350, 'Life Link Central', '2026-03-10', '2026-01-10', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['AB-', 225, 'Life Link West Branch', '2026-02-28', '2026-01-05', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['O-', 675, 'Life Link Central', '2026-02-15', '2026-01-12', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['A+', 450, 'Life Link West Branch', '2026-03-25', '2026-01-18', 'available']
    );
  } else if (inventoryCount < 6) {
    // Add more inventory items if we have fewer than 6
    const [{ exists: b_plus }] = await query('SELECT EXISTS(SELECT 1 FROM blood_inventory WHERE blood_type = ?) AS exists', ['B+']);
    if (!b_plus) {
      await query(
        'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['B+', 1350, 'Life Link Central', '2026-03-10', '2026-01-10', 'available']
      );
    }
    const [{ exists: ab_minus }] = await query('SELECT EXISTS(SELECT 1 FROM blood_inventory WHERE blood_type = ? AND location = ?) AS exists', ['AB-', 'Life Link West Branch']);
    if (!ab_minus) {
      await query(
        'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['AB-', 225, 'Life Link West Branch', '2026-02-28', '2026-01-05', 'available']
      );
    }
    const [{ exists: o_minus }] = await query('SELECT EXISTS(SELECT 1 FROM blood_inventory WHERE blood_type = ? AND quantity_ml > ?) AS exists', ['O-', 600]);
    if (!o_minus) {
      await query(
        'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['O-', 675, 'Life Link Central', '2026-02-15', '2026-01-12', 'available']
      );
    }
    const [{ exists: a_plus }] = await query('SELECT EXISTS(SELECT 1 FROM blood_inventory WHERE blood_type = ? AND location = ?) AS exists', ['A+', 'Life Link West Branch']);
    if (!a_plus) {
      await query(
        'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())',
        ['A+', 450, 'Life Link West Branch', '2026-03-25', '2026-01-18', 'available']
      );
    }
  }

  const [{ count: requestCount }] = await query('SELECT COUNT(*)::int AS count FROM blood_requests');
  if (requestCount === 0) {
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [1, 'O+', 900, 'urgent', 'pending', '2026-02-10', 'Need for surgery']
    );
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [2, 'A-', 450, 'routine', 'approved', '2026-02-01', 'Inventory replenishment']
    );
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [3, 'B+', 1350, 'emergency', 'pending', '2026-02-02', 'Multiple trauma patients']
    );
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [4, 'O-', 225, 'urgent', 'fulfilled', '2026-01-28', 'Pediatric transfusion']
    );
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [5, 'AB+', 675, 'routine', 'pending', '2026-02-05', 'Scheduled surgical procedures']
    );
  } else if (requestCount < 5) {
    // Add more requests if we have fewer than 5
    const [{ exists: req2 }] = await query('SELECT EXISTS(SELECT 1 FROM blood_requests WHERE hospital_id = 2 AND blood_type = ?) AS exists', ['A-']);
    if (!req2) {
      await query(
        'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
        [2, 'A-', 450, 'routine', 'approved', '2026-02-01', 'Inventory replenishment']
      );
    }
    const [{ exists: req3 }] = await query('SELECT EXISTS(SELECT 1 FROM blood_requests WHERE hospital_id = 3 AND blood_type = ?) AS exists', ['B+']);
    if (!req3) {
      await query(
        'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
        [3, 'B+', 1350, 'emergency', 'pending', '2026-02-02', 'Multiple trauma patients']
      );
    }
    const [{ exists: req4 }] = await query('SELECT EXISTS(SELECT 1 FROM blood_requests WHERE hospital_id = 4 AND blood_type = ?) AS exists', ['O-']);
    if (!req4) {
      await query(
        'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
        [4, 'O-', 225, 'urgent', 'fulfilled', '2026-01-28', 'Pediatric transfusion']
      );
    }
    const [{ exists: req5 }] = await query('SELECT EXISTS(SELECT 1 FROM blood_requests WHERE hospital_id = 5 AND blood_type = ?) AS exists', ['AB+']);
    if (!req5) {
      await query(
        'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
        [5, 'AB+', 675, 'routine', 'pending', '2026-02-05', 'Scheduled surgical procedures']
      );
    }
  }

  console.log('✅ Seed data completed');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed data failed:', err.message);
  process.exit(1);
});
