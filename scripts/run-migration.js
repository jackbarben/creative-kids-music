const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: { schema: 'public' },
    auth: { persistSession: false }
  }
);

const migration = `
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_magic_links_token ON magic_links(token);
CREATE INDEX IF NOT EXISTS idx_magic_links_expires ON magic_links(expires_at);

ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can create magic links" ON magic_links;
CREATE POLICY "Public can create magic links"
  ON magic_links FOR INSERT
  TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read valid tokens" ON magic_links;
CREATE POLICY "Public can read valid tokens"
  ON magic_links FOR SELECT
  TO public
  USING (
    used_at IS NULL
    AND expires_at > NOW()
  );

DROP POLICY IF EXISTS "Public can mark tokens used" ON magic_links;
CREATE POLICY "Public can mark tokens used"
  ON magic_links FOR UPDATE
  TO public
  USING (used_at IS NULL AND expires_at > NOW())
  WITH CHECK (used_at IS NOT NULL);

DROP POLICY IF EXISTS "Admins can do anything with magic links" ON magic_links;
CREATE POLICY "Admins can do anything with magic links"
  ON magic_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
`;

async function runMigration() {
  // Supabase JS client doesn't support raw SQL
  // We need to use the postgres connection directly
  // or use the Supabase Dashboard

  console.log('Supabase JS client does not support DDL operations.');
  console.log('');
  console.log('Please run this SQL in Supabase Dashboard > SQL Editor:');
  console.log('');
  console.log(migration);
}

runMigration();
