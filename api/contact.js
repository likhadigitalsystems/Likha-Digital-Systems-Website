const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    res.status(403).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // Get form data
    const { name, email, phone, service, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      res.status(400).json({ error: 'Please fill in all required fields.' });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ error: 'Please provide a valid email address.' });
      return;
    }

    // Get email configuration from environment variables
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'ssl',
      auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
      },
    };

    const fromEmail = process.env.FROM_EMAIL;
    const fromName = process.env.FROM_NAME || 'Likha Digital Systems';
    const recipientEmail = process.env.RECIPIENT_EMAIL;

    // Check if SMTP is configured
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass || !recipientEmail) {
      res.status(500).json({ 
        error: 'Email configuration error. Please check environment variables.' 
      });
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransport(smtpConfig);

    // Build email content
    const subject = `New Contact Form Submission from ${name}`;
    let emailContent = `New Contact Form Submission\n\n`;
    emailContent += `Name: ${name}\n`;
    emailContent += `Email: ${email}\n`;
    if (phone) {
      emailContent += `Phone: ${phone}\n`;
    }
    if (service) {
      emailContent += `Service: ${service}\n`;
    }
    emailContent += `\nMessage:\n${message}\n`;

    // Send email
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: subject,
      text: emailContent,
    };

    await transporter.sendMail(mailOptions);

    // Success response
    res.status(200).json({ 
      message: "Thank You! Your message has been sent. We'll get back to you soon." 
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // Provide helpful error messages
    let errorMessage = "Something went wrong and we couldn't send your message.";
    
    if (error.code === 'EAUTH') {
      errorMessage = "Email authentication failed. Please check SMTP credentials.";
    } else if (error.code === 'ECONNECTION') {
      errorMessage = "Could not connect to email server. Please try again later.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    res.status(500).json({ error: errorMessage });
  }
};

