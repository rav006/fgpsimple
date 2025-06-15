import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { tickets } from '@/lib/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['open', 'in_progress', 'resolved', 'closed']),
});

export async function PATCH(req: Request, { params }: { params: { ticketId: string } }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { ticketId } = params;
  if (!ticketId) {
    return NextResponse.json({ message: 'Ticket ID is required' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const validation = updateStatusSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { status } = validation.data;

    const updatedTicket = await db
      .update(tickets)
      .set({
        status: status,
        updatedAt: new Date(), // Manually update the updatedAt timestamp
      })
      .where(eq(tickets.id, ticketId))
      .returning();

    if (updatedTicket.length === 0) {
      return NextResponse.json({ message: 'Ticket not found or no changes made' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Ticket status updated successfully', ticket: updatedTicket[0] }, { status: 200 });

  } catch (error) {
    console.error(`Error updating ticket ${ticketId}:`, error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
