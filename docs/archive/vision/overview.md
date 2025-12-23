# Project Overview

## What We're Building

A modern web platform for Creative Kids Music that replaces the current static HTML site with a full-stack application capable of managing signups, student enrollments, and program administration.

## Goals

1. **Modern Tech Stack**: Migrate from static HTML/CSS/JS to Next.js (React)
2. **Backend Infrastructure**: Add Node.js backend with PostgreSQL database
3. **Admin Portal**: Embedded admin area for managing signups and students
4. **Design Refresh**: Experiment with 3 design styles, pick the best
5. **Maintainability**: Clean, documented codebase that's easy to update

## Current State (Before)

- Static HTML/CSS/JS site
- 3 active pages: Home, About, Contact ("Stay Updated")
- 1 archived page: Enrollment form
- Forms don't submit anywhere (just show alerts)
- Hosted on Vercel, domain via Namecheap
- No database, no backend

## Target State (After)

- Next.js React application
- Supabase PostgreSQL database
- Supabase Authentication (email/password + Google OAuth)
- Working signup and enrollment forms
- Protected admin area at `/admin`
- Same Vercel hosting
- Clean, modern design (TBD from 3 options)

## Scale Expectations

- Tens to hundreds of users (not thousands)
- Small number of admin users (1-3)
- Modest data volume

## Timeline

- Phase 1: Project setup, authentication, basic admin shell
- Phase 2: Signup/newsletter functionality
- Phase 3: Enrollment/student management
- Phase 4: Design finalization and polish
- Phase 5: Migration from old site, go-live

## Budget

- Supabase: Free tier (sufficient for this scale)
- Vercel: Free tier (sufficient for this scale)
- Domain: Already owned (Namecheap)
- Email: Already set up (Zoho)
