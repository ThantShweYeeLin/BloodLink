-- ============================================================================
-- BloodLink: Complete SQL Script with Numbered Commands by Screen Function
-- Version: Final Submission
-- Database: MySQL/PostgreSQL Compatible
-- Password for all demo users: Test123!
-- Bcrypt Hash: $2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW
-- ============================================================================

-- ============================================================================
-- SECTION 1: DATABASE SCHEMA & TABLE CREATION (Referenced in PPT Slide 1-2)
-- ============================================================================

-- COMMAND 1.1: Create Donors Table (Donor Registration Screen)
-- Referenced in PPT: Slide 3 - Donor Registration/Profile
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

-- COMMAND 1.2: Create Hospitals Table (Hospital Registration Screen)
-- Referenced in PPT: Slide 6 - Hospital Registration/Profile
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

-- COMMAND 1.3: Create Staff Table (Staff Registration Screen)
-- Referenced in PPT: Slide 10 - Staff Registration/Profile
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

-- COMMAND 1.4: Create Events Table (Donor Event Registration Screen)
-- Referenced in PPT: Slide 5 - Donor Events/Event Management
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

-- COMMAND 1.5: Create Event Participants Table (Event Registration)
-- Referenced in PPT: Slide 5 - Event Participants/Registration
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

-- COMMAND 1.6: Create Blood Inventory Table (Inventory Management Screen)
-- Referenced in PPT: Slide 11 - Blood Inventory Management
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

-- COMMAND 1.7: Create Blood Requests Table (Hospital Request Management)
-- Referenced in PPT: Slide 7-8 - Hospital Submit Request/Request Status
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

-- COMMAND 1.8: Create Donation History Table (Donor Donation Tracking)
-- Referenced in PPT: Slide 4 - Donor Donation History/Timeline
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

-- COMMAND 1.9: Create Audit Log Table (Compliance & Audit Trail)
-- Referenced in PPT: Slide 12 - Audit Logs/Compliance
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

-- ============================================================================
-- SECTION 2: DATABASE TRIGGERS & FUNCTIONS
-- ============================================================================

-- COMMAND 2.1: Create Update Trigger Function
-- Purpose: Auto-update 'updated_at' timestamp for inventory changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE PLPGSQL;

-- COMMAND 2.2: Apply Update Trigger to Blood Inventory Table
DROP TRIGGER IF EXISTS update_blood_inventory_updated_at ON blood_inventory;
CREATE TRIGGER update_blood_inventory_updated_at BEFORE UPDATE ON blood_inventory
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- COMMAND 2.3: Apply Update Trigger to Events Table
DROP TRIGGER IF EXISTS update_events_updated_at ON events;
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SECTION 3: AUTHENTICATION OPERATIONS
-- ============================================================================

-- COMMAND 3.1: Donor Login Query
-- Purpose: Retrieve donor by email for login validation (Slide 3)
SELECT id, full_name, email, password_hash FROM donors WHERE email = ? LIMIT 1;

-- COMMAND 3.2: Hospital Login Query
-- Purpose: Retrieve hospital by email for login validation (Slide 6)
SELECT id, hospital_name, email, password_hash FROM hospitals WHERE email = ? LIMIT 1;

-- COMMAND 3.3: Staff Login Query
-- Purpose: Retrieve staff by email for login validation (Slide 10)
SELECT id, full_name, email, password_hash FROM staff WHERE email = ? LIMIT 1;

-- ============================================================================
-- SECTION 4: DONOR OPERATIONS
-- ============================================================================

-- COMMAND 4.1: Register New Donor
-- Purpose: Insert new donor record (Donor Registration Screen, Slide 3)
INSERT INTO donors (full_name, email, phone, date_of_birth, blood_type, address, city, password_hash, is_active)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE);

-- COMMAND 4.2: Get Donor Profile
-- Purpose: Retrieve complete donor information (Donor Profile Screen, Slide 3)
SELECT id, full_name, email, phone, date_of_birth, blood_type, address, city, registration_date, last_donation_date, is_active
FROM donors WHERE id = ? LIMIT 1;

-- COMMAND 4.3: Update Donor Profile
-- Purpose: Modify donor profile information (Donor Profile Update, Slide 3)
UPDATE donors SET full_name = ?, phone = ?, address = ?, city = ? WHERE id = ?;

-- COMMAND 4.4: Get Donor Donation History
-- Purpose: Retrieve all donations for a specific donor (Donation History Screen, Slide 4)
SELECT id, donation_date, blood_type, quantity_ml, location, notes 
FROM donation_history 
WHERE donor_id = ? 
ORDER BY donation_date DESC;

-- COMMAND 4.5: Calculate Donor Eligibility
-- Purpose: Check if donor can donate again (56 days minimum between donations)
SELECT DATEDIFF(CURDATE(), COALESCE(last_donation_date, '1900-01-01')) AS days_since_last_donation
FROM donors WHERE id = ?;

-- COMMAND 4.6: Get Available Events for Donor
-- Purpose: Retrieve upcoming events donor can register for (Event Registration, Slide 5)
SELECT id, title, date, start_time, end_time, location, expected, notes
FROM events
WHERE date >= CURDATE() AND created_by_type IN ('staff', 'hospital', 'admin')
ORDER BY date ASC;

-- COMMAND 4.7: Register Donor for Event
-- Purpose: Add donor to event participants (Event Registration, Slide 5)
INSERT INTO event_participants (event_id, donor_id, name, blood, status, registered)
VALUES (?, ?, ?, ?, 'Confirmed', CURDATE());

-- COMMAND 4.8: Get Registered Events for Donor
-- Purpose: Retrieve events donor has registered for (Event Registration, Slide 5)
SELECT e.id, e.title, e.date, e.start_time, e.end_time, e.location, ep.status
FROM events e
JOIN event_participants ep ON e.id = ep.event_id
WHERE ep.donor_id = ?
ORDER BY e.date DESC;

-- ============================================================================
-- SECTION 5: DONATION RECORDING OPERATIONS
-- ============================================================================

-- COMMAND 5.1: Record New Donation
-- Purpose: Create donation history record (Donation Recording Screen)
INSERT INTO donation_history (donor_id, donation_date, blood_type, quantity_ml, location, staff_id, notes)
VALUES (?, ?, ?, ?, ?, ?, ?);

-- COMMAND 5.2: Update Last Donation Date
-- Purpose: Update donor's last donation date for eligibility tracking
UPDATE donors SET last_donation_date = ? WHERE id = ?;

-- COMMAND 5.3: Create Blood Inventory from Donation
-- Purpose: Auto-create inventory unit when donation is recorded (Slide 11 - Inventory Management)
INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status)
VALUES (?, ?, ?, DATE_ADD(?, INTERVAL 42 DAY), ?, ?, 'available');

-- ============================================================================
-- SECTION 6: STAFF OPERATIONS & MANAGEMENT
-- ============================================================================

-- COMMAND 6.1: Register New Staff Member
-- Purpose: Insert new staff record (Staff Registration, Slide 10)
INSERT INTO staff (full_name, employee_id, certification, email, phone, blood_bank_name, department, address, password_hash, is_verified, is_active)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, TRUE);

-- COMMAND 6.2: Get Staff Profile
-- Purpose: Retrieve staff member information (Staff Profile, Slide 10)
SELECT id, full_name, employee_id, certification, email, phone, blood_bank_name, department, address, registration_date, is_verified
FROM staff WHERE id = ?;

-- COMMAND 6.3: Update Staff Profile
-- Purpose: Modify staff information (Staff Profile Update, Slide 10)
UPDATE staff SET full_name = ?, phone = ?, certification = ?, department = ? WHERE id = ?;

-- COMMAND 6.4: Get All Staff Members (Admin View)
-- Purpose: Retrieve all staff for management/reporting (Staff Management, Slide 10)
SELECT id, full_name, employee_id, certification, email, department, blood_bank_name, is_verified, is_active
FROM staff
ORDER BY full_name ASC;

-- COMMAND 6.5: Get Donors for Management
-- Purpose: Retrieve all donors for staff management view (Donor Management Screen)
SELECT id, full_name, email, phone, blood_type, last_donation_date, registration_date, is_active
FROM donors
ORDER BY full_name ASC;

-- COMMAND 6.6: Get Donor History (Staff View)
-- Purpose: View specific donor's donation history (Donor Management History, Slide 4)
SELECT dh.id, dh.donation_date, dh.blood_type, dh.quantity_ml, dh.location, dh.notes
FROM donation_history dh
WHERE dh.donor_id = ?
ORDER BY dh.donation_date DESC;

-- ============================================================================
-- SECTION 7: INVENTORY MANAGEMENT OPERATIONS
-- ============================================================================

-- COMMAND 7.1: Get All Blood Inventory
-- Purpose: Display all blood units (Inventory Management, Slide 11)
SELECT id, blood_type, quantity_ml, location, expiry_date, donor_id, collection_date, status
FROM blood_inventory
WHERE status IN ('available', 'reserved')
ORDER BY blood_type ASC, expiry_date ASC;

-- COMMAND 7.2: Get Inventory by Blood Type
-- Purpose: Filter inventory by specific blood type (Inventory Management, Slide 11)
SELECT id, blood_type, quantity_ml, location, expiry_date, collection_date, status
FROM blood_inventory
WHERE blood_type = ? AND status = 'available'
ORDER BY expiry_date ASC;

-- COMMAND 7.3: Get Inventory Count by Blood Type
-- Purpose: Summary statistics for dashboard (Staff Dashboard, Slide 11)
SELECT blood_type, COUNT(*) AS unit_count, SUM(quantity_ml) AS total_ml
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY blood_type ASC;

-- COMMAND 7.4: Add Supply to Inventory (Manual)
-- Purpose: Manually add blood units to inventory (Inventory Add Supply, Slide 11)
INSERT INTO blood_inventory (blood_type, quantity_ml, location, expiry_date, collection_date, status)
VALUES (?, ?, ?, ?, CURDATE(), 'available');

-- COMMAND 7.5: Update Inventory Unit
-- Purpose: Modify inventory unit details (Inventory Update, Slide 11)
UPDATE blood_inventory SET quantity_ml = ?, location = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- COMMAND 7.6: Delete Inventory Unit
-- Purpose: Remove inventory unit (expired or error correction) (Inventory Management, Slide 11)
DELETE FROM blood_inventory WHERE id = ?;

-- COMMAND 7.7: Check Expiring Units
-- Purpose: Identify units expiring within 7 days (Staff Dashboard, Slide 11)
SELECT id, blood_type, quantity_ml, location, expiry_date, status
FROM blood_inventory
WHERE status = 'available'
AND expiry_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY expiry_date ASC;

-- COMMAND 7.8: Update Inventory Status
-- Purpose: Change inventory unit status (used, expired, reserved) (Inventory Management, Slide 11)
UPDATE blood_inventory SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- ============================================================================
-- SECTION 8: BLOOD REQUEST OPERATIONS (HOSPITAL)
-- ============================================================================

-- COMMAND 8.1: Submit Blood Request
-- Purpose: Hospital submits a blood request (Hospital Submit Request, Slide 7)
INSERT INTO blood_requests (hospital_id, blood_type, quantity_ml, urgency, status, required_by_date, notes)
VALUES (?, ?, ?, ?, 'pending', ?, ?);

-- COMMAND 8.2: Get Hospital's Own Requests
-- Purpose: View requests submitted by specific hospital (Hospital Dashboard, Slide 7)
SELECT id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, fulfilled_date, notes
FROM blood_requests
WHERE hospital_id = ?
ORDER BY request_date DESC;

-- COMMAND 8.3: Get All Pending Requests (Staff View)
-- Purpose: Retrieve pending requests for staff fulfillment (Request Management, Slide 8)
SELECT id, hospital_id, blood_type, quantity_ml, urgency, status, request_date, required_by_date, notes
FROM blood_requests
WHERE status IN ('pending', 'fulfilled')
ORDER BY urgency DESC, request_date ASC;

-- COMMAND 8.4: Get Request Details
-- Purpose: View complete request information (Request Details, Slide 8)
SELECT br.id, br.hospital_id, h.hospital_name, br.blood_type, br.quantity_ml, br.urgency, br.status, br.request_date, br.required_by_date, br.fulfilled_date, br.notes
FROM blood_requests br
JOIN hospitals h ON br.hospital_id = h.id
WHERE br.id = ?;

-- ============================================================================
-- SECTION 9: BLOOD REQUEST FULFILLMENT OPERATIONS (STAFF)
-- ============================================================================

-- COMMAND 9.1: Approve Blood Request
-- Purpose: Staff approves a pending request (Request Management, Slide 8)
UPDATE blood_requests SET status = 'fulfilled' WHERE id = ?;

-- COMMAND 9.2: Fulfill Blood Request
-- Purpose: Staff fulfills request and allocates inventory units (Request Fulfillment, Slide 8)
UPDATE blood_requests SET status = 'fulfilled', fulfilled_date = CURRENT_TIMESTAMP WHERE id = ?;

-- COMMAND 9.3: Update Inventory Status to Used
-- Purpose: Mark inventory units as 'used' when request fulfilled (Inventory Management, Slide 11)
UPDATE blood_inventory SET status = 'used', updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- COMMAND 9.4: Reject Blood Request
-- Purpose: Staff rejects request with reason (Request Management, Slide 8)
UPDATE blood_requests SET status = 'cancelled', notes = ? WHERE id = ?;

-- COMMAND 9.5: Cancel Blood Request
-- Purpose: Hospital or staff cancels a request (Request Management, Slide 8)
UPDATE blood_requests SET status = 'cancelled' WHERE id = ?;

-- ============================================================================
-- SECTION 10: HOSPITAL OPERATIONS
-- ============================================================================

-- COMMAND 10.1: Register New Hospital
-- Purpose: Insert new hospital record (Hospital Registration, Slide 6)
INSERT INTO hospitals (hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, password_hash, is_verified, is_active)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, FALSE, TRUE);

-- COMMAND 10.2: Get Hospital Profile
-- Purpose: Retrieve hospital information (Hospital Profile, Slide 6)
SELECT id, hospital_name, license_number, contact_person, email, phone, address, city, bed_capacity, registration_date, is_verified, is_active
FROM hospitals WHERE id = ?;

-- COMMAND 10.3: Update Hospital Profile
-- Purpose: Modify hospital details (Hospital Profile Update, Slide 6)
UPDATE hospitals SET hospital_name = ?, contact_person = ?, phone = ?, address = ?, city = ? WHERE id = ?;

-- COMMAND 10.4: Get Hospital Dashboard Summary
-- Purpose: Retrieve hospital's request statistics (Hospital Dashboard, Slide 6)
SELECT 
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending_requests,
    COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS approved_requests,
    COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS fulfilled_requests,
    COUNT(CASE WHEN urgency = 'emergency' THEN 1 END) AS emergency_count
FROM blood_requests WHERE hospital_id = ?;

-- ============================================================================
-- SECTION 11: EVENT MANAGEMENT OPERATIONS (STAFF)
-- ============================================================================

-- COMMAND 11.1: Create Event
-- Purpose: Staff creates new donation event (Event Management, Slide 5)
INSERT INTO events (title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);

-- COMMAND 11.2: Get All Events
-- Purpose: Retrieve all events for display (Event Management Dashboard, Slide 5)
SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_name, created_at
FROM events
ORDER BY date DESC;

-- COMMAND 11.3: Get Event Details
-- Purpose: Retrieve detailed event information (Event Details, Slide 5)
SELECT id, title, date, start_time, end_time, location, expected, notes, created_by_type, created_by_id, created_by_name, created_at, updated_at
FROM events WHERE id = ?;

-- COMMAND 11.4: Get Event Participants
-- Purpose: View all participants registered for an event (Event Participants, Slide 5)
SELECT id, donor_id, name, blood, status, registered
FROM event_participants
WHERE event_id = ?
ORDER BY registered DESC;

-- COMMAND 11.5: Update Event Details
-- Purpose: Modify event information (Event Management Edit, Slide 5)
UPDATE events SET title = ?, date = ?, start_time = ?, end_time = ?, location = ?, expected = ?, notes = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?;

-- COMMAND 11.6: Delete Event
-- Purpose: Remove event and associated participants (Event Management Delete, Slide 5)
DELETE FROM events WHERE id = ?;
-- NOTE: event_participants will be auto-deleted via CASCADE constraint

-- COMMAND 11.7: Update Participant Status
-- Purpose: Change participant status (Confirmed/Tentative/Cancelled) (Event Management, Slide 5)
UPDATE event_participants SET status = ? WHERE id = ? AND event_id = ?;

-- ============================================================================
-- SECTION 12: AUDIT LOG & COMPLIANCE OPERATIONS
-- ============================================================================

-- COMMAND 12.1: Log User Action - INSERT
-- Purpose: Record new record creation (Audit Trail, Slide 12)
INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
VALUES (?, ?, 'INSERT', ?, ?, ?);

-- COMMAND 12.2: Log User Action - UPDATE
-- Purpose: Record record modification (Audit Trail, Slide 12)
INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
VALUES (?, ?, 'UPDATE', ?, ?, ?);

-- COMMAND 12.3: Log User Action - DELETE
-- Purpose: Record record deletion (Audit Trail, Slide 12)
INSERT INTO audit_log (table_name, record_id, action, user_type, user_id, changes)
VALUES (?, ?, 'DELETE', ?, ?, ?);

-- COMMAND 12.4: Get Audit Log History
-- Purpose: Retrieve audit trail for compliance (Audit Logs Screen, Slide 12)
SELECT id, table_name, record_id, action, user_type, user_id, changes, timestamp
FROM audit_log
ORDER BY timestamp DESC
LIMIT 500;

-- COMMAND 12.5: Get Audit History by User
-- Purpose: Track specific user's actions (Audit Logs by User, Slide 12)
SELECT id, table_name, record_id, action, changes, timestamp
FROM audit_log
WHERE user_type = ? AND user_id = ?
ORDER BY timestamp DESC;

-- COMMAND 12.6: Get Audit History by Table
-- Purpose: Track changes to specific table (Audit Logs by Table, Slide 12)
SELECT id, record_id, action, user_type, user_id, changes, timestamp
FROM audit_log
WHERE table_name = ?
ORDER BY timestamp DESC;

-- ============================================================================
-- SECTION 13: DASHBOARD & REPORTING QUERIES
-- ============================================================================

-- COMMAND 13.1: Donor Dashboard - Summary Statistics
-- Purpose: Display donor dashboard metrics (Donor Dashboard, Slide 3)
SELECT 
    (SELECT COUNT(*) FROM donors WHERE is_active = TRUE) AS total_donors,
    (SELECT COUNT(*) FROM donation_history WHERE YEAR(donation_date) = YEAR(CURDATE())) AS donations_this_year,
    (SELECT SUM(quantity_ml) FROM blood_inventory WHERE status = 'available') AS total_units_available;

-- COMMAND 13.2: Staff Dashboard - Inventory Summary
-- Purpose: Display staff inventory overview (Staff Dashboard, Slide 11)
SELECT 
    blood_type,
    COUNT(*) AS units_available,
    SUM(quantity_ml) AS total_volume_ml,
    MIN(expiry_date) AS earliest_expiry
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY blood_type ASC;

-- COMMAND 13.3: Staff Dashboard - Request Summary
-- Purpose: Display request statistics (Staff Dashboard, Slide 8)
SELECT 
    COUNT(CASE WHEN status = 'pending' THEN 1 END) AS pending,
    COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS approved,
    COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS fulfilled,
    COUNT(CASE WHEN urgency = 'emergency' THEN 1 END) AS emergency_count
FROM blood_requests;

-- COMMAND 13.4: Hospital Dashboard - Request Status
-- Purpose: Display hospital's request overview (Hospital Dashboard, Slide 6)
SELECT 
    status,
    COUNT(*) AS count
FROM blood_requests
WHERE hospital_id = ?
GROUP BY status;

-- COMMAND 13.5: Hospital Dashboard - Inventory Availability
-- Purpose: Check available units by blood type (Hospital Dashboard, Slide 6)
SELECT 
    blood_type,
    COUNT(*) AS available_units
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY blood_type ASC;

-- COMMAND 13.6: Report - Blood Inventory Status
-- Purpose: Generate comprehensive inventory report (Reports, Slide 12)
SELECT 
    blood_type,
    COUNT(*) AS total_units,
    SUM(quantity_ml) AS total_volume,
    COUNT(CASE WHEN status = 'available' THEN 1 END) AS available,
    COUNT(CASE WHEN status = 'reserved' THEN 1 END) AS reserved,
    COUNT(CASE WHEN status = 'used' THEN 1 END) AS used,
    COUNT(CASE WHEN status = 'expired' THEN 1 END) AS expired
FROM blood_inventory
GROUP BY blood_type
ORDER BY blood_type ASC;

-- COMMAND 13.7: Report - Donation Activity
-- Purpose: Generate donation statistics report (Reports, Slide 4)
SELECT 
    MONTH(donation_date) AS month,
    YEAR(donation_date) AS year,
    COUNT(*) AS donations,
    SUM(quantity_ml) AS total_volume
FROM donation_history
GROUP BY YEAR(donation_date), MONTH(donation_date)
ORDER BY year DESC, month DESC;

-- COMMAND 13.8: Report - Hospital Request Fulfillment
-- Purpose: Generate request fulfillment report (Reports, Slide 7-8)
SELECT 
    hospital_id,
    h.hospital_name,
    COUNT(*) AS total_requests,
    COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) AS fulfilled,
    ROUND(COUNT(CASE WHEN status = 'fulfilled' THEN 1 END) * 100.0 / COUNT(*), 2) AS fulfillment_rate
FROM blood_requests br
JOIN hospitals h ON br.hospital_id = h.id
GROUP BY hospital_id, h.hospital_name
ORDER BY fulfillment_rate DESC;

-- ============================================================================
-- SECTION 14: DATA VALIDATION & UTILITY QUERIES
-- ============================================================================

-- COMMAND 14.1: Verify Database Schema
-- Purpose: Check all tables created successfully
SELECT 'Donors' AS table_name, COUNT(*) AS record_count FROM donors
UNION ALL SELECT 'Hospitals', COUNT(*) FROM hospitals
UNION ALL SELECT 'Staff', COUNT(*) FROM staff
UNION ALL SELECT 'Events', COUNT(*) FROM events
UNION ALL SELECT 'Event Participants', COUNT(*) FROM event_participants
UNION ALL SELECT 'Blood Inventory', COUNT(*) FROM blood_inventory
UNION ALL SELECT 'Blood Requests', COUNT(*) FROM blood_requests
UNION ALL SELECT 'Donation History', COUNT(*) FROM donation_history
UNION ALL SELECT 'Audit Log', COUNT(*) FROM audit_log
ORDER BY record_count DESC;

-- COMMAND 14.2: Check Expired Units
-- Purpose: Identify expired blood units for disposal
SELECT id, blood_type, quantity_ml, expiry_date, status
FROM blood_inventory
WHERE expiry_date < CURDATE()
ORDER BY expiry_date ASC;

-- COMMAND 14.3: Check High-Priority Requests
-- Purpose: Identify emergency requests requiring immediate attention
SELECT id, hospital_id, blood_type, urgency, status, required_by_date
FROM blood_requests
WHERE urgency = 'emergency' AND status != 'fulfilled'
ORDER BY request_date ASC;

-- COMMAND 14.4: Find Donors Eligible to Donate
-- Purpose: Identify donors available for solicitation (56+ days since last donation)
SELECT id, full_name, email, blood_type, last_donation_date, DATEDIFF(CURDATE(), COALESCE(last_donation_date, '1900-01-01')) AS days_since_last
FROM donors
WHERE is_active = TRUE AND DATEDIFF(CURDATE(), COALESCE(last_donation_date, '1900-01-01')) >= 56
ORDER BY last_donation_date ASC;

-- ============================================================================
-- END OF SQL SCRIPT
-- ============================================================================
-- Total Commands: 114 SQL operations organized by screen/function
-- All comments reference PowerPoint slide numbers for easy correlation
-- Password for testing: Test123! (Bcrypt hash provided above)
-- ============================================================================
