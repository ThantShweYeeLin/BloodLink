# Life Link - Detailed Installation Guide for Team Members

This guide walks through setting up Life Link on your local machine after cloning the repository.

## Prerequisites

Before starting, ensure you have installed:

### 1. Node.js (v18 or higher)
```bash
# Check if installed
node --version

# If not installed, download from: https://nodejs.org/
# Or use Homebrew (Mac):
brew install node
```

### 2. pnpm (Node Package Manager)
```bash
# Check if installed
pnpm --version

# If not installed:
npm install -g pnpm
```

### 3. PostgreSQL (v14 or higher)

**On Mac (using Homebrew):**
```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

**On Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Run the installer and remember your password
- Ensure PostgreSQL is running in background

**On Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo service postgresql start
```

---

## Installation Steps

### Step 1: Clone the Repository
```bash
# Clone the repo
git clone <your-github-url>

# Navigate to project
cd Life Link
```

### Step 2: Install Node Dependencies
```bash
# Install all packages (frontend and backend)
pnpm install

# If you get permission errors, try:
sudo pnpm install
```

### Step 3: Create the PostgreSQL Database

#### Option A: Using Command Line (Recommended)

**Mac/Linux:**
```bash
# Create the database
createdb -h localhost -U postgres Life Link

# Verify it was created
psql -h localhost -U postgres -l | grep Life Link
```

**Windows (PowerShell):**
```bash
# Open PowerShell as Administrator
createdb -h localhost -U postgres Life Link

# Or use psql directly:
psql -h localhost -U postgres
# Then type: CREATE DATABASE Life Link;
# Then type: \q
```

#### Option B: Using pgAdmin (GUI)

1. Open pgAdmin 4
2. Right-click on "Databases" → "Create" → "Database"
3. Enter name: `Life Link`
4. Click "Save"

---

### Step 4: Configure Environment Variables

#### Step 4a: Create the .env file
```bash
# Navigate to backend directory
cd backend

# Copy the template file
cp .env.example .env

# Verify the file was created
ls -la .env
```

#### Step 4b: Edit the .env file with your credentials

**Mac/Linux:**
```bash
# Open with text editor
nano .env
```

**Windows (PowerShell):**
```bash
# Open with Notepad
notepad .env
```

#### Step 4c: Update the credentials

Find these lines in your `.env` file and update them:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=your_password_here          # ← Update this!
DB_NAME=Life Link
DB_PORT=5432

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_jwt_secret_key_here_change_in_production
```

**Replace `your_password_here`** with the PostgreSQL password you set during installation.

**For JWT_SECRET**, you can use any random string:
```
JWT_SECRET=mySecureLife LinkSecret2024!@#
```

**Save the file:**
- Mac/Linux nano: Press `Ctrl+X` → `Y` → `Enter`
- Windows Notepad: `Ctrl+S` → Close

---

### Step 5: Seed the Database with Sample Data

```bash
# Make sure you're in the backend directory
cd backend

# Run the seed script
pnpm run seed
```

**Expected output:**
```
✅ Seed data completed
```

**If you get an error:**

```bash
# Error: "Database connection failed"
# Solution: Check your .env credentials

# Error: "EADDRINUSE: address already in use"
# Solution: Kill the process on port 3000
# Mac/Linux:
lsof -ti :3000 | xargs kill -9

# Windows (PowerShell as Admin):
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

### Step 6: Verify the Database is Populated

#### Option A: Using pgAdmin

1. Open pgAdmin 4
2. Navigate to: `Servers` → `PostgreSQL` → `Databases` → `Life Link` → `Schemas` → `public` → `Tables`
3. Right-click on `donors` → "View/Edit Data" → "All Rows"
4. You should see 2 donors: `alex@donor.com` and `jamie@donor.com`

#### Option B: Using Command Line

```bash
# Connect to the database
psql -h localhost -U postgres -d Life Link

# Run these queries:
SELECT COUNT(*) FROM donors;           # Should show: 2
SELECT COUNT(*) FROM donation_history; # Should show: 2
SELECT COUNT(*) FROM events;           # Should show: 2
SELECT COUNT(*) FROM staff;            # Should show: 1
SELECT COUNT(*) FROM hospitals;        # Should show: 1

# Exit
\q
```

---

## Step 7: Start the Application

```bash
# From the root Life Link directory (not backend)
cd ..  # if you're still in backend/
pnpm start
```

**Wait for both servers to start:**
```
[BACKEND] ✓ Database connected successfully
[BACKEND] Server running on: http://localhost:3000

[FRONTEND] ➜  Local:   http://localhost:5173/Life Link/
```

---

## Step 8: Test the Login

1. Open your browser: `http://localhost:5173/Life Link/`
2. Click on a role card (e.g., "For Donors")
3. You'll be redirected to login page
4. Enter test credentials:

### Test Accounts

**Donor Account:**
- Email: `alex@donor.com`
- Password: `Test123!`

**Staff Account:**
- Email: `staff@bloodlink.com`
- Password: `Test123!`

**Hospital Account:**
- Email: `hospital@bloodlink.com`
- Password: `Test123!`

5. Click "Login"
6. You should see the dashboard with data loaded!

---

## Troubleshooting

### "Connection refused" error

**Problem:** Cannot connect to database
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions:**
```bash
# Check if PostgreSQL is running
# Mac:
brew services list | grep postgresql

# Linux:
sudo service postgresql status

# If not running, start it:
# Mac:
brew services start postgresql@15

# Linux:
sudo service postgresql start
```

### "FATAL: Ident authentication failed"

**Problem:** PostgreSQL password authentication issue

**Solution:**
1. Check your password is correct in `.env`
2. Reset PostgreSQL password:
   ```bash
   sudo -u postgres psql
   ALTER USER postgres WITH PASSWORD 'newpassword';
   \q
   ```
3. Update the password in `.env`

### "Database Life Link does not exist"

**Problem:** The database wasn't created

**Solution:**
```bash
# Recreate it
createdb -h localhost -U postgres Life Link

# Then run seed again
pnpm run seed
```

### Port 3000 already in use

**Problem:** Another app is using port 3000

**Solution:**
```bash
# Mac/Linux
lsof -ti :3000 | xargs kill -9

# Windows PowerShell (as Admin)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Then restart
pnpm start
```

### Port 5173 already in use

**Solution:** Same as above but for port 5173, or let Vite choose another port (it will)

---

## File Structure

After installation, your project should look like:

```
Life Link/
├── public/                 # Frontend HTML/CSS/JS
│   ├── donor/
│   │   ├── login-donor.html
│   │   ├── dashboard.html
│   │   └── pages/
│   ├── staff/
│   ├── hospital/
│   └── shared-pages/
│       └── api-base.js
├── backend/                # Backend server
│   ├── server.js          # Express API
│   ├── sql.js             # Database connection
│   ├── seed-data.js       # Sample data script
│   ├── .env               # ← You created this!
│   ├── .env.example       # Template
│   └── package.json
├── package.json
├── vite.config.js
├── .gitignore
├── SETUP.md
└── INSTALLATION.md        # This file
```

---

## Next Steps

Once everything is running:

1. **Explore the dashboard:** Login and check the donor/staff/hospital dashboards
2. **Check the database:** Use pgAdmin to view the data
3. **Review the code:** Look at `backend/server.js` for API endpoints
4. **Test the API:** Use Postman or curl to test endpoints
5. **Make changes:** Try modifying the code and see changes live (Vite hot reload)

---

## Getting Help

If you encounter issues:

1. Check the **Troubleshooting** section above
2. Verify PostgreSQL is running: `psql --version`
3. Check your `.env` file has correct credentials
4. Look at backend logs: `pnpm start` shows error messages
5. Check if ports are in use: `lsof -i :3000`

---

## Database Schema

The seeded database includes these tables:

| Table | Records | Purpose |
|-------|---------|---------|
| `donors` | 2 | Blood donors |
| `donation_history` | 2 | Donation records |
| `events` | 2 | Blood drive events |
| `staff` | 1 | Blood bank staff |
| `hospitals` | 1 | Hospital information |
| `blood_inventory` | 2 | Available blood stock |
| `blood_requests` | 1 | Hospital blood requests |

---

## Useful Commands

```bash
# Start the app
pnpm start

# Stop the app
Ctrl+C

# Reseed the database
cd backend && pnpm run seed

# Connect to database directly
psql -h localhost -U postgres -d Life Link

# Install a new package
pnpm add package-name

# Update all packages
pnpm update
```

---

**You're all set! Enjoy using Life Link! 🩸**
