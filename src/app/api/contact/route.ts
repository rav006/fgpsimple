import { type NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { contactInquiries } from '@/lib/schema';
import { z } from 'zod';
import nodemailer from 'nodemailer';
import fetch from 'node-fetch';

// Define a schema for input validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(255),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().max(50).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }).max(2000),
  isQuoteRequest: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Helper function to send email notification
async function sendQuoteRequestEmail(data: Pick<ContactFormData, 'name' | 'email' | 'phone' | 'message'>) {
  const { name, email, phone, message } = data;
  console.log('Attempting to send email notification for quote request.');
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      // Add timeout options
      connectionTimeout: 10000, // 10 seconds
      socketTimeout: 10000, // 10 seconds
    });

    const mailOptions = {
      from: `\"Fentiman Green Ltd\" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to: process.env.QUOTE_REQUEST_EMAIL_RECIPIENT || 'info@fentimangreen.com', // Use env var for recipient
      subject: 'New Quote Request Received',
      html: `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\\n/g, '<br>')}</p> {/* Sanitize message for HTML */}
        <hr>
        <p><em>This is an automated notification from the Fentiman Green Ltd website.</em></p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Email notification sent successfully.');
  } catch (emailError) {
    console.error('Error sending email notification:', emailError);
    // Email sending failure should not prevent the main operation from succeeding.
    // Error is logged, but no error is thrown to the caller.
  }
}

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken, ...formData } = await request.json();

    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY;
    if (!recaptchaSecret) {
      return NextResponse.json({ message: 'reCAPTCHA secret key not set on server.' }, { status: 500 });
    }
    const recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
    });
    const recaptchaJson = await recaptchaRes.json() as { success: boolean };
    if (!recaptchaJson.success) {
      return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 });
    }

    const validation = contactFormSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input.", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, phone, message, isQuoteRequest } = validation.data;

    // Save to database
    const [newInquiry] = await getDb().insert(contactInquiries).values({
      name,
      email,
      phone: phone || null,
      message,
      isQuoteRequest,
    }).returning({ id: contactInquiries.id });

    if (isQuoteRequest && newInquiry) {
      // Send email notification asynchronously (don't await if not critical for response)
      sendQuoteRequestEmail({ name, email, phone, message }).catch(err => {
        // Catch errors from the async email sending if not awaited, to prevent unhandled promise rejections
        console.error("Async email sending failed:", err);
      });
    }

    return NextResponse.json({ message: 'Inquiry submitted successfully!', inquiryId: newInquiry?.id }, { status: 201 });

  } catch (error) {
    // Enhanced error logging for debugging
    if (error instanceof Error) {
      console.error('Error processing contact form:', error.message, error.stack);
    } else {
      console.error('Unknown error processing contact form:', error);
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.', errorDetails: String(error) }, { status: 500 });
  }
}
