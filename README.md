# Likha Digital Systems - Website

Professional website for Likha Digital Systems featuring a contact form with email functionality.

## Features

- Responsive design
- Contact form with email notifications
- SMTP email support (Gmail, Yahoo, Outlook, and custom SMTP)
- Modern UI/UX

## Contact Form Setup

The contact form sends emails to your configured email address when users submit inquiries.

### Email Configuration

1. Copy `email-config.example.php` to `email-config.php`
2. Open `email-config.php` and configure your SMTP settings:
   - For Gmail: See `EMAIL-SETUP.md` for detailed instructions
   - Update `recipient_email` to your email address
   - Set your SMTP credentials

**Important:** The `email-config.php` file is ignored by Git (see `.gitignore`) to protect your credentials. Always use the example file as a template.

For detailed email setup instructions, see [EMAIL-SETUP.md](./EMAIL-SETUP.md).

## Deployment

### Vercel Deployment (Recommended)

This project is configured for Vercel deployment with a Node.js serverless function for the contact form.

**Quick Setup:**
1. Push your code to GitHub
2. Import the repository to Vercel
3. Configure environment variables (see [VERCEL-SETUP.md](./VERCEL-SETUP.md))
4. Deploy!

**For detailed Vercel setup instructions, see [VERCEL-SETUP.md](./VERCEL-SETUP.md)**

### Alternative: PHP-Compatible Hosting

If you prefer to use the PHP version:
- **Shared Hosting:** cPanel-based hosts (Bluehost, HostGator, etc.)
- **VPS:** DigitalOcean, Linode, AWS EC2
- **Platform as a Service:** Heroku, Railway, Render

For PHP hosting, use the `contact.php` file and configure `email-config.php`.

### GitHub Pages

GitHub Pages only supports static sites. The contact form requires PHP, so you'll need:
- A separate backend service for the contact form
- Or use a form service like Formspree, Netlify Forms, or similar

## Project Structure

```
buyer-file/
├── index.html          # Homepage
├── contact.html        # Contact page with form
├── contact.php         # Form submission handler
├── send-email.php      # Email sending functions
├── email-config.php    # Email configuration (not in Git)
└── assets/            # CSS, JS, images
```

## Local Development

For local development, you'll need PHP installed. See `README-SERVER.md` for instructions on running a local server.

## License

All rights reserved.

