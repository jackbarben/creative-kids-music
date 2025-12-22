# Parent Portal v2 - Quick Reference

**Full Plan**: See `parent-accounts-full-plan.md`

---

## Summary

Replace magic links with Supabase Auth parent accounts:
- Account created during registration
- Email/password or Google OAuth
- Sign waivers in account portal (before program)
- Self-service: edit info, add children, cancel

---

## Key Routes

| Route | Purpose |
|-------|---------|
| `/account` | Login or Dashboard |
| `/account/settings` | Profile, password |
| `/account/reset-password` | Password reset |

---

## Key Decisions

| Topic | Decision |
|-------|----------|
| Account creation | During registration |
| Returning parents | Inline login (same page, form stays editable) |
| Google OAuth | Save form state to sessionStorage, restore after callback (15 min expiry) |
| Waivers | **Deferred** — build account system first, add waiver signing later |
| Cancellation | Allowed before program starts. Blocked after midnight of first date. |
| Add children | To existing registration (sibling discount applies) |
| Remove children | Allowed before start, no refund after payment, recalc sibling discount |
| Email change | Self-service with verification |
| Pickups | Just collect name, details in person |
| Age range | 9-13 (strict validation) |
| Password | 8 characters minimum |
| Sibling discount | Per-family across ALL programs, recalculates when any child added/removed |
| IP logging | Required for waiver legal compliance, fallback to 'unknown' |

---

## What Parents Can Edit

**Anytime:**
- Phone, emergency contact
- Allergies, medical info
- Media consent
- Pickup names (camp)
- Email (with verification)

**Before first program date (midnight cutoff):**
- Child name/age (must be 9-13)
- Add children
- Remove children (no refund if paid)
- Cancel registration

---

## Cancellation Policy

- **Before payment**: Cancel freely
- **After payment**: No refund (can still cancel)
- **No-shows**: May request payment

---

## Waivers

**All programs**: Liability + Media Release

**Camp only**: + Medical Authorization + Pickup Names

**Enforcement**: Day-of email to admin listing unsigned waivers

---

## Email Notifications

**To Parents**: Registration confirm, cancellation confirm, child added

**To Admin**: New registration, cancellation, child added, medical info updated

**Scheduled**: Morning of program - list of unsigned waivers (7 AM PST / 8 AM PDT due to DST)

---

## Implementation Order

1. Database migration (add user_id, waiver fields, cancellation fields)
2. Account pages (login, dashboard, settings with email change)
3. Registration form updates (password, account check, Google OAuth state)
4. Portal features (edit, waivers, add/remove children, cancel, pickups)
5. Admin updates (waiver status, pickup list)
6. Scheduled jobs (Vercel cron for waiver reminders)
7. Cleanup & launch (remove magic links)
