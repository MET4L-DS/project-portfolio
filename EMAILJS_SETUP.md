# EmailJS Setup Guide

This guide will help you configure EmailJS for ## Step 5: Configure Environment Variables

1. In the `frontend` directory, copy `.env.examp## Security Notes

-   Your Public Key is safe to expose in frontend code, but using environment variables is still best practice
-   Service ID and Template ID are also safe to expose, but environment variables provide better security
-   Never expose your Private Key (not used in this implementation)
-   The `.env` file is excluded from version control via `.gitignore`
-   Environment variables keep sensitive information out of your source code
-   The email routing happens on the client side for simplicity `.env`:
    ```bash
    cd frontend
    cp .env.example .env
    ```

2. Update the `.env` file with your actual EmailJS credentials:
    ```env
    VITE_EMAILJS_SERVICE_ID=your_actual_service_id
    VITE_EMAILJS_TEMPLATE_ID=your_actual_template_id
    VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
    ```

**Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`. form system that routes messages to different email addresses based on the query type.

## Overview

The contact form system routes messages to:

-   **Entertainment Queries**: sankalpentertainment360@gmail.com
-   **School Queries**: sankalpschool.art@gmail.com
-   **Magazine Queries**: aamarxopun.magazine@gmail.com

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

## Step 2: Add Email Service

1. In the EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, Yahoo, etc.)
4. Follow the setup instructions for your chosen provider
5. Note down the **Service ID** (e.g., `service_xxxxxxx`)

### For Gmail Setup:

-   You'll need to create an App Password if using 2FA
-   Go to Google Account Settings > Security > App Passwords
-   Generate a new app password for EmailJS

## Step 3: Create Email Template

1. In the EmailJS dashboard, go to **Email Templates**
2. Click **Create New Template**
3. Use the following template structure:

### Template Subject:

```
New Contact Form Submission - {{query_type}}
```

### Template Body:

```
Hello {{to_name}},

You have received a new message from the Sankalp website contact form.

From: {{from_name}} ({{from_email}})
Query Type: {{query_type}}

Message:
{{message}}

---
This message was sent via the Sankalp website contact form.
Reply directly to: {{reply_to}}

Best regards,
Sankalp Website System
```

4. Save the template and note down the **Template ID** (e.g., `template_xxxxxxx`)

## Step 4: Get Public Key

1. In the EmailJS dashboard, go to **Account**
2. Find your **Public Key** (e.g., `xxxxxxxxxxxxxxx`)

## Step 5: Update Configuration

Update the file `frontend/src/config/emailjs.ts` with your actual credentials:

```typescript
export const EMAILJS_CONFIG = {
	SERVICE_ID: "your_actual_service_id", // Replace with your Service ID
	TEMPLATE_ID: "your_actual_template_id", // Replace with your Template ID
	PUBLIC_KEY: "your_actual_public_key", // Replace with your Public Key
};
```

**Important**: Never commit the `.env` file to version control. It's already included in `.gitignore`.

## Step 6: Test the Contact Form

1. Start your development server:

    ```bash
    cd frontend
    npm run dev
    ```

2. Navigate to the Contact page
3. Fill out the form with different query types
4. Submit and verify emails are received at the correct addresses

## Template Variables Used

The system sends these variables to your EmailJS template:

-   `{{from_name}}` - Name entered by the user
-   `{{from_email}}` - Email entered by the user
-   `{{to_email}}` - Recipient email (sankalpentertainment360@gmail.com, sankalpschool.art@gmail.com, or aamarxopun.magazine@gmail.com)
-   `{{to_name}}` - Recipient name ("Sankalp Entertainment Team", "Sankalp School of Art and Skills", or "Aamar Xopun Magazine Team")
-   `{{query_type}}` - Type of query (entertainment, school, or magazine)
-   `{{message}}` - Message content from the user
-   `{{reply_to}}` - User's email for replies

## Query Type Mapping

The form automatically routes messages based on the selected query type:

| Form Selection                   | Query Type Value | Recipient Email                   |
| -------------------------------- | ---------------- | --------------------------------- |
| Event Management & Entertainment | entertainment    | sankalpentertainment360@gmail.com |
| School of Art and Skills         | school           | sankalpschool.art@gmail.com       |
| Aamar Xopun Magazine             | magazine         | aamarxopun.magazine@gmail.com     |

## Troubleshooting

### Common Issues:

1. **401 Unauthorized Error**

    - Check your Public Key is correct
    - Ensure your Service ID and Template ID are valid

2. **Template Variables Not Working**

    - Verify the template variables in EmailJS dashboard match exactly: `{{from_name}}`, `{{to_email}}`, etc.
    - Check for typos in variable names

3. **Emails Not Received**

    - Check spam/junk folders
    - Verify the Service is properly configured with valid email credentials
    - Test the Service directly in EmailJS dashboard

4. **Service Connection Issues**
    - For Gmail: Ensure App Password is used if 2FA is enabled
    - Check email service settings in EmailJS dashboard

### Testing Tips:

-   Use the EmailJS dashboard to send test emails
-   Check browser console for error messages
-   Verify network requests in browser developer tools

## Security Notes

-   Your Public Key is safe to expose in frontend code
-   Service ID and Template ID are also safe to expose
-   Never expose your Private Key (not used in this implementation)
-   The email routing happens on the client side for simplicity

## Support

If you encounter issues:

1. Check the EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. Review the browser console for error messages
3. Test your EmailJS service separately first
4. Ensure all email addresses are valid and accessible

## Free Tier Limits

EmailJS free tier includes:

-   200 emails per month
-   2 email services
-   3 email templates
-   Basic support

For higher volume needs, consider upgrading to a paid plan.
