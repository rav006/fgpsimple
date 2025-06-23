import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { Client } from 'pg';

const username = 'fgusurper';
const passwordHash = '$2b$10$zbJ3C/WvGw3BHMUdJPxc5OFS4LBtGNP1.tQncHLf8ZCCURooHN/p2';

(async () => {
  const client = new Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    const res = await client.query(
      'UPDATE admin_users SET password_hash = $1 WHERE username = $2 RETURNING *',
      [passwordHash, username]
    );
    if (res.rowCount && res.rowCount > 0) {
      console.log('Password hash updated for', username);
    } else {
      console.log('No user found with username', username);
    }
  } catch (err) {
    console.error('Database error:', err);
  } finally {
    await client.end();
  }
})();
