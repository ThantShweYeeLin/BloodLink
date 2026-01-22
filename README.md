# 🩸 BloodLink - Blood Donation Management System

A comprehensive web application for managing blood donations, connecting donors with hospitals and blood banks through an intelligent matching system.

## ✨ Features

### For Donors
- 📝 Easy registration with blood type and health information
- 🔐 Secure login with JWT authentication
- 📊 Personal dashboard showing donation history
- 📅 Eligibility tracking and next donation dates
- 🏥 Find participating hospitals nearby

### For Hospitals
- 🏥 Hospital registration and verification
- 🔍 Search available donors by blood type
- 📞 Direct contact with donors
- 📋 Blood request tracking
- 📊 Blood inventory monitoring

### For Blood Bank Staff
- 👩‍⚕️ Staff account management with department assignment
- 🩸 Blood inventory tracking by type
- 📊 Collection and donation statistics
- 🔧 Blood unit management and processing
- 📈 Dashboard analytics

## 🚀 Quick Start

### Prerequisites
- **Node.js** v16+ ([Download](https://nodejs.org/))
- **MySQL** v8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))

### Option 1: Automated Startup (Recommended)

**macOS/Linux:**
```bash
chmod +x start.sh
./start.sh
```

**Windows:**
```cmd
start.bat
```

### Option 2: Manual Setup

**1. Set up the database:**
```bash
mysql -u root
CREATE DATABASE bloodlink_db;
USE bloodlink_db;
SOURCE database/schema.sql;
exit;
```

**2. Configure backend:**
```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials
npm install
npm run dev
```

**3. Start frontend (new terminal):**
```bash
cd /path/to/BloodLink
npm install
npm run dev
```

### 4. Access the application
Open browser to **http://localhost:5173**

## 📋 System Overview

### Registration & Login
- **Register** at `/register.html` - Choose role (Donor, Hospital, or Staff)
- **Login** at home page with role-specific logins
- All passwords securely hashed with bcrypt
- JWT tokens valid for 24 hours

### Donor Features
- Profile management with blood type
- Donation history tracking
- Next eligible donation date
- Dashboard at `/dashboards/donor-dashboard.html`

### Hospital Features
- Search donors by blood type
- Direct contact with donors
- View hospital profile
- Dashboard at `/dashboards/hospital-dashboard.html`

### Staff Features
- Blood inventory management
- Donation tracking
- Department-based access
- Dashboard at `/dashboards/staff-dashboard.html`

## 🔌 API Endpoints

### Authentication
```
POST   /api/login/donor
POST   /api/login/hospital
POST   /api/login/staff
POST   /api/register/donor
POST   /api/register/hospital
POST   /api/register/staff
```

### Dashboard (Requires JWT)
```
GET    /api/donor/profile/:id
GET    /api/hospital/profile/:id
GET    /api/staff/profile/:id
GET    /api/dashboard/stats/:userType/:userId
GET    /api/hospital/:id/available-donors/:bloodType
```

## 📁 Project Structure

```
BloodLink/
├── backend/                      # Node.js/Express API
│   ├── server.js                # Main API server
│   ├── db.js                    # Database connection
│   ├── .env                     # Configuration (create this)
│   └── package.json
├── database/
│   └── schema.sql               # Database tables
├── public/                      # HTML files
│   ├── index.html              # Home page
│   ├── register.html           # Role selection
│   ├── register-*.html         # Registration forms
│   ├── login-*.html            # Login pages
│   └── dashboards/             # Role-specific dashboards
├── src/                        # React components (future)
├── SETUP_GUIDE.md             # Detailed setup
├── start.sh                   # macOS/Linux launcher
└── start.bat                  # Windows launcher
```

## 🔐 Security

- ✅ Passwords hashed with bcrypt
- ✅ JWT token authentication (24h expiry)
- ✅ CORS enabled for trusted origins
- ✅ SQL injection prevention
- ✅ Environment variables for secrets
- ✅ Input validation on all endpoints

## 📊 Database Tables

- `donors` - Donor info, blood type, donation tracking
- `hospitals` - Hospital details, bed capacity
- `staff` - Staff members, departments, certifications
- `blood_inventory` - Blood units, status, expiry
- `blood_requests` - Hospital requests
- `donation_history` - Donation records
- `audit_log` - System activity

## 🛠 Development

**Backend:**
```bash
cd backend
npm run dev          # Start with file watching
npm start            # Start normally
```

**Frontend:**
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Check code quality
```

## 📚 Documentation

- [Complete Setup Guide](SETUP_GUIDE.md)
- [Backend README](backend/README.md)
- [SQL Schema](database/schema.sql)

## ❓ Troubleshooting

**Database connection error:**
```bash
# Ensure MySQL is running
mysql -u root

# Check .env credentials in backend/.env
# Verify database exists
mysql -u root -e "SHOW DATABASES;"
```

**Port already in use:**
```bash
# Kill process on port 3000 or 5173
lsof -ti:3000 | xargs kill
lsof -ti:5173 | xargs kill
```

**Dependencies installation failed:**
```bash
rm -rf node_modules package-lock.json
npm install
```

## 🚀 Next Steps

1. ✅ Set up database
2. ✅ Configure backend .env
3. ✅ Start servers
4. ✅ Register test accounts
5. ✅ Test full flow

See [SETUP_GUIDE.md](SETUP_GUIDE.md) for detailed instructions.

---

**🩸 BloodLink - Connecting Donors with Lives**

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
