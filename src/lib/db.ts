import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

let db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set or empty');
  }
  if (!db) {
    const pool = new Pool({ connectionString });
    db = drizzle(pool, { schema });
  }
  return db;
}
