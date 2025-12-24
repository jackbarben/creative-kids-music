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
| `location` | TEXT | Venue name |
| `address` | TEXT | Venue address |
| `description` | TEXT | Workshop description |
| `capacity` | INTEGER | Max participants |
| `price_cents` | INTEGER | Price in cents |
| `is_active` | BOOLEAN | Whether registration is open |
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
| `parent_first_name` | TEXT | First name |
| `parent_last_name` | TEXT | Last name |
| `parent_relationship` | TEXT | Relationship to child |
| `emergency_name` | TEXT | Emergency contact name |
| `emergency_phone` | TEXT | Emergency contact phone |
| `emergency_relationship` | TEXT | Emergency contact relationship |
| `workshop_ids` | UUID[] | Array of workshop IDs |
| `status` | TEXT | pending, confirmed, waitlist, cancelled |
| `payment_status` | TEXT | unpaid, paid, partial, waived |
| `payment_method` | TEXT | Payment method used |
| `tuition_assistance` | BOOLEAN | Requested assistance |
| `assistance_notes` | TEXT | Assistance details |
| `total_amount_cents` | INTEGER | Total in cents |
| `amount_paid_cents` | INTEGER | Amount paid in cents |
| `payment_date` | DATE | When payment received |
| `payment_notes` | TEXT | Payment notes |
| `terms_accepted` | BOOLEAN | Terms accepted |
| `terms_accepted_at` | TIMESTAMPTZ | When terms accepted |
| `liability_waiver_accepted` | BOOLEAN | Waiver accepted |
| `liability_waiver_accepted_at` | TIMESTAMPTZ | When waiver accepted |
| `media_consent_internal` | BOOLEAN | Internal photo/video consent |
| `media_consent_marketing` | BOOLEAN | Marketing photo/video consent |
| `media_consent_accepted_at` | TIMESTAMPTZ | When consent given |
| `email_unsubscribed` | BOOLEAN | Opted out of emails |
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
| `account_child_id` | UUID | FK to account_children (if linked) |
| `child_name` | TEXT | Child's full name |
| `first_name` | TEXT | Child's first name |
| `last_name` | TEXT | Child's last name |
| `child_age` | INTEGER | Child's age |
| `child_school` | TEXT | School name |
| `allergies` | TEXT | Known allergies |
| `dietary_restrictions` | TEXT | Dietary needs |
| `medical_conditions` | TEXT | Medical conditions |
| `discount_cents` | INTEGER | Sibling discount applied |
| `created_at` | TIMESTAMPTZ | Record creation |

### `workshop_authorized_pickups`

People authorized to pick up children at workshops.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `registration_id` | UUID | FK to workshop_registrations |
| `name` | TEXT | Pickup person's name |
| `phone` | TEXT | Phone number |
| `relationship` | TEXT | Relationship to child |
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
| `parent_first_name` | TEXT | First name |
| `parent_last_name` | TEXT | Last name |
| `parent_relationship` | TEXT | Relationship to child |
| `parent2_first_name` | TEXT | Second parent first name |
| `parent2_last_name` | TEXT | Second parent last name |
| `parent2_relationship` | TEXT | Second parent relationship |
| `parent2_phone` | TEXT | Second parent phone |
| `parent2_email` | TEXT | Second parent email |
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
| `payment_date` | DATE | When payment received |
| `payment_notes` | TEXT | Payment notes |
| `terms_accepted` | BOOLEAN | Terms accepted |
| `terms_accepted_at` | TIMESTAMPTZ | When terms accepted |
| `liability_waiver_accepted` | BOOLEAN | Waiver accepted |
| `liability_waiver_accepted_at` | TIMESTAMPTZ | When waiver accepted |
| `behavior_agreement_accepted` | BOOLEAN | Behavior agreement accepted |
| `behavior_agreement_accepted_at` | TIMESTAMPTZ | When behavior agreement accepted |
| `media_consent_internal` | BOOLEAN | Internal photo/video consent |
| `media_consent_marketing` | BOOLEAN | Marketing photo/video consent |
| `media_consent_accepted_at` | TIMESTAMPTZ | When consent given |
| `email_unsubscribed` | BOOLEAN | Opted out of emails |
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
| `account_child_id` | UUID | FK to account_children (if linked) |
| `child_name` | TEXT | Child's full name |
| `first_name` | TEXT | Child's first name |
| `last_name` | TEXT | Child's last name |
| `child_age` | INTEGER | Child's age |
| `child_grade` | TEXT | Grade level |
| `child_school` | TEXT | School name |
| `tshirt_size` | TEXT | T-shirt size |
| `allergies` | TEXT | Known allergies |
| `dietary_restrictions` | TEXT | Dietary needs |
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
| `phone` | TEXT | Phone number |
| `relationship` | TEXT | Relationship to child |
| `created_at` | TIMESTAMPTZ | Record creation |

### `account_children`

Account-level children (reusable across registrations).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to auth.users |
| `first_name` | TEXT | Child's first name |
| `last_name` | TEXT | Child's last name |
| `date_of_birth` | DATE | Birth date |
| `school` | TEXT | School name |
| `allergies` | TEXT | Known allergies |
| `dietary_restrictions` | TEXT | Dietary needs |
| `medical_conditions` | TEXT | Medical conditions |
| `notes` | TEXT | Additional notes |
| `created_at` | TIMESTAMPTZ | Record creation |
| `updated_at` | TIMESTAMPTZ | Last update |

### `account_settings`

Account-level settings (parent info, emergency contact, defaults).

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK to auth.users (unique) |
| `parent_first_name` | TEXT | Primary parent first name |
| `parent_last_name` | TEXT | Primary parent last name |
| `parent_relationship` | TEXT | Relationship to children |
| `parent_phone` | TEXT | Primary parent phone |
| `parent2_first_name` | TEXT | Second parent first name |
| `parent2_last_name` | TEXT | Second parent last name |
| `parent2_relationship` | TEXT | Second parent relationship |
| `parent2_phone` | TEXT | Second parent phone |
| `parent2_email` | TEXT | Second parent email |
| `emergency_name` | TEXT | Emergency contact name |
| `emergency_phone` | TEXT | Emergency contact phone |
| `emergency_relationship` | TEXT | Emergency contact relationship |
| `default_pickups` | JSONB | Default authorized pickups array |
| `default_media_consent_internal` | BOOLEAN | Default internal consent |
| `default_media_consent_marketing` | BOOLEAN | Default marketing consent |
| `email_reminders` | BOOLEAN | Receive reminder emails |
| `email_updates` | BOOLEAN | Receive update emails |
| `created_at` | TIMESTAMPTZ | Record creation |
| `updated_at` | TIMESTAMPTZ | Last update |

### `waitlist_signups`

Music school interest list.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `parent_name` | TEXT | Parent name |
| `parent_email` | TEXT | Email |
| `child_name` | TEXT | Child name |
| `child_grade` | TEXT | Child grade |
| `child_school` | TEXT | Child school |
| `num_children` | INTEGER | Number of children interested |
| `message` | TEXT | Additional info |
| `status` | TEXT | new, contacted, converted |
| `admin_notes` | TEXT | Internal notes |
| `created_at` | TIMESTAMPTZ | Record creation |

### `email_log`

Sent email tracking.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `recipient_email` | TEXT | Recipient email |
| `email_type` | TEXT | Type of email |
| `subject` | TEXT | Email subject |
| `entity_type` | TEXT | Related entity type |
| `entity_id` | UUID | Related record ID |
| `status` | TEXT | sent, failed, bounced |
| `provider_id` | TEXT | Resend API ID |
| `created_at` | TIMESTAMPTZ | When sent |

### `activity_log`

Admin action audit trail.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `action` | TEXT | Action performed |
| `entity_type` | TEXT | workshop, camp, etc. |
| `entity_id` | UUID | Related record ID |
| `details` | JSONB | Action details |
| `user_id` | UUID | Who performed action |
| `user_email` | TEXT | Admin email |
| `created_at` | TIMESTAMPTZ | When performed |

### `magic_links` (Legacy)

Magic link tokens for legacy parent portal access.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | Parent email |
| `token` | TEXT | Secure token |
| `expires_at` | TIMESTAMPTZ | Token expiration |
| `used_at` | TIMESTAMPTZ | When used |
| `created_at` | TIMESTAMPTZ | Record creation |

---

## Row Level Security (RLS)

### Workshop Registrations

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_workshops` | INSERT | Anonymous can create registrations |
| `parents_read_own_workshops` | SELECT | Parents see own registrations (by user_id) |
| `parents_update_own_workshops` | UPDATE | Parents can update own registrations |
| `service_role_bypass` | ALL | Service role has full access |

### Workshop Children

| Policy | Operation | Description |
|--------|-----------|-------------|
| `anon_insert_workshop_children` | INSERT | Anonymous can add children |
| `parents_read_own_workshop_children` | SELECT | Parents see own children |
| `parents_update_own_workshop_children` | UPDATE | Parents can update children |
| `parents_delete_own_workshop_children` | DELETE | Parents can remove children |
| `parents_insert_own_workshop_children` | INSERT | Parents can add children |

### Workshop Authorized Pickups

| Policy | Operation | Description |
|--------|-----------|-------------|
| `Users can view own workshop pickups` | SELECT | Parents see own pickups |
| `Users can insert own workshop pickups` | INSERT | Parents can add pickups |
| `Users can update own workshop pickups` | UPDATE | Parents can update pickups |
| `Users can delete own workshop pickups` | DELETE | Parents can remove pickups |
| `Admins can manage all workshop pickups` | ALL | Admin access |

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

### Authorized Pickups (Camp)

| Policy | Operation | Description |
|--------|-----------|-------------|
| `parents_manage_pickups` | ALL | Parents can manage own pickups |

### Account Children

| Policy | Operation | Description |
|--------|-----------|-------------|
| `Users can view own children` | SELECT | Users see own children |
| `Users can insert own children` | INSERT | Users can add children |
| `Users can update own children` | UPDATE | Users can update children |
| `Users can delete own children` | DELETE | Users can remove children |
| `Admins can view all children` | SELECT | Admin access |
| `Service role bypass` | ALL | Service role access |

### Account Settings

| Policy | Operation | Description |
|--------|-----------|-------------|
| `Users can view own settings` | SELECT | Users see own settings |
| `Users can insert own settings` | INSERT | Users can create settings |
| `Users can update own settings` | UPDATE | Users can update settings |
| `Admins can view all settings` | SELECT | Admin access |
| `Service role bypass` | ALL | Service role access |

---

## Helper Functions

### `is_owner(reg_user_id UUID)`

Checks if current user owns a registration by matching user_id.

### `get_all_children_for_parent(p_user_id UUID)`

Returns all active children for a parent across workshops and camp, used for sibling discount calculation.

### `recalculate_registration_total(p_registration_id, p_program_type, p_user_id)`

Recalculates totals for a registration when children are added/removed. Applies sibling discount ($10 off) for 2nd+ children. Increments version for optimistic locking.

### `get_workshop_spots_remaining(workshop_uuid UUID)`

Returns remaining capacity for a workshop.

---

## Migrations

| Migration | Description | Status |
|-----------|-------------|--------|
| `001_initial_schema.sql` | Core tables (workshops, registrations, children, waitlist) | ✅ Applied |
| `002_magic_links.sql` | Magic link tokens (legacy) | ✅ Applied |
| `003_parent_accounts.sql` | User linking, cancellation, pickups, RLS | ✅ Applied |
| `004_registration_expansion.sql` | Account tables, expanded registration fields, consent/waiver columns | ✅ Applied |
| `005_media_consent_checkboxes.sql` | Split media consent into internal + marketing booleans | ✅ Applied |
| `006_pickup_phone.sql` | Added phone and relationship to authorized_pickups | ✅ Applied |

---

## Indexes

- `idx_workshop_reg_user` on `workshop_registrations(user_id)`
- `idx_workshop_reg_email` on `workshop_registrations(parent_email)`
- `idx_camp_reg_user` on `camp_registrations(user_id)`
- `idx_camp_reg_email` on `camp_registrations(parent_email)`
- `idx_pickups_registration` on `authorized_pickups(camp_registration_id)`
- `idx_account_children_user` on `account_children(user_id)`
- `idx_workshop_pickups_reg` on `workshop_authorized_pickups(registration_id)`

---

*Last updated: 2025-12-23*
