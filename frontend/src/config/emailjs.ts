// EmailJS Configuration
// To set up EmailJS:
// 1. Go to https://www.emailjs.com/
// 2. Create an account and get your credentials
// 3. Add your credentials to environment variables (see .env.example)

export const EMAILJS_CONFIG = {
	SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || "",
	TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "",
	PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "",
};

// Email template should include these variables:
// - {{from_name}} - Sender's name
// - {{from_email}} - Sender's email
// - {{to_email}} - Recipient email (dynamic based on query type)
// - {{to_name}} - Recipient name (dynamic based on query type)
// - {{query_type}} - Type of query (entertainment/school/magazine)
// - {{message}} - User's message
// - {{reply_to}} - Reply-to email address

// Sample EmailJS template structure:
/*
Subject: New Contact Form Submission - {{query_type}}

Hello {{to_name}},

You have received a new message from your website contact form.

From: {{from_name}} ({{from_email}})
Query Type: {{query_type}}

Message:
{{message}}

---
This message was sent via the Sankalp website contact form.
Reply directly to: {{reply_to}}
*/

export const EMAIL_RECIPIENTS = {
	entertainment: {
		email: "sankalpentertainment360@gmail.com",
		name: "Sankalp Entertainment Team",
	},
	school: {
		email: "sankalpschool.art@gmail.com",
		name: "Sankalp School of Art and Skills",
	},
	magazine: {
		email: "aamarxopun.magazine@gmail.com",
		name: "Aamar Xopun Magazine Team",
	},
};
