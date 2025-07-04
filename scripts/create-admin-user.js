// Usage: node scripts/create-admin-user.js
// Make sure you have 'pg' and 'prompt-sync' installed: npm install pg prompt-sync

const { Client } = require('pg');
const bcrypt = require('bcrypt');
const prompt = require('prompt-sync')({ sigint: true });
require('dotenv').config({ path: '.env.local' });

// Override DATABASE_URL for this script run
process.env.DATABASE_URL = 'postgresql://neondb_owner:npg_jpGWnrL9Y3Cy@ep-tiny-poetry-a8hwq1zz-pooler.eastus2.azure.neon.tech/neondb?sslmode=require';

const username = prompt('Enter admin username: ');
const password = prompt('Enter admin password: ', { echo: '*' });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const res = await client.query(
      `INSERT INTO admin_users (username, password_hash) VALUES ($1, $2) RETURNING *;`,
      [username, passwordHash]
    );
    console.log('Admin user created:', res.rows[0]);
  } catch (err) {
    console.error('Error inserting admin user:', err);
  } finally {
    await client.end();
  }
}

main();
