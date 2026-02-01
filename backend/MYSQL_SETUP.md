# MySQL Setup Guide for Life Link

## Prerequisites

You need MySQL 8.0+ installed on your Mac.

### Install MySQL (if not installed)

```bash
# Using Homebrew
brew install mysql

# Start MySQL service
brew services start mysql

# Or start manually
mysql.server start
```

## Database Setup

### Option 1: Using MySQL Workbench (GUI)

1. Open MySQL Workbench
2. Connect to your local MySQL instance
3. Click "File" → "Open SQL Script"
4. Select `database/schema.sql`
5. Click the lightning bolt icon to execute
6. Verify the `bloodlink_db` database and tables are created

### Option 2: Using Terminal

```bash
# 1. Connect to MySQL (use your root password or no password)
mysql -u root -p

# 2. Create the database
CREATE DATABASE IF NOT EXISTS bloodlink_db;
USE bloodlink_db;

# 3. Exit and load the schema
SOURCE /Users/thantshweyeelin/Desktop/Life Link/Life Link/database/schema.sql;

# Or in one command:
mysql -u root -p bloodlink_db < /Users/thantshweyeelin/Desktop/Life Link/Life Link/database/schema.sql
```

### Option 3: If MySQL command is not found

```bash
# Find MySQL binary path
/usr/local/mysql/bin/mysql -u root -p

# Add to PATH permanently (add this to ~/.zshrc)
echo 'export PATH="/usr/local/mysql/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

## Configuration

The `.env` file is already configured with:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=bloodlink_db
```

**Update the password** if your MySQL root password is different!

## Verify Setup

```bash
# Test database connection
mysql -u root -p bloodlink_db -e "SHOW TABLES;"

# Expected output:
# +-------------------------+
# | Tables_in_bloodlink_db  |
# +-------------------------+
# | audit_log               |
# | blood_inventory         |
# | blood_requests          |
# | donation_history        |
# | donors                  |
# | event_participants      |
# | events                  |
# | hospitals               |
# | staff                   |
# +-------------------------+
```

## Restart Backend Server

After MySQL is set up, the server will automatically connect:

```bash
cd backend
pnpm install
pnpm start
```

You should see:
```
✅ MySQL connection pool established
🚀 Server running on port 3000
📊 Database: MySQL
```

## Troubleshooting

### Error: ER_ACCESS_DENIED_ERROR

Wrong password in `.env`. Update `DB_PASSWORD`.

### Error: ER_BAD_DB_ERROR

Database doesn't exist. Run the schema.sql script.

### Error: ECONNREFUSED

MySQL service isn't running:
```bash
brew services start mysql
# or
mysql.server start
```

### Error: command not found: mysql

MySQL not in PATH. Use full path:
```bash
/usr/local/mysql/bin/mysql
```
