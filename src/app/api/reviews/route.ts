import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Client } from "pg";

const reviewSchema = z.object({
  name: z.string().min(2).max(255),
  rating: z.number().min(1).max(5),
  comment: z.string().min(5).max(2000),
});

const DATABASE_URL =
  process.env.DATABASE_URL ||
  'postgresql://neondb_owner:npg_o4OaLcYVjn1T@ep-tiny-poetry-a8hwq1zz.eastus2.azure.neon.tech/neondb?sslmode=require';

export async function GET() {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const result = await client.query(
      "SELECT id, name, rating, comment, created_at FROM reviews ORDER BY created_at DESC",
    );
    // Map to camelCase for frontend
    const reviews = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      rating: row.rating,
      comment: row.comment,
      createdAt: row.created_at,
    }));
    return NextResponse.json(reviews);
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await client.end();
  }
}

export async function POST(request: NextRequest) {
  const client = new Client({ connectionString: DATABASE_URL });
  await client.connect();
  try {
    const body = await request.json();
    const validation = reviewSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        {
          message: "Invalid input.",
          errors: validation.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }
    const { name, rating, comment } = validation.data;
    const result = await client.query(
      "INSERT INTO reviews (name, rating, comment) VALUES ($1, $2, $3) RETURNING id, name, rating, comment, created_at",
      [name, rating, comment],
    );
    const review = result.rows[0];
    return NextResponse.json(
      {
        id: review.id,
        name: review.name,
        rating: review.rating,
        comment: review.comment,
        createdAt: review.created_at,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Server error", error: String(error) },
      { status: 500 },
    );
  } finally {
    await client.end();
  }
}
