# Implementation Plan

## Overview

This document outlines the phased approach to building the Creative Kids Music platform.

---

## Documentation Practice

**As we build, update these files:**

| File | Update When |
|------|-------------|
| `/docs/implementation/changelog.md` | After completing each phase or significant feature |
| `/docs/implementation/database.md` | After creating/modifying tables |
| `/docs/implementation/decisions.md` | When deviating from vision or making significant choices |
| `/docs/implementation/setup-guide.md` | When adding new setup steps or dependencies |

**Rule:** No phase is complete until its documentation is updated.

---

## Phase 0: Project Setup
**Goal:** Get the development environment ready

### Tasks
- [ ] Initialize Next.js 14 project (App Router)
- [ ] Set up TypeScript configuration
- [ ] Configure ESLint and Prettier
- [ ] Set up Tailwind CSS (for initial prototyping)
- [ ] Create Supabase project
- [ ] Configure environment variables
- [ ] Set up Supabase client libraries
- [ ] Create initial folder structure
- [ ] Deploy empty project to Vercel
- [ ] Verify GitHub → Vercel auto-deploy working

### Deliverables
- Running Next.js app at localhost:3000
- Connected to Supabase
- Deploying to Vercel

---

## Phase 1: Design Exploration ✅
**Goal:** Create 3 design styles, pick the winner

### Tasks
- [x] Set up base layout component (header, footer, nav)
- [x] Build Home page in Style 1: Modern Playful
- [x] Build Home page in Style 2: Warm & Organic
- [x] Build Home page in Style 3: Bold & Energetic
- [x] Review with stakeholder
- [x] Select winning style: **Warm & Organic**
- [x] Document decision in `/docs/implementation/decisions.md`

### Deliverables
- ✅ 3 distinct Home page designs (built and reviewed)
- ✅ Selected design direction: Warm & Organic
- ✅ Component library started (Header, Footer)

---

## Phase 2: Authentication & Admin Shell ✅
**Goal:** Secure admin area with login

### Tasks
- [x] Set up Supabase Auth (email/password + Google OAuth)
- [x] Create login page at `/auth/login`
- [x] Create auth callback handler
- [x] Set up middleware for protected routes
- [x] Create admin layout with sidebar navigation
- [x] Create admin dashboard placeholder
- [x] Add logout functionality
- [ ] Create initial admin user(s) - needs manual setup in Supabase
- [ ] Test auth flow end-to-end - needs admin user first

### Deliverables
- ✅ Working login/logout
- ✅ Protected `/admin` routes
- ✅ Admin layout with navigation

---

## Phase 3: Database & Core Data ✅
**Goal:** Set up all database tables and RLS

### Tasks
- [x] Create `workshops` table + seed initial 3 workshops
- [x] Create `workshop_registrations` table
- [x] Create `workshop_children` table
- [x] Create `camp_registrations` table
- [x] Create `camp_children` table
- [x] Create `waitlist_signups` table
- [x] Create `email_log` table
- [x] Create `activity_log` table
- [x] Set up Row Level Security policies
- [x] Create database indexes
- [x] Create Supabase TypeScript types
- [x] Test public INSERT and admin SELECT

### Deliverables
- ✅ All tables created with proper RLS
- ✅ TypeScript types generated (`lib/database.types.ts`)
- ✅ Data access layer (`lib/data.ts`)
- ✅ Admin pages connected to real data

---

## Phase 4: Public Pages (Content) ✅
**Goal:** Build out public-facing content pages

### Tasks
- [x] Build Home page with selected design
  - [ ] Hero section
  - [ ] Philosophy statement
  - [ ] Vignettes section (4 stories)
  - [ ] CTAs
  - [ ] Photo gallery (migrate images)
  - [ ] Audio player (migrate audio)
- [ ] Build About page
  - [ ] Migrate content from current site
  - [ ] Style to match new design
- [ ] Build Workshops page (content only, no form yet)
  - [ ] Workshop overview
  - [ ] 3 workshop cards with details
  - [ ] Spots remaining (static for now)
- [ ] Build Summer Camp page (content only)
  - [ ] Camp details
  - [ ] Schedule overview
- [ ] Build Music School page (content only)
  - [ ] Teaser text
  - [ ] "Coming Fall 2026" messaging
- [ ] Set up navigation between pages
- [ ] Responsive design for all pages
- [ ] SEO meta tags

### Deliverables
- All 5 public pages with content
- Responsive across devices
- Basic SEO in place

---

## Phase 5: Registration Forms ✅
**Goal:** Build working registration forms

### Tasks
- [ ] Create reusable form components
  - [ ] Text input, email, phone, select, textarea
  - [ ] Child info fieldset (add/remove children)
  - [ ] Terms acceptance checkbox with PDF link
  - [ ] Form validation (client + server)
- [ ] Build Workshop registration form
  - [ ] Workshop selection (checkboxes with capacity display)
  - [ ] Multi-child support with dynamic pricing display
  - [ ] Payment preference (Pay Now / Assistance / Pay Later)
  - [ ] Capacity check before submission
  - [ ] Waitlist flow when full
  - [ ] Age validation (soft warn for outside 9-13)
  - [ ] Duplicate registration check (warn, allow override)
- [ ] Build success/confirmation page
  - [ ] Registration summary
  - [ ] "Pay Now" button (opens new tab to church platform)
  - [ ] Clear instructions (see payment-flow.md)
- [ ] Build Camp registration form
  - [ ] Multi-child with medical/emergency info
  - [ ] Same payment flow
- [ ] Build Music School waitlist form
  - [ ] Simple form with success state
- [ ] Server-side validation for all forms
- [ ] Honeypot spam prevention
- [ ] Rate limiting

### Deliverables
- All 3 forms working
- Data saving to Supabase
- Confirmation page with payment flow
- Validation and error handling

---

## Phase 5.5: Parent Accounts (Simple)
**Goal:** Parents can view and edit their registrations

### Scope (Minimal Viable)
- **View**: See all registrations linked to their email
- **Edit**: Update contact info (phone, email, emergency contact)
- **No login required initially**: Magic link via email

### Tasks
- [ ] "View My Registrations" link on confirmation page and in emails
- [ ] Magic link email flow:
  - [ ] Parent enters email on /my-registrations page
  - [ ] We send email with secure link (valid 24 hours)
  - [ ] Link opens their registration dashboard
- [ ] Parent dashboard shows:
  - [ ] All workshop registrations
  - [ ] All camp registrations
  - [ ] Payment status for each
  - [ ] Upcoming event dates
- [ ] Edit functionality:
  - [ ] Update parent email
  - [ ] Update parent phone
  - [ ] Update emergency contact (camp)
  - [ ] Cannot change child info or workshops (email admin for that)
- [ ] Changes logged in activity_log

### Deliverables
- Parents can view their registrations without calling/emailing
- Parents can update contact info themselves
- Reduced admin workload

### Not in Scope (Future)
- Password-based accounts
- Cancel registration (email admin)
- Change workshop selection (email admin)
- Add more children to existing registration (new registration)

---

## Phase 6: Admin - View Registrations ✅
**Goal:** Admin can view all registrations

### Tasks
- [ ] Create data fetching utilities
- [ ] Build Workshop registrations table
  - [ ] Sortable columns
  - [ ] Filter by workshop date
  - [ ] Filter by payment status
  - [ ] Search by name/email
  - [ ] Expandable rows for children
  - [ ] Spots remaining per workshop
- [ ] Build Camp registrations table
  - [ ] Similar features
  - [ ] Emergency/medical info visible
- [ ] Build Waitlist table
  - [ ] Simple list view
- [ ] Build Dashboard with summary cards
- [ ] Activity log viewer

### Deliverables
- Admin can view all data
- Filtering and search working
- Dashboard with key metrics

---

## Phase 7: Admin - Actions ✅
**Goal:** Admin can manage registrations

### Tasks
- [ ] Update payment status functionality
- [ ] Add notes functionality
- [ ] Cancel registration functionality
- [ ] Promote waitlist to confirmed (camp)
- [ ] Export to CSV functionality
- [ ] Activity logging for all actions
- [ ] Printable emergency contact sheet (camp)

### Deliverables
- Full CRUD on registrations
- Export functionality
- Audit trail

---

## Phase 8: Email System ✅
**Goal:** Automated confirmation and reminder emails

### Tasks
- [x] Set up Resend account and API
- [x] Configure sending domain (creativekidsmusic.org)
- [x] Create email templates (inline HTML):
  - [x] Workshop confirmation
  - [x] Camp confirmation
  - [x] Waitlist confirmation
  - [x] Admin notification (new registration with assistance flag)
- [x] Send confirmation on registration
- [x] Send admin notification on registration
- [x] Email logging to `email_log` table
- [ ] Payment reminder (future: Vercel Cron)
- [ ] Workshop/Camp reminder (future: Vercel Cron)
- [ ] Manual "send reminder" button in admin (future)

### Deliverables
- ✅ Automated confirmation emails
- ✅ Admin notifications with tuition assistance flags
- ✅ Email history tracked in database
- Scheduled reminders deferred to post-launch

---

## Phase 9: Polish & Testing
**Goal:** Production-ready quality

### Tasks
- [ ] Cross-browser testing
- [ ] Mobile responsiveness audit
- [ ] Accessibility audit (keyboard, screen reader)
- [ ] Performance optimization (images, fonts)
- [ ] Error handling review
- [ ] Loading states
- [ ] Empty states
- [ ] 404 page
- [ ] Security review (RLS, validation)
- [ ] End-to-end testing of all flows
- [ ] Content review and proofreading

### Deliverables
- Production-quality site
- All edge cases handled
- Tested on real devices

---

## Phase 10: Launch
**Goal:** Go live!

### Tasks
- [ ] Final content review
- [ ] Set up production environment variables
- [ ] DNS configuration (if changing anything)
- [ ] Archive old static site (keep files in `/archive`)
- [ ] Deploy to production
- [ ] Verify all functionality
- [ ] Monitor for issues
- [ ] Create admin user accounts
- [ ] Document any manual processes

### Deliverables
- Live site
- Old site archived
- Admins onboarded

---

## Post-Launch (Future Enhancements)

### Potential Additions
- [ ] Full password-based parent accounts (upgrade from magic link)
- [ ] Parent can cancel/modify registrations themselves
- [ ] Instructor bios on About page
- [ ] Blog/news section
- [ ] Photo gallery management in admin
- [ ] Testimonials management
- [ ] Payment webhook from church platform (if available)
- [ ] SMS reminders option
- [ ] Digital photo/media release consent
- [ ] Attendance tracking
- [ ] Progress notes per student
- [ ] Recurring family discount tracking

---

## Dependencies & External Services

| Service | Purpose | Setup Required |
|---------|---------|----------------|
| Supabase | Database + Auth | Create project, get credentials |
| Vercel | Hosting | Already connected |
| Resend | Transactional email | Create account, verify domain |
| Church payment platform | Payments | Get payment link URL |
| Google OAuth | Admin login option | Create OAuth credentials |

---

## Risk & Mitigation

| Risk | Mitigation |
|------|------------|
| Supabase free tier limits | Monitor usage, upgrade if needed (~$25/mo) |
| Email deliverability | Verify domain properly, monitor bounces |
| Capacity race condition | Use database transaction for capacity check |
| Spam registrations | Honeypot + rate limiting |
| Church payment sync | Manual process for now, document clearly |

---

## Success Criteria

**MVP (Phases 0-5.5):**
- [ ] Parents can register children for workshops/camp
- [ ] Multi-child discount calculated correctly
- [ ] Payment flow works (new tab to church platform)
- [ ] Parents can view/edit their registrations via magic link

**Admin Ready (Phases 6-7):**
- [ ] Admin can view and manage all registrations
- [ ] Admin can update payment status
- [ ] Data exports work

**Full Launch (Phases 8-10):**
- [ ] Automated confirmation emails
- [ ] Scheduled reminder emails
- [ ] Admin notifications working
- [ ] Polish and accessibility complete
- [ ] Stress-tested with real registrations
