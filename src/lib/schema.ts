import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  numeric,
  jsonb,
} from "drizzle-orm/pg-core";
import { InferSelectModel } from "drizzle-orm";

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  message: text("message").notNull(),
  isQuoteRequest: boolean("is_quote_request").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  rating: integer("rating").notNull(), // 1-5
  comment: text("comment").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const adminUsers = pgTable("admin_users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const invoices = pgTable("invoices", {
  id: serial("id").primaryKey(),
  invoiceNumber: varchar("invoice_number", { length: 255 }).notNull(),
  customerName: varchar("customer_name", { length: 255 }).notNull(), // From Bill To
  businessAddress: text("business_address"),
  billTo: text("bill_to"),
  shipTo: text("ship_to"),
  invoiceDate: timestamp("invoice_date"),
  dueDate: timestamp("due_date"),
  paymentTerms: varchar("payment_terms", { length: 255 }),
  poNumber: varchar("po_number", { length: 255 }),
  notes: text("notes"),
  terms: text("terms"),
  items: jsonb("items").notNull().default('[]'),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  taxValue: numeric("tax_value", { precision: 10, scale: 2 }).notNull(),
  taxType: varchar("tax_type", { length: 50 }).notNull(), // 'percentage' or 'fixed'
  discountValue: numeric("discount_value", { precision: 10, scale: 2 }),
  discountType: varchar("discount_type", { length: 50 }), // 'percentage' or 'fixed'
  shipping: numeric("shipping", { precision: 10, scale: 2 }),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  amountPaid: numeric("amount_paid", { precision: 10, scale: 2 }),
  balanceDue: numeric("balance_due", { precision: 10, scale: 2 }).notNull(),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export type ContactInquiry = InferSelectModel<typeof contactInquiries>;
export type Review = InferSelectModel<typeof reviews>;
export type AdminUser = InferSelectModel<typeof adminUsers>;
export type Invoice = InferSelectModel<typeof invoices>;
