# Creative Kids Music - Project Context

## Design Work Rules

**Do not change content during design iterations.** When redesigning, preserve all text/copy exactly as written. Only modify styling, layout, fonts, and colors.

---

## Brand Guide

### Primary Message: The Belief
**Your child is already a musician. We help them discover that.**

### Secondary Message: The Transformation
At Creative Kids, children make real music from day one alongside professional musicians—building not just musical skill, but lasting confidence, creativity, and the ability to collaborate and show up with others for life.

### Proof Points

**Immediate Performance**
Children jam, solo, and perform in their very first workshop—not after months of preparation.

**Ensemble as Teacher**
We create musical flow together. This kind of learning is impossible alone—it only happens when you're playing with others.

**Presence Over Pedagogy**
Professional musicians model what can't be taught with words. Kids absorb mastery by being in the room with it.

**Tested, Not Theoretical**
30 years of music education expertise. These concepts are iterated, tested, and refined—not borrowed from a book.

### Voice & Tone
- **Warm and grounded** — not salesy, not urgent, nothing to prove
- **Quiet confidence** — "I know something you don't know, and I can show you"
- **Actions over arguments** — we don't persuade, we invite and demonstrate
- **Plain language** — no edu-jargon, no fluff, no performance of expertise
- **Counter-cultural but not combative** — we're not attacking traditional lessons, we've just found something better

### Visual Anchor: The Tree with Piano-Key Roots
This image makes the philosophy visible: music as foundation, growth as natural. The roots aren't visible in performance—but they're what makes everything above ground possible.

### The Test
Before publishing any material, ask:
1. **Could a competitor say this?** If yes, it's not distinctive enough.
2. **Are we trying to convince, or inviting to experience?** Always invite.
3. **Does it sound like us?** Warm, grounded, quietly confident.

---

## Typography System

### Fonts
- **Display**: Source Serif 4 (`font-display`) — headings, titles, emphasis
- **Body**: Inter (`font-sans` / default) — paragraphs, UI text

### Scale (use consistently across all pages)

| Element | Class | Usage |
|---------|-------|-------|
| **Page Title** | `font-display text-5xl md:text-6xl font-semibold` | One per page, the main H1 |
| **Section Label** | `text-xs uppercase tracking-widest font-semibold` | Above titles (e.g., "Winter/Spring 2026") |
| **Lead Text** | `text-2xl md:text-3xl` | Opening statement, big idea |
| **Body** | `text-base` (default) | Main content paragraphs |
| **Emphasis** | `text-xl font-medium` | Key takeaway, closing statement |
| **Card Title** | `font-display text-2xl font-semibold` | Program cards, sidebar headings |
| **Small/Meta** | `text-sm` | Details, dates, prices, addresses |

### Colors (text)
| Purpose | Class |
|---------|-------|
| Headings | `text-slate-800` |
| Lead/emphasis | `text-slate-700` or `text-slate-800` |
| Body text | `text-slate-600` |
| Meta/secondary | `text-slate-500` or `text-slate-400` |
| Labels | `text-sage-600` or `text-lavender-600` |

### Rules
- Maximum 3-4 text sizes per page
- Display font only for headings and card titles, never body text
- Labels are always: `text-xs uppercase tracking-widest font-semibold`
- Avoid mixing too many slate shades in one section

---

## What This Project Is

Creative Kids Music is a children's music education program in Vancouver, WA offering workshops, a summer camp, and an upcoming after-school music school. The program teaches kids (ages 9-13) to be complete musicians—improvising, composing, and performing with confidence.

**Tagline:** A new kind of music school. Where music takes root.

## Current State

- **Version**: See `package.json` (displayed in footer)
- **Tech**: Next.js 14.2.x with App Router, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Email**: Resend (transactional emails)
- **Design**: Warm & Organic (forest green, terracotta, cream)
- **Hosting**: Vercel (auto-deploy from GitHub master branch)
- **Domain**: creativekidsmusic.org
- **i18n**: next-intl (English + Spanish)
- **Status**: Live in production

---

## Internationalization (i18n)

- **Library**: next-intl
- **Locales**: `en` (default), `es` (Spanish)
- **Translation files**: `messages/en.json`, `messages/es.json` (857 keys each)
- **Routing**: Public pages live under `app/[locale]/`. Middleware detects locale and redirects `/` to `/en`.
- **Config**: `i18n/routing.ts`, `i18n/request.ts`, `i18n/navigation.ts`
- **Components**: Use `useTranslations` (client) or `getTranslations` (server) from next-intl
- **Navigation**: Import `Link`, `usePathname`, `useRouter` from `@/i18n/navigation` (not `next/navigation`) in locale-aware pages
- **Locale switcher**: `components/LanguageSwitcher.tsx` in header
- **Spanish toast**: `components/SpanishToast.tsx` on home page (shows once, remembers dismissal)
- **Emails**: Bilingual for ES registrations (English first, then Spanish with legal disclaimer)
- **Excluded from i18n**: Admin (`/admin/*`), auth (`/auth/*`), account (`/account/*`) — English-only
- **DB**: `locale` column on `workshop_registrations`, `camp_registrations`, `waitlist_signups`
- **Checklist**: `docs/i18n-todo.md`

---

## Production Infrastructure

### Vercel
- **Project**: `creative-kids-music`
- **Team**: `jack-barbens-projects`
- **Production URL**: https://www.creativekidsmusic.org
- **Framework**: Next.js (must be set in project settings)
- **Auto-deploy**: From GitHub `master` branch
- **Node Version**: 22.x

**Important**: If you get `MIDDLEWARE_INVOCATION_FAILED` errors, check that the Vercel project has `framework: nextjs` set (not `null`).

### GitHub
- **Repository**: https://github.com/jackbarben/creative-kids-music
- **Branch**: `master` (production)

### Domain (Namecheap)
- **Domain**: creativekidsmusic.org
- **DNS**: Pointed to Vercel
- **Email**: Zoho Mail
  - jack@creativekidsmusic.org
  - info@creativekidsmusic.org

---

## Site Structure

### Public Pages (under `app/[locale]/`)
All public pages are served at `/{locale}/...` (e.g., `/en/workshops`, `/es/workshops`). Root `/` redirects to `/en`.

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/en` |
| `/{locale}/` | Home page |
| `/{locale}/workshops` | Workshop info + registration link |
| `/{locale}/workshops/register` | Workshop registration form |
| `/{locale}/summer-camp` | Camp info + registration link |
| `/{locale}/summer-camp/register` | Camp registration form |
| `/{locale}/music-school` | Fall 2026 teaser + interest form |
| `/{locale}/about` | Philosophy and approach |
| `/{locale}/contact` | Contact form |
| `/{locale}/faq` | Frequently asked questions |
| `/{locale}/account` | Parent login/dashboard |
| `/{locale}/account/settings` | Email and password management |
| `/{locale}/account/reset-password` | Password reset handler |

### Admin Pages (protected)
| Route | Purpose |
|-------|---------|
| `/auth/login` | Admin login |
| `/admin` | Dashboard with stats |
| `/admin/workshops` | Workshop registrations list |
| `/admin/workshops/[id]` | Registration detail + actions |
| `/admin/camp` | Camp registrations list |
| `/admin/camp/[id]` | Registration detail + actions |
| `/admin/waitlist` | Waitlist signups |
| `/admin/waitlist/[id]` | Signup detail |
| `/admin/parents` | Families - view registrations, children, medical info |
| `/admin/activity` | Activity log |

---

## Database Tables

### Current Tables (In Use)

| Table | Purpose |
|-------|---------|
| `workshops` | Workshop definitions (dates, capacity, price) |
| `workshop_registrations` | Workshop signups (has `user_id` for parent accounts) |
| `workshop_children` | Children linked to workshop registrations |
| `camp_registrations` | Summer camp signups (has `user_id` for parent accounts) |
| `camp_children` | Children linked to camp (with medical info) |
| `authorized_pickups` | People authorized to pick up children at camp |
| `waitlist_signups` | Music school interest list |
| `email_log` | Sent email tracking |
| `activity_log` | Admin action audit trail |

### Unified Programs Tables (Future)

| Table | Purpose |
|-------|---------|
| `programs` | Generic program definitions (any type) |
| `program_sessions` | Individual dates for workshop-style programs |
| `registrations` | Unified registration records |
| `registration_sessions` | Links registrations to specific sessions |
| `registration_children` | Children for each registration |
| `registration_pickups` | Authorized pickups for each registration |

See `docs/implementation/unified-programs.md` for details on adding new programs.

**Supabase Project**: `creative-kids-music`
**URL**: `https://qidzeagzbrqxntrqbpzx.supabase.co`

**Important**: When debugging database issues, Claude should check Supabase directly using the service role key and API, not ask the user to check manually.

---

## Running Migrations

Migrations are in `supabase/migrations/`. Run via psql:

```bash
# Using DATABASE_URL from .env.local
psql "$DATABASE_URL" -f supabase/migrations/XXX_name.sql

# Or directly:
psql "postgresql://postgres.qidzeagzbrqxntrqbpzx:PASSWORD@aws-0-us-west-2.pooler.supabase.com:5432/postgres" -f supabase/migrations/XXX_name.sql
```

| Migration | Purpose | Status |
|-----------|---------|--------|
| `001_initial_schema.sql` | All core tables | ✅ Applied |
| `002_magic_links.sql` | Parent portal tokens (legacy) | ✅ Applied |
| `003_parent_accounts.sql` | user_id linking, authorized_pickups, RLS policies | ✅ Applied |
| `004_registration_expansion.sql` | Account tables, expanded fields, consent/waiver columns | ✅ Applied |
| `005_media_consent_checkboxes.sql` | Split media consent into internal + marketing booleans | ✅ Applied |
| `006_pickup_phone.sql` | Phone and relationship on authorized_pickups | ✅ Applied |
| `007_unified_programs.sql` | Unified programs system (programs, registrations, sessions) | ✅ Applied |
| `008_get_user_by_email.sql` | Function to look up user by email | ✅ Applied |
| `008_interest_survey.sql` | Interest survey fields on waitlist_signups | ✅ Applied |
| `009_archive_support.sql` | Archive/soft-delete support for registrations | ✅ Applied |
| `009_families.sql` | Family accounts table | ✅ Applied |
| `010_workshop_enhancements.sql` | Workshop status, waitlist, registration windows | ✅ Applied |
| `011_attendance.sql` | Attendance tracking table and functions | ✅ Applied |
| `012_child_last_name.sql` | Backfill workshop_children/camp_children first_name (NOT NULL) and last_name | ✅ Applied |

**Note**: The `locale` column was added directly via SQL to `workshop_registrations`, `camp_registrations`, and `waitlist_signups` (no migration file).

**Credentials**: See `info/supabase-info.txt` for database password.

---

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://qidzeagzbrqxntrqbpzx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
RESEND_API_KEY=your-resend-api-key
```

---

## Development

### Project Location

```
~/code/creative-kids-music
```

Or from Windows: `\\wsl$\Ubuntu\home\jack\code\creative-kids-music`

**Important**: Run commands from WSL, not Windows PowerShell.

### Git Authentication

The remote uses SSH (`git@github.com:jackbarben/creative-kids-music.git`). SSH keys are set up at `~/.ssh/id_ed25519` and authenticate as `jackbarben`. Do **not** switch the remote to HTTPS — the Windows credential manager doesn't work from WSL.

### Quick Start

```bash
cd ~/code/creative-kids-music
npm run dev
```

**Dev server**: http://localhost:4000

### Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 4000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## Key Features

### Registration Forms
- Multi-child support with sibling discounts ($10 off each additional child)
- Workshop: select multiple dates
- Camp: includes emergency contact and medical info
- Honeypot spam prevention
- Server-side validation

### Email System (Resend)
- Confirmation emails on registration
- Admin notifications (flags tuition assistance requests)
- All emails logged to `email_log` table

### Parent Portal (`/account`)
- Email/password + Google OAuth login
- Account creation during registration (inline)
- View all registrations, children, payment status
- Edit contact info, add/remove children
- Cancel registration (before program starts)
- Manage authorized pickups (camp only)
- Edit account settings (email, password)

### Admin Portal
- View/filter all registrations
- Update status and payment status
- Add admin notes
- CSV export for each section

---

## Design System

### Colors
| Name | Tailwind | Usage |
|------|----------|-------|
| Forest | `forest-*` | Primary, CTAs |
| Terracotta | `terracotta-*` | Accent, Camp |
| Cream | `cream-*` | Backgrounds |
| Stone | `stone-*` | Text |

### Typography
| Font | Class | Usage |
|------|-------|-------|
| Source Serif 4 | `font-display` | Display headings |
| Inter | `font-sans` | Body text (default) |

---

## Programs

### Workshops (Spring 2026)
- **Dates**: February 20, March 20, May 1
- **Time**: 4:00–6:30 PM Workshop, 6:30–7:00 PM Dinner, 7:00 PM Performance
- **Cost**: $75
- **Ages**: 9–13

### Summer Camp (August 2026)
- **Dates**: August 3–7, 2026 (Mon–Fri)
- **Time**: 8:30 AM – 5:00 PM · Lunch included
- **Sunday Performance**: August 9, 9–11 AM
- **Cost**: $400
- **Ages**: 9–13

### Music School (Fall 2026)
- Waitlist only for now

---

## Documentation

| Document | Purpose |
|----------|---------|
| `/docs/implementation/changelog.md` | What was built, when |
| `/docs/implementation/forms.md` | Form system details |
| `/docs/implementation/admin.md` | Admin portal details |
| `/docs/implementation/email.md` | Email system details |
| `/docs/implementation/unified-programs.md` | **Unified programs system for future programs** |
| `/docs/implementation/parent-accounts-full-plan.md` | Parent accounts v2 full plan |
| `/docs/implementation/parent-portal-wireframes.md` | ASCII wireframes for account pages |
| `/docs/testing/parent-accounts-edge-cases.md` | 131 test scenarios |
| `/docs/vision/implementation-plan.md` | Original phased plan |
| `/info/email-setup.txt` | DNS/email configuration |

---

## Testing

**Test email**: `jackbarben3@gmail.com`
**Admin password**: `CreativeKids2025`

Test data exists in the database for this email:
- Workshop registration (2 workshops, 2 children)
- Waitlist signup

To test:
- **Admin portal**: Go to `/auth/login`, use test email + password
- **Parent portal**: Go to `/account`, login with email/password or create account during registration

---

## Known Limitations

- **Google OAuth**: Configured and working (shows Supabase project ID in redirect URL - this is normal)
- **Scheduled reminders**: Deferred (no Vercel Cron set up)
- **Payment integration**: Coming January 2025 - currently accepting reservations only
- **Middleware**: Removed due to Vercel Edge runtime issues; admin auth handled client-side in layout

---

## Completed Phases

- [x] Phase 0: Project Setup
- [x] Phase 1: Design Exploration (Warm & Organic selected)
- [x] Phase 2: Authentication & Admin Shell
- [x] Phase 3: Database & Core Data
- [x] Phase 4: Public Pages
- [x] Phase 5: Registration Forms
- [x] Phase 5.5: Parent Accounts (magic link) - **Replaced**
- [x] Phase 6: Admin - View Registrations
- [x] Phase 7: Admin - Actions
- [x] Phase 8: Email System
- [x] Phase 9: Polish & Testing
- [x] Phase 10: Launch (December 2024)
- [x] Phase 11: Parent Accounts v2 (email/password + OAuth, replaces magic links)

---

## Versioning

### Format: Semantic Versioning (SemVer)

`MAJOR.MINOR.PATCH` (e.g., v1.2.3)

| Part | When to bump | Examples |
|------|--------------|----------|
| **MAJOR** | Breaking changes, major redesigns, big milestones | Payment integration, complete redesign |
| **MINOR** | New features, significant additions | Contact form, new admin reports, search/filter |
| **PATCH** | Bug fixes, small tweaks, copy changes | Fix typo, adjust styling, small bug fix |

### Process

1. **Work on features** - don't touch version during development
2. **Ready to deploy?** - bump version in `package.json`
3. **Commit** - include version in commit message: `v1.1.0 - Add contact form`
4. **Push to production** - Vercel auto-deploys from master
5. **Optionally tag** - `git tag v1.1.0 && git push --tags`

### Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0.0 | Dec 2024 | Initial launch - workshops, camp, parent accounts |
| v1.1.0 | Dec 2024 | Contact form, portal fixes, docs cleanup |
| v1.2.0 | Dec 2024 | Parent lookup, admin improvements, accessibility |
| v1.3.0 – v1.5.7 | early 2026 | Account decoupling, admin portal enhancements, payment messaging, Phase 6 program management + attendance, family model |
| v1.6.0 | 2026-04-11 | Spanish i18n, mobile admin layout, workshop registration filter |
| v1.7.0 | 2026-04-29 | Split child names into first + last across forms, parent portal, admin, attendance, exports |

### Where Version Appears

- `package.json` - source of truth
- Footer - displayed to users
- Git tags - for release tracking (optional)
