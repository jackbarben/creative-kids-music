-- Migration: Archive Support
-- Add archive columns to workshop_registrations and camp_registrations
-- Add 'archived' to status constraints

-- ============================================
-- WORKSHOP REGISTRATIONS
-- ============================================

-- Add archive columns
ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS archive_reason TEXT;

-- Drop existing status constraint and add new one with 'archived'
ALTER TABLE workshop_registrations
  DROP CONSTRAINT IF EXISTS workshop_registrations_status_check;

ALTER TABLE workshop_registrations
  ADD CONSTRAINT workshop_registrations_status_check
  CHECK (status IN ('pending', 'confirmed', 'waitlist', 'cancelled', 'archived'));

-- Index for efficient archive queries
CREATE INDEX IF NOT EXISTS idx_workshop_registrations_archived
  ON workshop_registrations(archived_at)
  WHERE archived_at IS NOT NULL;

-- ============================================
-- CAMP REGISTRATIONS
-- ============================================

-- Add archive columns
ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS archived_by UUID REFERENCES auth.users(id),
  ADD COLUMN IF NOT EXISTS archive_reason TEXT;

-- Drop existing status constraint and add new one with 'archived'
ALTER TABLE camp_registrations
  DROP CONSTRAINT IF EXISTS camp_registrations_status_check;

ALTER TABLE camp_registrations
  ADD CONSTRAINT camp_registrations_status_check
  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'archived'));

-- Index for efficient archive queries
CREATE INDEX IF NOT EXISTS idx_camp_registrations_archived
  ON camp_registrations(archived_at)
  WHERE archived_at IS NOT NULL;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON COLUMN workshop_registrations.archived_at IS 'Timestamp when registration was archived';
COMMENT ON COLUMN workshop_registrations.archived_by IS 'User ID of admin who archived the registration';
COMMENT ON COLUMN workshop_registrations.archive_reason IS 'Optional reason for archiving';

COMMENT ON COLUMN camp_registrations.archived_at IS 'Timestamp when registration was archived';
COMMENT ON COLUMN camp_registrations.archived_by IS 'User ID of admin who archived the registration';
COMMENT ON COLUMN camp_registrations.archive_reason IS 'Optional reason for archiving';
