# BloodLink: SQL Demonstration & Explanation Guide

## Introduction
This guide demonstrates all SQL operations used in the BloodLink blood donation system. It shows real queries, explains their purpose, and demonstrates data relationships.

**Target Audience**: Database administrators, developers, stakeholders  
**Duration**: 40-50 minutes  
**Tool**: MySQL/PostgreSQL client

---

## PART 1: DATABASE SCHEMA OVERVIEW (5 minutes)

### Complete Database Schema with All Tables

```
┌─────────────────────────────────────────────────────────────────┐
│                      BloodLink Database                         │
└─────────────────────────────────────────────────────────────────┘

Core User Tables:
├── donors
├── hospital
└── staff

Operations Tables:
├── blood_inventory
├── donation_history
├── emergency_requests
└── event_participants

Management Tables:
├── events
├── donor_screenings
├── donor_notes
└── donor_communications

System Tables:
├── audit_log
└── donor_consent

Relationships:
donors ──→ donation_history ──→ blood_inventory
        ──→ event_participants ──→ events
        ──→ donor_screenings
        ──→ emergency_requests

staff ──→ manages all operations
hospital ──→ receives blood units
```

---

## PART 2: COMPLETE TABLE SCHEMAS (8 minutes)

### Table 1: donors
```sql
DESCRIBE donors;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
full_name           | VARCHAR(100)   | NO   |     |
email               | VARCHAR(100)   | NO   | UNI |
phone               | VARCHAR(20)    | YES  |     |
date_of_birth       | DATE           | NO   |     |
blood_type          | VARCHAR(5)     | NO   | MUL |
address             | VARCHAR(255)   | YES  |     |
city                | VARCHAR(50)    | YES  |     |
password_hash       | VARCHAR(255)   | NO   |     |
is_active           | BOOLEAN        | NO   |     | true
registration_date   | TIMESTAMP      | NO   |     | NOW()
last_donation_date  | DATE           | YES  |     |
```

**Purpose**: Stores all donor information and authentication  
**Indexes**: email (UNIQUE), blood_type (for queries), id (PRIMARY)  
**Key Fields**: email (login), password_hash (authentication), blood_type (inventory)

---

### Table 2: hospital
```sql
DESCRIBE hospital;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
hospital_name       | VARCHAR(100)   | NO   | UNI |
email               | VARCHAR(100)   | NO   | UNI |
phone               | VARCHAR(20)    | YES  |     |
address             | VARCHAR(255)   | YES  |     |
city                | VARCHAR(50)    | YES  |     |
state               | VARCHAR(50)    | YES  |     |
password_hash       | VARCHAR(255)   | NO   |     |
is_approved         | BOOLEAN        | NO   |     | false
is_active           | BOOLEAN        | NO   |     | true
registration_date   | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Stores hospital registration and approval status  
**Indexes**: email (UNIQUE), is_approved (for filtering)  
**Key Fields**: is_approved (controls blood access), hospital_name (identification)

---

### Table 3: staff
```sql
DESCRIBE staff;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
full_name           | VARCHAR(100)   | NO   |     |
email               | VARCHAR(100)   | NO   | UNI |
phone               | VARCHAR(20)    | YES  |     |
role                | VARCHAR(50)    | NO   |     | 'blood_bank_staff'
password_hash       | VARCHAR(255)   | NO   |     |
is_active           | BOOLEAN        | NO   |     | true
registration_date   | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Stores blood bank staff information  
**Indexes**: email (UNIQUE), role (for access control)  
**Key Fields**: role (determines permissions), is_active

---

### Table 4: blood_inventory
```sql
DESCRIBE blood_inventory;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
blood_type          | VARCHAR(5)     | NO   | MUL |
quantity_ml         | INT            | NO   |     |
collection_date     | DATE           | NO   | MUL |
collection_time     | TIME           | YES  |     |
donor_id            | INT            | YES  | FK  |
expiry_date         | DATE           | NO   | MUL |
status              | VARCHAR(20)    | NO   | MUL | 'available'
location            | VARCHAR(100)   | YES  |     |
notes               | TEXT           | YES  |     |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Tracks all blood units in inventory  
**Indexes**: blood_type (search), expiry_date (find expired), status (find available)  
**Key Fields**: status (available/transfused/expired), expiry_date (critical)

---

### Table 5: donation_history
```sql
DESCRIBE donation_history;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
donor_id            | INT            | NO   | FK  |
blood_type          | VARCHAR(5)     | NO   |     |
quantity_ml         | INT            | NO   |     |
donation_date       | DATE           | NO   | MUL |
collection_date     | DATE           | NO   |     |
collection_time     | TIME           | YES  |     |
status              | VARCHAR(20)    | NO   |     | 'completed'
event_id            | INT            | YES  | FK  |
staff_id            | INT            | YES  | FK  |
notes               | TEXT           | YES  |     |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Historical record of all donations  
**Indexes**: donor_id (donor history), donation_date (reports)  
**Key Fields**: status (completed/rejected), donor_id (links to donor)

---

### Table 6: events
```sql
DESCRIBE events;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
title               | VARCHAR(100)   | NO   |     |
date                | DATE           | NO   | MUL |
start_time          | TIME           | YES  |     |
end_time            | TIME           | YES  |     |
location            | VARCHAR(255)   | YES  |     |
expected_participants| INT           | NO   |     | 0
status              | VARCHAR(20)    | NO   | MUL | 'upcoming'
notes               | TEXT           | YES  |     |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Tracks blood donation events  
**Indexes**: date (find upcoming), status (filter)  
**Key Fields**: status (upcoming/ongoing/completed)

---

### Table 7: event_participants
```sql
DESCRIBE event_participants;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
event_id            | INT            | NO   | FK  |
donor_id            | INT            | NO   | FK  |
registration_date   | TIMESTAMP      | NO   |     | NOW()
status              | VARCHAR(20)    | NO   |     | 'registered'
donation_id         | INT            | YES  | FK  |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Links donors to events, tracks who donated at which event  
**Indexes**: event_id, donor_id (find duplicates)  
**Key Fields**: status (registered/completed/no-show), donation_id (links to actual donation)

---

### Table 8: emergency_requests
```sql
DESCRIBE emergency_requests;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
hospital_id         | INT            | NO   | FK  |
blood_type          | VARCHAR(5)     | NO   | MUL |
units_required      | INT            | NO   |     |
urgency_level       | VARCHAR(20)    | NO   | MUL |
patient_info        | VARCHAR(255)   | YES  |     |
request_date        | TIMESTAMP      | NO   |     | NOW()
status              | VARCHAR(20)    | NO   | MUL | 'pending'
fulfilled_date      | TIMESTAMP      | YES  |     |
units_provided      | INT            | YES  |     |
staff_id            | INT            | YES  | FK  |
notes               | TEXT           | YES  |     |
```

**Purpose**: Tracks emergency blood requests from hospitals  
**Indexes**: status (find pending), blood_type, urgency_level  
**Key Fields**: status (pending/fulfilled/cancelled), urgency_level (critical priority)

---

### Table 9: donor_screenings
```sql
DESCRIBE donor_screenings;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
donor_id            | INT            | NO   | FK  |
event_id            | INT            | YES  | FK  |
screening_date      | DATE           | NO   |     |
blood_pressure      | VARCHAR(10)    | YES  |     |
hemoglobin          | DECIMAL(5,2)   | YES  |     |
pulse               | INT            | YES  |     |
temperature         | DECIMAL(5,2)   | YES  |     |
weight              | DECIMAL(6,2)   | YES  |     |
screening_status    | VARCHAR(20)    | NO   |     | 'pending'
notes               | TEXT           | YES  |     |
staff_id            | INT            | YES  | FK  |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Medical screening records before donation  
**Indexes**: donor_id, screening_date  
**Key Fields**: screening_status (passed/failed/deferred)

---

### Table 10: donor_notes
```sql
DESCRIBE donor_notes;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
donor_id            | INT            | NO   | FK  |
staff_id            | INT            | YES  | FK  |
note_type           | VARCHAR(50)    | NO   |     |
content             | TEXT           | NO   |     |
note_date           | DATE           | NO   |     |
created_at          | TIMESTAMP      | NO   |     | NOW()
```

**Purpose**: Staff notes about donors for continuity of care  
**Indexes**: donor_id  
**Key Fields**: note_type (medical/general/behavioral)

---

### Table 11: donor_communications
```sql
DESCRIBE donor_communications;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
donor_id            | INT            | NO   | FK  |
sent_by_staff_id    | INT            | YES  | FK  |
communication_type  | VARCHAR(50)    | NO   |     | 'email'
subject             | VARCHAR(255)   | YES  |     |
message             | TEXT           | NO   |     |
sent_date           | TIMESTAMP      | NO   |     | NOW()
read_date           | TIMESTAMP      | YES  |     |
```

**Purpose**: Track all communications sent to donors  
**Indexes**: donor_id, sent_date  
**Key Fields**: communication_type (email/sms/notification)

---

### Table 12: donor_consent
```sql
DESCRIBE donor_consent;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
donor_id            | INT            | NO   | FK  |
consent_type        | VARCHAR(100)   | NO   |     |
status              | BOOLEAN        | NO   |     |
consent_date        | TIMESTAMP      | NO   |     | NOW()
expiry_date         | DATE           | YES  |     |
notes               | TEXT           | YES  |     |
```

**Purpose**: GDPR/HIPAA compliance - tracks donor consent  
**Indexes**: donor_id, consent_type  
**Key Fields**: status (opt-in/opt-out), expiry_date (review consent)

---

### Table 13: audit_log
```sql
DESCRIBE audit_log;

Field               | Type           | Null | Key | Default
--------------------|---------------|------|-----|----------
id                  | INT            | NO   | PRI | AUTO_INC
table_name          | VARCHAR(50)    | NO   | MUL |
record_id           | INT            | YES  |     |
action              | VARCHAR(20)    | NO   | MUL |
user_type           | VARCHAR(20)    | YES  |     |
user_id             | INT            | YES  |     |
changes             | TEXT           | YES  |     |
timestamp           | TIMESTAMP      | NO   | MUL | NOW()
ip_address          | VARCHAR(45)    | YES  |     |
```

**Purpose**: Complete audit trail for compliance and debugging  
**Indexes**: timestamp (find operations in time period), table_name, action  
**Key Fields**: user_type (donor/staff/hospital), action (INSERT/UPDATE/DELETE/SELECT)

---

## PART 3: BASIC CRUD OPERATIONS (8 minutes)

### 3.1 CREATE (INSERT) Operations

#### A. Register New Donor
```sql
INSERT INTO donors (
  full_name,
  email,
  phone,
  date_of_birth,
  blood_type,
  address,
  city,
  password_hash,
  registration_date
) VALUES (
  'Sarah Johnson',
  'sarah.johnson@email.com',
  '+1 (555) 234-5678',
  '1995-06-15',
  'O+',
  '123 Main Street',
  'Springfield',
  '$2b$10$[bcryptjs_hashed_password]',
  NOW()
);

-- Result: New donor ID 47 is auto-generated
-- Check: SELECT LAST_INSERT_ID(); → 47
```

**Explanation**:
- Email must be unique (database constraint)
- Password is bcrypt hashed (never plain text)
- All required fields must be provided
- registration_date defaults to NOW()

---

#### B. Record Blood Donation
```sql
-- Step 1: Insert donation record
INSERT INTO donation_history (
  donor_id,
  blood_type,
  quantity_ml,
  donation_date,
  collection_date,
  collection_time,
  status,
  event_id,
  staff_id,
  notes
) VALUES (
  47,
  'O+',
  450,
  '2026-02-25',
  '2026-02-25',
  '14:30:00',
  'completed',
  1,
  5,
  'First-time donor. Excellent donation.'
);

-- New donation ID: 523

-- Step 2: Create blood unit inventory record
INSERT INTO blood_inventory (
  blood_type,
  quantity_ml,
  collection_date,
  collection_time,
  donor_id,
  expiry_date,
  status,
  location,
  notes
) VALUES (
  'O+',
  450,
  '2026-02-25',
  '14:30:00',
  47,
  DATE_ADD('2026-02-25', INTERVAL 42 DAY),  -- Expires Mar 8
  'available',
  'Blood Bank Storage - Refrigerator 1',
  'From downtown blood drive'
);

-- New unit ID: 1847
-- Unit ID formatted as: BLOOD_TYPE-ID = O+-1847
```

**Explanation**:
- Donation and inventory are separate records
- Expiry date calculated (42 days for whole blood)
- Status set to 'available' for immediate use
- Location tracks where blood is stored

---

#### C. Register Donor for Event
```sql
INSERT INTO event_participants (
  event_id,
  donor_id,
  registration_date,
  status
) VALUES (
  1,
  47,
  NOW(),
  'registered'
);

-- New participation ID: 892

-- Also increment event's participant count
UPDATE events 
SET expected_participants = expected_participants + 1 
WHERE id = 1;
```

**Explanation**:
- Links donor to event in many-to-many relationship
- Status progresses: registered → completed or no-show
- expected_participants automatically increments

---

### 3.2 READ (SELECT) Operations

#### A. Authenticate Donor Login
```sql
-- Step 1: Find donor by email
SELECT id, email, password_hash, full_name, blood_type 
FROM donors 
WHERE email = 'sarah.johnson@email.com' 
  AND is_active = true;

-- Result:
-- id | email                     | password_hash | full_name    | blood_type
-- 47 | sarah.johnson@email.com   | $2b$10$...    | Sarah Johnson| O+

-- Step 2: Compare input password with stored hash using bcryptjs
-- bcryptjs.compare('SecurePass123!', storedHash) → true/false

-- Step 3: Generate JWT token if match
-- token = jwt.sign(
--   { donorId: 47, email: 'sarah.johnson@email.com', userType: 'donor' },
--   JWT_SECRET,
--   { expiresIn: '24h' }
-- )
```

**Explanation**:
- Email lookup is fast (indexed)
- is_active = true ensures account not suspended
- Password verified in application code (not in SQL)
- JWT token created with donor ID and type

---

#### B. View Donor Dashboard Data
```sql
-- Get donor basic info
SELECT id, full_name, blood_type, last_donation_date, is_active 
FROM donors 
WHERE id = 47;

-- Count total donations
SELECT COUNT(*) as total_donations 
FROM donation_history 
WHERE donor_id = 47 
  AND status = 'completed';

-- Get total volume donated
SELECT COALESCE(SUM(quantity_ml), 0) as total_ml 
FROM donation_history 
WHERE donor_id = 47 
  AND status = 'completed';

-- Calculate eligibility
SELECT 
  CASE 
    WHEN last_donation_date IS NULL THEN 'Eligible'
    WHEN DATEDIFF(NOW(), last_donation_date) >= 90 THEN 'Eligible'
    ELSE CONCAT('Wait ', 90 - DATEDIFF(NOW(), last_donation_date), ' days')
  END as eligibility_status,
  CASE 
    WHEN last_donation_date IS NULL THEN 0
    ELSE DATEDIFF(NOW(), last_donation_date)
  END as days_since_donation
FROM donors 
WHERE id = 47;

-- Get recent donations (last 5)
SELECT 
  dh.id,
  dh.donation_date,
  dh.quantity_ml,
  e.location,
  dh.status
FROM donation_history dh
LEFT JOIN events e ON dh.event_id = e.id
WHERE dh.donor_id = 47 
  AND dh.status = 'completed'
ORDER BY dh.donation_date DESC 
LIMIT 5;
```

**Key Concepts**:
- COALESCE handles NULL values (first donation)
- DATEDIFF calculates days between dates
- LEFT JOIN allows showing donations without events
- ORDER BY DESC gets newest first
- LIMIT 5 restricts result size

---

#### C. View Available Blood Inventory
```sql
-- Get all available O+ units
SELECT 
  id,
  blood_type,
  quantity_ml,
  collection_date,
  expiry_date,
  status,
  location
FROM blood_inventory
WHERE blood_type = 'O+' 
  AND status = 'available'
  AND expiry_date > NOW()
ORDER BY collection_date ASC;

-- Result Example:
-- id   | blood_type | quantity_ml | collection_date | expiry_date | status    | location
-- 1847 | O+         | 450         | 2026-02-25      | 2026-03-08  | available | Refrigerator 1
-- 1846 | O+         | 450         | 2026-02-24      | 2026-03-09  | available | Refrigerator 1
```

**Key Concepts**:
- WHERE filters on multiple conditions
- expiry_date > NOW() ensures non-expired units
- status = 'available' excludes transfused/expired
- ORDER BY ASC ensures FIFO (first in, first out)

---

#### D. Find Eligible Donors for Event
```sql
-- Find all O+ donors who are eligible to donate
SELECT 
  d.id,
  d.full_name,
  d.email,
  d.blood_type,
  d.last_donation_date,
  CASE 
    WHEN d.last_donation_date IS NULL THEN 'First-time'
    WHEN DATEDIFF(NOW(), d.last_donation_date) >= 90 THEN 'Eligible'
    ELSE 'Ineligible'
  END as eligibility
FROM donors d
WHERE d.blood_type = 'O+'
  AND d.is_active = true
  AND (d.last_donation_date IS NULL 
       OR DATEDIFF(NOW(), d.last_donation_date) >= 90)
ORDER BY d.registration_date DESC;

-- Result: 234 O+ donors eligible
```

**Key Concepts**:
- Multiple AND/OR conditions filter data
- NULL check handles first-time donors
- CASE statement creates calculated field
- ORDER BY registration_date gets newest donors

---

### 3.3 UPDATE Operations

#### A. Update Donor's Last Donation Date
```sql
UPDATE donors 
SET last_donation_date = '2026-02-25'
WHERE id = 47;

-- Verification:
SELECT id, full_name, last_donation_date 
FROM donors 
WHERE id = 47;
-- Result: 47, Sarah Johnson, 2026-02-25
```

**Explanation**:
- Critical for eligibility calculations
- Set after successful donation recording
- WHERE clause specifies which donor

---

#### B. Mark Blood Unit as Transfused
```sql
UPDATE blood_inventory 
SET status = 'transfused',
    notes = CONCAT(notes, ' | Transfused on 2026-02-28 to hospital')
WHERE id = 1847;

-- Verify update:
SELECT id, status, notes 
FROM blood_inventory 
WHERE id = 1847;
```

**Explanation**:
- Changes status from 'available' to 'transfused'
- CONCAT appends notes (don't lose history)
- Tracks when and where blood was used

---

#### C. Fulfill Emergency Request
```sql
UPDATE emergency_requests 
SET status = 'fulfilled',
    fulfilled_date = NOW(),
    units_provided = 3,
    staff_id = 5,
    notes = 'Emergency fulfilled - 3 units O+ provided'
WHERE id = 12;

-- Verify:
SELECT 
  id, 
  status, 
  units_required,
  units_provided,
  fulfilled_date
FROM emergency_requests 
WHERE id = 12;
```

**Explanation**:
- Multiple columns updated simultaneously
- fulfilled_date logs when request was fulfilled
- units_provided may differ from units_required
- staff_id tracks who fulfilled the request

---

### 3.4 DELETE Operations

**Important**: BloodLink uses soft deletes (is_active = false) instead of hard deletes for audit trail

```sql
-- Soft delete (deactivate donor)
UPDATE donors 
SET is_active = false
WHERE id = 47;

-- Verify soft delete:
SELECT id, full_name, is_active 
FROM donors 
WHERE id = 47;
-- Result: 47, Sarah Johnson, false (still in database)

-- Query excludes inactive donors:
SELECT * FROM donors WHERE is_active = true;
-- Sarah's record not returned (but data preserved)

-- NEVER do hard delete - breaks audit trail:
-- DELETE FROM donors WHERE id = 47;  ← DON'T DO THIS!
```

**Explanation**:
- Soft delete keeps historical records
- is_active = false hides from normal queries
- Data preserved for audit and compliance
- Hard delete would break foreign key relationships

---

## PART 4: COMPLEX QUERIES & JOINS (12 minutes)

### 4.1 Multi-Table Joins

#### A. Get Donor's Complete Donation History with Details
```sql
-- Show all donations with event and staff information
SELECT 
  dh.id as donation_id,
  d.full_name as donor_name,
  d.blood_type,
  dh.quantity_ml,
  dh.donation_date,
  e.title as event_name,
  e.location,
  s.full_name as staff_member,
  dh.status
FROM donation_history dh
JOIN donors d ON dh.donor_id = d.id
LEFT JOIN events e ON dh.event_id = e.id
LEFT JOIN staff s ON dh.staff_id = s.id
WHERE dh.donor_id = 47
ORDER BY dh.donation_date DESC;

-- Result:
-- donation_id | donor_name    | blood_type | quantity_ml | donation_date | event_name           | location        | staff_member | status
-- 523         | Sarah Johnson | O+         | 450         | 2026-02-25    | Downtown Blood Drive | City Center Park| John Smith   | completed
```

**Key Concepts**:
- JOIN: Returns rows where both tables match (required)
- LEFT JOIN: Returns all left table rows even if no match (e.g., donation without event)
- Multiple JOINs connect related data from 4 tables
- ORDER BY donation_date DESC gets newest first

---

#### B. Track Blood Unit from Donor to Hospital
```sql
-- Complete traceability: Donor → Donation → Unit → Hospital
SELECT 
  d.full_name as donor,
  d.blood_type,
  dh.donation_date,
  bi.id as unit_id,
  bi.expiry_date,
  bi.status,
  bi.location,
  h.hospital_name,
  er.patient_info
FROM blood_inventory bi
JOIN donors d ON bi.donor_id = d.id
JOIN donation_history dh ON dh.id = bi.id
LEFT JOIN emergency_requests er ON er.id = bi.id
LEFT JOIN hospital h ON er.hospital_id = h.id
WHERE bi.id = 1847;

-- Result: Complete traceability from donor to patient
```

**Explanation**:
- Bloodchain traceability: critical for safety
- Shows where unit came from and where it went
- Multiple JOINs for complete story

---

#### C. List All Event Participants with Their Donation Status
```sql
-- Show who registered for event and if they actually donated
SELECT 
  ep.id as participation_id,
  d.full_name,
  d.blood_type,
  e.title as event_name,
  e.date as event_date,
  ep.registration_date,
  ep.status as participation_status,
  dh.id as donation_id,
  dh.quantity_ml,
  dh.donation_date,
  CASE 
    WHEN dh.id IS NOT NULL THEN 'Donated'
    ELSE 'No donation recorded'
  END as result
FROM event_participants ep
JOIN donors d ON ep.donor_id = d.id
JOIN events e ON ep.event_id = e.id
LEFT JOIN donation_history dh ON ep.donation_id = dh.id
WHERE e.id = 1
ORDER BY d.full_name ASC;

-- Result shows registered vs actual donors
```

**Key Concepts**:
- CASE statement with NULL check (shows who didn't donate)
- Shows gap between registration and actual participation
- Helps identify no-shows

---

### 4.2 Aggregation Queries (GROUP BY)

#### A. Count Donations by Blood Type
```sql
-- How many units of each blood type in inventory?
SELECT 
  blood_type,
  COUNT(*) as unit_count,
  SUM(quantity_ml) as total_ml,
  MIN(expiry_date) as earliest_expiry,
  MAX(expiry_date) as latest_expiry
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY total_ml DESC;

-- Result:
-- blood_type | unit_count | total_ml | earliest_expiry | latest_expiry
-- O+         | 16         | 7200     | 2026-02-26      | 2026-03-09
-- A+         | 12         | 5400     | 2026-02-27      | 2026-03-10
-- B+         | 10         | 4500     | 2026-02-28      | 2026-03-08
-- ...
```

**Key Concepts**:
- GROUP BY aggregates data by blood_type
- COUNT(*) counts units
- SUM(quantity_ml) totals volume
- MIN/MAX show expiry range
- ORDER BY DESC prioritizes urgent needs

---

#### B. Donor Statistics Summary
```sql
-- How active are donors overall?
SELECT 
  COUNT(DISTINCT d.id) as total_donors,
  COUNT(DISTINCT dh.id) as total_donations,
  SUM(dh.quantity_ml) as total_ml_collected,
  AVG(dh.quantity_ml) as avg_per_donation,
  COUNT(DISTINCT dh.donor_id) as donors_who_donated,
  ROUND(COUNT(DISTINCT dh.donor_id) / COUNT(DISTINCT d.id) * 100, 2) as donation_rate_pct
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id AND dh.status = 'completed'
WHERE d.is_active = true;

-- Result:
-- total_donors | total_donations | total_ml | avg_per_donation | donors_who_donated | donation_rate
-- 847          | 2341            | 1053450  | 450              | 589                | 69.54%
```

**Key Concepts**:
- DISTINCT counts unique donors once
- SUM/AVG for calculations
- LEFT JOIN includes all donors even those without donations
- ROUND for cleaner percentages

---

#### C. Top Donors (Most Donations)
```sql
-- Which donors have given the most?
SELECT 
  d.id,
  d.full_name,
  d.blood_type,
  COUNT(dh.id) as donation_count,
  SUM(dh.quantity_ml) as total_ml,
  MAX(dh.donation_date) as last_donation_date
FROM donors d
JOIN donation_history dh ON d.id = dh.donor_id
WHERE dh.status = 'completed'
GROUP BY d.id, d.full_name, d.blood_type
HAVING COUNT(dh.id) >= 5  -- Only donors with 5+ donations
ORDER BY COUNT(dh.id) DESC
LIMIT 10;

-- Result: Top 10 super donors
```

**Key Concepts**:
- GROUP BY groups by donor
- HAVING filters groups (like WHERE for groups)
- COUNT(dh.id) counts donations per donor
- LIMIT 10 shows top 10
- ORDER BY DESC most to least

---

### 4.3 Advanced Queries with Subqueries

#### A. Find Blood Units Needed vs Available
```sql
-- What blood types are critical shortage?
SELECT 
  'O+' as blood_type,
  (SELECT SUM(units_required) 
   FROM emergency_requests 
   WHERE blood_type = 'O+' AND status = 'pending') as units_needed,
  (SELECT COUNT(*) 
   FROM blood_inventory 
   WHERE blood_type = 'O+' AND status = 'available') as units_available,
  CASE 
    WHEN (SELECT COUNT(*) FROM blood_inventory 
          WHERE blood_type = 'O+' AND status = 'available') 
         < (SELECT SUM(units_required) 
            FROM emergency_requests 
            WHERE blood_type = 'O+' AND status = 'pending')
    THEN 'CRITICAL SHORTAGE'
    WHEN (SELECT COUNT(*) FROM blood_inventory 
          WHERE blood_type = 'O+' AND status = 'available') = 0
    THEN 'OUT OF STOCK'
    ELSE 'ADEQUATE'
  END as status

UNION ALL

SELECT 'A+', ... -- Repeat for other blood types
SELECT 'B+', ...
SELECT 'AB+', ...
SELECT 'O-', ...
SELECT 'A-', ...
SELECT 'B-', ...
SELECT 'AB-', ...;
```

**Key Concepts**:
- Subqueries in SELECT clause
- CASE for conditional logic
- UNION ALL combines results
- Shows critical shortages at a glance

---

#### B. Donors Ready for Next Donation
```sql
-- Who is eligible to donate today?
SELECT 
  d.id,
  d.full_name,
  d.blood_type,
  d.last_donation_date,
  DATEDIFF(NOW(), d.last_donation_date) as days_since,
  CASE 
    WHEN d.last_donation_date IS NULL THEN 'First-time donor'
    WHEN DATEDIFF(NOW(), d.last_donation_date) >= 90 THEN 'ELIGIBLE NOW'
    ELSE CONCAT('In ', 90 - DATEDIFF(NOW(), d.last_donation_date), ' days')
  END as eligibility
FROM donors d
WHERE d.is_active = true
  AND d.last_donation_date IS NULL
  OR DATEDIFF(NOW(), d.last_donation_date) >= 90
ORDER BY d.registration_date DESC;
```

**Key Concepts**:
- NULL check for first-time donors
- DATEDIFF for time calculations
- WHERE with OR logic
- Prioritizes newly eligible donors

---

## PART 5: TRANSACTIONS (6 minutes)

### Complete Donation Recording Transaction

```sql
-- THIS IS A TRANSACTION: All or nothing

START TRANSACTION;

-- Step 1: Record the donation
INSERT INTO donation_history (
  donor_id, blood_type, quantity_ml, donation_date, 
  collection_date, collection_time, status, event_id, staff_id
) VALUES (47, 'O+', 450, NOW(), NOW(), TIME(NOW()), 'completed', 1, 5);

SET @donation_id = LAST_INSERT_ID();

-- Step 2: Create blood unit in inventory
INSERT INTO blood_inventory (
  blood_type, quantity_ml, collection_date, collection_time, 
  donor_id, expiry_date, status, location, notes
) VALUES ('O+', 450, NOW(), TIME(NOW()), 47, 
  DATE_ADD(NOW(), INTERVAL 42 DAY), 'available', 'Refrigerator 1', 'From donor');

SET @unit_id = LAST_INSERT_ID();

-- Step 3: Update donor's last donation date
UPDATE donors 
SET last_donation_date = NOW() 
WHERE id = 47;

-- Step 4: Update event participant status
UPDATE event_participants 
SET status = 'completed', donation_id = @donation_id
WHERE donor_id = 47 AND event_id = 1;

-- Step 5: Log the operation
INSERT INTO audit_log (
  table_name, record_id, action, user_type, user_id, changes
) VALUES 
  ('donation_history', @donation_id, 'INSERT', 'staff', 5, 'Donation recorded'),
  ('blood_inventory', @unit_id, 'INSERT', 'staff', 5, 'Blood unit created'),
  ('donors', 47, 'UPDATE', 'staff', 5, 'Last donation updated');

-- If all steps succeed:
COMMIT;

-- If any step fails:
ROLLBACK;  -- Reverts ALL changes
```

**Transaction Benefits**:
- All-or-nothing: Either complete donation or none
- Prevents partial data
- If blood unit creation fails, donation not recorded
- ROLLBACK cleans up if any step fails
- Ensures data consistency

---

### Emergency Request Fulfillment Transaction

```sql
START TRANSACTION;

-- Step 1: Check if units available
IF (SELECT COUNT(*) FROM blood_inventory 
    WHERE blood_type = 'O+' AND status = 'available') >= 3
THEN
  -- Step 2: Mark units as allocated
  UPDATE blood_inventory 
  SET status = 'allocated'
  WHERE id IN (
    SELECT id FROM blood_inventory 
    WHERE blood_type = 'O+' AND status = 'available'
    ORDER BY expiry_date ASC
    LIMIT 3
  );
  
  -- Step 3: Update emergency request
  UPDATE emergency_requests 
  SET status = 'fulfilled',
      fulfilled_date = NOW(),
      units_provided = 3,
      staff_id = 5
  WHERE id = 12;
  
  -- Step 4: Log the operation
  INSERT INTO audit_log (table_name, action, changes)
  VALUES ('emergency_requests', 'UPDATE', 'Request fulfilled with 3 units');
  
  COMMIT;
ELSE
  -- Insufficient units
  ROLLBACK;
END IF;
```

**Key Concepts**:
- Checks availability before allocation
- Reserves oldest units first (FIFO)
- Updates request status atomically
- ROLLBACK if insufficient inventory

---

## PART 6: INDEXING & PERFORMANCE (5 minutes)

### Current Indexes

```sql
-- Check existing indexes
SHOW INDEXES FROM donors;
SHOW INDEXES FROM blood_inventory;
SHOW INDEXES FROM donation_history;

-- Key indexes for performance:
ANALYZE TABLE donors;
ANALYZE TABLE blood_inventory;
ANALYZE TABLE donation_history;
```

### Recommended Indexes

```sql
-- Speed up donor lookup by email (login)
CREATE UNIQUE INDEX idx_donors_email ON donors(email);

-- Speed up inventory searches
CREATE INDEX idx_inventory_blood_type ON blood_inventory(blood_type);
CREATE INDEX idx_inventory_status ON blood_inventory(status);
CREATE INDEX idx_inventory_expiry ON blood_inventory(expiry_date);

-- Speed up donation history queries
CREATE INDEX idx_donation_donor_id ON donation_history(donor_id);
CREATE INDEX idx_donation_date ON donation_history(donation_date);

-- Speed up emergency request queries
CREATE INDEX idx_emergency_status ON emergency_requests(status);
CREATE INDEX idx_emergency_blood_type ON emergency_requests(blood_type);

-- Speed up event participant queries
CREATE INDEX idx_event_part_event ON event_participants(event_id);
CREATE INDEX idx_event_part_donor ON event_participants(donor_id);

-- Speed up audit log queries
CREATE INDEX idx_audit_timestamp ON audit_log(timestamp);
CREATE INDEX idx_audit_table ON audit_log(table_name);
```

### Query Optimization

```sql
-- EXPLAIN shows how query is executed
EXPLAIN SELECT * FROM donors WHERE email = 'sarah@email.com';

-- Result shows if index is used:
-- Using index: Yes (fast)
-- Full table scan: No index used (slow)

-- Before optimization:
EXPLAIN SELECT d.full_name FROM donors d 
WHERE d.blood_type = 'O+' AND d.is_active = true;
-- Without index: slow

-- After creating index:
CREATE INDEX idx_donors_blood_active ON donors(blood_type, is_active);

-- Now same query is fast:
EXPLAIN SELECT d.full_name FROM donors d 
WHERE d.blood_type = 'O+' AND d.is_active = true;
-- Using index: Yes (fast)
```

---

## PART 7: REAL-WORLD SCENARIOS (10 minutes)

### Scenario 1: Process Emergency Blood Request

```sql
-- Hospital emergency: "Need 3 units O+ immediately!"

-- Step 1: Check emergency request
SELECT * FROM emergency_requests 
WHERE status = 'pending' AND blood_type = 'O+' 
ORDER BY urgency_level DESC, request_date ASC 
LIMIT 1;

-- Result: Request ID 47, needs 3 units, CRITICAL urgency

-- Step 2: Check available inventory
SELECT id, collection_date, expiry_date 
FROM blood_inventory 
WHERE blood_type = 'O+' AND status = 'available'
ORDER BY expiry_date ASC 
LIMIT 3;

-- Result: Units 1847, 1846, 1845 available (use oldest first)

-- Step 3: Execute fulfillment transaction
START TRANSACTION;

UPDATE blood_inventory 
SET status = 'in_transit'
WHERE id IN (1847, 1846, 1845);

UPDATE emergency_requests 
SET status = 'fulfilled',
    fulfilled_date = NOW(),
    units_provided = 3,
    staff_id = 5,
    notes = 'Critical emergency fulfilled - units dispatched'
WHERE id = 47;

INSERT INTO audit_log (table_name, action, changes)
VALUES ('emergency_requests', 'UPDATE', 'CRITICAL: 3 O+ units sent to hospital');

COMMIT;

-- Step 4: Verify fulfillment
SELECT status, fulfilled_date, units_provided 
FROM emergency_requests WHERE id = 47;
-- Result: fulfilled, 2026-02-25 15:30:00, 3
```

---

### Scenario 2: Prepare for Blood Drive Event

```sql
-- Planning for "Downtown Blood Drive" event on Feb 25

-- Step 1: Get event details
SELECT * FROM events WHERE id = 1;
-- Result: 51 registered donors expected

-- Step 2: Check how many usually show up
SELECT 
  e.id,
  e.title,
  COUNT(ep.id) as registered,
  COUNT(CASE WHEN ep.status = 'completed' THEN 1 END) as actually_donated,
  ROUND(COUNT(CASE WHEN ep.status = 'completed' THEN 1 END) / 
    COUNT(ep.id) * 100, 1) as show_up_rate
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
WHERE e.id = 1
GROUP BY e.id, e.title;

-- Result: 51 registered, ~45 expected to show (88% show-up rate)

-- Step 3: Check blood type needs
SELECT 
  d.blood_type,
  COUNT(*) as expected_donors
FROM event_participants ep
JOIN donors d ON ep.donor_id = d.id
WHERE ep.event_id = 1 AND ep.status = 'registered'
GROUP BY d.blood_type
ORDER BY COUNT(*) DESC;

-- Result shows expected blood type distribution
-- O+: 15, A+: 12, B+: 10, etc.

-- Step 4: Check current inventory
SELECT 
  blood_type,
  COUNT(*) as units_available,
  SUM(quantity_ml) as ml_available
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY blood_type;

-- Decision: If O+ units low, prioritize recruiting O+ donors
```

---

### Scenario 3: Generate Monthly Compliance Report

```sql
-- Requirements: Track all operations for audit

-- Donations recorded this month
SELECT 
  COUNT(*) as total_donations,
  SUM(quantity_ml) as total_ml,
  COUNT(DISTINCT donor_id) as unique_donors,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed,
  COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
FROM donation_history
WHERE MONTH(donation_date) = 02 AND YEAR(donation_date) = 2026;

-- All blood inventory movements
SELECT 
  COUNT(*) as total_units_handled,
  COUNT(CASE WHEN status = 'available' THEN 1 END) as available,
  COUNT(CASE WHEN status = 'transfused' THEN 1 END) as transfused,
  COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired,
  COUNT(CASE WHEN status = 'discarded' THEN 1 END) as discarded
FROM blood_inventory
WHERE MONTH(collection_date) = 02 AND YEAR(collection_date) = 2026;

-- All audit log entries
SELECT 
  action,
  COUNT(*) as count
FROM audit_log
WHERE MONTH(timestamp) = 02 AND YEAR(timestamp) = 2026
GROUP BY action;

-- Result: All INSERT/UPDATE/DELETE operations tracked

-- Staff activities
SELECT 
  s.full_name,
  COUNT(DISTINCT al.id) as operations,
  COUNT(CASE WHEN al.action = 'INSERT' THEN 1 END) as inserts,
  COUNT(CASE WHEN al.action = 'UPDATE' THEN 1 END) as updates
FROM staff s
LEFT JOIN audit_log al ON s.id = al.user_id
WHERE MONTH(al.timestamp) = 02 AND YEAR(al.timestamp) = 2026
GROUP BY s.id, s.full_name
ORDER BY COUNT(DISTINCT al.id) DESC;
```

---

## PART 8: TROUBLESHOOTING QUERIES (5 minutes)

### Common Issues & Diagnostic Queries

#### Issue 1: Unit ID is showing as NULL

```sql
-- Check if blood_inventory table has id values
SELECT id, blood_type, quantity_ml, donor_id 
FROM blood_inventory 
WHERE id IS NULL;

-- Should return empty result (all units should have IDs)
-- If returns rows, there's a data integrity issue

-- Fix: Ensure id is PRIMARY KEY AUTO_INCREMENT
ALTER TABLE blood_inventory 
MODIFY id INT NOT NULL AUTO_INCREMENT PRIMARY KEY;
```

#### Issue 2: Donor showing as expired when not eligible yet

```sql
-- Check last donation date calculation
SELECT 
  full_name,
  last_donation_date,
  NOW() as current_date,
  DATEDIFF(NOW(), last_donation_date) as days_since,
  CASE 
    WHEN DATEDIFF(NOW(), last_donation_date) >= 90 THEN 'Eligible'
    ELSE 'Not yet'
  END as status
FROM donors
WHERE id = 47;

-- Verify the math is correct
-- If issue found, check last_donation_date is correctly set
```

#### Issue 3: Inventory count doesn't match blood units

```sql
-- Count by blood type
SELECT 
  blood_type,
  COUNT(*) as count,
  SUM(quantity_ml) as total_ml
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type;

-- Compare with reports
-- If mismatch, check for orphaned records or incorrect status updates
```

#### Issue 4: Audit log missing entries

```sql
-- Check if audit log is being populated
SELECT 
  COUNT(*) as total_entries,
  COUNT(DISTINCT table_name) as tables_tracked,
  MAX(timestamp) as last_entry_time
FROM audit_log;

-- Check recent entries
SELECT * FROM audit_log 
ORDER BY timestamp DESC 
LIMIT 10;

-- If missing, ensure triggers are active
SHOW TRIGGERS;
```

#### Issue 5: Emergency request stuck in pending

```sql
-- Find pending requests
SELECT * FROM emergency_requests 
WHERE status = 'pending';

-- Check if inventory exists for request
SELECT COUNT(*) as available_units 
FROM blood_inventory 
WHERE blood_type = 'O+' AND status = 'available'
  AND expiry_date > NOW();

-- If units available but request not fulfilled, check staff notes
SELECT notes FROM emergency_requests WHERE id = 47;
```

---

## PART 9: OPTIMIZATION TIPS (3 minutes)

### Performance Best Practices

```sql
-- BAD: Full table scan
SELECT * FROM donors WHERE blood_type = 'O+';
-- No index, reads all rows

-- GOOD: Use indexed column
SELECT id, full_name, email FROM donors WHERE blood_type = 'O+';
-- Uses index, only reads matching rows, fewer columns

-- BAD: Multiple separate queries
SELECT blood_type FROM donors WHERE id = 47;  -- Query 1
SELECT donation_history FROM donation_history WHERE donor_id = 47;  -- Query 2
SELECT donation_date FROM donation_history WHERE donor_id = 47;  -- Query 3

-- GOOD: Single join query
SELECT d.blood_type, dh.id, dh.donation_date
FROM donors d
JOIN donation_history dh ON d.id = dh.donor_id
WHERE d.id = 47;  -- 1 query instead of 3

-- BAD: Function on WHERE clause (no index use)
SELECT * FROM donors WHERE YEAR(registration_date) = 2026;
-- Can't use index on registration_date

-- GOOD: Date range instead
SELECT * FROM donors 
WHERE registration_date >= '2026-01-01' 
  AND registration_date < '2027-01-01';
-- Can use date index

-- BAD: OR with different columns (slow)
SELECT * FROM donors 
WHERE full_name LIKE '%Sarah%' 
  OR email LIKE '%sarah%'
  OR phone LIKE '%5678%';

-- GOOD: Separate queries if possible
SELECT * FROM donors WHERE email = 'sarah@email.com';  -- Use email index
```

---

## SQL Quick Reference

### Most Important Patterns

```sql
-- Authentication
SELECT * FROM [user_table] 
WHERE email = ? AND is_active = true;

-- Eligibility check
SELECT CASE 
  WHEN last_donation_date IS NULL THEN 'Eligible'
  WHEN DATEDIFF(NOW(), last_donation_date) >= 90 THEN 'Eligible'
  ELSE 'Not yet'
END;

-- Inventory availability
SELECT * FROM blood_inventory 
WHERE blood_type = ? AND status = 'available' 
  AND expiry_date > NOW();

-- Event participant count
SELECT COUNT(*) FROM event_participants 
WHERE event_id = ? AND status = 'registered';

-- Donation history
SELECT * FROM donation_history 
WHERE donor_id = ? 
ORDER BY donation_date DESC;

-- Audit trail
SELECT * FROM audit_log 
WHERE table_name = ? AND record_id = ? 
ORDER BY timestamp DESC;

-- Emergency response
SELECT * FROM blood_inventory 
WHERE blood_type = ? AND status = 'available' 
ORDER BY expiry_date ASC LIMIT ?;
```

---

## Practice Exercises

1. **Find all donors who are eligible to donate in the next 7 days**
   ```sql
   -- Your query here
   ```

2. **Calculate wastage rate (expired units / total collected)**
   ```sql
   -- Your query here
   ```

3. **List top 5 blood types by current inventory**
   ```sql
   -- Your query here
   ```

4. **Find emergency requests that couldn't be fulfilled due to shortage**
   ```sql
   -- Your query here
   ```

5. **Create a transaction to record a donation AND update inventory atomically**
   ```sql
   -- Your transaction here
   ```

---

## Answers to Practice Exercises

### Exercise 1: Donors eligible in next 7 days
```sql
SELECT 
  d.id,
  d.full_name,
  d.blood_type,
  DATE_ADD(d.last_donation_date, INTERVAL 90 DAY) as eligible_date,
  DATEDIFF(DATE_ADD(d.last_donation_date, INTERVAL 90 DAY), NOW()) as days_to_eligible
FROM donors d
WHERE d.is_active = true
  AND d.last_donation_date IS NOT NULL
  AND DATEDIFF(DATE_ADD(d.last_donation_date, INTERVAL 90 DAY), NOW()) <= 7
ORDER BY eligible_date ASC;
```

### Exercise 2: Calculate wastage rate
```sql
SELECT 
  COUNT(CASE WHEN status = 'expired' THEN 1 END) as expired_units,
  COUNT(*) as total_units,
  ROUND(COUNT(CASE WHEN status = 'expired' THEN 1 END) / COUNT(*) * 100, 2) as wastage_rate_pct
FROM blood_inventory
WHERE MONTH(collection_date) = 02;
```

### Exercise 3: Top 5 blood types by inventory
```sql
SELECT 
  blood_type,
  COUNT(*) as unit_count,
  SUM(quantity_ml) as total_ml
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY total_ml DESC
LIMIT 5;
```

### Exercise 4: Unfulfilled emergency requests due to shortage
```sql
SELECT 
  er.id,
  er.blood_type,
  er.units_required,
  (SELECT COUNT(*) FROM blood_inventory 
   WHERE blood_type = er.blood_type AND status = 'available') as units_available,
  er.urgency_level
FROM emergency_requests er
WHERE er.status = 'pending'
  AND (SELECT COUNT(*) FROM blood_inventory 
       WHERE blood_type = er.blood_type AND status = 'available') < er.units_required;
```

### Exercise 5: Atomic donation transaction
```sql
START TRANSACTION;

INSERT INTO donation_history (donor_id, blood_type, quantity_ml, donation_date, status)
VALUES (?, ?, 450, NOW(), 'completed');
SET @donation_id = LAST_INSERT_ID();

INSERT INTO blood_inventory (blood_type, quantity_ml, collection_date, expiry_date, status)
VALUES (?, 450, NOW(), DATE_ADD(NOW(), INTERVAL 42 DAY), 'available');

UPDATE donors SET last_donation_date = NOW() WHERE id = ?;

INSERT INTO audit_log (table_name, action) VALUES ('donation_history', 'INSERT');

COMMIT;
```

---

## Conclusion & Key Takeaways

### What We Covered:
1. ✓ Complete database schema (13 tables)
2. ✓ Basic CRUD operations with examples
3. ✓ Complex joins and aggregations
4. ✓ Transaction management for data safety
5. ✓ Performance optimization with indexes
6. ✓ Real-world scenario queries
7. ✓ Troubleshooting approaches
8. ✓ Best practices

### Key SQL Patterns in BloodLink:
- **Security**: Hash passwords, never store plain text
- **Eligibility**: 90-day rule with NULL handling
- **Inventory**: FIFO ordering, expiry tracking
- **Audit**: Complete logging for compliance
- **Transactions**: All-or-nothing for data integrity
- **Relationships**: Foreign keys connect all data

### Tools Used:
- MySQL/PostgreSQL client
- EXPLAIN for query analysis
- Indexes for performance
- Transactions for consistency
- Audit logs for compliance

**Duration**: 40-50 minutes covering all SQL aspects  
**Best Practice**: Always test queries in development before production
