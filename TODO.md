# Spanish i18n — Implementation Checklist

**Branch:** `feature/spanish-i18n` (off `origin/master`)
**Plan:** `~/.claude/plans/dynamic-honking-lovelace.md`
**Last updated:** 2026-04-11 (Phases 1-4 complete, Phase 5 next)

### Resume Point
All server actions and bilingual emails are done. Ready for Phase 5 testing:
- Test all English pages at /en/*
- Test all Spanish pages at /es/*
- Test language switcher on every page
- Test registration form submission in both languages
- Test confirmation emails are bilingual for ES registrations
- Then Phase 6 (branch cleanup)

---

## Phase 1: Infrastructure Setup
- [x] Create feature branch off master
- [x] Install next-intl
- [x] Create i18n/routing.ts (locales: en, es; default: en)
- [x] Create i18n/request.ts (loads message files per locale)
- [x] Create i18n/navigation.ts (locale-aware Link, usePathname, useRouter)
- [x] Update next.config.mjs (wrap with createNextIntlPlugin)
- [x] Update app/layout.tsx (dynamic lang attr via getLocale)
- [x] Create app/[locale]/layout.tsx (NextIntlClientProvider)
- [x] Create middleware.ts (locale detection, skip /admin/* /auth/* /account/* /terms/*)
- [x] Create skeleton messages/en.json and messages/es.json
- [x] Create LanguageSwitcher component
- [x] Create SpanishToast component
- [x] Move public pages under app/[locale]/
- [x] Build passes, English works at /en/*
- [ ] Add LanguageSwitcher to Header (wire in Phase 3)
- [ ] Add SpanishToast to home page (wire in Phase 3)

## Phase 2: Extract & Translate Content
- [x] Read all master pages and extract text into en.json (~300 keys)
- [x] Translate to es.json (fresh against master content)
- [ ] Pages to extract:
  - [ ] Home page (new button labels, August dates, video embed)
  - [ ] About page (REWRITTEN philosophy section — full re-translation)
  - [ ] FAQ page (unchanged — reuse existing translations)
  - [ ] Workshops landing (new times: 4:00–6:30, new button text)
  - [ ] Workshops register page (new time details)
  - [ ] Workshops thank-you (new payment info, account sections)
  - [ ] Summer camp landing (August 3–9 dates, new button text)
  - [ ] Summer camp register (August dates)
  - [ ] Summer camp thank-you (August date, payment info, account sections)
  - [ ] Music school page (COMPLETE REWRITE — InterestForm, new vision text)
  - [ ] Music school thank-you (new heading, account section)
  - [ ] Not-found page
  - [ ] Contact page (new on master)
  - [ ] My-registrations pages
  - [ ] Header nav (now includes Contact, Account)
  - [ ] Footer (now includes terms links, version)
  - [ ] AgreementsSection (liability waiver, terms, behavior agreement, media consent)
  - [ ] ChildFields (includes dietary, tshirt size on master)
  - [ ] Form components (ParentSection, EmergencyContactSection, etc.)
  - [ ] Validation messages
- [ ] Create translations review doc (translations.md)
- [ ] Run Spanish review (spelling, grammar, register, gender)
- [ ] Generate PDF for human review

## Phase 3: Wire Components
- [ ] Header.tsx — locale-aware Link, useTranslations('nav'), keep admin auth check
- [ ] Footer.tsx — locale-aware Link, useTranslations
- [ ] Home page — getTranslations, SpanishToast
- [ ] About page — getTranslations (new philosophy text)
- [ ] FAQ page — getTranslations
- [ ] Workshops landing — getTranslations, locale-aware dates
- [ ] Workshops register page — getTranslations
- [ ] Workshops thank-you — getTranslations (+ account sections)
- [ ] Summer camp landing — getTranslations
- [ ] Summer camp register — getTranslations
- [ ] Summer camp thank-you — getTranslations (+ account sections)
- [ ] Music school page — getTranslations (InterestForm)
- [ ] Music school thank-you — getTranslations
- [ ] Contact page — getTranslations
- [ ] Not-found page — getTranslations
- [ ] My-registrations pages — useTranslations
- [ ] AgreementsSection.tsx — useTranslations (liability, terms, behavior, media consent)
- [ ] ChildFields.tsx — useTranslations (labels, warnings, dietary, tshirt)
- [ ] InterestForm.tsx — useTranslations
- [ ] WorkshopRegistrationForm.tsx — useTranslations
- [ ] CampRegistrationForm.tsx — useTranslations
- [ ] Other form sections (ParentSection, EmergencyContact, AuthorizedPickups, AccountSection)

## Phase 4: Server Actions & Emails
- [x] Workshop actions.ts — read locale from form, translated validation, locale in DB, locale-prefixed redirect
- [x] Camp actions.ts — same
- [x] Music school actions.ts — same (both submitInterestSurvey and submitWaitlistSignup)
- [x] Contact actions.ts — translated validation messages
- [x] lib/email.ts — bilingual emails for ES registrations:
  - [x] Workshop confirmation (EN first, then ES with legal disclaimer)
  - [x] Camp confirmation
  - [x] Waitlist/interest confirmation
  - [x] Magic link email (already removed — deprecated in Phase 11)
  - [x] Admin notifications stay English-only

## Phase 5: Verify & Merge
- [x] `next build` passes
- [x] Test all English pages at /en/*
- [x] Test all Spanish pages at /es/*
- [ ] Test language switcher works on every page
- [ ] Test SpanishToast appears once, remembers dismissal
- [ ] Test registration form submission in both languages
- [ ] Test terms/liability links in AgreementsSection
- [ ] Test confirmation emails are bilingual for ES
- [ ] Test locale saved to DB on registration
- [ ] Merge to master
- [ ] Push to origin

## Phase 6: Cleanup
- [ ] Set master as GitHub default branch (`gh repo edit --default-branch master`)
- [ ] Delete main branch (local + remote)

---

---

## Other TODO (non-i18n)
- [ ] Update site with most recent video and photos
- [ ] Fix mobile layout issues on admin portal
- [ ] Admin: ability to find/filter registrations per workshop
- [ ] Admin: other registration lookup/management improvements

---

## Notes
- Terms pages (/terms/*) move under [locale]/ — translated to Spanish with AI disclaimer at top, English is authoritative
- Admin portal (/admin/*) stays English-only
- Auth pages (/auth/*) stay English-only
- Account pages (/account/*) stay English-only for now
- DB locale column already added to workshop_registrations, camp_registrations, waitlist_signups (migration ran 2026-04-10)
- Master has sonner toast library already installed — can use for notifications
- Master Header has auth check (shows Admin link when logged in) — preserve this
- Master Footer has version number and terms links — preserve these
