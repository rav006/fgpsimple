import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set in .env.local');
}

neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });