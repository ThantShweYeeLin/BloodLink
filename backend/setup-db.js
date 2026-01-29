import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  console.log('🔧 Setting up database...');
  console.log('Connecting to:', process.env.DB_HOST);
  
  try {
    const schemaPath = path.join(__dirname, '../database/schema-postgresql.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    await pool.query(schema);
    
    console.log('✅ Database schema created successfully!');
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    await pool.end();
    process.exit(1);
  }
}

setupDatabase();
