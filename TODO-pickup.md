# TODO - Pick Up Where We Left Off

---

## 1. Uncommitted Work: Interest Survey Form

There are uncommitted changes in progress:

**What's happening:**
- Replacing `WaitlistForm.tsx` with new `InterestForm.tsx` on music-school page
- New migration `008_interest_survey.sql` (not yet applied)
- Admin waitlist page improvements to display new survey fields
- Phone setup notes in `info/phone-setup.txt`

**Files changed:**
- `app/music-school/InterestForm.tsx` (new)
- `app/music-school/actions.ts` (updated)
- `app/music-school/page.tsx` (updated)
- `app/admin/waitlist/[id]/` (updated to show survey responses)
- `supabase/migrations/008_interest_survey.sql` (new, needs to be applied)

**Next steps:**
1. Review the changes
2. Apply migration 008 to database
3. Test the form
4. Commit and deploy

---

## 2. Email to February Workshop Families

## Status: Draft ready, not sent

## Recipients (Feb 20 participants, not already registered for March 20)

| Parent | Email | Child(ren) |
|--------|-------|------------|
| Ken Dale | kdale12@msn.com | Charlie |
| Ann Reeves | annkreeves@gmail.com | Joel, Noah |
| Cam Kellett | bethkellett@gmail.com | Chris |

## Discount
- 35% off ($75 → $49)
- Honor system — "just mention it when you check in"

## Draft Email

**Subject:** This Friday — and what we're building

---

Hi [Parent Name],

Really enjoyed having [Child Name(s)] with us last month. There's something special about watching kids realize they can actually *do this* — make music together, improvise, perform — without years of preparation first.

We're back this Friday (March 20), same format: workshop from 4–6:30, dinner together, then a short performance at 7. If [Child Name(s)] want to come again, we'd love to have them. I can do $49 instead of $75 for families from February — just mention it when you check in.

These workshops are how we're finding the kids and families who might be a fit for what's coming: a week-long summer camp in August, and then a real after-school music program starting next fall. We're building something here, and we're looking for the families who want to build it with us.

No pressure either way. Just wanted you to know the door's open.

— Jack

---

## Next Steps
1. Finalize email copy
2. Send from jack@creativekidsmusic.org (or info@?)
3. Send via Resend or manually
