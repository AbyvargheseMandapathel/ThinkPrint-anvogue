import mysql from 'mysql2/promise';

const dbConfig = {
  host: import.meta.env.VITE_DB_HOST || 'srv1614.hstgr.io',
  user: import.meta.env.VITE_DB_USER || 'u911622560_thinkprint_adm',
  password: import.meta.env.VITE_DB_PASSWORD || '6L]kRxIpzgc/3A9q8^U=',
  database: import.meta.env.VITE_DB_NAME || 'u911622560_thinkprint',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: { rejectUnauthorized: true }
};

const pool = mysql.createPool(dbConfig);

// Modified connection test (without process-dependent code)
async function testConnection() {
  let conn;
  try {
    conn = await pool.getConnection();
    await conn.ping();
    console.log('Database connected');
    return true;
  } catch (error) {
    console.error('Connection failed:', error);
    return false;
  } finally {
    if (conn) conn.release();
  }
}

// Optional: Run test in Node.js environment only
if (typeof process !== 'undefined') {
  testConnection();
}

export default pool;