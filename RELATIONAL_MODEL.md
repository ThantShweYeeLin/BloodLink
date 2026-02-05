# BloodLink - Relational Database Model

## Entity-Relationship Diagram (ERD)

```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│                           BLOODLINK DATABASE SCHEMA                                     │
└─────────────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │     DONORS       │
                              ├──────────────────┤
                              │ id (PK)          │
                              │ full_name        │
                              │ email (UNIQUE)   │
                              │ phone            │
                              │ date_of_birth    │
                              │ blood_type       │◄──────────────┐
                              │ address          │               │
                              │ city             │               │
                              │ password_hash    │               │
                              │ registration_date│               │
                              │ last_donation    │               │
                              │ is_active        │               │
                              └──────────────────┘               │
                                     ▲                           │
                                     │                           │
                      ┌──────────────┤                           │
                      │              │                           │
                      │ (1:N)        │ (1:N)                     │
                      │              │                           │
         ┌────────────┴──────┐       │            ┌──────────────┴──────────┐
         │                   │       │            │                           
    ┌────┴─────────────┐   ┌┴─────----──┴─────┐   │   ┌──────────────────┐    
    │ DONATION_HISTORY │   │ BLOOD_INVENTORY  │   │   │ EVENT_PARTICIPANTS
    ├──────────────────┤   ├──────────────────┤   │   ├──────────────────┤
    │ id (PK)          │   │ id (PK)          │   │   │ id (PK)          │
    │ donor_id (FK)────┼──►│ donor_id (FK)────┼───┘   │ event_id (FK)────┼──┐
    │ donation_date    │   │ blood_type       │       │ donor_id         │  │
    │ blood_type       │   │ quantity_ml      │       │ name             │  │
    │ quantity_ml      │   │ location         │       │ blood            │  │
    │ location         │   │ expiry_date      │       │ status           │  │
    │ staff_id (FK)────┼──►│ collection_date  │       │ registered       │  │
    │ notes            │   │ status           │       │ created_at       │  │
    │ created_at       │   │ created_at       │       └──────────────────┘  │
    └────────────────────   │ updated_at       │                            │
                            └──────────────────┘                            │
                                                                            │
                            ┌──────────────────┐                            │
                            │     EVENTS       │                            │
                            ├──────────────────┤                            │
                            │ id (PK)          │◄───────────────────────────┘
                            │ title            │
                            │ date             │
                            │ start_time       │
                            │ end_time         │
                            │ location         │
                            │ expected         │
                            │ notes            │
                            │ created_by_type  │
                            │ created_by_id    │
                            │ created_by_name  │
                            │ created_at       │
                            │ updated_at       │
                            └──────────────────┘


┌──────────────────────┐                         ┌──────────────────────┐
│     HOSPITALS        │                         │       STAFF          │
├──────────────────────┤                         ├──────────────────────┤
│ id (PK)              │                         │ id (PK)              │
│ hospital_name        │                         │ full_name            │
│ license_number (UNIQ)│                         │ employee_id (UNIQUE) │
│ contact_person       │                         │ certification        │
│ email (UNIQUE)       │                         │ email (UNIQUE)       │
│ phone                │                         │ phone                │
│ address              │                         │ blood_bank_name      │
│ city                 │                         │ department           │
│ bed_capacity         │                         │ address              │
│ password_hash        │                         │ password_hash        │
│ registration_date    │                         │ registration_date    │
│ is_verified          │                         │ is_verified          │
│ is_active            │                         │ is_active            │
└──────────────────────┘                         └──────────────────────┘
         ▲                                                  ▲
         │ (1:N)                                           │ (1:N)
         │                                                 │
         └──────────────────────┬──────────────────────────┘
                                │
                        ┌───────┴─────────┐
                        │                 │
                   ┌────┴──────────────┐  │
                   │  BLOOD_REQUESTS   │  │
                   ├───────────────────┤  │
                   │ id (PK)           │  │
                   │ hospital_id (FK)──┼──┘
                   │ blood_type        │
                   │ quantity_ml       │
                   │ urgency           │
                   │ status            │
                   │ request_date      │
                   │ required_by_date  │
                   │ fulfilled_date    │
                   │ notes             │
                   └───────────────────┘


                        ┌──────────────────┐
                        │   AUDIT_LOG      │
                        ├──────────────────┤
                        │ id (PK)          │
                        │ table_name       │
                        │ record_id        │
                        │ action           │
                        │ user_type        │
                        │ user_id          │
                        │ changes          │
                        │ timestamp        │
                        └──────────────────┘
```

---

## Table Definitions

### 1. **DONORS**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique donor identifier |
| full_name | VARCHAR(255) | NOT NULL | Donor's full name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email for login & contact |
| phone | VARCHAR(50) | NOT NULL | Contact phone number |
| date_of_birth | DATE | NOT NULL | For eligibility calculations |
| blood_type | VARCHAR(10) | NOT NULL | Blood type (O+, O-, A+, etc.) |
| address | VARCHAR(500) | NOT NULL | Street address |
| city | VARCHAR(100) | NOT NULL | City of residence |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| registration_date | TIMESTAMP | DEFAULT NOW() | Account creation date |
| last_donation_date | DATE | NULLABLE | Tracks last donation for 56-day rule |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

**Indexes**: blood_type, email

---

### 2. **HOSPITALS**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique hospital identifier |
| hospital_name | VARCHAR(255) | NOT NULL | Official hospital name |
| license_number | VARCHAR(100) | UNIQUE, NOT NULL | Government license |
| contact_person | VARCHAR(255) | NOT NULL | Primary contact name |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email for login & notifications |
| phone | VARCHAR(50) | NOT NULL | Main phone line |
| address | VARCHAR(500) | NOT NULL | Hospital address |
| city | VARCHAR(100) | NOT NULL | Hospital city |
| bed_capacity | INT | NOT NULL | Number of hospital beds |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| registration_date | TIMESTAMP | DEFAULT NOW() | Account creation date |
| is_verified | BOOLEAN | DEFAULT FALSE | Admin verification status |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

**Indexes**: license_number, email

---

### 3. **STAFF**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique staff member identifier |
| full_name | VARCHAR(255) | NOT NULL | Staff member's full name |
| employee_id | VARCHAR(100) | UNIQUE, NOT NULL | Staff employee ID |
| certification | VARCHAR(100) | NOT NULL | Professional certification |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Work email for login |
| phone | VARCHAR(50) | NOT NULL | Work phone number |
| blood_bank_name | VARCHAR(255) | NOT NULL | Which blood bank they work for |
| department | VARCHAR(20) | IN('collection', 'testing', 'processing', 'storage', 'inventory', 'admin') | Department assignment |
| address | VARCHAR(500) | NOT NULL | Work address |
| password_hash | VARCHAR(255) | NOT NULL | Bcrypt hashed password |
| registration_date | TIMESTAMP | DEFAULT NOW() | Account creation date |
| is_verified | BOOLEAN | DEFAULT FALSE | Certification verification |
| is_active | BOOLEAN | DEFAULT TRUE | Account status |

**Indexes**: employee_id, email

---

### 4. **DONATION_HISTORY**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique donation record ID |
| donor_id | INT | FK → donors(id) ON DELETE CASCADE | Links to donor who donated |
| donation_date | DATE | NOT NULL | When blood was donated |
| blood_type | VARCHAR(10) | NOT NULL | Blood type collected |
| quantity_ml | INT | DEFAULT 450 | Amount collected in milliliters |
| location | VARCHAR(255) | NOT NULL | Where donation occurred |
| staff_id | INT | FK → staff(id) ON DELETE SET NULL | Staff member who recorded |
| notes | TEXT | NULLABLE | Additional notes about donation |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |

**Indexes**: donor_id, donation_date

**Purpose**: Maintains audit trail of all blood donations

---

### 5. **BLOOD_INVENTORY**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique blood unit ID |
| blood_type | VARCHAR(10) | NOT NULL | Blood type (O+, O-, etc.) |
| quantity_ml | INT | DEFAULT 0 | Amount in milliliters |
| location | VARCHAR(255) | NOT NULL | Storage refrigerator location |
| expiry_date | DATE | NOT NULL | When unit expires (42 days) |
| donor_id | INT | FK → donors(id) ON DELETE SET NULL | Which donor provided this unit |
| collection_date | DATE | NOT NULL | When unit was collected |
| status | VARCHAR(20) | IN('available', 'reserved', 'used', 'expired') | Current status |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp (AUTO) |

**Indexes**: blood_type, status, expiry_date

**Purpose**: Real-time tracking of blood inventory

---

### 6. **BLOOD_REQUESTS**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique request ID |
| hospital_id | INT | FK → hospitals(id) ON DELETE CASCADE | Which hospital made request |
| blood_type | VARCHAR(10) | NOT NULL | What blood type needed |
| quantity_ml | INT | NOT NULL | How much needed (ml) |
| urgency | VARCHAR(20) | IN('routine', 'urgent', 'emergency') | Priority level |
| status | VARCHAR(20) | IN('pending', 'approved', 'fulfilled', 'cancelled') | Request status |
| request_date | TIMESTAMP | DEFAULT NOW() | When request was submitted |
| required_by_date | DATE | NOT NULL | Deadline for fulfillment |
| fulfilled_date | TIMESTAMP | NULLABLE | When request was fulfilled |
| notes | TEXT | NULLABLE | Special requirements (CMV-, irradiated, etc.) |

**Indexes**: hospital_id, status, blood_type

**Purpose**: Tracks hospital blood requests and fulfillment

---

### 7. **EVENTS**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique event ID |
| title | VARCHAR(255) | NOT NULL | Event name |
| date | DATE | NOT NULL | Event date |
| start_time | TIME | NOT NULL | Start time |
| end_time | TIME | NOT NULL | End time |
| location | VARCHAR(255) | NOT NULL | Event location |
| expected | INT | NULLABLE | Expected number of donors |
| notes | TEXT | NULLABLE | Event details/instructions |
| created_by_type | VARCHAR(20) | IN('staff', 'hospital', 'admin') | Who created event |
| created_by_id | INT | NOT NULL | User ID of creator |
| created_by_name | VARCHAR(255) | NULLABLE | Name of creator |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| updated_at | TIMESTAMP | DEFAULT NOW() | Last update timestamp (AUTO) |

**Indexes**: date, start_time

**Purpose**: Stores blood drive and donation event information

---

### 8. **EVENT_PARTICIPANTS**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique participant record |
| event_id | INT | FK → events(id) ON DELETE CASCADE | Which event |
| donor_id | VARCHAR(64) | NOT NULL | Donor's unique ID |
| name | VARCHAR(255) | NOT NULL | Donor's name |
| blood | VARCHAR(10) | NOT NULL | Blood type |
| status | VARCHAR(20) | IN('Confirmed', 'Tentative', 'Cancelled') | Registration status |
| registered | DATE | NOT NULL | Registration date |
| created_at | TIMESTAMP | DEFAULT NOW() | Record creation timestamp |
| Constraint | UNIQUE(event_id, donor_id) | Prevent duplicate registrations | |

**Indexes**: event_id

**Purpose**: Tracks which donors are registered for which events

---

### 9. **AUDIT_LOG**
| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| id | SERIAL | PRIMARY KEY | Unique audit entry ID |
| table_name | VARCHAR(50) | NOT NULL | Which table was affected |
| record_id | INT | NOT NULL | Which record was affected |
| action | VARCHAR(10) | IN('INSERT', 'UPDATE', 'DELETE') | What action occurred |
| user_type | VARCHAR(20) | IN('donor', 'hospital', 'staff', 'admin') | Type of user |
| user_id | INT | NOT NULL | Which user made the change |
| changes | TEXT | NULLABLE | JSON of what changed |
| timestamp | TIMESTAMP | DEFAULT NOW() | When change occurred |

**Indexes**: (table_name, record_id), timestamp

**Purpose**: Compliance and audit trail for all data changes

---

## Relationships Summary

| Relationship | Type | Description |
|--------------|------|-------------|
| DONORS → DONATION_HISTORY | 1:N | One donor can have many donations |
| DONORS → BLOOD_INVENTORY | 1:N | One donor's blood can create multiple units |
| DONORS → EVENT_PARTICIPANTS | 1:N | One donor can register for many events |
| HOSPITALS → BLOOD_REQUESTS | 1:N | One hospital can make many requests |
| STAFF → DONATION_HISTORY | 1:N | One staff member can record many donations |
| EVENTS → EVENT_PARTICIPANTS | 1:N | One event can have many participants |

---

## Key Design Decisions

### 1. **Three User Types**
- **DONORS**: Provide blood, track donations
- **HOSPITALS**: Request blood, manage operations
- **STAFF**: Process donations, manage inventory

### 2. **Blood Tracking**
- DONATION_HISTORY records the original donation
- BLOOD_INVENTORY tracks individual units and their status
- Separation allows: "Unit expires at X" vs "Donor last donated Y"

### 3. **Request Management**
- BLOOD_REQUESTS tracks urgency levels (routine/urgent/emergency)
- Status workflow: pending → approved → fulfilled → closed
- Links to specific hospitals for accountability

### 4. **Event System**
- EVENTS are blood drives/collection events
- EVENT_PARTICIPANTS tracks donor registration
- Supports calculating "expected vs actual" donations

### 5. **Audit Trail**
- AUDIT_LOG captures ALL changes for compliance
- Records who did what, when, and what changed
- Essential for healthcare compliance (HIPAA-like requirements)

### 6. **Indexing Strategy**
- Indexes on frequently searched fields (blood_type, email, status)
- Foreign keys are indexed by default
- Composite index on (table_name, record_id) for audit queries

---

## Data Integrity Features

✅ **Foreign Key Constraints**: Referential integrity maintained
✅ **Unique Constraints**: No duplicate emails, license numbers, employee IDs
✅ **CHECK Constraints**: Enum-like values (blood types, departments, statuses)
✅ **Automatic Timestamps**: created_at and updated_at auto-updated
✅ **Cascade Deletes**: Hospital deletion cascades to requests; Event deletion cascades to participants
✅ **Set Null on Delete**: Staff deletion sets staff_id to NULL in donation history (soft delete concept)

---

## Typical Workflows

### Workflow 1: Blood Donation
```
1. Donor exists in DONORS table
2. Staff records donation in DONATION_HISTORY
3. Blood unit created in BLOOD_INVENTORY with expiry_date = now + 42 days
4. Status set to 'available'
5. Audit log entry created
6. Donor's last_donation_date updated
```

### Workflow 2: Hospital Request
```
1. Hospital submits BLOOD_REQUEST with urgency level
2. Staff checks BLOOD_INVENTORY for available units
3. Staff assigns available units to request
4. REQUEST status changes to 'fulfilled'
5. BLOOD_INVENTORY unit status changes to 'reserved' → 'used'
6. Audit log entries created
7. Hospital notified
```

### Workflow 3: Blood Drive Event
```
1. Staff/Hospital creates EVENT
2. Donors register via EVENT_PARTICIPANTS
3. On event day, staff records donations in DONATION_HISTORY
4. Blood units added to BLOOD_INVENTORY
5. EVENT statistics updated
6. Donors receive points/rewards
```

---

**Database Version**: PostgreSQL 12+
**Last Updated**: February 4, 2026
