import pg from 'pg';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables from .env or .env.production
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: path.join(__dirname, '.env.production') });
} else {
  dotenv.config();
}

const { Pool } = pg;

// CRITICAL FIX: Override environment variables if they appear to be truncated or wrong
// This happens when Render's dashboard env vars are set incorrectly
const CORRECT_HOST = 'dpg-d5tpl7cr85hc73ejik5g-a.virginia-postgres.render.com';
const CORRECT_PASSWORD = 'e0ZnyyYGn1F7en9rQQFvdXHI8fUR3Rbm';
const CORRECT_DB_NAME = 'bloodline_db_38xf';

if (process.env.DB_HOST !== CORRECT_HOST) {
  console.warn(`⚠️  Overriding DB_HOST: "${process.env.DB_HOST}" → "${CORRECT_HOST}"`);
  process.env.DB_HOST = CORRECT_HOST;
}

if (process.env.DB_PASSWORD !== CORRECT_PASSWORD) {
  console.warn(`⚠️  Overriding DB_PASSWORD: ${process.env.DB_PASSWORD?.length || 0} chars → ${CORRECT_PASSWORD.length} chars`);
  process.env.DB_PASSWORD = CORRECT_PASSWORD;
}

if (process.env.DB_NAME !== CORRECT_DB_NAME) {
  console.warn(`⚠️  Overriding DB_NAME: "${process.env.DB_NAME}" → "${CORRECT_DB_NAME}"`);
  process.env.DB_NAME = CORRECT_DB_NAME;
}

// Try to use DATABASE_URL if available (Render provides this), otherwise use individual env vars
const poolConfig = process.env.DATABASE_URL 
  ? { connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } }
  : {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || '5432'),
      user: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'bloodlink_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    };

console.log('🔧 Pool config:', {
  ...poolConfig,
  password: poolConfig.password ? `***${poolConfig.password.length} chars***` : '***no password***',
});

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool(poolConfig);
    
    pool.on('error', (err) => {
      console.error('Unexpected error on idle PostgreSQL client', err);
    });
  }
  return pool;
}

// Convert MySQL ? placeholders to PostgreSQL $1, $2, ... placeholders
function convertPlaceholders(sql, params) {
  let index = 1;
  const convertedSql = sql.replace(/\?/g, () => `$${index++}`);
  return { sql: convertedSql, params };
}

export async function query(sql, params = []) {
  const { sql: convertedSql, params: convertedParams } = convertPlaceholders(sql, params);
  console.log('🔍 Executing SQL:', convertedSql);
  console.log('   Parameters:', convertedParams);
  try {
    const result = await getPool().query(convertedSql, convertedParams);
    console.log('✅ Query successful, returned', result.rows.length, 'rows');
    return result.rows;
  } catch (err) {
    console.error('❌ Query failed:', err.message);
    throw err;
  }
}

export async function transaction(fn) {
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
