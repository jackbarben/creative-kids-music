-- Migration 009: Family Infrastructure
-- Families are the core unit - all data belongs to families, not individual users
-- Multiple users can be members of the same family

-- ============================================
-- 1. Create families table
-- ============================================

CREATE TABLE IF NOT EXISTS families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. Create family_members table
-- ============================================

CREATE TABLE IF NOT EXISTS family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null until they create password
  email TEXT NOT NULL,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  joined_at TIMESTAMPTZ, -- set when they create their password
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(family_id, email)
);

CREATE INDEX IF NOT EXISTS idx_family_members_family ON family_members(family_id);
CREATE INDEX IF NOT EXISTS idx_family_members_user ON family_members(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_family_members_email ON family_members(email);

-- ============================================
-- 3. Add family_id to registration tables
-- ============================================

ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);

ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);

CREATE INDEX IF NOT EXISTS idx_workshop_reg_family ON workshop_registrations(family_id) WHERE family_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_camp_reg_family ON camp_registrations(family_id) WHERE family_id IS NOT NULL;

-- ============================================
-- 4. Add family_id to account tables
-- ============================================

ALTER TABLE account_children
  ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);

ALTER TABLE account_settings
  ADD COLUMN IF NOT EXISTS family_id UUID REFERENCES families(id);

CREATE INDEX IF NOT EXISTS idx_account_children_family ON account_children(family_id) WHERE family_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_account_settings_family ON account_settings(family_id) WHERE family_id IS NOT NULL;

-- ============================================
-- 5. Migrate existing users to families
-- ============================================

-- Create a family for each existing user and link them
DO $$
DECLARE
  r RECORD;
  new_family_id UUID;
BEGIN
  -- For each user in auth.users
  FOR r IN
    SELECT id, email
    FROM auth.users
    WHERE id NOT IN (SELECT user_id FROM family_members WHERE user_id IS NOT NULL)
  LOOP
    -- Create a new family
    INSERT INTO families (id) VALUES (gen_random_uuid()) RETURNING id INTO new_family_id;

    -- Add user as family member
    INSERT INTO family_members (family_id, user_id, email, joined_at)
    VALUES (new_family_id, r.id, r.email, NOW());

    -- Update their registrations to point to the family
    UPDATE workshop_registrations
    SET family_id = new_family_id
    WHERE user_id = r.id AND family_id IS NULL;

    UPDATE camp_registrations
    SET family_id = new_family_id
    WHERE user_id = r.id AND family_id IS NULL;

    -- Update account_children
    UPDATE account_children
    SET family_id = new_family_id
    WHERE user_id = r.id AND family_id IS NULL;

    -- Update account_settings
    UPDATE account_settings
    SET family_id = new_family_id
    WHERE user_id = r.id AND family_id IS NULL;
  END LOOP;
END $$;

-- ============================================
-- 6. Helper function to get family_id for a user
-- ============================================

CREATE OR REPLACE FUNCTION get_family_id_for_user(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  v_family_id UUID;
BEGIN
  SELECT family_id INTO v_family_id
  FROM family_members
  WHERE user_id = p_user_id
  LIMIT 1;

  RETURN v_family_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. Helper function to check if user is family member
-- ============================================

CREATE OR REPLACE FUNCTION is_family_member(p_family_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM family_members
    WHERE family_id = p_family_id
    AND user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. RLS Policies for families
-- ============================================

ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE family_members ENABLE ROW LEVEL SECURITY;

-- Families: members can read their own family
CREATE POLICY families_select_own ON families
  FOR SELECT USING (is_family_member(id));

-- Families: service role can do anything
CREATE POLICY families_service_all ON families
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Family members: can read members of their own family
CREATE POLICY family_members_select_own ON family_members
  FOR SELECT USING (is_family_member(family_id));

-- Family members: can insert to their own family (for inviting)
CREATE POLICY family_members_insert_own ON family_members
  FOR INSERT WITH CHECK (is_family_member(family_id));

-- Family members: service role can do anything
CREATE POLICY family_members_service_all ON family_members
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- 9. Update existing RLS policies to use family_id
-- ============================================

-- Workshop registrations: family members can read their family's registrations
DROP POLICY IF EXISTS parents_read_own_workshop_registrations ON workshop_registrations;
CREATE POLICY family_read_own_workshop_registrations ON workshop_registrations
  FOR SELECT USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND is_registration_owner(user_id)) -- backward compat
  );

DROP POLICY IF EXISTS parents_update_own_workshop_registrations ON workshop_registrations;
CREATE POLICY family_update_own_workshop_registrations ON workshop_registrations
  FOR UPDATE USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND is_registration_owner(user_id))
  );

-- Camp registrations: family members can read their family's registrations
DROP POLICY IF EXISTS parents_read_own_camp_registrations ON camp_registrations;
CREATE POLICY family_read_own_camp_registrations ON camp_registrations
  FOR SELECT USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND is_registration_owner(user_id))
  );

DROP POLICY IF EXISTS parents_update_own_camp_registrations ON camp_registrations;
CREATE POLICY family_update_own_camp_registrations ON camp_registrations
  FOR UPDATE USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND is_registration_owner(user_id))
  );

-- Account children: family members can manage their family's children
DROP POLICY IF EXISTS account_children_select ON account_children;
CREATE POLICY account_children_family_select ON account_children
  FOR SELECT USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS account_children_insert ON account_children;
CREATE POLICY account_children_family_insert ON account_children
  FOR INSERT WITH CHECK (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS account_children_update ON account_children;
CREATE POLICY account_children_family_update ON account_children
  FOR UPDATE USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS account_children_delete ON account_children;
CREATE POLICY account_children_family_delete ON account_children
  FOR DELETE USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

-- Account settings: family members can manage their family's settings
DROP POLICY IF EXISTS account_settings_select ON account_settings;
CREATE POLICY account_settings_family_select ON account_settings
  FOR SELECT USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS account_settings_insert ON account_settings;
CREATE POLICY account_settings_family_insert ON account_settings
  FOR INSERT WITH CHECK (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

DROP POLICY IF EXISTS account_settings_update ON account_settings;
CREATE POLICY account_settings_family_update ON account_settings
  FOR UPDATE USING (
    is_family_member(family_id) OR
    (family_id IS NULL AND user_id = auth.uid())
  );

-- ============================================
-- 10. Function to create family for new user
-- ============================================

CREATE OR REPLACE FUNCTION create_family_for_user(
  p_user_id UUID,
  p_email TEXT
)
RETURNS UUID AS $$
DECLARE
  v_family_id UUID;
BEGIN
  -- Create new family
  INSERT INTO families DEFAULT VALUES RETURNING id INTO v_family_id;

  -- Add user as member
  INSERT INTO family_members (family_id, user_id, email, joined_at)
  VALUES (v_family_id, p_user_id, p_email, NOW());

  RETURN v_family_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 11. Function to invite family member
-- ============================================

CREATE OR REPLACE FUNCTION invite_family_member(
  p_family_id UUID,
  p_email TEXT
)
RETURNS UUID AS $$
DECLARE
  v_member_id UUID;
  v_existing_family UUID;
BEGIN
  -- Check if email already belongs to another family
  SELECT family_id INTO v_existing_family
  FROM family_members
  WHERE email = p_email
  LIMIT 1;

  IF v_existing_family IS NOT NULL AND v_existing_family != p_family_id THEN
    RAISE EXCEPTION 'Email already belongs to another family';
  END IF;

  -- Check if already a member of this family
  IF EXISTS (SELECT 1 FROM family_members WHERE family_id = p_family_id AND email = p_email) THEN
    RAISE EXCEPTION 'Email is already a member of this family';
  END IF;

  -- Create the invitation (user_id null until they set password)
  INSERT INTO family_members (family_id, email)
  VALUES (p_family_id, p_email)
  RETURNING id INTO v_member_id;

  RETURN v_member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 12. Function to join family (when invited user sets password)
-- ============================================

CREATE OR REPLACE FUNCTION join_family(
  p_user_id UUID,
  p_email TEXT
)
RETURNS UUID AS $$
DECLARE
  v_family_id UUID;
BEGIN
  -- Find pending invitation by email
  UPDATE family_members
  SET user_id = p_user_id, joined_at = NOW()
  WHERE email = p_email AND user_id IS NULL
  RETURNING family_id INTO v_family_id;

  RETURN v_family_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- Done
-- ============================================
