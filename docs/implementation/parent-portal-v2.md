# Parent Portal v2 - Quick Reference

**Status**: Implemented (2025-12-22)

**Full Plan**: See `parent-accounts-full-plan.md`

---

## Summary

Replaced magic links with Supabase Auth parent accounts:
- Account created during registration (inline)
- Email/password or Google OAuth
- Self-service: edit info, add/remove children, cancel
- Waivers: **Deferred** - to be added later

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

## Implementation Status

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Database migration (user_id, cancellation, pickups) | Complete |
| 2 | Account pages (login, dashboard, settings) | Complete |
| 3 | Registration form updates (inline account creation) | Complete |
| 4 | Portal features (edit, add/remove children, cancel, pickups) | Complete |
| 5 | Admin updates (cancellation info, pickup list) | Complete |
| 6 | Cleanup (remove magic links) | Complete |

**Deferred:**
- Waiver signing (pending legal review of waiver text)
- Scheduled waiver reminder emails (no Vercel cron set up yet)
