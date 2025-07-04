import { db } from '@/lib/db';
import { invoices } from '@/lib/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const allInvoices = await db.select().from(invoices);
    return NextResponse.json(allInvoices, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch invoices:', error);
    return NextResponse.json(
      { message: 'Failed to fetch invoices' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // TODO: Add validation here using a library like Zod

    const newInvoice = await db.insert(invoices).values(body).returning();

    return NextResponse.json(newInvoice[0], { status: 201 });
  } catch (error) {
    console.error('Failed to create invoice:', error);
    return NextResponse.json(
      { message: 'Failed to create invoice' },
      { status: 500 }
    );
  }
}

// Keeping these as not implemented for now
export async function DELETE() {
  return new Response(JSON.stringify({ message: 'Not implemented' }), { status: 501 });
}

export async function PUT() {
  return new Response(JSON.stringify({ message: 'Not implemented' }), { status: 501 });
}
