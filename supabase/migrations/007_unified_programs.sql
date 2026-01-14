-- Migration 007: Unified Programs Schema
-- Creates a flexible, reusable schema for any program type (workshops, camps, after school, jam nights, etc.)
-- Run alongside existing tables first, then migrate data, then deprecate old tables

-- ============================================
-- 1. PROGRAMS TABLE - Generic program definitions
-- ============================================
CREATE TABLE IF NOT EXISTS programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identity
  slug TEXT UNIQUE NOT NULL,              -- 'workshops-spring-2026', 'summer-camp-2026'
  program_type TEXT NOT NULL,             -- 'workshop', 'camp', 'after_school', 'jam_night'
  name TEXT NOT NULL,                     -- 'Winter/Spring 2026 Workshops'
  description TEXT,

  -- Scheduling
  start_date DATE,
  end_date DATE,
  schedule_json JSONB,                    -- Flexible: [{date: '2026-02-20', time: '4:00 PM', title: 'Workshop 1'}]

  -- Location
  location TEXT,
  address TEXT,

  -- Pricing
  base_price_cents INTEGER NOT NULL DEFAULT 0,
  sibling_discount_cents INTEGER DEFAULT 1000,
  max_sibling_discount_cents INTEGER DEFAULT 3000,

  -- Capacity
  capacity INTEGER,
  waitlist_enabled BOOLEAN DEFAULT true,

  -- Registration window
  registration_opens_at TIMESTAMPTZ,
  registration_closes_at TIMESTAMPTZ,

  -- What's required for this program (drives form fields)
  requires_emergency_contact BOOLEAN DEFAULT true,
  requires_authorized_pickups BOOLEAN DEFAULT false,
  max_authorized_pickups INTEGER DEFAULT 0,
  requires_medical_info BOOLEAN DEFAULT false,
  requires_second_parent BOOLEAN DEFAULT false,
  requires_behavior_agreement BOOLEAN DEFAULT false,
  requires_tshirt_size BOOLEAN DEFAULT false,
  requires_grade BOOLEAN DEFAULT false,

  -- What's included (for emails/display)
  includes_json JSONB,                    -- ['Lunch provided', 'T-shirt included', 'Performance']

  -- Display settings
  accent_color TEXT DEFAULT 'forest',     -- 'forest', 'terracotta', 'sage', 'lavender'
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_programs_type ON programs(program_type);
CREATE INDEX IF NOT EXISTS idx_programs_active ON programs(is_active);
CREATE INDEX IF NOT EXISTS idx_programs_dates ON programs(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_programs_slug ON programs(slug);

-- ============================================
-- 2. PROGRAM_SESSIONS TABLE - For programs with multiple dates (workshop-style)
-- ============================================
CREATE TABLE IF NOT EXISTS program_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,

  session_date DATE NOT NULL,
  start_time TEXT,                        -- '4:00 PM'
  end_time TEXT,                          -- '7:30 PM'
  title TEXT,                             -- 'Spring Workshop 1'
  capacity INTEGER,                       -- Override program capacity per session if needed

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_sessions_program ON program_sessions(program_id);
CREATE INDEX IF NOT EXISTS idx_sessions_date ON program_sessions(session_date);

-- ============================================
-- 3. UNIFIED REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Links
  program_id UUID NOT NULL REFERENCES programs(id),
  user_id UUID REFERENCES auth.users(id),

  -- Legacy tracking (for migration)
  legacy_registration_id UUID,
  legacy_type TEXT,                       -- 'workshop', 'camp'

  -- Status tracking
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'confirmed', 'waitlist', 'cancelled'
  waitlist_position INTEGER,

  -- Parent/Guardian 1 (primary)
  parent_name TEXT NOT NULL,              -- Full name (backward compat)
  parent_first_name TEXT,
  parent_last_name TEXT,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,
  parent_relationship TEXT,

  -- Parent/Guardian 2 (optional, program-dependent)
  parent2_first_name TEXT,
  parent2_last_name TEXT,
  parent2_phone TEXT,
  parent2_email TEXT,
  parent2_relationship TEXT,

  -- Emergency Contact
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relationship TEXT,

  -- Payment
  payment_status TEXT DEFAULT 'unpaid',   -- 'unpaid', 'paid', 'partial', 'waived'
  payment_method TEXT,
  tuition_assistance BOOLEAN DEFAULT false,
  assistance_notes TEXT,
  total_amount_cents INTEGER,
  amount_paid_cents INTEGER DEFAULT 0,
  payment_date TIMESTAMPTZ,
  payment_notes TEXT,

  -- Agreements (timestamps show when accepted)
  terms_accepted BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,
  liability_waiver_accepted BOOLEAN DEFAULT false,
  liability_waiver_accepted_at TIMESTAMPTZ,
  behavior_agreement_accepted BOOLEAN DEFAULT false,
  behavior_agreement_accepted_at TIMESTAMPTZ,
  media_consent_internal BOOLEAN DEFAULT false,
  media_consent_marketing BOOLEAN DEFAULT false,
  media_consent_accepted_at TIMESTAMPTZ,

  -- Optional survey/intake
  how_heard TEXT,
  excited_about TEXT,
  message TEXT,

  -- Admin
  admin_notes TEXT,
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  email_unsubscribed BOOLEAN DEFAULT false,

  -- Optimistic locking
  version INTEGER NOT NULL DEFAULT 1,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_registrations_program ON registrations(program_id);
CREATE INDEX IF NOT EXISTS idx_registrations_user ON registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(parent_email);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_created ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_legacy ON registrations(legacy_registration_id, legacy_type);

-- ============================================
-- 4. REGISTRATION_SESSIONS TABLE - Links registrations to specific sessions
-- ============================================
CREATE TABLE IF NOT EXISTS registration_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES program_sessions(id) ON DELETE CASCADE,

  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(registration_id, session_id)
);

CREATE INDEX IF NOT EXISTS idx_regsess_reg ON registration_sessions(registration_id);
CREATE INDEX IF NOT EXISTS idx_regsess_sess ON registration_sessions(session_id);

-- ============================================
-- 5. REGISTRATION_CHILDREN TABLE - Unified children
-- ============================================
CREATE TABLE IF NOT EXISTS registration_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  account_child_id UUID REFERENCES account_children(id),

  -- Basic info (always required)
  child_name TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  child_age INTEGER NOT NULL,

  -- Optional fields (program-dependent)
  child_grade TEXT,
  child_school TEXT,
  tshirt_size TEXT,

  -- Medical info (program-dependent)
  allergies TEXT,
  dietary_restrictions TEXT,
  medical_conditions TEXT,
  special_needs TEXT,
  notes TEXT,

  -- Pricing
  discount_cents INTEGER DEFAULT 0,

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regchild_reg ON registration_children(registration_id);
CREATE INDEX IF NOT EXISTS idx_regchild_account ON registration_children(account_child_id);

-- ============================================
-- 6. REGISTRATION_PICKUPS TABLE - Unified authorized pickups
-- ============================================
CREATE TABLE IF NOT EXISTS registration_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,

  name TEXT NOT NULL,
  phone TEXT,
  relationship TEXT,

  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_regpickup_reg ON registration_pickups(registration_id);

-- ============================================
-- 7. HELPER FUNCTIONS
-- ============================================

-- Check if current user owns a registration
CREATE OR REPLACE FUNCTION is_unified_registration_owner(reg_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN reg_user_id IS NOT NULL AND reg_user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get spots remaining for a program
CREATE OR REPLACE FUNCTION get_program_spots_remaining(p_program_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_capacity INTEGER;
  v_enrolled INTEGER;
BEGIN
  SELECT capacity INTO v_capacity FROM programs WHERE id = p_program_id;

  IF v_capacity IS NULL THEN
    RETURN NULL; -- No capacity limit
  END IF;

  SELECT COUNT(DISTINCT rc.id) INTO v_enrolled
  FROM registrations r
  JOIN registration_children rc ON rc.registration_id = r.id
  WHERE r.program_id = p_program_id
    AND r.status IN ('pending', 'confirmed');

  RETURN v_capacity - COALESCE(v_enrolled, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get spots remaining for a specific session
CREATE OR REPLACE FUNCTION get_session_spots_remaining(p_session_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_capacity INTEGER;
  v_enrolled INTEGER;
BEGIN
  SELECT COALESCE(ps.capacity, p.capacity) INTO v_capacity
  FROM program_sessions ps
  JOIN programs p ON p.id = ps.program_id
  WHERE ps.id = p_session_id;

  IF v_capacity IS NULL THEN
    RETURN NULL; -- No capacity limit
  END IF;

  SELECT COUNT(DISTINCT rc.id) INTO v_enrolled
  FROM registration_sessions rs
  JOIN registrations r ON r.id = rs.registration_id
  JOIN registration_children rc ON rc.registration_id = r.id
  WHERE rs.session_id = p_session_id
    AND r.status IN ('pending', 'confirmed');

  RETURN v_capacity - COALESCE(v_enrolled, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Calculate registration total with sibling discounts
CREATE OR REPLACE FUNCTION calculate_unified_registration_total(
  p_registration_id UUID
)
RETURNS INTEGER AS $$
DECLARE
  v_program programs%ROWTYPE;
  v_child_count INTEGER;
  v_session_count INTEGER;
  v_total INTEGER;
  v_discount_per_sibling INTEGER;
  v_max_discount INTEGER;
BEGIN
  -- Get program info
  SELECT p.* INTO v_program
  FROM programs p
  JOIN registrations r ON r.program_id = p.id
  WHERE r.id = p_registration_id;

  -- Count children
  SELECT COUNT(*) INTO v_child_count
  FROM registration_children
  WHERE registration_id = p_registration_id;

  -- Count sessions (if workshop-style, multiply by sessions; otherwise just use base price)
  SELECT COUNT(*) INTO v_session_count
  FROM registration_sessions
  WHERE registration_id = p_registration_id;

  IF v_session_count = 0 THEN
    v_session_count := 1; -- Non-session programs (like camp)
  END IF;

  -- Calculate base total
  v_total := v_child_count * v_session_count * v_program.base_price_cents;

  -- Apply sibling discounts
  v_discount_per_sibling := COALESCE(v_program.sibling_discount_cents, 1000);
  v_max_discount := COALESCE(v_program.max_sibling_discount_cents, 3000);

  IF v_child_count > 1 THEN
    -- Discount for each additional child (not the first)
    FOR i IN 2..v_child_count LOOP
      v_total := v_total - LEAST(v_discount_per_sibling * v_session_count, v_max_discount);
    END LOOP;
  END IF;

  RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS
ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE program_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE registration_pickups ENABLE ROW LEVEL SECURITY;

-- Programs: Public can read active programs
CREATE POLICY "public_read_active_programs" ON programs
  FOR SELECT USING (is_active = true);

CREATE POLICY "service_role_all_programs" ON programs
  FOR ALL USING (auth.role() = 'service_role');

-- Program Sessions: Public can read
CREATE POLICY "public_read_sessions" ON program_sessions
  FOR SELECT USING (true);

CREATE POLICY "service_role_all_sessions" ON program_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Registrations: Public can insert, owners can read/update their own
CREATE POLICY "public_insert_registrations" ON registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owners_read_registrations" ON registrations
  FOR SELECT USING (is_unified_registration_owner(user_id));

CREATE POLICY "owners_update_registrations" ON registrations
  FOR UPDATE USING (is_unified_registration_owner(user_id));

CREATE POLICY "service_role_all_registrations" ON registrations
  FOR ALL USING (auth.role() = 'service_role');

-- Registration Sessions: Same as registrations
CREATE POLICY "public_insert_reg_sessions" ON registration_sessions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owners_read_reg_sessions" ON registration_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = registration_sessions.registration_id
        AND is_unified_registration_owner(r.user_id)
    )
  );

CREATE POLICY "service_role_all_reg_sessions" ON registration_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- Registration Children: Same pattern
CREATE POLICY "public_insert_reg_children" ON registration_children
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owners_read_reg_children" ON registration_children
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = registration_children.registration_id
        AND is_unified_registration_owner(r.user_id)
    )
  );

CREATE POLICY "owners_update_reg_children" ON registration_children
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = registration_children.registration_id
        AND is_unified_registration_owner(r.user_id)
    )
  );

CREATE POLICY "service_role_all_reg_children" ON registration_children
  FOR ALL USING (auth.role() = 'service_role');

-- Registration Pickups: Same pattern
CREATE POLICY "public_insert_reg_pickups" ON registration_pickups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "owners_read_reg_pickups" ON registration_pickups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = registration_pickups.registration_id
        AND is_unified_registration_owner(r.user_id)
    )
  );

CREATE POLICY "owners_manage_reg_pickups" ON registration_pickups
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM registrations r
      WHERE r.id = registration_pickups.registration_id
        AND is_unified_registration_owner(r.user_id)
    )
  );

CREATE POLICY "service_role_all_reg_pickups" ON registration_pickups
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 9. TRIGGERS FOR UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER programs_updated_at
  BEFORE UPDATE ON programs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER registrations_updated_at
  BEFORE UPDATE ON registrations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
