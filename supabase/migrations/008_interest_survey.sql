-- Migration: Add survey columns to waitlist_signups
-- Purpose: Support interest survey questions for Music School page

ALTER TABLE waitlist_signups
ADD COLUMN IF NOT EXISTS consider_3days TEXT,
ADD COLUMN IF NOT EXISTS consider_3days_notes TEXT,
ADD COLUMN IF NOT EXISTS transportation_affects TEXT,
ADD COLUMN IF NOT EXISTS transportation_notes TEXT,
ADD COLUMN IF NOT EXISTS tuition_assistance_affects TEXT,
ADD COLUMN IF NOT EXISTS tuition_assistance_notes TEXT;
