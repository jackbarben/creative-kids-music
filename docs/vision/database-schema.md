# Database Schema (Vision)

## Overview

Three distinct registration types, each supporting multiple children per family:
1. **Workshop registrations** - 3 Friday evening workshops (capacity: 12 + waitlist)
2. **Camp registrations** - Week-long summer camp (no capacity limit)
3. **Music school waitlist** - Fall 2026 interest

Plus supporting tables for workshop definitions, email tracking, and admin audit logs.

---

## Key Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Multi-child support | Separate `children` table | Cleaner queries, easier discount calculation |
| Payment | External (church platform) | Link out, track status internally |
| Workshop capacity | 12 children + waitlist | When full, allow waitlist signups |
| Camp capacity | No limit | Let it flow |
| Discounts | $10 off per child per workshop | 1st: $75, 2nd: $65, 3rd: $55, 4th: $45, etc. |
| Emails | Transactional email service (Resend) | Confirmations, reminders, payment nudges |
| Terms/Waiver | Checkbox + timestamp | Track agreement for legal compliance |

---

## Tables

### `workshops`

Defines the available workshops (admin-managed).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| title | text | NOT NULL | e.g., "Spring Workshop 1" |
| date | date | NOT NULL | Workshop date |
| start_time | time | | 3:30 PM |
| end_time | time | | 7:30 PM |
| location | text | | St. Luke's/San Lucas Episcopal Church |
| address | text | | Full address |
| description | text | | Workshop description |
| capacity | int | default 12 | Max children (not families) |
| price_cents | int | default 7500 | $75.00 per child |
| is_active | boolean | default true | Show on website? |
| created_at | timestamptz | default now() | |

**Initial data:**
- February 20, 2026
- March 20, 2026
- May 1, 2026

---

### `workshop_registrations`

Family registration for workshops (parent info + payment).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | | |
| status | text | default 'pending' | pending, confirmed, waitlist, cancelled |
| waitlist_position | int | | Position in waitlist (null if not waitlisted) |
| **Parent/Guardian** |
| parent_name | text | NOT NULL | |
| parent_email | text | NOT NULL | |
| parent_phone | text | | |
| **Workshop Selection** |
| workshop_ids | uuid[] | NOT NULL | Array of workshop IDs selected |
| **Payment** |
| payment_status | text | default 'unpaid' | unpaid, paid, partial, waived |
| payment_method | text | | 'online', 'cash', 'check', 'waived' |
| tuition_assistance | boolean | default false | Requested assistance? |
| assistance_notes | text | | Details of request |
| total_amount_cents | int | | Calculated total with discounts |
| amount_paid_cents | int | default 0 | Amount received |
| payment_date | timestamptz | | When fully paid |
| payment_notes | text | | Admin payment notes |
| **Terms & Consent** |
| terms_accepted | boolean | NOT NULL | Must accept to register |
| terms_accepted_at | timestamptz | | When they accepted |
| **Communication** |
| email_unsubscribed | boolean | default false | Opted out of reminder emails |
| **Other** |
| how_heard | text | | How did you hear about us (free text) |
| excited_about | text | | What are you most excited about |
| message | text | | Additional message |
| admin_notes | text | | Internal notes |

---

### `workshop_children`

Children linked to a workshop registration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| registration_id | uuid | FK → workshop_registrations | Parent registration |
| child_name | text | NOT NULL | |
| child_age | int | NOT NULL | 9-13 |
| child_school | text | | |
| discount_cents | int | default 0 | 0, 1000, 2000, etc. |
| created_at | timestamptz | default now() | |

**Discount logic:**
- 1st child: $0 discount
- 2nd child: $10 discount (1000 cents)
- 3rd child: $20 discount (2000 cents)
- 4th child: $30 discount, etc.

---

### `camp_registrations`

Family registration for summer camp (no capacity limit).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| created_at | timestamptz | default now() | |
| updated_at | timestamptz | | |
| status | text | default 'pending' | pending, confirmed, cancelled |
| **Parent/Guardian** |
| parent_name | text | NOT NULL | |
| parent_email | text | NOT NULL | |
| parent_phone | text | NOT NULL | Required for camp |
| **Emergency Contact** |
| emergency_name | text | NOT NULL | |
| emergency_phone | text | NOT NULL | |
| emergency_relationship | text | | e.g., "Grandmother" |
| **Payment** |
| payment_status | text | default 'unpaid' | unpaid, paid, partial, waived |
| payment_method | text | | |
| tuition_assistance | boolean | default false | |
| assistance_notes | text | | |
| total_amount_cents | int | | $400/child with discounts |
| amount_paid_cents | int | default 0 | |
| payment_date | timestamptz | | |
| payment_notes | text | | |
| **Terms & Consent** |
| terms_accepted | boolean | NOT NULL | Must accept to register |
| terms_accepted_at | timestamptz | | When they accepted |
| **Communication** |
| email_unsubscribed | boolean | default false | Opted out of reminder emails |
| **Other** |
| how_heard | text | | Free text field |
| excited_about | text | | |
| message | text | | |
| admin_notes | text | | |

---

### `camp_children`

Children linked to a camp registration.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| registration_id | uuid | FK → camp_registrations | Parent registration |
| child_name | text | NOT NULL | |
| child_age | int | NOT NULL | 9-13 |
| child_grade | text | | Rising grade |
| child_school | text | | |
| allergies | text | | Per-child allergies |
| medical_conditions | text | | Conditions, medications |
| special_needs | text | | Accommodations needed |
| discount_cents | int | default 0 | Multi-child discount |
| created_at | timestamptz | default now() | |

---

### `waitlist_signups`

Music School Fall 2026 interest list.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| created_at | timestamptz | default now() | |
| status | text | default 'new' | new, contacted, converted |
| **Parent Info** |
| parent_name | text | NOT NULL | |
| parent_email | text | NOT NULL | |
| **Child Info** |
| child_name | text | | |
| child_grade | text | | Current grade |
| child_school | text | | |
| num_children | int | default 1 | How many kids interested |
| **Other** |
| message | text | | Questions, interest notes |
| admin_notes | text | | |

---

### `email_log`

Track all emails sent (for debugging and preventing duplicates).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| created_at | timestamptz | default now() | |
| recipient_email | text | NOT NULL | |
| email_type | text | NOT NULL | 'confirmation', 'reminder', 'payment_nudge' |
| subject | text | | |
| entity_type | text | | 'workshop_registration', 'camp_registration' |
| entity_id | uuid | | Which registration |
| status | text | default 'sent' | sent, failed, bounced |
| provider_id | text | | Email service message ID |

---

### `activity_log`

Audit trail for admin actions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | uuid | PK | |
| created_at | timestamptz | default now() | |
| user_id | uuid | FK → auth.users | Admin who did it |
| user_email | text | | Denormalized for easy display |
| action | text | NOT NULL | 'created', 'updated', 'deleted', 'exported', 'email_sent' |
| entity_type | text | | 'workshop_registration', 'camp_registration', etc. |
| entity_id | uuid | | Which record |
| details | jsonb | | What changed |

---

## Capacity Tracking

Need to calculate spots remaining per workshop/camp:

```sql
-- Spots remaining for a workshop
SELECT
  w.id,
  w.title,
  w.capacity,
  w.capacity - COALESCE(COUNT(wc.id), 0) AS spots_remaining
FROM workshops w
LEFT JOIN workshop_registrations wr ON w.id = ANY(wr.workshop_ids) AND wr.status != 'cancelled'
LEFT JOIN workshop_children wc ON wc.registration_id = wr.id
WHERE w.id = $1
GROUP BY w.id;
```

For camp, simpler since it's one event:
```sql
SELECT
  50 - COUNT(*) AS spots_remaining  -- 50 = camp capacity
FROM camp_children cc
JOIN camp_registrations cr ON cc.registration_id = cr.id
WHERE cr.status != 'cancelled';
```

---

## Row Level Security (RLS)

| Table | Public | Authenticated Admin |
|-------|--------|---------------------|
| workshops | SELECT (active only) | Full access |
| workshop_registrations | INSERT only | Full access |
| workshop_children | INSERT only | Full access |
| camp_registrations | INSERT only | Full access |
| camp_children | INSERT only | Full access |
| waitlist_signups | INSERT only | Full access |
| email_log | None | SELECT, INSERT |
| activity_log | None | SELECT, INSERT |

---

## Indexes

```sql
-- Workshops
CREATE INDEX idx_workshops_date ON workshops(date);
CREATE INDEX idx_workshops_active ON workshops(is_active);

-- Workshop registrations
CREATE INDEX idx_workshop_reg_email ON workshop_registrations(parent_email);
CREATE INDEX idx_workshop_reg_status ON workshop_registrations(status);
CREATE INDEX idx_workshop_reg_created ON workshop_registrations(created_at);
CREATE INDEX idx_workshop_children_reg ON workshop_children(registration_id);

-- Camp registrations
CREATE INDEX idx_camp_reg_email ON camp_registrations(parent_email);
CREATE INDEX idx_camp_reg_status ON camp_registrations(status);
CREATE INDEX idx_camp_children_reg ON camp_children(registration_id);

-- Waitlist
CREATE INDEX idx_waitlist_email ON waitlist_signups(parent_email);
CREATE INDEX idx_waitlist_status ON waitlist_signups(status);

-- Email log
CREATE INDEX idx_email_log_entity ON email_log(entity_type, entity_id);
CREATE INDEX idx_email_log_recipient ON email_log(recipient_email);
```

---

## Discount Calculation Example

**Per-child discount: $10 off per additional child per workshop**

Pricing per workshop:
- 1st child: $75
- 2nd child: $65 ($10 off)
- 3rd child: $55 ($20 off)
- 4th child: $45 ($30 off)
- etc.

### Example: 3 children for 2 workshops

| Child | Per Workshop | × 2 Workshops | Subtotal |
|-------|-------------|---------------|----------|
| 1st | $75 | × 2 | $150 |
| 2nd | $65 | × 2 | $130 |
| 3rd | $55 | × 2 | $110 |
| **Total** | | | **$390** |

### Example: 2 children for 3 workshops

| Child | Per Workshop | × 3 Workshops | Subtotal |
|-------|-------------|---------------|----------|
| 1st | $75 | × 3 | $225 |
| 2nd | $65 | × 3 | $195 |
| **Total** | | | **$420** |

### Summer Camp Discount (Same Logic)

Base price: $400 per child

| Child | Price |
|-------|-------|
| 1st | $400 |
| 2nd | $390 |
| 3rd | $380 |
| etc. | -$10 per child |
