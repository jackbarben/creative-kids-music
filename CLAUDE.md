# Creative Kids Music - Project Context

## What This Project Is

Creative Kids Music is a children's music education program in Vancouver, WA offering workshops, a summer camp, and an upcoming after-school music school. The program teaches kids (ages 9-13) to be complete musicians—improvising, composing, and performing with confidence.

**Tagline:** A new kind of music school. Where music takes root.

## Current State (Phase 2 Complete)

- **Tech**: Next.js 14.2.x with Supabase
- **Design**: Warm & Organic (forest green, terracotta, cream)
- **Auth**: Working (email/password login)
- **Admin Portal**: Built with placeholder pages
- **Database**: Not yet created (Phase 3)
- **Hosting**: Vercel (auto-deploy from GitHub master branch)
- **Domain**: creativekidsmusic.org (Namecheap)

---

## Programs & Offerings

### Workshops (Spring 2026)
- **Dates**: February 20, March 20, May 1 (Fridays)
- **Time**: 3:30 PM – 7:30 PM
- **Cost**: $75 (tuition assistance available)
- **Ages**: 9–13
- **Location**: St. Luke's/San Lucas Episcopal Church, Vancouver, WA

### Summer Camp (June 2026)
- **Dates**: June 22–28, 2026 (one week, M–F)
- **Time**: 8:30 AM – 5:00 PM
- **Cost**: $400
- **Ages**: 9–13

### Music School (Fall 2026)
- 3 days/week after-school program
- Currently collecting waitlist interest only

---

## Site Structure

| Route | Status | Purpose |
|-------|--------|---------|
| `/` | ✅ Built | Home - philosophy, vignettes, CTAs |
| `/auth/login` | ✅ Built | Admin login page |
| `/admin` | ✅ Built | Admin dashboard (placeholder) |
| `/admin/workshops` | ✅ Built | Workshop management (placeholder) |
| `/admin/camp` | ✅ Built | Camp management (placeholder) |
| `/admin/waitlist` | ✅ Built | Waitlist management (placeholder) |
| `/admin/activity` | ✅ Built | Activity log (placeholder) |
| `/workshops` | ⏳ Phase 4 | 3 workshops with registration |
| `/summer-camp` | ⏳ Phase 4 | Camp with registration |
| `/music-school` | ⏳ Phase 4 | Fall 2026 teaser + waitlist |
| `/about` | ⏳ Phase 4 | Philosophy, approach |

---

## Database (Supabase PostgreSQL)

**Status**: Schema designed, tables not yet created (Phase 3)

| Table | Purpose |
|-------|---------|
| `workshops` | Workshop definitions (dates, capacity, price) |
| `workshop_registrations` | Workshop signups with payment info |
| `camp_registrations` | Summer camp signups with emergency/medical info |
| `waitlist_signups` | Music school interest list |
| `activity_log` | Admin action audit trail |

**Supabase Project**: `creative-kids-music`
**URL**: `https://qidzeagzbrqxntrqbpzx.supabase.co`

**Auth**: Supabase Auth (email/password working, Google OAuth optional)

---

## Design System (Warm & Organic)

### Colors

| Name | Hex | Tailwind | Usage |
|------|-----|----------|-------|
| Forest | #5a7c3a | `forest-500` | Primary, CTAs |
| Terracotta | #dc6b47 | `terracotta-500` | Accent, Summer Camp |
| Cream | #fdf8f0 | `cream-100` | Backgrounds |
| Stone | #44403c | `stone-800` | Text |

### Typography

| Font | Tailwind | Usage |
|------|----------|-------|
| Fraunces | `font-fraunces` | Display headings |
| Nunito | `font-nunito` | Body text |

---

## Key Documentation

| Document | Purpose |
|----------|---------|
| `/docs/vision/implementation-plan.md` | Phased build plan |
| `/docs/vision/database-schema.md` | Database design |
| `/docs/vision/design-styles.md` | Design decision |
| `/docs/implementation/changelog.md` | What we built, when |
| `/docs/implementation/setup-guide.md` | Development setup |
| `/docs/implementation/decisions.md` | Key decisions made |

---

## Development

### Project Location

```
~/code/creative-kids
```

Or from Windows Explorer: `\\wsl$\Ubuntu\home\jbarb\code\creative-kids`

### Quick Start

```bash
cd ~/code/creative-kids
npm run dev
```

**URLs:**
- Home: http://localhost:4000
- Login: http://localhost:4000/auth/login
- Admin: http://localhost:4000/admin

### Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 4000) |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |

---

## Migration Checklist

### Completed
- [x] Phase 0: Next.js project initialized
- [x] Phase 1: Design exploration (3 styles built, Warm & Organic selected)
- [x] Phase 2: Authentication & Admin Shell

### Remaining
- [ ] Phase 3: Database & Core Data (create tables, RLS)
- [ ] Phase 4: Public Pages (workshops, camp, music school, about)
- [ ] Phase 5: Registration Forms
- [ ] Phase 5.5: Parent Accounts (magic link)
- [ ] Phase 6: Admin - View Registrations
- [ ] Phase 7: Admin - Actions
- [ ] Phase 8: Email System
- [ ] Phase 9: Polish & Testing
- [ ] Phase 10: Launch

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14.2.x (App Router) |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Payments | External (church platform) |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Fonts | Google Fonts (Fraunces, Nunito) |
