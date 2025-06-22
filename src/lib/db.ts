import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set or empty");
  }

  if (!_db) {
    const pool = new Pool({
      connectionString,
    });
    _db = drizzle(pool, { schema });
  }

  return _db;
}

export const db = getDb();
