-- Migration: Add function to look up user ID by email
-- This enables auto-linking registrations to existing accounts

CREATE OR REPLACE FUNCTION get_user_id_by_email(email_input text)
RETURNS uuid AS $$
  SELECT id FROM auth.users WHERE email = lower(email_input) LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER;

-- Grant execute permission to authenticated and anon roles
GRANT EXECUTE ON FUNCTION get_user_id_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_id_by_email(text) TO anon;
GRANT EXECUTE ON FUNCTION get_user_id_by_email(text) TO service_role;
