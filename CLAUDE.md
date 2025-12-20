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

- **Tech**: Next.js 14.2.x with App Router, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password + Google OAuth)
- **Email**: Resend (transactional emails)
- **Design**: Warm & Organic (forest green, terracotta, cream)
- **Hosting**: Vercel (auto-deploy from GitHub master branch)
- **Domain**: creativekidsmusic.org

---

## Site Structure

### Public Pages
| Route | Purpose |
|-------|---------|
| `/` | Home page |
| `/workshops` | Workshop info + registration link |
| `/workshops/register` | Workshop registration form |
| `/summer-camp` | Camp info + registration link |
| `/summer-camp/register` | Camp registration form |
| `/music-school` | Fall 2026 teaser + waitlist form |
| `/about` | Philosophy and approach |
| `/my-registrations` | Parent portal (magic link access) |

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
| `/admin/activity` | Activity log |

---

## Database Tables

| Table | Purpose |
|-------|---------|
| `workshops` | Workshop definitions (dates, capacity, price) |
| `workshop_registrations` | Workshop signups |
| `workshop_children` | Children linked to workshop registrations |
| `camp_registrations` | Summer camp signups |
| `camp_children` | Children linked to camp (with medical info) |
| `waitlist_signups` | Music school interest list |
| `magic_links` | Parent portal access tokens |
| `email_log` | Sent email tracking |
| `activity_log` | Admin action audit trail |

**Supabase Project**: `creative-kids-music`
**URL**: `https://qidzeagzbrqxntrqbpzx.supabase.co`

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
| `002_magic_links.sql` | Parent portal tokens | ✅ Applied |

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
~/code/creative-kids
```

Or from Windows: `\\wsl$\Ubuntu\home\jbarb\code\creative-kids`

**Important**: Run commands from WSL, not Windows PowerShell.

### Quick Start

```bash
cd ~/code/creative-kids
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
- Magic link emails for parent portal
- All emails logged to `email_log` table

### Parent Portal (`/my-registrations`)
- Enter email → receive magic link
- View all registrations, children, payment status
- Edit contact info (phone, emergency contact)
- Links valid 24 hours, one-time use

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
| Fraunces | `font-syne` | Display headings |
| Nunito | `font-nunito` | Body text (default) |

---

## Programs

### Workshops (Spring 2026)
- **Dates**: February 20, March 20, May 1
- **Time**: 3:30 PM – 7:30 PM
- **Cost**: $75
- **Ages**: 9–13

### Summer Camp (June 2026)
- **Dates**: June 22–27, 2026 (Mon–Fri)
- **Time**: 8:30 AM – 5:00 PM · Lunch included
- **Sunday Performance**: June 29, 9–11 AM
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
- **Parent portal**: Go to `/my-registrations`, enter the test email, check inbox for magic link

---

## Known Limitations

- **Google OAuth**: Configured and working (shows Supabase project ID in redirect URL - this is normal)
- **Scheduled reminders**: Deferred to post-launch (no Vercel Cron set up)
- **Payment integration**: External link only (no webhook from church platform)

---

## Completed Phases

- [x] Phase 0: Project Setup
- [x] Phase 1: Design Exploration (Warm & Organic selected)
- [x] Phase 2: Authentication & Admin Shell
- [x] Phase 3: Database & Core Data
- [x] Phase 4: Public Pages
- [x] Phase 5: Registration Forms
- [x] Phase 5.5: Parent Accounts (magic link)
- [x] Phase 6: Admin - View Registrations
- [x] Phase 7: Admin - Actions
- [x] Phase 8: Email System
- [ ] Phase 9: Polish & Testing (in progress)
- [ ] Phase 10: Launch
