# Phase 6: Program & User Management

## Overview

Full CRUD system for managing workshops, camps, users, and program data. Includes attendance tracking, instructor notes, media management, and reporting.

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

## Curriculum Data Collection

### Per Program
| Data | Purpose |
|------|---------|
| Instruments used | Inventory planning, variety tracking |
| Songs/pieces | Curriculum library building |
| Guest instructors | Who taught what |
| Activities | What worked, what didn't |
| Theme/focus | Program differentiation |

### Per Child (Instructor Notes)
| Data | Purpose |
|------|---------|
| Instruments tried/played | Track progression |
| Engagement level | Identify needs |
| Standout moments | Parent sharing, testimonials |
| Challenges/struggles | Accommodation needs |
| Recommended next steps | Continuity between programs |

### Per Instructor (Future)
| Data | Purpose |
|------|---------|
| Specialties | Assignment planning |
| Availability | Scheduling |
| Notes/observations | Knowledge capture |

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

### 6C: User Management
**Goal:** Full CRUD on parent accounts

#### New Pages
- `/admin/users` - List all users with search
- `/admin/users/[id]` - User detail with all data
- `/admin/users/[id]/edit` - Edit user info

#### Features
- Search by name, email, phone
- View all registrations, children, payment history
- Edit contact info, emergency defaults
- Add admin notes
- Merge duplicate accounts
- Delete account (with options: keep data anonymized, or full delete)

#### Merge Logic
```typescript
// When merging user B into user A:
// 1. Update all registrations with user_id = B to user_id = A
// 2. Merge children (dedupe by name/age)
// 3. Merge account_settings (prefer A, fill gaps from B)
// 4. Log the merge in activity
// 5. Delete user B
```

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

### 6E: Attendance & Notes
**Goal:** Track who showed up, capture instructor observations

#### Database
```sql
-- Attendance records
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_type VARCHAR(20) NOT NULL, -- 'workshop' or 'camp'
  program_id UUID NOT NULL,
  program_date DATE NOT NULL, -- For camps with multiple days
  child_id UUID NOT NULL,
  status VARCHAR(20) DEFAULT 'unknown', -- present, absent, late, excused
  check_in_time TIMESTAMPTZ,
  check_out_time TIMESTAMPTZ,
  checked_in_by VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Instructor notes per child
CREATE TABLE IF NOT EXISTS child_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL,
  program_type VARCHAR(20),
  program_id UUID,
  note_type VARCHAR(50), -- 'observation', 'progress', 'incident', 'recommendation'
  content TEXT NOT NULL,
  instruments_played TEXT[], -- Array of instruments
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### UI
- Attendance: Checklist with photo roster (if we have photos)
- Notes: Quick-add form during/after program
- View: Timeline of notes per child across programs

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

## Open Questions

1. **Attendance photos**: Should we store child photos for easier check-in? Privacy implications?

2. **Parent portal visibility**: Should parents see their child's attendance history? Notes?

3. **Instructor access**: Do instructors need their own login to add notes? Or admin-only?

4. **Notification system**: Auto-email when promoted from waitlist? Reminder emails before program?

5. **Pricing flexibility**: Per-workshop pricing vs. season passes? Early bird discounts?

---

## Timeline

*To be determined based on priorities*

- [ ] 6A: Workshop Management
- [ ] 6E: Attendance & Notes
- [ ] 6B: Camp Management
- [ ] 6C: User Management
- [ ] 6D: Email Templates
- [ ] 6F: Reporting Dashboard
