# Investor/Pitch Page - Implementation Plan

## Purpose

A simple, professional page to share with potential investors, donors, and partners. Serves as marketing material with downloadable resources.

**Not a donation page** (yet) - just information and a way to express interest.

---

## Proposed Structure

### Page 1: `/support` or `/partner`

**Hero Section**
- Headline: "Partner With Us" or "Support Creative Kids Music"
- Subhead: Brief mission statement
- Hero image: Kids making music

**The Opportunity Section**
- The problem: Traditional music education fails most kids
- The solution: Ensemble-first, professional musicians, immediate performance
- The vision: A new model for children's music education

**Proof Points**
- 30 years of expertise behind the methodology
- Pilot programs launching 2026
- St. Luke's Episcopal Church partnership

**What We're Building**
- Workshops (Spring 2026) - immediate revenue
- Summer Camp (June 2026) - signature program
- Music School (Fall 2026) - recurring enrollment model

**The Ask**
- What kind of support you're seeking
- How funds will be used
- What partners/investors get (recognition, impact, community)

**Call to Action**
- "Download Our Overview" (PDF)
- "Request Financials" (gated - contact form)
- "Get in Touch" (contact form or email link)

---

### Optional Page 2: `/support/details`

More detailed information for serious inquiries:
- Detailed budget breakdown
- Growth projections
- Timeline and milestones
- Team/leadership bios
- Church partnership details

Or keep it all on one scrolling page with sections.

---

## Downloadable Materials

| File | Format | Purpose |
|------|--------|---------|
| Program Overview | PDF | 2-page summary, shareable |
| Financial Projections | Excel | Revenue model, costs, scenarios |
| One-Pager | PDF | Quick pitch, printable |

### PDF Overview Contents
- Mission and vision
- The methodology (what makes this different)
- Programs overview (workshops, camp, school)
- 2026 timeline
- Funding goals
- Contact information

### Excel Projections
- Tab 1: Revenue projections (workshops, camp, school enrollment)
- Tab 2: Expenses (instructors, materials, space, marketing)
- Tab 3: Scenarios (conservative, moderate, optimistic)
- Tab 4: Assumptions (pricing, capacity, growth rates)

---

## Design Notes

**Tone:** Professional but warm. Not corporate, not scrappy startup. Established expertise, community-rooted.

**Visuals:**
- The tree logo prominently featured
- Photos of kids making music (if available)
- Simple, clean layout matching site aesthetic
- Cream/slate/forest color palette

**Typography:**
- Display font for headlines (Source Serif 4)
- Clean body text
- Plenty of white space

---

## Technical Implementation

**Simple approach:**
- Static page, no database
- PDF hosted in `/public/downloads/`
- Excel file hosted in `/public/downloads/`
- Contact via email link or simple form

**Contact form (optional):**
- Name, email, phone (optional)
- Interest type: Individual donor / Foundation / Corporate partner / Other
- Message
- Sends notification to admin email
- Could add to a `partner_inquiries` table for tracking

---

## Privacy Considerations

**Public page:** Anyone can view the overview

**Gated content (optional):**
- Require email to download financials
- Captures interested parties for follow-up
- "Request access to detailed financials" → form → you email them

**Recommendation:** Keep it simple. Make PDF public, offer to send Excel on request. You want to reduce friction for interested parties.

---

## Content You'll Need to Provide

1. **Mission statement** (2-3 sentences)
2. **The opportunity** (what problem you're solving)
3. **Use of funds** (what you'll do with investment/donations)
4. **Financial projections** (I can help structure the Excel)
5. **Team bio** (your background, church partnership)
6. **Photos** (if available, or use placeholder for now)

---

## Implementation Steps

1. **Create page route:** `/app/support/page.tsx`
2. **Write content:** Based on brand guide + your input
3. **Design layout:** Match site aesthetic
4. **Create PDF:** Can generate from Figma, Canva, or I can create HTML→PDF
5. **Create Excel:** Revenue/expense model
6. **Add to nav?** Maybe footer link only, not main nav

---

## Questions for You

1. **URL preference:** `/support`, `/partner`, `/invest`, or something else?
2. **Gated or open:** Should Excel require a form submission?
3. **Nav placement:** Footer only, or visible in header?
4. **Contact method:** Email link, form, or both?
5. **Do you have financial projections already?** Or should we build them together?
