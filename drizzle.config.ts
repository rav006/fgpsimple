import type { Config } from 'drizzle-kit';
import * as dotenv from 'dotenv';
dotenv.config({
  path: '.env.local',
});

export default {
  schema: './src/lib/schema.ts',
  out: './drizzle',
  dialect: 'postgresql', // Ensure this is correctly defined
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  }
} satisfies Config;
