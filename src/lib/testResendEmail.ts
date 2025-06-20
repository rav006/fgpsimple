// Simple Resend email test script for Next.js (Node.js)
// Usage: Run with `npx tsx src/lib/testResendEmail.ts` or `ts-node` if installed

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // Explicitly load .env.local
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY as string);

async function sendTestEmail() {
  try {
    const result = await resend.emails.send({
      from: 'info@fentimangreen.co.uk',
      to: 'info@fentimangreen.co.uk', // Change to your test recipient if needed
      subject: 'Test Email from Resend (Next.js)',
      html: '<strong>This is a test email sent via Resend API from your Next.js app.</strong>',
    });
    console.log('Email sent:', result);
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();
