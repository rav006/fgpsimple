ALTER TABLE "invoices" ADD COLUMN "status" varchar(32) DEFAULT 'unpaid';
ALTER TABLE "invoices" ADD COLUMN "updated_at" timestamp DEFAULT now();
ALTER TABLE "invoices" ALTER COLUMN "tax" SET DATA TYPE integer USING tax::integer;
ALTER TABLE "invoices" ALTER COLUMN "discount" SET DATA TYPE integer USING discount::integer;
ALTER TABLE "invoices" ALTER COLUMN "total" SET DATA TYPE integer USING total::integer;
