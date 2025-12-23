# Technical Architecture

## Stack Decision

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Framework** | Next.js 14+ (App Router) | React-based, Vercel-native, handles SSR + API routes |
| **Database** | Supabase (PostgreSQL) | Managed Postgres, built-in auth, generous free tier |
| **Authentication** | Supabase Auth | Email/password + OAuth, no custom auth code |
| **Hosting** | Vercel | Already using, free tier, perfect Next.js support |
| **Styling** | TBD (3 options to explore) | Will decide during design phase |

## Project Structure

```
/creative-kids
├── /app                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page (public)
│   ├── /about
│   │   └── page.tsx         # About page (public)
│   ├── /contact
│   │   └── page.tsx         # Signup/contact form (public)
│   ├── /enroll
│   │   └── page.tsx         # Enrollment form (public, when ready)
│   ├── /auth
│   │   ├── /login
│   │   └── /callback        # OAuth callback
│   ├── /admin               # Protected admin area
│   │   ├── layout.tsx       # Auth check, admin nav
│   │   ├── page.tsx         # Dashboard
│   │   ├── /signups         # Newsletter signup management
│   │   ├── /enrollments     # Enrollment management
│   │   ├── /students        # Student records
│   │   └── /settings        # Admin settings
│   └── /api                 # API routes (if needed beyond Supabase)
│
├── /components              # Reusable React components
│   ├── /ui                  # Base UI components
│   ├── /forms               # Form components
│   ├── /layout              # Header, footer, nav
│   └── /admin               # Admin-specific components
│
├── /lib                     # Utilities and clients
│   ├── supabase/
│   │   ├── client.ts        # Browser Supabase client
│   │   ├── server.ts        # Server Supabase client
│   │   └── middleware.ts    # Auth middleware
│   └── utils/               # Helper functions
│
├── /public                  # Static assets
│   ├── /media              # Images, audio (migrated from current)
│   └── favicon.png
│
├── /docs                    # This documentation
│
└── /styles                  # Global styles (if not using CSS-in-JS)
```

## Authentication Flow

1. Admin visits `/admin`
2. Middleware checks for valid Supabase session
3. If no session, redirect to `/auth/login`
4. User logs in via email/password or Google OAuth
5. Supabase handles session, sets cookies
6. Redirect back to `/admin`

## Data Flow

### Public Signup Form
```
User fills form → POST to Supabase → Row inserted in `signups` table
                                   → (Optional) Email notification to admin
```

### Admin Views Data
```
Admin visits /admin/signups → Server component fetches from Supabase
                            → Renders table with data
                            → Actions: export, delete, mark as contacted
```

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx (server-only, for admin operations)
```

## Deployment

- Push to `master` branch
- Vercel auto-deploys
- Environment variables set in Vercel dashboard
- Supabase project configured separately
