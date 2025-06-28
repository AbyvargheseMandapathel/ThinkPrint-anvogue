import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'srv1614.hstgr.io',
  user: 'u911622560_thinkprint_adm',
  password: '6L]kRxIpzgc/3A9q8^U=',
  database: 'u911622560_thinkprint',
  waitForConnections: true,
  connectionLimit: 10,
  ssl: false
};

export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigins = [
    'http://localhost:5173',
    'https://thinkprint.shop',
    'https://thinkprint-react.vercel.app',
    'https://think-print-anvogue.vercel.app',
    'http://localhost:3000'
     ];
     
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Get search query from request
    const searchQuery = req.query.q;
    
    if (!searchQuery) {
      await connection.end();
      return res.status(400).json({ success: false, message: 'Search query is required' });
    }
    
    // Search in title, short_description, and long_description
    const query = `
      SELECT p.*, c.name as category_name, s.name as subcategory_name 
      FROM products p 
      JOIN categories c ON p.category_id = c.id 
      JOIN subcategories s ON p.subcategory_id = s.id
      WHERE p.title LIKE ? 
      OR p.short_description LIKE ? 
      OR p.long_description LIKE ?
      ORDER BY p.title
      LIMIT 20
    `;
    
    const searchParam = `%${searchQuery}%`;
    const [rows] = await connection.execute(query, [searchParam, searchParam, searchParam]);
    
    await connection.end();
    
    return res.status(200).json({
      success: true,
      message: 'Search results retrieved successfully',
      data: rows
    });
  } catch (error) {
    console.error('DB Error:', error);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
}