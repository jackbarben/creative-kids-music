-- Attendance tracking for workshops
-- Migration: 011_attendance.sql

-- Workshop attendance records
CREATE TABLE IF NOT EXISTS workshop_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workshop_id UUID NOT NULL REFERENCES workshops(id) ON DELETE CASCADE,
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES workshop_children(id) ON DELETE CASCADE,

  -- Attendance status
  status TEXT NOT NULL DEFAULT 'expected' CHECK (status IN ('expected', 'checked_in', 'no_show', 'cancelled')),
  checked_in_at TIMESTAMPTZ,
  checked_in_by TEXT, -- Admin name or 'system'

  -- Notes
  notes TEXT,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique attendance per child per workshop
  UNIQUE(workshop_id, child_id)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_attendance_workshop ON workshop_attendance(workshop_id);
CREATE INDEX IF NOT EXISTS idx_attendance_registration ON workshop_attendance(registration_id);
CREATE INDEX IF NOT EXISTS idx_attendance_child ON workshop_attendance(child_id);
CREATE INDEX IF NOT EXISTS idx_attendance_status ON workshop_attendance(status);

-- Function to generate attendance records for a workshop
-- Call this when workshop date arrives or when admin opens attendance page
CREATE OR REPLACE FUNCTION generate_workshop_attendance(p_workshop_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER := 0;
BEGIN
  -- Insert attendance records for all confirmed/pending children
  INSERT INTO workshop_attendance (workshop_id, registration_id, child_id, status)
  SELECT
    p_workshop_id,
    wr.id,
    wc.id,
    'expected'
  FROM workshop_registrations wr
  JOIN workshop_children wc ON wc.registration_id = wr.id
  WHERE wr.workshop_ids @> ARRAY[p_workshop_id]
    AND wr.status IN ('confirmed', 'pending')
  ON CONFLICT (workshop_id, child_id) DO NOTHING;

  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check in a child
CREATE OR REPLACE FUNCTION check_in_child(
  p_workshop_id UUID,
  p_child_id UUID,
  p_checked_in_by TEXT DEFAULT 'admin'
)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE workshop_attendance
  SET
    status = 'checked_in',
    checked_in_at = NOW(),
    checked_in_by = p_checked_in_by,
    updated_at = NOW()
  WHERE workshop_id = p_workshop_id
    AND child_id = p_child_id
    AND status != 'checked_in';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to undo check-in
CREATE OR REPLACE FUNCTION undo_check_in(p_workshop_id UUID, p_child_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE workshop_attendance
  SET
    status = 'expected',
    checked_in_at = NULL,
    checked_in_by = NULL,
    updated_at = NOW()
  WHERE workshop_id = p_workshop_id
    AND child_id = p_child_id
    AND status = 'checked_in';

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark no-show
CREATE OR REPLACE FUNCTION mark_no_show(p_workshop_id UUID, p_child_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  UPDATE workshop_attendance
  SET
    status = 'no_show',
    updated_at = NOW()
  WHERE workshop_id = p_workshop_id
    AND child_id = p_child_id
    AND status IN ('expected', 'checked_in');

  RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get attendance summary for a workshop
CREATE OR REPLACE FUNCTION get_workshop_attendance_summary(p_workshop_id UUID)
RETURNS TABLE (
  total_expected INTEGER,
  checked_in INTEGER,
  no_show INTEGER,
  cancelled INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::INTEGER AS total_expected,
    COUNT(*) FILTER (WHERE status = 'checked_in')::INTEGER AS checked_in,
    COUNT(*) FILTER (WHERE status = 'no_show')::INTEGER AS no_show,
    COUNT(*) FILTER (WHERE status = 'cancelled')::INTEGER AS cancelled
  FROM workshop_attendance
  WHERE workshop_id = p_workshop_id;
END;
$$ LANGUAGE plpgsql STABLE;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_attendance_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS attendance_updated_at ON workshop_attendance;
CREATE TRIGGER attendance_updated_at
  BEFORE UPDATE ON workshop_attendance
  FOR EACH ROW
  EXECUTE FUNCTION update_attendance_timestamp();

-- RLS policies
ALTER TABLE workshop_attendance ENABLE ROW LEVEL SECURITY;

-- Allow admins full access
CREATE POLICY "Admins can manage attendance"
  ON workshop_attendance
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

COMMENT ON TABLE workshop_attendance IS 'Tracks child attendance at workshops';
COMMENT ON FUNCTION generate_workshop_attendance IS 'Creates attendance records for all registered children';
COMMENT ON FUNCTION check_in_child IS 'Marks a child as checked in';
COMMENT ON FUNCTION undo_check_in IS 'Reverts a check-in to expected status';
COMMENT ON FUNCTION mark_no_show IS 'Marks a child as no-show';
