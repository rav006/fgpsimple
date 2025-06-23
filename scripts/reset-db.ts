import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '.env.local' });

const main = async () => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is not set');
  }

  const dbUrl = new URL(connectionString);
  const dbName = dbUrl.pathname.slice(1);

  // Connect to the default 'postgres' database to drop/create the target database
  dbUrl.pathname = '/postgres';
  const adminConnectionString = dbUrl.toString();

  const client = new Client({ connectionString: adminConnectionString });

  try {
    await client.connect();
    console.log(`Connected to the postgres database.`);

    console.log(`Attempting to drop database: ${dbName}...`);
    // The WITH (FORCE) option is available on PostgreSQL 13+ and is useful for cloud environments
    await client.query(`DROP DATABASE IF EXISTS "${dbName}" WITH (FORCE)`);
    console.log(`Database "${dbName}" dropped.`);

    console.log(`Attempting to create database: ${dbName}...`);
    await client.query(`CREATE DATABASE "${dbName}"`);
    console.log(`Database "${dbName}" created successfully.`);

  } catch (error) {
    console.error('An error occurred during the database reset process:', error);
    process.exit(1); // Exit with an error code
  } finally {
    await client.end();
    console.log('Connection to postgres database closed.');
  }
};

main();
