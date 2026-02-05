# BloodLink - Complete Relational Database Model

## Entity-Relationship Diagram (ERD) - Presentation Layout

```
┌────────────────────────────────────────┐
│  BLOODLINK RELATIONAL MODEL (COMPACT)  │
└────────────────────────────────────────┘

┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│   DONORS    │  │ HOSPITALS   │  │    STAFF    │
├─────────────┤  ├─────────────┤  ├─────────────┤
│ id (PK)     │  │ id (PK)     │  │ id (PK)     │
│ email (UQ)  │  │ email (UQ)  │  │ email (UQ)  │
│ blood_type  │  │ license_num │  │ dept(CK)    │
│ last_donat  │  │ bed_capacity│  │ cert        │
└─────────────┘  └─────────────┘  └─────────────┘
        │                │                │
        │ (1:N)          │ (1:N)          │ (1:N)
        │                │                │
        ▼                ▼                ▼
    ┌──────────┐   ┌──────────────┐  ┌────────────┐
    │DONATION_ │   │BLOOD_        │  │ EVENTS     │
    │HISTORY   │   │REQUESTS      │  ├────────────┤
    ├──────────┤   ├──────────────┤  │ id (PK)    │
    │id (PK)   │   │ id (PK)      │  │ date       │
    │donor_id  │   │hospital_id   │  │created_by  │◄── STAFF
    │ blood_   │   │ blood_type   │  │created_by_ │    creates
    │ type     │   │ quantity_ml  │  │ name       │    events
    │staff_id  │   │ urgency      │  └────────────┘
    │ date     │   │ status       │        ▲
    └──────────┘   │fulfilled_date│        │(1:N)
         │         └──────────────┘    ┌───┴─────────┐
         │(1:N) from                   │EVENT_       │
         │         ┌────────────────┐  │PARTICIPANTS│
         └────────►│BLOOD_INVENTORY │  ├─────────────┤
                   ├────────────────┤  │ id (PK)     │
                   │ id (PK)        │  │ event_id    │
                   │ donor_id (FK)  │  │ donor_id    │
                   │ blood_type     │  │ status      │
                   │ quantity_ml    │  └─────────────┘
                   │ status         │◄── STAFF manages
                    │expiry_date     │◄── matched by
                   │collection_date │    blood_type &
                   │updated_at      │    quantity to
                   └────────┬───────┘    BLOOD_
                            │(N:N)       REQUESTS
                            │ blood_type
                            │ quantity
                            ▼
                   ┌──────────────────┐
                   │ BLOOD_REQUESTS   │
                   │ fulfilled from   │
                   │ BLOOD_INVENTORY  │
                   └──────────────────┘
                   STAFF ships units ─────────► Hospital inventory
                   (fulfillment/delivery)

═══════════════════════════════════════════════════

        ┌──────────────────────────┐
        │     AUDIT_LOG            │
        │ (Compliance Tracking)    │
        ├──────────────────────────┤
        │ user_type (donor/hosp/   │
        │           staff/admin)   │◄── tracks STAFF, 
        │ user_id                  │    HOSPITALS,
        │ table_name | record_id   │    DONORS
        │ action | changes | time  │    actions
        └──────────────────────────┘
```

---

## Blood Request Fulfillment Workflow (Step-by-Step)

### **Step 1: Hospital Submits Request**
- Hospital admin goes to "Submit Blood Request" page
- Fills in: blood_type (e.g., O+), quantity_ml (e.g., 2000), urgency (urgent/routine)
- System creates entry in **BLOOD_REQUESTS** table with status='pending'
- Hospital receives unique Request ID (REQ-2026-00015)

### **Step 2: Staff Views Pending Request**
- Staff member logs in and sees request in "Request Management" page
- Staff sees:
  - Hospital name
  - Blood type needed
  - Quantity needed  
  - Urgency level
  - Request date & deadline

### **Step 3: Staff Checks Inventory**
- Staff clicks request → system automatically checks **BLOOD_INVENTORY**
- Queries: SELECT * FROM blood_inventory WHERE blood_type = 'O+' AND status = 'available'
- Staff sees available units:
  - Unit ID: INV-00234 (450ml, expires in 12 days)
  - Unit ID: INV-00235 (450ml, expires in 8 days)
  - Unit ID: INV-00236 (450ml, expires in 15 days)
  - Unit ID: INV-00237 (450ml, expires in 20 days)
  - Unit ID: INV-00238 (450ml, expires in 25 days)
  - **Total: 2250ml available (5 units)**

### **Step 4: Staff Fulfills Request**
- Staff selects units to fulfill (picks 5 units = 2250ml to match 2000ml request with buffer)
- System updates BLOOD_INVENTORY:
  - INV-00234: status = 'reserved' → 'used'
  - INV-00235: status = 'reserved' → 'used'
  - INV-00236: status = 'reserved' → 'used'
  - INV-00237: status = 'reserved' → 'used'
  - INV-00238: status = 'reserved' → 'used'

### **Step 5: System Updates Request Status**
- Updates BLOOD_REQUESTS record:
  - status = 'pending' → 'approved' → 'fulfilled'
  - fulfilled_date = NOW()
  - Audit log entry created documenting who fulfilled it & when

### **Step 6: Hospital Receives Notification**
- Hospital admin gets notification: "Request REQ-2026-00015 FULFILLED"
- Can see in "Request Status" page:
  - **Requested:** 5 units O+ (2250ml)
  - **Fulfilled:** 5 units O+ (2250ml) ✓ Complete
  - **Units:** INV-00234, INV-00235, INV-00236, INV-00237, INV-00238
  - **Delivery status:** Ready for pickup/dispatch

### **Step 7: Donors See Impact**
- Each donor who provided blood can see in their **Donation History**:
  - "Your blood from Jan 15 (INV-00234) was used to fulfill Hospital Request REQ-2026-00015 on Jan 20"
  - Gives transparency into donation impact

---

## Complete Relationships Matrix

| From | To | Type | Through | Purpose |
|------|-----|------|---------|---------|
| DONORS | DONATION_HISTORY | 1:N | donor_id FK | Records each donation |
| DONORS | BLOOD_INVENTORY | 1:N | donor_id FK | Tracks blood from donor |
| DONORS | EVENT_PARTICIPANTS | 1:N | donor_id | Donor registers for events |
| HOSPITALS | BLOOD_REQUESTS | 1:N | hospital_id FK | Hospital makes requests |
| BLOOD_INVENTORY | BLOOD_REQUESTS | N:N | blood_type + quantity | Fulfillment: inventory fills requests |
| STAFF | DONATION_HISTORY | 1:N | staff_id FK | Staff records donations |
| STAFF | BLOOD_INVENTORY | 1:N | implied | Staff manages inventory |
| STAFF | BLOOD_REQUESTS | 1:N | implied | Staff fulfills requests |
| STAFF | EVENTS | 1:N | created_by_id FK | Staff creates events |
| EVENTS | EVENT_PARTICIPANTS | 1:N | event_id FK | Event has many participants |
| ALL TABLES | AUDIT_LOG | N:1 | table_name + record_id | All changes logged |

---

## Key Features Highlighted in Diagram

✅ **Arrows show data flow:**
- DONORS → DONATION_HISTORY → BLOOD_INVENTORY (donation collection pipeline)
- DONORS → EVENT_PARTICIPANTS → EVENTS ← STAFF (event management)
- HOSPITALS → BLOOD_REQUESTS ← BLOOD_INVENTORY (fulfillment workflow)
- STAFF connects to: donations recording, inventory management, request fulfillment, event creation

✅ **Staff role is central to operations:**
- Records donations from donors
- Manages blood inventory
- Fulfills requests from hospitals
- Creates and coordinates blood drives
- All actions logged for compliance

✅ **Request fulfillment workflow shown:**
- Hospital submits request (BLOOD_REQUESTS created)
- Staff checks BLOOD_INVENTORY availability
- Staff matches blood units to request
- BLOOD_INVENTORY units marked as 'used'
- BLOOD_REQUESTS marked as 'fulfilled'
- Hospital receives units

✅ **Audit trail captures everything:**
- When donor registered
- When blood was collected
- When inventory status changed
- When request was submitted
- Who fulfilled the request
- When donation impact was tracked

---

## Database Version: PostgreSQL 12+
Last Updated: February 4, 2026
