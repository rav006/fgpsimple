
import { getDb } from "../src/lib/db";
import { reviews } from "../src/lib/schema";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function checkReviews() {
  try {
    console.log("Connecting to the database to check for reviews...");
    const db = getDb();
    const allReviews = await db.select().from(reviews);
    console.log("Query successful. Reviews found:", allReviews);
    if (allReviews.length === 0) {
      console.log("The 'reviews' table is empty.");
    }
  } catch (error) {
    console.error("Failed to fetch reviews from the database:", error);
  }
}

checkReviews();
