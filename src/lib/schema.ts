import { sql } from 'drizzle-orm';
import { pgTable, serial, text, varchar, timestamp, boolean, integer } from 'drizzle-orm/pg-core';
import { InferSelectModel } from 'drizzle-orm';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).unique().notNull(),
  password: text('password').notNull(),
  name: varchar('name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('customer').notNull(), // 'customer' or 'admin'
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
});

export const tickets = pgTable('tickets', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id),
  serviceType: varchar('service_type', { length: 100 }).notNull(), // e.g., 'building_maintenance', 'cleaning_service'
  priority: varchar('priority', { length: 50 }).default('medium').notNull(), // 'low', 'medium', 'high'
  description: text('description').notNull(),
  status: varchar('status', { length: 50 }).default('open').notNull(), // 'open', 'in_progress', 'resolved', 'closed'
  createdAt: timestamp('created_at').default(sql`now()`),
  updatedAt: timestamp('updated_at').default(sql`now()`),
  resolvedAt: timestamp('resolved_at'),
});

export type Ticket = InferSelectModel<typeof tickets>;

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