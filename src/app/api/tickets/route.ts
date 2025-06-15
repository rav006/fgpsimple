import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/db';
import { tickets, users } from '@/lib/schema'; // Added users import
import { z } from 'zod';
import { eq, desc } from 'drizzle-orm'; // Added desc import

const ticketSchema = z.object({
  serviceType: z.enum(['cleaning', 'maintenance', 'repair', 'gardening', 'window_cleaning', 'other']),
  description: z.string().min(10, 'Description must be at least 10 characters long').max(1000),
  priority: z.enum(['low', 'medium', 'high']),
});

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const validation = ticketSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ message: 'Invalid input', errors: validation.error.flatten().fieldErrors }, { status: 400 });
    }

    const { serviceType, description, priority } = validation.data;

    const newTicket = await db
      .insert(tickets)
      .values({
        userId: session.user.id,
        serviceType: serviceType,
        description: description,
        priority: priority,
        status: 'open', // Default status
      })
      .returning();

    return NextResponse.json({ message: 'Ticket created successfully', ticket: newTicket[0] }, { status: 201 });

  } catch (error) {
    console.error('Error creating ticket:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    if (session.user.role === 'admin') {
      // Admin: Fetch all tickets and join with user data
      const allTickets = await db
        .select({
          id: tickets.id,
          userId: tickets.userId,
          serviceType: tickets.serviceType,
          description: tickets.description,
          priority: tickets.priority,
          status: tickets.status,
          createdAt: tickets.createdAt,
          updatedAt: tickets.updatedAt,
          userName: users.name,
          userEmail: users.email,
        })
        .from(tickets)
        .leftJoin(users, eq(tickets.userId, users.id))
        .orderBy(desc(tickets.createdAt)); // Show newest first for admin
      return NextResponse.json({ tickets: allTickets }, { status: 200 });
    } else {
      // Customer: Fetch only their own tickets
      const userTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.userId, session.user.id))
        .orderBy(desc(tickets.createdAt)); // Show newest first
      return NextResponse.json({ tickets: userTickets }, { status: 200 });
    }
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
