import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { contactInquiries } from "@/lib/schema";
import { desc, eq } from "drizzle-orm/sql/expressions";

export async function GET() {
  const inquiries = await getDb()
    .select()
    .from(contactInquiries)
    .orderBy(desc(contactInquiries.createdAt));
  return NextResponse.json({ inquiries });
}

export async function DELETE(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await getDb().delete(contactInquiries).where(eq(contactInquiries.id, id));
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await request.json();
  await getDb()
    .update(contactInquiries)
    .set({
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
    })
    .where(eq(contactInquiries.id, id));
  return NextResponse.json({ success: true });
}
