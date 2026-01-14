# Unified Programs System

## Overview

The unified programs system provides a flexible, reusable database schema for any program type. Instead of creating separate tables for each program (workshops, camps, etc.), all programs share a common structure.

**Status**: Schema deployed (Migration 007). Form/admin integration pending.

## Benefits

1. **Add new program = 1 database row** - No new tables or migrations needed
2. **Single form component** - One registration form handles all program types
3. **Consistent admin experience** - All registrations in one place
4. **Better reporting** - Query all programs and registrations together
5. **Reduced code duplication** - One set of actions, emails, and types

## Database Schema

### Tables

| Table | Purpose |
|-------|---------|
| `programs` | Program definitions (name, dates, price, requirements) |
| `program_sessions` | Individual dates for workshop-style programs |
| `registrations` | Unified registration records |
| `registration_sessions` | Links registrations to specific sessions |
| `registration_children` | Children for each registration |
| `registration_pickups` | Authorized pickups for each registration |

### Programs Table

The `programs` table is the heart of the system. Each row defines a program with:

```sql
-- Identity
slug              -- 'workshops-spring-2026', 'summer-camp-2026'
program_type      -- 'workshop', 'camp', 'after_school', 'jam_night'
name              -- Display name
description       -- Optional description

-- Scheduling
start_date        -- Program start
end_date          -- Program end (for multi-day programs)
schedule_json     -- Flexible schedule data

-- Pricing
base_price_cents           -- $75 = 7500
sibling_discount_cents     -- $10 = 1000
max_sibling_discount_cents -- $30 = 3000

-- Capacity
capacity           -- Max children (null = unlimited)
waitlist_enabled   -- Allow waitlist signups

-- Form field requirements (what to show on registration)
requires_emergency_contact    -- true/false
requires_authorized_pickups   -- true/false
max_authorized_pickups        -- 0, 2, 3, etc.
requires_medical_info         -- true/false
requires_second_parent        -- true/false
requires_behavior_agreement   -- true/false
requires_tshirt_size          -- true/false
requires_grade                -- true/false

-- Display
accent_color      -- 'forest', 'terracotta', 'sage', 'lavender'
is_active         -- Show on website
sort_order        -- Display order
```

### Program Sessions (Workshop-Style)

For programs with multiple dates (like workshops), use `program_sessions`:

```sql
INSERT INTO program_sessions (program_id, session_date, start_time, end_time, title) VALUES
  ('uuid', '2026-02-20', '4:00 PM', '7:30 PM', 'Spring Workshop 1'),
  ('uuid', '2026-03-20', '4:00 PM', '7:30 PM', 'Spring Workshop 2'),
  ('uuid', '2026-05-01', '4:00 PM', '7:30 PM', 'Spring Workshop 3');
```

For single-event programs (like camp), skip `program_sessions` entirely.

## Program Type Configuration

Each program type has a TypeScript configuration in `lib/program-config.ts`:

```typescript
import { getProgramTypeConfig } from '@/lib/program-config'

const config = getProgramTypeConfig('workshop')
// Returns: { fields, display, email }
```

### Available Program Types

| Type | Description | Key Features |
|------|-------------|--------------|
| `workshop` | Single-day workshops | Multiple sessions, 2 pickups, basic medical |
| `camp` | Multi-day camp | Second parent, behavior agreement, t-shirt, full medical |
| `after_school` | Recurring program | Grade, behavior agreement, 3 pickups |
| `jam_night` | Casual events | Minimal requirements, no pickups |
| `private_lesson` | One-on-one | Emergency contact only |

### Config Structure

```typescript
{
  fields: {
    showSecondParent: boolean,
    showGrade: boolean,
    showMedical: boolean,
    showTshirtSize: boolean,
    requireEmergencyContact: boolean,
    requireAuthorizedPickups: boolean,
    maxAuthorizedPickups: number,
    requireBehaviorAgreement: boolean,
  },
  display: {
    accentColor: 'forest' | 'terracotta' | 'sage' | 'lavender',
    headerTitle: string,
    submitButtonText: string,
    thankYouRoute: string,
  },
  email: {
    confirmationSubject: string,
    brandColor: string,
    includes: string[],
  }
}
```

## Adding a New Program

### Step 1: Insert Program Record

```sql
INSERT INTO programs (
  slug,
  program_type,
  name,
  start_date,
  end_date,
  location,
  address,
  base_price_cents,
  capacity,
  requires_emergency_contact,
  requires_authorized_pickups,
  max_authorized_pickups,
  requires_medical_info,
  is_active
) VALUES (
  'summer-camp-2027',
  'camp',
  'Summer Camp 2027',
  '2027-06-21',
  '2027-06-26',
  'St. Luke''s / San Lucas Episcopal Church',
  '426 E Fourth Plain Blvd, Vancouver, WA',
  40000,  -- $400
  24,
  true,
  true,
  3,
  true,
  true
);
```

### Step 2: Add Sessions (If Workshop-Style)

```sql
-- Only needed for multi-session programs
INSERT INTO program_sessions (program_id, session_date, start_time, title)
SELECT id, '2027-02-20', '4:00 PM', 'Workshop 1'
FROM programs WHERE slug = 'workshops-spring-2027';
```

### Step 3: (Optional) Add New Program Type Config

If it's a completely new program type, add to `lib/program-config.ts`:

```typescript
masterclass: {
  fields: {
    showSecondParent: false,
    showGrade: false,
    // ... customize fields
  },
  display: {
    accentColor: 'sage',
    headerTitle: 'Register for Masterclass',
    // ...
  },
  email: {
    confirmationSubject: "You're registered! Masterclass confirmation",
    // ...
  }
}
```

## TypeScript Types

Import from `lib/database.types.ts`:

```typescript
import type {
  Program,
  ProgramInsert,
  ProgramSession,
  Registration,
  RegistrationInsert,
  RegistrationChild,
  RegistrationPickup,
  RegistrationWithChildren,
  ProgramWithSessions,
} from '@/lib/database.types'
```

## Helper Functions (Database)

```sql
-- Get remaining spots for a program
SELECT get_program_spots_remaining('program-uuid');

-- Get remaining spots for a specific session
SELECT get_session_spots_remaining('session-uuid');

-- Calculate registration total with sibling discounts
SELECT calculate_unified_registration_total('registration-uuid');
```

## Migration Path from Legacy Tables

When ready to migrate existing data:

1. Create migration `008_migrate_existing_data.sql`
2. Map legacy registrations to unified tables
3. Set `legacy_registration_id` and `legacy_type` for tracking
4. Run parallel for validation period
5. Update forms/admin to use new tables
6. Deprecate old code paths

### Example Migration Query

```sql
-- Create program from existing workshops
INSERT INTO programs (slug, program_type, name, ...)
SELECT 'workshops-spring-2026', 'workshop', 'Winter/Spring 2026 Workshops', ...
FROM workshops LIMIT 1;

-- Migrate workshop registrations
INSERT INTO registrations (
  program_id,
  legacy_registration_id,
  legacy_type,
  parent_name,
  parent_email,
  ...
)
SELECT
  (SELECT id FROM programs WHERE slug = 'workshops-spring-2026'),
  wr.id,
  'workshop',
  wr.parent_name,
  wr.parent_email,
  ...
FROM workshop_registrations wr;
```

## Files

| File | Purpose |
|------|---------|
| `supabase/migrations/007_unified_programs.sql` | Database schema |
| `lib/program-config.ts` | Program type configurations |
| `lib/database.types.ts` | TypeScript types (updated) |

## Future Work

- [ ] Create unified registration form component
- [ ] Create unified server action
- [ ] Create unified admin pages
- [ ] Create unified email templates
- [ ] Migrate existing data
- [ ] Deprecate legacy tables
