# Spanish i18n — Implementation Checklist

**Branch:** `feature/spanish-i18n` (off `origin/master`)
**Plan:** `~/.claude/plans/dynamic-honking-lovelace.md`
**Last updated:** 2026-04-11 (Phases 1-4 complete, Phase 5 in progress)

### Resume Point
All phases 1-4 are done. Build passes. Need to test in browser (EN + ES pages,
language switcher, SpanishToast, form submissions, bilingual emails) and then
merge to master.

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
- [x] Add LanguageSwitcher to Header
- [x] Add SpanishToast to home page

## Phase 2: Extract & Translate Content
- [x] Read all master pages and extract text into en.json (~300 keys)
- [x] Translate to es.json (fresh against master content)
- [x] Pages extracted and translated:
  - [x] Home page
  - [x] About page
  - [x] FAQ page
  - [x] Workshops landing
  - [x] Workshops register page
  - [x] Workshops thank-you
  - [x] Summer camp landing
  - [x] Summer camp register
  - [x] Summer camp thank-you
  - [x] Music school page (InterestForm, new vision text)
  - [x] Music school thank-you
  - [x] Not-found page
  - [x] Contact page
  - [x] Header nav
  - [x] Footer
  - [x] AgreementsSection (liability waiver, terms, behavior agreement, media consent)
  - [x] ChildFields (includes dietary, tshirt size)
  - [x] Form components (ParentSection, EmergencyContactSection, AuthorizedPickupsSection, AccountSection)
  - [x] Validation messages
- [ ] Create translations review doc (translations.md)
- [ ] Run Spanish review (spelling, grammar, register, gender)
- [ ] Generate PDF for human review

## Phase 3: Wire Components
- [x] Header.tsx — locale-aware Link, useTranslations('nav'), LanguageSwitcher
- [x] Footer.tsx — locale-aware Link, useTranslations
- [x] Home page — getTranslations, SpanishToast
- [x] About page — getTranslations
- [x] FAQ page — getTranslations
- [x] Workshops landing — getTranslations, locale-aware dates
- [x] Workshops register page — getTranslations
- [x] Workshops thank-you — getTranslations (+ account sections)
- [x] Summer camp landing — getTranslations
- [x] Summer camp register — getTranslations
- [x] Summer camp thank-you — getTranslations (+ account sections)
- [x] Music school page — getTranslations (InterestForm)
- [x] Music school thank-you — getTranslations
- [x] Contact page — getTranslations
- [x] Not-found page — getTranslations
- [x] AgreementsSection.tsx — useTranslations
- [x] ChildFields.tsx — useTranslations
- [x] InterestForm.tsx — useTranslations
- [x] WorkshopRegistrationForm.tsx — useTranslations
- [x] CampRegistrationForm.tsx — useTranslations
- [x] ParentSection.tsx — useTranslations
- [x] EmergencyContactSection.tsx — useTranslations
- [x] AuthorizedPickupsSection.tsx — useTranslations
- [x] AccountSection.tsx — useTranslations

## Phase 4: Server Actions & Emails
- [x] Workshop actions.ts — locale from form, translated validation, locale in DB, locale-prefixed redirect
- [x] Camp actions.ts — same
- [x] Music school actions.ts — same (fixed misplaced locale param in legacy waitlist function)
- [x] Contact actions.ts — locale from form, translated validation
- [x] lib/email.ts — bilingual emails for ES registrations:
  - [x] Workshop confirmation (EN first, then ES with legal disclaimer)
  - [x] Camp confirmation
  - [x] Waitlist/interest confirmation
  - [x] Admin notifications stay English-only

## Phase 5: Verify & Merge
- [x] `next build` passes
- [ ] Test all English pages at /en/*
- [ ] Test all Spanish pages at /es/*
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
- Terms pages (/terms/*) stay outside [locale]/ — legal docs at fixed URLs
- Admin portal (/admin/*) stays English-only
- Auth pages (/auth/*) stay English-only
- Account pages (/account/*) stay English-only for now
- DB locale column already added to workshop_registrations, camp_registrations, waitlist_signups (migration ran 2026-04-10)
- Master has sonner toast library already installed — can use for notifications
- Master Header has auth check (shows Admin link when logged in) — preserve this
- Master Footer has version number and terms links — preserve these
