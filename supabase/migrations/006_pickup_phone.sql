-- Migration: Add phone and relationship to authorized_pickups
-- Date: December 2024

-- Add phone and relationship columns to authorized_pickups table
ALTER TABLE authorized_pickups
  ADD COLUMN IF NOT EXISTS phone TEXT,
  ADD COLUMN IF NOT EXISTS relationship TEXT;

-- Add comment for documentation
COMMENT ON COLUMN authorized_pickups.phone IS 'Phone number for the authorized pickup person';
COMMENT ON COLUMN authorized_pickups.relationship IS 'Relationship to child (e.g., Grandmother, Neighbor)';
