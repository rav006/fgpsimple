// Script to seed an admin user into the database
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { getDb } from "./db";
import { adminUsers } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const username = "fguserper";
  const password = "Mila2025";
  const passwordHash = await bcrypt.hash(password, 10);
  await getDb().insert(adminUsers).values({ username, passwordHash });
}

seed().catch(console.error);
