# Database Implementation

This document describes the actual database schema as implemented in Supabase.

## Connection

**Supabase Project**: `creative-kids-music`
**URL**: `https://qidzeagzbrqxntrqbpzx.supabase.co`

---

## Tables

### `workshops`

Workshop definitions (dates, capacity, pricing).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `title` | TEXT | Workshop title |
| `date` | DATE | Workshop date |
| `start_time` | TIME | Start time |
| `end_time` | TIME | End time |
| `capacity` | INTEGER | Max participants |
| `price_cents` | INTEGER | Price in cents |
| `active` | BOOLEAN | Whether registration is open |
| `created_at` | TIMESTAMPTZ | Record creation |

### `workshop_registrations`

Workshop signups linked to parent accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to auth.users (parent account) |
| `parent_name` | TEXT | Parent/guardian name |
| `parent_email` | TEXT | Email (lowercase) |
| `parent_phone` | TEXT | Phone number |
| `workshop_ids` | UUID[] | Array of workshop IDs |
| `status` | TEXT | pending, confirmed, cancelled |
| `payment_status` | TEXT | unpaid, paid, partial, waived |
| `payment_method` | TEXT | Payment method used |
| `tuition_assistance` | BOOLEAN | Requested assistance |
| `assistance_notes` | TEXT | Assistance details |
| `total_amount_cents` | INTEGER | Total in cents |
| `amount_paid_cents` | INTEGER | Amount paid in cents |
| `terms_accepted` | BOOLEAN | Terms accepted |
| `terms_accepted_at` | TIMESTAMPTZ | When terms accepted |
| `how_heard` | TEXT | Referral source |
| `excited_about` | TEXT | What excited them |
| `message` | TEXT | Additional message |
| `admin_notes` | TEXT | Internal notes |
| `cancelled_at` | TIMESTAMPTZ | When cancelled |
| `cancellation_reason` | TEXT | Why cancelled |
| `version` | INTEGER | Optimistic locking |
| `created_at` | TIMESTAMPTZ | Record creation |
| `updated_at` | TIMESTAMPTZ | Last update |

### `workshop_children`

Children linked to workshop registrations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `registration_id` | UUID | FK to workshop_registrations |
| `child_name` | TEXT | Child's name |
| `child_age` | INTEGER | Child's age |
| `child_school` | TEXT | School name |
| `discount_cents` | INTEGER | Sibling discount applied |
| `created_at` | TIMESTAMPTZ | Record creation |

### `camp_registrations`

Summer camp signups linked to parent accounts.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to auth.users (parent account) |
| `parent_name` | TEXT | Parent/guardian name |
| `parent_email` | TEXT | Email (lowercase) |
| `parent_phone` | TEXT | Phone number |
| `emergency_name` | TEXT | Emergency contact name |
| `emergency_phone` | TEXT | Emergency contact phone |
| `emergency_relationship` | TEXT | Relationship to child |
| `status` | TEXT | pending, confirmed, cancelled |
| `payment_status` | TEXT | unpaid, paid, partial, waived |
| `payment_method` | TEXT | Payment method used |
| `tuition_assistance` | BOOLEAN | Requested assistance |
| `assistance_notes` | TEXT | Assistance details |
| `total_amount_cents` | INTEGER | Total in cents |
| `amount_paid_cents` | INTEGER | Amount paid in cents |
| `terms_accepted` | BOOLEAN | Terms accepted |
| `terms_accepted_at` | TIMESTAMPTZ | When terms accepted |
| `how_heard` | TEXT | Referral source |
| `excited_about` | TEXT | What excited them |
| `message` | TEXT | Additional message |
| `admin_notes` | TEXT | Internal notes |
| `cancelled_at` | TIMESTAMPTZ | When cancelled |
| `cancellation_reason` | TEXT | Why cancelled |
| `version` | INTEGER | Optimistic locking |
| `created_at` | TIMESTAMPTZ | Record creation |
| `updated_at` | TIMESTAMPTZ | Last update |

### `camp_children`

Children linked to camp registrations with medical info.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `registration_id` | UUID | FK to camp_registrations |
| `child_name` | TEXT | Child's name |
| `child_age` | INTEGER | Child's age |
| `child_grade` | TEXT | Grade level |
| `child_school` | TEXT | School name |
| `allergies` | TEXT | Known allergies |
| `medical_conditions` | TEXT | Medical conditions |
| `special_needs` | TEXT | Special accommodations |
| `discount_cents` | INTEGER | Sibling discount applied |
| `created_at` | TIMESTAMPTZ | Record creation |

### `authorized_pickups`

People authorized to pick up children at camp.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `camp_registration_id` | UUID | FK to camp_registrations |
| `name` | TEXT | Pickup person's name |
| `created_at` | TIMESTAMPTZ | Record creation |

### `waitlist_signups`

Music school interest list.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `parent_name` | TEXT | Parent name |
| `parent_email` | TEXT | Email |
| `parent_phone` | TEXT | Phone |
| `child_name` | TEXT | Child name |
| `child_age` | INTEGER | Child age |
| `message` | TEXT | Additional info |
| `created_at` | TIMESTAMPTZ | Record creation |

### `email_log`

Sent email tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email_type` | TEXT | Type of email |
| `recipient` | TEXT | Recipient email |
| `subject` | TEXT | Email subject |
| `sent_at` | TIMESTAMPTZ | When sent |
| `resend_id` | TEXT | Resend API ID |
| `error` | TEXT | Error if failed |

### `activity_log`

Admin action audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `action` | TEXT | Action performed |
| `entity_type` | TEXT | workshop, camp, etc. |
| `entity_id` | UUID | Related record ID |
| `details` | JSONB | Action details |
| `admin_email` | TEXT | Who performed action |
| `created_at` | TIMESTAMPTZ | When performed |

---

## Row Level Security (RLS)

### Workshop Registrations

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_workshops` | INSERT | Anonymous can create registrations |
| `parents_read_own_workshops` | SELECT | Parents see own registrations (by user_id) |
| `parents_update_own_workshops` | UPDATE | Parents can update own registrations |

### Workshop Children

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_workshop_children` | INSERT | Anonymous can add children |
| `parents_read_own_workshop_children` | SELECT | Parents see own children |
| `parents_update_own_workshop_children` | UPDATE | Parents can update children |
| `parents_delete_own_workshop_children` | DELETE | Parents can remove children |
| `parents_insert_own_workshop_children` | INSERT | Parents can add children |

### Camp Registrations

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_camp` | INSERT | Anonymous can create registrations |
| `parents_read_own_camp` | SELECT | Parents see own registrations |
| `parents_update_own_camp` | UPDATE | Parents can update own registrations |

### Camp Children

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_camp_children` | INSERT | Anonymous can add children |
| `parents_read_own_camp_children` | SELECT | Parents see own children |
| `parents_update_own_camp_children` | UPDATE | Parents can update children |
| `parents_delete_own_camp_children` | DELETE | Parents can remove children |
| `parents_insert_own_camp_children` | INSERT | Parents can add children |

### Authorized Pickups

| Policy | Operation | Description |
|--------|-----------|-------------|
| `parents_manage_pickups` | ALL | Parents can manage own pickups |

---

## Helper Functions

### `is_owner(reg_user_id UUID, reg_email TEXT)`

Checks if current user owns a registration by matching user_id.

### `get_all_children_for_parent(p_user_id UUID)`

Returns all active children for a parent across workshops and camp, used for sibling discount calculation.

### `recalculate_all_totals(p_user_id UUID)`

Recalculates totals for all registrations when children are added/removed.

---

## Migrations

| Migration | Description | Status |
|-----------|-------------|--------|
| `001_initial_schema.sql` | Core tables (workshops, registrations, children, waitlist) | Applied |
| `002_magic_links.sql` | Magic link tokens (legacy) | Applied |
| `003_parent_accounts.sql` | User linking, cancellation, pickups, RLS | Applied |

---

## Indexes

- `idx_workshop_reg_user` on `workshop_registrations(user_id)`
- `idx_workshop_reg_email` on `workshop_registrations(parent_email)`
- `idx_camp_reg_user` on `camp_registrations(user_id)`
- `idx_camp_reg_email` on `camp_registrations(parent_email)`
- `idx_pickups_registration` on `authorized_pickups(camp_registration_id)`

---

*Last updated: 2025-12-22*
