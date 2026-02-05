# Life Link - Demonstration & Navigation Guide

## Project Overview
Life Link is a comprehensive blood donation management system with three main user roles: **Donors**, **Hospitals**, and **Staff**. This script provides a guided walkthrough of all features and pages.

---

## 🩸 DONOR PORTAL

### Access
- **Login Page**: `http://localhost:5173/BloodLink/login-donor.html`
- **Register**: New donors can create accounts with email, phone, blood type, and location

### 1. **Donor Dashboard** (`/donor/dashboard.html`)
**Purpose**: Main hub for donors showing overview of account and next steps

**Demo Script**: 
> "Alex logs in to his donor portal where he immediately sees his dashboard. Notice the green eligibility indicator showing he's eligible to donate today. The dashboard summarizes his last donation on January 15th, and he's made 4 donations total. The interface is clean and simple—with quick access buttons to schedule a donation, view his complete history, or find upcoming blood drives in his area. See the notification badge here? That tells him there's 1 blood drive happening soon that he might be interested in."

---

### 2. **Donor Profile** (`/donor/pages/donor-profile.html`)
**Purpose**: View and manage personal information

**Demo Script**: 
> "Let's click on the Profile tab. Here Alex can view and edit all his personal information—his full name, email, phone number, date of birth, and address. Notice his blood type is clearly displayed as O+, and his account shows as verified with a green checkmark. If Alex needed to update his phone number or address, he'd simply click the Edit button, make his changes, and save. The system also tracks when his profile was last updated—you can see it here at the bottom. For security, there's a separate Change Password option that requires his current password before making any updates."

---

### 3. **Donation History** (`/donor/pages/donor-donation-history.html`)
**Purpose**: Review past donations and test results

**Demo Script**: 
> "On the Donation History page, Alex gets a clean, tabular view of past donations. Each row shows the donation date, the quantity collected, the status, the test result, and the location. For example, you can see two completed donations with test results marked as Pass, one pending donation still in review, and one cancelled entry with N/A for test results. At the top, there are simple filters for date range and status, plus an option to download the table as a CSV report. This page is focused on auditability—quickly confirming what was collected, where it happened, and the lab outcome." 

---

### 4. **Donation Eligibility** (`/donor/pages/donor-eligibility.html`)
**Purpose**: Check if eligible to donate today

**Demo Script**: 
> "This is one of the most helpful features—the Eligibility Check. See the large green checkmark? This tells Alex he's eligible to donate today. The system automatically calculates eligibility based on his last donation date. In most regions, donors must wait at least 56 days between whole blood donations, so the system enforces this waiting period. Below the status, you'll see a comprehensive health requirements checklist: age 17-65, weight over 50kg, no recent illnesses, no active medications that would defer donation. There's even a BMI calculator integrated right here so donors can quickly check if they meet weight requirements. If Alex weren't eligible, the system would show a red indicator and clearly explain why—maybe '18 days remaining until next eligible donation' or 'Recent travel to malaria-endemic area.' This prevents donors from making unnecessary trips to donation centers."

---

### 5. **Find Blood Drives** (`/donor/pages/donor-events.html`)
**Purpose**: Discover and register for blood donation events

**Demo Script**: 
> "Let's look at the Blood Drives page. Here Alex can discover upcoming donation events in his area. See this list? There's a Downtown Blood Drive on February 15th from 9 AM to 2 PM at the Downtown Center, expecting about 120 donors. Below that is a Campus Donation Day on March 1st at State University. Each event card shows the key details: date, time, location, and how many donors are expected. If Alex clicks on an event, he gets more details like parking information, whether walk-ins are welcome, or if there are any special requirements. The big blue 'Register' button lets him sign up instantly. Once registered, the event appears in his dashboard, and he'll receive reminder notifications a day before. This makes it super convenient for donors to plan ahead and find convenient locations near their home or work."

---

### 6. **Appointment Management** (`/donor/pages/donor-appointments.html`)
**Purpose**: Schedule and manage donation appointments
- **Features**:
  - Schedule new appointment with date/time picker
  - View confirmed appointments
  - Receive appointment reminders
  - Cancel appointments with reason
  - Select preferred location

**Demo Flow**: 
> Click Appointments → Show existing appointment → Click Schedule New → Pick date/time → Submit → Confirmation

---

### 7. **Donor Rewards** (`/donor/pages/donor-rewards.html`)
**Purpose**: Track rewards and incentives for donations
- **Features**:
  - Loyalty points earned from donations
  - Redemption options (certificates, discounts, merchandise)
  - Point balance and history
  - Achievement badges
  - Referral rewards

**Demo Flow**: 
> Click Rewards → Show total points earned → Show available rewards → Click Redeem → Select reward

---

### 8. **Notifications** (`/donor/pages/donor-notifications.html`)
**Purpose**: View all system notifications and alerts
- **Features**:
  - Donation reminders
  - Eligibility notifications
  - Event announcements
  - Blood request alerts (when blood type needed urgently)
  - Mark as read/unread
  - Push notification preferences

**Demo Flow**: 
> Click Notifications → Show unread alerts → Click one → Show details → Mark as read

---

### 9. **FAQ** (`/donor/pages/donor-faq.html`)
**Purpose**: Self-help resources and frequently asked questions
- **Features**:
  - Common questions about donation process
  - Health and safety information
  - Eligibility criteria detailed
  - Payment/compensation info
  - Contact support link
  - Expandable Q&A sections

**Demo Flow**: 
> Click FAQ → Search for "when can I donate" → Show answer with timeline

---

## 🏥 HOSPITAL PORTAL

### Access
- **Login Page**: `http://localhost:5173/BloodLink/login-hospital.html`
- **Register**: Hospital admin registers with license, contact info, address

### 1. **Hospital Dashboard** (`/hospital/dashboard.html`)
**Purpose**: Overview of blood supply status and request management

**Demo Script**: 
> "Now let's switch to the Hospital perspective. Dr. Morgan from City General Hospital logs in and immediately sees the hospital dashboard. The most prominent feature here is the blood inventory overview—you can see current stock levels for all eight blood types arranged in a visual grid. Notice the O+ shows 12 units available with a green indicator, but look at AB- over here—it's at 0 units with a red critical alert. This color-coded system helps hospital staff quickly identify shortages. At the top, we see summary cards: 3 pending blood requests waiting to be fulfilled, 18 requests successfully fulfilled this month, and an alert about 2 units expiring in the next 3 days. Below that is the recent activity feed showing the latest request submissions and fulfillments. This dashboard gives hospital administrators a complete real-time picture of their blood supply situation."

---

### 2. **Submit Blood Request** (`/hospital/pages/hospital-submit-request.html`)
**Purpose**: Create urgent or routine blood requests

**Demo Script**: 
> "When the hospital needs blood, they use the Submit Blood Request form. Let me walk you through a typical scenario: City General Hospital has a patient who needs 5 units of O+ blood for an upcoming surgery. Dr. Morgan clicks 'Submit Request,' selects O+ from the blood type dropdown, enters the quantity—let's say 5 units which is 2,250 milliliters. The urgency level has three options: routine for scheduled procedures, urgent for same-day needs, or critical for life-threatening emergencies. In this case, it's a scheduled surgery tomorrow, so she selects 'urgent.' She can optionally add patient details or special requirements—like if the blood needs to be CMV-negative for an immunocompromised patient, or irradiated for transplant patients. Once submitted, the system generates a unique Request ID—let's say REQ-2026-00015—and the request immediately appears in the blood bank staff's queue. Dr. Morgan receives a confirmation message and can now track this request's status in real-time."

---

### 3. **Request Status/History** (`/hospital/pages/hospital-request-status.html` & `/hospital-request-history.html`)
**Purpose**: Track submitted requests and their fulfillment status
- **Features**:
  - Active requests with current status (pending/partial/fulfilled)
  - Quantity fulfilled vs requested
  - Timeline from submission to fulfillment
  - Assign blood units to specific requests
  - Cancel requests (with reason)
  - Historical log of past requests
  - Export request data

**Demo Flow**: 
> Click Request History → Show completed request → Click to see fulfillment timeline → Show units assigned

---

### 4. **Emergency Request** (`/hospital/pages/hospital-emergency-request.html`)
**Purpose**: Handle critical blood shortages with priority processing
- **Features**:
  - Fast-track submission (minimal form)
  - Immediate availability check
  - Emergency notification to staff
  - SMS/Email alerts to blood donors (O+ emergency pool)
  - Auto-assign available units
  - Direct communication with staff coordinator
  - Priority queue status

**Demo Flow**: 
> Click Emergency → Fill minimal form → Check available units → Submit → Staff notification badge appears

---

### 5. **Blood Inventory** (`/hospital/pages/hospital-inventory.html`)
**Purpose**: Manage hospital's blood stock and expiry tracking
- **Features**:
  - Current inventory by blood type and unit ID
  - Expiry dates and days remaining
  - Storage location/refrigerator tracking
  - Test results status
  - Mark units as expired
  - Track usage (transfused/wasted/transferred)
  - Inventory reports

**Demo Flow**: 
> Click Inventory → Show current stock by type → Highlight expiring units in red → Click unit → See full details

---

### 6. **Analytics & Reports** (`/hospital/pages/hospital-analytics.html`)
**Purpose**: Data-driven insights into blood usage patterns
- **Features**:
  - Usage trends (monthly/quarterly)
  - Blood type demand analysis
  - Fulfillment rate statistics
  - Request response time metrics
  - Cost per unit analysis
  - Comparative reports
  - Export to PDF/CSV

**Demo Flow**: 
> Click Analytics → Show graph of blood usage over 6 months → Highlight O+ is most requested → Show fulfillment rate

---

### 7. **Hospital Profile** (`/hospital/pages/hospital-profile.html`)
**Purpose**: Manage hospital account and settings
- **Features**:
  - Hospital name and contact info
  - License number and verification status
  - Address and service areas
  - Admin user management
  - API key management
  - Notification preferences
  - Change password

**Demo Flow**: 
> Click Profile → Show hospital details → Edit phone number → Click Save → Show success message

---

### 8. **Notifications** (`/hospital/pages/hospital-notifications.html`)
**Purpose**: Alerts about blood availability and requests
- **Features**:
  - Request fulfillment notifications
  - Low inventory alerts
  - Donor eligibility notifications
  - System maintenance notices
  - Emergency declarations
  - Notification preferences (email, SMS, in-app)

**Demo Flow**: 
> Click Notifications → Show recent "O- available" notification → Click to view details

---

## 👤 STAFF PORTAL

### Access
- **Login Page**: `http://localhost:5173/BloodLink/login-staff.html`
- **Register**: Blood bank staff registers with certification and department

### 1. **Staff Dashboard** (`/staff/dashboard.html`)
**Purpose**: Blood bank staff main hub for daily operations

**Demo Script**: 
> "Finally, let's look at the Staff portal. Taylor, a certified phlebotomist at Life Link Central Blood Bank, logs into the staff dashboard. This is mission control for blood bank operations. Right at the top, Taylor sees today's schedule: 3 donors are scheduled to come in today, with appointments at 9 AM, 11 AM, and 2 PM. Below that is the pending hospital requests queue—currently showing 2 urgent requests that need to be fulfilled. The blood inventory summary displays current stock: 45 units of O+, 12 units of A-, 8 units of B+, and so on across all blood types. Taylor can also see the team status—who's currently on duty, who's collecting donations, who's processing lab tests. At the bottom, there's a progress bar showing they've collected 28 out of their monthly target of 150 units. Quick action buttons let Taylor jump straight to recording a new donation, checking a donor in, or fulfilling a hospital request. Everything a blood bank staff member needs is right here at their fingertips."

---

### 2. **Staff Profile** (`/staff/pages/staff-profile.html`)
**Purpose**: Personal account and staff statistics

**Demo Script**: 
> "Let's check out Taylor's staff profile. At the top, we see Taylor's full name, employee ID EMP-001, and certification as a Certified Phlebotomist. The profile shows Taylor has been with Life Link Central for 1.8 years—the system automatically calculates years of service from the registration date. Now here's what makes this profile really motivating: performance statistics. Taylor has managed 3 blood drive events and personally recorded 12 donations this month. These stats help staff members track their contributions and the blood bank can use this data for performance reviews. Below the stats is Taylor's contact information—phone number, email, and department assignment (collection). The verification status shows a green checkmark, indicating Taylor's certification credentials have been verified by the system administrator. If Taylor needs to update any information or change the password, those options are right here. It's a comprehensive view of both professional credentials and performance metrics."

---

### 3. **Donor Management** (`/staff/staff-donor-management.html`)
**Purpose**: Comprehensive donor database and management

**Demo Script**: 
> "The Donor Management page is Taylor's tool for managing the entire donor database. At the top is a search bar—let's search for 'Alex Donor.' The system instantly filters the table and shows Alex's record. We can see at a glance: full name, blood type O+, phone number, email address, last donation date January 15th, and current eligibility status showing a green checkmark for eligible. If Taylor clicks on Alex's row, a detailed view expands showing his complete donation history—all 4 donations with dates, quantities, and locations. From here, Taylor can edit Alex's information if his phone number changed or address was updated. There's also a quick action to check real-time eligibility—the system calculates if enough days have passed since his last donation. The table shows all donors in the system—currently 47 active donors registered. Taylor can filter by blood type to find all O+ donors, filter by city to find donors in a specific area, or filter by eligibility status to contact only eligible donors for an urgent blood drive. There's even an 'Add New Donor' button for walk-ins who haven't registered online yet. This centralized database makes donor management incredibly efficient."

---

### 4. **Blood Drive Events** (`/staff/staff-donor-management.html#events`)
**Purpose**: Create and manage blood donation events
- **Features**:
  - Create new blood drive event
  - Set date, time, location, expected donors
  - Assign staff member to coordinate
  - Track registrations vs. expected
  - Manage event cancellations
  - Event notes and special instructions
  - Send invitations to eligible donors
  - Event completion and reporting

**Demo Flow**: 
> Click Events → Show upcoming blood drives → Click "Create Event" → Fill details → Set for Feb 20 → Submit

---

### 5. **Donation Recording** (`/public/donation-recording.html`)
**Purpose**: Record blood donations in real-time

**Demo Script**: 
> "Now let's walk through the critical process of recording a donation. A donor—let's say John Smith—has just completed his donation at today's blood drive. Taylor clicks 'Record Donation' and starts the process. First, Taylor selects John from the donor dropdown or searches by name or ID. The system immediately performs an eligibility verification check—confirming John hasn't donated in the last 56 days and meets all health requirements. Next, Taylor confirms the blood type—John is O+, which matches his profile. The quantity collected today is 450 milliliters, which is standard for a whole blood donation—Taylor enters this in the quantity field. Now comes the crucial part: blood test results. Every donation must pass several screening tests before it can be used. Taylor enters the results: blood type verification confirmed O+, HIV screening negative, Hepatitis B and C negative, Syphilis negative, blood count within normal range. All tests show green checkmarks—this donation is safe to use. If any test had failed, the system would automatically flag the unit as rejected and it would not enter the usable inventory. The system automatically calculates the expiry date—42 days from today's date, which would be March 18th, 2026. Taylor can also associate this donation with today's event—let's say the 'Downtown Blood Drive.' Finally, Taylor clicks 'Submit' and the system generates a unique donation ID—DON-2026-00234. John's donation is now officially recorded, the inventory is updated with one new O+ unit, and John's donation history shows this new entry. The entire process took less than 2 minutes, and the data is immediately available to hospitals requesting blood."

---

### 6. **Blood Inventory Management** (`/public/shared-pages/inventory-management.html`)
**Purpose**: Track and manage blood stock
- **Features**:
  - Current inventory levels by type
  - Add new blood units
  - Mark units as expired
  - Transfer units between storage locations
  - Usage tracking (transfused/discarded/transferred)
  - Expiry date alerts
  - Inventory reports
  - Storage location organization

**Demo Flow**: 
> Click Inventory → Show 12 units O+ available → Highlight 2 expiring in 3 days → Click "Mark Expired" → Update

---

### 7. **Hospital Request Management** (`/public/shared-pages/request-management.html`)
**Purpose**: Process and fulfill hospital blood requests
- **Features**:
  - View all pending requests from hospitals
  - Filter by urgency, blood type, status
  - Check available inventory for request
  - Assign blood units to request
  - Track fulfillment status
  - Generate delivery documentation
  - Close fulfilled requests
  - Request history and analytics

**Demo Flow**: 
> Click Requests → Show "Hospital A needs 5 O+" → Check inventory (8 available) → Click Fulfill → Select 5 units → Confirm

---

### 8. **Emergency Request Response** (`/public/shared-pages/emergency-requests.html`)
**Purpose**: Handle critical blood shortage alerts
- **Features**:
  - Emergency request queue with priority
  - Blood type availability checker
  - Quick fulfillment action
  - Notify donors if emergency pool needed
  - Track emergency response time
  - Emergency request history

**Demo Flow**: 
> Notification of emergency → Click Emergency Requests → See "Critical: AB- needed" → Check stock (0) → Activate donor pool alert

---

### 9. **Reports & Analytics** (`/public/shared-pages/reports.html`)
**Purpose**: Data analysis and performance metrics
- **Features**:
  - Donation collection trends
  - Blood type distribution reports
  - Request fulfillment statistics
  - Staff performance metrics
  - Donor retention analysis
  - Inventory turnover rates
  - Comparison with targets
  - Export reports as PDF

**Demo Flow**: 
> Click Reports → Show "Feb collections: 42 units" → Highlight top blood type "O+" → Show fulfillment rate 95%

---

### 10. **Audit Logs** (`/public/shared-pages/audit-logs.html`)
**Purpose**: Track all system activities for compliance
- **Features**:
  - Complete activity log (who, what, when, where)
  - Filter by user, action, date range
  - Track data changes
  - User login/logout records
  - Donation and inventory transactions
  - Request processing history
  - Compliance reporting

**Demo Flow**: 
> Click Audit Logs → Filter by "staff_id = 1" → Show all actions by current user → Highlight donation recording at 2:30 PM

---

---

## 📱 SHARED/COMMON PAGES

### 1. **Login Pages**
- **Donor**: Email/password authentication
- **Hospital**: Hospital ID/admin email + password
- **Staff**: Employee ID/email + password

### 2. **Donation Recording** (Shared by all staff)
- Used across the system to record donations
- Integrates with inventory system

### 3. **Request Management** (Staff view of hospital requests)
- Staff receives requests from hospitals
- Staff fulfills requests

---

## 🔑 KEY WORKFLOWS

### Workflow 1: A Donor Makes a Donation
1. Donor logs in
2. Checks eligibility (✓ Eligible)
3. Finds event → Registers
4. Staff checks in donor at event
5. Staff records donation (450ml O+, passes tests)
6. Blood unit entered into inventory
7. Donor sees donation in history
8. Points added to donor rewards

### Workflow 2: Hospital Requests Blood
1. Hospital admin submits request (5 units O+, urgent)
2. Request enters staff queue
3. Staff checks inventory (8 available)
4. Staff assigns 5 units to request
5. Request marked fulfilled
6. Hospital receives notification
7. Blood units reserved and marked for delivery

### Workflow 3: Emergency Situation
1. Hospital makes EMERGENCY request (AB- critical)
2. Staff gets priority alert
3. Checks inventory (0 available)
4. Activates emergency pool → SMS to AB- donors
5. Donor responds → Comes in
6. Staff records emergency donation
7. Hospital receives blood within 2 hours

---

## 📊 SAMPLE DATA

### Test Donors
- **John Smith**: O+, last donated Jan 15
- **Alex Johnson**: A-, last donated Jan 20
- **Sarah Lee**: AB+, last donated Dec 28

### Test Blood Drives
- Downtown Blood Drive (Feb 15)
- Campus Donation Day (Mar 1)
- Community Health Fair (Mar 10)

### Test Hospital Requests
- Hospital A: 5 units O+
- Hospital B: 3 units A-
- Hospital C: Emergency AB-

---

## 🎯 DEMO RECOMMENDATIONS

**For 5-minute demo**: 
1. Show donor login → profile → eligibility check
2. Show staff login → donor management → donation recording
3. Show hospital login → submit request → check status

**For 15-minute demo**:
1. Complete donor workflow (create profile, check eligibility, find event, register)
2. Complete staff workflow (check donations for day, record donation, update inventory)
3. Complete hospital workflow (submit request, track fulfillment)

**For full walkthrough**:
1. Go through all donor pages
2. Go through all hospital pages
3. Go through all staff pages
4. Demonstrate emergency workflow
5. Show reports and analytics

---

## 💡 Key Features to Highlight

✅ **User Roles**: Separate portals for donors, hospitals, staff
✅ **Donation Tracking**: Complete record from collection to transfusion
✅ **Blood Test Integration**: Pass/fail criteria for donations
✅ **Inventory Management**: Real-time stock tracking and expiry alerts
✅ **Request Processing**: Urgent and routine request handling
✅ **Analytics**: Data-driven insights and reporting
✅ **Audit Trail**: Complete compliance and accountability tracking
✅ **Responsive Design**: Mobile-friendly across all pages
✅ **Real-time Updates**: Instant notifications and status updates

---

**Demo Environment**: `http://localhost:5173/BloodLink/`

**Default Credentials** (after registration):
- Donor: Use registered email
- Hospital: Use registered hospital ID
- Staff: Use employee ID

