-- Parent Accounts Migration
-- Adds user_id linking, cancellation tracking, and optimistic locking
-- Note: Waiver fields deferred until legal review complete

-- ============================================
-- WORKSHOP REGISTRATIONS: Add parent account fields
-- ============================================

ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_workshop_reg_user ON workshop_registrations(user_id);

-- ============================================
-- CAMP REGISTRATIONS: Add parent account fields
-- ============================================

ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS cancellation_reason TEXT,
  ADD COLUMN IF NOT EXISTS version INTEGER NOT NULL DEFAULT 1;

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_camp_reg_user ON camp_registrations(user_id);

-- ============================================
-- AUTHORIZED PICKUPS TABLE (Camp only)
-- ============================================

CREATE TABLE IF NOT EXISTS authorized_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_registration_id UUID NOT NULL REFERENCES camp_registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_pickups_registration ON authorized_pickups(camp_registration_id);

-- Enable RLS
ALTER TABLE authorized_pickups ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS HELPER FUNCTION
-- ============================================

-- Check if current user owns a registration
CREATE OR REPLACE FUNCTION is_registration_owner(reg_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  IF reg_user_id IS NOT NULL AND reg_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- RLS POLICIES: Parent access to own data
-- ============================================

-- Drop existing overly-permissive policies for registrations
DROP POLICY IF EXISTS "Anyone can create workshop registrations" ON workshop_registrations;
DROP POLICY IF EXISTS "Authenticated users have full access to workshop registrations" ON workshop_registrations;
DROP POLICY IF EXISTS "Anyone can create workshop children" ON workshop_children;
DROP POLICY IF EXISTS "Authenticated users have full access to workshop children" ON workshop_children;
DROP POLICY IF EXISTS "Anyone can create camp registrations" ON camp_registrations;
DROP POLICY IF EXISTS "Authenticated users have full access to camp registrations" ON camp_registrations;
DROP POLICY IF EXISTS "Anyone can create camp children" ON camp_children;
DROP POLICY IF EXISTS "Authenticated users have full access to camp children" ON camp_children;

-- WORKSHOP REGISTRATIONS

-- Anyone can create (registration form is public)
CREATE POLICY "public_insert_workshop_registrations"
  ON workshop_registrations FOR INSERT
  WITH CHECK (true);

-- Parents can read their own registrations
CREATE POLICY "parents_read_own_workshop_registrations"
  ON workshop_registrations FOR SELECT
  USING (is_registration_owner(user_id));

-- Parents can update their own registrations
CREATE POLICY "parents_update_own_workshop_registrations"
  ON workshop_registrations FOR UPDATE
  USING (is_registration_owner(user_id));

-- Service role (admin) has full access (uses service_role key, bypasses RLS)

-- WORKSHOP CHILDREN

-- Anyone can create (during registration)
CREATE POLICY "public_insert_workshop_children"
  ON workshop_children FOR INSERT
  WITH CHECK (true);

-- Parents can read their own children
CREATE POLICY "parents_read_own_workshop_children"
  ON workshop_children FOR SELECT
  USING (
    registration_id IN (
      SELECT id FROM workshop_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- Parents can update their own children
CREATE POLICY "parents_update_own_workshop_children"
  ON workshop_children FOR UPDATE
  USING (
    registration_id IN (
      SELECT id FROM workshop_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- Parents can delete their own children (remove child feature)
CREATE POLICY "parents_delete_own_workshop_children"
  ON workshop_children FOR DELETE
  USING (
    registration_id IN (
      SELECT id FROM workshop_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- CAMP REGISTRATIONS

-- Anyone can create (registration form is public)
CREATE POLICY "public_insert_camp_registrations"
  ON camp_registrations FOR INSERT
  WITH CHECK (true);

-- Parents can read their own registrations
CREATE POLICY "parents_read_own_camp_registrations"
  ON camp_registrations FOR SELECT
  USING (is_registration_owner(user_id));

-- Parents can update their own registrations
CREATE POLICY "parents_update_own_camp_registrations"
  ON camp_registrations FOR UPDATE
  USING (is_registration_owner(user_id));

-- CAMP CHILDREN

-- Anyone can create (during registration)
CREATE POLICY "public_insert_camp_children"
  ON camp_children FOR INSERT
  WITH CHECK (true);

-- Parents can read their own children
CREATE POLICY "parents_read_own_camp_children"
  ON camp_children FOR SELECT
  USING (
    registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- Parents can update their own children
CREATE POLICY "parents_update_own_camp_children"
  ON camp_children FOR UPDATE
  USING (
    registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- Parents can delete their own children
CREATE POLICY "parents_delete_own_camp_children"
  ON camp_children FOR DELETE
  USING (
    registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- AUTHORIZED PICKUPS

-- Anyone can create (during registration)
CREATE POLICY "public_insert_authorized_pickups"
  ON authorized_pickups FOR INSERT
  WITH CHECK (true);

-- Parents can manage their own pickups
CREATE POLICY "parents_read_own_pickups"
  ON authorized_pickups FOR SELECT
  USING (
    camp_registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

CREATE POLICY "parents_update_own_pickups"
  ON authorized_pickups FOR UPDATE
  USING (
    camp_registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

CREATE POLICY "parents_delete_own_pickups"
  ON authorized_pickups FOR DELETE
  USING (
    camp_registration_id IN (
      SELECT id FROM camp_registrations
      WHERE is_registration_owner(user_id)
    )
  );

-- ============================================
-- HELPER FUNCTION: Get all children for a parent
-- Used for cross-program sibling discount calculation
-- ============================================

CREATE OR REPLACE FUNCTION get_all_children_for_parent(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  registration_id UUID,
  program_type TEXT,
  child_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  -- Workshop children
  SELECT
    wc.id,
    wc.registration_id,
    'workshop'::TEXT as program_type,
    wc.child_name,
    wc.created_at
  FROM workshop_children wc
  JOIN workshop_registrations wr ON wc.registration_id = wr.id
  WHERE wr.user_id = p_user_id
    AND wr.status != 'cancelled'

  UNION ALL

  -- Camp children
  SELECT
    cc.id,
    cc.registration_id,
    'camp'::TEXT as program_type,
    cc.child_name,
    cc.created_at
  FROM camp_children cc
  JOIN camp_registrations cr ON cc.registration_id = cr.id
  WHERE cr.user_id = p_user_id
    AND cr.status != 'cancelled'

  ORDER BY created_at ASC;  -- First registered = first child (full price)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- HELPER FUNCTION: Recalculate registration total
-- Call after adding/removing children
-- ============================================

CREATE OR REPLACE FUNCTION recalculate_registration_total(
  p_registration_id UUID,
  p_program_type TEXT,  -- 'workshop' or 'camp'
  p_user_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  base_price INTEGER;
  sibling_discount INTEGER := 1000;  -- $10 in cents
  all_children RECORD;
  child_index INTEGER := 0;
  reg_total INTEGER := 0;
  current_reg_children UUID[];
BEGIN
  -- Set base price based on program type
  IF p_program_type = 'workshop' THEN
    base_price := 7500;  -- $75
  ELSE
    base_price := 40000;  -- $400
  END IF;

  -- Get all child IDs for this specific registration
  IF p_program_type = 'workshop' THEN
    SELECT ARRAY_AGG(id) INTO current_reg_children
    FROM workshop_children
    WHERE registration_id = p_registration_id;
  ELSE
    SELECT ARRAY_AGG(id) INTO current_reg_children
    FROM camp_children
    WHERE registration_id = p_registration_id;
  END IF;

  -- Loop through ALL children for this parent (ordered by creation)
  FOR all_children IN
    SELECT * FROM get_all_children_for_parent(p_user_id)
  LOOP
    -- Only count towards THIS registration's total if child belongs to it
    IF all_children.id = ANY(current_reg_children) THEN
      IF child_index = 0 THEN
        reg_total := reg_total + base_price;
      ELSE
        reg_total := reg_total + (base_price - sibling_discount);
      END IF;
    END IF;
    child_index := child_index + 1;
  END LOOP;

  -- Update the registration
  IF p_program_type = 'workshop' THEN
    UPDATE workshop_registrations
    SET total_amount_cents = reg_total, version = version + 1
    WHERE id = p_registration_id;
  ELSE
    UPDATE camp_registrations
    SET total_amount_cents = reg_total, version = version + 1
    WHERE id = p_registration_id;
  END IF;

  RETURN reg_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
