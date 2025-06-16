import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Define allowed origins
  const allowedOrigins = [
    'http://localhost:5173',
    'https://thinkprint.shop',
    'https://thinkprint-react.vercel.app',
    'https://think-print-anvogue.vercel.app',
    'http://localhost:3000'
     ];
     
  const origin = req.headers.origin;

  // Set CORS headers if the origin is allowed
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // Handle preflight request
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    // Create a transporter using Hostinger SMTP
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
      subject: 'New Contact Form Submission',
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ error: 'Failed to send email. Please try again later.' });
  }
}
