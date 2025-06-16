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

  const allowedOrigins = [
    'http://localhost:5173',
    'https://thinkprint.shop',
    'https://thinkprint-react.vercel.app',
    'https://think-print-anvogue.vercel.app',
    'http://localhost:3000'
     ];
     
  // Set CORS headers
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    // GET request - Fetch categories
    if (req.method === 'GET') {
      const categoryId = req.query.id;
      
      let query = 'SELECT * FROM categories';
      let params = [];
      
      if (categoryId) {
        query += ' WHERE id = ?';
        params.push(categoryId);
      }
      
      query += ' ORDER BY name';
      
      const [rows] = await connection.execute(query, params);
      await connection.end();
      
      return res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
        data: rows
      });
    }
    
    // POST request - Add new category
    else if (req.method === 'POST') {
      const { name, img } = req.body;
      
      if (!name) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Category name is required' });
      }
      
      const [result] = await connection.execute(
        'INSERT INTO categories (name, img) VALUES (?, ?)',
        [name, img || null]
      );
      
      await connection.end();
      
      return res.status(201).json({
        success: true,
        message: 'Category added successfully',
        data: {
          id: result.insertId,
          name,
          img
        }
      });
    }
    
    // PUT request - Update category
    else if (req.method === 'PUT') {
      const { id, name, img } = req.body;
      
      if (!id || !name) {
        await connection.end();
        return res.status(400).json({
          success: false,
          message: 'Category ID and name are required',
        });
      }
      
      const [result] = await connection.execute(
        'UPDATE categories SET name = ?, img = ? WHERE id = ?',
        [name, img || null, id]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: {
          id,
          name,
          img
        },
      });
    }
    
    // DELETE request - Delete category
    else if (req.method === 'DELETE') {
      const id = req.query.id;
      
      if (!id) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Category ID is required' });
      }
      
      const [result] = await connection.execute(
        'DELETE FROM categories WHERE id = ?',
        [id]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      });
    }
    
    // Method not allowed
    else {
      await connection.end();
      return res.status(405).json({ success: false, message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('DB Error:', error);
    return res.status(500).json({ success: false, message: 'Database error' });
  }
}