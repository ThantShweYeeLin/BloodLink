# 📋 Life Link - Complete Setup Guide for Team

This document summarizes all setup resources available for your team members.

## 🚀 Getting Started - Choose Your Path

### ⚡ Fast Track (5 minutes)
If you're experienced with Node.js and PostgreSQL, use:
- **[SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)** - Quick checklist format

### 📚 Complete Guide (15-20 minutes)
For a thorough step-by-step walkthrough:
- **[INSTALLATION.md](INSTALLATION.md)** - Detailed installation with screenshots and troubleshooting

### 🎯 Project Overview
For understanding what Life Link does:
- **[README.md](README.md)** - Features and project description

---

## 📋 Setup Summary

### 3 Simple Steps:

#### **Step 1: Create the Database**
```bash
createdb -h localhost -U postgres Life Link
```

#### **Step 2: Configure Environment**
```bash
cd backend
cp .env.example .env
# Edit .env and add your PostgreSQL password
```

#### **Step 3: Seed the Database**
```bash
pnpm run seed
```

Then start with `pnpm start`

---

## 📁 Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| [INSTALLATION.md](INSTALLATION.md) | **Complete setup guide** with detailed steps | Everyone (especially beginners) |
| [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md) | **Quick checklist** format | Experienced developers |
| [README.md](README.md) | Project overview and features | Decision makers |
| [backend/.env.example](backend/.env.example) | Template for environment variables | All team members |
| [SETUP.md](SETUP.md) | Configuration and deployment info | Developers |

---

## 🔑 Test Credentials

After setup, login with:

```
Account Type: Donor
Email:        alex@donor.com
Password:     Test123!

Account Type: Staff
Email:        staff@bloodlink.com
Password:     Test123!

Account Type: Hospital
Email:        hospital@bloodlink.com
Password:     Test123!
```

---

## 📊 Database Overview

After running `pnpm run seed`, your database will have:

| Table | Seeded Records | Purpose |
|-------|---|---------|
| `donors` | 2 | Blood donor profiles |
| `donation_history` | 2 | Donation records |
| `events` | 2 | Blood drive events |
| `staff` | 1 | Blood bank staff |
| `hospitals` | 1 | Hospital information |
| `blood_inventory` | 2 | Available blood units |
| `blood_requests` | 1 | Hospital blood requests |

---

## 🐛 Common Issues & Solutions

### Issue: "Database Life Link does not exist"
```bash
# Solution:
createdb -h localhost -U postgres Life Link
pnpm run seed
```

### Issue: "Cannot connect to database"
```bash
# Solution: Start PostgreSQL
# Mac:
brew services start postgresql@15

# Linux:
sudo service postgresql start
```

### Issue: "Port 3000 already in use"
```bash
# Solution:
lsof -ti :3000 | xargs kill -9
pnpm start
```

### Issue: "FATAL: Ident authentication failed"
```bash
# Solution: Check your password in .env matches your PostgreSQL password
# Edit .env and verify DB_PASSWORD
nano backend/.env
```

**For more solutions, see [INSTALLATION.md](INSTALLATION.md) Troubleshooting section**

---

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla) + Vite
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL 14+
- **Authentication:** JWT (JSON Web Tokens)
- **Package Manager:** pnpm

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. Database connected
pnpm start
# Should show: [BACKEND] ✓ Database connected successfully

# 2. Can login
# Visit: http://localhost:5173/Life Link/
# Login with: alex@donor.com / Test123!

# 3. Data loads
# Should see donation history and events on dashboard

# 4. Can view data in pgAdmin
# Open pgAdmin → Life Link → donors → View/Edit Data
# Should see 2 donor records
```

---

## 📞 Support Resources

### For Database Questions
- PostgreSQL docs: https://www.postgresql.org/docs/
- pgAdmin docs: https://www.pgadmin.org/docs/

### For Node.js/JavaScript Questions
- Node.js docs: https://nodejs.org/docs/
- Express.js guide: https://expressjs.com/

### For Setup Issues
1. Check [INSTALLATION.md](INSTALLATION.md) Troubleshooting
2. Verify PostgreSQL is running
3. Check `.env` file has correct credentials
4. Kill old processes: `pkill -9 node`

---

## 🎯 Next Steps After Setup

1. **Explore the codebase**
   - Frontend: `public/` directory
   - Backend: `backend/server.js`
   - Database queries: `backend/sql.js`

2. **Test the APIs**
   ```bash
   # Get a JWT token
   curl -X POST http://localhost:3000/api/login/donor \
     -H "Content-Type: application/json" \
     -d '{"email":"alex@donor.com","password":"Test123!"}'
   
   # Use the token to call APIs
   curl http://localhost:3000/api/donations/donor/1 \
     -H "Authorization: Bearer <your_token>"
   ```

3. **Modify the database**
   - Add new donors via dashboard
   - Create new blood drive events
   - Check inventory changes

4. **Read the code**
   - [backend/server.js](backend/server.js) - API endpoints
   - [public/donor/dashboard.html](public/donor/dashboard.html) - Dashboard UI
   - [backend/seed-data.js](backend/seed-data.js) - How sample data is created

---

## 📝 Important Notes for Your Team

### ⚠️ Security
- **NEVER commit `.env` file** to Git (use `.env.example` instead)
- Each team member has their own local database
- Production will need different credentials
- Change `JWT_SECRET` in production

### 🗄️ Database
- This is a **LOCAL PostgreSQL database**
- Data exists only on your machine
- Not uploaded to GitHub
- Use pgAdmin to browse/edit data
- Run `pnpm run seed` to reset to sample data

### 🔄 Collaboration
- Share only code files through Git
- Each person sets up their own database
- All databases are independent
- Changes to code are shared, not data

---

## 🎓 Learning Resources

After setup, learn more about the project:

1. **Understand the Database**
   - Check [ER_DIAGRAM.md](ER_DIAGRAM.md) for database structure
   - Open pgAdmin and browse tables

2. **Study the API**
   - Check [backend/server.js](backend/server.js) for endpoints
   - Test with curl or Postman

3. **Review Frontend Code**
   - Check [public/donor/dashboard.html](public/donor/dashboard.html)
   - See how JavaScript calls the API

---

## 🎉 Congratulations!

Once you complete all setup steps, you'll have:

✅ Working Life Link application
✅ Local PostgreSQL database with sample data
✅ Ability to login and see dashboards
✅ Complete API backend
✅ Team-ready codebase

**Questions?** Check [INSTALLATION.md](INSTALLATION.md) or reach out to the team!

---

**Last Updated:** February 1, 2026
**For Your Team:** Distribute [INSTALLATION.md](INSTALLATION.md) or [SETUP_CHECKLIST.md](SETUP_CHECKLIST.md)
