# Life Link Complete Setup Guide

## Prerequisites

You need to have the following installed on your system:
- **Node.js** (v16 or higher)
- **MySQL** (v8.0 or higher)

### Install Node.js
If you don't have Node.js installed:
- Download from: https://nodejs.org/
- Choose the LTS version

### Install MySQL

**macOS (using Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Windows:**
- Download from: https://dev.mysql.com/downloads/mysql/
- Run the installer and follow the setup wizard

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

## Step 1: Set Up the Database

Open a terminal and run these MySQL commands:

```bash
# Access MySQL (may prompt for password)
mysql -u root

# Inside MySQL shell, run these commands:
CREATE DATABASE bloodlink_db;
USE bloodlink_db;
SOURCE /path/to/database/schema.sql;

# Exit MySQL
exit;
```

**Or, if you have a password:**
```bash
mysql -u root -p < /path/to/database/schema.sql
```

Replace `/path/to/` with the actual path to your Life Link project.

### Verify Database Created
```bash
mysql -u root
SHOW DATABASES;
USE bloodlink_db;
SHOW TABLES;
exit;
```

## Step 2: Configure Backend Environment

Navigate to the backend folder:
```bash
cd /Users/thantshweyeelin/Desktop/Life Link/Life Link/backend
```

Create a `.env` file (if it doesn't exist):
```bash
cp .env.example .env
```

Edit `.env` with your database credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=bloodlink_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=bloodlink_secret_key_change_in_production
```

**Replace `your_mysql_password_here` with your actual MySQL root password** (leave blank if no password)

## Step 3: Install Dependencies

```bash
cd /Users/thantshweyeelin/Desktop/Life Link/Life Link/backend
npm install
```

## Step 4: Start the Backend Server

```bash
npm run dev
```

You should see:
```
✓ Database connected successfully
🩸 Life Link API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running on: http://localhost:3000
```

**Keep this terminal open!**

## Step 5: Start the Frontend (New Terminal)

Open a new terminal window and navigate to the project root:

```bash
cd /Users/thantshweyeelin/Desktop/Life Link/Life Link
npm run dev
```

You should see:
```
VITE v7.3.1  ready in XXX ms
➜  Local:   http://localhost:5173/
```

## Step 6: Access the Application

Open your browser and go to: **http://localhost:5173**

## Testing the Full Flow

### Register as a Donor:
1. Click "Register" → "Donor"
2. Fill in the form with test data
3. Click "Register"
4. Check database: `SELECT * FROM donors;`

### Login as Donor:
1. Go to "Donor Login"
2. Enter the same email and password you just registered
3. You'll be redirected to the Donor Dashboard

### Register as Hospital:
1. Click "Register" → "Hospital"
2. Fill in the form with test data
3. Click "Register"

### Login as Hospital:
1. Go to "Hospital Login"
2. Enter the credentials
3. Search for donors by blood type from the dashboard

### Register as Staff:
1. Click "Register" → "Staff"
2. Fill in the form with test data
3. Click "Register"

### Login as Staff:
1. Go to "Staff Login"
2. Enter the credentials
3. View blood inventory and statistics

## API Endpoints Reference

### Authentication
- `POST /api/login/donor` - Login as donor
- `POST /api/login/hospital` - Login as hospital
- `POST /api/login/staff` - Login as staff

### Registration
- `POST /api/register/donor` - Register new donor
- `POST /api/register/hospital` - Register new hospital
- `POST /api/register/staff` - Register new staff

### Dashboard Data (Requires Authentication)
- `GET /api/donor/profile/:id` - Get donor profile
- `GET /api/hospital/profile/:id` - Get hospital profile
- `GET /api/staff/profile/:id` - Get staff profile
- `GET /api/dashboard/stats/:userType/:userId` - Get dashboard statistics
- `GET /api/hospital/:id/available-donors/:bloodType` - Search donors by blood type

## Troubleshooting

### "Database connection failed"
- Check MySQL is running: `mysql -u root` (should connect)
- Verify `.env` credentials match your MySQL setup
- Ensure `bloodlink_db` database exists

### "Port 3000 already in use"
- Change PORT in `.env` to another number (e.g., 3001)
- Or: `lsof -ti:3000 | xargs kill`

### "Port 5173 already in use"
- Run: `lsof -ti:5173 | xargs kill`

### "Module not found" errors
- Run: `npm install` in the backend folder
- Run: `npm install` in the root folder

### MySQL not found
- Install MySQL following the steps above
- On macOS with Homebrew: `brew install mysql && brew services start mysql`

## Development Notes

- Backend runs on **http://localhost:3000**
- Frontend runs on **http://localhost:5173**
- JWT tokens expire after **24 hours**
- Passwords are securely hashed with **bcrypt**
- All sensitive data requires authentication tokens

## File Structure

```
Life Link/
├── backend/
│   ├── .env                  # Database credentials (don't commit!)
│   ├── server.js             # Main API server
│   ├── db.js                 # Database connection
│   └── package.json
├── database/
│   └── schema.sql            # SQL tables
├── public/
│   ├── index.html            # Home page
│   ├── register.html         # Role selection
│   ├── register-donor.html   # Donor registration
│   ├── register-hospital.html
│   ├── register-staff.html
│   ├── login-donor.html      # Donor login
│   ├── login-hospital.html
│   ├── login-staff.html
│   └── dashboards/
│       ├── donor-dashboard.html
│       ├── hospital-dashboard.html
│       └── staff-dashboard.html
└── src/                      # React components (future)
```

## Next Steps

- Integrate with React components in `src/`
- Add more dashboard features
- Implement blood request tracking
- Add email notifications
- Set up production deployment
