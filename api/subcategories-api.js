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

    // GET request - Fetch subcategories
    if (req.method === 'GET') {
      const categoryId = req.query.category_id;
      const subcategoryId = req.query.id;
      
      let query = 'SELECT s.*, c.name as category_name FROM subcategories s JOIN categories c ON s.category_id = c.id';
      let params = [];
      
      // Filter by category_id if provided
      if (categoryId) {
        query += ' WHERE s.category_id = ?';
        params.push(categoryId);
      } 
      // Filter by subcategory id if provided
      else if (subcategoryId) {
        query += ' WHERE s.id = ?';
        params.push(subcategoryId);
      }
      
      query += ' ORDER BY s.name';
      
      const [rows] = await connection.execute(query, params);
      await connection.end();
      
      return res.status(200).json({
        success: true,
        message: 'Subcategories retrieved successfully',
        data: rows
      });
    }
    
    // POST request - Add new subcategory
    else if (req.method === 'POST') {
      const { name, category_id, image } = req.body;
      
      // Validate required fields
      if (!name) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Subcategory name is required' });
      }
      if (!category_id) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Category ID is required' });
      }
      
      // First check if the category exists
      const [categoryCheck] = await connection.execute(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
      );
      
      if (categoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Parent category not found' });
      }
      
      // Insert the subcategory with image support
      const [result] = await connection.execute(
        'INSERT INTO subcategories (name, category_id, image) VALUES (?, ?, ?)',
        [name, category_id, image || null]
      );
      
      await connection.end();
      
      return res.status(201).json({
        success: true,
        message: 'Subcategory added successfully',
        data: {
          id: result.insertId,
          name,
          category_id,
          image
        }
      });
    }
    
    // PUT request - Update subcategory
    else if (req.method === 'PUT') {
      const { id, name, category_id, image } = req.body;
      
      if (!id || !name || !category_id) {
        await connection.end();
        return res.status(400).json({
          success: false,
          message: 'Subcategory ID, name, and category ID are required',
        });
      }
      
      // First check if the category exists
      const [categoryCheck] = await connection.execute(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
      );
      
      if (categoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Parent category not found' });
      }
      
      const [result] = await connection.execute(
        'UPDATE subcategories SET name = ?, category_id = ?, image = ? WHERE id = ?',
        [name, category_id, image || null, id]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Subcategory not found',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Subcategory updated successfully',
        data: {
          id,
          name,
          category_id,
          image
        },
      });
    }
    
    // DELETE request - Delete subcategory
    else if (req.method === 'DELETE') {
      const id = req.query.id;
      
      if (!id) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Subcategory ID is required' });
      }
      
      const [result] = await connection.execute(
        'DELETE FROM subcategories WHERE id = ?',
        [id]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Subcategory not found' });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Subcategory deleted successfully'
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