require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

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
CREATE POLICY "Public can create magic links" ON magic_links FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Public can read valid tokens" ON magic_links;
CREATE POLICY "Public can read valid tokens" ON magic_links FOR SELECT TO public USING (used_at IS NULL AND expires_at > NOW());

DROP POLICY IF EXISTS "Public can mark tokens used" ON magic_links;
CREATE POLICY "Public can mark tokens used" ON magic_links FOR UPDATE TO public USING (used_at IS NULL AND expires_at > NOW()) WITH CHECK (used_at IS NOT NULL);

DROP POLICY IF EXISTS "Admins can do anything with magic links" ON magic_links;
CREATE POLICY "Admins can do anything with magic links" ON magic_links FOR ALL TO authenticated USING (true) WITH CHECK (true);
`;

async function runMigration() {
  // Try the Supabase SQL Query API (if available)
  const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_KEY,
      'Authorization': `Bearer ${SERVICE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=representation'
    },
    body: JSON.stringify({ query: migration })
  });

  if (!response.ok) {
    // Try pg_query endpoint
    const pgResponse = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: migration })
    });

    if (!pgResponse.ok) {
      console.log('API-based SQL execution not available.');
      console.log('Please run the migration manually in Supabase Dashboard > SQL Editor.');
      console.log('');
      console.log('Or provide the database password to connect directly.');
      console.log('Find it at: Supabase Dashboard > Settings > Database > Database Password');
      process.exit(1);
    }

    const result = await pgResponse.json();
    console.log('Migration result:', result);
  } else {
    const result = await response.json();
    console.log('Migration result:', result);
  }
}

runMigration().catch(console.error);
