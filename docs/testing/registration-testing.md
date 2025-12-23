# Parent Accounts v2 - Testing Checklist

**Updated**: December 2024
**Version**: 2.0 (replaces magic link testing)

---

## Test Accounts

| Purpose | Email | Notes |
|---------|-------|-------|
| Parent + Admin | jackbarben3@gmail.com | Password: CreativeKids2025 |
| Secondary parent | (create during testing) | For multi-account scenarios |

---

## Part 1: Tests Claude Can Verify (Code Review)

These are logic/validation checks I can verify by reading the code:

| # | Check | File | Status |
|---|-------|------|--------|
| C1 | Sibling discount caps at $30 max | `app/account/actions.ts` | |
| C2 | Age validation rejects <9 and >13 | `app/account/actions.ts` | |
| C3 | Server-side program-start cutoff enforced | `app/account/actions.ts` | |
| C4 | Email normalized (lowercase/trim) on registration | `app/*/actions.ts` | |
| C5 | RLS policies block cross-user access | `003_parent_accounts.sql` | |
| C6 | Password minimum 8 characters enforced | `LoginForm.tsx`, `reset-password` | |
| C7 | User ownership verified before mutations | `app/account/actions.ts` | |
| C8 | Cancellation sets status + timestamp + reason | `app/account/actions.ts` | |
| C9 | Child removal recalculates discounts | `app/account/actions.ts` | |
| C10 | Activity log entries created for parent edits | `app/account/actions.ts` | |

---

## Part 2: Tests You Must Run Manually

### Authentication & Login

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M1 | Email/password login | Go to `/account`, enter valid credentials | Redirect to dashboard | |
| M2 | Wrong password | Enter wrong password | "Invalid credentials" error | |
| M3 | Non-existent email | Enter email not in system | "Invalid credentials" (same message) | |
| M4 | Google OAuth login | Click "Continue with Google" | OAuth flow, redirect to dashboard | |
| M5 | Google OAuth (no account) | Use Google email with no registration | Should show empty dashboard or prompt | |
| M6 | Logout | Click logout/sign out | Redirect to login, session cleared | |

### Password Reset

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M7 | Request reset (valid email) | Click "Forgot password", enter email | "Check your email" message | |
| M8 | Request reset (invalid email) | Enter non-existent email | Same success message (security) | |
| M9 | Reset email received | Check inbox | Email from Supabase within 2 min | |
| M10 | Valid reset link | Click link in email | Opens `/account/reset-password` with valid session | |
| M11 | Enter new password | Fill form, submit | "Password updated", redirect to `/account` | |
| M12 | Passwords don't match | Enter mismatched passwords | "Passwords do not match" error | |
| M13 | Password too short | Enter <8 char password | "Password must be at least 8 characters" | |
| M14 | Expired reset link | Wait 24+ hours, click link | "Invalid or expired reset link" | |
| M15 | Reset link used twice | Click same link again after reset | "Invalid or expired" or already logged in | |

### Account Settings

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M16 | Access settings | Go to `/account/settings` | Shows email + password sections | |
| M17 | Change email (request) | Enter new email, submit | "Check your new email for verification" | |
| M18 | Change email (verify) | Click link in new email | Email updated, old email notified | |
| M19 | Change email (duplicate) | Enter email already in use | "Email already registered" error | |
| M20 | Change password | Enter new password + confirm | "Password updated" success | |
| M21 | Google user - email | Check email section | Shows "managed by Google" message | |
| M22 | Google user - password | Check password section | Shows "managed by Google" message | |

### Registration with Account Creation

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M23 | New user registration | Fill form with new email | Shows password fields | |
| M24 | Create account + register | Complete form with password | Account created, registration saved, redirect | |
| M25 | Google OAuth during registration | Click Google button on form | OAuth, return to form, complete registration | |
| M26 | Returning user (email check) | Enter existing email | Shows "Welcome back" with login fields | |
| M27 | Returning user login | Enter password inline | Logs in, can complete registration | |
| M28 | Wrong password inline | Enter wrong password | Error, can retry | |
| M29 | Forgot password inline | Click "Forgot password" on form | Opens reset flow | |

### Dashboard

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M30 | View registrations | Log in, view dashboard | All registrations displayed | |
| M31 | Empty state | Log in with no registrations | Shows "Register for a program" CTA | |
| M32 | Workshop display | Check workshop registration | Shows dates, children, pricing | |
| M33 | Camp display | Check camp registration | Shows dates, children, pickups, pricing | |
| M34 | Status badges | Check various registrations | Confirmed/Pending/Cancelled/Completed badges | |
| M35 | Cancelled registration | View cancelled registration | Shows "Cancelled" badge, edit buttons disabled | |

### Edit Contact Info

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M36 | Edit phone | Click "Edit Contact Info", change phone | Saves, shows updated | |
| M37 | Edit emergency (camp) | Change emergency contact fields | Saves all fields | |
| M38 | Invalid phone format | Enter invalid phone | Validation error (if implemented) | |

### Edit Child

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M39 | Edit child name | Click Edit on child, change name | Saves, shows updated | |
| M40 | Edit child age (valid) | Change to valid age (9-13) | Saves | |
| M41 | Edit child age (invalid) | Change to 8 or 14 | "Age must be 9-13" error | |
| M42 | Edit medical info (camp) | Change allergies/conditions | Saves | |
| M43 | Edit after program started | Try to edit when program past | Button disabled or error | |

### Add Child

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M44 | Add first child | On registration with 0 children | Full price shown | |
| M45 | Add second child | Click "+ Add Child" | Shows $10 discount, new total | |
| M46 | Add third child | Add another | Shows $20 discount | |
| M47 | Add fourth child | Add another | Shows $30 discount (max) | |
| M48 | Add fifth child | Add another | Still $30 discount (capped) | |
| M49 | Invalid age on add | Enter age outside 9-13 | Validation error | |
| M50 | Add after program started | Try when program past | Button disabled or error | |

### Remove Child

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M51 | Remove child (unpaid) | Click Remove, confirm | Child removed, total recalculated | |
| M52 | Remove child (paid) | Remove when payment_status=paid | Shows "no refund" warning, still removes | |
| M53 | Discount recalculation | Remove 2nd of 3 children | 3rd child becomes 2nd, discount adjusts | |
| M54 | Remove only child | Try to remove last child | Should redirect to cancel flow or block | |
| M55 | Remove after program started | Try when program past | Button disabled or error | |

### Cancel Registration

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M56 | Cancel (unpaid) | Click Cancel, confirm | Status=cancelled, shows cancelled badge | |
| M57 | Cancel (paid) | Cancel when paid | Shows "no refund" warning, still cancels | |
| M58 | Cancel reason | Enter optional reason | Saved to cancellation_reason | |
| M59 | Cancel after started | Try when program past | Button disabled or error | |

### Authorized Pickups (Camp)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M60 | Add pickup | Click "+ Add Pickup Person", enter name | Added to list | |
| M61 | Remove pickup | Click Remove on pickup | Removed from list | |
| M62 | Multiple pickups | Add several | All displayed | |

### Pricing Display

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| M63 | Total display | View registration | Shows correct total | |
| M64 | Paid display | Check paid amount | Shows amount_paid_cents | |
| M65 | Due calculation | Check due | Shows total - paid | |
| M66 | Sibling discount note | Multi-child registration | Shows "(sibling discount applied)" | |

---

## Part 3: Email Delivery Tests (Manual)

| # | Test | Expected | Status |
|---|------|----------|--------|
| E1 | Registration confirmation | Email arrives <2 min, correct details | |
| E2 | Admin notification on registration | Admin email receives notification | |
| E3 | Password reset email | Arrives <2 min, link works | |
| E4 | Email change verification | New email receives verification link | |
| E5 | Email change notification | Old email receives "email was changed" notice | |
| E6 | Cancellation confirmation | Parent receives cancellation email | |
| E7 | Admin cancellation notification | Admin notified of cancellation | |
| E8 | Check spam folder | Emails not going to spam | |
| E9 | Gmail delivery | Test with Gmail account | |
| E10 | Outlook delivery | Test with Outlook account | |

---

## Part 4: Security Tests (Manual)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| S1 | Access other user's data | Try to view/edit registration you don't own | 404 or forbidden | |
| S2 | Direct API manipulation | Try calling actions with wrong registration_id | Blocked by RLS | |
| S3 | Session expiry | Leave tab open 7+ days, try action | Redirect to login | |
| S4 | Protected page access | Go to `/account` while logged out | Shows login form | |

---

## Part 5: Browser/Device Tests (Manual)

| # | Test | Device/Browser | Status |
|---|------|----------------|--------|
| B1 | Desktop Chrome | | |
| B2 | Desktop Firefox | | |
| B3 | Desktop Safari | | |
| B4 | iOS Safari | | |
| B5 | Android Chrome | | |
| B6 | Mobile form submission | | |

---

## Test Run Log

### Run 1
- **Date**: ___________
- **Tester**: ___________
- **Environment**: [ ] Local (localhost:4000) [ ] Production

**Issues Found**:
1.
2.
3.

**Notes**:


### Run 2
- **Date**: ___________
- **Tester**: ___________
- **Environment**: [ ] Local [ ] Production

**Issues Found**:
1.
2.
3.

**Notes**:

