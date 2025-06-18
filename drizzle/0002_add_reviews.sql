-- Add reviews table for user reviews
CREATE TABLE "reviews" (
  "id" serial PRIMARY KEY NOT NULL,
  "name" varchar(255) NOT NULL,
  "rating" integer NOT NULL,
  "comment" text NOT NULL,
  "created_at" timestamp DEFAULT now()
);
