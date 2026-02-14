const nodemailer = require('nodemailer');

// Helper function to escape HTML
function escapeHtml(text) {
  if (!text) return '';
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

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
    const smtpSecure = process.env.SMTP_SECURE?.toLowerCase();
    const smtpPort = parseInt(process.env.SMTP_PORT || '587');
    
    const smtpConfig = {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: smtpPort,
      secure: smtpSecure === 'ssl' || smtpPort === 465, // SSL for port 465
      requireTLS: smtpSecure === 'tls' || smtpPort === 587, // TLS for port 587
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
    
    // Plain text version
    let textContent = `New Contact Form Submission\n\n`;
    textContent += `Name: ${name}\n`;
    textContent += `Email: ${email}\n`;
    if (phone) {
      textContent += `Phone: ${phone}\n`;
    }
    if (service) {
      textContent += `Service: ${service}\n`;
    }
    textContent += `\nMessage:\n${message}\n`;

    // HTML version for better formatting (with proper escaping)
    const escapedName = escapeHtml(name);
    const escapedEmail = escapeHtml(email);
    const escapedPhone = phone ? escapeHtml(phone) : '';
    const escapedService = service ? escapeHtml(service) : '';
    const escapedMessage = escapeHtml(message).replace(/\n/g, '<br>');
    
    let htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Contact Form Submission</h2>
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p style="margin: 10px 0;"><strong>Name:</strong> ${escapedName}</p>
          <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${escapedEmail}">${escapedEmail}</a></p>
          ${phone ? `<p style="margin: 10px 0;"><strong>Phone:</strong> <a href="tel:${escapedPhone}">${escapedPhone}</a></p>` : ''}
          ${service ? `<p style="margin: 10px 0;"><strong>Service:</strong> ${escapedService}</p>` : ''}
        </div>
        <div style="margin: 20px 0;">
          <h3 style="color: #333;">Message:</h3>
          <p style="background-color: #fff; padding: 15px; border-left: 4px solid #007bff; white-space: pre-wrap;">${escapedMessage}</p>
        </div>
        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">This email was sent from the contact form on your website.</p>
      </div>
    `;

    // Send email
    const mailOptions = {
      from: `"${fromName}" <${fromEmail}>`,
      to: recipientEmail,
      replyTo: email,
      subject: subject,
      text: textContent,
      html: htmlContent,
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

