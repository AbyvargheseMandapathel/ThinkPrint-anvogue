import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Set CORS headers
  const allowedOrigins = ['http://localhost:5173', 'https://thinkprint.shop'];
  const origin = req.headers.origin;

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    // Handle preflight request
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { name, email, phoneNumber, message, product } = req.body;

  // Ensure required fields are provided
  if (!name || !email || !phoneNumber || !message || !product) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create a transporter using your email service
    let transporter = nodemailer.createTransport({
          host: 'smtp.hostinger.com', // Hostinger SMTP server
          port: 465, // Use 465 for SSL or 587 for TLS
          secure: true, // true for 465, false for 587
          auth: {
            user: "sales@thinkprint.shop", // Use environment variables in Vercel
            pass: "MaxHost@9266",
          },
        });

    // Setup email data
    let mailOptions = {
        from: 'sales@thinkprint.shop',
        to: ['info@brandbuildup.in', 'sales@thinkprint.shop'], // Replace with your email
      subject: `New Product Enquiry for ${product}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}\nProduct: ${product}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send enquiry. Please try again later.' });
  }
}