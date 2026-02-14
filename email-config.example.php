<?php
/**
 * Email Configuration Template
 * 
 * Copy this file to 'email-config.php' and fill in your actual credentials.
 * The 'email-config.php' file is ignored by Git for security.
 * 
 * For local testing, you can use Gmail SMTP or any other SMTP server.
 * For production, use your hosting provider's SMTP settings.
 */

return [
    // SMTP Configuration
    'smtp_enabled' => true,  // Set to false to use PHP mail() function
    'smtp_host' => 'smtp.gmail.com',  // Gmail SMTP server
    'smtp_port' => 587,  // Gmail uses port 587 for TLS
    'smtp_secure' => 'tls',  // 'tls' or 'ssl'
    'smtp_auth' => true,
    'smtp_username' => 'your-email@gmail.com',  // Your Gmail address
    'smtp_password' => 'your-app-password-here',  // Your Gmail App Password (16 characters, no spaces)
    
    // Email Settings
    'from_email' => 'your-email@gmail.com',
    'from_name' => 'Your Company Name',
    'recipient_email' => 'your-email@gmail.com',  // Where contact form emails will be sent
    'recipient_name' => 'Your Company Name',
    
    // Debug (set to false in production)
    'debug' => false,
];

/**
 * GMAIL SETUP INSTRUCTIONS:
 * 
 * 1. Enable 2-Step Verification on your Gmail account:
 *    - Go to: https://myaccount.google.com/security
 *    - Enable "2-Step Verification"
 * 
 * 2. Generate an App Password:
 *    - Go to: https://myaccount.google.com/apppasswords
 *    - Select "Mail" and "Other (Custom name)"
 *    - Enter "Website Contact Form"
 *    - Click "Generate"
 *    - Copy the 16-character password and paste it in 'smtp_password' above (remove spaces)
 * 
 * 3. Copy this file to 'email-config.php' and update with your credentials
 * 
 * FOR OTHER EMAIL PROVIDERS:
 * - Yahoo: smtp.mail.yahoo.com, Port: 587
 * - Outlook: smtp-mail.outlook.com, Port: 587
 * - Custom: Check your hosting provider's documentation
 */

