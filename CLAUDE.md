# Creative Kids Music - Project Context

## What This Project Is

Creative Kids Music is a children's music education program in Vancouver, WA offering workshops, a summer camp, and an upcoming after-school music school. The program teaches kids (ages 9-13) to be complete musicians—improvising, composing, and performing with confidence.

**Tagline:** A new kind of music school. Where music takes root.

## Current State

- **Tech**: Next.js 14.2.x with App Router, TypeScript, Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth (email/password)
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

Migrations are in `supabase/migrations/`. Run them via Supabase Dashboard:

1. Go to https://supabase.com/dashboard
2. Select project `creative-kids-music`
3. Go to **SQL Editor**
4. Paste the migration SQL and click **Run**

| Migration | Purpose |
|-----------|---------|
| `001_initial_schema.sql` | All core tables |
| `002_magic_links.sql` | Parent portal tokens |

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
| Fraunces | `font-fraunces` | Display headings |
| Nunito | `font-nunito` | Body text (default) |

---

## Programs

### Workshops (Spring 2026)
- **Dates**: February 20, March 20, May 1
- **Time**: 3:30 PM – 7:30 PM
- **Cost**: $75
- **Ages**: 9–13

### Summer Camp (June 2026)
- **Dates**: June 22–28, 2026
- **Time**: 8:30 AM – 5:00 PM (Sunday performance 10 AM)
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
