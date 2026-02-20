-- Migration 010: Workshop Enhancements
-- Adds columns for waitlist support, status management, and program notes

-- ============================================
-- 1. Add new columns to workshops table
-- ============================================

ALTER TABLE workshops
  ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS registration_opens_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_closes_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'open',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS media_folder_url TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- Workshop status values: draft, open, closed, completed, archived

-- ============================================
-- 2. Add program notes fields (curriculum data)
-- ============================================

ALTER TABLE workshops
  ADD COLUMN IF NOT EXISTS performance_summary TEXT,
  ADD COLUMN IF NOT EXISTS session_summary TEXT,
  ADD COLUMN IF NOT EXISTS highlights TEXT,
  ADD COLUMN IF NOT EXISTS lessons_learned TEXT;

-- ============================================
-- 3. Migrate is_active to status
-- ============================================

UPDATE workshops
SET status = CASE
  WHEN is_active = false THEN 'closed'
  WHEN date < CURRENT_DATE THEN 'completed'
  ELSE 'open'
END
WHERE status IS NULL OR status = 'open';

-- ============================================
-- 4. Add waitlist_position to registrations
-- ============================================

ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS waitlist_position INTEGER,
  ADD COLUMN IF NOT EXISTS promoted_from_waitlist_at TIMESTAMPTZ;

-- ============================================
-- 5. Create function to get registration count
-- ============================================

CREATE OR REPLACE FUNCTION get_workshop_registration_count(p_workshop_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT wr.id) INTO v_count
  FROM workshop_registrations wr
  WHERE p_workshop_id = ANY(wr.workshop_ids)
    AND wr.status IN ('pending', 'confirmed');

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 6. Create function to get waitlist count
-- ============================================

CREATE OR REPLACE FUNCTION get_workshop_waitlist_count(p_workshop_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  SELECT COUNT(DISTINCT wr.id) INTO v_count
  FROM workshop_registrations wr
  WHERE p_workshop_id = ANY(wr.workshop_ids)
    AND wr.status = 'waitlist';

  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 7. Create function to check capacity
-- ============================================

CREATE OR REPLACE FUNCTION is_workshop_at_capacity(p_workshop_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  v_capacity INTEGER;
  v_count INTEGER;
BEGIN
  SELECT capacity INTO v_capacity
  FROM workshops
  WHERE id = p_workshop_id;

  SELECT get_workshop_registration_count(p_workshop_id) INTO v_count;

  RETURN v_count >= COALESCE(v_capacity, 999);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- 8. Create trigger to update updated_at
-- ============================================

CREATE OR REPLACE FUNCTION update_workshop_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS workshops_updated_at ON workshops;
CREATE TRIGGER workshops_updated_at
  BEFORE UPDATE ON workshops
  FOR EACH ROW
  EXECUTE FUNCTION update_workshop_updated_at();

-- ============================================
-- 9. Index for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_workshops_status ON workshops(status);
CREATE INDEX IF NOT EXISTS idx_workshops_date ON workshops(date);
CREATE INDEX IF NOT EXISTS idx_workshop_reg_waitlist ON workshop_registrations(status) WHERE status = 'waitlist';

-- ============================================
-- Done
-- ============================================
