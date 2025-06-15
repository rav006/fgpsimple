import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { contactInquiries } from '@/lib/schema';
import { z } from 'zod';
import nodemailer from 'nodemailer';

// Define a schema for input validation
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(255),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().max(50).optional().or(z.literal('')),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }).max(2000),
  isQuoteRequest: z.boolean().default(false),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = contactFormSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: "Invalid input.", errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { name, email, phone, message, isQuoteRequest } = validation.data;

    // Save to database
    const [newInquiry] = await db.insert(contactInquiries).values({
      name,
      email,
      phone: phone || null, // Store as null if empty string
      message,
      isQuoteRequest,
    }).returning(); // Use .returning() if you want the inserted record back

    if (isQuoteRequest) {
      console.log('Quote request received. Attempting to send email notification.');
      try {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const mailOptions = {
          from: `"Fentiman Green Ltd" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
          to: 'info@fentimangreen.com',
          subject: 'New Quote Request Received',
          html: `
            <h1>New Quote Request</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <hr>
            <p><em>This is an automated notification from the Fentiman Green Ltd website.</em></p>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log('Email notification sent successfully.');

      } catch (emailError) {
        console.error('Error sending email notification:', emailError);
        // Optionally, you could return a specific error or log this more robustly
        // For now, we'll let the main success response proceed even if email fails
      }
    }

    return NextResponse.json({ message: 'Inquiry submitted successfully!', inquiryId: newInquiry?.id }, { status: 201 });

  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ message: 'An unexpected error occurred on the server.' }, { status: 500 });
  }
}
