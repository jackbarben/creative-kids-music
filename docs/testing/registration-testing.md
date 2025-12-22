# Registration & Email Testing Checklist

Use this document to verify all registration flows work correctly before launch and after any changes.

---

## Test Accounts

| Purpose | Email | Notes |
|---------|-------|-------|
| Parent testing | jackbarben3@gmail.com | Primary test account |
| Admin login | jackbarben3@gmail.com | Password: CreativeKids2025 |
| Secondary parent | (add another email) | For testing multiple registrations |

---

## Workshop Registration Flow

### Form Submission
- [ ] Load `/workshops/register` - page renders without errors
- [ ] Form validation works:
  - [ ] Required fields show errors when empty
  - [ ] Email format validated
  - [ ] Phone format accepted
  - [ ] At least one child required
  - [ ] At least one workshop date required
- [ ] Add multiple children - sibling discount applies ($10 off each additional)
- [ ] Select multiple workshop dates - pricing updates correctly
- [ ] Tuition assistance option works
- [ ] Form submits successfully
- [ ] Redirect to confirmation/thank you page
- [ ] Data appears in Supabase `workshop_registrations` table
- [ ] Children appear in `workshop_children` table

### Workshop Confirmation Email (to Parent)
- [ ] Email arrives within 2 minutes
- [ ] From: Creative Kids Music <noreply@creativekidsmusic.org>
- [ ] Subject: "Workshop Reservation Confirmed"
- [ ] Contains:
  - [ ] Parent name
  - [ ] Children names and ages
  - [ ] Selected workshop dates
  - [ ] Total amount (or tuition assistance note)
  - [ ] Time: 3:30 – 7:30 PM
  - [ ] Location: St. Luke's address
  - [ ] Contact email for questions
- [ ] Links work (if any)
- [ ] Displays correctly on mobile

### Workshop Admin Notification Email
- [ ] Email arrives to jack@creativekidsmusic.org
- [ ] Subject includes parent name
- [ ] Flags tuition assistance if requested
- [ ] "View in Admin" link works

---

## Summer Camp Registration Flow

### Form Submission
- [ ] Load `/summer-camp/register` - page renders without errors
- [ ] Form validation works:
  - [ ] Required fields show errors when empty
  - [ ] Email format validated
  - [ ] Phone format accepted
  - [ ] Emergency contact required
  - [ ] At least one child required
- [ ] Add multiple children - sibling discount applies
- [ ] Medical/allergy info can be entered per child
- [ ] Tuition assistance option works
- [ ] Form submits successfully
- [ ] Redirect to confirmation/thank you page
- [ ] Data appears in Supabase `camp_registrations` table
- [ ] Children appear in `camp_children` table with medical info

### Camp Confirmation Email (to Parent)
- [ ] Email arrives within 2 minutes
- [ ] From: Creative Kids Music <noreply@creativekidsmusic.org>
- [ ] Subject: "Summer Camp Reservation Confirmed"
- [ ] Contains:
  - [ ] Parent name
  - [ ] Children names and ages
  - [ ] Camp dates: June 22–26, 2026 (Mon–Fri)
  - [ ] Time: 8:30 AM – 5:00 PM
  - [ ] Sunday performance: June 28
  - [ ] Emergency contact info
  - [ ] Total amount (or tuition assistance note)
  - [ ] Location: St. Luke's address
- [ ] Displays correctly on mobile

### Camp Admin Notification Email
- [ ] Email arrives to jack@creativekidsmusic.org
- [ ] Subject includes parent name
- [ ] Flags tuition assistance if requested
- [ ] "View in Admin" link works

---

## Music School Waitlist Flow

### Form Submission
- [ ] Load `/music-school` - page renders without errors
- [ ] Waitlist form validation works
- [ ] Form submits successfully
- [ ] Shows confirmation message
- [ ] Data appears in Supabase `waitlist_signups` table

### Waitlist Confirmation Email
- [ ] Email arrives within 2 minutes
- [ ] Subject: "You're on the Music School Waitlist"
- [ ] Contains parent name
- [ ] Mentions Fall 2026
- [ ] Suggests workshops/camp in meantime

### Waitlist Admin Notification
- [ ] Email arrives to jack@creativekidsmusic.org
- [ ] "View in Admin" link works

---

## Parent Portal Flow

### Magic Link Request
- [ ] Load `/my-registrations` - page renders
- [ ] Enter email with existing registrations
- [ ] "Send Link" button works
- [ ] Shows "check your email" message

### Magic Link Email
- [ ] Email arrives within 2 minutes
- [ ] Subject: "Access Your Registrations"
- [ ] "View My Registrations" button works
- [ ] Link expires after 24 hours (test next day)
- [ ] Link works only once (test second click)

### Parent Portal Dashboard
- [ ] Shows all registrations for that email
- [ ] Workshop registrations display correctly
- [ ] Camp registrations display correctly
- [ ] Children listed with ages
- [ ] Can edit contact info (phone, emergency contact)
- [ ] Edit saves successfully
- [ ] Logout/session expiry works

---

## Admin Portal Flow

### Login
- [ ] Load `/auth/login` - page renders
- [ ] Invalid credentials show error
- [ ] Valid credentials redirect to `/admin`
- [ ] Session persists on refresh

### Dashboard
- [ ] `/admin` shows registration counts
- [ ] Stats are accurate

### Workshop Admin
- [ ] `/admin/workshops` lists all registrations
- [ ] Can filter/search
- [ ] Click through to detail page
- [ ] Can update status
- [ ] Can update payment status
- [ ] Can add admin notes
- [ ] CSV export works

### Camp Admin
- [ ] `/admin/camp` lists all registrations
- [ ] Can filter/search
- [ ] Click through to detail page
- [ ] Medical info visible
- [ ] Can update status
- [ ] Can update payment status
- [ ] CSV export works

### Waitlist Admin
- [ ] `/admin/waitlist` lists all signups
- [ ] Click through to detail page

### Activity Log
- [ ] `/admin/activity` shows recent actions
- [ ] Actions logged when status changes

---

## Cancellation Flow (TO BE BUILT)

### Parent-Initiated Cancellation
- [ ] Parent can request cancellation from portal
- [ ] Confirmation required before submitting
- [ ] Admin notified of cancellation request
- [ ] Status updates in database

### Admin-Initiated Cancellation
- [ ] Admin can cancel registration
- [ ] Reason can be noted
- [ ] Parent notified via email
- [ ] Spot freed for capacity tracking

### Cancellation Email (to Parent)
- [ ] Email confirms cancellation
- [ ] Refund policy mentioned (if applicable)
- [ ] Contact info for questions

---

## Edge Cases to Test

- [ ] Duplicate email registration (same parent, new registration)
- [ ] Maximum children per registration (if limited)
- [ ] Workshop at capacity (if capacity tracking enabled)
- [ ] Camp at capacity
- [ ] Invalid magic link token
- [ ] Expired magic link
- [ ] Admin accessing non-existent registration ID
- [ ] Form submission with JavaScript disabled
- [ ] Mobile form submission (iOS Safari, Android Chrome)

---

## Email Deliverability

- [ ] Emails not going to spam
- [ ] SPF/DKIM configured correctly (check headers)
- [ ] Test with Gmail, Outlook, Yahoo accounts
- [ ] Resend dashboard shows successful delivery

---

## After Each Test Run

Date: ___________
Tester: ___________
Environment: [ ] Local [ ] Production

### Issues Found:
1.
2.
3.

### Notes:

