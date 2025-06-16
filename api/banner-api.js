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

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);

    // ✅ GET: Fetch all banners
    if (req.method === 'GET') {
      const [rows] = await connection.execute('SELECT * FROM banners ORDER BY id DESC');
      await connection.end();
      return res.status(200).json({
        success: true,
        message: 'Banners fetched successfully',
        data: rows
      });
    }

    // ✅ POST: Add a new banner
    if (req.method === 'POST') {
      const { title, subtitle, image_url, banner_type, is_active = true } = req.body;

      if (!title || !image_url || !banner_type) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Required fields: title, image_url, banner_type' });
      }

      const [result] = await connection.execute(
        `INSERT INTO banners (title, subtitle, image_url, banner_type, is_active)
         VALUES (?, ?, ?, ?, ?)`,
        [title, subtitle || null, image_url, banner_type, is_active]
      );

      await connection.end();
      return res.status(201).json({
        success: true,
        message: 'Banner added successfully',
        data: { id: result.insertId, title, subtitle, image_url, banner_type, is_active }
      });
    }

    // ✅ DELETE: Delete banner by ID
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) {
        await connection.end();
        return res.status(400).json({ success: false, message: 'Banner ID is required' });
      }

      const [result] = await connection.execute('DELETE FROM banners WHERE id = ?', [id]);
      await connection.end();

      if (result.affectedRows === 0) {
        return res.status(404).json({ success: false, message: 'Banner not found' });
      }

      return res.status(200).json({ success: true, message: 'Banner deleted successfully' });
    }

    await connection.end();
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  } catch (error) {
    if (connection) await connection.end();
    return res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
}
