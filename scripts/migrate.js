const postgres = require('postgres');
require('dotenv').config({ path: '.env.local' });

// Try connecting with service role key as password
const sql = postgres({
  host: 'aws-0-us-west-2.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  username: 'postgres.qidzeagzbrqxntrqbpzx',
  password: process.env.SUPABASE_SERVICE_ROLE_KEY,
  ssl: 'require',
});

async function runMigration() {
  try {
    console.log('Running magic_links migration...');

    await sql`
      CREATE TABLE IF NOT EXISTS magic_links (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email TEXT NOT NULL,
        token TEXT NOT NULL UNIQUE,
        expires_at TIMESTAMPTZ NOT NULL,
        used_at TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      )
    `;
    console.log('✓ Table created');

    await sql`CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at)`;
    console.log('✓ Indexes created');

    await sql`ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY`;
    console.log('✓ RLS enabled');

    // Policies
    await sql`DROP POLICY IF EXISTS "Public can create magic links" ON magic_links`;
    await sql`CREATE POLICY "Public can create magic links" ON magic_links FOR INSERT TO public WITH CHECK (true)`;

    await sql`DROP POLICY IF EXISTS "Public can read valid tokens" ON magic_links`;
    await sql`CREATE POLICY "Public can read valid tokens" ON magic_links FOR SELECT TO public USING (used_at IS NULL AND expires_at > NOW())`;

    await sql`DROP POLICY IF EXISTS "Public can mark tokens used" ON magic_links`;
    await sql`CREATE POLICY "Public can mark tokens used" ON magic_links FOR UPDATE TO public USING (used_at IS NULL AND expires_at > NOW()) WITH CHECK (used_at IS NOT NULL)`;

    await sql`DROP POLICY IF EXISTS "Admins can do anything with magic links" ON magic_links`;
    await sql`CREATE POLICY "Admins can do anything with magic links" ON magic_links FOR ALL TO authenticated USING (true) WITH CHECK (true)`;
    console.log('✓ Policies created');

    console.log('');
    console.log('Migration complete!');

    await sql.end();
  } catch (error) {
    console.error('Migration failed:', error.message);
    await sql.end();
    process.exit(1);
  }
}

runMigration();
