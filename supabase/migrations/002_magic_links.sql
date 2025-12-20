-- Magic Links for Parent Access
-- Run this in Supabase SQL Editor

-- Table to store magic link tokens
CREATE TABLE IF NOT EXISTS magic_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for token lookup
CREATE INDEX idx_magic_links_token ON magic_links(token);

-- Index for cleanup of expired tokens
CREATE INDEX idx_magic_links_expires ON magic_links(expires_at);

-- RLS policies
ALTER TABLE magic_links ENABLE ROW LEVEL SECURITY;

-- Allow public to create tokens (for requesting access)
CREATE POLICY "Public can create magic links"
  ON magic_links FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public to read their own token (for validation)
CREATE POLICY "Public can read valid tokens"
  ON magic_links FOR SELECT
  TO public
  USING (
    used_at IS NULL
    AND expires_at > NOW()
  );

-- Allow public to mark token as used
CREATE POLICY "Public can mark tokens used"
  ON magic_links FOR UPDATE
  TO public
  USING (used_at IS NULL AND expires_at > NOW())
  WITH CHECK (used_at IS NOT NULL);

-- Admins can see all
CREATE POLICY "Admins can do anything with magic links"
  ON magic_links FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Function to clean up old tokens (run periodically)
CREATE OR REPLACE FUNCTION cleanup_expired_magic_links()
RETURNS void AS $$
BEGIN
  DELETE FROM magic_links
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;
