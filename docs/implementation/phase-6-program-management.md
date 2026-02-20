# Phase 6: Program & User Management

## Overview

Full CRUD system for managing workshops, camps, families, and program data. Includes attendance tracking, program notes, and reporting.

---

## Key Decisions

| Topic | Decision |
|-------|----------|
| **Core unit** | Family (not individual parents). Kids belong to families, even single-child families. |
| **Instructor access** | Not yet - admin enters everything for now |
| **Parent visibility** | No - parents don't see attendance or notes in their portal |
| **Notifications** | Yes - waitlist promotion, reminders (1 week, 1 day) |
| **Post-program workflow** | Yes - mark complete, prompt attendance, prompt notes |
| **Child photos** | Yes for admin check-in, secure/admin-only access |
| **Photos/video storage** | External (Google/NAS), not in app database |
| **Curriculum tracking** | Per-program only (not per-child): performance summary, session summary, highlights, lessons learned |
| **Survey** | TODO - implement post-program survey later |
| **Pricing config** | Not yet - hardcoded for now |

---

---

## Core Concept: Families

**Families are the fundamental unit**, not individual users or children.

### Data Model
```
families
  - id
  - created_at

family_members
  - family_id
  - user_id (null until they create password)
  - email
  - invited_at
  - joined_at

Family "owns":
  - Children
  - Registrations
  - Payment history
  - Emergency contacts
  - Media consent defaults
  - Authorized pickups
```

### Key Principles
- No primary/secondary distinction - all family members are equal
- Multiple logins allowed, all see the same family data
- Family is created automatically on first signup
- Additional members added by email, set their own password

### User Flows

**Sign up:**
1. User creates account (email + password)
2. System creates family + adds them as member
3. All their data attaches to the family

**Add co-parent:**
1. In settings, enter co-parent's email
2. System sends invite: "Set up your login for Creative Kids"
3. Co-parent clicks link, creates their own password
4. Both logins now see same family dashboard

**Co-parent already has account elsewhere:**
- Show message: "This email is already associated with another family. Please contact us to merge accounts."
- Admin handles merge manually (merge feature built later)

### Why Families?
- Sibling discounts make sense at family level
- "Returning family" is meaningful metric
- Contact info, emergency contacts, pickups are family-wide
- Both parents can log in and manage registrations
- Simplifies multi-child, multi-parent households

### Migration Note
Current structure has `user_id` on registrations pointing to a single user. Migration will:
1. Create `families` table
2. Create `family_members` table
3. For each existing user: create family, link user as member
4. Update registrations to point to `family_id` instead of `user_id`

---

## Media Storage Strategy

### Recommendation: Hybrid Approach

| Timeframe | Storage | Why |
|-----------|---------|-----|
| **Active program** | Google Drive | Easy sharing with instructors, parents can access shared albums |
| **Post-program archive** | NAS | Cheaper long-term, private, full control |

### Workflow
1. During program: Photos/videos go to Google Drive folder (per program)
2. Share select photos with parents via Google Photos album (consent-approved only)
3. After program ends: Move to NAS archive, keep Google link in database for reference
4. Database stores: `media_url` (Google link while active), `archive_path` (NAS path after archived)

### Consent Integration
- Only show/share media for children with `media_consent_marketing = true`
- Internal documentation (`media_consent_internal`) can go to NAS but not shared publicly

---

## Metrics to Track

### Operations
| Metric | Why | How |
|--------|-----|-----|
| Registration count | Growth tracking | Auto from DB |
| Capacity utilization | Planning | Registrations / capacity |
| Revenue collected vs outstanding | Cash flow | Payment status |
| Tuition assistance rate | Budget planning | Assistance requests / total |
| Cancellation rate | Identify issues | Cancelled / registered |
| No-show rate | Overbooking decisions | Absent / registered |
| Waitlist conversion | Demand signal | Promoted / waitlisted |

### Growth & Retention
| Metric | Why | How |
|--------|-----|-----|
| New vs returning families | Health indicator | Track `first_registration_date` per family |
| Retention rate | Loyalty | Families in Program N who return for N+1 |
| Referral source breakdown | Marketing ROI | `how_heard` field analysis |
| Multi-program enrollment | Engagement depth | Workshop → Camp conversion |
| Sibling enrollment | Family engagement | Avg children per registration |
| Geographic spread | Expansion planning | Zip code from address (future) |

### Engagement
| Metric | Why | How |
|--------|-----|-----|
| Parent dinner attendance | Community building | Manual check-in |
| Performance attendance | Parent engagement | Manual count |
| Email open rate | Communication effectiveness | Resend analytics (future) |

---

## Marketing Data Collection

### Already Collecting
- How they heard about us (`how_heard`)
- What they're excited about (`excited_about`)
- General messages/questions (`message`)

### Should Add
| Data | Purpose | How to Collect |
|------|---------|----------------|
| Testimonials | Social proof | Post-program survey, manual ask |
| Photos with consent | Marketing materials | Flag approved photos in media library |
| "Transformation stories" | Compelling narratives | Instructor notes + parent feedback |
| Parent quotes | Website, social | Survey or direct ask |
| Child quotes (with parent permission) | Authenticity | Instructor capture during program |

### Post-Program Survey (TODO)
- Overall satisfaction (1-5)
- Would recommend? (NPS-style)
- What did your child love most?
- What could we improve?
- May we use your feedback? (consent)
- May we contact you for a testimonial?

---

## Program Notes (Curriculum Data)

Simple text boxes per program - nothing per child for now.

### Fields per Workshop/Camp
| Field | Purpose | Example |
|-------|---------|---------|
| **Performance Summary** | What did kids perform? | "3 original songs, 2 covers, group improv piece" |
| **Session Summary** | What happened? | "Focused on rhythm basics, introduced keyboard, percussion jam" |
| **Highlights** | Standout moments | "Great energy, one shy kid really opened up, parents loved dinner" |
| **Lessons Learned** | What to do differently | "Start rhythm earlier, need more percussion instruments" |

### Future Additions (as needed)
- Instruments used (checklist)
- Guest instructor name/topic
- Photos link (Google Drive URL)
- Attendance stats (auto-calculated)

---

## Implementation Phases

### 6A: Workshop Management
**Goal:** Full CRUD for workshops with capacity/waitlist

#### Database Changes
```sql
-- Add to workshops table
ALTER TABLE workshops
  ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 20,
  ADD COLUMN IF NOT EXISTS waitlist_enabled BOOLEAN DEFAULT true,
  ADD COLUMN IF NOT EXISTS registration_opens_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS registration_closes_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft',
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS media_folder_url TEXT,
  ADD COLUMN IF NOT EXISTS archived_at TIMESTAMPTZ;

-- Workshop status: draft, open, closed, completed, archived
```

#### New Pages
- `/admin/programs/workshops` - List all workshops
- `/admin/programs/workshops/new` - Create workshop
- `/admin/programs/workshops/[id]` - Edit workshop
- `/admin/programs/workshops/[id]/attendance` - Day-of attendance

#### Features
- Create workshop with date, title, time, location, capacity, price
- Edit any field
- Open/close registration
- View registrations, manage waitlist
- Mark attendance (present/absent/late)
- Add post-program notes
- Archive when done

#### Waitlist Logic
```typescript
// On registration submit:
const currentCount = await getRegistrationCount(workshopId)
const workshop = await getWorkshop(workshopId)

if (currentCount >= workshop.capacity) {
  // Auto-waitlist
  registration.status = 'waitlist'
} else {
  registration.status = 'pending' // or 'confirmed'
}

// On cancellation:
// Auto-promote first waitlisted registration
```

---

### 6B: Camp Management
**Goal:** Support multiple camps with same features as workshops

#### Database Changes
```sql
-- New camps table (similar to workshops but for multi-day programs)
CREATE TABLE IF NOT EXISTS camps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  daily_start_time TIME,
  daily_end_time TIME,
  location VARCHAR(255),
  address TEXT,
  capacity INTEGER DEFAULT 20,
  price_cents INTEGER NOT NULL,
  sibling_discount_cents INTEGER DEFAULT 1000,
  max_sibling_discount_cents INTEGER DEFAULT 3000,
  waitlist_enabled BOOLEAN DEFAULT true,
  registration_opens_at TIMESTAMPTZ,
  registration_closes_at TIMESTAMPTZ,
  status VARCHAR(20) DEFAULT 'draft',
  description TEXT,
  what_to_bring TEXT,
  notes TEXT,
  media_folder_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ
);

-- Link camp_registrations to camps table
ALTER TABLE camp_registrations
  ADD COLUMN IF NOT EXISTS camp_id UUID REFERENCES camps(id);
```

#### New Pages
- `/admin/programs/camps` - List all camps
- `/admin/programs/camps/new` - Create camp
- `/admin/programs/camps/[id]` - Edit camp
- `/admin/programs/camps/[id]/attendance` - Daily attendance grid

---

### 6C: Family Management (was User Management)
**Goal:** Full CRUD on families and their members

#### New Pages
- `/admin/families` - List all families with search
- `/admin/families/[id]` - Family detail with all members, children, registrations
- `/admin/families/[id]/edit` - Edit family info

#### Features
- Search by any member's name, email, or phone
- View all family members (with login status)
- View all children, registrations, payment history
- Edit contact info, emergency defaults
- Add admin notes
- Add/remove family members
- Merge families (when duplicates exist)
- Delete family (with options: anonymize or full delete)

#### Merge Families Logic
```typescript
// When merging family B into family A:
// 1. Move all family_members from B to A
// 2. Move all children from B to A (dedupe by name/DOB)
// 3. Move all registrations from B to A
// 4. Merge settings (prefer A, fill gaps from B)
// 5. Log the merge in activity
// 6. Delete family B
```

#### Admin UI for "Contact Admin" Merges
When users hit "already associated with another family":
- Admin gets notification or sees in dashboard
- Admin views both families side-by-side
- One-click merge with confirmation

---

### 6D: Email Templates
**Goal:** Admin-editable email templates

#### Database
```sql
CREATE TABLE IF NOT EXISTS email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  subject VARCHAR(255) NOT NULL,
  body_html TEXT NOT NULL,
  variables JSONB, -- Available variables for this template
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed with current templates
INSERT INTO email_templates (slug, name, subject, body_html, variables) VALUES
('workshop_confirmation', 'Workshop Confirmation', 'You''re registered! ...', '...',
 '["parent_name", "children", "workshop_dates", "total_amount", "confirmation_number"]'),
('camp_confirmation', 'Camp Confirmation', 'You''re registered! ...', '...',
 '["parent_name", "children", "camp_dates", "total_amount", "confirmation_number"]');
```

#### New Pages
- `/admin/settings/emails` - List templates
- `/admin/settings/emails/[slug]` - Edit template with preview

#### Variable System
```typescript
const variables = {
  parent_name: data.parentName,
  children: data.children.map(c => c.name).join(', '),
  total_amount: `$${data.totalAmount}`,
  // etc.
}

const html = template.body_html.replace(
  /\{\{(\w+)\}\}/g,
  (_, key) => variables[key] || ''
)
```

---

### 6E: Attendance & Check-in
**Goal:** Track who showed up with easy photo-based check-in

#### Database
```sql
-- Attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type VARCHAR(20) NOT NULL, -- 'workshop' or 'camp'
  program_id UUID NOT NULL,
  program_date DATE NOT NULL, -- For camps with multiple days
  child_id UUID NOT NULL,
  registration_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'unknown', -- present, absent, late, excused
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  picked_up_by VARCHAR(255), -- Name of person who picked up
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Child photos for check-in (admin-only, secure)
-- Added to existing children tables:
ALTER TABLE workshop_children ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE camp_children ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE account_children ADD COLUMN IF NOT EXISTS photo_url TEXT;
```

#### Check-in UI
- Photo grid of registered children
- Tap to mark present (green border)
- Tap again for late (yellow) or absent (red)
- Shows child name, age, any medical alerts
- Parent name for pickup verification

#### Security
- Photos only visible to authenticated admins
- Not exposed via public API
- Consider: store in Supabase Storage with RLS, not public URLs

---

### 6F: Reporting Dashboard
**Goal:** Key metrics at a glance

#### New Page
- `/admin/reports` - Dashboard with charts and stats

#### Metrics Display
- **Summary cards**: Total registrations, revenue, families
- **Charts**: Registrations over time, revenue by program
- **Tables**: Top referral sources, capacity utilization by workshop
- **Filters**: Date range, program type

#### Export
- CSV export for any view
- PDF report generation (future)

---

## File Structure

```
app/admin/
  programs/
    workshops/
      page.tsx              # List workshops
      new/page.tsx          # Create workshop
      [id]/
        page.tsx            # Edit workshop
        attendance/page.tsx # Attendance tracking
    camps/
      page.tsx              # List camps
      new/page.tsx          # Create camp
      [id]/
        page.tsx            # Edit camp
        attendance/page.tsx # Daily attendance
  users/
    page.tsx                # List users
    [id]/
      page.tsx              # User detail
      edit/page.tsx         # Edit user
  settings/
    emails/
      page.tsx              # List templates
      [slug]/page.tsx       # Edit template
  reports/
    page.tsx                # Dashboard

lib/
  attendance.ts             # Attendance helpers
  templates.ts              # Email template rendering

components/admin/
  AttendanceChecklist.tsx
  NoteForm.tsx
  MetricCard.tsx
  ReportChart.tsx
```

---

## Migration Plan

### Order of Implementation
1. **6A: Workshop Management** - Foundation for everything else
2. **6E: Attendance** - Needed for first workshop
3. **6B: Camp Management** - Similar to workshops, extend
4. **6C: User Management** - Independent, can parallel
5. **6D: Email Templates** - Nice to have, lower priority
6. **6F: Reporting** - Build as data accumulates

### Data Migration
- Current workshops table already exists, just add columns
- Camp data currently in constants.ts → migrate to camps table
- Create camps record for "Summer Camp 2026"

---

## Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Attendance photos | Yes - admin-only, secure storage |
| Parent portal visibility | No - parents don't see attendance/notes |
| Instructor access | Later - admin enters for now |
| Notifications | Yes - waitlist promotion + reminders |
| Pricing flexibility | Later - hardcoded for now |

## Remaining Open Questions (Resolved)

| Question | Decision |
|----------|----------|
| Reminder timing | Both 1 week AND 1 day before |
| Waitlist auto-promote | Yes - auto-email with deadline, then next in line if no response |
| Survey delivery | Next day after program ends |
| Family merge | Manual admin action for now; UI shows "contact admin to merge" |

---

## Timeline

*To be determined based on priorities*

- [ ] 6A: Workshop Management
- [ ] 6E: Attendance & Notes
- [ ] 6B: Camp Management
- [ ] 6C: User Management
- [ ] 6D: Email Templates
- [ ] 6F: Reporting Dashboard
