# Setup Guide

How to set up the Creative Kids Music project for development.

---

## Prerequisites

- Node.js 18+ installed
- npm (comes with Node.js)
- Git
- Supabase account (free tier) - for database and auth
- Vercel account (for deployment) - already connected

---

## Quick Start (If Supabase Already Configured)

```bash
cd ~/code/creative-kids
npm install
npm run dev
```

Visit http://localhost:4000

---

## Full Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/creative-kids.git
cd creative-kids
```

Or if working in WSL2 (recommended for hot reload):

```bash
cd ~/code/creative-kids
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign up/log in
2. Click **"New Project"**
3. Fill in:
   - **Name**: `creative-kids-music`
   - **Database Password**: Generate and save securely
   - **Region**: West US (closest to Vancouver, WA)
4. Wait ~2 minutes for setup

#### Get API Credentials

1. Go to **Settings** (gear icon) → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public** key (under "Project API keys")
   - **service_role** key (click "Reveal")

Note: Keys are JWTs starting with `eyJ...`

#### Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJ...your-service-role-key
```

### 4. Create Admin User

Using curl (replace with your service role key):

```bash
curl -X POST 'https://YOUR_PROJECT.supabase.co/auth/v1/admin/users' \
  -H "apikey: YOUR_SERVICE_ROLE_KEY" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-secure-password",
    "email_confirm": true
  }'
```

Or via Supabase Dashboard:
1. Go to **Authentication** → **Users**
2. Click **"Add user"** → **"Create new user"**
3. Enter email and password
4. Click **Create user**

### 5. Run Development Server

```bash
npm run dev
```

Visit:
- **Home**: http://localhost:4000
- **Login**: http://localhost:4000/auth/login
- **Admin**: http://localhost:4000/admin (requires login)

---

## Project Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 4000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

---

## Folder Structure

```
/creative-kids
├── app/                      # Next.js App Router pages
│   ├── layout.tsx           # Root layout (fonts)
│   ├── page.tsx             # Home page
│   ├── globals.css          # Global styles
│   ├── auth/
│   │   ├── login/page.tsx   # Login page
│   │   └── callback/route.ts # OAuth callback
│   └── admin/
│       ├── layout.tsx       # Admin sidebar layout
│       ├── page.tsx         # Dashboard
│       ├── workshops/       # Workshop management
│       ├── camp/            # Camp management
│       ├── waitlist/        # Waitlist management
│       └── activity/        # Activity log
├── components/              # React components
│   ├── Header.tsx          # Site header
│   └── Footer.tsx          # Site footer
├── lib/                     # Utilities
│   └── supabase/           # Supabase clients
│       ├── client.ts       # Browser client
│       ├── server.ts       # Server client
│       └── middleware.ts   # Auth middleware helper
├── public/                  # Static assets
│   ├── media/              # Images, audio
│   └── favicon.png         # Site icon
├── archive/                 # Old static site (preserved)
├── docs/                    # Documentation
│   ├── vision/             # Plans and specs
│   └── implementation/     # Build logs
├── middleware.ts            # Next.js middleware (auth)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.mjs
```

---

## Design System

### Colors (Warm & Organic)

| Name | Hex | Usage |
|------|-----|-------|
| Forest | `#5a7c3a` | Primary, CTAs |
| Terracotta | `#dc6b47` | Accent, Summer Camp |
| Cream | `#fdf8f0` | Backgrounds |
| Stone | `#44403c` | Text |

### Typography

| Font | Usage |
|------|-------|
| Fraunces | Display headings |
| Nunito | Body text |

### Tailwind Classes

```jsx
// Backgrounds
bg-cream-50, bg-cream-100, bg-forest-50, bg-terracotta-50

// Text
text-forest-600, text-terracotta-500, text-stone-800

// Fonts
font-display, font-sans
```

---

## Google OAuth Setup (Optional)

1. **Google Cloud Console**:
   - Create OAuth 2.0 credentials
   - Add authorized redirect URI: `https://YOUR_PROJECT.supabase.co/auth/v1/callback`

2. **Supabase Dashboard**:
   - Go to **Authentication** → **Providers**
   - Enable **Google**
   - Enter Client ID and Secret

---

## Deployment

The project auto-deploys to Vercel on push to `master`.

### Vercel Environment Variables

Set in Vercel Dashboard → Project → Settings → Environment Variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

---

## Troubleshooting

### Hot reload not working

If on Windows WSL2, ensure project is in Linux filesystem (`~/code/`) not Windows (`/mnt/c/`).

### "Module not found" errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 4000 in use

```bash
lsof -ti :4000 | xargs -r kill -9
npm run dev
```

### Supabase connection errors

1. Check `.env.local` has correct credentials
2. Ensure keys start with `eyJ` (JWTs)
3. Restart dev server after changing env vars

---

## Current State (Phase 2 Complete)

- ✅ Next.js project set up
- ✅ Warm & Organic design implemented
- ✅ Supabase connected
- ✅ Authentication working
- ✅ Admin portal with placeholder pages
- ⏳ Database tables (Phase 3)
- ⏳ Registration forms (Phase 5)
- ⏳ Email notifications (Phase 8)

---

*Last updated: Phase 2 completion*
