# Getting Started - Creative Kids Music

Project location: `~/code/creative-kids` (Linux filesystem for hot reload)

---

## Quick Start

```bash
cd ~/code/creative-kids
npm run dev
```

**URLs:**
- **Home**: http://localhost:4000
- **Login**: http://localhost:4000/auth/login
- **Admin**: http://localhost:4000/admin

---

## Current State (Phase 4 In Progress)

### What's Built
- ✅ Home page with Warm & Organic design
- ✅ Authentication (email/password login)
- ✅ Admin portal with sidebar navigation
- ✅ Database schema with all tables, RLS, and seed data
- ✅ TypeScript types for database
- ✅ Admin pages connected to real data
- ✅ Public pages: Workshops, Summer Camp, Music School, About

### What's Next
- ⏳ Phase 5: Registration forms (workshop, camp, waitlist)

---

## Project Structure

```
~/code/creative-kids/
├── app/                      # Next.js pages
│   ├── page.tsx             # Home page
│   ├── layout.tsx           # Root layout (fonts)
│   ├── globals.css          # Global styles
│   ├── auth/
│   │   ├── login/           # Login page
│   │   └── callback/        # OAuth callback
│   └── admin/
│       ├── layout.tsx       # Admin sidebar
│       ├── page.tsx         # Dashboard
│       ├── workshops/       # Workshop management
│       ├── camp/            # Camp management
│       ├── waitlist/        # Waitlist management
│       └── activity/        # Activity log
├── components/              # Shared components
├── lib/
│   ├── supabase/            # Supabase clients
│   ├── database.types.ts    # TypeScript types
│   └── data.ts              # Data access functions
├── supabase/
│   └── migrations/          # SQL migrations
├── public/                  # Static assets
├── docs/
│   ├── vision/              # Plans and specs
│   └── implementation/      # Build logs
├── archive/                 # Old static site
└── CLAUDE.md                # AI context file
```

---

## Key Documentation

| Question | File |
|----------|------|
| What's the full plan? | `docs/vision/implementation-plan.md` |
| What's been built? | `docs/implementation/changelog.md` |
| Database design? | `docs/vision/database-schema.md` |
| Setup instructions? | `docs/implementation/setup-guide.md` |
| Design decisions? | `docs/implementation/decisions.md` |

---

## Design System (Warm & Organic)

### Colors
| Name | Hex | Usage |
|------|-----|-------|
| Forest | #5a7c3a | Primary, CTAs |
| Terracotta | #dc6b47 | Accent |
| Cream | #fdf8f0 | Backgrounds |
| Stone | #44403c | Text |

### Typography
- **Fraunces**: Display headings (`font-syne`)
- **Nunito**: Body text (`font-nunito`)

---

## Common Commands

```bash
# Development
npm run dev           # Start server (port 4000)
npm run build         # Production build
npm run lint          # Run ESLint

# Kill port if in use
lsof -ti :4000 | xargs -r kill -9
```

---

## Supabase

**Project**: `creative-kids-music`
**URL**: `https://qidzeagzbrqxntrqbpzx.supabase.co`

Credentials are in `.env.local` (not committed to git).

---

## Admin Access

**Login**: http://localhost:4000/auth/login

Admin user created:
- Email: `jackbarben3@gmail.com`

---

## Troubleshooting

### Hot reload not working
Ensure project is in Linux filesystem (`~/code/`) not Windows (`/mnt/c/`).

### Port 4000 in use
```bash
lsof -ti :4000 | xargs -r kill -9
npm run dev
```

### Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## VS Code

Open from WSL:
```bash
code ~/code/creative-kids
```

Or from Windows Explorer: `\\wsl$\Ubuntu\home\jbarb\code\creative-kids`

---

*Last updated: Phase 4 in progress*
