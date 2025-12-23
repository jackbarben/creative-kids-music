# Portal Fixes Implementation Plan

Last updated: December 2024

This document outlines all fixes needed for the admin and parent portal based on production readiness review.

---

## Quick Fixes (< 30 min each)

### 1. Create Constants File for Hardcoded Dates
**Priority:** High
**Files to create/modify:**
- Create: `lib/constants.ts`
- Modify: `app/account/actions.ts`
- Modify: `components/account/RegistrationCard.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/admin/camp/page.tsx`
- Modify: `app/admin/waitlist/page.tsx`

**Implementation:**
```typescript
// lib/constants.ts
export const PROGRAMS = {
  workshops: {
    name: 'Winter/Spring Music Workshop',
    season: 'Winter/Spring 2026',
    dates: [
      new Date('2026-02-20'),
      new Date('2026-03-20'),
      new Date('2026-05-01'),
    ],
    time: '3:30 PM – 7:30 PM',
    price: 7500, // cents
    ages: '9-13',
  },
  camp: {
    name: 'Summer Camp 2026',
    startDate: new Date('2026-06-22T00:00:00-08:00'),
    endDate: new Date('2026-06-27T23:59:59-08:00'),
    performanceDate: new Date('2026-06-29'),
    time: '8:30 AM – 5:00 PM',
    price: 40000, // cents
    ages: '9-13',
  },
  musicSchool: {
    name: 'Music School',
    startDate: new Date('2026-09-01'),
    season: 'Fall 2026',
  },
} as const

export const SIBLING_DISCOUNT = 1000 // cents ($10)
export const MAX_SIBLING_DISCOUNT = 3000 // cents ($30)
```

**Status:** [ ] Not started

---

### 2. Add `updated_at` to Camp Registration Update
**Priority:** High
**Files to modify:**
- `app/admin/camp/[id]/actions.ts`

**Implementation:**
```typescript
// Line ~20, add updated_at to the update object
const { error } = await supabase
  .from('camp_registrations')
  .update({
    status,
    payment_status: paymentStatus,
    admin_notes: adminNotes,
    updated_at: new Date().toISOString(), // ADD THIS LINE
  })
  .eq('id', id)
```

**Status:** [ ] Not started

---

### 3. Add Loading Skeletons for Admin Detail Pages
**Priority:** Medium
**Files to create:**
- `app/admin/workshops/[id]/loading.tsx`
- `app/admin/camp/[id]/loading.tsx`
- `app/admin/waitlist/[id]/loading.tsx`

**Implementation:**
```typescript
// app/admin/workshops/[id]/loading.tsx (same pattern for others)
export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="flex items-center gap-4 mb-8">
        <div className="h-4 w-32 bg-stone-200 rounded" />
      </div>
      <div className="h-8 w-64 bg-stone-200 rounded mb-4" />
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="h-6 w-40 bg-stone-200 rounded mb-4" />
            <div className="space-y-3">
              <div className="h-4 w-full bg-stone-100 rounded" />
              <div className="h-4 w-3/4 bg-stone-100 rounded" />
              <div className="h-4 w-1/2 bg-stone-100 rounded" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm h-64" />
      </div>
    </div>
  )
}
```

**Status:** [ ] Not started

---

### 4. Standardize Button Colors
**Priority:** Low
**Files to modify:**
- `app/admin/workshops/[id]/RegistrationActions.tsx` - focus ring
- `app/admin/camp/[id]/RegistrationActions.tsx` - focus ring
- `app/admin/waitlist/[id]/SignupActions.tsx` - focus ring
- `components/account/EditChildModal.tsx` - button color
- `components/account/RemoveChildModal.tsx` - cancel button

**Standard colors:**
- Primary action: `bg-forest-600 hover:bg-forest-700 focus:ring-forest-500`
- Danger action: `bg-red-600 hover:bg-red-700 focus:ring-red-500`
- Secondary action: `bg-slate-200 hover:bg-slate-300 text-slate-800`
- Focus rings: `focus:ring-forest-500` (consistent)

**Status:** [ ] Not started

---

### 5. Add Refund Policy Link to Cancel Modal
**Priority:** Medium
**Files to modify:**
- `components/account/CancelModal.tsx`

**Implementation:**
Add after the warning text:
```tsx
<p className="text-sm text-slate-500 mt-2">
  See our{' '}
  <a
    href="/terms/program-terms#cancellation"
    target="_blank"
    className="text-forest-600 hover:underline"
  >
    cancellation policy
  </a>
  {' '}for details.
</p>
```

**Status:** [ ] Not started

---

### 6. Fix Console.error - Create Logger Utility
**Priority:** Low
**Files to create/modify:**
- Create: `lib/logger.ts`
- Modify: All files with console.error

**Implementation:**
```typescript
// lib/logger.ts
const isDev = process.env.NODE_ENV === 'development'

export function logError(context: string, error: unknown) {
  if (isDev) {
    console.error(`[${context}]`, error)
  }
  // In production, could send to Sentry, LogRocket, etc.
  // Example: Sentry.captureException(error, { extra: { context } })
}

export function logInfo(context: string, message: string) {
  if (isDev) {
    console.log(`[${context}]`, message)
  }
}
```

**Status:** [ ] Not started

---

### 7. Add Back Button Color Consistency
**Priority:** Low
**Files to modify:**
- `app/admin/camp/[id]/page.tsx` - change `terracotta-600` to `forest-600`
- `app/admin/waitlist/[id]/page.tsx` - change `stone-600` to `forest-600`

**Status:** [ ] Not started

---

## Medium Fixes (30 min - 2 hours each)

### 8. Add Confirmation Dialog for Destructive Actions
**Priority:** High
**Files to create/modify:**
- Create: `components/admin/ConfirmDialog.tsx`
- Modify: `app/admin/workshops/[id]/RegistrationActions.tsx`
- Modify: `app/admin/camp/[id]/RegistrationActions.tsx`

**Implementation:**
```typescript
// components/admin/ConfirmDialog.tsx
'use client'

import { useState } from 'react'

interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmText?: string
  confirmStyle?: 'danger' | 'warning'
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmStyle = 'danger',
}: ConfirmDialogProps) {
  if (!isOpen) return null

  const confirmClass = confirmStyle === 'danger'
    ? 'bg-red-600 hover:bg-red-700'
    : 'bg-amber-600 hover:bg-amber-700'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">{title}</h3>
        <p className="text-slate-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm()
              onClose()
            }}
            className={`px-4 py-2 text-white rounded-lg ${confirmClass}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}
```

Then wrap status changes to "cancelled" with confirmation dialog in RegistrationActions.

**Status:** [ ] Not started

---

### 9. Add Toast Notification System
**Priority:** Medium
**Files to create/modify:**
- Install: `npm install sonner`
- Modify: `app/layout.tsx` - add Toaster
- Modify: All modal components to show toast on success

**Implementation:**
```typescript
// app/layout.tsx - add near the end
import { Toaster } from 'sonner'

// Inside the body:
<Toaster position="top-right" richColors />

// In modal components after successful action:
import { toast } from 'sonner'
toast.success('Child added successfully')
```

**Status:** [ ] Not started

---

### 10. Add Phone Field to Authorized Pickups
**Priority:** Medium
**Files to modify:**
- Create migration: `supabase/migrations/006_pickup_phone.sql`
- Modify: `components/account/AddPickupModal.tsx`
- Modify: `components/account/RegistrationCard.tsx` (display)
- Modify: `app/admin/camp/[id]/page.tsx` (display)

**Migration:**
```sql
-- 006_pickup_phone.sql
ALTER TABLE authorized_pickups
ADD COLUMN phone text,
ADD COLUMN relationship text;
```

**Status:** [ ] Not started

---

### 11. Password Confirmation for Email Change
**Priority:** High (Security)
**Files to modify:**
- `app/account/settings/page.tsx`

**Implementation:**
Add a password field that must be filled before email change is allowed. Verify with Supabase auth before proceeding.

```typescript
// Before updating email, verify current password
const { error: signInError } = await supabase.auth.signInWithPassword({
  email: currentEmail,
  password: currentPassword,
})

if (signInError) {
  setEmailError('Current password is incorrect')
  return
}

// Then proceed with email update
const { error } = await supabase.auth.updateUser({ email: newEmail })
```

**Status:** [ ] Not started

---

### 12. Add Export Route Admin Validation
**Priority:** High (Security)
**Files to modify:**
- `app/admin/workshops/export/route.ts`
- `app/admin/camp/export/route.ts`
- `app/admin/waitlist/export/route.ts`

**Option A - Email allowlist:**
```typescript
const ADMIN_EMAILS = ['jack@creativekidsmusic.org']

const { data: { user } } = await supabase.auth.getUser()
if (!user || !ADMIN_EMAILS.includes(user.email || '')) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
}
```

**Option B - Database admin table:**
```sql
CREATE TABLE admin_users (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
);
```

Then check: `SELECT 1 FROM admin_users WHERE user_id = ?`

**Status:** [ ] Not started

---

### 13. Improve Error Handling in Export Routes
**Priority:** High
**Files to modify:**
- `app/admin/workshops/export/route.ts`
- `app/admin/camp/export/route.ts`
- `app/admin/waitlist/export/route.ts`

**Implementation:**
```typescript
const { data: registrations, error } = await supabase
  .from('workshop_registrations')
  .select('...')

if (error) {
  console.error('Export error:', error)
  return NextResponse.json(
    { error: 'Failed to export data' },
    { status: 500 }
  )
}

if (!registrations || registrations.length === 0) {
  return NextResponse.json(
    { error: 'No registrations found' },
    { status: 404 }
  )
}
```

**Status:** [ ] Not started

---

## Larger Fixes (2+ hours each)

### 14. Add Pagination to Admin Tables
**Priority:** High (Scalability)
**Files to modify:**
- `app/admin/workshops/page.tsx`
- `app/admin/camp/page.tsx`
- `app/admin/waitlist/page.tsx`
- `lib/data.ts` - add paginated query functions

**Implementation approach:**
1. Add query params: `?page=1&limit=25`
2. Modify data queries to use `.range(from, to)`
3. Add pagination UI component
4. Show total count

```typescript
// lib/data.ts
export async function getWorkshopRegistrationsPaginated(
  page: number = 1,
  limit: number = 25
) {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('workshop_registrations')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  return { data, error, count, page, limit }
}
```

**Status:** [ ] Not started

---

### 15. Add Search/Filter to Admin Tables
**Priority:** High (UX)
**Files to modify:**
- `app/admin/workshops/page.tsx`
- `app/admin/camp/page.tsx`
- `app/admin/waitlist/page.tsx`

**Implementation approach:**
1. Add search input for name/email
2. Add status filter dropdown
3. Add payment status filter dropdown
4. Pass filters as query params
5. Modify data queries to filter

```typescript
// Search component
<input
  type="search"
  placeholder="Search by name or email..."
  className="..."
  onChange={(e) => router.push(`?search=${e.target.value}`)}
/>

// Filter in query
.or(`parent_name.ilike.%${search}%,parent_email.ilike.%${search}%`)
.eq('status', statusFilter)
```

**Status:** [ ] Not started

---

### 16. Add Status Transition Validation
**Priority:** Medium
**Files to modify:**
- `app/admin/workshops/[id]/actions.ts`
- `app/admin/camp/[id]/actions.ts`

**Implementation:**
```typescript
const VALID_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'waitlist', 'cancelled'],
  confirmed: ['cancelled'],
  waitlist: ['confirmed', 'cancelled'],
  cancelled: [], // Cannot transition from cancelled
}

export async function updateRegistration(...) {
  // Get current status
  const { data: current } = await supabase
    .from('workshop_registrations')
    .select('status')
    .eq('id', id)
    .single()

  if (current && status !== current.status) {
    const allowed = VALID_TRANSITIONS[current.status] || []
    if (!allowed.includes(status)) {
      return {
        error: `Cannot change status from "${current.status}" to "${status}"`
      }
    }
  }

  // Proceed with update...
}
```

**Status:** [ ] Not started

---

### 17. Add Dashboard Stats Improvements
**Priority:** Medium
**Files to modify:**
- `app/admin/page.tsx`
- `lib/data.ts` - add stats queries

**New stats to add:**
- Total revenue (sum of totals where payment_status = 'paid')
- Outstanding payments (sum where payment_status != 'paid')
- Registrations by status (pending/confirmed/cancelled counts)
- Registrations needing action (pending > 7 days old)

**Status:** [ ] Not started

---

### 18. Add Accessibility Improvements
**Priority:** Medium
**Files to modify:**
- All modal components - add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`
- All interactive elements - add `aria-label` where needed
- Focus trap in modals

**Implementation:**
```typescript
// Modal wrapper
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
  className="..."
>
  <h2 id="modal-title">{title}</h2>
  ...
</div>
```

**Status:** [ ] Not started

---

### 19. Verify/Add RLS Policies for Account Tables
**Priority:** High (Security)
**Files to check/create:**
- Check: `supabase/migrations/003_parent_accounts.sql`
- Create if missing: `supabase/migrations/007_account_rls.sql`

**Required policies:**
```sql
-- account_settings
ALTER TABLE account_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings"
  ON account_settings FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can update own settings"
  ON account_settings FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own settings"
  ON account_settings FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- account_children
ALTER TABLE account_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own children"
  ON account_children FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can manage own children"
  ON account_children FOR ALL
  USING (user_id = auth.uid());
```

**Status:** [ ] Not started

---

## Summary

| Priority | Count | Estimated Time |
|----------|-------|----------------|
| Quick fixes | 7 | 2-3 hours |
| Medium fixes | 6 | 6-8 hours |
| Larger fixes | 6 | 12-16 hours |
| **Total** | **19** | **20-27 hours** |

### Recommended Order

**Phase 1 - Security (Do First):**
1. #12 - Admin validation on exports
2. #13 - Error handling in exports
3. #19 - RLS policies verification
4. #11 - Password confirmation for email change

**Phase 2 - Quick Wins:**
5. #1 - Constants file
6. #2 - Camp updated_at
7. #3 - Loading skeletons
8. #5 - Refund policy link
9. #4 & #7 - Button colors

**Phase 3 - UX Improvements:**
10. #8 - Confirmation dialogs
11. #9 - Toast notifications
12. #10 - Pickup phone field

**Phase 4 - Scalability:**
13. #14 - Pagination
14. #15 - Search/filter
15. #17 - Dashboard stats

**Phase 5 - Polish:**
16. #16 - Status transitions
17. #18 - Accessibility
18. #6 - Logger utility
