import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  const allowedOrigins = [
    'http://localhost:5173',
    'https://thinkprint.shop',
    'https://thinkprint-react.vercel.app',
    'https://think-print-anvogue.vercel.app',
    'http://localhost:3000',
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json'); 

  if (req.method === 'OPTIONS') {
    return res.status(200).json({ success: true });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  console.log("Body:", req.body);

  const { name, email, phoneNumber, message, product } = req.body;

  if (!name || !email || !phoneNumber || !message || !product) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.hostinger.com',
      port: 465,
      secure: true,
      auth: {
        user: 'sales@thinkprint.shop',
        pass: 'MaxHost@9266', 
      },
    });

    const mailOptions = {
      from: 'sales@thinkprint.shop',
      to: ['info@brandbuildup.in', 'sales@thinkprint.shop'],
      subject: `New Product Enquiry for ${product}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phoneNumber}\nMessage: ${message}\nProduct: ${product}`,
    };

    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Enquiry sent successfully!' });
  } catch (error) {
    console.error('Email sending error:', error);
    return res.status(500).json({ error: 'Failed to send enquiry. Please try again later.' });
  }
}
