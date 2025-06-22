import { db } from "@/lib/db";
import { invoices } from "@/lib/schema";
import { desc } from "drizzle-orm";

export default async function handler(req, res) {
  const { method, body } = req;

  switch (method) {
    case "GET": {
      const all = await db.select().from(invoices).orderBy(desc(invoices.createdAt));
      return res.status(200).json(all);
    }
    case "POST": {
      const data = body;
      const result = await db.insert(invoices).values({
        invoiceNumber: data.invoiceNumber,
        customerName: data.customerName,
        cashierName: data.cashierName,
        items: JSON.stringify(data.items),
        discount: data.discount,
        tax: data.tax,
        total: data.total,
        status: data.status || 'unpaid',
      }).returning();
      return res.status(201).json(result[0]);
    }
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
}
