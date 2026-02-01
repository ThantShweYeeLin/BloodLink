import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

const {
  DATABASE_URL,
  DB_HOST = 'localhost',
  DB_PORT = '5432',
  DB_USER = 'postgres',
  DB_PASSWORD = '',
  DB_NAME = 'bloodlink_db',
  NODE_ENV,
} = process.env;

let pool;

export function getPool() {
  if (!pool) {
    const config = DATABASE_URL
      ? {
          connectionString: DATABASE_URL,
          ssl: { rejectUnauthorized: false },
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        }
      : {
          host: DB_HOST,
          port: Number(DB_PORT),
          user: DB_USER,
          password: DB_PASSWORD,
          database: DB_NAME,
          ssl: NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
          max: 10,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 2000,
        };

    pool = new Pool(config);
    
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
  const result = await getPool().query(convertedSql, convertedParams);
  return result.rows;
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
