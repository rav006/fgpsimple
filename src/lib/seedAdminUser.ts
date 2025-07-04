// Script to seed an admin user into the database
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import bcrypt from "bcryptjs";

async function seed() {
  const username = "fguserper";
  const password = "Mila2025";
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(`Seeded admin user - Username: ${username}, PasswordHash: ${passwordHash}`);
}

seed().catch(console.error);
