import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { contactInquiries } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const quotes = await db
      .select()
      .from(contactInquiries)
      .where(eq(contactInquiries.isQuoteRequest, true))
      .orderBy(desc(contactInquiries.createdAt));

    return NextResponse.json({ quotes }, { status: 200 });
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
