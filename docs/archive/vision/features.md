# Feature Requirements

## Priority Levels

- **P0**: Must have for launch
- **P1**: Should have, high value
- **P2**: Nice to have
- **P3**: Future consideration

---

## Public Website Features

### Home Page (P0)
- [ ] Hero section with tagline ("A new kind of music school")
- [ ] Philosophy statement
- [ ] Vignettes section (4 stories, condensed)
- [ ] CTAs to Workshops, Summer Camp, Music School
- [ ] Photo gallery (migrated from current site)
- [ ] Audio player (student recordings)

### Workshops Page (P0)
- [ ] Workshop overview and description
- [ ] 3 workshop cards with dates, times, location
- [ ] Spots remaining indicator per workshop
- [ ] Registration form (multi-child support)
- [ ] Dynamic pricing display with discounts
- [ ] Payment options (link to church platform, or register without paying)
- [ ] Tuition assistance request option
- [ ] Capacity enforcement (prevent over-registration)
- [ ] Success confirmation with next steps

### Summer Camp Page (P0)
- [ ] Camp details (dates, times, what's included)
- [ ] Daily schedule overview
- [ ] Spots remaining indicator
- [ ] Registration form (multi-child with medical/emergency info)
- [ ] Payment options
- [ ] Capacity enforcement
- [ ] Success confirmation

### Music School Page (P0)
- [ ] Fall 2026 teaser content
- [ ] Program description
- [ ] Simple waitlist signup form
- [ ] Success confirmation

### About Page (P1)
- [ ] Philosophy and approach
- [ ] Origin story (migrate from current)
- [ ] (Future: instructor bios)

---

## Admin Portal Features

### Authentication (P0)
- [ ] Login page (email/password)
- [ ] Google OAuth option
- [ ] Protected routes (middleware)
- [ ] Logout functionality
- [ ] Session management
- [ ] Multiple admin users supported

### Dashboard (P1)
- [ ] Overview cards:
  - New registrations (last 7 days)
  - Pending payments
  - Upcoming workshops with enrollment counts
  - Camp registration count
- [ ] Recent activity feed
- [ ] Quick action buttons

### Workshop Management (P0)
- [ ] View all registrations in table
- [ ] Filter by workshop date
- [ ] Filter by payment status
- [ ] Search by name/email
- [ ] Expandable rows to see children details
- [ ] Update payment status (paid, partial, waived)
- [ ] Add payment notes
- [ ] Add admin notes
- [ ] View spots remaining per workshop
- [ ] Export registrations to CSV (per workshop or all)
- [ ] Cancel registration
- [ ] Send payment reminder (triggers email)

### Summer Camp Management (P0)
- [ ] View all registrations in table
- [ ] Filter by status (pending, confirmed, waitlist)
- [ ] Filter by payment status
- [ ] Search by name/email
- [ ] Expandable rows for children + emergency info
- [ ] Update status and payment
- [ ] View medical/allergy summary
- [ ] Export full roster with emergency contacts
- [ ] Printable emergency contact sheet
- [ ] Send payment reminder

### Waitlist Management (P0)
- [ ] View all signups
- [ ] Update status (new, contacted, converted)
- [ ] Add notes
- [ ] Export to CSV
- [ ] Delete entries

### Activity Log (P1)
- [ ] View all admin actions
- [ ] Filter by action type
- [ ] Filter by admin user
- [ ] Search by entity

### Settings (P2)
- [ ] View/invite admin users
- [ ] Workshop CRUD (add/edit/disable workshops)
- [ ] Email template previews
- [ ] Export all data

---

## Email System (P0)

### Service Choice
**Recommended: Resend** (or SendGrid)
- Simple API, good free tier
- React Email for templates (works great with Next.js)
- Easy to set up transactional emails

### Confirmation Emails

| Trigger | Email | Content |
|---------|-------|---------|
| Workshop registration | Immediate | Thank you, child names, workshop dates, payment status/instructions |
| Camp registration | Immediate | Thank you, child names, camp dates, emergency contact confirmation, payment status |
| Waitlist signup | Immediate | Thank you, we'll be in touch when enrollment opens |

### Reminder Emails

| Email Type | Timing | Content |
|------------|--------|---------|
| Payment reminder (workshop) | 1 week before workshop | Payment still needed, link to pay, total due |
| Payment reminder (camp) | 2 weeks before camp | Payment still needed, link to pay |
| Workshop reminder | 2 days before | Workshop details, what to bring, location |
| Camp reminder | 1 week before | Camp details, what to bring, daily schedule, emergency contacts confirmed |

### Admin Notifications

| Trigger | Notify | Content |
|---------|--------|---------|
| New workshop registration | Admin email(s) | New registration summary |
| New camp registration | Admin email(s) | New registration summary |
| Tuition assistance request | Admin email(s) | Assistance requested, family details |

### Email Templates Needed

1. `workshop-confirmation.tsx` - Thanks for registering, workshop details, payment info
2. `workshop-waitlist.tsx` - You're on the waitlist, we'll notify when spots open
3. `camp-confirmation.tsx` - Thanks for registering, camp details, payment info
4. `waitlist-confirmation.tsx` - Music school interest confirmed
5. `payment-reminder.tsx` - Payment still needed, link to pay
6. `workshop-reminder.tsx` - Workshop coming up, details, what to bring
7. `camp-reminder.tsx` - Camp starting soon, details, schedule
8. `admin-new-registration.tsx` - New registration alert
9. `admin-assistance-request.tsx` - Tuition assistance requested
10. `waitlist-promoted.tsx` - Spot opened, you're now registered!

---

## Capacity & Waitlist Logic

### Workshops
- Capacity: **12 children per workshop**
- When at capacity: Show "FULL - Join Waitlist" badge
- Change register button to "Join Waitlist"
- Waitlist registrations get `status: 'waitlist'` and `waitlist_position`
- Admin can promote waitlist → confirmed when spots open
- Promoted users receive "waitlist-promoted" email

### Summer Camp
- **No capacity limit** - let it flow
- All registrations get `status: 'pending'` → admin confirms

---

## Payment Flow

### Registration Without Payment
1. User fills form, selects "Pay Later" or "Request Tuition Assistance"
2. Registration saved with `payment_status: 'unpaid'`
3. Confirmation email includes payment link
4. Payment reminders sent on schedule
5. Admin can manually mark as paid

### Registration With Payment
1. User fills form, selects "Pay Now"
2. Registration saved with `payment_status: 'unpaid'`
3. User redirected to church payment platform
4. **Manual process**: Admin marks as paid when church confirms
5. (Future: webhook from church platform if available)

### Tuition Assistance
1. User requests assistance, explains situation
2. Registration saved with `tuition_assistance: true`
3. Admin reviews, decides on amount
4. Admin updates `total_amount_cents` and/or `payment_status: 'waived'`
5. Admin contacts family directly

---

## Multi-Child Discount Logic

| Child | Discount |
|-------|----------|
| 1st | $0 |
| 2nd | $10 off |
| 3rd | $20 off |
| 4th | $30 off |
| etc. | +$10 per child |

Discount applies per workshop/camp registration, calculated at form submission.

---

## Technical Features

### Performance (P1)
- [ ] Static generation for content pages
- [ ] Dynamic routes for forms (capacity checks)
- [ ] Optimized images

### SEO (P1)
- [ ] Meta tags per page
- [ ] Open Graph tags
- [ ] Sitemap.xml
- [ ] Schema.org structured data (Event markup)

### Accessibility (P1)
- [ ] Keyboard navigation
- [ ] Screen reader support
- [ ] Form error announcements
- [ ] Color contrast compliance

### Security (P0)
- [ ] Row Level Security on all tables
- [ ] Input validation (server-side)
- [ ] Rate limiting on form submissions
- [ ] Honeypot fields for spam prevention

---

## Scheduled Jobs (P1)

Need a way to run scheduled tasks for reminders. Options:
1. **Vercel Cron Jobs** - simple, built into Vercel
2. **Supabase Edge Functions + pg_cron** - database-level scheduling

### Scheduled Tasks

| Task | Schedule | Action |
|------|----------|--------|
| Payment reminder (workshops) | Daily at 9am | Find unpaid registrations 7 days before workshop, send reminder |
| Payment reminder (camp) | Daily at 9am | Find unpaid registrations 14 days before camp, send reminder |
| Workshop reminder | Daily at 9am | Find registrations 2 days before, send reminder |
| Camp reminder | Daily at 9am | Find registrations 7 days before, send reminder |

---

## Questions Resolved

| Question | Answer |
|----------|--------|
| Payment processor | External - church platform (placeholder for now) |
| Workshop capacity | 12 children + waitlist |
| Camp capacity | No limit |
| Discount structure | $10 off per child per workshop (1st: $75, 2nd: $65, 3rd: $55...) |
| Email confirmations | Yes, automated |
| Email reminders | Yes, scheduled (with unsubscribe) |
| Multiple children | Yes, with tiered discount |
| Multiple admins | Yes, at least 2 |
| How heard about us | Free text field (not dropdown) |
| Terms/waiver | Checkbox required + PDF link |
| Google OAuth | Yes, for admin login |
| Admin email | jack@creativekidsmusic.org |
| Parent accounts | Future (Phase 11) |

---

## Form Requirements Summary

### All Registration Forms Must Have
- [ ] Terms acceptance checkbox (required)
- [ ] Link to terms/waiver PDF
- [ ] Store acceptance timestamp
- [ ] Honeypot field (spam prevention)
- [ ] Server-side validation
- [ ] Duplicate registration check (warn, don't block)
