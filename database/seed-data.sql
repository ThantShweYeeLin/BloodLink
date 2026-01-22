-- BloodLink Test Data Seed Script
-- This script populates all tables with realistic test data

-- Insert Donors
INSERT INTO donors (full_name, email, phone, date_of_birth, blood_type, address, city, password_hash, last_donation_date, is_active)
VALUES
  ('Alice Johnson', 'alice@donor.com', '5551001001', '1990-03-15', 'O+', '123 Main St', 'New York', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', '2026-01-10', true),
  ('Bob Smith', 'bob@donor.com', '5551002002', '1985-07-22', 'A+', '456 Oak Ave', 'Boston', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', '2025-12-15', true),
  ('Carol White', 'carol@donor.com', '5551003003', '1992-11-08', 'B-', '789 Pine Rd', 'Chicago', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', null, true),
  ('David Brown', 'david@donor.com', '5551004004', '1988-05-19', 'AB+', '321 Elm St', 'Houston', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', '2025-11-20', true),
  ('Eve Davis', 'eve@donor.com', '5551005005', '1995-09-12', 'O-', '654 Maple Dr', 'Phoenix', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', null, true);

-- Insert Hospitals
INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, is_verified, is_active)
VALUES
  ('Central Medical Hospital', 'LIC001', 'John Director', 'contact@central-hospital.com', '5552001001', '100 Hospital Ln', 'New York', 500, '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true),
  ('City Care Hospital', 'LIC002', 'Sarah Manager', 'info@city-care.com', '5552002002', '200 Care Ave', 'Boston', 300, '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true),
  ('Health Plus Medical Center', 'LIC003', 'Michael Chief', 'admin@healthplus.com', '5552003003', '300 Health St', 'Chicago', 400, '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', false, true);

-- Insert Staff
INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, is_verified, is_active)
VALUES
  ('Dr. James Wilson', 'EMP001', 'MD-Pathology', 'james@bloodbank.com', '5553001001', 'Central Blood Bank', 'testing', '100 Lab St', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true),
  ('Lisa Anderson', 'EMP002', 'RN-Phlebotomy', 'lisa@bloodbank.com', '5553002002', 'Central Blood Bank', 'collection', '100 Lab St', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true),
  ('Mark Thompson', 'EMP003', 'Tech-Processing', 'mark@bloodbank.com', '5553003003', 'Central Blood Bank', 'processing', '100 Lab St', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true),
  ('Jennifer Lee', 'EMP004', 'Admin-Cert', 'jennifer@bloodbank.com', '5553004004', 'Central Blood Bank', 'inventory', '100 Lab St', '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcg7b3XeKeUxWdeS86E36P6YY1y', true, true);

-- Insert Events
INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name)
VALUES
  ('Winter Blood Drive', '2026-02-15', '09:00:00', '17:00:00', 'Central Park', 200, 'Community blood donation drive', 'staff', 1, 'Dr. James Wilson'),
  ('Hospital Annual Campaign', '2026-03-01', '10:00:00', '16:00:00', 'Central Medical Hospital', 150, 'Annual donation campaign at hospital', 'hospital', 1, 'Central Medical Hospital'),
  ('Company Blood Donation', '2026-02-20', '08:00:00', '14:00:00', 'Tech Corp Office', 100, 'Corporate donation event', 'staff', 2, 'Lisa Anderson');

-- Insert Event Participants
INSERT INTO event_participants (event_id, donor_id, name, blood, status, registered)
VALUES
  (1, '1', 'Alice Johnson', 'O+', 'Confirmed', '2026-01-19'),
  (1, '2', 'Bob Smith', 'A+', 'Confirmed', '2026-01-19'),
  (2, '3', 'Carol White', 'B-', 'Tentative', '2026-01-19'),
  (3, '4', 'David Brown', 'AB+', 'Confirmed', '2026-01-18');

-- Insert Blood Inventory
INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status)
VALUES
  ('O+', 1800, 'Refrigerator A', '2026-02-19', 1, '2026-01-19', 'available'),
  ('A+', 1200, 'Refrigerator A', '2026-02-15', 2, '2026-01-15', 'available'),
  ('B-', 900, 'Refrigerator B', '2026-02-20', 3, '2026-01-19', 'available'),
  ('AB+', 600, 'Refrigerator B', '2026-02-18', 4, '2026-01-18', 'reserved'),
  ('O-', 450, 'Refrigerator C', '2026-02-10', null, '2025-12-20', 'expired');

-- Insert Blood Requests
INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, required_by_date, notes)
VALUES
  (1, 'O+', 3000, 'routine', 'approved', '2026-02-25', 'Regular stock replenishment'),
  (1, 'A+', 1500, 'urgent', 'pending', '2026-01-22', 'Emergency surgery scheduled'),
  (2, 'B-', 900, 'emergency', 'pending', '2026-01-20', 'Trauma patient'),
  (3, 'AB+', 600, 'routine', 'fulfilled', '2026-02-01', 'Stock update');

-- Insert Donation History
INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes)
VALUES
  (1, '2026-01-19', 'O+', 450, 'Central Blood Bank', 2, 'Routine donation'),
  (2, '2026-01-15', 'A+', 450, 'Central Blood Bank', 2, 'Regular donor'),
  (3, '2025-12-10', 'B-', 450, 'Central Blood Bank', 2, 'Previous donation'),
  (4, '2026-01-18', 'AB+', 450, 'Central Blood Bank', 3, 'Processed successfully'),
  (5, '2025-11-05', 'O-', 450, 'Central Blood Bank', 2, 'Rare blood type');

-- Insert Audit Log
INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
VALUES
  ('donors', 1, 'INSERT', 'admin', 1, 'New donor created: Alice Johnson'),
  ('blood_inventory', 1, 'INSERT', 'staff', 1, 'Blood unit received: O+ 1800ml'),
  ('blood_requests', 1, 'UPDATE', 'staff', 1, 'Status updated to approved'),
  ('events', 1, 'INSERT', 'staff', 1, 'New event created: Winter Blood Drive');

-- Verify data was inserted
SELECT 'Donors' as table_name, COUNT(*) as record_count FROM donors
UNION ALL
SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL
SELECT 'Staff', COUNT(*) FROM staff
UNION ALL
SELECT 'Events', COUNT(*) FROM events
UNION ALL
SELECT 'Event Participants', COUNT(*) FROM event_participants
UNION ALL
SELECT 'Blood Inventory', COUNT(*) FROM blood_inventory
UNION ALL
SELECT 'Blood Requests', COUNT(*) FROM blood_requests
UNION ALL
SELECT 'Donation History', COUNT(*) FROM donation_history
UNION ALL
SELECT 'Audit Log', COUNT(*) FROM audit_log
ORDER BY record_count DESC;
