# Parent Accounts - Implementation Plan

**Version**: 1.1.0 (planned)
**Branch**: `feature/parent-accounts`
**Status**: Ready for Implementation (Draft 4)

---

## Overview

Replace magic links with proper Supabase Auth parent accounts.

### Goals
- Account created automatically during registration
- Parents can log in anytime to manage registrations
- Waivers signed in account portal (before program starts)
- Self-service for editing, adding children, cancellation

### Non-Goals (for v1.1.0)
- Payment integration (external church payment page - January 2025)
- Mobile app

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Account creation | During registration | One flow, no separate signup |
| Returning parents | Login first (inline) | Recognize email, show password field inline (form stays editable) |
| Waivers | Sign after registration | Can register anytime, sign before program |
| Cancellation | Allowed before program starts | Blocked once program starts (midnight of first date) |
| Refunds | None after payment | Simplifies everything |
| Add children | To existing registration | With sibling discount recalculation |
| Edit cutoff | First date of registration | For multi-date workshops, blocked once any date starts |
| Email change | Self-service with verification | Verify new email before switching |
| Pickups | Required for camp | Just collect a name, handle details in person |
| Age range | 9-13 (strict) | Match program ages; reject outside range |
| Waiver versions | Require re-sign on change | Flag existing registrations when version updates |
| Waitlist accounts | No | Waitlist stays email-only until they register |
| Password | 8 characters minimum | Supabase default, keep simple |

---

## User Flows

### Flow 1: New Parent Registration

```
1. Parent visits /workshops/register or /summer-camp/register
2. Fills out form: name, email, phone, children
3. System checks: Does email exist in Supabase Auth?
   └── NO: Continue form
       - Show password fields (password + confirm)
       - Show Google OAuth option
4. Submit form
5. System creates:
   - Supabase Auth user (email/password or Google)
   - Registration record
   - Child records
6. Confirmation email sent
7. Redirect to /account with success message
8. Dashboard shows: "Sign waivers before [program date]"
```

**Google OAuth Note**: If parent clicks "Continue with Google":
1. Save form state to sessionStorage before redirect
2. OAuth redirects to Google, then back to `/auth/callback`
3. Callback checks sessionStorage for pending registration
4. If found, redirect back to registration form with data restored
5. Form detects logged-in user, completes registration automatically

### Flow 2: Returning Parent Registration

```
1. Parent visits registration page
2. Enters email (check happens on blur or submit)
3. System checks: Does email exist in Supabase Auth?
   └── YES: Show inline message (not a redirect!)
       ┌────────────────────────────────────────────────────┐
       │ Welcome back! You already have an account.         │
       │                                                    │
       │ Password: [____________]  [Forgot password?]       │
       │                                                    │
       │ ─── OR ───                                         │
       │                                                    │
       │ [Continue with Google]                             │
       └────────────────────────────────────────────────────┘
4. Parent enters password (or clicks Google) inline
5. On successful auth, form continues with pre-filled parent info
6. Complete registration (password fields hidden since logged in)
7. New registration added to their account
```

**UX Note**: Keep parent on the same page. Don't redirect away - it's confusing and loses form context. The password prompt appears inline where the "create password" fields would have been. The rest of the form (children, phone, etc.) remains editable during login - data entered will be used for the new registration after successful authentication.

### Flow 3: Sign Waivers

```
1. Parent logs into /account
2. Dashboard shows registration with warning:
   "⚠️ Waivers required before February 20"
3. Click "Sign Waivers"
4. Modal or page shows:
   - Liability Waiver text → checkbox "I agree"
   - Media Release options → radio: full/limited/none
   - (Camp only) Medical Authorization → checkbox "I agree"
5. Submit
6. System records:
   - accepted: true
   - accepted_at: timestamp
   - accepted_ip: IP address
   - version: "1.0"
7. Dashboard updates: "✓ Waivers signed"
```

### Flow 4: Edit Registration

```
1. Parent logs into /account
2. Views registration card
3. Can edit (anytime):
   - Phone number
   - Emergency contact (camp)
   - Allergies, medical conditions, special needs
   - Media consent preference
   - Pickup list (camp)
4. Can edit (before program starts):
   - Child name/age
   - Add additional children
5. Changes saved, logged to activity_log
```

### Flow 5: Add Child to Existing Registration

```
1. From registration card, click "Add Child"
2. Modal shows:
   - Current: 2 children, $140 total ($75 + $65)
   - New child form: name, age, (camp: medical info)
   - New total: $205 ($75 + $65 + $65 — each additional child is $10 off)
   - Additional due: $65
3. Submit
4. Child added to registration
5. Total updated
6. Admin notified (for payment tracking)
```

**Pricing Calculation** (Per-Family Sibling Discount):
```
Base price per child: $75 (workshop) or $400 (camp)
Sibling discount: $10 off per additional child ACROSS ALL PROGRAMS

The discount is per-family, not per-registration. We count all active
children for this parent across workshops and camp.

Examples:
- 1 child (workshop only):  $75
- 2 children (both workshop): $75 + $65 = $140
- 2 kids in workshop, then add 1 to camp:
  - Camp child is the 3rd child overall → $400 - $10 = $390

CROSS-PROGRAM RECALCULATION:
When a child is added or removed from ANY registration, ALL registrations
for that parent are recalculated. This ensures sibling discounts stay accurate.

Example: Parent has 2 kids in workshop ($140) + 1 in camp ($390 = 3rd child discount)
- Parent removes 1 workshop child
- Workshop recalculates: 1 child = $75
- Camp recalculates: now 2nd child overall = $400 - $10 = $390 (no change)
- But if parent removes BOTH workshop children:
  - Camp child becomes 1st child = $400 (loses discount)

Implementation:
1. On any child add/remove, query ALL active children for this parent
2. Sort by registration created_at to determine order
3. First child = full price, subsequent = $10 off each
4. Update total_amount on ALL affected registrations
5. Log changes to activity_log
```

### Flow 6: Cancel Registration

```
1. From registration card, click "Cancel Registration"
2. Modal shows:
   - Registration details
   - If NOT paid: "You can cancel with no penalty."
   - If paid: "⚠️ Payment has been received. No refund available."
   - Reason dropdown (optional)
   - Confirmation checkbox
3. Confirm cancellation
4. System:
   - Sets status to 'cancelled'
   - Sets cancelled_at timestamp
   - Logs to activity_log
   - Sends confirmation email to parent
   - Notifies admin
5. Registration shows as "Cancelled" in dashboard
```

### Flow 7: Login / Password Reset

```
Login (/account):
- Email + password
- Or Google OAuth
- "Forgot password?" link

Password Reset:
1. Enter email
2. Supabase sends reset link
3. Click link → /account/reset-password
4. Enter new password
5. Redirect to /account
```

### Flow 8: Change Email

```
1. Parent goes to /account/settings
2. Clicks "Change Email"
3. Enters new email address
4. System checks: Is new email already in use?
   └── YES: Error "This email is already registered"
   └── NO: Continue
5. Verification email sent to NEW address
6. Parent clicks verification link
7. System updates:
   - Supabase Auth email
   - All registration records (parent_email)
   - Activity log entry
8. Confirmation shown, old email notified
```

**Security Notes**:
- Verification required on new email (prevents hijacking)
- Old email receives notification of change
- Google OAuth users: email tied to Google account, show "managed by Google" message

### Flow 9: Remove Child from Registration

```
1. From registration card, click child's "Remove" button
2. Modal shows:
   - Child name being removed
   - Current total and new total after removal
   - If NOT paid: "Your total will be updated."
   - If paid: "⚠️ No refund will be issued for this change."
3. Confirm removal
4. System:
   - Deletes child record
   - Recalculates total (adjusts sibling discount)
   - Logs to activity_log
   - If last child: redirect to cancellation flow instead
5. Registration card updates with new total
```

**Pricing Recalculation**:
```
After removing a child, sibling discount is recalculated:
- 3 children → 2 children: lose one $10 discount
- 2 children → 1 child: lose sibling discount entirely

Example (workshop):
- Before: 3 children = $205 ($75 + $65 + $65)
- Remove one: 2 children = $140 ($75 + $65)
- Amount due reduced by $65 (if unpaid)
- No refund issued (if already paid)
```

---

## Cancellation Policy (Simplified)

**Before payment**: Cancel anytime, no penalty

**After payment**: No refund. Can still cancel if parent chooses (frees up spot).

**No-shows**: We reserve the right to request payment from no-shows who did not cancel.

This eliminates all refund calculation logic. Status options:
- `confirmed` - Active registration
- `cancelled` - Parent cancelled
- `no_show` - Did not attend, did not cancel (admin sets this)

---

## Waiver Requirements

**Note**: Waiver functionality is deferred. Build the account system first, add waiver signing later. Policy text in `docs/policies/` are early drafts pending legal review — do not implement waiver UI until final language is approved.

### All Programs
| Document | Required | Options |
|----------|----------|---------|
| Liability Waiver | Yes | Accept or can't attend |
| Media Release | Yes | Full / Limited / None |

### Camp Only (Additional)
| Document | Required | Notes |
|----------|----------|-------|
| Medical Authorization | Yes | Emergency treatment consent |
| Authorized Pickups | Yes | At least 1 name (details collected in person) |

### Storage (Per Registration)

```
liability_accepted: boolean
liability_accepted_at: timestamp
liability_accepted_ip: string
liability_version: string (e.g., "1.0")

media_consent: 'full' | 'limited' | 'none'
media_consent_at: timestamp
media_consent_ip: string
media_version: string

-- Camp only
medical_auth_accepted: boolean
medical_auth_accepted_at: timestamp
medical_auth_accepted_ip: string
medical_auth_version: string
```

### Enforcement

- Dashboard shows warning if waivers not signed
- Admin can view waiver status per registration
- **Day-of reminder email**: System sends admin an email morning of each program listing any registrations with unsigned waivers
- Admin collects signature in person if parent arrives without signing online

---

## Database Schema Changes

### Modify: workshop_registrations

```sql
ALTER TABLE workshop_registrations ADD COLUMN
  -- Link to auth user (nullable for migration, required going forward)
  user_id UUID REFERENCES auth.users(id),
  -- Pricing (in cents)
  total_amount INTEGER NOT NULL DEFAULT 0,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  -- Waivers
  liability_accepted BOOLEAN DEFAULT false,
  liability_accepted_at TIMESTAMPTZ,
  liability_accepted_ip TEXT,
  liability_version VARCHAR(10),
  media_consent VARCHAR(20), -- 'full', 'limited', 'none'
  media_consent_at TIMESTAMPTZ,
  media_consent_ip TEXT,
  media_version VARCHAR(10),
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  -- Optimistic locking for race condition prevention
  version INTEGER NOT NULL DEFAULT 1;

-- Index for user lookups
CREATE INDEX idx_workshop_reg_user ON workshop_registrations(user_id);
```

### Modify: camp_registrations

```sql
ALTER TABLE camp_registrations ADD COLUMN
  -- Link to auth user
  user_id UUID REFERENCES auth.users(id),
  -- Pricing (in cents)
  total_amount INTEGER NOT NULL DEFAULT 0,
  amount_paid INTEGER NOT NULL DEFAULT 0,
  -- Waivers (same as workshop)
  liability_accepted BOOLEAN DEFAULT false,
  liability_accepted_at TIMESTAMPTZ,
  liability_accepted_ip TEXT,
  liability_version VARCHAR(10),
  media_consent VARCHAR(20),
  media_consent_at TIMESTAMPTZ,
  media_consent_ip TEXT,
  media_version VARCHAR(10),
  -- Medical (camp only)
  medical_auth_accepted BOOLEAN DEFAULT false,
  medical_auth_accepted_at TIMESTAMPTZ,
  medical_auth_accepted_ip TEXT,
  medical_auth_version VARCHAR(10),
  -- Cancellation
  cancelled_at TIMESTAMPTZ,
  cancellation_reason TEXT,
  -- Optimistic locking for race condition prevention
  version INTEGER NOT NULL DEFAULT 1;

-- Index for user lookups
CREATE INDEX idx_camp_reg_user ON camp_registrations(user_id);
```

### New Table: authorized_pickups

```sql
CREATE TABLE authorized_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  camp_registration_id UUID NOT NULL REFERENCES camp_registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,  -- Just the name, we'll get details in person
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_pickups_registration ON authorized_pickups(camp_registration_id);
```

**Note**: We only collect the name online. Phone, relationship, and ID verification happen in person at pickup.

### RPC Function: Get All Children for Parent

Used for cross-program sibling discount calculation:

```sql
CREATE OR REPLACE FUNCTION get_all_children_for_parent(p_user_id UUID)
RETURNS TABLE (
  id UUID,
  registration_id UUID,
  program_type TEXT,
  child_name TEXT,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  -- Workshop children
  SELECT
    wc.id,
    wc.registration_id,
    'workshop'::TEXT as program_type,
    wc.child_name,
    wc.created_at
  FROM workshop_children wc
  JOIN workshop_registrations wr ON wc.registration_id = wr.id
  WHERE wr.user_id = p_user_id
    AND wr.status != 'cancelled'

  UNION ALL

  -- Camp children
  SELECT
    cc.id,
    cc.registration_id,
    'camp'::TEXT as program_type,
    cc.child_name,
    cc.created_at
  FROM camp_children cc
  JOIN camp_registrations cr ON cc.registration_id = cr.id
  WHERE cr.user_id = p_user_id
    AND cr.status != 'cancelled'

  ORDER BY created_at ASC;  -- First registered = first child (full price)
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Indexes

```sql
CREATE INDEX idx_workshop_reg_email ON workshop_registrations(parent_email);
CREATE INDEX idx_camp_reg_email ON camp_registrations(parent_email);
```

---

## RLS Policies

Parents access their data via user_id:

```sql
-- Helper function to check ownership
CREATE OR REPLACE FUNCTION is_owner(reg_user_id UUID, reg_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Match by user_id
  IF reg_user_id IS NOT NULL AND reg_user_id = auth.uid() THEN
    RETURN TRUE;
  END IF;
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Parents read own workshop registrations
CREATE POLICY "parents_read_own_workshops"
ON workshop_registrations FOR SELECT
USING (is_owner(user_id, parent_email));

-- Parents update own workshop registrations
CREATE POLICY "parents_update_own_workshops"
ON workshop_registrations FOR UPDATE
USING (is_owner(user_id, parent_email));

-- Parents read own children
CREATE POLICY "parents_read_own_workshop_children"
ON workshop_children FOR SELECT
USING (
  registration_id IN (
    SELECT id FROM workshop_registrations
    WHERE is_owner(user_id, parent_email)
  )
);

-- Parents update own children
CREATE POLICY "parents_update_own_workshop_children"
ON workshop_children FOR UPDATE
USING (
  registration_id IN (
    SELECT id FROM workshop_registrations
    WHERE is_owner(user_id, parent_email)
  )
);

-- Parents can DELETE children (for remove child feature)
CREATE POLICY "parents_delete_own_workshop_children"
ON workshop_children FOR DELETE
USING (
  registration_id IN (
    SELECT id FROM workshop_registrations
    WHERE is_owner(user_id, parent_email)
  )
);

-- Parents can INSERT children (for add child feature)
CREATE POLICY "parents_insert_own_workshop_children"
ON workshop_children FOR INSERT
WITH CHECK (
  registration_id IN (
    SELECT id FROM workshop_registrations
    WHERE is_owner(user_id, parent_email)
  )
);

-- Similar policies for camp_registrations, camp_children

-- Parents manage own pickups (all operations)
CREATE POLICY "parents_manage_pickups"
ON authorized_pickups FOR ALL
USING (
  camp_registration_id IN (
    SELECT id FROM camp_registrations
    WHERE is_owner(user_id, parent_email)
  )
);
```

**Notes**:
- Admins use service role key (bypasses RLS)
- **Email normalization**: Always store `parent_email` as lowercase. In registration actions:
  ```typescript
  parent_email: formData.email.toLowerCase().trim()
  ```

---

## Route Structure

### New Routes

| Route | Purpose |
|-------|---------|
| `/account` | Login form (if not auth) or Dashboard (if auth) |
| `/account/settings` | Profile settings, password change |
| `/account/reset-password` | Password reset handler |

### Modified Routes

| Route | Change |
|-------|--------|
| `/workshops/register` | Add: check for existing account, password fields |
| `/summer-camp/register` | Same + pickup list during registration |
| Header | Add "Account" link when logged in |

### Removed Routes (cleanup phase)

| Route | Notes |
|-------|-------|
| `/my-registrations` | Magic link entry |
| `/my-registrations/[token]` | Magic link portal |

---

## Files to Create

```
app/account/
  page.tsx              # Login or dashboard
  layout.tsx            # Auth wrapper
  settings/page.tsx     # Profile settings (includes email change)
  reset-password/page.tsx
  verify-email/page.tsx # Email change verification handler
  actions.ts            # Server actions

app/api/cron/
  waiver-reminder/route.ts  # Day-of waiver check

components/account/
  LoginForm.tsx
  RegistrationCard.tsx  # Different from admin version
  WaiverSigningModal.tsx
  EditChildModal.tsx
  EditContactModal.tsx
  AddChildModal.tsx
  RemoveChildModal.tsx  # NEW: remove child with recalculation
  CancelModal.tsx
  PickupManager.tsx     # Camp only
  ChangeEmailForm.tsx   # NEW: email change flow
```

## Files to Modify

```
app/workshops/register/
  page.tsx              # Add password section, account check
  actions.ts            # Create auth user during registration

app/summer-camp/register/
  page.tsx              # Same + pickup collection
  actions.ts            # Same

components/Header.tsx   # Add Account link
```

## Files to Remove (Phase 4)

```
app/my-registrations/   # Entire directory
app/api/magic-link/     # If exists
```

---

## Implementation Phases

### Phase 1: Database
- [ ] Write migration for new columns
- [ ] Write migration for authorized_pickups table
- [ ] Write RLS policies
- [ ] Test on local/staging

### Phase 2: Account Pages
- [ ] Create /account login/dashboard
- [ ] Create /account/settings
- [ ] Create password reset flow
- [ ] Test auth flows

### Phase 3: Registration Form Updates
- [ ] Add "account exists" check on email entry
- [ ] Add password fields for new accounts
- [ ] Add Google OAuth option
- [ ] Show inline login for returning parents (same page, not redirect)
- [ ] Update registration actions to create auth users

### Phase 4: Account Portal Features
- [ ] View registrations
- [ ] Waiver signing modal
- [ ] Edit contact info
- [ ] Edit children
- [ ] Add child to registration
- [ ] Remove child from registration
- [ ] Cancel registration
- [ ] Pickup management (camp)
- [ ] Change email (settings page)

### Phase 5: Admin Updates
- [ ] Show waiver status on registration detail
- [ ] Show cancellation info
- [ ] Print pickup list for camp

### Phase 6: Scheduled Jobs & Cron
- [ ] Create waiver reminder cron endpoint
- [ ] Configure Vercel cron in vercel.json
- [ ] Add CRON_SECRET to Vercel env vars
- [ ] Test cron job manually

### Phase 7: Cleanup & Launch
- [ ] Remove magic link routes and table
- [ ] Update CLAUDE.md
- [ ] Update database.types.ts
- [ ] Tag v1.1.0

---

## Email Notifications

### To Parents

| Event | Email |
|-------|-------|
| Registration complete | Confirmation with details, "Sign waivers before [date]" reminder |
| Account created | Welcome email with login instructions |
| Password reset | Reset link (Supabase handles this) |
| Registration cancelled | Cancellation confirmation |
| Child added | Confirmation with updated total |
| Child removed | Confirmation with updated total (if unpaid) or "no refund" note (if paid) |

### To Admin

| Event | Email |
|-------|-------|
| New registration | Same as today |
| Cancellation | "[Parent] cancelled [Program] registration" |
| Child added | "[Parent] added child to [Program] - additional amount due" |
| Child removed | "[Parent] removed child from [Program]" |
| Medical info updated | Alert: "[Parent] updated medical info for [Child]" |

### Scheduled Emails

| Email | When | Content |
|-------|------|---------|
| Waiver reminder | Morning of program day | List of registrations with unsigned waivers |

**Implementation**: Use Vercel Cron or similar to trigger the day-of waiver check. Query for registrations where:
- Program date = today
- `liability_accepted = false`

Send single email to admin with list of names.

---

## Edge Cases

### Account Issues

| Scenario | Handling |
|----------|----------|
| Email typo during registration | Standard "verify your email" or let them re-register |
| Forgot password | Standard reset flow |
| Google OAuth user tries password login | "This account uses Google. Click 'Continue with Google'" |
| Password user tries Google OAuth | Link accounts automatically (merge into one account with both methods) |
| Parent + admin same email | Works fine - show both views based on context |

### Registration Issues

| Scenario | Handling |
|----------|----------|
| Cancel then want to re-register | Allowed if capacity available |
| Add child after program started | Block - "Program has started" |
| Remove child before program starts | Allowed - recalculate total, no refund if paid |
| Remove child after program started | Block - "Contact us" |
| Remove last child from registration | Redirect to cancellation flow |

### Waiver Issues

| Scenario | Handling |
|----------|----------|
| Program tomorrow, waivers not signed | Dashboard warning, admin must check |
| Parent changes media consent later | Allowed - update media_consent fields |
| Waiver version changes after signed | Require re-sign before next program. Flag in dashboard: "Updated waiver requires signature" |

---

## Security Notes

- Passwords: Min 8 chars, hashed by Supabase
- Sessions: Supabase handles via secure tokens, configurable expiry
- RLS: user_id matching (primary) with email fallback for migration
- IP logging: For waiver legal compliance (see below)
- All edits logged to activity_log
- CSRF: Next.js server actions have built-in CSRF protection

---

## Technical Implementation Details

### Error Recovery: Partial Registration Failure

If registration creation fails after auth user is created:

```typescript
// In registration server action
try {
  // 1. Create auth user
  const { data: authUser, error: authError } = await supabase.auth.signUp({...});
  if (authError) throw authError;

  // 2. Create registration (in transaction if possible)
  const { error: regError } = await supabase
    .from('workshop_registrations')
    .insert({...});

  if (regError) {
    // Registration failed - but auth user exists
    // DON'T delete the auth user - let them retry
    // Instead, detect this state on next attempt
    throw new Error('Registration failed. Please try again.');
  }
} catch (error) {
  // Handle gracefully
}
```

**On Retry**: When user tries to register again with same email:
1. Detect: email exists in auth, no registration found
2. Show: "Your account exists. Complete your registration below."
3. Use existing auth user, create registration

### Google OAuth State Restoration

```typescript
// Before OAuth redirect
const formState = {
  parentName: form.parentName,
  parentPhone: form.parentPhone,
  children: form.children,
  workshopIds: form.workshopIds,
  timestamp: Date.now()
};

// Use sessionStorage (more appropriate than localStorage)
sessionStorage.setItem('pendingRegistration', JSON.stringify(formState));

// After OAuth callback
const pending = sessionStorage.getItem('pendingRegistration');
if (pending) {
  const state = JSON.parse(pending);
  // Check if expired (15 min max)
  if (Date.now() - state.timestamp > 15 * 60 * 1000) {
    sessionStorage.removeItem('pendingRegistration');
    // Show message: "Session expired, please start again"
  } else {
    // Restore form and continue
  }
}
```

**Fallback for Private Browsing**: If sessionStorage fails, show message: "Please complete registration in one session. Private browsing may not support Google sign-in during registration."

### Vercel Cron: Waiver Reminder Emails

Create API route at `app/api/cron/waiver-reminder/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Verify cron secret (set in Vercel env)
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Find registrations for today with unsigned waivers
  const today = new Date().toISOString().split('T')[0];
  const unsigned: Array<{ parent_name: string; parent_email: string; program: string }> = [];

  // Check workshops
  const { data: workshops } = await supabase
    .from('workshops')
    .select('id')
    .eq('date', today);

  if (workshops?.length) {
    const { data: workshopUnsigned } = await supabase
      .from('workshop_registrations')
      .select('parent_name, parent_email')
      .overlaps('workshop_ids', workshops.map(w => w.id))
      .eq('liability_accepted', false)
      .neq('status', 'cancelled');

    workshopUnsigned?.forEach(r => unsigned.push({ ...r, program: 'Workshop' }));
  }

  // Check camp (if today is a camp day)
  const { data: camp } = await supabase
    .from('camp_registrations')
    .select('parent_name, parent_email')
    .eq('liability_accepted', false)
    .neq('status', 'cancelled');

  // Only include camp if today falls within camp dates (June 22-27)
  // This is simplified - in production, query camp dates from a config table
  const campStart = '2026-06-22';
  const campEnd = '2026-06-27';
  if (today >= campStart && today <= campEnd && camp?.length) {
    camp.forEach(r => unsigned.push({ ...r, program: 'Summer Camp' }));
  }

  if (unsigned.length > 0) {
    await sendAdminEmail({
      subject: `⚠️ ${unsigned.length} unsigned waivers for today`,
      body: formatWaiverList(unsigned)
    });
  }

  return NextResponse.json({ checked: unsigned.length });
}
```

Add to `vercel.json`:
```json
{
  "crons": [
    {
      "path": "/api/cron/waiver-reminder",
      "schedule": "0 15 * * *"
    }
  ]
}
```

**Note**: Schedule is 15:00 UTC (3 PM UTC), which is 7 AM PST / 8 AM PDT. Since cron can't handle DST, the email arrives at 7 AM in winter and 8 AM in summer - close enough for a morning reminder.

### IP Address Logging

```typescript
// In server action or API route
function getClientIP(request: NextRequest): string {
  // Vercel provides the real IP in this header
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    // Take first IP (client), not proxies
    return forwardedFor.split(',')[0].trim();
  }
  // Fallback
  return request.headers.get('x-real-ip') || 'unknown';
}

// When signing waiver
await supabase
  .from('workshop_registrations')
  .update({
    liability_accepted: true,
    liability_accepted_at: new Date().toISOString(),
    liability_accepted_ip: getClientIP(request),
    liability_version: '1.0'
  })
  .eq('id', registrationId);
```

### Date Cutoffs: "Before Program Starts"

Use **midnight Pacific time** on the program date as the cutoff:

```typescript
function isProgramStarted(programDate: string): boolean {
  // programDate is 'YYYY-MM-DD'
  // Use Intl to handle PST/PDT automatically
  const now = new Date();
  const cutoff = new Date(
    new Date(programDate + 'T00:00:00').toLocaleString('en-US', {
      timeZone: 'America/Los_Angeles'
    })
  );
  return now >= cutoff;
}

// Alternative: use a library like date-fns-tz for cleaner handling
// import { zonedTimeToUtc } from 'date-fns-tz';
// const cutoff = zonedTimeToUtc(programDate + ' 00:00:00', 'America/Los_Angeles');

// For camp, use first day (June 22)
// For workshops, use the earliest date in the registration's workshop_ids
```

**UI enforcement**:
- Disable "Edit Child" and "Add Child" buttons when `isProgramStarted()` returns true
- Show tooltip: "Changes not allowed after program starts"

### Waiver Version Checking

Compare signed version to current version at runtime (no extra schema needed):

```typescript
// lib/waivers.ts
export const CURRENT_WAIVER_VERSIONS = {
  liability: '1.0',
  media: '1.0',
  medical: '1.0',  // camp only
} as const;

export function needsWaiverResign(registration: Registration): boolean {
  // Check if any waiver is unsigned or outdated
  if (!registration.liability_accepted) return true;
  if (registration.liability_version !== CURRENT_WAIVER_VERSIONS.liability) return true;

  // Media consent is always required (but any choice is valid)
  if (!registration.media_consent) return true;
  if (registration.media_version !== CURRENT_WAIVER_VERSIONS.media) return true;

  // Camp only: medical auth
  if (registration.program_type === 'camp') {
    if (!registration.medical_auth_accepted) return true;
    if (registration.medical_auth_version !== CURRENT_WAIVER_VERSIONS.medical) return true;
  }

  return false;
}

// Usage in dashboard
const needsResign = needsWaiverResign(registration);
// Show: "⚠️ Updated waiver requires your signature" if true
```

**When version changes:**
1. Update `CURRENT_WAIVER_VERSIONS` constant
2. All parents with older versions will see re-sign prompt on next login
3. Optional: Send email notification to affected parents (manual or via admin action)

### Pricing Recalculation Helper

Recalculate all registration totals for a parent when children change:

```typescript
// lib/pricing.ts
const WORKSHOP_PRICE = 7500;  // $75 in cents
const CAMP_PRICE = 40000;     // $400 in cents
const SIBLING_DISCOUNT = 1000; // $10 in cents

interface ChildWithProgram {
  id: string;
  registration_id: string;
  program_type: 'workshop' | 'camp';
  created_at: string;
}

export async function recalculateParentPricing(userId: string) {
  // 1. Get all active children for this parent, sorted by creation
  const { data: children } = await supabase
    .rpc('get_all_children_for_parent', { p_user_id: userId });

  // 2. Group children by registration
  const byRegistration = new Map<string, { type: 'workshop' | 'camp'; count: number }>();

  children.forEach((child, index) => {
    const reg = byRegistration.get(child.registration_id) || {
      type: child.program_type,
      count: 0
    };
    reg.count++;
    byRegistration.set(child.registration_id, reg);
  });

  // 3. Calculate totals with sibling discount
  let childIndex = 0;
  for (const [regId, reg] of byRegistration) {
    const basePrice = reg.type === 'camp' ? CAMP_PRICE : WORKSHOP_PRICE;
    let total = 0;

    for (let i = 0; i < reg.count; i++) {
      const discount = childIndex > 0 ? SIBLING_DISCOUNT : 0;
      total += basePrice - discount;
      childIndex++;
    }

    // 4. Update registration
    const table = reg.type === 'camp' ? 'camp_registrations' : 'workshop_registrations';
    await supabase.from(table).update({ total_amount: total }).eq('id', regId);
  }
}
```

**Call this function after:**
- Adding a child to any registration
- Removing a child from any registration
- Cancelling a registration (to recalculate remaining registrations)

**Race Condition Handling:**
Use optimistic locking to prevent incorrect pricing when parent makes simultaneous changes (e.g., two browser tabs):

```typescript
// Add a version column to registrations for optimistic locking
// In migration: ALTER TABLE workshop_registrations ADD COLUMN version INTEGER DEFAULT 1;

async function recalculateWithLocking(userId: string, expectedVersion: number) {
  const { data, error } = await supabase
    .from('workshop_registrations')
    .update({
      total_amount: newTotal,
      version: expectedVersion + 1
    })
    .eq('user_id', userId)
    .eq('version', expectedVersion);  // Only succeeds if version matches

  if (error || data.length === 0) {
    // Version mismatch - another update happened
    throw new Error('Registration was modified. Please refresh and try again.');
  }
}
```

Alternatively, wrap the entire add/remove child operation in a Supabase transaction using `rpc` with a PL/pgSQL function that handles locking internally.

---

## Decisions Made

1. **Capacity tracking**: Allow over-registration. Admin manages manually. No blocking when full.

2. **Tuition assistance + add child**: Tuition assistance is a "holding pattern" - any registration requesting it needs manual admin approval. Adding a child continues this pattern (admin handles total).

3. **Payment status**: Stored in schema (`total_amount`, `amount_paid`). Admin updates `amount_paid` manually. `amount_due = total_amount - amount_paid`.

4. **Waiver signing in person**: Always done online. Parent can use phone/tablet at event. No admin override needed.

5. **Sibling discounts**: Per-family across all programs with cross-program recalculation. If a parent has 2 kids in workshops and 1 in camp, the 3rd child gets the sibling discount for camp. When a child is added or removed from ANY registration, ALL registrations are recalculated. Prices can go up or down based on total family child count.

6. **Waiver versioning**: Compare signed version to current version at runtime. No extra schema column needed. When version constant is updated, affected parents see re-sign prompt on next login.

7. **Admin create registrations**: No - all registrations done by parent online.

8. **Magic link migration**: Not needed - no existing magic link users.

---

## Version History

| Version | Description |
|---------|-------------|
| Draft 1 | Initial comprehensive plan |
| Draft 2 | Simplified: removed refund calc, email change, deferred complexity |
| Draft 3 | Added waiver reminder emails, simplified pickups (name only), clarified UX for returning parents and Google OAuth |
| Draft 4 | Added: email change flow, remove child flow, user_id FK with migration strategy, per-family sibling discounts, technical implementation details (error recovery, OAuth state, cron, IP logging). Resolved all open questions. |
