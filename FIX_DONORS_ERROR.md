# 🔧 Fix: "relation 'donors' does not exist" Error

## Problem
When running `pnpm run seed`, you get:
```
❌ Seed data failed: relation "donors" does not exist
```

## Root Cause
The database exists, but the **tables** haven't been created yet. The seed script tries to insert data into tables that don't exist.

---

## ✅ Solution

### Step 1: Create the Database Tables

Run this command from your project root:

```bash
cd /path/to/Life\ Link

psql -h localhost -U postgres -d Life\ Link -f database/schema-postgresql.sql
```

**You'll be prompted for your PostgreSQL password.**

Expected output:
```
CREATE TABLE
CREATE INDEX
CREATE INDEX
CREATE TABLE
...
(continues for all 8 tables)
```

---

### Step 2: Verify Tables Were Created

```bash
psql -h localhost -U postgres -d Life\ Link
```

Then type:
```sql
\dt
```

You should see 8 tables:
```
                 List of relations
 Schema |        Name        | Type  |  Owner   
--------+--------------------+-------+----------
 public | audit_logs         | table | postgres
 public | blood_inventory    | table | postgres
 public | blood_requests     | table | postgres
 public | donation_history   | table | postgres
 public | donors             | table | postgres
 public | events             | table | postgres
 public | hospitals          | table | postgres
 public | staff              | table | postgres
```

Type `\q` to exit.

---

### Step 3: Run the Seed Script Again

```bash
cd backend
pnpm run seed
```

Expected output:
```
✅ Seed data completed
```

---

## Alternative: Using pgAdmin (GUI)

If you prefer a graphical interface:

1. **Open pgAdmin 4**
2. Navigate to: `Servers` → `PostgreSQL` → `Databases` → `Life Link`
3. Click on **"Query Tool"** (📝 icon at the top)
4. Click **"Open File"** → Select `database/schema-postgresql.sql`
5. Click **"Execute"** (▶️ button)
6. You should see "Query returned successfully" with a list of tables created
7. Now run `pnpm run seed` from the terminal

---

## Why This Happens

The setup process has these steps:
1. ✅ Create database (`createdb -h localhost -U postgres Life Link`)
2. ❌ **YOU ARE HERE** → Create tables (run schema-postgresql.sql)
3. ⏳ Seed sample data (`pnpm run seed`)
4. ⏳ Start the application (`pnpm start`)

You created the database but forgot to create the tables inside it!

---

## Still Having Issues?

### Error: "Permission denied for schema public"
```bash
psql -h localhost -U postgres -d Life\ Link -c "GRANT ALL ON SCHEMA public TO postgres;"
```

### Error: "FATAL: database 'Life Link' does not exist"
Create the database first:
```bash
createdb -h localhost -U postgres Life\ Link
```

Then run the schema file again.

### Error: "psql: command not found"
PostgreSQL isn't in your PATH. Use full path:
```bash
/usr/local/bin/psql -h localhost -U postgres -d Life\ Link -f database/schema-postgresql.sql
```

Or use pgAdmin (GUI method above).

---

## ✨ You're Done!

After creating the tables and seeding:
- Run `pnpm start` to launch the app
- Open http://localhost:5173/Life%20Link/
- Login with: alex@donor.com / Test123!

Happy coding! 🩸
