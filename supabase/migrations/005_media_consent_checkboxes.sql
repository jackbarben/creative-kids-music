-- Migration: Add separate media consent checkboxes
-- Two independent permissions: internal documentation and marketing/public

-- Add new columns to workshop_registrations
ALTER TABLE workshop_registrations
  ADD COLUMN IF NOT EXISTS media_consent_internal BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS media_consent_marketing BOOLEAN DEFAULT FALSE;

-- Add new columns to camp_registrations
ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS media_consent_internal BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS media_consent_marketing BOOLEAN DEFAULT FALSE;

-- Add new columns to account_settings for defaults
ALTER TABLE account_settings
  ADD COLUMN IF NOT EXISTS default_media_consent_internal BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS default_media_consent_marketing BOOLEAN DEFAULT FALSE;

-- Migrate existing data from media_consent_level to new columns
-- 'internal_only' -> internal=true, marketing=false
-- 'external_allowed' -> internal=true, marketing=true
-- 'none' -> internal=false, marketing=false

UPDATE workshop_registrations SET
  media_consent_internal = CASE
    WHEN media_consent_level IN ('internal_only', 'external_allowed') THEN TRUE
    ELSE FALSE
  END,
  media_consent_marketing = CASE
    WHEN media_consent_level = 'external_allowed' THEN TRUE
    ELSE FALSE
  END
WHERE media_consent_level IS NOT NULL;

UPDATE camp_registrations SET
  media_consent_internal = CASE
    WHEN media_consent_level IN ('internal_only', 'external_allowed') THEN TRUE
    ELSE FALSE
  END,
  media_consent_marketing = CASE
    WHEN media_consent_level = 'external_allowed' THEN TRUE
    ELSE FALSE
  END
WHERE media_consent_level IS NOT NULL;

UPDATE account_settings SET
  default_media_consent_internal = CASE
    WHEN default_media_consent IN ('internal_only', 'external_allowed') THEN TRUE
    ELSE FALSE
  END,
  default_media_consent_marketing = CASE
    WHEN default_media_consent = 'external_allowed' THEN TRUE
    ELSE FALSE
  END
WHERE default_media_consent IS NOT NULL;
