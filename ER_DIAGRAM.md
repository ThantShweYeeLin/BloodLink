# Life Link Database - Entity Relationship Diagram

## ER Diagram

```mermaid
erDiagram
    donors ||--o{ donation_history : "has"
    donors ||--o{ blood_inventory : "provides"
    donors ||--o{ event_participants : "joins"
    
    hospitals ||--o{ blood_requests : "makes"
    
    staff ||--o{ donation_history : "processes"
    staff ||--o{ events : "creates"
    
    events ||--o{ event_participants : "has"
    
    donors {
        SERIAL id PK
        VARCHAR full_name
        VARCHAR email UK
        VARCHAR phone
        DATE date_of_birth
        VARCHAR blood_type
        VARCHAR address
        VARCHAR city
        VARCHAR password_hash
        TIMESTAMP registration_date
        DATE last_donation_date
        BOOLEAN is_active
    }
    
    hospitals {
        SERIAL id PK
        VARCHAR hospital_name
        VARCHAR license_number UK
        VARCHAR contact_person
        VARCHAR email UK
        VARCHAR phone
        VARCHAR address
        VARCHAR city
        INT bed_capacity
        VARCHAR password_hash
        TIMESTAMP registration_date
        BOOLEAN is_verified
        BOOLEAN is_active
    }
    
    staff {
        SERIAL id PK
        VARCHAR full_name
        VARCHAR employee_id UK
        VARCHAR certification
        VARCHAR email UK
        VARCHAR phone
        VARCHAR blood_bank_name
        VARCHAR department
        VARCHAR address
        VARCHAR password_hash
        TIMESTAMP registration_date
        BOOLEAN is_verified
        BOOLEAN is_active
    }
    
    blood_inventory {
        SERIAL id PK
        VARCHAR blood_type
        INT quantity_ml
        VARCHAR location
        DATE expiry_date
        INT donor_id FK
        DATE collection_date
        VARCHAR status
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    blood_requests {
        SERIAL id PK
        INT hospital_id FK
        VARCHAR blood_type
        INT quantity_ml
        VARCHAR urgency
        VARCHAR status
        TIMESTAMP request_date
        DATE required_by_date
        TIMESTAMP fulfilled_date
        TEXT notes
    }
    
    donation_history {
        SERIAL id PK
        INT donor_id FK
        DATE donation_date
        VARCHAR blood_type
        INT quantity_ml
        VARCHAR location
        INT staff_id FK
        TEXT notes
        TIMESTAMP created_at
    }
    
    events {
        SERIAL id PK
        VARCHAR title
        DATE date
        TIME start_time
        TIME end_time
        VARCHAR location
        INT expected
        TEXT notes
        VARCHAR created_by_type
        INT created_by_id
        VARCHAR created_by_name
        TIMESTAMP created_at
        TIMESTAMP updated_at
    }
    
    event_participants {
        SERIAL id PK
        INT event_id FK
        VARCHAR donor_id
        VARCHAR name
        VARCHAR blood
        VARCHAR status
        DATE registered
        TIMESTAMP created_at
    }
    
    audit_log {
        SERIAL id PK
        VARCHAR table_name
        INT record_id
        VARCHAR action
        VARCHAR user_type
        INT user_id
        TEXT changes
        TIMESTAMP timestamp
    }
```

## Relationships Summary

### One-to-Many Relationships

1. **donors → donation_history**
   - One donor can have many donation records
   - Tracks complete donation history for each donor

2. **donors → blood_inventory**
   - One donor can contribute to many blood inventory units
   - Links blood supply to original donor

3. **donors → event_participants**
   - One donor can participate in many events
   - Tracks event attendance and registration

4. **hospitals → blood_requests**
   - One hospital can make many blood requests
   - Tracks all blood requests from each hospital

5. **staff → donation_history**
   - One staff member can process many donations
   - Records who handled each donation

6. **staff → events**
   - One staff member can create many events
   - Tracks event organizers

7. **events → event_participants**
   - One event can have many participants
   - Links donors to blood donation events

## Entity Descriptions

### Core Entities

- **donors**: Individual blood donors with personal information and blood type
- **hospitals**: Healthcare facilities that can request blood supplies
- **staff**: Blood bank employees who manage operations

### Operational Entities

- **blood_inventory**: Current blood supply with status and expiration tracking
- **blood_requests**: Hospital requests for blood with urgency levels
- **donation_history**: Complete record of all blood donations
- **events**: Blood donation drives and campaigns
- **event_participants**: Registrations for donation events

### System Entity

- **audit_log**: System-wide activity tracking for compliance and security

## Key Features

- **Referential Integrity**: Foreign keys maintain data consistency
- **Status Tracking**: Blood requests and inventory have status workflows
- **Audit Trail**: All major actions logged in audit_log table
- **Time Tracking**: Timestamps on critical operations
- **Soft Deletes**: is_active flags for user management
- **Index Optimization**: Strategic indexes on frequently queried columns
