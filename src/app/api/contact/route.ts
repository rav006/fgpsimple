import { type NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { contactInquiries } from '@/lib/schema';
import { z } from 'zod';
import { Resend } from 'resend';
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

// Helper function to send email notification using Resend
async function sendQuoteRequestEmail(data: Pick<ContactFormData, 'name' | 'email' | 'phone' | 'message'>) {
  const { name, email, phone, message } = data;
  console.log('Attempting to send email notification for quote request (Resend).');
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    const { data: result, error } = await resend.emails.send({
      from: 'info@fentimangreen.co.uk', // Must be a verified sender/domain in Resend
      to: ['info@fentimangreen.co.uk'],
      subject: 'New Quote Request Received',
      html: `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This is an automated notification from the Fentiman Green Ltd website.</em></p>
      `,
    });
    if (error) {
      console.error('Resend email error:', error);
    } else {
      console.log('Resend email sent:', result);
    }
  } catch (err) {
    console.error('Unexpected error sending email with Resend:', err);
  }
}

export async function POST(request: NextRequest) {
  console.log('Contact API called');
  try {
    const { recaptchaToken, ...formData } = await request.json();
    console.log('Received recaptchaToken:', recaptchaToken);
    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY as string;
    if (!recaptchaSecret) {
      console.log('Missing RECAPTCHA_SECRET_KEY in environment');
      return NextResponse.json({ message: 'reCAPTCHA secret key not set on server.' }, { status: 500 });
    }
    let recaptchaRes, recaptchaJson;
    try {
      recaptchaRes = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
      });
      recaptchaJson = await recaptchaRes.json() as { success: boolean; score?: number; action?: string; [key: string]: unknown };
      console.log('reCAPTCHA response:', recaptchaJson);
    } catch (err) {
      console.error('Error during reCAPTCHA fetch/parse:', err);
      return NextResponse.json({ message: 'Error verifying reCAPTCHA.' }, { status: 500 });
    }
    if (!recaptchaJson.success || (typeof recaptchaJson.score === 'number' && recaptchaJson.score < 0.3)) {
      console.log('Failing due to reCAPTCHA:', recaptchaJson);
      return NextResponse.json({ message: 'reCAPTCHA verification failed or low score.' }, { status: 400 });
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
    console.error('Contact API error:', error);
    if (error instanceof Error) {
      console.error('Error processing contact form:', error.message, error.stack);
    } else {
      console.error('Unknown error processing contact form:', error);
    }
    return NextResponse.json({ message: 'An unexpected error occurred on the server.', errorDetails: String(error) }, { status: 500 });
  }
}
