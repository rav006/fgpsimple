import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Client } from 'pg';

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query('SELECT * FROM admin_users');
    console.log('Users:', res.rows);
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
})();
