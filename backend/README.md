# Life Link Backend Setup Instructions

## Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)

## Installation Steps

### 1. Database Setup

1. Install MySQL if you haven't already
2. Start MySQL service
3. Create the database:
```sql
CREATE DATABASE bloodlink_db;
```

4. Import the schema:
```bash
mysql -u root -p bloodlink_db < ../database/schema.sql
```

Or manually run the SQL commands from `../database/schema.sql` in your MySQL client.

### 2. Backend Setup

1. Navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment configuration:
```bash
cp .env.example .env
```

4. Edit `.env` file with your database credentials:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bloodlink_db
DB_PORT=3306

PORT=3000
NODE_ENV=development
```

### 3. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start on http://localhost:3000

## API Endpoints

### Registration Endpoints
- `POST /api/register/donor` - Register a new donor
- `POST /api/register/hospital` - Register a new hospital
- `POST /api/register/staff` - Register a new blood bank staff

### Data Retrieval Endpoints
- `GET /api/donors` - Get all donors
- `GET /api/hospitals` - Get all hospitals
- `GET /api/staff` - Get all staff
- `GET /api/donors/blood-type/:type` - Search donors by blood type

### Health Check
- `GET /api/health` - Check if API is running

## Testing the API

You can test the API using:
- Browser (for GET requests)
- Postman
- cURL
- Frontend forms

Example cURL request:
```bash
curl -X POST http://localhost:3000/api/register/donor \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "dob": "1990-01-01",
    "bloodType": "O+",
    "address": "123 Main St",
    "city": "New York",
    "password": "securepassword"
  }'
```

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check credentials in `.env` file
- Ensure database exists: `SHOW DATABASES;`

### Port Already in Use
- Change PORT in `.env` file
- Kill process using port 3000: `lsof -ti:3000 | xargs kill`

### Module Not Found
- Run `npm install` again
- Check Node.js version: `node --version`

## Security Notes

⚠️ **Important for Production:**
- Change JWT_SECRET in `.env`
- Use HTTPS
- Implement rate limiting
- Add input sanitization
- Enable CORS only for trusted domains
- Use environment-specific configurations
- Never commit `.env` file to version control
