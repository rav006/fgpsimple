import { getDb } from '../src/lib/db';
import { invoices } from '../src/lib/schema';

async function checkInvoices() {
  try {
    console.log('Connecting to the database...');
    const db = getDb();
    console.log('Fetching invoices...');
    const allInvoices = await db.select().from(invoices);
    console.log('--- Invoices ---');
    console.log(allInvoices);
    console.log('----------------');
    if (allInvoices.length === 0) {
      console.log('The invoices table is empty.');
    } else {
      console.log(`Found ${allInvoices.length} invoice(s).`);
    }
  } catch (error) {
    console.error('Error fetching invoices:', error);
  }
}

checkInvoices();
