# Test Data Successfully Loaded! 🎉

Your Life Link PostgreSQL database is now populated with comprehensive test data for quick testing.

## Database Summary

### Donors (5 records)
- Alice Johnson - O+
- Bob Smith - A+
- Carol White - B-
- David Brown - AB+
- Eve Davis - O-

**Note:** Password for all test users: `password123` (hashed as bcryptjs)

### Hospitals (3 records)
- Central Medical Hospital (500 beds)
- City Care Hospital (300 beds)
- Health Plus Medical Center (400 beds)

### Staff (4 records)
- Dr. James Wilson (Testing Department)
- Lisa Anderson (Collection Department)
- Mark Thompson (Processing Department)
- Jennifer Lee (Inventory Department)

### Events (6 records)
- Winter Blood Drive - Feb 15, 2026 @ Central Park
- Hospital Annual Campaign - Mar 1, 2026 @ Central Medical Hospital
- Company Blood Donation - Feb 20, 2026 @ Tech Corp Office
- (3 more events)

### Blood Inventory (10 units)
- O+: 3,600 ml (2 units)
- A+: 2,400 ml (2 units)
- B-: 1,800 ml (2 units)
- AB+: 1,200 ml (2 units)
- O-: 900 ml (2 units)

### Blood Requests (8 requests)
- 4 pending requests
- 4 approved/fulfilled requests

### Donation History (10 donations)
- Total: 4,500 ml collected
- Recent donors tracked with dates

### Audit Log (8 records)
- System changes logged for tracking

## Testing the System

### 1. Login Credentials

**Donor Login:**
```
Email: alice@donor.com
Password: password123
```

**Hospital Login:**
```
Email: contact@central-hospital.com
Password: password123
```

**Staff Login:**
```
Email: james@bloodbank.com
Password: password123
```

### 2. API Endpoints to Try

```bash
# Get all donors
curl http://localhost:3000/api/donors

# Get all hospitals
curl http://localhost:3000/api/hospitals

# Get all staff
curl http://localhost:3000/api/staff

# Get events (requires auth token)
curl -H "Authorization: Bearer <TOKEN>" http://localhost:3000/api/events

# Login to get token
curl -X POST http://localhost:3000/api/login/donor \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@donor.com","password":"password123"}'
```

### 3. View Data in pgAdmin

1. Open pgAdmin
2. Navigate to: Servers → Life Link → Databases → bloodlink_db → Schemas → public → Tables
3. Right-click any table → "View/Edit Data" → "All Rows"
4. See all your test data instantly!

### 4. Run Queries in pgAdmin

Click "Query Tool" and try:

```sql
-- Blood inventory status
SELECT blood_type, SUM(quantity_ml) as available_ml, COUNT(*) as units 
FROM blood_inventory 
WHERE status = 'available' 
GROUP BY blood_type;

-- Events with participant count
SELECT e.title, e.date, COUNT(ep.id) as participants
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
GROUP BY e.id, e.title, e.date;

-- Blood requests by hospital
SELECT h.hospital_name, br.blood_type, br.quantity_ml, br.status
FROM blood_requests br
JOIN hospitals h ON br.hospital_id = h.id
ORDER BY br.status, h.hospital_name;

-- Donor donation history
SELECT d.full_name, dh.donation_date, dh.blood_type, dh.quantity_ml
FROM donation_history dh
JOIN donors d ON dh.donor_id = d.id
ORDER BY dh.donation_date DESC;
```

## Next Steps

1. ✅ Start the backend server:
   ```bash
   cd backend && pnpm run dev
   ```

2. ✅ Open pgAdmin to visualize the data

3. ✅ Test the API endpoints with the credentials above

4. ✅ Add more test data as needed using the same seed-data.sql format

## To Add More Data Later

Edit `database/seed-data.sql` with your data, then load it:

```bash
psql postgresql://postgres:292005thantshweyeelin@localhost:5432/bloodlink_db -f database/seed-data.sql
```

---

**Your system is ready for testing!** 🚀

All test data has been loaded into PostgreSQL. Use the credentials above to login and test the Life Link application.
