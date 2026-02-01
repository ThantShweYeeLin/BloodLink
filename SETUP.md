# BloodLink Setup Instructions

## Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- pnpm (or npm)

## Setup Steps

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd BloodLink
```

### 2. Install dependencies
```bash
pnpm install
```

### 3. Set up PostgreSQL database
```bash
# Create the database
createdb -h localhost -U postgres BloodLink

# Or using psql:
psql -h localhost -U postgres
CREATE DATABASE BloodLink;
\q
```

### 4. Configure environment variables
```bash
cd backend
cp .env.example .env
# Edit .env and add your actual database credentials
```

### 5. Seed the database with sample data
```bash
cd backend
pnpm run seed
```

### 6. Start the application
```bash
# From the root BloodLink directory
pnpm start
```

This will start:
- **Backend**: http://localhost:3000
- **Frontend**: http://localhost:5173/BloodLink/

## Test Credentials

After seeding, you can login with:

**Donor:**
- Email: alex@donor.com
- Password: Test123!

**Staff:**
- Email: staff@bloodlink.com
- Password: Test123!

**Hospital:**
- Email: hospital@bloodlink.com
- Password: Test123!

## Database Schema

The database includes these tables:
- `donors` - Donor information
- `donation_history` - Blood donation records
- `events` - Blood drive events
- `staff` - Blood bank staff
- `hospitals` - Hospital information
- `blood_inventory` - Blood inventory tracking
- `blood_requests` - Hospital blood requests

## Troubleshooting

**Port already in use:**
```bash
# Kill processes on port 3000
lsof -ti :3000 | xargs kill -9
```

**Database connection failed:**
- Verify PostgreSQL is running: `brew services list` (Mac) or `service postgresql status` (Linux)
- Check your credentials in `.env` file
- Ensure the BloodLink database exists

## API Endpoints

The backend API runs on http://localhost:3000 with these main endpoints:

- POST `/api/login/donor` - Donor login
- POST `/api/login/staff` - Staff login  
- POST `/api/login/hospital` - Hospital login
- GET `/api/donations/donor/:id` - Get donor's donation history
- GET `/api/events/upcoming` - Get upcoming blood drive events
- GET `/api/inventory` - Get blood inventory (staff only)
- GET `/api/requests/hospital/:id` - Get hospital blood requests

All protected endpoints require JWT authentication via `Authorization: Bearer <token>` header.
