# BloodLink - Quick Setup Checklist

Use this checklist when setting up BloodLink on your machine.

## ✅ Pre-Installation

- [ ] Node.js v18+ installed (`node --version`)
- [ ] pnpm installed (`pnpm --version`)
- [ ] PostgreSQL v14+ installed (`psql --version`)
- [ ] PostgreSQL service is running

## ✅ Clone & Install

```bash
# Clone the repo
git clone <url>
cd BloodLink

# Install dependencies
pnpm install
```

- [ ] Dependencies installed without errors
- [ ] `node_modules` folder exists

## ✅ Create Database

**Choose ONE method:**

### Method 1: Command Line (Easiest)
```bash
createdb -h localhost -U postgres BloodLink
```

### Method 2: psql
```bash
psql -h localhost -U postgres
CREATE DATABASE BloodLink;
\q
```

### Method 3: pgAdmin GUI
1. Open pgAdmin
2. Right-click Databases → Create → Database
3. Name: `BloodLink`
4. Save

- [ ] Database `BloodLink` created
- [ ] Can connect: `psql -h localhost -U postgres -d BloodLink`

## ✅ Configure Environment

```bash
cd backend
cp .env.example .env
```

**Edit `.env` and change:**
- `DB_PASSWORD=` your postgres password
- `JWT_SECRET=` any random string (e.g., `mySecret2024!`)

```bash
nano .env  # or use your editor
```

- [ ] `.env` file created
- [ ] DB_PASSWORD updated with your credentials
- [ ] JWT_SECRET filled in

## ✅ Seed Database

```bash
pnpm run seed
```

Expected output: ✅ Seed data completed

- [ ] Seed completed successfully
- [ ] No connection errors

## ✅ Start Application

```bash
cd ..  # back to root
pnpm start
```

Wait for both servers to start:
```
[BACKEND] ✓ Database connected successfully
[BACKEND] Server running on: http://localhost:3000

[FRONTEND] ➜  Local:   http://localhost:5173/BloodLink/
```

- [ ] Backend server running on port 3000
- [ ] Frontend server running on port 5173

## ✅ Test Login

1. Open browser: http://localhost:5173/BloodLink/
2. Click a role card (e.g., "For Donors")
3. Login with test credentials:
   - **Email:** alex@donor.com
   - **Password:** Test123!
4. See dashboard with data loaded ✓

- [ ] Login successful
- [ ] Dashboard loads with data
- [ ] Can see donation history and events

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `EADDRINUSE: address already in use :::3000` | `lsof -ti :3000 \| xargs kill -9` |
| `Database connection refused` | Check PostgreSQL is running: `brew services start postgresql@15` |
| `FATAL: Ident authentication failed` | Check DB password in `.env` matches your PostgreSQL password |
| `Database does not exist` | Run: `createdb -h localhost -U postgres BloodLink` |
| Login hangs | Kill old processes: `pkill -9 node` then restart |

---

## 📚 Full Documentation

For detailed instructions, see:
- [INSTALLATION.md](INSTALLATION.md) - Complete step-by-step guide
- [SETUP.md](SETUP.md) - Configuration and troubleshooting
- [README.md](README.md) - Project overview

---

## 🎉 You're Ready!

Once all checkboxes are checked, BloodLink is ready to use!

**Helpful commands:**
```bash
pnpm start          # Start both servers
Ctrl+C              # Stop servers
pnpm run seed       # Reseed database
psql -d BloodLink   # Connect to database
```

**Need help?** Check [INSTALLATION.md](INSTALLATION.md) Troubleshooting section
