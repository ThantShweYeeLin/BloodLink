import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const {
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_NAME = 'bloodlink_db',
} = process.env;

let pool;

export function getPool() {
  if (!pool) {
    pool = new Pool({
      host: DB_HOST,
      port: Number(DB_PORT),
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    });
    
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
