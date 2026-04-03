const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

const client = new Client({
  host: 'aws-0-us-east-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  user: 'postgres.fdveuqzezqaopyidllkw',
  password: 'Nosferaded123!!@',
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigration() {
  try {
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '001_initial_schema.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected! Applying migrations...');

    // The migration file might contain multiple statements, 
    // pg.query will run them as a single batch (PostgreSQL supports this)
    await client.query(sql);

    console.log('✅ Migrations applied successfully!');
  } catch (err) {
    console.error('❌ Migration failed:', err.message);
    if (err.stack) console.error(err.stack);
  } finally {
    await client.end();
  }
}

runMigration();
