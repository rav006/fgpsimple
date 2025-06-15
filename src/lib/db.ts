import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

// TODO: Replace with your actual connection string in environment variables
const connectionString = process.env.DATABASE_URL || 'postgresql://user:password@host:port/database';

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
