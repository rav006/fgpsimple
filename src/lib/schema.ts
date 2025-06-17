import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar, timestamp, boolean } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 50 }),
  message: text('message').notNull(),
  isQuoteRequest: boolean('is_quote_request').default(false),
  createdAt: timestamp('created_at').default(sql`now()`),
});

export type ContactInquiry = InferSelectModel<typeof contactInquiries>;