# MongoDB Setup Guide for BloodLink

## Quick Fix for Your Error

The error `querySrv ECONNREFUSED _mongodb._tcp.cluster0.c79wtdl.mongodb.net` means MongoDB Atlas connection failed. Here are the solutions:

---

## Option 1: Use Local MongoDB (Recommended for Development)

### Install MongoDB Locally

**macOS:**
```bash
# Install via Homebrew
brew tap mongodb/brew
brew install mongodb-community@7.0

# Start MongoDB
brew services start mongodb-community@7.0

# Verify it's running
mongosh
```

**Windows:**
1. Download from: https://www.mongodb.com/try/download/community
2. Run installer
3. MongoDB will start automatically as a service

**Linux (Ubuntu/Debian):**
```bash
# Import MongoDB public key
curl -fsSL https://pgp.mongodb.com/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Create list file
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start
sudo systemctl start mongod
```

### Your .env is already configured for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/bloodlink_db
```

✅ **You're ready to go! Just install MongoDB and restart your server.**

---

## Option 2: Use MongoDB Atlas (Cloud)

If you want to use MongoDB Atlas (the cloud connection you were trying):

### Step 1: Fix IP Whitelist
1. Go to https://cloud.mongodb.com
2. Select your cluster
3. Click **Network Access** (left sidebar)
4. Click **Add IP Address**
5. Click **Allow Access From Anywhere** (0.0.0.0/0) for development
6. Click **Confirm**

### Step 2: Get Correct Connection String
1. Go to your cluster
2. Click **Connect**
3. Choose **Connect your application**
4. Copy the connection string
5. Replace `<password>` with your actual database password
6. Replace `<username>` with your database username

### Step 3: Update .env
Replace the MONGODB_URI in your `.env` file:

```env
# Replace with YOUR actual connection string from MongoDB Atlas
MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.c79wtdl.mongodb.net/bloodlink_db?retryWrites=true&w=majority
```

**Important:**
- Remove `<` and `>` brackets
- Use the actual password (not the account password, but the database user password)
- Make sure there are no spaces in the connection string

### Step 4: Create Database User (if not done)
1. In MongoDB Atlas, go to **Database Access**
2. Click **Add New Database User**
3. Choose **Password** authentication
4. Create username and password
5. Set role to **Read and write to any database**
6. Click **Add User**

---

## Option 3: Use Docker (Alternative)

```bash
# Run MongoDB in Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=bloodlink_db \
  mongo:7.0

# Your .env stays as:
MONGODB_URI=mongodb://localhost:27017/bloodlink_db
```

---

## Common Errors & Solutions

### Error: `querySrv ECONNREFUSED`
**Cause:** Can't connect to MongoDB Atlas
**Solutions:**
1. Check if your IP is whitelisted (add 0.0.0.0/0 for testing)
2. Verify connection string is correct
3. Check if database user exists with correct password
4. Ensure you're using the correct cluster URL

### Error: `connect ECONNREFUSED 127.0.0.1:27017`
**Cause:** Local MongoDB is not running
**Solution:** Start MongoDB service:
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows - MongoDB runs as service automatically
```

### Error: `Authentication failed`
**Cause:** Wrong username/password in connection string
**Solution:** 
1. Go to MongoDB Atlas → Database Access
2. Reset database user password
3. Update connection string with new password

---

## Testing Your Connection

After setup, test the connection:

```bash
cd backend
npm install
npm run dev
```

You should see:
```
✓ MongoDB connected successfully
🩸 BloodLink API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running on: http://localhost:3000
```

---

## Recommended for You

**Use Local MongoDB for development:**
1. Install MongoDB Community Edition
2. Keep the current .env configuration
3. Run `npm install` in backend folder
4. Run `npm run dev`

This avoids network issues and is faster for development!
