// Usage: node scripts/test-db-connection.js
// Simple script to test Neon Postgres connection

const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

// Use the same DATABASE_URL as in create-admin-user.js
const connectionString = 'postgresql://neondb_owner:npg_jpGWnrL9Y3Cy@ep-tiny-poetry-a8hwq1zz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

async function main() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    const res = await client.query('SELECT NOW() as now');
    console.log('Database connection successful! Server time:', res.rows[0].now);
  } catch (err) {
    console.error('Database connection failed:', err);
  } finally {
    await client.end();
  }
}

main();
