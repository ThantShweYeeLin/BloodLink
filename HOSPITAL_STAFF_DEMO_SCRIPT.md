# BloodLink: Hospital to Staff Flow Demonstration Script

## Introduction (2 minutes)
**Title**: "BloodLink Blood Management System - Hospital & Staff Operations"

"Good morning/afternoon! Today we'll demonstrate how BloodLink streamlines blood donation management between hospitals and blood bank staff. We'll show real-world scenarios of how hospitals request blood, and how staff manages those requests through our integrated system with database tracking."

---

## System Overview (3 minutes)

### Architecture
```
HOSPITAL INTERFACE (Web Browser)
        ↓
    API Server (Port 3000)
        ↓
DATABASE (MySQL/PostgreSQL)
        ↓
STAFF INTERFACE (Web Browser)
```

### Key Players
- **Hospital**: Requests blood for patients
- **Staff**: Manages inventory and fulfills requests
- **Database**: Tracks all operations in audit logs

---

## PART 1: HOSPITAL WORKFLOW (8 minutes)

### 1.1 Hospital Login Demo
**Script**:
"Let's start with a hospital. They need to request blood units for patients. First, they log in..."

**Steps**:
1. Open: `http://localhost:5173/login-hospital.html` (or your dev server)
2. Enter credentials:
   - Email: `hospital@example.com` (or registered hospital email)
   - Password: (hospital password)
3. Click "Login"

**Database Action**: 
```sql
-- Behind the scenes, this query runs:
SELECT * FROM hospitals WHERE email = ? AND password_hash = ?
-- User session token is created and stored in localStorage
```

**What to highlight**: 
- Secure authentication
- Session management via JWT tokens
- User credentials validated against database

---

### 1.2 Hospital Dashboard Overview
**Script**: 
"Once logged in, the hospital sees their dashboard with real-time data about their blood requests and inventory."

**Show**:
- Total requests submitted
- Fulfilled requests
- Pending requests
- Years as partner
- Recent requests table

**Database Queries Running**:
```sql
SELECT COUNT(*) as total FROM blood_requests WHERE hospital_id = ?;
SELECT * FROM blood_requests WHERE hospital_id = ? ORDER BY request_date DESC LIMIT 10;
SELECT COUNT(*) as fulfilled FROM blood_requests WHERE hospital_id = ? AND status = 'fulfilled';
```

**What to highlight**:
- Real-time data from database
- Dashboard reflects actual request status
- Easy tracking of request fulfillment

---

### 1.3 Submit Blood Request
**Script**: 
"Now the hospital has a patient who needs blood. Let's submit a blood request."

**Steps**:
1. Click "Submit Request" or navigate to hospital-submit-request.html
2. Fill in form:
   - Blood Type: O+ (example)
   - Quantity: 2 units
   - Urgency: Standard (or Emergency)
   - Patient Priority: Moderate
   - Notes: "For surgery scheduled tomorrow"
3. Click "Submit Request"

**Database Operation - INSERT**:
```sql
INSERT INTO blood_requests (
  hospital_id, 
  blood_type, 
  quantity_units, 
  urgency, 
  status, 
  request_date, 
  notes
) VALUES (?, ?, ?, ?, 'pending', NOW(), ?);

-- New request ID is generated (auto-increment)
-- Status is automatically 'pending'
-- Timestamp is recorded
```

**Success Message**: "✓ Request submitted successfully! Request ID: #1234"

**What to highlight**:
- Data validation happens before database insert
- Request gets unique ID for tracking
- Timestamp automatic for audit trail
- Status is set to 'pending' by default

---

### 1.4 Track Request Status
**Script**: 
"The hospital can now track the status of their request in real-time."

**Steps**:
1. Click "Request Status" page
2. View submitted request with status "Pending"

**Database Query**:
```sql
SELECT 
  r.id, 
  r.blood_type, 
  r.quantity_units, 
  r.urgency, 
  r.status, 
  r.request_date, 
  r.notes,
  i.quantity_ml as available_quantity
FROM blood_requests r
LEFT JOIN blood_inventory i ON r.blood_type = i.blood_type AND i.status = 'available'
WHERE r.hospital_id = ?
ORDER BY r.request_date DESC;
```

**What to show**:
- Request ID: #1234
- Blood Type: O+
- Quantity: 2 units
- Status: ⏳ Pending
- Request Date: Feb 18, 2026

---

## PART 2: STAFF WORKFLOW (10 minutes)

### 2.1 Staff Login
**Script**: 
"Now let's switch to the staff side. A blood bank staff member sees the same request on their dashboard."

**Steps**:
1. Open new tab/window: `http://localhost:5173/login-staff.html`
2. Enter staff credentials:
   - Email: `staff@bloodbank.com`
   - Password: (staff password)
3. Click "Login"

**Database Action**:
```sql
SELECT * FROM staff WHERE email = ? AND password_hash = ?;
-- Verify staff member exists and has proper permissions
```

**What to highlight**:
- Different login for staff vs hospital
- Different dashboard view based on role
- Access control enforced at database level

---

### 2.2 Staff Dashboard
**Script**: 
"The staff dashboard shows all pending requests from all hospitals, blood inventory status, and system statistics."

**Show Statistics**:
- Total Donations (This Month): 45
- Total Blood Collected: 20,250 ml
- Requests Fulfilled: 38
- Pending Requests: 7
- Low Stock Alerts: 2 blood types

**Database Queries**:
```sql
-- Total donations this month
SELECT COUNT(*) FROM donation_history 
WHERE MONTH(donation_date) = MONTH(NOW()) 
AND YEAR(donation_date) = YEAR(NOW());

-- Blood inventory
SELECT blood_type, SUM(quantity_ml) as total 
FROM blood_inventory 
WHERE status = 'available' 
GROUP BY blood_type;

-- Pending requests
SELECT COUNT(*) FROM blood_requests WHERE status = 'pending';
```

**What to highlight**:
- Staff sees holistic view of system
- Inventory tracking at database level
- Real-time statistics

---

### 2.3 View Pending Requests
**Script**: 
"Staff can see all requests from all hospitals. Here's the request we just submitted from the hospital."

**Steps**:
1. Navigate to "Request Management" or "Hospital Requests"
2. View table with all pending requests

**Sample Data Shown**:
| Hospital | Blood Type | Quantity | Urgency | Date | Status |
|----------|-----------|----------|---------|------|--------|
| City Hospital | O+ | 2 units | Standard | Feb 18 | ⏳ Pending |
| Metro Medical | A- | 1 unit | Emergency | Feb 18 | ✓ Fulfilled |

**Database Query**:
```sql
SELECT 
  r.id,
  h.hospital_name,
  r.blood_type,
  r.quantity_units,
  r.urgency,
  r.status,
  r.request_date,
  r.notes
FROM blood_requests r
JOIN hospitals h ON r.hospital_id = h.id
WHERE r.status = 'pending'
ORDER BY 
  CASE WHEN r.urgency = 'emergency' THEN 1 ELSE 2 END,
  r.request_date ASC;
```

**What to highlight**:
- Join query across hospital and request tables
- Sorting by urgency and date
- Staff can see all requests in priority order

---

### 2.4 Check Blood Inventory
**Script**: 
"Before fulfilling a request, staff checks if the blood type is available. Let's check inventory."

**Steps**:
1. Navigate to "Inventory Management"
2. View available blood units by type

**Inventory Display**:
- O+: 15 units (6,750 ml) ✓ Full
- O-: 3 units (1,350 ml) ⚠️ Low
- A+: 8 units (3,600 ml) ⚠️ Medium
- A-: 0 units ❌ Critical
- B+: 12 units (5,400 ml) ✓ Full
- B-: 5 units (2,250 ml) ⚠️ Medium
- AB+: 2 units (900 ml) ❌ Low
- AB-: 1 unit (450 ml) ❌ Critical

**Database Query**:
```sql
SELECT 
  blood_type,
  COUNT(*) as units,
  SUM(quantity_ml) as total_ml,
  expiry_date,
  status
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type, expiry_date
ORDER BY blood_type, expiry_date;
```

**What to highlight**:
- Real-time inventory status
- Unit and volume counts
- Expiry date tracking
- Status filtering (only 'available' shown)

---

### 2.5 Fulfill Blood Request
**Script**: 
"Good news! We have O+ blood available. Staff can now fulfill the hospital's request. Let's do that."

**Steps**:
1. Click on pending request from City Hospital
2. Click "Approve/Fulfill" button
3. Select blood units to allocate (or system auto-selects)
4. Add notes: "Allocated: 2 units of O+ (collected Feb 10, expires Mar 24)"
5. Click "Fulfill Request"

**Database Operations - Multiple Transactions**:

**Step 1**: Update Request Status
```sql
UPDATE blood_requests 
SET status = 'fulfilled', 
    fulfilled_date = NOW()
WHERE id = 1234;
```

**Step 2**: Update Blood Inventory (Mark units as allocated/used)
```sql
UPDATE blood_inventory
SET status = 'allocated'
WHERE blood_type = 'O+' 
AND status = 'available'
LIMIT 2;
```

**Step 3**: Create Fulfillment Record
```sql
INSERT INTO request_fulfillments (
  request_id,
  blood_type,
  units_allocated,
  allocated_date,
  staff_id
) VALUES (1234, 'O+', 2, NOW(), 5);
```

**Step 4**: Record in Audit Log
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
  'blood_requests',
  1234,
  'UPDATE',
  'staff',
  5,
  'Status changed from pending to fulfilled',
  NOW()
);
```

**Success Message**: "✓ Request fulfilled successfully! Hospital notified."

**What to highlight**:
- Multiple coordinated database updates
- Inventory automatically updated
- Audit trail created for compliance
- Hospital notified automatically

---

### 2.6 Record Blood Donation
**Script**: 
"Staff also records new blood donations as they come in from donors."

**Steps**:
1. Navigate to "Record Donation"
2. Fill in donation form:
   - Select Donor: John Smith
   - Blood Type: O+
   - Quantity: 450 ml (1 unit)
   - Collection Date: Feb 18, 2026
   - Notes: "Regular donation, passed all tests"
3. Click "Record Donation"

**Database Operations**:

**Step 1**: Create Donation Record
```sql
INSERT INTO donation_history (
  donor_id,
  blood_type,
  quantity_ml,
  donation_date,
  collection_date,
  status,
  notes
) VALUES (10, 'O+', 450, NOW(), '2026-02-18', 'completed', ?);
```

**Step 2**: Add to Blood Inventory
```sql
INSERT INTO blood_inventory (
  blood_type,
  quantity_ml,
  collection_date,
  expiry_date,
  donor_id,
  status,
  location
) VALUES (
  'O+',
  450,
  '2026-02-18',
  DATE_ADD('2026-02-18', INTERVAL 42 DAY),
  10,
  'available',
  'Blood Bank Storage'
);
```

**Step 3**: Update Donor Last Donation
```sql
UPDATE donors
SET last_donation_date = NOW()
WHERE id = 10;
```

**Step 4**: Record Audit Log
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
  [donation_id],
  'INSERT',
  'staff',
  5,
  'New donation recorded: O+ 450ml',
  NOW()
);
```

**Success Message**: "✓ Donation recorded successfully! Unit ID: O+-0042"

**What to highlight**:
- Automatic expiry date calculation (42 days)
- Inventory increases with new donations
- Donor tracking updated
- Full audit trail

---

## PART 3: REAL-TIME FEEDBACK LOOP (5 minutes)

### 3.1 Hospital Sees Updated Status
**Script**: 
"Now let's switch back to the hospital dashboard. They should see the request status updated in real-time."

**Steps**:
1. Switch to Hospital tab
2. Refresh "Request Status" page
3. Show request now marked as "✓ Fulfilled"
4. Show units allocated and expected delivery date

**Database Query** (Hospital-side):
```sql
SELECT * FROM blood_requests 
WHERE hospital_id = 9 AND id = 1234;
-- Result: status = 'fulfilled', fulfilled_date = Feb 18 14:30
```

**What to highlight**:
- Real-time data sync
- Hospital immediately notified
- Transparency in fulfillment process

---

### 3.2 Inventory Updates Automatically
**Script**: 
"Let's also verify that the inventory has been updated on the staff side."

**Steps**:
1. Switch to Staff tab
2. Navigate to "Inventory Management"
3. Show O+ now has 13 units (instead of 15) and 2 are marked as 'allocated'
4. Show new donation of O+ has been added
5. O+ now shows 14 units total

**Before**: O+ had 15 units (6,750 ml)
**After Request Fulfilled**: O+ has 13 units (5,850 ml) - 2 allocated
**After New Donation**: O+ has 14 units (6,300 ml)

**Database Verification**:
```sql
SELECT 
  blood_type,
  status,
  COUNT(*) as units,
  SUM(quantity_ml) as total
FROM blood_inventory
WHERE blood_type = 'O+'
GROUP BY status;
```

**What to highlight**:
- Automatic inventory deduction
- Real-time stock updates
- Prevents over-allocation (inventory control)

---

## PART 4: AUDIT TRAIL & COMPLIANCE (5 minutes)

### 4.1 View Audit Logs
**Script**: 
"All operations are tracked in our audit logs for compliance and accountability. Let's review what happened today."

**Steps**:
1. Navigate to Staff "Audit Logs" page
2. Show chronological list of all operations

**Sample Audit Log**:
```
Timestamp          | Action | Table          | Record | Staff Member | Details
-------------------+--------+----------------+--------+--------------+---------------------------
Feb 18 14:35 UTC   | INSERT | donation_history| 345   | Sarah Kumar  | New donation recorded: O+ 450ml
Feb 18 14:32 UTC   | UPDATE | blood_requests | 1234   | Sarah Kumar  | Status changed to fulfilled
Feb 18 14:31 UTC   | UPDATE | blood_inventory| 1050   | Sarah Kumar  | Status changed to allocated
Feb 18 14:30 UTC   | INSERT | audit_log      | 876   | Sarah Kumar  | Request fulfillment logged
Feb 18 10:15 UTC   | INSERT | blood_requests | 1234   | -            | New request from City Hospital
```

**Database Query**:
```sql
SELECT 
  al.timestamp,
  al.action,
  al.table_name,
  al.record_id,
  s.full_name as user_name,
  al.changes
FROM audit_log al
LEFT JOIN staff s ON al.user_id = s.id
ORDER BY al.timestamp DESC
LIMIT 50;
```

**What to highlight**:
- Complete audit trail
- Timestamps for all operations
- Staff accountability
- Compliance ready

---

### 4.2 Data Integrity Verification
**Script**: 
"Let's verify that all data is consistent across the system."

**Query Database Directly**:
```sql
-- Verify request was fulfilled
SELECT * FROM blood_requests WHERE id = 1234;
-- Status: fulfilled, fulfilled_date: 2026-02-18 14:32:00

-- Verify inventory was allocated
SELECT * FROM blood_inventory 
WHERE blood_type = 'O+' ORDER BY collection_date DESC LIMIT 2;
-- 2 units should be status 'allocated'
-- 1 new unit should be status 'available' (450ml)

-- Verify donation was recorded
SELECT * FROM donation_history 
WHERE id = (SELECT MAX(id) FROM donation_history);
-- John Smith's O+ donation should be there

-- Verify audit log entries exist
SELECT COUNT(*) FROM audit_log 
WHERE timestamp >= '2026-02-18 14:30:00';
-- Should be 4-5 entries
```

**What to highlight**:
- All tables consistently updated
- No orphaned records
- Data integrity maintained
- Referential integrity across tables

---

## PART 5: ADVANCED FEATURES DEMO (5 minutes)

### 5.1 Emergency Request Handling
**Script**: 
"Let's demonstrate how the system handles emergency blood requests differently - with higher priority."

**Steps**:
1. Hospital submits "Emergency Request"
2. Urgency: Emergency
3. Blood Type: AB-
4. Quantity: 3 units
5. Submit

**Database Operation**:
```sql
INSERT INTO blood_requests (
  hospital_id,
  blood_type,
  quantity_units,
  urgency,
  status,
  request_date
) VALUES (9, 'AB-', 3, 'emergency', 'pending', NOW());

-- This request appears at TOP of staff's pending list
-- Query includes: ORDER BY urgency DESC (emergency first)
```

**Staff Priority Queue**:
```sql
SELECT * FROM blood_requests 
WHERE status = 'pending'
ORDER BY 
  CASE WHEN urgency = 'emergency' THEN 1 ELSE 2 END ASC,
  request_date ASC;
```

**What to highlight**:
- Emergency requests prioritized
- Staff sees them at top of list
- Faster fulfillment for critical cases

---

### 5.2 Event Management & Donation Drives
**Script**: 
"Staff can also organize blood donation events to collect blood from donors."

**Steps**:
1. Navigate to "Event Management"
2. Create Event:
   - Title: "Downtown Blood Drive"
   - Date: Feb 25, 2026
   - Location: City Center Park
   - Expected Donors: 50
3. Click "Create Event"

**Database Operation**:
```sql
INSERT INTO events (
  title,
  date,
  start_time,
  end_time,
  location,
  expected_participants,
  status,
  created_by_id,
  created_by_name
) VALUES (
  'Downtown Blood Drive',
  '2026-02-25',
  '09:00:00',
  '17:00:00',
  'City Center Park',
  50,
  'upcoming',
  5,
  'Sarah Kumar'
);
```

**What to highlight**:
- Events can be created and tracked
- Expected donors vs actual
- Status changes (upcoming → completed)
- Helps plan inventory needs

---

### 5.3 Reports & Analytics
**Script**: 
"Finally, let's look at reports and analytics to understand system performance."

**Steps**:
1. Navigate to "Reports & Analytics"
2. Change period: Daily → Weekly → Monthly
3. Show statistics that change based on period

**Monthly Report Shows**:
- Total Donations: 156
- Total Collected: 70,200 ml
- Requests Fulfilled: 142
- Fulfillment Rate: 94%
- Blood Type Distribution: Visual breakdown
- Top Requested Types: A+, O+, B+

**Database Queries** (Dynamic based on period):
```sql
-- For selected period
SELECT 
  DATE(donation_date) as date,
  COUNT(*) as donations,
  SUM(quantity_ml) as volume,
  (SELECT COUNT(*) FROM blood_requests WHERE request_date = DATE(donation_date)) as requests,
  (SELECT COUNT(*) FROM blood_requests WHERE status = 'fulfilled' AND fulfilled_date = DATE(donation_date)) as fulfilled
FROM donation_history
WHERE donation_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
GROUP BY DATE(donation_date)
ORDER BY date DESC;
```

**What to highlight**:
- Performance metrics
- Data-driven insights
- Period-based filtering
- Visual analytics

---

## PART 6: DATABASE SCHEMA OVERVIEW (3 minutes)

**Script**: "Here's how the database is structured to support all these operations:"

### Key Tables:

**hospitals**
```
id | hospital_name | email | phone | address | city | bed_capacity | license_number
```

**blood_requests**
```
id | hospital_id | blood_type | quantity_units | urgency | status | request_date | fulfilled_date | notes
```

**blood_inventory**
```
id | blood_type | quantity_ml | collection_date | expiry_date | donor_id | status | location
```

**donation_history**
```
id | donor_id | blood_type | quantity_ml | donation_date | collection_date | status
```

**staff**
```
id | full_name | email | phone | department | blood_bank | employee_id | certification
```

**audit_log**
```
id | table_name | record_id | action | user_type | user_id | changes | timestamp
```

**events**
```
id | title | date | start_time | end_time | location | expected_participants | status | created_by_id
```

---

## Key Takeaways (2 minutes)

### What We Demonstrated:
1. ✓ **Hospital Workflow**: Login → Submit Request → Track Status
2. ✓ **Staff Workflow**: View Requests → Check Inventory → Fulfill Requests
3. ✓ **Real-time Sync**: Database updates instantly reflected across system
4. ✓ **Audit Trail**: Complete history of all operations
5. ✓ **Data Integrity**: All tables remain consistent
6. ✓ **Priority Handling**: Emergency requests prioritized
7. ✓ **Inventory Control**: Prevents over-allocation
8. ✓ **Analytics**: Track performance metrics

### System Benefits:
- **Efficiency**: Reduce blood request fulfillment time
- **Transparency**: Real-time status updates
- **Safety**: Complete audit trail for compliance
- **Scalability**: Handles multiple hospitals and requests
- **Reliability**: Data integrity through transactions
- **Accountability**: Every action tracked and logged

---

## Demo Checklist

- [ ] Hospital Login & Registration tested
- [ ] Submit blood request successful
- [ ] Staff Login & access verified
- [ ] Request appears in staff pending queue
- [ ] Inventory checked and sufficient
- [ ] Request fulfilled successfully
- [ ] Hospital notified of fulfillment
- [ ] Inventory updated correctly
- [ ] New donation recorded
- [ ] Audit log entries created
- [ ] Database consistency verified
- [ ] Emergency request prioritization works
- [ ] Reports display correct period data
- [ ] All navigation links working

---

## Questions to Answer

1. **Q**: How are requests prioritized?
   **A**: By urgency (emergency first) then by request date (oldest first)

2. **Q**: How is inventory accuracy maintained?
   **A**: Real-time updates when units are allocated or new donations recorded

3. **Q**: Is data safe?
   **A**: Yes - transactions ensure all-or-nothing operations, audit logs track changes

4. **Q**: How long is blood good for?
   **A**: 42 days from collection date, system tracks expiry automatically

5. **Q**: Can hospitals see other hospitals' requests?
   **A**: No - each hospital sees only their own requests (filtered by hospital_id)

6. **Q**: What if blood expires before use?
   **A**: Staff can mark as expired in inventory, it's removed from available stock

---

**End of Presentation**

*Total Time: ~45-50 minutes*
*Format: Live demo with explanation*
*Audience: Hospital administrators, blood bank managers, IT stakeholders*
