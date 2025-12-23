# Admin Portal

Documentation for the admin portal system.

---

## Overview

The admin portal at `/admin` provides management for all registrations and signups. Access is protected by Supabase authentication.

---

## Routes

| Route | Purpose |
|-------|---------|
| `/admin` | Dashboard with stats overview |
| `/admin/workshops` | Workshop registrations list |
| `/admin/workshops/[id]` | Workshop registration detail |
| `/admin/camp` | Camp registrations list |
| `/admin/camp/[id]` | Camp registration detail |
| `/admin/waitlist` | Music school waitlist |
| `/admin/waitlist/[id]` | Waitlist signup detail |
| `/admin/activity` | Activity log |

---

## List Views

Each list view shows a table of registrations with:
- Parent name (clickable link to detail)
- Email
- Status badge
- Payment status badge (for paid programs)
- Registration date

### Status Badges

**Registration Status:**
| Status | Color | Meaning |
|--------|-------|---------|
| pending | Amber | Awaiting confirmation |
| confirmed | Green | Registration confirmed |
| waitlist | Blue | On waitlist (workshops only) |
| cancelled | Gray | Cancelled |

**Payment Status:**
| Status | Color | Meaning |
|--------|-------|---------|
| unpaid | Red | No payment received |
| paid | Green | Fully paid |
| partial | Amber | Partial payment |
| waived | Blue | Tuition assistance granted |

**Waitlist Status:**
| Status | Color | Meaning |
|--------|-------|---------|
| new | Blue | New signup, not contacted |
| contacted | Amber | Admin has reached out |
| converted | Green | Converted to registration |

---

## Detail Views

Each detail view shows full registration information and allows admins to:
- View all submitted data
- Update status
- Update payment status
- Add admin notes
- See children and their details

### Workshop Detail (`/admin/workshops/[id]`)

Sections:
- **Cancellation Notice**: (if cancelled) Shows cancellation date and reason
- **Contact**: Parent email, phone
- **Children**: Names, ages, schools, sibling discounts
- **Workshops**: List of selected workshop dates
- **Additional Info**: How heard, excited about, message
- **Payment**: Total, paid, method, tuition assistance
- **Actions**: Status dropdown, payment dropdown, admin notes

### Camp Detail (`/admin/camp/[id]`)

Sections:
- **Cancellation Notice**: (if cancelled) Shows cancellation date and reason
- **Contact**: Parent email, phone
- **Emergency Contact**: Name, phone, relationship (highlighted in red)
- **Authorized Pickups**: List of people authorized to pick up children (highlighted in blue)
- **Children**: Names, ages, grades, schools, medical info
  - Allergies (amber badge)
  - Medical conditions (red badge)
  - Special needs (blue badge)
- **Additional Info**: How heard, excited about, message
- **Payment**: Total, paid, method, tuition assistance
- **Actions**: Status dropdown, payment dropdown, admin notes

### Waitlist Detail (`/admin/waitlist/[id]`)

Sections:
- **Contact**: Parent email, number of children
- **Child Info**: Name, grade, school (if provided)
- **Message**: Full message text
- **Actions**: Status dropdown, admin notes

---

## Server Actions

Each detail page has a server action for updates:

```typescript
// app/admin/workshops/[id]/actions.ts
export async function updateWorkshopRegistration(
  registrationId: string,
  data: {
    status?: string
    payment_status?: string
    admin_notes?: string
  }
)
```

Actions:
1. Update the database record
2. Set `updated_at` timestamp
3. Revalidate relevant paths (detail, list, dashboard)
4. Return success/error

---

## Components

### RegistrationActions

Client component for the actions sidebar:

```tsx
<RegistrationActions
  registrationId={registration.id}
  currentStatus={registration.status}
  currentPaymentStatus={registration.payment_status}
  currentNotes={registration.admin_notes}
/>
```

Features:
- Controlled form with useState
- useTransition for pending state
- Success/error message display
- Auto-dismiss success after 3 seconds

---

## Authentication

Admin routes are protected by middleware (`middleware.ts`):

1. Check for Supabase session
2. If no session, redirect to `/auth/login`
3. After login, redirect back to requested admin page

Authorized users:
- jack@creativekidsmusic.org
- elizabeth.femling@gmail.com

---

## Data Access

Data functions in `lib/data.ts`:

```typescript
// List functions
getWorkshopRegistrations()
getCampRegistrations()
getWaitlistSignups()

// Detail functions (with children joined)
getWorkshopRegistrationWithChildren(id)
getCampRegistrationWithChildren(id)

// Stats
getDashboardStats()
```

---

## CSV Export

Each list page has an "Export CSV" button (visible when data exists).

### Export Routes

| Route | Output |
|-------|--------|
| `/admin/workshops/export` | Workshop registrations with children |
| `/admin/camp/export` | Camp registrations with children and medical info |
| `/admin/waitlist/export` | Waitlist signups |

### CSV Contents

**Workshop Export:**
- Registration date, parent info
- Children (name, age) combined
- Selected workshops
- Status, payment, method
- Optional fields, admin notes

**Camp Export:**
- Registration date, parent info
- Emergency contact
- Children with grade info
- Allergies, medical, special needs (per child)
- Status, payment, method
- Optional fields, admin notes

**Waitlist Export:**
- Signup date, parent info
- Child info if provided
- Status, message, admin notes

---

## Database Tables

### workshop_registrations
- Parent info, workshop_ids[], payment info, terms, optional fields
- `user_id` - Links to parent's Supabase Auth account
- `cancelled_at`, `cancellation_reason` - Cancellation tracking
- `version` - Optimistic locking for concurrent updates

### workshop_children
- Links to registration, child name/age/school, discount

### camp_registrations
- Parent info, emergency contact, payment info, terms, optional fields
- `user_id` - Links to parent's Supabase Auth account
- `cancelled_at`, `cancellation_reason` - Cancellation tracking
- `version` - Optimistic locking for concurrent updates

### camp_children
- Links to registration, child name/age/grade/school, medical info, discount

### authorized_pickups
- `camp_registration_id` - Links to camp registration
- `name` - Name of authorized pickup person
- Parent manages via account portal, verified in person at pickup

### waitlist_signups
- Parent info, optional child info, message, status
