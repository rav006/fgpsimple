import { getDb } from '@/lib/db';
import { invoices } from '@/lib/schema';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = getDb();
    const allInvoices = await db
      .select()
      .from(invoices)
      .orderBy(desc(invoices.createdAt));
    return NextResponse.json(allInvoices, { status: 200 });
  } catch (error) {
    console.error('[INVOICES_GET]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('ID is required', { status: 400 });
    }

    const deletedInvoice = await db
      .delete(invoices)
      .where(eq(invoices.id, Number(id)))
      .returning();

    if (deletedInvoice.length === 0) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    return NextResponse.json(deletedInvoice[0], { status: 200 });
  } catch (error) {
    console.error('[INVOICES_DELETE]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = getDb();
    const body = await req.json();
    const {
      invoiceNumber,
      cashierName,
      customerName,
      items,
      tax,
      discount,
      total,
    } = body;

    if (!invoiceNumber) {
      return new NextResponse('Invoice number is required', { status: 400 });
    }

    const newInvoice = await db
      .insert(invoices)
      .values({
        invoiceNumber,
        cashierName,
        customerName,
        items,
        tax,
        discount,
        total,
      })
      .returning();

    return NextResponse.json(newInvoice[0], { status: 201 });
  } catch (error) {
    console.error('[INVOICES_POST]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const db = getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const body = await req.json();
    const {
      invoiceNumber,
      cashierName,
      customerName,
      items,
      tax,
      discount,
      total,
      status,
    } = body;

    if (!id) {
      return new NextResponse('ID is required', { status: 400 });
    }

    const updatedInvoice = await db
      .update(invoices)
      .set({
        invoiceNumber,
        cashierName,
        customerName,
        items,
        tax,
        discount,
        total,
        status,
        updatedAt: new Date(),
      })
      .where(eq(invoices.id, Number(id)))
      .returning();

    if (updatedInvoice.length === 0) {
      return new NextResponse('Invoice not found', { status: 404 });
    }

    return NextResponse.json(updatedInvoice[0], { status: 200 });
  } catch (error) {
    console.error('[INVOICES_PUT]', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
