# SQL Migration Complete ✅

## What Changed
Your Life Link backend now uses **MySQL for core entities** (donors, hospitals, staff, events) and keeps MongoDB for inventory/requests (for now).

### Migrated to SQL
- ✅ **Authentication**: Login for donors, hospitals, and staff
- ✅ **Registration**: New user signup for all three types
- ✅ **Profiles**: GET endpoints for user profiles
- ✅ **Events**: Complete event management (list, create, join with participants)
- ✅ **Lists**: GET all donors/hospitals/staff
- ✅ **Search**: Donor lookup by blood type
- ✅ **Dashboard**: Donor counts now from SQL (hybrid stats)

### Still on MongoDB (Optional Phase 4)
- Blood Inventory
- Blood Requests
- Donation History
- Audit Logs

---

## Quick Start

### 1. Setup MySQL Database
```bash
# Start MySQL
brew services start mysql

# Create database and load schema
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS bloodlink_db;"
mysql -u root -p bloodlink_db < ./database/schema.sql
```

### 2. Configure Environment
Create or update `backend/.env`:
```env
# MySQL Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bloodlink_db

# MongoDB (still needed for inventory/requests)
MONGODB_URI=mongodb+srv://your_connection_string

# JWT
JWT_SECRET=your_secret_key
```

### 3. Run Backend
```bash
cd backend
pnpm install
pnpm run dev
```

Server should show:
```
✓ MongoDB connected successfully
Database: MongoDB + MySQL (events)
Server running on: http://localhost:3000
```

---

## API Testing

### Register a New Donor (SQL)
```bash
curl -X POST http://localhost:3000/api/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Donor",
    "email": "john@donor.com",
    "phone": "555-0001",
    "dob": "1990-05-15",
    "bloodType": "O+",
    "address": "123 Main St",
    "city": "San Francisco",
    "password": "securepass123"
  }'
```

### Login (SQL)
```bash
curl -X POST http://localhost:3000/api/login/donor \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@donor.com",
    "password": "securepass123"
  }'
```

Response includes `token` and `donorId` - save these!

### Get Profile (SQL)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  http://localhost:3000/api/donor/profile/DONOR_ID_HERE
```

### List All Donors (SQL)
```bash
curl http://localhost:3000/api/donors
```

### Search Donors by Blood Type (SQL)
```bash
curl http://localhost:3000/api/donors/blood-type/O+
```

### Create Event (Staff - SQL)
```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer STAFF_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Community Blood Drive",
    "date": "2026-02-20",
    "start_time": "09:00",
    "end_time": "17:00",
    "location": "Community Center Hall",
    "expected": 150,
    "notes": "Free parking available"
  }'
```

### Join Event (Donor - SQL)
```bash
curl -X POST http://localhost:3000/api/events/1/join \
  -H "Authorization: Bearer DONOR_TOKEN"
```

### List Events (SQL)
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:3000/api/events
```

---

## Frontend Integration

Your dashboards should now work with the new SQL backend:

1. **Staff Dashboard**: 
   - Can create events via `/api/events` (POST)
   - See participants from SQL

2. **Donor Dashboard**: 
   - Can join events via `/api/events/:id/join`
   - Events are shared across all users

3. **All Dashboards**:
   - Login flows unchanged
   - Profile endpoints return SQL data
   - JWT tokens work the same way

---

## Technical Notes

### Database Schema
- `donors`, `hospitals`, `staff` tables with proper indexes
- `events` and `event_participants` with foreign keys
- Staff department validated via ENUM: `collection`, `testing`, `processing`, `storage`, `inventory`, `admin`

### Security
- Passwords hashed with bcryptjs
- JWT tokens with 24h expiry
- Auth middleware validates all protected routes

### Hybrid Mode
- Core entities (users/events) → MySQL
- Inventory/requests → MongoDB (for now)
- Dashboard stats use SQL for donor counts, Mongo for inventory

---

## Optional Next Steps

### Phase 4: Complete SQL Migration
Migrate remaining features:
- Blood Requests → SQL
- Blood Inventory → SQL  
- Donation History → SQL
- Audit Logs → SQL triggers

### Phase 5: Remove MongoDB
Once Phase 4 is done:
1. Remove `mongoose` dependency
2. Remove `db.js` and `models.js`
3. Update server startup to MySQL-only

### Performance Optimizations
- Add connection pooling config
- Index optimization based on queries
- Consider caching for frequent reads

---

## Troubleshooting

### "Cannot find module mysql2"
```bash
cd backend && pnpm install
```

### "Access denied for user"
Check MySQL credentials in `.env`:
```bash
mysql -u root -p  # Test login
```

### "Table doesn't exist"
Re-run schema:
```bash
mysql -u root -p bloodlink_db < ./database/schema.sql
```

### Backend won't start
Check both databases are running:
```bash
# MySQL
brew services list | grep mysql

# MongoDB (if using local)
brew services list | grep mongodb
```

---

## Summary

✅ **SQL-first architecture** for core features  
✅ **Backward compatible** with existing frontends  
✅ **Better data integrity** with foreign keys  
✅ **Easier queries** with SQL joins  
✅ **Production-ready** with proper indexes  

Your blood banking system now uses SQL as intended! 🩸
