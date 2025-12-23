# Creative Kids Music - Todo

Last updated: December 2024

---

## Current Status

The site is **LIVE** at creativekidsmusic.org with:
- Workshop and camp registration forms
- Parent accounts (email/password + Google OAuth)
- Admin portal for managing registrations
- Confirmation emails via Resend
- Legal terms pages (liability waiver, program terms, behavior agreement)

---

## Immediate Tasks

None currently.

---

## Before Programs Start (Spring 2026)

### Cancelled Registration Cleanup
- [ ] Add soft delete for cancelled registrations (hide after 90 days)
- [ ] Add "Show archived" toggle in admin
- [ ] Scheduled job or manual cleanup process

### Payment Integration
- [ ] Get church payment URL (currently placeholder)
- [ ] Update NEXT_PUBLIC_PAYMENT_URL in environment
- [ ] Test payment flow end-to-end

### Admin Reports
- [ ] Allergy/dietary report for camp (printable)
- [ ] Authorized pickup list report
- [ ] Emergency contact list report

### Email Reminders (Nice to Have)
- [ ] Set up Vercel Cron for scheduled emails
- [ ] Workshop reminder (1 week before)
- [ ] Camp reminder (1 week before)
- [ ] Payment reminder for unpaid registrations

---

## Future Enhancements

### Parent Portal
- [ ] Download registration confirmation (PDF)
- [ ] View upcoming schedule/dates

### Admin Portal
- [ ] Bulk status updates
- [ ] Capacity tracking and waitlist management
- [ ] Financial summary report

### New Pages
- [ ] Volunteer interest form
- [ ] Instructor recruitment page
- [ ] Support/partner page (investor pitch)

### Long Term
- [ ] Payment webhook integration
- [ ] SMS reminders (Twilio)
- [ ] Attendance tracking
- [ ] Student progress notes (music school)

---

## Completed

### December 2024
- [x] Parent accounts v2 (replaced magic links)
- [x] Account settings page
- [x] Children profiles at account level
- [x] Self-service registration management
- [x] Cancel registration flow
- [x] Media consent checkboxes
- [x] Legal terms pages
- [x] Authorized pickups
- [x] Emergency contact management
- [x] Form field styling fixes
- [x] Dietary restrictions field for camp
- [x] Sync medical info from registration to account profile
- [x] Docs reorganization and cleanup

### Earlier
- [x] Workshop registration form
- [x] Camp registration form
- [x] Waitlist form
- [x] Confirmation emails
- [x] Admin notifications
- [x] Admin dashboard
- [x] Admin registration management
- [x] CSV export
- [x] Activity logging
- [x] Site launch
