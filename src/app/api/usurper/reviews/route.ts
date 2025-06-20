import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { reviews } from "@/lib/schema";
import { eq } from "drizzle-orm/sql/expressions";

export async function GET() {
  const all = await getDb().select().from(reviews).orderBy(reviews.createdAt);
  return NextResponse.json({ reviews: all });
}

export async function DELETE(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await getDb().delete(reviews).where(eq(reviews.id, id));
  return NextResponse.json({ success: true });
}

export async function PUT(request: NextRequest) {
  const id = Number(request.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  const data = await request.json();
  await getDb()
    .update(reviews)
    .set({
      name: data.name,
      rating: Number(data.rating),
      comment: data.comment,
    })
    .where(eq(reviews.id, id));
  return NextResponse.json({ success: true });
}
