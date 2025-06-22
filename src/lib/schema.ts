import { sql } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
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
  invoiceNumber: varchar("invoice_number", { length: 32 }).notNull().unique(),
  customerName: varchar("customer_name", { length: 255 }).notNull(),
  cashierName: varchar("cashier_name", { length: 255 }),
  items: text("items").notNull(), // JSON stringified array of items
  discount: integer("discount"), // in cents or as percent, depending on logic
  tax: integer("tax"), // in cents or as percent
  total: integer("total").notNull(), // in cents
  status: varchar("status", { length: 32 }).default('unpaid'),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export type ContactInquiry = InferSelectModel<typeof contactInquiries>;
export type Review = InferSelectModel<typeof reviews>;
export type AdminUser = InferSelectModel<typeof adminUsers>;
export type Invoice = InferSelectModel<typeof invoices>;
