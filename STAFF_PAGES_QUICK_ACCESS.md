# Life Link Staff Pages - Quick Access Guide

## 🚀 Quick Start

### 1. **Login to Staff Portal**
Go to: http://localhost:5175/login-staff.html

**Credentials:**
- Email: `staff1@hospital.com`
- Password: `Secure123!`

### 2. **Access Staff Dashboard**
After login, you'll be redirected to: http://localhost:5175/dashboards/staff-dashboard.html

---

## 📍 Direct Page Links

### Navigation Hub
- **Staff Dashboard** (Main Hub): http://localhost:5175/dashboards/staff-dashboard.html

### Management Pages
1. **👥 Donor Management**: http://localhost:5175/pages/donor-management.html
   - View all donors
   - Add new donor
   - Edit donor info
   - View donation history
   - Check eligibility status

2. **📅 Event Management**: http://localhost:5175/pages/event-management.html
   - Create blood drive events
   - View event details
   - Track participant count
   - Manage event participants

3. **🩸 Donation Recording**: http://localhost:5175/donation-recording.html
   - Record new blood donations
   - Enter test results
   - Calculate automatic expiry
   - Check donor eligibility

4. **📦 Blood Inventory**: http://localhost:5175/pages/inventory-management.html
   - View blood stock levels
   - Sort by expiry date
   - Mark units as expired
   - Check low-stock alerts
   - View stock statistics

5. **🏥 Hospital Requests**: http://localhost:5175/pages/request-management.html
   - View incoming blood requests
   - Filter by status
   - Match with inventory
   - Fulfill requests
   - Reject with reason

6. **🚨 Emergency Requests**: http://localhost:5175/pages/emergency-requests.html
   - View critical blood requests
   - Quick response button
   - Real-time alerts
   - Auto-refresh every 10 seconds

7. **📊 Reports & Analytics**: http://localhost:5175/pages/reports.html
   - View key statistics
   - Donation trends chart
   - Blood type distribution
   - Fulfillment rates
   - Export to CSV/PDF

8. **👤 Staff Profile**: http://localhost:5175/pages/staff-profile.html
   - View your profile
   - Edit personal info
   - Change password
   - View assigned events

9. **🔐 Audit & Logs**: http://localhost:5175/pages/audit-logs.html
   - View activity logs
   - Filter by action type
   - Search logs
   - View detailed changes
   - Track all operations

---

## 🧪 Testing Workflows

### Workflow 1: Record a Blood Donation
1. Go to **Donation Recording** page
2. Select a donor from the list (filter shows only eligible donors)
3. Enter blood type and quantity (200-500ml)
4. Enter test results (Blood Type, Screening, Count, Virology)
5. Click "Record Donation"
6. Verify in Donor Management that donation was recorded

### Workflow 2: Manage Inventory
1. Go to **Blood Inventory** page
2. View all blood units with expiry dates
3. Click "Show Expired" to filter expired units
4. Click "Expire" button on units to mark as expired
5. Check low-stock alerts (red highlighting)
6. View statistics at top

### Workflow 3: Fulfill Hospital Request
1. Go to **Hospital Requests** page
2. Filter to view pending requests
3. Click "Fulfill" on a pending request
4. Select compatible blood units from dropdown
5. Add optional notes
6. Click "Fulfill Request"
7. Verify request status changes to fulfilled

### Workflow 4: Manage Events
1. Go to **Event Management** page
2. Click "+ Create Event"
3. Enter event details (name, date, location, target)
4. Click "Save Event"
5. View event in card grid
6. Click "Participants" to see registered donors
7. Click "Edit" to update event details

### Workflow 5: View Analytics
1. Go to **Reports & Analytics** page
2. Select period (Daily/Weekly/Monthly/Yearly)
3. View 4 stat cards (donations, volume, fulfilled, active donors)
4. Analyze donation trends chart
5. Review blood type distribution
6. Check fulfillment rates
7. Click "Export CSV" to download data

### Workflow 6: Track Activity
1. Go to **Audit & Logs** page
2. View all recent activities
3. Filter by action type (CREATE, UPDATE, DELETE, VIEW, FULFILL)
4. Filter by entity type (Donor, Donation, Request, Inventory, Event)
5. Search by staff name or action
6. Click "View" on any log to see details
7. Check change tracking and error messages

---

## 🔄 API Endpoints Being Used

All pages connect to these backend endpoints (running on localhost:3000):

```
// Donor Management
GET    /api/staff/donors
POST   /api/staff/donors
PUT    /api/staff/donors/:id
DELETE /api/staff/donors/:id
GET    /api/staff/donors/:id

// Donations
POST   /api/staff/donations

// Inventory
GET    /api/staff/inventory
PUT    /api/staff/inventory/:id

// Hospital Requests
GET    /api/staff/requests
PUT    /api/staff/requests/:id/fulfill
PUT    /api/staff/requests/:id/reject

// Events
GET    /api/staff/events
POST   /api/staff/events
PUT    /api/staff/events/:id

// Reports
GET    /api/staff/reports

// Audit Logs
GET    /api/staff/audit-logs

// Staff Profile
GET    /api/staff/:id
PUT    /api/staff/:id
PUT    /api/staff/:id/password
```

---

## 📊 Key Features by Page

### Donor Management
- ✅ Add new donors
- ✅ Edit donor information
- ✅ Delete donors
- ✅ View donation history
- ✅ Check eligibility (56-day gap)
- ✅ Search by name/email/blood type
- ✅ Automatic eligibility countdown

### Event Management
- ✅ Create blood drive events
- ✅ Update event details
- ✅ View participant list
- ✅ Track event progress
- ✅ Status display (Upcoming/Completed)
- ✅ Search and filter events

### Donation Recording
- ✅ Select eligible donor
- ✅ Blood type selection
- ✅ Quantity input (200-500ml)
- ✅ Test results entry
- ✅ Automatic expiry calculation
- ✅ Rejection logic if screening positive
- ✅ Event association
- ✅ Summary card

### Blood Inventory
- ✅ View all blood units
- ✅ Sort by expiry date
- ✅ Days remaining countdown
- ✅ Mark as expired
- ✅ Low-stock alerts
- ✅ Statistics dashboard
- ✅ Status badges (Good/Expiring/Expired)

### Hospital Requests
- ✅ View pending requests
- ✅ Filter by status
- ✅ Match with inventory
- ✅ Fulfill requests
- ✅ Reject with reason
- ✅ Hospital contact info
- ✅ Patient details

### Emergency Requests
- ✅ High-priority alerts
- ✅ Blinking urgency badges
- ✅ Real-time count
- ✅ Quick unit selection
- ✅ Auto-refresh (10s)
- ✅ Escalation tracking
- ✅ Fast response button

### Reports & Analytics
- ✅ Key statistics
- ✅ Donation trends chart
- ✅ Blood type distribution
- ✅ Fulfillment rates
- ✅ Daily breakdown
- ✅ Top blood types
- ✅ Export CSV/PDF
- ✅ Period filtering

### Staff Profile
- ✅ View profile info
- ✅ Edit full name
- ✅ Edit email
- ✅ Edit phone
- ✅ Edit department
- ✅ Change password
- ✅ View assigned events
- ✅ Success notifications

### Audit & Logs
- ✅ Complete activity log
- ✅ Filter by action type
- ✅ Filter by entity type
- ✅ Search functionality
- ✅ Pagination
- ✅ Detailed log viewer
- ✅ Change tracking
- ✅ Error logging

---

## 🎨 Design Standards

All pages follow consistent design:
- **Header**: Purple gradient (#667eea → #764ba2)
- **Cards**: White background with subtle shadows
- **Buttons**: Primary (purple), Secondary (gray), Danger (red)
- **Badges**: Color-coded (green for success, red for danger, yellow for warning)
- **Typography**: System fonts with clear hierarchy
- **Spacing**: Consistent 1rem/1.5rem margins
- **Icons**: Emoji icons for quick identification

---

## 🔐 Security Features

- JWT token authentication (24h expiry)
- bcryptjs password hashing
- Staff-only access control
- Session validation on each page
- Auto-logout if token expires
- Password change functionality
- Complete audit logging
- Secure API endpoints

---

## 📱 Responsive Breakpoints

- **Desktop** (1200px+): Full layout with sidebar
- **Tablet** (768-1199px): Adjusted grids
- **Mobile** (<768px): Stack vertical layouts

All pages tested and working on:
- ✅ macOS (Chrome, Safari)
- ✅ Windows (Chrome, Edge)
- ✅ iPad (Safari)
- ✅ iPhone (Safari)
- ✅ Android (Chrome)

---

## 🆘 Troubleshooting

### Page not loading?
1. Check if backend is running: `lsof -i :3000`
2. Check if PostgreSQL is running: `brew services list`
3. Check browser console for errors (F12)
4. Verify token in localStorage

### Data not showing?
1. Verify API endpoints in browser DevTools Network tab
2. Check PostgreSQL database connection
3. Verify test data is seeded
4. Check staff authentication

### Buttons not working?
1. Check browser console for JavaScript errors
2. Verify API endpoints are responding
3. Check network requests in DevTools
4. Verify JWT token is valid

### Styling issues?
1. Clear browser cache (Ctrl+Shift+Delete)
2. Force refresh page (Ctrl+F5)
3. Check CSS in browser DevTools
4. Verify CSS is loading correctly

---

## 📞 Support

For issues or questions:
1. Check the STAFF_PAGES_COMPLETE.md documentation
2. Review browser console (F12) for error messages
3. Check API responses in Network tab
4. Verify database connection and test data

---

**System Status**: ✅ All pages operational and tested
**Last Updated**: 2026-01-19
**Version**: 1.0.0

Happy blood banking! 🩸
