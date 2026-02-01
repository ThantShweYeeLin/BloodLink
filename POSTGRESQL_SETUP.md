# PostgreSQL + pgAdmin Setup Guide for Life Link

## Step 1: Install PostgreSQL

### macOS Installation

```bash
# Install PostgreSQL using Homebrew
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Or start manually
pg_ctl -D /usr/local/var/postgresql@15 start
```

### Verify Installation

```bash
# Check PostgreSQL version
psql --version

# Should output: psql (PostgreSQL) 15.x
```

## Step 2: Create Database

### Option A: Using Terminal (psql)

```bash
# Connect to PostgreSQL (default user is your macOS username or 'postgres')
psql postgres

# Inside psql:
CREATE DATABASE bloodlink_db;

# Connect to the new database
\c bloodlink_db

# Load the schema
\i /Users/thantshweyeelin/Desktop/Life Link/Life Link/database/schema-postgresql.sql

# Verify tables were created
\dt

# Exit psql
\q
```

### Option B: One-Line Command

```bash
# Create database and load schema in one go
psql postgres -c "CREATE DATABASE bloodlink_db;"
psql bloodlink_db -f /Users/thantshweyeelin/Desktop/Life Link/Life Link/database/schema-postgresql.sql
```

## Step 3: Install and Configure pgAdmin

### Download pgAdmin

1. Go to https://www.pgadmin.org/download/pgadmin-4-macos/
2. Download the latest version for macOS
3. Install the .dmg file

### Connect to Your Database in pgAdmin

1. **Open pgAdmin**

2. **Add New Server:**
   - Right-click "Servers" → "Register" → "Server"

3. **General Tab:**
   - Name: `Life Link Local`

4. **Connection Tab:**
   - Host: `localhost`
   - Port: `5432`
   - Maintenance database: `postgres`
   - Username: `postgres` (or your macOS username)
   - Password: `postgres` (or leave blank if no password)
   - Save password: ✓ (check this)

5. Click **Save**

6. **Navigate to Your Database:**
   - Servers → Life Link Local → Databases → bloodlink_db → Schemas → public → Tables

7. **You should see all 9 tables:**
   - ✓ donors
   - ✓ hospitals
   - ✓ staff
   - ✓ events
   - ✓ event_participants
   - ✓ blood_inventory
   - ✓ blood_requests
   - ✓ donation_history
   - ✓ audit_log

## Step 4: Configure Backend

The backend is already configured! Just verify your `.env` file:

```env
# PostgreSQL Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=bloodlink_db
```

**Update `DB_PASSWORD`** if your PostgreSQL password is different!

## Step 5: Install Dependencies and Start Server

```bash
cd backend
pnpm install
pnpm run dev
```

Expected output:
```
🩸 Life Link API Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Server running on: http://localhost:3000
Environment: development
Database: PostgreSQL
```

## Using pgAdmin

### View Data

1. Navigate to: Servers → Life Link Local → bloodlink_db → Schemas → public → Tables
2. Right-click any table → "View/Edit Data" → "All Rows"

### Run Queries

1. Click on `bloodlink_db`
2. Click "Query Tool" button (top toolbar)
3. Write SQL queries:

```sql
-- View all donors
SELECT * FROM donors;

-- View all events with participant count
SELECT e.*, COUNT(ep.id) as participant_count
FROM events e
LEFT JOIN event_participants ep ON e.id = ep.event_id
GROUP BY e.id;

-- Check blood inventory
SELECT blood_type, SUM(quantity_ml) as total_ml
FROM blood_inventory
WHERE status = 'available'
GROUP BY blood_type;
```

### Export Data

1. Right-click table → "Backup..."
2. Choose format (SQL, CSV, etc.)
3. Click "Backup"

### Monitor Connections

1. Dashboard → Server Activity
2. See active queries, connections, transactions

## Troubleshooting

### Error: psql: command not found

PostgreSQL not in PATH. Use full path:
```bash
/usr/local/opt/postgresql@15/bin/psql
```

Or add to PATH:
```bash
echo 'export PATH="/usr/local/opt/postgresql@15/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Error: FATAL: database "bloodlink_db" does not exist

Create the database first:
```bash
psql postgres -c "CREATE DATABASE bloodlink_db;"
```

### Error: peer authentication failed for user "postgres"

Edit pg_hba.conf to use password authentication:
```bash
# Find config location
psql postgres -c "SHOW hba_file;"

# Edit the file (usually /usr/local/var/postgresql@15/pg_hba.conf)
# Change: local all all peer
# To: local all all md5

# Restart PostgreSQL
brew services restart postgresql@15
```

### Error: password authentication failed

Reset PostgreSQL password:
```bash
psql postgres
ALTER USER postgres WITH PASSWORD 'postgres';
\q
```

Then update your `.env` file.

### pgAdmin can't connect

1. Check PostgreSQL is running:
   ```bash
   brew services list | grep postgresql
   ```

2. Test connection in terminal:
   ```bash
   psql postgres -c "SELECT version();"
   ```

3. If working in terminal but not pgAdmin, try:
   - Host: `127.0.0.1` instead of `localhost`
   - Check firewall settings

## Quick Reference

### PostgreSQL Commands

```bash
# Start PostgreSQL
brew services start postgresql@15

# Stop PostgreSQL
brew services stop postgresql@15

# Restart PostgreSQL
brew services restart postgresql@15

# Check status
brew services list | grep postgresql

# Connect to database
psql bloodlink_db

# List databases
psql -l
```

### psql Commands (inside psql)

```
\l              List all databases
\c database     Connect to database
\dt             List tables
\d table_name   Describe table
\du             List users/roles
\q              Quit
```

## What's Different from MySQL?

| Feature | MySQL | PostgreSQL |
|---------|-------|------------|
| Auto Increment | `AUTO_INCREMENT` | `SERIAL` |
| String Quotes | Single `'` or double `"` | Single `'` only |
| Placeholders | `?` | `$1, $2, $3` |
| Boolean | `TINYINT(1)` | `BOOLEAN` |
| JSON | `JSON` | `JSON` / `JSONB` |
| Case Sensitive | Table names: no | Table names: yes (lowercase) |

All SQL queries work the same - the backend handles placeholder conversion automatically!
