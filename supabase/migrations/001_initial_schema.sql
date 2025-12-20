-- Creative Kids Music - Initial Database Schema
-- Run this in Supabase Dashboard > SQL Editor

-- ============================================
-- WORKSHOPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workshops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  date DATE NOT NULL,
  start_time TIME DEFAULT '15:30',
  end_time TIME DEFAULT '19:30',
  location TEXT DEFAULT 'St. Luke''s/San Lucas Episcopal Church',
  address TEXT DEFAULT '4106 NE St. Johns Rd, Vancouver, WA 98661',
  description TEXT,
  capacity INT DEFAULT 12,
  price_cents INT DEFAULT 7500,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- WORKSHOP REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'waitlist', 'cancelled')),
  waitlist_position INT,

  -- Parent/Guardian
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT,

  -- Workshop Selection (array of workshop IDs)
  workshop_ids UUID[] NOT NULL,

  -- Payment
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial', 'waived')),
  payment_method TEXT,
  tuition_assistance BOOLEAN DEFAULT false,
  assistance_notes TEXT,
  total_amount_cents INT,
  amount_paid_cents INT DEFAULT 0,
  payment_date TIMESTAMPTZ,
  payment_notes TEXT,

  -- Terms & Consent
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,

  -- Communication
  email_unsubscribed BOOLEAN DEFAULT false,

  -- Other
  how_heard TEXT,
  excited_about TEXT,
  message TEXT,
  admin_notes TEXT
);

-- ============================================
-- WORKSHOP CHILDREN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS workshop_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  child_age INT NOT NULL,
  child_school TEXT,
  discount_cents INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- CAMP REGISTRATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS camp_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),

  -- Parent/Guardian
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  parent_phone TEXT NOT NULL,

  -- Emergency Contact
  emergency_name TEXT NOT NULL,
  emergency_phone TEXT NOT NULL,
  emergency_relationship TEXT,

  -- Payment
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'partial', 'waived')),
  payment_method TEXT,
  tuition_assistance BOOLEAN DEFAULT false,
  assistance_notes TEXT,
  total_amount_cents INT,
  amount_paid_cents INT DEFAULT 0,
  payment_date TIMESTAMPTZ,
  payment_notes TEXT,

  -- Terms & Consent
  terms_accepted BOOLEAN NOT NULL DEFAULT false,
  terms_accepted_at TIMESTAMPTZ,

  -- Communication
  email_unsubscribed BOOLEAN DEFAULT false,

  -- Other
  how_heard TEXT,
  excited_about TEXT,
  message TEXT,
  admin_notes TEXT
);

-- ============================================
-- CAMP CHILDREN TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS camp_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES camp_registrations(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  child_age INT NOT NULL,
  child_grade TEXT,
  child_school TEXT,
  allergies TEXT,
  medical_conditions TEXT,
  special_needs TEXT,
  discount_cents INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- WAITLIST SIGNUPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS waitlist_signups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted')),

  -- Parent Info
  parent_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,

  -- Child Info
  child_name TEXT,
  child_grade TEXT,
  child_school TEXT,
  num_children INT DEFAULT 1,

  -- Other
  message TEXT,
  admin_notes TEXT
);

-- ============================================
-- EMAIL LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS email_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  recipient_email TEXT NOT NULL,
  email_type TEXT NOT NULL,
  subject TEXT,
  entity_type TEXT,
  entity_id UUID,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'failed', 'bounced')),
  provider_id TEXT
);

-- ============================================
-- ACTIVITY LOG TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES auth.users(id),
  user_email TEXT,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  details JSONB
);

-- ============================================
-- INDEXES
-- ============================================

-- Workshops
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);
CREATE INDEX IF NOT EXISTS idx_workshops_active ON workshops(is_active);

-- Workshop registrations
CREATE INDEX IF NOT EXISTS idx_workshop_reg_email ON workshop_registrations(parent_email);
CREATE INDEX IF NOT EXISTS idx_workshop_reg_status ON workshop_registrations(status);
CREATE INDEX IF NOT EXISTS idx_workshop_reg_created ON workshop_registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_workshop_children_reg ON workshop_children(registration_id);

-- Camp registrations
CREATE INDEX IF NOT EXISTS idx_camp_reg_email ON camp_registrations(parent_email);
CREATE INDEX IF NOT EXISTS idx_camp_reg_status ON camp_registrations(status);
CREATE INDEX IF NOT EXISTS idx_camp_children_reg ON camp_children(registration_id);

-- Waitlist
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist_signups(parent_email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist_signups(status);

-- Email log
CREATE INDEX IF NOT EXISTS idx_email_log_entity ON email_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_email_log_recipient ON email_log(recipient_email);

-- Activity log
CREATE INDEX IF NOT EXISTS idx_activity_log_user ON activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all tables
ALTER TABLE workshops ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE workshop_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE camp_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE waitlist_signups ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Workshops: Public can read active, authenticated can do everything
CREATE POLICY "Public can view active workshops" ON workshops
  FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated users have full access to workshops" ON workshops
  FOR ALL USING (auth.role() = 'authenticated');

-- Workshop registrations: Public can insert, authenticated can do everything
CREATE POLICY "Anyone can create workshop registrations" ON workshop_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to workshop registrations" ON workshop_registrations
  FOR ALL USING (auth.role() = 'authenticated');

-- Workshop children: Public can insert, authenticated can do everything
CREATE POLICY "Anyone can create workshop children" ON workshop_children
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to workshop children" ON workshop_children
  FOR ALL USING (auth.role() = 'authenticated');

-- Camp registrations: Public can insert, authenticated can do everything
CREATE POLICY "Anyone can create camp registrations" ON camp_registrations
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to camp registrations" ON camp_registrations
  FOR ALL USING (auth.role() = 'authenticated');

-- Camp children: Public can insert, authenticated can do everything
CREATE POLICY "Anyone can create camp children" ON camp_children
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to camp children" ON camp_children
  FOR ALL USING (auth.role() = 'authenticated');

-- Waitlist: Public can insert, authenticated can do everything
CREATE POLICY "Anyone can create waitlist signups" ON waitlist_signups
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users have full access to waitlist" ON waitlist_signups
  FOR ALL USING (auth.role() = 'authenticated');

-- Email log: Only authenticated users
CREATE POLICY "Authenticated users can manage email log" ON email_log
  FOR ALL USING (auth.role() = 'authenticated');

-- Activity log: Only authenticated users
CREATE POLICY "Authenticated users can manage activity log" ON activity_log
  FOR ALL USING (auth.role() = 'authenticated');

-- ============================================
-- SEED DATA: Initial Workshops
-- ============================================

INSERT INTO workshops (title, date, description) VALUES
  ('Spring Workshop 1', '2026-02-20', 'Our first Friday workshop of 2026! Explore improvisation, composition, and ensemble playing in this immersive 4-hour session.'),
  ('Spring Workshop 2', '2026-03-20', 'Continue your musical journey with new challenges and collaborative projects.'),
  ('Spring Workshop 3', '2026-05-01', 'The final workshop of the spring series. Showcase what you''ve learned and prepare for summer camp!')
ON CONFLICT DO NOTHING;

-- ============================================
-- HELPER FUNCTION: Get workshop spots remaining
-- ============================================

CREATE OR REPLACE FUNCTION get_workshop_spots_remaining(workshop_uuid UUID)
RETURNS INT AS $$
DECLARE
  total_capacity INT;
  children_registered INT;
BEGIN
  SELECT capacity INTO total_capacity FROM workshops WHERE id = workshop_uuid;

  SELECT COUNT(*) INTO children_registered
  FROM workshop_children wc
  JOIN workshop_registrations wr ON wc.registration_id = wr.id
  WHERE workshop_uuid = ANY(wr.workshop_ids)
    AND wr.status NOT IN ('cancelled', 'waitlist');

  RETURN total_capacity - COALESCE(children_registered, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
