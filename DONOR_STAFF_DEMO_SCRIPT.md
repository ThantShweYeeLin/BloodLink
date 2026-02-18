# BloodLink: Donor to Staff Flow Demonstration Script

## Introduction (2 minutes)
**Title**: "BloodLink Blood Donation System - Donor & Staff Operations"

"Welcome! Today we'll demonstrate how BloodLink manages the complete donor lifecycle. We'll walk through how donors register, participate in blood drives, track their donations, and how staff manages donor information and donations with complete database transparency."

---

## System Overview (3 minutes)

### Donor Journey
```
Donor Registration
        ↓
Donor Login
        ↓
View Donation Events
        ↓
Register for Events / Donate
        ↓
View Donation History
        ↓
Track Eligibility Status
```

### Staff Management
```
View All Donors
        ↓
Record Donations
        ↓
Track Donor Eligibility
        ↓
Manage Donor Events
        ↓
View Audit Trail
```

### Database Connection
```
DONOR BROWSER → VITE DEV SERVER → EXPRESS API → MySQL/PostgreSQL → AUDIT LOG
```

---

## PART 1: DONOR ONBOARDING (10 minutes)

### 1.1 Donor Registration
**Script**: 
"First, let's see how a new donor registers in the system. This is their first step toward saving lives."

**Steps**:
1. Open: `http://localhost:5173/register-donor.html` (or your dev server)
2. Fill in registration form:
   - Full Name: "Sarah Johnson"
   - Email: "sarah.johnson@email.com"
   - Phone: "+1 (555) 234-5678"
   - Date of Birth: "1995-06-15"
   - Blood Type: "O+"
   - Address: "123 Main Street"
   - City: "Springfield"
   - Password: "SecurePass123!"
3. Click "Register"

**Database Operation - INSERT**:
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
  is_active,
  registration_date
) VALUES (
  'Sarah Johnson',
  'sarah.johnson@email.com',
  '+1 (555) 234-5678',
  '1995-06-15',
  'O+',
  '123 Main Street',
  'Springfield',
  [bcryptjs_hashed_password],
  true,
  NOW()
);

-- New donor ID is auto-generated (e.g., ID: 47)
```

**Audit Log Entry**:
```sql
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'donors',
  47,
  'INSERT',
  'system',
  NULL,
  'New donor registered: Sarah Johnson, Blood Type O+',
  NOW()
);
```

**Success Message**: "✓ Registration successful! You can now log in."

**What to highlight**:
- Password is securely hashed with bcryptjs
- Registration automatically creates audit log entry
- Donor becomes immediately active
- Unique donor ID assigned for future tracking

---

### 1.2 Donor Login
**Script**: 
"Now Sarah can log in to the system. Let's see her dashboard."

**Steps**:
1. Navigate to: `http://localhost:5173/login-donor.html`
2. Enter credentials:
   - Email: `sarah.johnson@email.com`
   - Password: `SecurePass123!`
3. Click "Login"

**Database Authentication**:
```sql
-- Step 1: Find donor by email
SELECT id, email, password_hash, full_name, blood_type 
FROM donors 
WHERE email = 'sarah.johnson@email.com' AND is_active = true;

-- Step 2: Compare password with stored hash
bcryptjs.compare(inputPassword, storedHash);

-- Step 3: Generate JWT token if match
jwt.sign({ 
  donorId: 47, 
  email: 'sarah.johnson@email.com', 
  userType: 'donor' 
}, JWT_SECRET);
```

**Token Stored in Browser**:
```javascript
localStorage.setItem('token', '[JWT_TOKEN]');
localStorage.setItem('donorId', '47');
localStorage.setItem('userType', 'donor');
```

**What to highlight**:
- Password is never stored in plain text
- bcryptjs ensures one-way encryption
- JWT token enables stateless authentication
- No session table needed on server

---

### 1.3 Donor Dashboard
**Script**: 
"Sarah's dashboard shows her donation history, eligibility status, and upcoming events."

**Dashboard Statistics**:
- Total Donations: 0
- Last Donation: Never
- Days Until Eligible: 0 (First time donors are eligible)
- Points Earned: 0
- Blood Type: O+

**Steps**:
1. Show main dashboard
2. Display statistics cards
3. Highlight "Ready to Donate ✓" status

**Database Queries** (Dashboard loads):

```sql
-- Get donor info
SELECT id, full_name, blood_type, last_donation_date, is_active 
FROM donors 
WHERE id = 47;

-- Count total donations
SELECT COUNT(*) as total_donations 
FROM donation_history 
WHERE donor_id = 47;

-- Calculate eligibility
SELECT 
  CASE 
    WHEN last_donation_date IS NULL THEN 'Eligible'
    WHEN DATEDIFF(NOW(), last_donation_date) >= 90 THEN 'Eligible'
    ELSE CONCAT('Eligible in ', 90 - DATEDIFF(NOW(), last_donation_date), ' days')
  END as eligibility_status,
  CASE 
    WHEN last_donation_date IS NULL THEN 0
    ELSE DATEDIFF(NOW(), last_donation_date)
  END as days_since_donation
FROM donors 
WHERE id = 47;

-- Get donation history
SELECT * 
FROM donation_history 
WHERE donor_id = 47 
ORDER BY donation_date DESC 
LIMIT 5;
```

**What to highlight**:
- Donor can see all their personal data
- Eligibility automatically calculated (90-day rule)
- Previous donations listed with details
- Real-time status updates

---

## PART 2: DONOR PARTICIPATION (8 minutes)

### 2.1 Browse Donation Events
**Script**: 
"The system shows Sarah upcoming blood donation events in her area. She can see details and register to participate."

**Steps**:
1. Navigate to "Donation Events" or "Events" page
2. View list of upcoming events

**Sample Events Displayed**:
```
Event Name: Downtown Blood Drive 2026
Date: Feb 25, 2026
Time: 9:00 AM - 5:00 PM
Location: City Center Park
Expected Donors: 50
Status: Upcoming ✓
Register Button: [Enabled]

---

Event Name: Community Health Fair
Date: Mar 10, 2026
Time: 10:00 AM - 3:00 PM
Location: Central High School
Expected Donors: 75
Status: Upcoming ✓
Register Button: [Enabled]

---

Event Name: Summer Blood Drive
Date: Apr 1, 2026
Time: 9:00 AM - 6:00 PM
Location: Shopping Mall
Expected Donors: 100
Status: Upcoming ✓
Register Button: [Enabled]
```

**Database Query** (Events List):
```sql
SELECT 
  id,
  title,
  date,
  start_time,
  end_time,
  location,
  expected_participants,
  status,
  (SELECT COUNT(*) FROM event_participants 
   WHERE event_id = events.id) as registered_donors
FROM events 
WHERE date >= CURDATE() 
  AND status = 'upcoming'
ORDER BY date ASC;
```

**What to highlight**:
- Real upcoming events from database
- Shows event capacity vs registered donors
- Sarah can see how many have registered
- Easy registration for any event

---

### 2.2 Register for Event
**Script**: 
"Sarah is free on Feb 25, so she registers for the Downtown Blood Drive. This will count her as a participant."

**Steps**:
1. Click "Register" button for Downtown Blood Drive
2. Confirm registration
3. See success message

**Database Operations**:

**Step 1**: Add participant record
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
```

**Step 2**: Update event expected participants
```sql
UPDATE events 
SET expected_participants = expected_participants + 1 
WHERE id = 1;
```

**Step 3**: Create audit log
```sql
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'event_participants',
  [participation_id],
  'INSERT',
  'donor',
  47,
  'Sarah Johnson registered for Downtown Blood Drive',
  NOW()
);
```

**Success Message**: "✓ Registered successfully! We'll send you a reminder email on Feb 24."

**What to highlight**:
- Event registration tracked in database
- Audit log records donor action
- Real-time count of registered donors updates
- Donor receives confirmation

---

### 2.3 Prepare for Donation
**Script**: 
"The day of the event arrives. Let's show what information Sarah might see to prepare for her donation."

**Steps**:
1. Click on registered event details
2. View pre-donation checklist

**Pre-Donation Information Shown**:
```
Downtown Blood Drive - Feb 25, 2026

Your Registration: ✓ Confirmed

Pre-Donation Checklist:
☐ Eat a healthy meal
☐ Drink plenty of water
☐ Get adequate sleep
☐ Bring valid ID
☐ Wear loose, comfortable clothing

What to Expect:
- Check-in: 5 minutes
- Screening: 10 minutes
- Donation: 8-10 minutes
- Recovery: 10 minutes
- Total Time: 45 minutes

Eligibility Check:
✓ You are eligible to donate
✓ Last donation: Never (first-time donor)
✓ Blood type: O+ (high demand)
```

**Database Query** (Eligibility verification):
```sql
SELECT 
  full_name,
  blood_type,
  last_donation_date,
  CASE 
    WHEN last_donation_date IS NULL THEN 'First-time donor'
    WHEN DATEDIFF(NOW(), last_donation_date) >= 90 THEN 'Eligible'
    ELSE 'Not yet eligible'
  END as status
FROM donors 
WHERE id = 47;
```

**What to highlight**:
- System verifies eligibility automatically
- Donor knows exactly what to expect
- Encourages preparation for successful donation

---

## PART 3: STAFF DONATION RECORDING (10 minutes)

### 3.1 Staff Views Donation Event
**Script**: 
"Now let's switch to the staff side. A blood bank employee is managing the Downtown Blood Drive event."

**Steps**:
1. Open new browser tab: `http://localhost:5173/login-staff.html`
2. Login as staff:
   - Email: `staff@bloodbank.com`
   - Password: (staff password)
3. Navigate to "Event Management"

**Staff Event Dashboard**:
- Event: Downtown Blood Drive
- Date: Feb 25, 2026
- Location: City Center Park
- Expected Participants: 51 (includes Sarah and others)
- Registered Donors: 51 ✓
- Completed Donations: 0
- In Progress: 1
- Donations Recorded: 0

**Database Query** (Event overview):
```sql
SELECT 
  e.id,
  e.title,
  e.date,
  e.location,
  e.expected_participants,
  (SELECT COUNT(*) FROM event_participants 
   WHERE event_id = e.id AND status = 'registered') as registered,
  (SELECT COUNT(*) FROM event_participants 
   WHERE event_id = e.id AND status = 'completed') as completed,
  (SELECT COUNT(*) FROM donation_history 
   WHERE donation_date = e.date) as donations_recorded
FROM events 
WHERE id = 1;
```

**What to highlight**:
- Staff sees real-time participant tracking
- Registration counts help prepare for event
- Expected vs actual donors comparison

---

### 3.2 Check Donor Eligibility During Event
**Script**: 
"When Sarah arrives at the blood drive, staff needs to verify her eligibility. Let's see how that works in the system."

**Steps**:
1. Staff navigates to "Donor Management"
2. Search for "Sarah Johnson" or scans her ID
3. View her donor profile

**Donor Profile Display**:
```
Name: Sarah Johnson
Email: sarah.johnson@email.com
Phone: +1 (555) 234-5678
Blood Type: O+ ← High Demand!
Date of Birth: 1995-06-15
Age: 30 years old ✓

Donation History:
(No previous donations)

Eligibility Status: ✓ ELIGIBLE
- First-time donor (all first-timers are eligible)
- No contraindications in system
- BMI: [To be checked during screening]

Last Donation: Never
Days Since Last: N/A
Next Eligible: Today! ✓

Risk Factors: None recorded
Allergies: None recorded
Medical Notes: None recorded
```

**Database Queries** (Donor lookup):

```sql
-- Find donor
SELECT * FROM donors WHERE full_name LIKE '%Sarah Johnson%' AND is_active = true;

-- Get donation history
SELECT * FROM donation_history WHERE donor_id = 47 ORDER BY donation_date DESC;

-- Check eligibility
SELECT 
  CASE 
    WHEN (SELECT last_donation_date FROM donors WHERE id = 47) IS NULL 
    THEN 'First-time donor - Eligible'
    WHEN DATEDIFF(NOW(), (SELECT last_donation_date FROM donors WHERE id = 47)) >= 90 
    THEN 'Eligible'
    ELSE 'Not eligible yet'
  END as status;
```

**What to highlight**:
- O+ is universal donor (high priority)
- Staff can verify eligibility instantly
- No manual checking needed
- Previous donation history is visible

---

### 3.3 Perform Pre-Donation Screening
**Script**: 
"Staff conducts a screening with vital checks. These results are recorded in the system."

**Steps**:
1. Staff clicks "Start Screening" for Sarah
2. Enters screening data:
   - Blood Pressure: 120/80 ✓
   - Hemoglobin: 14.2 g/dL ✓
   - Pulse: 72 bpm ✓
   - Temperature: 98.6°F ✓
   - Weight: 65 kg ✓
3. Add screening notes: "Healthy vital signs. Donor well-hydrated."
4. Mark as "Passed Screening"

**Database Operation**:
```sql
INSERT INTO donor_screenings (
  donor_id,
  event_id,
  screening_date,
  blood_pressure,
  hemoglobin,
  pulse,
  temperature,
  weight,
  screening_status,
  notes,
  staff_id
) VALUES (
  47,
  1,
  NOW(),
  '120/80',
  14.2,
  72,
  98.6,
  65,
  'passed',
  'Healthy vital signs. Donor well-hydrated.',
  5
);
```

**What to highlight**:
- All screening data recorded with timestamp
- Staff ID automatically tracked for accountability
- Data validates donation safety
- Results stored for future reference

---

### 3.4 Record Blood Donation
**Script**: 
"Sarah's screening passed. Now staff records the actual blood donation. This is the key operation that updates inventory."

**Steps**:
1. Click "Record Donation"
2. Fill in donation details:
   - Donor: Sarah Johnson
   - Blood Type: O+ (auto-filled from donor record)
   - Quantity Collected: 450 ml (1 unit)
   - Collection Date: Feb 25, 2026
   - Collection Time: 2:30 PM
   - Donation Status: Completed
   - Notes: "First-time donor. Excellent donation."
3. Click "Complete Donation"

**Database Operations** (Multi-step transaction):

**Step 1**: Record Donation History
```sql
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

-- New donation ID assigned (e.g., ID: 523)
```

**Step 2**: Add Blood Unit to Inventory
```sql
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
  DATE_ADD('2026-02-25', INTERVAL 42 DAY), -- Mar 8, 2026
  'available',
  'Blood Bank Storage - Refrigerator Unit 1',
  'First-time donor collection at Downtown Blood Drive'
);

-- New unit ID assigned (e.g., ID: 1847)
-- Unit ID displayed as: O+-1847 (formatted)
```

**Step 3**: Update Donor's Last Donation Date
```sql
UPDATE donors 
SET last_donation_date = '2026-02-25'
WHERE id = 47;
```

**Step 4**: Record Audit Log Entry
```sql
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'donation_history',
  523,
  'INSERT',
  'staff',
  5,
  'Sarah Johnson donated 450ml O+ at Downtown Blood Drive',
  NOW()
);

INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'blood_inventory',
  1847,
  'INSERT',
  'staff',
  5,
  'New O+ unit added from Sarah Johnson donation (expires 2026-03-08)',
  NOW()
);
```

**Step 5**: Update Event Participant Status
```sql
UPDATE event_participants 
SET status = 'completed'
WHERE event_id = 1 AND donor_id = 47;
```

**Success Message**: "✓ Donation recorded! Unit ID: #O+-1847, Expires: Mar 8, 2026"

**What to highlight**:
- Multiple coordinated database updates
- Inventory automatically updated
- Expiry date calculated (42 days)
- Donor eligibility counter reset
- Complete audit trail created
- Unit gets unique ID for tracking

---

### 3.5 Verify Inventory Updated
**Script**: 
"Let's verify that the blood bank's inventory has been updated with Sarah's donation."

**Steps**:
1. Navigate to "Inventory Management"
2. Filter by O+ blood type
3. Show new unit with Sarah's donation

**Inventory Display**:
```
Blood Type: O+
Total Units: 16 (includes Sarah's new unit)
Total Volume: 7,200 ml

Recent Units:
Unit ID | Collection Date | Expiry Date | Volume | Donor Name | Status
---------|-----------------|------------|--------|-----------|--------
O+-1847  | Feb 25, 2026   | Mar 8, 2026 | 450ml  | Sarah J.  | Available ✓
O+-1846  | Feb 24, 2026   | Mar 9, 2026 | 450ml  | John D.   | Available ✓
O+-1845  | Feb 23, 2026   | Mar 8, 2026 | 450ml  | Maria L.  | Available ✓
```

**Database Verification**:
```sql
SELECT 
  id,
  blood_type,
  quantity_ml,
  collection_date,
  expiry_date,
  donor_id,
  status
FROM blood_inventory
WHERE blood_type = 'O+' 
  AND status = 'available'
ORDER BY collection_date DESC
LIMIT 10;

-- Result shows Sarah's unit (ID 1847) at the top
```

**Inventory Summary Query**:
```sql
SELECT 
  blood_type,
  COUNT(*) as units,
  SUM(quantity_ml) as total_ml,
  MIN(expiry_date) as earliest_expiry
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type
ORDER BY blood_type;
```

**Result**:
```
O+: 16 units, 7,200 ml, Expires Feb 28
O-: 5 units, 2,250 ml, Expires Feb 26
A+: 8 units, 3,600 ml, Expires Mar 1
A-: 3 units, 1,350 ml, Expires Feb 27
B+: 10 units, 4,500 ml, Expires Mar 2
B-: 6 units, 2,700 ml, Expires Feb 28
AB+: 2 units, 900 ml, Expires Mar 5
AB-: 1 unit, 450 ml, Expires Mar 3
```

**What to highlight**:
- Inventory count updated correctly
- Expiry tracking automatic
- New unit appears at top with correct dates
- Easy to identify newest donations
- Helps staff use units before expiry

---

## PART 4: DONOR POST-DONATION (5 minutes)

### 4.1 Donor Sees Updated Profile
**Script**: 
"Back on Sarah's dashboard. Let's see how her profile has been updated after donating."

**Steps**:
1. Switch to Donor browser tab
2. Refresh dashboard
3. View updated statistics

**Updated Dashboard Stats**:
```
Sarah's Donation Dashboard

Profile Summary:
✓ Name: Sarah Johnson
✓ Blood Type: O+ (Universal Donor)
✓ Last Donation: Feb 25, 2026 (Today!)

Donation Statistics:
📊 Total Donations: 1 ✓ (Was: 0)
📊 Total Donated: 450 ml
📊 Donation Frequency: 1st time donor
📊 Loyalty Points: 10 points

Eligibility Status:
✓ Next Donation Eligible: May 26, 2026
   (90 days from today)
   Days Remaining: 90

Lives Helped:
💓 This donation can save up to 3 lives!

Recent Donation:
- Date: Feb 25, 2026
- Location: Downtown Blood Drive
- Amount: 450 ml
- Status: ✓ Completed
- Notes: First-time donor. Excellent donation.
```

**Database Query** (Updated dashboard):
```sql
SELECT 
  d.id,
  d.full_name,
  d.blood_type,
  d.last_donation_date,
  COUNT(dh.id) as total_donations,
  SUM(dh.quantity_ml) as total_donated,
  DATE_ADD(d.last_donation_date, INTERVAL 90 DAY) as next_eligible_date,
  DATEDIFF(DATE_ADD(d.last_donation_date, INTERVAL 90 DAY), NOW()) as days_to_next_eligible
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id
WHERE d.id = 47
GROUP BY d.id, d.full_name, d.blood_type;
```

**What to highlight**:
- Stats update in real-time
- Donation count reflects new donation
- Eligibility deadline calculated automatically
- Motivational message (lives saved)
- Transparency in donation tracking

---

### 4.2 Donor Views Donation History
**Script**: 
"Sarah can see her complete donation history with all details. This provides transparency and accountability."

**Steps**:
1. Click on "Donation History" or "My Donations"
2. View table with donation record

**Donation History Table**:
```
My Donations

Total Donations: 1
Total Volume: 450 ml
Average per Donation: 450 ml

Donation Records:
Date         | Time   | Location           | Amount | Status    | Unit ID  | Notes
-------------|--------|-------------------|--------|-----------|----------|------------------
Feb 25, 2026 | 2:30PM | City Center Park   | 450 ml | ✓ Completed | O+-1847 | First-time donation

[Download Receipt] [Share on Social]
```

**Database Query**:
```sql
SELECT 
  dh.donation_date,
  dh.collection_time,
  e.location,
  dh.quantity_ml,
  dh.status,
  bi.id as unit_id,
  dh.notes,
  s.full_name as staff_name
FROM donation_history dh
LEFT JOIN events e ON dh.event_id = e.id
LEFT JOIN blood_inventory bi ON dh.id = bi.donation_history_id
LEFT JOIN staff s ON dh.staff_id = s.id
WHERE dh.donor_id = 47
ORDER BY dh.donation_date DESC;
```

**What to highlight**:
- Complete record available to donor
- Timestamps show precision
- Unit ID links to inventory
- Staff member credited
- Downloadable receipt option

---

## PART 5: STAFF DONOR MANAGEMENT (7 minutes)

### 5.1 Staff Views All Donors
**Script**: 
"Staff can manage all donors in the system. They see registration status, eligibility, and donation history."

**Steps**:
1. Navigate to "Donor Management"
2. View all registered donors
3. Search or filter

**Donor List View**:
```
Total Donors: 847
Active Donors: 823
New This Month: 42
Eligible Right Now: 456

Donor Records:
Name           | Blood Type | Last Donation | Donations | Status      | Action
---------------|------------|---------------|-----------|-------------|-------------
Sarah Johnson  | O+         | Feb 25, 2026  | 1         | ✓ Eligible  | [View] [Edit]
John Smith     | A-         | Jan 15, 2026  | 8         | ⏳ Wait 38d  | [View] [Edit]
Maria Garcia   | B+         | Feb 20, 2026  | 3         | ✓ Eligible  | [View] [Edit]
James Wilson   | AB-        | Feb 10, 2026  | 12        | ⏳ Wait 57d  | [View] [Edit]
[... more records ...]
```

**Database Query** (Donor list with status):
```sql
SELECT 
  d.id,
  d.full_name,
  d.blood_type,
  d.last_donation_date,
  COUNT(dh.id) as donation_count,
  CASE 
    WHEN d.last_donation_date IS NULL THEN 'Never Donated'
    WHEN DATEDIFF(NOW(), d.last_donation_date) >= 90 THEN 'Eligible'
    ELSE CONCAT('Wait ', 90 - DATEDIFF(NOW(), d.last_donation_date), ' days')
  END as eligibility_status
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id
GROUP BY d.id
ORDER BY d.last_donation_date DESC, d.full_name ASC;
```

**What to highlight**:
- Complete donor database
- Real-time eligibility status
- Donation count by donor
- Easy identification of eligible donors
- Status helps plan recruitment

---

### 5.2 View Donor Details
**Script**: 
"Let's click on Sarah to see her complete profile. Staff can view everything and make notes."

**Steps**:
1. Click "View" or "Edit" next to Sarah Johnson
2. See full donor profile

**Detailed Donor Profile**:
```
═══════════════════════════════════════════════════════════════
DONOR PROFILE - Sarah Johnson

Personal Information:
───────────────────
Name: Sarah Johnson
Email: sarah.johnson@email.com
Phone: +1 (555) 234-5678
Date of Birth: June 15, 1995 (Age: 30)
Blood Type: O+ ← Universal Donor!
Address: 123 Main Street, Springfield
Registration Date: Feb 18, 2026

Donation Eligibility:
────────────────────
✓ Status: ELIGIBLE
✓ First-time donor (no restrictions)
Health Score: Excellent
Last Donation: Feb 25, 2026
Next Eligible: May 26, 2026 (90 days out)
Days Until Eligible: 90

Donation History:
─────────────────
Total Donations: 1
Total Volume Donated: 450 ml
Average per Donation: 450 ml

Recent Activity:
Date         | Event              | Type      | Amount | Unit ID
-------------|-------------------|-----------|--------|----------
Feb 25, 2026 | Blood Drive Event  | Donation  | 450ml  | O+-1847
Feb 18, 2026 | System             | Register  | -      | -

Medical Notes:
──────────────
Allergies: None
Medical Conditions: None
Medications: None
Previous Issues: None

Staff Actions:
──────────────
[Edit Profile] [Add Medical Note] [Defer Donor] [Contact Donor]
[Send Newsletter] [View Audit Log]
```

**Database Query** (Complete donor profile):
```sql
SELECT 
  d.*,
  COUNT(DISTINCT dh.id) as total_donations,
  COALESCE(SUM(dh.quantity_ml), 0) as total_volume,
  CASE 
    WHEN d.last_donation_date IS NULL THEN 'Never'
    ELSE d.last_donation_date 
  END as last_donation,
  CASE 
    WHEN d.last_donation_date IS NULL THEN 'Eligible'
    WHEN DATEDIFF(NOW(), d.last_donation_date) >= 90 THEN 'Eligible'
    ELSE CONCAT('Wait ', 90 - DATEDIFF(NOW(), d.last_donation_date), ' days')
  END as status
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id
WHERE d.id = 47;
```

**What to highlight**:
- Complete medical history available
- Donation tracking with statistics
- Eligibility automatically calculated
- Staff can add notes for future reference
- Timeline of all donor activities

---

### 5.3 Add Donor Note
**Script**: 
"Staff can add notes about the donor for future reference. This helps maintain continuity of care."

**Steps**:
1. Click "Add Medical Note"
2. Fill in note:
   - Type: General Note
   - Note: "Excellent first-time donor. Very hydrated. Interested in regular donation program. Schedule for April donation drive."
   - Date: Feb 25, 2026
3. Click "Save Note"

**Database Operation**:
```sql
INSERT INTO donor_notes (
  donor_id,
  staff_id,
  note_type,
  content,
  note_date,
  created_at
) VALUES (
  47,
  5,
  'general_note',
  'Excellent first-time donor. Very hydrated. Interested in regular donation program. Schedule for April donation drive.',
  '2026-02-25',
  NOW()
);
```

**Audit Log Entry**:
```sql
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'donor_notes',
  [note_id],
  'INSERT',
  'staff',
  5,
  'Staff added note to Sarah Johnson\'s donor profile',
  NOW()
);
```

**What to highlight**:
- Notes persist for future staff
- Logged in audit trail
- Helps personalize donor experience
- Improves retention and recruitment

---

### 5.4 Send Donor Communication
**Script**: 
"Staff can send reminders and communications to eligible donors. Let's send Sarah a note about the April event."

**Steps**:
1. Click "Send Message" or "Send Email"
2. Select template: "Thank You for Donation"
3. Add personal message: "Hi Sarah, thank you for your amazing first donation! We have an April blood drive event. Would you be interested?"
4. Send

**Database Operations**:
```sql
INSERT INTO donor_communications (
  donor_id,
  sent_by_staff_id,
  communication_type,
  subject,
  message,
  sent_date
) VALUES (
  47,
  5,
  'email',
  'Thank You for Your Donation',
  'Hi Sarah, thank you for your amazing first donation!...',
  NOW()
);

-- Email actually sent via email service
INSERT INTO audit_log (
  table_name,
  record_id,
  action,
  user_type,
  user_id,
  changes,
  timestamp
) VALUES (
  'donor_communications',
  [comm_id],
  'INSERT',
  'staff',
  5,
  'Sent thank you email to Sarah Johnson',
  NOW()
);
```

**What to highlight**:
- Personalized communication
- Logged for compliance
- Helps with donor retention
- Can be templated for efficiency

---

## PART 6: TRACKING & AUDIT TRAIL (5 minutes)

### 6.1 View Complete Audit Trail
**Script**: 
"Every action in the system is tracked. Let's look at Sarah's complete audit trail from registration to donation."

**Steps**:
1. Navigate to "Audit Logs"
2. Filter by "Donor: Sarah Johnson" or "Record: 47"
3. View chronological list

**Audit Log for Sarah**:
```
Timestamp          | Action | Table            | Record | User Type | Details
-------------------|--------|------------------|--------|-----------|------------------------------------------
Feb 25 15:45 UTC   | INSERT | donor_comm.      | 2847   | staff     | Sent thank you email to Sarah
Feb 25 14:50 UTC   | INSERT | donor_notes      | 156    | staff     | Staff added note to Sarah's profile
Feb 25 14:35 UTC   | INSERT | blood_inventory  | 1847   | staff     | New O+ unit from Sarah's donation (expires 3/8)
Feb 25 14:32 UTC   | UPDATE | donors           | 47     | staff     | Updated last_donation_date to Feb 25, 2026
Feb 25 14:30 UTC   | INSERT | donation_history | 523    | staff     | Sarah donated 450ml O+ at blood drive
Feb 25 14:25 UTC   | UPDATE | event_partici.   | 892    | system    | Marked Sarah's event participation completed
Feb 25 10:15 UTC   | INSERT | donor_screenings | 401    | staff     | Sarah passed pre-donation screening
Feb 25 09:00 UTC   | SELECT | donors           | 47     | staff     | Staff viewed Sarah's donor profile
Feb 18 22:10 UTC   | INSERT | event_partici.   | 892    | donor     | Sarah registered for Downtown Blood Drive
Feb 18 17:30 UTC   | INSERT | donors           | 47     | system    | Sarah Johnson registered as donor
```

**Database Query** (Audit trail):
```sql
SELECT 
  al.timestamp,
  al.action,
  al.table_name,
  al.record_id,
  al.user_type,
  s.full_name as staff_name,
  al.changes
FROM audit_log al
LEFT JOIN staff s ON al.user_type = 'staff' AND al.user_id = s.id
WHERE al.user_id = 47 OR al.changes LIKE '%Sarah Johnson%'
ORDER BY al.timestamp DESC;
```

**What to highlight**:
- Complete chronological history
- Every action recorded with timestamp
- User attribution (who did it)
- Changes documented
- Compliance-ready documentation

---

### 6.2 Verify Data Consistency
**Script**: 
"Let's verify that all data is consistent across the system. Everything should be in sync."

**Verification Checks**:

**Check 1**: Donor registration recorded
```sql
SELECT id, full_name, blood_type, registration_date 
FROM donors WHERE id = 47;
-- Result: Sarah Johnson, O+, Feb 18, 2026 ✓
```

**Check 2**: Donation in history
```sql
SELECT * FROM donation_history WHERE donor_id = 47;
-- Result: 1 donation, 450ml, Feb 25, 2026 ✓
```

**Check 3**: Blood unit in inventory
```sql
SELECT * FROM blood_inventory WHERE id = 1847;
-- Result: O+, 450ml, expires Mar 8, 2026, available ✓
```

**Check 4**: Event participation recorded
```sql
SELECT ep.status, e.title 
FROM event_participants ep
JOIN events e ON ep.event_id = e.id
WHERE ep.donor_id = 47;
-- Result: completed, Downtown Blood Drive ✓
```

**Check 5**: Audit log entries exist
```sql
SELECT COUNT(*) as audit_entries 
FROM audit_log 
WHERE user_id = 47 OR changes LIKE '%Sarah%';
-- Result: 9 entries ✓
```

**What to highlight**:
- All records consistent
- No orphaned data
- Referential integrity maintained
- Complete data trail
- System reliability proven

---

## PART 7: ADVANCED DONOR MANAGEMENT (5 minutes)

### 7.1 Bulk Donor Notifications
**Script**: 
"Staff can efficiently communicate with all eligible donors about upcoming events."

**Steps**:
1. Navigate to "Communications"
2. Select audience: "All O+ donors who are eligible"
3. Message type: "Event invitation"
4. Select event: "April Community Drive"
5. Send to: 234 donors

**Database Query** (Eligible donors for targeting):
```sql
SELECT d.id, d.email, d.full_name 
FROM donors d
WHERE d.blood_type = 'O+'
  AND (d.last_donation_date IS NULL 
       OR DATEDIFF(NOW(), d.last_donation_date) >= 90)
  AND d.is_active = true;

-- Result: 234 donors
```

**Bulk Insert**:
```sql
INSERT INTO donor_communications (donor_id, sent_by_staff_id, message, sent_date)
SELECT d.id, 5, 'Invitation to April Community Blood Drive', NOW()
FROM donors d
WHERE d.blood_type = 'O+'
  AND (d.last_donation_date IS NULL 
       OR DATEDIFF(NOW(), d.last_donation_date) >= 90);

-- 234 rows inserted in one operation
```

**What to highlight**:
- Efficient bulk operations
- Targeted outreach
- Data-driven recruitment
- Reduces manual work

---

### 7.2 Donor Analytics
**Script**: 
"Staff can analyze donor patterns to improve blood collection strategies."

**Analytics Displayed**:
```
DONOR ANALYTICS DASHBOARD

Overall Statistics:
- Total Registered Donors: 847
- Active Donors: 823
- Inactive Donors: 24
- New Registrations (This Month): 42
- Donors Eligible Today: 456

Blood Type Distribution:
O+: 245 donors (29%)  ████████░░
O-: 67 donors  (8%)   ██░░░░░░░░
A+: 198 donors (23%)  ███████░░░
A-: 54 donors  (6%)   ██░░░░░░░░
B+: 156 donors (18%)  █████░░░░░
B-: 42 donors  (5%)   █░░░░░░░░░
AB+: 52 donors (6%)   ██░░░░░░░░
AB-: 33 donors (4%)   █░░░░░░░░░

Donation Frequency:
First-time Donors: 234
Regular Donors (2+ donations): 589
Super Donors (10+ donations): 112

Average Donations Per Donor: 3.2

Top Performing Events:
1. Downtown Blood Drive (Feb 25): 51 donors
2. Community Health Fair (Previous): 48 donors
3. Summer Campaign (Previous): 67 donors
```

**Database Query** (Analytics):
```sql
SELECT 
  d.blood_type,
  COUNT(*) as donor_count,
  SUM(CASE WHEN dh.id IS NOT NULL THEN 1 ELSE 0 END) as donors_with_donations,
  COUNT(DISTINCT dh.id) as total_donations,
  AVG(dh.quantity_ml) as avg_per_donation
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id
WHERE d.is_active = true
GROUP BY d.blood_type
ORDER BY donor_count DESC;
```

**What to highlight**:
- Data-driven insights
- Identifies donor patterns
- Helps plan resources
- Shows program effectiveness

---

## PART 8: COMPLIANCE & REPORTING (3 minutes)

### 8.1 Donor Consent & Privacy
**Script**: 
"The system maintains strict privacy and consent tracking for compliance with regulations like GDPR and HIPAA."

**Consent Records**:
```
Donor: Sarah Johnson (ID: 47)

Consent Status:
✓ Marketing Communications: Opted in (Feb 18, 2026)
✓ Data Sharing: Consented (Feb 18, 2026)
✓ Medical Screening: Agreed (Feb 25, 2026)
✓ Donation Recording: Authorized (Feb 25, 2026)

Privacy Settings:
✓ Profile Visibility: Private (Staff only)
✓ Donation History: Private (Staff only)
✓ Contact Consent: Yes
✓ Data Retention: 5 years

Legal Compliance:
✓ Age Verified: 30 years old (requirement: 18+)
✓ Health Screening: Passed
✓ Consent Form: Signed (Feb 25, 2026)
✓ Medical Records: Kept confidential
```

**Database Schema**:
```sql
CREATE TABLE donor_consent (
  id INT PRIMARY KEY AUTO_INCREMENT,
  donor_id INT,
  consent_type VARCHAR(50),
  status BOOLEAN,
  consent_date TIMESTAMP,
  expiry_date DATE,
  notes TEXT
);

-- Tracks all consent records with dates
```

**What to highlight**:
- Strict privacy controls
- Compliance ready
- Consent timestamps documented
- Easy audit trail for regulators

---

### 8.2 Generate Compliance Reports
**Script**: 
"Staff can generate regulatory reports for health authorities."

**Sample Report**:
```
BLOOD DONATION PROGRAM - COMPLIANCE REPORT
Period: February 2026
Generated: Feb 25, 2026

DONATION STATISTICS:
Total Donors: 847
Total Donations: 2,341
Total Blood Collected: 1,053,450 ml
Average per Donor: 3.2 donations

SAFETY STATISTICS:
Screening Pass Rate: 98.4%
Adverse Events: 0
Donor Deferrals: 18
Repeat Donors: 589 (69%)

INVENTORY:
Total Available Units: 789
Total Volume: 355,050 ml
Expired Units This Month: 12
Wastage Rate: 1.5%

BLOOD TYPE DISTRIBUTION:
O+: 234 units (29.7%)
O-: 68 units (8.6%)
A+: 189 units (23.9%)
[... more ...]

COMPLIANCE:
✓ All donors screened
✓ All units tested
✓ All records documented
✓ No regulatory violations
✓ Full audit trail maintained

Prepared by: Blood Bank Manager
Approved by: Medical Director
```

**Database Query** (Report generation):
```sql
SELECT 
  COUNT(DISTINCT d.id) as total_donors,
  COUNT(dh.id) as total_donations,
  SUM(dh.quantity_ml) as total_collected,
  COUNT(CASE WHEN ds.screening_status = 'passed' THEN 1 END) as passed_screening,
  COUNT(CASE WHEN ds.screening_status = 'deferred' THEN 1 END) as deferred,
  COUNT(CASE WHEN bi.status = 'expired' THEN 1 END) as expired_units
FROM donors d
LEFT JOIN donation_history dh ON d.id = dh.donor_id
LEFT JOIN donor_screenings ds ON d.id = ds.donor_id
LEFT JOIN blood_inventory bi ON dh.id = bi.donation_history_id
WHERE YEAR(dh.donation_date) = 2026 AND MONTH(dh.donation_date) = 02;
```

**What to highlight**:
- Regulatory compliance
- Automatic report generation
- Complete audit trail
- Data integrity verification

---

## Key Takeaways (2 minutes)

### What We Demonstrated:
1. ✓ **Donor Registration**: Secure account creation with password hashing
2. ✓ **Donor Login**: JWT-based authentication
3. ✓ **Event Participation**: Donor registration for blood drives
4. ✓ **Pre-Donation**: Eligibility verification and screening
5. ✓ **Donation Recording**: Multi-step database transaction
6. ✓ **Inventory Update**: Automatic tracking of new blood units
7. ✓ **Donor Tracking**: Complete donation history
8. ✓ **Staff Management**: View and manage all donors
9. ✓ **Audit Trail**: Complete transparency of all operations
10. ✓ **Compliance**: Consent and privacy tracking
11. ✓ **Analytics**: Data-driven insights
12. ✓ **Reporting**: Regulatory-ready reports

### System Benefits:
- **Donor Experience**: Easy registration, event discovery, transparent tracking
- **Staff Efficiency**: Complete donor information, automated eligibility
- **Safety**: Screening records, medical history, adverse event tracking
- **Compliance**: Complete audit trail, consent management, regulatory reports
- **Growth**: Analytics drive recruitment, retention, and planning
- **Trust**: Transparency in all operations

---

## Demo Checklist

- [ ] Donor registration successful
- [ ] Password securely hashed
- [ ] Donor login works with JWT token
- [ ] Dashboard shows correct donor info
- [ ] Event list displays upcoming events
- [ ] Donor can register for event
- [ ] Event participant count updated
- [ ] Screening data recorded
- [ ] Donation recorded successfully
- [ ] Unit ID generated and displayed
- [ ] Inventory updated with new unit
- [ ] Expiry date calculated correctly
- [ ] Last donation date updated
- [ ] Donor eligibility recalculated
- [ ] Audit log entries created
- [ ] Staff can view donor profile
- [ ] Staff can search donors
- [ ] Eligibility status accurate
- [ ] Donation history visible
- [ ] Staff can add notes
- [ ] Consent records tracked
- [ ] Analytics display correctly
- [ ] Report generation works
- [ ] All data consistent across tables

---

## FAQ & Answers

1. **Q**: How is donor password security handled?
   **A**: Passwords hashed with bcryptjs - never stored in plain text

2. **Q**: How does the system prevent over-donation?
   **A**: Tracks last donation date, shows 90-day eligibility countdown

3. **Q**: What happens if a donor has a bad screening result?
   **A**: Deferred in system, can retry after specified period

4. **Q**: How is blood expiry managed?
   **A**: Calculated automatically (42 days), staff can mark as expired

5. **Q**: Can donors see other donors' information?
   **A**: No - strict privacy, each donor sees only their own data

6. **Q**: How is compliance maintained?
   **A**: Audit logs track every action, consent records stored, reports generated

7. **Q**: What if a donor wants to delete their account?
   **A**: Can be deactivated, historical records preserved for safety

8. **Q**: How are donors recruited for new events?
   **A**: Staff uses analytics to target eligible donors, sends bulk communications

9. **Q**: Is donation location tracked?
   **A**: Yes - blood drive event is recorded with donation

10. **Q**: Can donors see who received their blood?
    **A**: No - recipient identity is protected for privacy, donor sees donation was used

---

**End of Presentation**

*Total Time: ~50-60 minutes*  
*Format: Live demo with database queries shown*  
*Audience: Blood bank staff, hospital administrators, donors, regulatory bodies*
