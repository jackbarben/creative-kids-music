# Parent Accounts - Edge Cases and Test Scenarios

**Version**: 1.1.0
**Last Updated**: December 2024

---

## Account Creation

### New Parent Registration
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 1 | New email, valid password | Create auth user, create registration, auto-login | |
| 2 | New email, password too short (<8 chars) | Error: "Password must be at least 8 characters" | |
| 3 | New email, passwords don't match | Error: "Passwords don't match" | |
| 4 | New email, Google OAuth selected | Create OAuth user, create registration, auto-login | |
| 5 | Registration fails after auth user created | Show error, auth user exists but no registration | |

### Returning Parent Registration
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 6 | Existing email, correct password | Use existing account, add new registration | |
| 7 | Existing email, wrong password | Error: "Account exists. Incorrect password." | |
| 8 | Existing email, Google OAuth (same as original) | Link accounts, add registration | |
| 9 | Existing email, different OAuth provider | Error or offer to link | |
| 10 | Email exists as admin | Allow, show both admin + parent views | |

---

## Authentication

### Login
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 11 | Valid email/password | Log in, redirect to dashboard | |
| 12 | Valid email, wrong password | Error: "Invalid credentials" | |
| 13 | Non-existent email | Error: "Invalid credentials" (same as wrong password) | |
| 14 | Google OAuth, account exists | Log in via OAuth | |
| 15 | Google OAuth, no account | Show: "Register for a program to create account" | |
| 16 | Locked out (too many attempts) | Rate limited by Supabase | |

### Password Reset
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 17 | Request reset for existing email | Send reset email | |
| 18 | Request reset for non-existent email | Same success message (security) | |
| 19 | Valid reset link, new passwords match | Update password, redirect to login | |
| 20 | Expired reset link | Error: "Link expired. Request new reset." | |
| 21 | Reset link used twice | Error: "Link already used" | |

### Sessions
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 22 | Session expired (7+ days) | Redirect to login | |
| 23 | Access protected page while logged out | Redirect to login | |
| 24 | Multiple devices logged in | All work independently | |
| 25 | Logout | Clear session, redirect to login page | |

---

## Dashboard

### Loading States
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 26 | Loading registrations | Show loading spinner | |
| 27 | No registrations found | Show empty state with "View Programs" CTA | |
| 28 | Database error | Show error state with refresh button | |

### Registration Display
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 29 | Multiple workshop registrations | Show all, sorted by date | |
| 30 | Multiple camp registrations | Show all | |
| 31 | Mix of workshop + camp + waitlist | Show all in sections | |
| 32 | Cancelled registration | Show with "Cancelled" badge, edit disabled | |
| 33 | Registration with past date | Show with "Completed" badge | |

---

## Editing

### Contact Info
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 34 | Update phone number | Instant save, success message | |
| 35 | Invalid phone format | Validation error | |
| 36 | Update emergency contact | Instant save (camp only) | |
| 37 | Clear emergency contact | Error: Required field | |

### Child Info
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 38 | Update child name (before start) | Save, log to activity | |
| 39 | Update child name (after start) | Button disabled or error | |
| 40 | Update child age to invalid (<9 or >13) | Validation error: "Programs are for ages 9-13" | |
| 41 | Update allergies | Save, notify admin via email | |
| 42 | Update medical conditions | Save, notify admin | |
| 43 | Clear all medical info | Allowed, save empty | |

### Media Consent
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 44 | Change from full to limited | Instant save | |
| 45 | Change from full to none | Instant save, note about existing materials | |
| 46 | Change from none to full | Instant save | |

---

## Cancellation

### Before Payment
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 47 | Cancel before payment | Cancel freely, no penalty | |
| 48 | Cancel, then re-register | Allowed if capacity available | |

### After Payment
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 49 | Cancel after payment | Allow cancel, show "no refund" warning | |
| 50 | Cancel already-cancelled | Button not shown | |

### Special Cases
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 51 | Tuition assistance + cancel | Flag for admin review | |
| 52 | Cancel after program started | Block cancellation, show "Program has started. Contact us to discuss." | |
| 53 | Cancel on first day before event time | Block - cutoff is midnight of first program date | |
| 54 | Multi-date workshop: one date passed | Block add/edit - first date in registration determines cutoff | |
| 55 | Multi-date workshop: all dates in future | Allow add/edit normally | |
| 56 | Google OAuth user requests password reset | Show message: "This account uses Google sign-in. Use 'Continue with Google' to log in." | |

---

## Child Management

### Add Child
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 57 | Add child before start | Show new total, require payment | |
| 58 | Add child after start | Block or error | |
| 59 | Add child with medical info (camp) | Save all fields | |
| 60 | Add 4th child (sibling discount) | Apply correct discount | |

### Remove Child
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 61 | Remove child before payment | Recalculate total, update amount due | |
| 62 | Remove child after payment | Show warning: no refund, still remove | |
| 63 | Remove child after start | Block, show "contact us" | |
| 64 | Remove last child | Redirect to cancellation flow | |
| 65 | Remove one of two children | Recalculate (lose sibling discount) | |

### Cross-Program Recalculation
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 66 | Remove workshop child when camp child exists | Camp price recalculated based on new total count | |
| 67 | Add workshop child when camp child exists | Both registrations recalculated with new sibling order | |
| 68 | Cancel workshop reg, camp child becomes first | Camp total increases (loses sibling discount) | |

---

## Pickup Authorization (Camp)

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 69 | Add first pickup person | Save, meets requirement | |
| 70 | Add additional pickup | Save to list | |
| 71 | Remove pickup (leaving 1) | Allowed | |
| 72 | Remove last pickup | Error: "At least one required" | |
| 73 | Edit pickup name | Instant save | |

---

## Email Change

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 74 | Request email change | Send verification to new email | |
| 75 | New email already in use | Error: "Email already registered" | |
| 76 | Verify new email | Update auth + all registrations | |
| 77 | Verification link expires | Error, request again | |
| 78 | Google OAuth user tries to change | Block or special handling | |
| 79 | Old email no longer accessible | Still works (verify new only) | |

---

## Waivers

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 80 | Sign liability waiver | Save with IP, timestamp, version | |
| 81 | Sign media release (full) | Save preference | |
| 82 | Sign medical auth (camp) | Save with IP, timestamp, version | |
| 83 | Waiver version updated after signing | Dashboard shows "Updated waiver requires signature" | |
| 84 | Re-sign after version change | Update timestamp, IP, version | |
| 85 | Access program without signing | Dashboard warning, admin notified day-of | |

---

## Email Notifications

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 86 | Registration complete | Send confirmation + account welcome | |
| 87 | Cancellation | Send cancellation confirmation | |
| 88 | Child medical info updated | Send admin notification | |
| 89 | Password reset | Send reset link | |
| 90 | Email change | Send verification link | |
| 91 | Email verified | Send confirmation | |
| 92 | Waiver version changed | Email parents with active registrations to re-sign | |
| 93 | Child removed | Send confirmation to parent, notification to admin | |

---

## Admin Impact

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 94 | Parent edits contact | Visible in activity log | |
| 95 | Parent edits child | Visible in activity log | |
| 96 | Parent cancels | Notification email to admin | |
| 97 | Parent updates medical | Notification + alert | |
| 98 | View cancellation report | Shows all cancelled with reason | |
| 99 | View waiver status | Shows signed/not signed/needs re-sign | |
| 100 | View amount due per registration | Shows total_amount - amount_paid | |

---

## Security

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 101 | Access other parent's registration | RLS blocks, 404 or forbidden | |
| 102 | Modify other parent's data | RLS blocks | |
| 103 | SQL injection in text fields | Sanitized, no injection | |
| 104 | XSS in text fields | Sanitized, no script execution | |
| 105 | Brute force login | Rate limited by Supabase | |
| 106 | Session hijacking attempt | Secure cookies prevent | |

---

## Edge Cases

| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 107 | Two parents, one email | First owns account, second uses different | |
| 108 | Parent is also admin | Same auth, sees both views | |
| 109 | Registered, never logged in | Account exists, can reset password | |
| 110 | Very long child name | Truncated or validation error | |
| 111 | Unicode/emoji in names | Allowed (display correctly) | |
| 112 | Timezone edge case (cancel at midnight) | Use Pacific time, midnight of first program date | |
| 113 | Email case mismatch (Parent@Email.com vs parent@email.com) | Normalized to lowercase, matches correctly | |

---

## Additional Edge Cases

### Auth Provider Conflicts
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 114 | Password user tries Google OAuth (same email) | Link accounts automatically (merge into one account) | |
| 115 | Google OAuth user tries to create password | Link accounts automatically (add password method) | |

### Duplicate/Conflict Scenarios
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 116 | Register same child twice (same name/age, same program) | Warn or block duplicate | |
| 117 | Register same child in workshop AND camp | Allow - different programs | |
| 118 | Two parents try to register same child (custody situation) | Allow - no child deduplication across accounts | |

### Timing Edge Cases
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 119 | Waiver version changes between workshop dates | Require re-sign before next date | |
| 120 | Parent starts registration 11:59 PM, submits 12:01 AM | Use submission time for cutoff check | |
| 121 | Email change initiated, then program starts before verification | Complete email change anyway (not time-sensitive) | |

### Race Conditions
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 122 | Add child in two browser tabs simultaneously | One succeeds, other fails or handles gracefully | |
| 123 | Two parents register last spot simultaneously | One gets spot, other sees "full" or waitlist option | |
| 124 | Parent cancels while admin is editing | Cancel takes precedence, admin sees updated state | |

### System Failures
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 125 | Waiver reminder cron job fails | Admin alerted, manual fallback | |
| 126 | Email service (Resend) down during registration | Registration succeeds, email queued or logged | |
| 127 | IP header missing during waiver sign | Use 'unknown', log warning, don't block | |
| 128 | Database timeout during pricing recalculation | Show error, allow retry, don't corrupt data | |

### Payment Edge Cases
| # | Scenario | Expected Behavior | Status |
|---|----------|-------------------|--------|
| 129 | Admin marks partial payment, parent adds child | New total calculated, amount due = total - paid | |
| 130 | Parent pays, then removes child | No refund, show warning before removal | |
| 131 | Tuition assistance approved, parent adds child | Flag for admin review on additional amount | |

---

## Test Accounts

| Email | Purpose | Password |
|-------|---------|----------|
| jackbarben3@gmail.com | Test parent + admin | See `.env.local` or password manager |
| test-parent@example.com | Test parent only | TBD |

**Note**: Never commit test passwords to version control. Store in `.env.local` or team password manager.

---

## Status Legend

- ☐ Not tested
- ✓ Passed
- ✗ Failed
- ⏸ Blocked
- N/A Not applicable
