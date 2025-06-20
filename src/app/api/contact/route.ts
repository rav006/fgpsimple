import { type NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contactInquiries } from "@/lib/schema";
import { z } from "zod";
import { Resend } from "resend";
import fetch from "node-fetch";

const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" })
    .max(255),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z.string().max(50).optional().or(z.literal("")),
  message: z
    .string()
    .min(10, { message: "Message must be at least 10 characters long" })
    .max(2000),
  isQuoteRequest: z.boolean().default(false),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

// Helper function to send email notification using Resend
async function sendQuoteRequestEmail(
  data: Pick<ContactFormData, "name" | "email" | "phone" | "message">,
) {
  const { name, email, phone, message } = data;
  try {
    const resend = new Resend(process.env.RESEND_API_KEY as string);
    await resend.emails.send({
      from: "info@fentimangreen.co.uk", // Must be a verified sender/domain in Resend
      to: ["info@fentimangreen.co.uk"],
      subject: "New Quote Request Received",
      html: `
        <h1>New Quote Request</h1>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ""}
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
        <hr>
        <p><em>This is an automated notification from the Fentiman Green Ltd website.</em></p>
      `,
    });
    // Error is intentionally not thrown to avoid blocking the main flow
  } catch {}
}

export async function POST(request: NextRequest) {
  try {
    const { recaptchaToken, ...formData } = await request.json();
    // Verify reCAPTCHA token with Google
    const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY as string;
    if (!recaptchaSecret) {
      return NextResponse.json(
        { message: "reCAPTCHA secret key not set on server." },
        { status: 500 },
      );
    }
    let recaptchaRes, recaptchaJson;
    try {
      recaptchaRes = await fetch(
        "https://www.google.com/recaptcha/api/siteverify",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: `secret=${recaptchaSecret}&response=${recaptchaToken}`,
        },
      );
      recaptchaJson = (await recaptchaRes.json()) as {
        success: boolean;
        score?: number;
        action?: string;
        [key: string]: unknown;
      };
    } catch {
      return NextResponse.json(
        { message: "Error verifying reCAPTCHA." },
        { status: 500 },
      );
    }
    if (
      !recaptchaJson.success ||
      (typeof recaptchaJson.score === "number" && recaptchaJson.score < 0.3)
    ) {
      return NextResponse.json(
        { message: "reCAPTCHA verification failed or low score." },
        { status: 400 },
      );
    }

    const validation = contactFormSchema.safeParse(formData);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, phone, message, isQuoteRequest } = validation.data;

    // Save to database
    const [newInquiry] = await getDb()
      .insert(contactInquiries)
      .values({
        name,
        email,
        phone: phone || null,
        message,
        isQuoteRequest,
      })
      .returning({ id: contactInquiries.id });

    if (isQuoteRequest && newInquiry) {
      // Send email notification asynchronously (don't await if not critical for response)
      sendQuoteRequestEmail({ name, email, phone, message }).catch(() => {});
    }

    return NextResponse.json(
      { message: "Inquiry submitted successfully!", inquiryId: newInquiry?.id },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      {
        message: "An unexpected error occurred on the server.",
      },
      { status: 500 },
    );
  }
}
