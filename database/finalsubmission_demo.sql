-- =============================================================
-- BloodLink Final Submission SQL
-- Purpose: Create all tables + demo data + function flows
-- Password for all demo users: Test123!
-- Hash (bcrypt): $2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW
-- =============================================================

BEGIN;

-- =============================================================
-- Slide 1-2: System Setup / DB Schema Overview
-- Function: Create all tables used by the app
-- =============================================================

-- Slide 2: Donor Registration / Donor Profile
CREATE TABLE IF NOT EXISTS donors (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_donation_date DATE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_donors_blood_type ON donors(blood_type);
CREATE INDEX IF NOT EXISTS idx_donors_email ON donors(email);

-- Slide 6: Hospital Registration / Hospital Profile
CREATE TABLE IF NOT EXISTS hospitals (
    id SERIAL PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100) UNIQUE NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    city VARCHAR(100) NOT NULL,
    bed_capacity INT NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_hospitals_license ON hospitals(license_number);
CREATE INDEX IF NOT EXISTS idx_hospitals_email ON hospitals(email);

-- Slide 10: Staff Registration / Staff Profile
CREATE TABLE IF NOT EXISTS staff (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    employee_id VARCHAR(100) UNIQUE NOT NULL,
    certification VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50) NOT NULL,
    blood_bank_name VARCHAR(255) NOT NULL,
    department VARCHAR(20) NOT NULL CHECK (department IN ('collection', 'testing', 'processing', 'storage', 'inventory', 'admin')),
    address VARCHAR(500) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_staff_employee_id ON staff(employee_id);
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);

-- Slide 11: Blood Inventory Management
CREATE TABLE IF NOT EXISTS blood_inventory (
    id SERIAL PRIMARY KEY,
    blood_type VARCHAR(10) NOT NULL,
    quantity_ml INT NOT NULL DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    expiry_date DATE NOT NULL,
    donor_id INT,
    collection_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'used', 'expired')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX IF NOT EXISTS idx_inventory_status ON blood_inventory(status);
CREATE INDEX IF NOT EXISTS idx_inventory_expiry ON blood_inventory(expiry_date);

-- Slide 7: Hospital Submit Request / Request Status
CREATE TABLE IF NOT EXISTS blood_requests (
    id SERIAL PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    quantity_ml INT NOT NULL,
    urgency VARCHAR(20) NOT NULL CHECK (urgency IN ('routine', 'urgent', 'emergency')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'fulfilled', 'cancelled')),
    request_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    required_by_date DATE NOT NULL,
    fulfilled_date TIMESTAMP NULL,
    notes TEXT,
    FOREIGN KEY (hospital_id) REFERENCES hospitals(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_requests_hospital ON blood_requests(hospital_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON blood_requests(status);
CREATE INDEX IF NOT EXISTS idx_requests_blood_type ON blood_requests(blood_type);

-- Slide 4: Donor Donation History
CREATE TABLE IF NOT EXISTS donation_history (
    id SERIAL PRIMARY KEY,
    donor_id INT NOT NULL,
    donation_date DATE NOT NULL,
    blood_type VARCHAR(10) NOT NULL,
    quantity_ml INT NOT NULL DEFAULT 450,
    location VARCHAR(255) NOT NULL,
    staff_id INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
    FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_history_donor ON donation_history(donor_id);
CREATE INDEX IF NOT EXISTS idx_history_date ON donation_history(donation_date);

-- Slide 12: Audit Logs
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(10) NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE')),
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('donor', 'hospital', 'staff', 'admin')),
    user_id INT NOT NULL,
    changes TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_table_record ON audit_log(table_name, record_id);
CREATE INDEX IF NOT EXISTS idx_audit_timestamp ON audit_log(timestamp);

-- Slide 5: Donor Events / Staff Event Management
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255) NOT NULL,
    expected INT,
    notes TEXT,
    created_by_type VARCHAR(20) NOT NULL CHECK (created_by_type IN ('staff', 'hospital', 'admin')),
    created_by_id INT NOT NULL,
    created_by_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);
CREATE INDEX IF NOT EXISTS idx_events_time ON events(start_time);

-- Slide 5: Event Registration
CREATE TABLE IF NOT EXISTS event_participants (
    id SERIAL PRIMARY KEY,
    event_id INT NOT NULL,
    donor_id VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    blood VARCHAR(10) NOT NULL,
    status VARCHAR(20) DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Tentative', 'Cancelled')),
    registered DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    UNIQUE (event_id, donor_id)
);

CREATE INDEX IF NOT EXISTS idx_participants_event ON event_participants(event_id);

-- Slide 11: Inventory Update Timestamp Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_blood_inventory_updated_at ON blood_inventory;
CREATE TRIGGER update_blood_inventory_updated_at BEFORE UPDATE ON blood_inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- Slide 3-12: DEMO DATA (for presentation screens)
-- =============================================================

-- Optional clean reset for demo (uncomment if needed)
-- TRUNCATE event_participants, events, audit_log, donation_history, blood_requests, blood_inventory, staff, hospitals, donors RESTART IDENTITY CASCADE;

-- Slide 3: Donor Registration (demo accounts)
INSERT INTO donors (id, full_name, email, phone, date_of_birth, blood_type, address, city, password_hash, registration_date, last_donation_date, is_active)
VALUES
  (1, 'Alex Donor',  'alex@donor.com',  '5551112222', '1996-04-12', 'O+',  '123 Main St', 'Richmond', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), '2026-01-15', TRUE),
  (2, 'Jamie Donor', 'jamie@donor.com', '5553334444', '1994-09-22', 'A-',  '456 Oak Ave', 'Norfolk',  '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), '2026-01-10', TRUE),
  (3, 'Priya Shah',  'priya@donor.com', '5552223333', '1991-05-18', 'O-',  '789 Pine Rd', 'Chesapeake', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), NULL, TRUE),
  (4, 'Omar Lee',    'omar@donor.com',  '5554445555', '1989-12-03', 'B+',  '321 Elm St',  'Virginia Beach', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), '2025-12-20', TRUE),
  (5, 'Lin Chen',    'lin@donor.com',   '5556667777', '1998-07-27', 'AB+', '654 Maple Dr', 'Newport News', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), '2025-11-15', TRUE)
ON CONFLICT (id) DO NOTHING;

-- Slide 6: Hospital Registration (demo hospitals)
INSERT INTO hospitals (id, hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, registration_date, is_verified, is_active)
VALUES
  (1, 'City General Hospital', 'LIC-12345', 'Dr. Morgan', 'hospital@bloodlink.com', '5559990000', '100 Medical Way', 'Richmond', 250, '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (2, 'St. Mary''s Medical Center', 'LIC-23456', 'Dr. Sarah Chen', 'contact@stmarys.com', '5551234567', '250 Healthcare Dr', 'Norfolk', 400, '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (3, 'Memorial Hospital', 'LIC-34567', 'Dr. James Rodriguez', 'info@memorial.org', '5559876543', '500 Memorial Blvd', 'Virginia Beach', 300, '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Slide 10: Staff Registration (demo staff)
INSERT INTO staff (id, full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, registration_date, is_verified, is_active)
VALUES
  (1, 'Taylor Staff',   'EMP-001', 'Certified Phlebotomist', 'staff@bloodlink.com', '5557778888', 'Life Link Central', 'collection', '789 Pine Rd', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (2, 'Jordan Smith',   'EMP-002', 'Medical Laboratory Technician', 'jordan.smith@lifelink.com', '5558881111', 'Life Link Central', 'testing', '234 Elm St', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (3, 'Casey Martinez', 'EMP-003', 'Blood Bank Manager', 'casey.martinez@lifelink.com', '5552223333', 'Life Link Central', 'admin', '567 Maple Ave', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (4, 'Riley Johnson',  'EMP-004', 'Certified Phlebotomist', 'riley.johnson@lifelink.com', '5554445555', 'Life Link West Branch', 'collection', '890 Oak Blvd', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE),
  (5, 'Sam Lee',        'EMP-005', 'Quality Assurance Specialist', 'sam.lee@lifelink.com', '5556667777', 'Life Link Central', 'processing', '123 Cedar Ln', '$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW', NOW(), TRUE, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Slide 5: Events + Event Participants (donor event registration)
INSERT INTO events (id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name)
VALUES
  (1, 'Downtown Blood Drive', '2026-02-15', '09:00:00', '14:00:00', 'Downtown Center', 120, 'Walk-ins welcome', 'staff', 1, 'Taylor Staff'),
  (2, 'Campus Donation Day', '2026-03-01', '10:00:00', '16:00:00', 'State University', 150, 'Student campaign', 'hospital', 1, 'City General Hospital'),
  (3, 'Community Health Fair', '2026-03-10', '08:30:00', '12:30:00', 'Community Hall', 90, 'Health fair + donation', 'staff', 3, 'Casey Martinez')
ON CONFLICT (id) DO NOTHING;

INSERT INTO event_participants (event_id, donor_id, name, blood, status, registered)
VALUES
  (1, '1', 'Alex Donor', 'O+', 'Confirmed', '2026-02-01'),
  (1, '2', 'Jamie Donor', 'A-', 'Confirmed', '2026-02-02'),
  (2, '3', 'Priya Shah', 'O-', 'Tentative', '2026-02-05'),
  (2, '4', 'Omar Lee', 'B+', 'Confirmed', '2026-02-06'),
  (3, '5', 'Lin Chen', 'AB+', 'Confirmed', '2026-02-07');

-- Slide 11: Blood Inventory (for staff + hospital dashboards)
INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status)
VALUES
  ('O+',  1800, 'Fridge A', '2026-03-01', 1, '2026-01-18', 'available'),
  ('A-',  900,  'Fridge A', '2026-02-20', 2, '2026-01-15', 'available'),
  ('O-',  450,  'Fridge B', '2026-02-12', 3, '2026-01-10', 'available'),
  ('B+',  900,  'Fridge B', '2026-02-22', 4, '2026-01-16', 'reserved'),
  ('AB+', 450,  'Fridge C', '2026-02-18', 5, '2026-01-12', 'used'),
  ('O+',  450,  'Fridge A', '2026-02-15', 1, '2026-01-20', 'available');

-- Slide 7-8: Hospital Requests (pending + fulfilled examples)
INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, required_by_date, fulfilled_date, notes)
VALUES
  (1, 'O+', 2250, 'urgent',    'pending',   '2026-02-15', NULL, 'Urgent surgery case'),
  (1, 'A-', 900,  'routine',   'fulfilled',  '2026-02-18', NULL, 'Routine stock refill'),
  (2, 'O-', 450,  'emergency', 'pending',   '2026-02-12', NULL, 'Trauma patient need'),
  (3, 'AB+',450,  'routine',   'fulfilled', '2026-02-10', NOW(), 'Regular supply');

-- Slide 4: Donation History (donor timeline + eligibility)
INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes)
VALUES
  (1, '2026-01-15', 'O+',  450, 'Life Link Central', 1, 'Routine donation'),
  (2, '2026-01-10', 'A-',  450, 'Life Link Central', 1, 'Eligible in 56 days'),
  (4, '2025-12-20', 'B+',  450, 'Life Link West',    4, 'Processed successfully'),
  (5, '2025-11-15', 'AB+', 450, 'Life Link Central', 2, 'Rare blood type');

-- Slide 12: Audit Logs (compliance demo)
INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
VALUES
  ('donors', 1, 'INSERT', 'donor', 1, 'Donor account created'),
  ('blood_inventory', 1, 'INSERT', 'staff', 1, 'Inventory unit added: O+ 1800ml'),
  ('blood_requests', 1, 'UPDATE', 'staff', 3, 'Status updated to fulfilled'),
  ('events', 1, 'INSERT', 'staff', 1, 'Event created: Downtown Blood Drive');

COMMIT;

-- =============================================================
-- Slide 13: Verification Queries (optional for demo)
-- =============================================================
-- SELECT 'Donors' as table_name, COUNT(*) as record_count FROM donors
-- UNION ALL SELECT 'Hospitals', COUNT(*) FROM hospitals
-- UNION ALL SELECT 'Staff', COUNT(*) FROM staff
-- UNION ALL SELECT 'Events', COUNT(*) FROM events
-- UNION ALL SELECT 'Event Participants', COUNT(*) FROM event_participants
-- UNION ALL SELECT 'Blood Inventory', COUNT(*) FROM blood_inventory
-- UNION ALL SELECT 'Blood Requests', COUNT(*) FROM blood_requests
-- UNION ALL SELECT 'Donation History', COUNT(*) FROM donation_history
-- UNION ALL SELECT 'Audit Log', COUNT(*) FROM audit_log
-- ORDER BY record_count DESC;
