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

    // GET request - Fetch products
    if (req.method === 'GET') {
      const productId = req.query.id;
      const categoryId = req.query.category_id;
      const subcategoryId = req.query.subcategory_id;
      const isUrbangear = req.query.is_urbangear;
      
      let query = `
        SELECT p.*, c.name as category_name, s.name as subcategory_name 
        FROM products p 
        JOIN categories c ON p.category_id = c.id 
        JOIN subcategories s ON p.subcategory_id = s.id
      `;
      
      const conditions = [];
      const params = [];
      
      if (productId) {
        conditions.push('p.id = ?');
        params.push(productId);
      }
      
      if (categoryId) {
        conditions.push('p.category_id = ?');
        params.push(categoryId);
      }
      
      if (subcategoryId) {
        conditions.push('p.subcategory_id = ?');
        params.push(subcategoryId);
      }
      
      if (isUrbangear !== undefined) {
        conditions.push('p.is_urbangear = ?');
        params.push(isUrbangear === 'true' ? 1 : 0);
      }
      
      if (conditions.length > 0) {
        query += ' WHERE ' + conditions.join(' AND ');
      }
      
      query += ' ORDER BY p.title';
      
      const [rows] = await connection.execute(query, params);
      await connection.end();
      
      return res.status(200).json({
        success: true,
        message: 'Products retrieved successfully',
        data: rows
      });
    }
    
    // POST request - Add new product
    else if (req.method === 'POST') {
      const { 
        title, 
        short_description, 
        long_description, 
        design_specifications, 
        image, 
        category_id, 
        subcategory_id, 
        is_urbangear 
      } = req.body;
      
      // Validate required fields
      if (!title || !category_id || !subcategory_id) {
        await connection.end();
        return res.status(400).json({ 
          success: false, 
          message: 'Title, category ID, and subcategory ID are required' 
        });
      }
      
      // Check if category exists
      const [categoryCheck] = await connection.execute(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
      );
      
      if (categoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      // Check if subcategory exists
      const [subcategoryCheck] = await connection.execute(
        'SELECT id FROM subcategories WHERE id = ?',
        [subcategory_id]
      );
      
      if (subcategoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Subcategory not found' });
      }
      
      // Insert the product
      const [result] = await connection.execute(
        `INSERT INTO products (
          title, 
          short_description, 
          long_description, 
          design_specifications, 
          image, 
          category_id, 
          subcategory_id, 
          is_urbangear
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          short_description || null, 
          long_description || null, 
          design_specifications || null, 
          image || null, 
          category_id, 
          subcategory_id, 
          is_urbangear ? 1 : 0
        ]
      );
      
      await connection.end();
      
      return res.status(201).json({
        success: true,
        message: 'Product added successfully',
        data: {
          id: result.insertId,
          title,
          short_description,
          long_description,
          design_specifications,
          image,
          category_id,
          subcategory_id,
          is_urbangear: is_urbangear ? 1 : 0
        }
      });
    }

    if (req.method === 'GET') {
  const productId = req.query.id;
  const categoryId = req.query.category_id || req.query.category_id;
  const subcategoryId = req.query.subcategory_id || req.query.sub; // Support both 'sub' and 'subcategory_id'
  const isUrbangear = req.query.is_urbangear;

  let query = `
    SELECT p.*, c.name as category_name, s.name as subcategory_name 
    FROM products p 
    JOIN categories c ON p.category_id = c.id 
    JOIN subcategories s ON p.subcategory_id = s.id
  `;
  const conditions = [];
  const params = [];

  if (productId) {
    conditions.push('p.id = ?');
    params.push(productId);
  }
  if (categoryId) {
    conditions.push('p.category_id = ?');
    params.push(categoryId);
  }
  if (subcategoryId) {
    conditions.push('p.subcategory_id = ?');
    params.push(subcategoryId);
  }
  if (isUrbangear !== undefined) {
    conditions.push('p.is_urbangear = ?');
    params.push(isUrbangear === 'true' ? 1 : 0);
  }

  if (conditions.length > 0) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  try {
    const [rows] = await connection.execute(query, params);
    res.status(200).json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: 'DB Error', error });
  }
}
    
    // PUT request - Update product
    else if (req.method === 'PUT') {
      const { 
        id,
        title, 
        short_description, 
        long_description, 
        design_specifications, 
        image, 
        category_id, 
        subcategory_id, 
        is_urbangear 
      } = req.body;
      
      if (!id || !title || !category_id || !subcategory_id) {
        await connection.end();
        return res.status(400).json({
          success: false,
          message: 'Product ID, title, category ID, and subcategory ID are required',
        });
      }
      
      // Check if category exists
      const [categoryCheck] = await connection.execute(
        'SELECT id FROM categories WHERE id = ?',
        [category_id]
      );
      
      if (categoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Category not found' });
      }
      
      // Check if subcategory exists
      const [subcategoryCheck] = await connection.execute(
        'SELECT id FROM subcategories WHERE id = ?',
        [subcategory_id]
      );
      
      if (subcategoryCheck.length === 0) {
        await connection.end();
        return res.status(404).json({ success: false, message: 'Subcategory not found' });
      }
      
      const [result] = await connection.execute(
        `UPDATE products SET 
          title = ?, 
          short_description = ?, 
          long_description = ?, 
          design_specifications = ?, 
          image = ?, 
          category_id = ?, 
          subcategory_id = ?, 
          is_urbangear = ? 
        WHERE id = ?`,
        [
          title, 
          short_description || null, 
          long_description || null, 
          design_specifications || null, 
          image || null, 
          category_id, 
          subcategory_id, 
          is_urbangear ? 1 : 0,
          id
        ]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Product not found',
        });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: {
          id,
          title,
          short_description,
          long_description,
          design_specifications,
          image,
          category_id,
          subcategory_id,
          is_urbangear: is_urbangear ? 1 : 0
        },
      });
    }
    
    // DELETE request - Delete product
    else if (req.method === 'DELETE') {
      const id = req.query.id;
      
      if (!id) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }
      
      const [result] = await connection.execute(
        'DELETE FROM products WHERE id = ?',
        [id]
      );
      
      await connection.end();
      
      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }
      
      return res.status(200).json({
        success: true,
        message: 'Product deleted successfully'
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