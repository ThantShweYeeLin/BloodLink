# BloodLink SQL Command Reference Guide
## PowerPoint Slide & UI Screen Mapping

---

## Overview
This document maps all 114 SQL commands in `group_no.sql` to specific PowerPoint slides and UI screens for submission presentation.

---

## SECTION 1: DATABASE SCHEMA & TABLE CREATION
### (PPT Slides 1-2: System Setup & Database Overview)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 1.1 | CREATE TABLE donors | Donor Registration | Store donor account & profile data | Slide 2-3 |
| 1.2 | CREATE TABLE hospitals | Hospital Registration | Store hospital account data | Slide 6 |
| 1.3 | CREATE TABLE staff | Staff Registration | Store blood bank staff records | Slide 10 |
| 1.4 | CREATE TABLE events | Event Management | Store donation event details | Slide 5 |
| 1.5 | CREATE TABLE event_participants | Event Registration | Track donor event participation | Slide 5 |
| 1.6 | CREATE TABLE blood_inventory | Inventory Management | Manage blood unit inventory | Slide 11 |
| 1.7 | CREATE TABLE blood_requests | Request Management | Store hospital blood requests | Slide 7-8 |
| 1.8 | CREATE TABLE donation_history | Donation History | Track all donations made | Slide 4 |
| 1.9 | CREATE TABLE audit_log | Audit Logs | Compliance & activity tracking | Slide 12 |

---

## SECTION 2: DATABASE TRIGGERS & FUNCTIONS
### (Auto-update timestamp functionality)

| Command ID | SQL Operation | Purpose | PPT Slide |
|-----------|---------------|---------|-----------|
| 2.1 | CREATE FUNCTION update_updated_at_column() | Auto-timestamp updates | Slide 1-2 |
| 2.2 | CREATE TRIGGER update_blood_inventory_updated_at | Track inventory changes | Slide 11 |
| 2.3 | CREATE TRIGGER update_events_updated_at | Track event modifications | Slide 5 |

---

## SECTION 3: AUTHENTICATION OPERATIONS
### (Login screens for all user types)

| Command ID | SQL Query | Screen | Purpose | PPT Slide |
|-----------|-----------|--------|---------|-----------|
| 3.1 | SELECT... donors by email | Donor Login | Authenticate donor user | Slide 3 |
| 3.2 | SELECT... hospitals by email | Hospital Login | Authenticate hospital user | Slide 6 |
| 3.3 | SELECT... staff by email | Staff Login | Authenticate staff member | Slide 10 |

---

## SECTION 4: DONOR OPERATIONS
### (PPT Slides 3-5: Donor-related features)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 4.1 | INSERT donors | Donor Registration | Register new donor account | Slide 3 |
| 4.2 | SELECT donor profile | Donor Dashboard | Display donor account info | Slide 3 |
| 4.3 | UPDATE donor profile | Donor Profile Edit | Modify personal information | Slide 3 |
| 4.4 | SELECT donation_history | Donation History | View all past donations | Slide 4 |
| 4.5 | SELECT donor eligibility | Donation Eligibility Check | Verify 56-day minimum elapsed | Slide 4 |
| 4.6 | SELECT available events | Event Browse | Show upcoming events to register | Slide 5 |
| 4.7 | INSERT event_participants | Event Registration | Register donor for event | Slide 5 |
| 4.8 | SELECT donor's events | Registered Events | View events donor joined | Slide 5 |

---

## SECTION 5: DONATION RECORDING OPERATIONS
### (Donation Recording Screen)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 5.1 | INSERT donation_history | Donation Recording | Record new blood donation | Donation Slide |
| 5.2 | UPDATE donor last_donation_date | Donation Recording | Update eligibility counter | Donation Slide |
| 5.3 | INSERT blood_inventory | Inventory Auto-create | Auto-add unit from donation | Slide 11 |

---

## SECTION 6: STAFF OPERATIONS & MANAGEMENT
### (PPT Slide 10: Staff Management)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 6.1 | INSERT staff | Staff Registration | Register new staff member | Slide 10 |
| 6.2 | SELECT staff profile | Staff Dashboard | View staff account info | Slide 10 |
| 6.3 | UPDATE staff profile | Staff Profile Edit | Modify staff information | Slide 10 |
| 6.4 | SELECT all staff | Staff Management | Admin view of all staff | Slide 10 |
| 6.5 | SELECT all donors | Donor Management | Staff view of donors | Staff Page |
| 6.6 | SELECT donor history | Donor Management History | View specific donor's donations | Staff Page |

---

## SECTION 7: INVENTORY MANAGEMENT OPERATIONS
### (PPT Slide 11: Blood Inventory Management)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 7.1 | SELECT all inventory | Inventory Dashboard | Display all blood units | Slide 11 |
| 7.2 | SELECT by blood_type | Inventory Filter | Filter units by blood type | Slide 11 |
| 7.3 | SELECT with COUNT/SUM | Inventory Summary | Show unit counts & volumes | Slide 11 |
| 7.4 | INSERT new supply | Add Supply Button | Manually add blood units | Slide 11 |
| 7.5 | UPDATE inventory unit | Edit Unit Button | Modify unit details | Slide 11 |
| 7.6 | DELETE inventory unit | Delete Unit | Remove expired/invalid units | Slide 11 |
| 7.7 | SELECT expiring units | Expiry Alert | Flag units expiring soon | Slide 11 |
| 7.8 | UPDATE unit status | Status Change | Mark used/expired/reserved | Slide 11 |

---

## SECTION 8: BLOOD REQUEST OPERATIONS (HOSPITAL)
### (PPT Slide 7: Hospital Submit Request)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 8.1 | INSERT blood_requests | Submit Request | Hospital submits blood request | Slide 7 |
| 8.2 | SELECT hospital's requests | Request Status | View hospital's own requests | Slide 7 |
| 8.3 | SELECT all pending requests | Request Management | Staff view of pending requests | Slide 8 |
| 8.4 | SELECT request details | Request Details | View complete request info | Slide 8 |

---

## SECTION 9: BLOOD REQUEST FULFILLMENT OPERATIONS (STAFF)
### (PPT Slide 8: Request Fulfillment)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 9.1 | UPDATE status to approved | Approve Button | Staff approves request | Slide 8 |
| 9.2 | UPDATE status to fulfilled | Fulfill Button | Staff fulfills request | Slide 8 |
| 9.3 | UPDATE inventory to used | Inventory Update | Mark units as used | Slide 11 |
| 9.4 | UPDATE status to cancelled | Reject Button | Staff rejects request | Slide 8 |
| 9.5 | UPDATE status to cancelled | Cancel Button | Cancel request | Slide 8 |

---

## SECTION 10: HOSPITAL OPERATIONS
### (PPT Slide 6: Hospital Management)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 10.1 | INSERT hospitals | Hospital Registration | Register new hospital | Slide 6 |
| 10.2 | SELECT hospital profile | Hospital Dashboard | View hospital account info | Slide 6 |
| 10.3 | UPDATE hospital profile | Hospital Profile Edit | Modify hospital details | Slide 6 |
| 10.4 | SELECT request statistics | Hospital Dashboard | Show request counts by status | Slide 6 |
| 10.5 | SELECT available inventory | Hospital Dashboard | Check blood availability | Slide 6 |

---

## SECTION 11: EVENT MANAGEMENT OPERATIONS (STAFF)
### (PPT Slide 5: Event Management)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 11.1 | INSERT events | Create Event Button | Staff creates donation event | Slide 5 |
| 11.2 | SELECT all events | Event List | Display all events | Slide 5 |
| 11.3 | SELECT event details | Event Details | View specific event info | Slide 5 |
| 11.4 | SELECT participants | Participants List | View registered donors | Slide 5 |
| 11.5 | UPDATE event | Edit Event Button | Modify event details | Slide 5 |
| 11.6 | DELETE event | Delete Event Button | Remove event | Slide 5 |
| 11.7 | UPDATE participant status | Update Status | Change to Confirmed/Tentative/Cancelled | Slide 5 |

---

## SECTION 12: AUDIT LOG & COMPLIANCE OPERATIONS
### (PPT Slide 12: Audit Logs)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 12.1 | INSERT audit_log (INSERT) | Audit Trail | Log new record creation | Slide 12 |
| 12.2 | INSERT audit_log (UPDATE) | Audit Trail | Log record modifications | Slide 12 |
| 12.3 | INSERT audit_log (DELETE) | Audit Trail | Log record deletions | Slide 12 |
| 12.4 | SELECT audit log | Audit Logs Screen | Display all audit entries | Slide 12 |
| 12.5 | SELECT by user | Audit by User | Filter logs by user | Slide 12 |
| 12.6 | SELECT by table | Audit by Table | Filter logs by table | Slide 12 |

---

## SECTION 13: DASHBOARD & REPORTING QUERIES
### (Various Dashboard Screens)

| Command ID | SQL Operation | Screen | Purpose | PPT Slide |
|-----------|---------------|--------|---------|-----------|
| 13.1 | SELECT donor statistics | Donor Dashboard | Show summary metrics | Slide 3 |
| 13.2 | SELECT inventory summary | Staff Dashboard | Inventory overview | Slide 11 |
| 13.3 | SELECT request summary | Staff Dashboard | Request statistics | Slide 8 |
| 13.4 | SELECT hospital requests | Hospital Dashboard | Hospital request overview | Slide 6 |
| 13.5 | SELECT blood availability | Hospital Dashboard | Available units by type | Slide 6 |
| 13.6 | SELECT inventory report | Reports Screen | Full inventory analysis | Reports |
| 13.7 | SELECT donation report | Reports Screen | Donation activity trends | Reports |
| 13.8 | SELECT fulfillment report | Reports Screen | Hospital fulfillment rates | Reports |

---

## SECTION 14: DATA VALIDATION & UTILITY QUERIES
### (Database verification & maintenance)

| Command ID | SQL Operation | Purpose | PPT Slide |
|-----------|---------------|---------|-----------|
| 14.1 | SELECT table counts | Verify schema creation | Slide 1-2 |
| 14.2 | SELECT expired units | Identify disposal candidates | Slide 11 |
| 14.3 | SELECT emergency requests | Flag high-priority needs | Slide 8 |
| 14.4 | SELECT eligible donors | Find donors for solicitation | Slide 4 |

---

## PowerPoint Slide Mapping Summary

| PPT Slide | Topic | SQL Commands | Count |
|-----------|-------|--------------|-------|
| 1-2 | System Setup / DB Schema | 1.1-1.9, 2.1-2.3, 14.1 | 13 |
| 3 | Donor Registration/Profile | 1.1, 3.1, 4.1-4.3, 13.1 | 6 |
| 4 | Donation History | 1.8, 4.4-4.5, 5.1-5.2, 14.4 | 6 |
| 5 | Event Management | 1.4-1.5, 4.6-4.8, 11.1-11.7 | 11 |
| 6 | Hospital Management | 1.2, 3.2, 10.1-10.5 | 5 |
| 7-8 | Blood Requests | 1.7, 3.3, 8.1-8.4, 9.1-9.5, 13.3, 13.8, 14.3 | 12 |
| 10 | Staff Management | 1.3, 3.3, 6.1-6.6 | 8 |
| 11 | Inventory Management | 1.6, 2.2, 7.1-7.8, 9.3, 13.2, 13.6, 14.2 | 15 |
| 12 | Audit Logs/Compliance | 1.9, 2.1-2.3, 12.1-12.6 | 9 |
| Reports | Reporting/Dashboard | 13.1-13.8 | 8 |
| **Total** | | | **93** |

---

## Demo Test Accounts

All demo accounts use password: `Test123!`
Bcrypt Hash: `$2a$10$Bxj4TuC9lmJkaLndBAopLer1zM7GHHdrnmpMDHervpm7bKO7TeOhW`

### Donor Accounts
- `alex@donor.com` - Alex Donor (O+)
- `jamie@donor.com` - Jamie Donor (A-)
- `min@gmail.com` - Min (O+)

### Hospital Accounts
- `hospital@bloodlink.com` - City General Hospital
- `contact@stmarys.com` - St. Mary's Medical Center
- `info@memorial.org` - Memorial Hospital

### Staff Accounts
- `staff@bloodlink.com` - Taylor Staff (Collection)
- `jordan.smith@lifelink.com` - Jordan Smith (Testing)
- `casey.martinez@lifelink.com` - Casey Martinez (Admin)
- `riley.johnson@lifelink.com` - Riley Johnson (Collection)
- `sam.lee@lifelink.com` - Sam Lee (Processing)

---

## Notes for Submission

1. **SQL File Organization**: The `group_no.sql` file contains all 114 commands organized in 14 sections
2. **Command Numbering**: Each command has a unique ID (e.g., 1.1, 3.2, 7.5) for easy reference
3. **PPT Integration**: Comments in the SQL file reference specific PowerPoint slide numbers
4. **Feature Mapping**: Each command is mapped to specific UI screens and buttons
5. **Test Data**: Demo accounts and sample data included for presentation demonstration

---

## How to Use This Document

1. **For PowerPoint Presentation**: Reference the "PowerPoint Slide Mapping Summary" table to show which SQL commands support each slide
2. **For Live Demo**: Use the test accounts listed above to demonstrate each feature
3. **For Code Review**: Use the command reference to show implementation of each feature
4. **For Database Verification**: Run Section 14 queries to validate database state

---

*Document Version: Final Submission*
*Date: February 17, 2026*
*Database: MySQL/PostgreSQL Compatible*
