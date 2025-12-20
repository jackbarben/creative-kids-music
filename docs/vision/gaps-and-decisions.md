# Gaps Analysis & Decisions - FINAL

All decisions made. All gaps resolved. Ready to build.

---

## Decisions - RESOLVED

| Question | Answer |
|----------|--------|
| Church payment URL | **Placeholder for now** - opens in new tab, confirmation page stays open |
| Workshop capacity | **12 children** + waitlist when full |
| Summer camp capacity | **No limit** |
| Discount structure | **$10 off per child per workshop**: 1st $75, 2nd $65, 3rd $55, 4th $45... |
| Admin notification emails | **jack@creativekidsmusic.org** |
| Second admin | **Beth Femling** - elizabeth.femling@gmail.com |
| Workshop descriptions | **Placeholder** - user will provide content |
| Google OAuth for admin | **Yes** |
| Terms/waiver | **Yes** - checkbox required, PDF upload later |
| "How heard about us" | **Free text field** |
| Age validation | **Soft warn** - "Program designed for 9-13, contact us with questions" |
| Church payment notification | **Email from church** - admin manually marks as paid |
| Parent accounts | **Phase 5.5** - magic link, view/edit contact info |

---

## All Gaps - RESOLVED

### Gap 1: Terms & Conditions / Waiver
**Status:** ✅ RESOLVED

**Solution:**
- Checkbox on all registration forms: "I agree to the terms and conditions" (required)
- Link to `/terms.pdf` (placeholder file initially)
- Database fields: `terms_accepted: boolean`, `terms_accepted_at: timestamptz`
- Cannot submit without checking box

**Implementation:** Phase 5

---

### Gap 2: Workshop Waitlist
**Status:** ✅ RESOLVED

**Solution:**
- Capacity: 12 children per workshop
- When capacity reached:
  - Workshop card shows "FULL - Join Waitlist"
  - Form still works but sets `status: 'waitlist'`
  - `waitlist_position` tracks order (1, 2, 3...)
- Admin can promote waitlist → confirmed
- Email template: `workshop-waitlist.tsx` and `waitlist-promoted.tsx`

**Implementation:** Phase 5

---

### Gap 3: Parent Accounts
**Status:** ✅ RESOLVED - MOVED TO PHASE 5.5

**Solution:**
- Simple magic link flow (no password):
  1. Parent visits `/my-registrations`
  2. Enters email address
  3. Receives email with secure link (24hr expiry)
  4. Link opens dashboard showing all their registrations
- Can edit: phone, email, emergency contact
- Cannot edit: child info, workshop selection (email admin)
- Link in confirmation emails and on confirmation page

**Implementation:** Phase 5.5

---

### Gap 4: Photo/Media Release
**Status:** ✅ RESOLVED - DEFERRED

**Solution:**
- Handle with paper forms at events for now
- Future: Add checkbox "I consent to photos/videos being used for promotional purposes"

**Implementation:** Post-launch

---

### Gap 5: Returning Family Linking
**Status:** ✅ RESOLVED

**Solution:**
- Link registrations by email address
- Parent dashboard (Phase 5.5) shows all registrations for that email
- Admin can search by email to see family history
- No formal "family account" needed

**Implementation:** Automatic via email matching

---

### Gap 6: Payment Confirmation Sync
**Status:** ✅ RESOLVED

**Solution:**
- Church sends email notification when payment received
- Admin logs into our system, finds registration, clicks "Mark as Paid"
- Manual but workable at this scale
- See `/docs/vision/payment-flow.md` for full flow

**Implementation:** Phase 7

---

### Gap 7: Email Unsubscribe
**Status:** ✅ RESOLVED

**Solution:**
- All reminder emails include unsubscribe link at bottom
- Link sets `email_unsubscribed: true` on registration
- System skips sending reminders to unsubscribed
- Confirmation emails always sent (transactional, not marketing)
- Unsubscribe page: simple "You've been unsubscribed" confirmation

**Implementation:** Phase 8

---

### Gap 8: Duplicate Registration Prevention
**Status:** ✅ RESOLVED

**Solution:**
- On form submission, check: same email + same child name + same workshop?
- If match found, show warning: "It looks like [Child] is already registered for [Workshop]. Did you mean to register a different child?"
- Include checkbox: "Yes, register anyway" (allows intentional duplicates)
- Server-side check as well

**Implementation:** Phase 5

---

### Gap 9: Registration Confirmation Page
**Status:** ✅ RESOLVED

**Solution:**
- After form submission, redirect to `/registration/success?id=xxx`
- Page shows:
  - Registration summary (children, workshops, total)
  - Payment section with "Pay Now" button (opens new tab)
  - Clear instructions about payment
  - "View My Registrations" link
  - "Return to Home" button
- See `/docs/vision/payment-flow.md` for mockup

**Implementation:** Phase 5

---

### Gap 10: Form Abandonment
**Status:** ✅ RESOLVED - DEFERRED

**Solution:**
- Not critical for launch
- Future: Auto-save to localStorage, "Continue where you left off?" prompt

**Implementation:** Post-launch

---

### Gap 11: Admin User Management
**Status:** ✅ RESOLVED

**Solution:**
- Initial admins created directly in Supabase Auth dashboard:
  - jack@creativekidsmusic.org
  - elizabeth.femling@gmail.com
- Future: Admin settings page to invite new users

**Implementation:** Phase 2 (manual), future for UI

---

### Gap 12: Workshop Sold Out Display
**Status:** ✅ RESOLVED

**Solution:**
- Workshop card shows spots remaining when < 5 left: "3 spots left!"
- When full: Badge "FULL - Join Waitlist"
- Register button changes to "Join Waitlist"
- Different confirmation for waitlist vs confirmed

**Implementation:** Phase 4 (display), Phase 5 (logic)

---

### Gap 13: Age Validation
**Status:** ✅ RESOLVED

**Solution:**
- **Soft warn approach**
- If age < 9 or > 13, show yellow warning (not error):
  - "This program is designed for ages 9-13. If you have questions about whether it's right for your child, please contact us."
- Allow form submission anyway
- Server logs ages outside range for admin awareness

**Implementation:** Phase 5

---

### Gap 14: Race Condition (Capacity)
**Status:** ✅ RESOLVED

**Solution:**
- Use database transaction for capacity check + insert
- Steps:
  1. BEGIN TRANSACTION
  2. SELECT COUNT(*) from workshop_children for this workshop (with FOR UPDATE lock)
  3. If count < 12, INSERT new registration with status 'pending'
  4. If count >= 12, INSERT with status 'waitlist'
  5. COMMIT
- User never sees error, just gets waitlisted if race occurs

**Implementation:** Phase 5 (server-side)

---

### Gap 15: Timezone Display
**Status:** ✅ RESOLVED

**Solution:**
- All times stored as UTC in database
- Display as "3:30 PM PT" on all public pages
- Workshop/camp dates include explicit timezone
- Forms don't need timezone input (all events are local to Vancouver, WA)

**Implementation:** Phase 4, Phase 5

---

## External Setup Checklist

Before we can build/launch:

| Item | Status | Notes |
|------|--------|-------|
| Supabase project | ⬜ Not started | Create when ready |
| Supabase credentials | ⬜ Not started | |
| Resend account | ⬜ Not started | For transactional email |
| Domain verification (Resend) | ⬜ Not started | DNS TXT record for creativekidsmusic.org |
| Google OAuth credentials | ⬜ Not started | Google Cloud Console |
| Church payment URL | ⬜ Placeholder | Get actual URL when available |
| Terms/waiver PDF | ⬜ Not started | Upload when created |
| Workshop descriptions | ⬜ Not started | User will provide |
| Admin user: Jack | ⬜ Not started | jack@creativekidsmusic.org |
| Admin user: Beth | ⬜ Not started | elizabeth.femling@gmail.com |

---

## Questions - ALL ANSWERED

No remaining questions. Ready to build.

---

## Key Documents

| Document | Purpose |
|----------|---------|
| `/docs/vision/implementation-plan.md` | Build phases (0-10 + future) |
| `/docs/vision/payment-flow.md` | Payment UX without redirect |
| `/docs/vision/database-schema.md` | All tables and fields |
| `/docs/vision/features.md` | Feature requirements |
| `/docs/vision/pages.md` | Page content |
| `/CLAUDE.md` | Project context |
