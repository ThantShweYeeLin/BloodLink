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
      ['Taylor Staff', 'EMP-001', 'Certified Phlebotomist', 'staff@bloodlink.com', '5557778888', 'BloodLink Central', 'collection', '789 Pine Rd', passwordHash]
    );
  }

  const [{ count: hospitalCount }] = await query('SELECT COUNT(*)::int AS count FROM hospitals');
  if (hospitalCount === 0) {
    await query(
      'INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), TRUE, TRUE)',
      ['City General Hospital', 'LIC-12345', 'Dr. Morgan', 'hospital@bloodlink.com', '5559990000', '100 Medical Way', 'Richmond', 250, passwordHash]
    );
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
  }

  const [{ count: donationCount }] = await query('SELECT COUNT(*)::int AS count FROM donation_history');
  if (donationCount === 0) {
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [1, '2026-01-15', 'O+', 450, 'BloodLink Center', 1, 'Routine donation']
    );
    await query(
      'INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [2, '2026-01-20', 'A-', 450, 'Campus Drive', 1, 'First-time donor']
    );
  }

  const [{ count: inventoryCount }] = await query('SELECT COUNT(*)::int AS count FROM blood_inventory');
  if (inventoryCount === 0) {
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['O+', 900, 'BloodLink Central', '2026-03-15', 1, '2026-01-15', 'available']
    );
    await query(
      'INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      ['A-', 450, 'BloodLink Central', '2026-03-20', 2, '2026-01-20', 'available']
    );
  }

  const [{ count: requestCount }] = await query('SELECT COUNT(*)::int AS count FROM blood_requests');
  if (requestCount === 0) {
    await query(
      'INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes) VALUES (?, ?, ?, ?, ?, NOW(), ?, ?)',
      [1, 'O+', 900, 'urgent', 'pending', '2026-02-10', 'Need for surgery']
    );
  }

  console.log('✅ Seed data completed');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Seed data failed:', err.message);
  process.exit(1);
});
