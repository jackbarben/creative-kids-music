# Creative Kids Music - Documentation

## Structure

```
/docs
├── README.md                    # This file
├── planning/
│   └── master-todo.md          # Current roadmap and tasks
├── implementation/             # How things work
│   ├── changelog.md            # History of changes
│   ├── database.md             # Database schema
│   ├── admin.md                # Admin portal guide
│   ├── email.md                # Email system
│   ├── forms.md                # Form components
│   ├── setup-guide.md          # Development setup
│   └── decisions.md            # Key decisions made
├── policies/                   # Legal content (source for terms pages)
│   ├── cancellation-policy.md
│   ├── liability-waiver.md
│   ├── media-release.md
│   └── medical-authorization.md
├── testing/                    # Test scenarios
│   ├── parent-accounts-edge-cases.md
│   └── registration-testing.md
└── archive/                    # Historical docs (completed)
    ├── vision/                 # Original planning docs
    └── completed-plans/        # Implemented feature plans
```

## Quick Links

- [Current Todo List](./planning/master-todo.md) - What needs to be done
- [Changelog](./implementation/changelog.md) - What was built, when
- [Database Schema](./implementation/database.md) - Current database structure
- [Setup Guide](./implementation/setup-guide.md) - How to run locally

## Key Info

- **Site**: https://www.creativekidsmusic.org
- **Tech**: Next.js 14, Supabase, Tailwind CSS, Resend
- **Hosting**: Vercel (auto-deploy from GitHub master)
