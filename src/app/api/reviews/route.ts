import { type NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { reviews } from '@/lib/schema';
import { z } from 'zod';
import { desc } from 'drizzle-orm';

const reviewSchema = z.object({
  name: z.string().min(2).max(255),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(2000),
});

export async function GET() {
  const db = getDb();
  const allReviews = await db.select().from(reviews).orderBy(desc(reviews.createdAt));
  return NextResponse.json(allReviews);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input.', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }
    const { name, rating, comment } = validation.data;
    const db = getDb();
    const [newReview] = await db.insert(reviews).values({ name, rating, comment }).returning();
    return NextResponse.json(newReview, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Server error', error: String(error) }, { status: 500 });
  }
}
