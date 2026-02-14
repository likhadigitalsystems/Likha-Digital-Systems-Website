# Vercel Deployment Setup Guide

This guide will help you deploy your website to Vercel and configure the contact form.

## Prerequisites

- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A GitHub account (to connect your repository)
- Gmail account with 2-Step Verification enabled (for email)

## Step 1: Push to GitHub

1. Initialize Git (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. Create a repository on GitHub and push:
   ```bash
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect the settings:
   - **Framework Preset:** Other
   - **Root Directory:** `techedge-html/buyer-file` (or just `buyer-file` if deploying from root)
   - **Build Command:** Leave empty (static site)
   - **Output Directory:** Leave empty (or `.` if needed)

5. Click "Deploy"

## Step 3: Configure Environment Variables

After deployment, you need to set up environment variables for email:

1. Go to your project dashboard on Vercel
2. Click on **Settings** → **Environment Variables**
3. Add the following variables:

### Required Environment Variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password-here
FROM_EMAIL=your-email@gmail.com
FROM_NAME=Likha Digital Systems
RECIPIENT_EMAIL=your-email@gmail.com
```

### How to Get Gmail App Password:

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Select **Mail** and **Other (Custom name)**
5. Enter "Vercel Contact Form"
6. Click **Generate**
7. Copy the 16-character password (remove spaces)
8. Paste it in the `SMTP_PASSWORD` environment variable

### Example Environment Variables:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=tls
SMTP_USERNAME=likhadigitalsystems.tech@gmail.com
SMTP_PASSWORD=abcdefghijklmnop
FROM_EMAIL=likhadigitalsystems.tech@gmail.com
FROM_NAME=Likha Digital Systems
RECIPIENT_EMAIL=likhadigitalsystems.tech@gmail.com
```

## Step 4: Redeploy

After adding environment variables:

1. Go to **Deployments** tab
2. Click the **⋯** (three dots) on the latest deployment
3. Click **Redeploy**
4. This will apply the new environment variables

## Step 5: Test the Contact Form

1. Visit your deployed site: `https://your-project.vercel.app`
2. Go to the contact page
3. Fill out and submit the form
4. Check your email inbox

## Troubleshooting

### Contact Form Not Working

1. **Check Environment Variables:**
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Make sure all variables are set correctly
   - Ensure `SMTP_PASSWORD` has no spaces

2. **Check Function Logs:**
   - Go to Vercel Dashboard → Deployments
   - Click on the latest deployment
   - Click on **Functions** tab
   - Check for any error messages

3. **Test SMTP Connection:**
   - Verify Gmail App Password is correct
   - Make sure 2-Step Verification is enabled
   - Check that the password has no spaces

### "Email configuration error"

- Make sure all environment variables are set
- Check that `SMTP_USERNAME`, `SMTP_PASSWORD`, and `RECIPIENT_EMAIL` are not empty

### "Authentication failed"

- Verify your Gmail App Password is correct
- Make sure you're using an App Password (not your regular Gmail password)
- Check that 2-Step Verification is enabled

## Alternative: Using Other Email Providers

### Yahoo Mail:
```
SMTP_HOST=smtp.mail.yahoo.com
SMTP_PORT=587
SMTP_SECURE=tls
```

### Outlook/Hotmail:
```
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_SECURE=tls
```

### Custom SMTP:
Check your email provider's documentation for SMTP settings.

## Notes

- Environment variables are encrypted and secure on Vercel
- The contact form API endpoint is: `/api/contact`
- The function automatically handles CORS
- All form submissions are logged in Vercel's function logs

## Support

If you encounter issues:
1. Check Vercel's [documentation](https://vercel.com/docs)
2. Review function logs in the Vercel dashboard
3. Verify all environment variables are set correctly

