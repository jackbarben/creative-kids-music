# Creative Kids Music - Website Features Todo

Last updated: December 2024

See also: `external-operations.md` for non-website items

---

## Registration Form Enhancements

### Media Release (All Programs)
- [ ] Add media release consent checkbox to workshop registration
- [ ] Add media release consent checkbox to camp registration
- [ ] Store consent in database (new column or separate table)
- [ ] Admin can view consent status

### Camp Registration Additions
- [ ] Allergy/dietary info field (per child)
- [ ] Authorized pickup list (names + phone numbers)
- [ ] Notification email to admin includes allergy info

### Notification Emails
- [ ] Email admin when allergy info is submitted
- [ ] Email admin when media release is declined (flag for follow-up)

---

## Parent Portal Expansion

### Current Features
- [x] Magic link access
- [x] View all registrations
- [x] Edit contact info (phone, emergency contact)

### Proposed Additions
- [ ] Cancel/withdraw registration (request or direct)
- [ ] Edit child info (name spelling, age correction)
- [ ] View payment status and amount due
- [ ] Update allergy/medical info
- [ ] Update authorized pickup list
- [ ] Download registration confirmation (PDF?)
- [ ] View upcoming dates/schedule
- [ ] Communication preferences (email frequency)

---

## New Public Pages

### Policies Page
- [ ] Cancellation/refund policy
- [ ] Weather/emergency policy
- [ ] Media usage policy (how photos/videos are used)
- [ ] Late pickup policy

### Volunteer Interest Form
- [ ] Simple form: name, email, phone, interests
- [ ] Admin notification on submission
- [ ] Store in database for follow-up
- [ ] Thank you confirmation email

### Instructor Recruitment Page
- [ ] About teaching at Creative Kids
- [ ] What we're looking for
- [ ] Application form (name, email, experience, instrument)
- [ ] Admin notification
- [ ] Confirmation email

---

## Investor/Donor Page (Discussion Needed)

### If Non-Profit Route
- [ ] Mission and impact page
- [ ] How donations are used
- [ ] Donation tiers/naming opportunities
- [ ] Donate button (Stripe, PayPal, or church giving)
- [ ] Tax deductibility info
- [ ] Donor recognition (optional)

### If For-Profit Route
- [ ] Investor pitch page (private or public?)
- [ ] Investment opportunity overview
- [ ] Contact form for interested parties

### Questions to Decide
- Corporate structure: non-profit vs for-profit?
- If non-profit: fiscal sponsor vs own 501(c)(3)?
- Payment processor for donations?
- Donor privacy preferences?

---

## Admin Enhancements

### Registration Management
- [ ] Bulk status updates
- [ ] Capacity tracking per workshop/camp
- [ ] Waitlist management when full
- [ ] Cancellation workflow with email notification

### Reporting
- [ ] Allergy report for camp (printable)
- [ ] Authorized pickup list report
- [ ] Media consent summary
- [ ] Financial summary (amount expected, received)

---

## Future Considerations (Post-Launch)

- [ ] Attendance tracking in admin
- [ ] Instrument lending/inventory tracking
- [ ] Student progress notes (music school)
- [ ] Alumni page/community
- [ ] Referral tracking
- [ ] SMS notifications (Twilio)
- [ ] Payment integration (Stripe)

---

## Completed

- [x] Workshop registration form
- [x] Camp registration form
- [x] Waitlist form
- [x] Confirmation emails (workshop, camp, waitlist)
- [x] Admin notification emails
- [x] Magic link parent portal (being replaced by parent accounts - see `implementation/parent-accounts-full-plan.md`)
- [x] Admin dashboard with stats
- [x] Admin registration management
- [x] CSV export
- [x] Activity logging

---

## Priority for Pre-Launch

1. **Media release checkbox** - legal protection
2. **Allergy/dietary info** - safety requirement for camp
3. **Authorized pickup list** - safety requirement for camp
4. **Policies page** - sets expectations
5. **Test all flows** - see testing/registration-testing.md
