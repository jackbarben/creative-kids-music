-- Migration: 004_registration_expansion.sql
-- Purpose: Add account-level settings, children, and expanded registration fields
-- Date: December 2024

-- ============================================
-- PART 1: NEW TABLES
-- ============================================

-- Account-level children (reusable across registrations)
CREATE TABLE IF NOT EXISTS account_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  school TEXT,
  allergies TEXT,
  dietary_restrictions TEXT,
  medical_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_account_children_user ON account_children(user_id);

-- Account-level settings (parent info, emergency contact, defaults)
CREATE TABLE IF NOT EXISTS account_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Primary parent/guardian
  parent_first_name TEXT,
  parent_last_name TEXT,
  parent_relationship TEXT,
  parent_phone TEXT,

  -- Second parent/guardian (optional)
  parent2_first_name TEXT,
  parent2_last_name TEXT,
  parent2_relationship TEXT,
  parent2_phone TEXT,
  parent2_email TEXT,

  -- Emergency contact
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relationship TEXT,

  -- Default authorized pickups (JSON array)
  default_pickups JSONB DEFAULT '[]',

  -- Default media consent level
  default_media_consent TEXT DEFAULT 'internal_only',

  -- Communication preferences
  email_reminders BOOLEAN DEFAULT TRUE,
  email_updates BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workshop authorized pickups
CREATE TABLE IF NOT EXISTS workshop_authorized_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_workshop_pickups_reg ON workshop_authorized_pickups(registration_id);

-- ============================================
-- PART 2: ALTER EXISTING TABLES
-- ============================================

-- Workshop registrations - add new fields
ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS parent_first_name TEXT,
  ADD COLUMN IF NOT EXISTS parent_last_name TEXT,
  ADD COLUMN IF NOT EXISTS parent_relationship TEXT,
  ADD COLUMN IF NOT EXISTS emergency_name TEXT,
  ADD COLUMN IF NOT EXISTS emergency_phone TEXT,
  ADD COLUMN IF NOT EXISTS emergency_relationship TEXT,
  ADD COLUMN IF NOT EXISTS liability_waiver_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS liability_waiver_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS media_consent_level TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_consent_accepted_at TIMESTAMPTZ;

-- Workshop children - add new fields
ALTER TABLE workshop_children
  ADD COLUMN IF NOT EXISTS account_child_id UUID REFERENCES account_children(id),
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS allergies TEXT,
  ADD COLUMN IF NOT EXISTS dietary_restrictions TEXT,
  ADD COLUMN IF NOT EXISTS medical_conditions TEXT;

-- Camp registrations - add new fields
ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS parent_first_name TEXT,
  ADD COLUMN IF NOT EXISTS parent_last_name TEXT,
  ADD COLUMN IF NOT EXISTS parent_relationship TEXT,
  ADD COLUMN IF NOT EXISTS parent2_first_name TEXT,
  ADD COLUMN IF NOT EXISTS parent2_last_name TEXT,
  ADD COLUMN IF NOT EXISTS parent2_relationship TEXT,
  ADD COLUMN IF NOT EXISTS parent2_phone TEXT,
  ADD COLUMN IF NOT EXISTS parent2_email TEXT,
  ADD COLUMN IF NOT EXISTS liability_waiver_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS liability_waiver_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS media_consent_level TEXT DEFAULT 'none',
  ADD COLUMN IF NOT EXISTS media_consent_accepted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS behavior_agreement_accepted BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS behavior_agreement_accepted_at TIMESTAMPTZ;

-- Camp children - add new fields
ALTER TABLE camp_children
  ADD COLUMN IF NOT EXISTS account_child_id UUID REFERENCES account_children(id),
  ADD COLUMN IF NOT EXISTS first_name TEXT,
  ADD COLUMN IF NOT EXISTS last_name TEXT,
  ADD COLUMN IF NOT EXISTS tshirt_size TEXT;

-- ============================================
-- PART 3: RLS POLICIES
-- ============================================

-- account_children RLS
ALTER TABLE account_children ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own children" ON account_children;
CREATE POLICY "Users can view own children" ON account_children
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own children" ON account_children;
CREATE POLICY "Users can insert own children" ON account_children
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own children" ON account_children;
CREATE POLICY "Users can update own children" ON account_children
  FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own children" ON account_children;
CREATE POLICY "Users can delete own children" ON account_children
  FOR DELETE USING (auth.uid() = user_id);

-- Admin access to account_children
DROP POLICY IF EXISTS "Admins can view all children" ON account_children;
CREATE POLICY "Admins can view all children" ON account_children
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- account_settings RLS
ALTER TABLE account_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own settings" ON account_settings;
CREATE POLICY "Users can view own settings" ON account_settings
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own settings" ON account_settings;
CREATE POLICY "Users can insert own settings" ON account_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own settings" ON account_settings;
CREATE POLICY "Users can update own settings" ON account_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- Admin access to account_settings
DROP POLICY IF EXISTS "Admins can view all settings" ON account_settings;
CREATE POLICY "Admins can view all settings" ON account_settings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- workshop_authorized_pickups RLS
ALTER TABLE workshop_authorized_pickups ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Users can view own workshop pickups" ON workshop_authorized_pickups
  FOR SELECT USING (
    registration_id IN (
      SELECT id FROM workshop_registrations WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can insert own workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Users can insert own workshop pickups" ON workshop_authorized_pickups
  FOR INSERT WITH CHECK (
    registration_id IN (
      SELECT id FROM workshop_registrations WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can update own workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Users can update own workshop pickups" ON workshop_authorized_pickups
  FOR UPDATE USING (
    registration_id IN (
      SELECT id FROM workshop_registrations WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users can delete own workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Users can delete own workshop pickups" ON workshop_authorized_pickups
  FOR DELETE USING (
    registration_id IN (
      SELECT id FROM workshop_registrations WHERE user_id = auth.uid()
    )
  );

-- Admin access to workshop_authorized_pickups
DROP POLICY IF EXISTS "Admins can view all workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Admins can view all workshop pickups" ON workshop_authorized_pickups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

DROP POLICY IF EXISTS "Admins can manage all workshop pickups" ON workshop_authorized_pickups;
CREATE POLICY "Admins can manage all workshop pickups" ON workshop_authorized_pickups
  FOR ALL USING (
    EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid())
  );

-- Service role bypass for all new tables
DROP POLICY IF EXISTS "Service role bypass account_children" ON account_children;
CREATE POLICY "Service role bypass account_children" ON account_children
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role bypass account_settings" ON account_settings;
CREATE POLICY "Service role bypass account_settings" ON account_settings
  FOR ALL USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role bypass workshop_pickups" ON workshop_authorized_pickups;
CREATE POLICY "Service role bypass workshop_pickups" ON workshop_authorized_pickups
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- PART 4: UPDATE TRIGGERS
-- ============================================

-- updated_at trigger for account_children
CREATE OR REPLACE FUNCTION update_account_children_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS account_children_updated_at ON account_children;
CREATE TRIGGER account_children_updated_at
  BEFORE UPDATE ON account_children
  FOR EACH ROW EXECUTE FUNCTION update_account_children_updated_at();

-- updated_at trigger for account_settings
CREATE OR REPLACE FUNCTION update_account_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS account_settings_updated_at ON account_settings;
CREATE TRIGGER account_settings_updated_at
  BEFORE UPDATE ON account_settings
  FOR EACH ROW EXECUTE FUNCTION update_account_settings_updated_at();
