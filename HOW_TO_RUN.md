# 🚀 How to Run Life Link

## ⭐ EASIEST WAY (ONE COMMAND)

Just run this in the **root Life Link folder**:

```bash
pnpm start
```

This starts BOTH backend and frontend together! ✨

---

## What's Happening?

When you run `pnpm start`, it:
1. ✅ Starts **Backend API** on port 3000
2. ✅ Starts **Frontend** on port 5175
3. 🎨 Shows color-coded logs in one terminal

You'll see output like:
```
[BACKEND]  🩸 Life Link API Server running on port 3000
[FRONTEND] Vite dev server running at http://localhost:5175
```

---

## Alternative: Two Separate Terminals

### Terminal 1 (Backend):
```bash
cd backend
node server.js
```

### Terminal 2 (Frontend):
```bash
pnpm run dev
```

---

## Access the App

Once running, open your browser:

**Staff Login:** http://localhost:5175/login-staff.html
- Email: `james@bloodbank.com`
- Password: `password123`

**Donor Login:** http://localhost:5175/login-donor.html  
- Email: `alice@donor.com`
- Password: `password123`

**Hospital Login:** http://localhost:5175/login-hospital.html
- Email: `contact@central-hospital.com`
- Password: `password123`

---

## Stop the App

Press `Ctrl+C` in the terminal

---

## Troubleshooting

**Port already in use?**
```bash
lsof -ti:3000,5175 | xargs kill -9
pnpm start
```

**Database not connecting?**
```bash
brew services start postgresql
```

---

## Summary

✅ **To run:** `pnpm start` (in root folder)
✅ **To stop:** Press `Ctrl+C`
✅ **Access:** http://localhost:5175

That's it! 🎉
