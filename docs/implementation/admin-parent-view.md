# Admin Parent View Implementation

## Overview

Add a unified parent search and view feature to the admin portal. This allows administrators to search for a parent by email and see all their registrations across all programs (workshops, summer camp, music school waitlist) in a single consolidated view.

---

## Problem Statement

Currently, admin has separate views for each program type:
- `/admin/workshops` - Workshop registrations only
- `/admin/camp` - Camp registrations only
- `/admin/waitlist` - Music school waitlist only

If a parent registers for multiple programs, there's no way to see their complete history at a glance. Admins must search each section separately.

---

## Solution

Create `/admin/parents` with:
1. Search by parent email (primary) or name
2. Consolidated view showing all registrations for that parent
3. Quick links to individual registration detail pages
4. Summary stats (total spent, children registered, etc.)

---

## Database Queries

### Search Query

Search across all three tables by email:

```typescript
async function searchParentByEmail(email: string) {
  const supabase = await createClient()

  // Normalize email for search
  const normalizedEmail = email.toLowerCase().trim()

  // Query all three tables in parallel
  const [workshopResult, campResult, waitlistResult] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select('*')
      .ilike('parent_email', `%${normalizedEmail}%`)
      .order('created_at', { ascending: false }),

    supabase
      .from('camp_registrations')
      .select('*')
      .ilike('parent_email', `%${normalizedEmail}%`)
      .order('created_at', { ascending: false }),

    supabase
      .from('waitlist_signups')
      .select('*')
      .ilike('parent_email', `%${normalizedEmail}%`)
      .order('created_at', { ascending: false }),
  ])

  return {
    workshops: workshopResult.data || [],
    camp: campResult.data || [],
    waitlist: waitlistResult.data || [],
  }
}
```

### Get Children for Registrations

```typescript
async function getChildrenForRegistrations(
  workshopRegIds: string[],
  campRegIds: string[]
) {
  const supabase = await createClient()

  const [workshopChildren, campChildren] = await Promise.all([
    workshopRegIds.length > 0
      ? supabase
          .from('workshop_children')
          .select('*')
          .in('registration_id', workshopRegIds)
      : { data: [] },

    campRegIds.length > 0
      ? supabase
          .from('camp_children')
          .select('*')
          .in('registration_id', campRegIds)
      : { data: [] },
  ])

  return {
    workshopChildren: workshopChildren.data || [],
    campChildren: campChildren.data || [],
  }
}
```

---

## File Structure

```
app/admin/parents/
├── page.tsx              # Main search page with results
├── loading.tsx           # Loading skeleton
└── ParentSearch.tsx      # Client-side search component
```

---

## UI Design

### Search Page (`/admin/parents`)

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Dashboard                                             │
│                                                                 │
│ Parent Lookup                                                   │
│ Search for a parent to view all their registrations.           │
│                                                                 │
│ ┌─────────────────────────────────────────┐ ┌────────┐         │
│ │ Search by email or name...              │ │ Search │         │
│ └─────────────────────────────────────────┘ └────────┘         │
└─────────────────────────────────────────────────────────────────┘
```

### Search Results (Parent Found)

```
┌─────────────────────────────────────────────────────────────────┐
│ Parent Lookup                                                   │
│                                                                 │
│ [Search: jane@example.com                    ] [Search] [Clear] │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Jane Smith                                                  │ │
│ │ jane@example.com · (360) 555-1234                          │ │
│ │                                                             │ │
│ │ 3 registrations · 2 children · $550 total                  │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Workshop Registrations (2) ────────────────────────────────┐ │
│ │                                                             │ │
│ │ Winter/Spring 2026 Workshops                                │ │
│ │ Registered Dec 15, 2024                                     │ │
│ │ ┌──────────┐ ┌──────────┐                                   │ │
│ │ │confirmed │ │  paid    │  $150 (2 workshops × 1 child)    │ │
│ │ └──────────┘ └──────────┘                                   │ │
│ │ Children: Emma (10)                                         │ │
│ │ Workshops: Feb 20, Mar 20                          [View →] │ │
│ │                                                             │ │
│ │ ─────────────────────────────────────────────────────────── │ │
│ │                                                             │ │
│ │ Winter/Spring 2026 Workshops                                │ │
│ │ Registered Dec 20, 2024                                     │ │
│ │ ┌──────────┐ ┌──────────┐                                   │ │
│ │ │ pending  │ │ unpaid   │  $75 (1 workshop × 1 child)      │ │
│ │ └──────────┘ └──────────┘                                   │ │
│ │ Children: Liam (12)                                         │ │
│ │ Workshops: May 1                                   [View →] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Summer Camp (1) ───────────────────────────────────────────┐ │
│ │                                                             │ │
│ │ Summer Camp 2026                                            │ │
│ │ Registered Dec 18, 2024                                     │ │
│ │ ┌──────────┐ ┌──────────┐                                   │ │
│ │ │ pending  │ │ unpaid   │  $800 (2 children)               │ │
│ │ └──────────┘ └──────────┘                                   │ │
│ │ Children: Emma (10), Liam (12)                              │ │
│ │ June 22-27, 2026                                   [View →] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ ┌─ Music School Waitlist ─────────────────────────────────────┐ │
│ │                                                             │ │
│ │ Signed up Dec 10, 2024                                      │ │
│ │ ┌──────────┐                                                │ │
│ │ │contacted │  2 children interested                        │ │
│ │ └──────────┘                                       [View →] │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### No Results

```
┌─────────────────────────────────────────────────────────────────┐
│ [Search: notfound@example.com                ] [Search] [Clear] │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                         (icon)                              │ │
│ │                                                             │ │
│ │              No parent found                                │ │
│ │   No registrations found for "notfound@example.com"         │ │
│ │                                                             │ │
│ │   Try searching with a different email address.             │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Multiple Parents Match (Partial Search)

If searching by partial email or name matches multiple parents:

```
┌─────────────────────────────────────────────────────────────────┐
│ [Search: smith                               ] [Search] [Clear] │
│                                                                 │
│ 3 parents found matching "smith"                                │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │ Jane Smith · jane.smith@example.com                         │ │
│ │ 3 registrations                                    [View →] │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ John Smith · john.smith@gmail.com                           │ │
│ │ 1 registration                                     [View →] │ │
│ ├─────────────────────────────────────────────────────────────┤ │
│ │ Sarah Smithson · sarah.smithson@work.com                    │ │
│ │ 2 registrations                                    [View →] │ │
│ └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Details

### 1. Data Function (`lib/data.ts`)

```typescript
// ============================================
// PARENT LOOKUP
// ============================================

export interface ParentSearchResult {
  email: string
  name: string
  phone: string | null
  workshopRegistrations: WorkshopRegistration[]
  campRegistrations: CampRegistration[]
  waitlistSignups: WaitlistSignup[]
  workshopChildren: WorkshopChild[]
  campChildren: CampChild[]
}

export async function searchParents(query: string): Promise<ParentSearchResult[]> {
  const supabase = await createClient()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm || searchTerm.length < 2) {
    return []
  }

  // Search all three tables
  const [workshopResult, campResult, waitlistResult] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .not('status', 'eq', 'cancelled')
      .order('created_at', { ascending: false }),

    supabase
      .from('camp_registrations')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .not('status', 'eq', 'cancelled')
      .order('created_at', { ascending: false }),

    supabase
      .from('waitlist_signups')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false }),
  ])

  // Collect unique parent emails
  const parentMap = new Map<string, ParentSearchResult>()

  const addOrUpdate = (
    email: string,
    name: string,
    phone: string | null,
    type: 'workshop' | 'camp' | 'waitlist',
    registration: any
  ) => {
    const key = email.toLowerCase()
    if (!parentMap.has(key)) {
      parentMap.set(key, {
        email,
        name,
        phone,
        workshopRegistrations: [],
        campRegistrations: [],
        waitlistSignups: [],
        workshopChildren: [],
        campChildren: [],
      })
    }
    const parent = parentMap.get(key)!
    // Update name/phone if we have better data
    if (name && !parent.name) parent.name = name
    if (phone && !parent.phone) parent.phone = phone

    if (type === 'workshop') parent.workshopRegistrations.push(registration)
    if (type === 'camp') parent.campRegistrations.push(registration)
    if (type === 'waitlist') parent.waitlistSignups.push(registration)
  }

  // Process results
  for (const reg of workshopResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'workshop', reg)
  }
  for (const reg of campResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'camp', reg)
  }
  for (const signup of waitlistResult.data || []) {
    addOrUpdate(signup.parent_email, signup.parent_name, null, 'waitlist', signup)
  }

  // Get children for all registrations
  const allWorkshopIds = (workshopResult.data || []).map(r => r.id)
  const allCampIds = (campResult.data || []).map(r => r.id)

  const [workshopChildrenResult, campChildrenResult] = await Promise.all([
    allWorkshopIds.length > 0
      ? supabase.from('workshop_children').select('*').in('registration_id', allWorkshopIds)
      : { data: [] },
    allCampIds.length > 0
      ? supabase.from('camp_children').select('*').in('registration_id', allCampIds)
      : { data: [] },
  ])

  // Attach children to parents
  for (const child of workshopChildrenResult.data || []) {
    const reg = (workshopResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.workshopChildren.push(child)
    }
  }
  for (const child of campChildrenResult.data || []) {
    const reg = (campResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.campChildren.push(child)
    }
  }

  return Array.from(parentMap.values())
}
```

### 2. Page Component (`app/admin/parents/page.tsx`)

```typescript
import Link from 'next/link'
import { searchParents } from '@/lib/data'
import { getWorkshops } from '@/lib/data'
import ParentSearch from './ParentSearch'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ q?: string }>
}

export default async function ParentsAdmin({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''

  const parents = query ? await searchParents(query) : []
  const workshops = await getWorkshops()
  const workshopMap = new Map(workshops.map(w => [w.id, w]))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold text-stone-800">
          Parent Lookup
        </h1>
        <p className="text-stone-500">
          Search for a parent to view all their registrations.
        </p>
      </div>

      {/* Search */}
      <ParentSearch initialQuery={query} />

      {/* Results */}
      {query && (
        <div className="space-y-6">
          {parents.length === 0 ? (
            <NoResults query={query} />
          ) : parents.length === 1 ? (
            <ParentDetail parent={parents[0]} workshopMap={workshopMap} />
          ) : (
            <ParentList parents={parents} />
          )}
        </div>
      )}
    </div>
  )
}
```

### 3. Search Component (`app/admin/parents/ParentSearch.tsx`)

```typescript
'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface ParentSearchProps {
  initialQuery: string
}

export default function ParentSearch({ initialQuery }: ParentSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  const handleSearch = () => {
    if (!query.trim()) return
    startTransition(() => {
      router.push(`/admin/parents?q=${encodeURIComponent(query.trim())}`)
    })
  }

  const handleClear = () => {
    setQuery('')
    startTransition(() => {
      router.push('/admin/parents')
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by email or name..."
          className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
        />
        <button
          onClick={handleSearch}
          disabled={isPending || !query.trim()}
          className="px-6 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
        >
          {isPending ? 'Searching...' : 'Search'}
        </button>
        {initialQuery && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="px-4 py-2 text-stone-600 hover:text-stone-800"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
```

### 4. Loading State (`app/admin/parents/loading.tsx`)

```typescript
export default function Loading() {
  return (
    <div className="space-y-6">
      <div>
        <div className="h-4 w-32 bg-stone-200 rounded animate-pulse mb-2" />
        <div className="h-8 w-48 bg-stone-200 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-stone-200 rounded animate-pulse" />
      </div>

      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="h-10 bg-stone-100 rounded-lg animate-pulse" />
      </div>
    </div>
  )
}
```

---

## Navigation Integration

Add link to admin sidebar/dashboard:

### Dashboard Quick Actions

```typescript
// In app/admin/page.tsx, add to Quick Actions grid:
<QuickAction
  title="Parent Lookup"
  href="/admin/parents"
  description="Search by parent email"
/>
```

### Admin Layout Navigation (if applicable)

Add "Parents" to any admin navigation menu.

---

## Summary Statistics

For each parent, calculate and display:

| Stat | Calculation |
|------|-------------|
| Total Registrations | workshopRegistrations.length + campRegistrations.length |
| Total Children | Unique child names across all registrations |
| Total Amount | Sum of `total_amount_cents` from all registrations |
| Amount Paid | Sum of `amount_paid_cents` from all registrations |
| Outstanding | Total Amount - Amount Paid |

---

## Status Badges

Reuse existing badge styles:

```typescript
const getStatusBadge = (status: string) => {
  const styles: Record<string, string> = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    waitlist: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-stone-100 text-stone-500',
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-amber-100 text-amber-800',
    converted: 'bg-green-100 text-green-800',
  }
  return styles[status] || 'bg-stone-100 text-stone-600'
}

const getPaymentBadge = (status: string) => {
  const styles: Record<string, string> = {
    unpaid: 'bg-red-100 text-red-800',
    paid: 'bg-green-100 text-green-800',
    partial: 'bg-amber-100 text-amber-800',
    waived: 'bg-blue-100 text-blue-800',
  }
  return styles[status] || 'bg-stone-100 text-stone-600'
}
```

---

## Edge Cases

| Scenario | Behavior |
|----------|----------|
| Empty search | Show nothing, prompt to search |
| Query < 2 characters | Return empty results (prevent overly broad searches) |
| No results | Show "No parent found" message |
| Multiple emails match | Show list of parents to choose from |
| Exact email match | Show full detail view directly |
| Parent has cancelled registrations | Exclude cancelled by default (can add filter later) |
| Same parent, different email variations | Treated as different parents (email is key) |

---

## Future Enhancements

1. **Include cancelled registrations** - Add toggle to show/hide cancelled
2. **Parent accounts linking** - Show if parent has a user account (user_id not null)
3. **Email parent directly** - Button to compose email to parent
4. **Export parent history** - Download CSV of all registrations for one parent
5. **Merge duplicate parents** - If same person used different emails
6. **Activity timeline** - Show chronological history of all actions

---

## Files to Create/Modify

### New Files
| File | Purpose |
|------|---------|
| `app/admin/parents/page.tsx` | Main search page |
| `app/admin/parents/loading.tsx` | Loading skeleton |
| `app/admin/parents/ParentSearch.tsx` | Client-side search component |

### Modified Files
| File | Change |
|------|--------|
| `lib/data.ts` | Add `searchParents()` function |
| `app/admin/page.tsx` | Add Parent Lookup to Quick Actions |

---

## Testing Checklist

- [ ] Search by exact email returns correct parent
- [ ] Search by partial email returns matching parents
- [ ] Search by name returns matching parents
- [ ] Empty search shows prompt, no results
- [ ] Single result shows full detail view
- [ ] Multiple results show selection list
- [ ] Clicking "View" links to correct detail page
- [ ] Summary stats calculate correctly
- [ ] Children are correctly associated with registrations
- [ ] Workshop names display correctly
- [ ] Status and payment badges display correctly
- [ ] Loading state displays during search
- [ ] Clear button resets search
- [ ] Enter key triggers search
- [ ] Back to Dashboard link works
- [ ] Mobile responsive layout

---

## Implementation Order

1. Add `searchParents()` function to `lib/data.ts`
2. Create `app/admin/parents/page.tsx` with basic structure
3. Create `app/admin/parents/ParentSearch.tsx` client component
4. Create `app/admin/parents/loading.tsx` skeleton
5. Build out ParentDetail component for single result
6. Build out ParentList component for multiple results
7. Add to dashboard Quick Actions
8. Test all scenarios
9. Polish styling and responsive design
10. Update documentation (see below)

---

## Potential Issues & Mitigations

### 1. Missing Component Definitions

**Issue:** The `page.tsx` code references `NoResults`, `ParentDetail`, and `ParentList` components that aren't defined in the plan.

**Mitigation:** These should be defined inline in `page.tsx` or as separate components. Add to implementation:

```typescript
// In page.tsx - add these component definitions

function NoResults({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
      <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-stone-600 font-medium mb-1">No parent found</p>
      <p className="text-stone-500 text-sm">No registrations found for "{query}"</p>
    </div>
  )
}

function ParentList({ parents }: { parents: ParentSearchResult[] }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
      <div className="px-6 py-3 bg-stone-50 rounded-t-xl">
        <p className="text-sm text-stone-600">{parents.length} parents found</p>
      </div>
      {parents.map((parent) => (
        <Link
          key={parent.email}
          href={`/admin/parents?q=${encodeURIComponent(parent.email)}`}
          className="flex items-center justify-between px-6 py-4 hover:bg-stone-50"
        >
          <div>
            <p className="font-medium text-stone-800">{parent.name}</p>
            <p className="text-sm text-stone-500">{parent.email}</p>
          </div>
          <div className="text-sm text-stone-500">
            {parent.workshopRegistrations.length + parent.campRegistrations.length + parent.waitlistSignups.length} registration(s)
          </div>
        </Link>
      ))}
    </div>
  )
}

function ParentDetail({ parent, workshopMap }: { parent: ParentSearchResult; workshopMap: Map<string, Workshop> }) {
  // Full implementation needed - see wireframes
}
```

### 2. Type Import Requirements

**Issue:** `ParentSearchResult` interface uses `WorkshopRegistration`, `CampRegistration`, etc. which need to be imported.

**Mitigation:** Ensure types are exported from `lib/database.types.ts` and imported in `lib/data.ts`:

```typescript
import type {
  WorkshopRegistration,
  CampRegistration,
  WaitlistSignup,
  WorkshopChild,
  CampChild,
} from '@/lib/database.types'
```

### 3. Case Sensitivity in Email Matching

**Issue:** The `parentMap` uses `email.toLowerCase()` as key, but if the same parent has different capitalizations across registrations, they'll correctly merge. However, displaying the email should use the original case.

**Mitigation:** Store original email in the result, use lowercase only for the Map key (already handled in plan).

### 4. Performance with Large Datasets

**Issue:** 5 database queries per search. ilike searches without indexes can be slow.

**Mitigation:**
- Queries run in parallel (Promise.all) - good
- Consider adding database indexes if performance becomes an issue:
  ```sql
  CREATE INDEX idx_workshop_reg_email ON workshop_registrations(lower(parent_email));
  CREATE INDEX idx_camp_reg_email ON camp_registrations(lower(parent_email));
  CREATE INDEX idx_waitlist_email ON waitlist_signups(lower(parent_email));
  ```
- Current scale (likely <1000 registrations) should be fine without indexes

### 5. Workshop Data Dependency

**Issue:** Need workshop data to display workshop names, but workshops could be deleted/deactivated.

**Mitigation:** Already handled - `workshopMap.get(id)` returns undefined for missing workshops, and UI should gracefully handle this (show "Unknown Workshop" or just the ID).

### 6. Long Registration Lists

**Issue:** A parent with many registrations could result in a very long detail view.

**Mitigation:**
- Group by program type (already planned)
- Consider collapsible sections if >5 registrations per type
- For MVP, vertical scroll is acceptable

### 7. Cancelled Registrations

**Issue:** Plan excludes cancelled registrations by default, but admin might want to see full history.

**Mitigation:**
- MVP: Exclude cancelled (as planned)
- Future: Add "Include cancelled" checkbox
- Document this behavior clearly

### 8. Admin Authorization

**Issue:** Need to ensure only admins can access this page.

**Mitigation:** The admin layout already handles authentication. This page is under `/admin/` so it's protected. No additional auth code needed in the page itself.

### 9. Parent with User Account vs. Guest

**Issue:** Some parents have `user_id` (created account), others don't (guest checkout). Might be useful to show this.

**Mitigation:**
- MVP: Don't distinguish
- Future enhancement: Show "Has Account" badge if any registration has `user_id` set

### 10. URL Query Encoding

**Issue:** Email addresses with special characters (like `+`) need proper URL encoding.

**Mitigation:** Already handled with `encodeURIComponent()` in the search component.

---

## Post-Implementation Documentation

After implementation is complete, update the following documentation:

### 1. Update CLAUDE.md

Add to the Admin Pages table:

```markdown
| `/admin/parents` | Parent lookup - search across all programs |
```

### 2. Update changelog.md

Add entry with:
- Summary of feature
- Files created/modified
- Key functionality

### 3. Update admin.md

Add section documenting the Parent Lookup feature:
- How to access
- Search functionality
- What information is displayed
- Use cases

### 4. Convert This Document

After implementation, this document should be:
1. Moved/copied to `/docs/features/admin-parent-lookup.md` (or similar)
2. Updated to reflect any changes made during implementation
3. Code snippets updated to match actual implementation
4. Testing checklist converted to "verified" status
5. Remove implementation-specific sections (like "Implementation Order")
6. Add "How to Use" section for end users/admins

### Final Documentation Structure

```
docs/
├── implementation/
│   └── admin-parent-view.md    # Archive or delete after completion
└── features/
    └── admin-families.md       # Final user-facing documentation
```

---

## Future Enhancement: Multi-Adult Households

### Problem

Currently, a "family" is identified by a single email address. This doesn't accommodate:
- **Co-parents** with separate email addresses
- **Grandparents** who register children
- **Nannies/caregivers** who might sign up on behalf of a family
- **Divorced parents** who need separate access to the same child's info

### Proposed Solution

Add support for **linked family accounts** where multiple adults can be associated with the same family unit.

#### Database Changes

```sql
-- New table for family groups
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,  -- e.g., "Smith Family"
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link users to families (many-to-many)
CREATE TABLE family_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),  -- Optional: linked account
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'parent',  -- parent, grandparent, guardian, etc.
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(family_id, email)
);

-- Update registrations to link to family instead of individual
ALTER TABLE workshop_registrations ADD COLUMN family_id UUID REFERENCES families(id);
ALTER TABLE camp_registrations ADD COLUMN family_id UUID REFERENCES families(id);
```

#### Features

1. **Family Creation**
   - Auto-create family when first registration is made
   - Use parent name as default family name ("Smith Family")

2. **Invite Additional Adults**
   - From parent portal: "Add another adult to this family"
   - Enter email → sends invite link
   - Invited adult creates account or logs in → linked to family

3. **Shared Access**
   - All linked adults can view family registrations
   - All can edit contact info, children, pickups
   - All receive confirmation emails

4. **Smart Matching**
   - When registering, check if child name matches existing family
   - Prompt: "Is this the same [Child Name] registered by [Other Parent]?"
   - If yes, link to existing family

5. **Admin View**
   - Families page shows all linked adults
   - Can see who registered what
   - Can manually link/unlink adults

#### UI Changes

**Parent Portal:**
```
┌─────────────────────────────────────────┐
│ Smith Family                            │
│                                         │
│ Adults:                                 │
│ • Jane Smith (you) - Primary            │
│ • John Smith - john@example.com         │
│ • Grandma Mary - mary@example.com       │
│                                         │
│ [+ Invite Another Adult]                │
└─────────────────────────────────────────┘
```

**Admin Families Page:**
```
┌─────────────────────────────────────────┐
│ Smith Family                            │
│                                         │
│ Adults:                                 │
│ • Jane Smith · jane@example.com         │
│ • John Smith · john@example.com         │
│                                         │
│ Children: Emma (10), Jack (8)           │
│ Registrations: 3                        │
└─────────────────────────────────────────┘
```

#### Implementation Priority

This is a **future enhancement** - not needed for initial launch. Current single-email model works fine for MVP.

**When to implement:**
- If users request it
- When handling divorced parent situations becomes common
- Before music school launch (longer-term relationships)

#### Migration Path

1. Create families table
2. Auto-create family for each unique email
3. Link existing registrations to families
4. Add family_id to new registrations
5. Keep email-based lookup as fallback
