import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { tickets, contactInquiries } from '@/lib/schema';
import { sql, eq, count } from 'drizzle-orm';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Total tickets
    const [totalTicketsResult] = await db.select({ value: count() }).from(tickets);
    const totalTickets = totalTicketsResult?.value || 0;

    // Tickets by status
    const openTicketsResult = await db.select({ value: count() }).from(tickets).where(eq(tickets.status, 'open'));
    const openTickets = openTicketsResult[0]?.value || 0;
    
    const inProgressTicketsResult = await db.select({ value: count() }).from(tickets).where(eq(tickets.status, 'in_progress'));
    const inProgressTickets = inProgressTicketsResult[0]?.value || 0;

    const resolvedTicketsResult = await db.select({ value: count() }).from(tickets).where(eq(tickets.status, 'resolved'));
    const resolvedTickets = resolvedTicketsResult[0]?.value || 0;

    const closedTicketsResult = await db.select({ value: count() }).from(tickets).where(eq(tickets.status, 'closed'));
    const closedTickets = closedTicketsResult[0]?.value || 0;

    // Total quote requests
    const [totalQuoteRequestsResult] = await db.select({ value: count() }).from(contactInquiries).where(eq(contactInquiries.isQuoteRequest, true));
    const totalQuoteRequests = totalQuoteRequestsResult?.value || 0;
    
    // Total users (optional, if needed)
    // const [totalUsersResult] = await db.select({ value: count() }).from(users);
    // const totalUsers = totalUsersResult?.value || 0;

    return NextResponse.json({
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
      totalQuoteRequests,
      // totalUsers, 
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
