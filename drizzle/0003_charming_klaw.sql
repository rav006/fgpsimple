ALTER TABLE "invoices" ADD COLUMN "invoice_number" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "business_address" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "bill_to" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "ship_to" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "invoice_date" timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "due_date" timestamp;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "payment_terms" varchar(255);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "po_number" varchar(255);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "notes" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "terms" text;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "items" jsonb DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "subtotal" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "tax_value" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "tax_type" varchar(50) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "discount_value" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "discount_type" varchar(50);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "shipping" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "total" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "amount_paid" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "invoices" ADD COLUMN "balance_due" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "invoices" DROP COLUMN "amount";