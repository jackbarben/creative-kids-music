# Registration System Expansion - Implementation Plan

**Created**: December 2024
**Status**: In Progress

This document outlines the expansion of the registration system to include:
- Account-level parent/guardian info and settings
- Account-level children profiles (reusable across events)
- Expanded registration fields for workshops and camp
- Waivers and media consent system

---

## Phase 1: Database Schema Changes

### 1.1 New Tables

#### `account_children`
Store children at account level for reuse across registrations.

```sql
CREATE TABLE account_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,  -- Optional, for music school
  school TEXT,
  allergies TEXT,
  dietary_restrictions TEXT,
  medical_conditions TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_account_children_user ON account_children(user_id);
```

#### `account_settings`
Store parent/guardian info and defaults at account level.

```sql
CREATE TABLE account_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Primary parent/guardian
  parent_first_name TEXT,
  parent_last_name TEXT,
  parent_relationship TEXT,  -- 'mother', 'father', 'guardian', 'grandparent', 'other'
  parent_phone TEXT,

  -- Second parent/guardian (optional)
  parent2_first_name TEXT,
  parent2_last_name TEXT,
  parent2_relationship TEXT,
  parent2_phone TEXT,
  parent2_email TEXT,

  -- Emergency contact
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relationship TEXT,

  -- Default authorized pickups (JSON array)
  default_pickups JSONB DEFAULT '[]',

  -- Default media consent level
  default_media_consent TEXT DEFAULT 'internal_only',  -- 'internal_only', 'external_allowed', 'none'

  -- Communication preferences
  email_reminders BOOLEAN DEFAULT TRUE,
  email_updates BOOLEAN DEFAULT TRUE,

  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX idx_account_settings_user ON account_settings(user_id);
```

### 1.2 Modify Existing Tables

#### `workshop_registrations` - Add fields
```sql
ALTER TABLE workshop_registrations ADD COLUMN IF NOT EXISTS
  parent_first_name TEXT,
  parent_last_name TEXT,
  parent_relationship TEXT,
  emergency_name TEXT,
  emergency_phone TEXT,
  emergency_relationship TEXT,
  liability_waiver_accepted BOOLEAN DEFAULT FALSE,
  liability_waiver_accepted_at TIMESTAMPTZ,
  media_consent_level TEXT DEFAULT 'none',  -- 'internal_only', 'external_allowed', 'none'
  media_consent_accepted_at TIMESTAMPTZ;
```

#### `workshop_children` - Add fields
```sql
ALTER TABLE workshop_children ADD COLUMN IF NOT EXISTS
  account_child_id UUID REFERENCES account_children(id),
  first_name TEXT,  -- Replaces child_name
  last_name TEXT,
  allergies TEXT,
  dietary_restrictions TEXT,
  medical_conditions TEXT;

-- Rename child_name to first_name if exists
-- ALTER TABLE workshop_children RENAME COLUMN child_name TO first_name;
```

#### `workshop_authorized_pickups` - New table
```sql
CREATE TABLE workshop_authorized_pickups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES workshop_registrations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  relationship TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workshop_pickups_reg ON workshop_authorized_pickups(registration_id);
```

#### `camp_registrations` - Add fields
```sql
ALTER TABLE camp_registrations ADD COLUMN IF NOT EXISTS
  parent_first_name TEXT,
  parent_last_name TEXT,
  parent_relationship TEXT,
  parent2_first_name TEXT,
  parent2_last_name TEXT,
  parent2_relationship TEXT,
  parent2_phone TEXT,
  parent2_email TEXT,
  liability_waiver_accepted BOOLEAN DEFAULT FALSE,
  liability_waiver_accepted_at TIMESTAMPTZ,
  media_consent_level TEXT DEFAULT 'none',
  media_consent_accepted_at TIMESTAMPTZ,
  behavior_agreement_accepted BOOLEAN DEFAULT FALSE,
  behavior_agreement_accepted_at TIMESTAMPTZ;
```

#### `camp_children` - Add fields
```sql
ALTER TABLE camp_children ADD COLUMN IF NOT EXISTS
  account_child_id UUID REFERENCES account_children(id),
  first_name TEXT,
  last_name TEXT,
  tshirt_size TEXT;  -- 'YS', 'YM', 'YL', 'AS', 'AM', 'AL'
```

### 1.3 RLS Policies

```sql
-- account_children
ALTER TABLE account_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own children" ON account_children
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own children" ON account_children
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own children" ON account_children
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own children" ON account_children
  FOR DELETE USING (auth.uid() = user_id);

-- account_settings
ALTER TABLE account_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own settings" ON account_settings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own settings" ON account_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own settings" ON account_settings
  FOR UPDATE USING (auth.uid() = user_id);

-- workshop_authorized_pickups
ALTER TABLE workshop_authorized_pickups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own workshop pickups" ON workshop_authorized_pickups
  FOR SELECT USING (
    registration_id IN (
      SELECT id FROM workshop_registrations WHERE user_id = auth.uid()
    )
  );
```

---

## Phase 2: Account Settings Page

### 2.1 Page Structure (`/account/settings`)

```
┌─────────────────────────────────────────────────────────────┐
│ Account Settings                                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ LOGIN & SECURITY                                            │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Email: jackbarben3@gmail.com              [Change]      ││
│ │ Password: ••••••••                        [Change]      ││
│ │ (or "Managed by Google" if OAuth user)                  ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ PARENT/GUARDIAN INFORMATION                                 │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Primary Parent/Guardian                                 ││
│ │ First Name: [Jack          ] Last Name: [Barben       ]││
│ │ Relationship: [Father ▼    ] Phone: [(360) 524-2265  ]││
│ │                                                         ││
│ │ Second Parent/Guardian (Optional)        [+ Add]       ││
│ │ First Name: [             ] Last Name: [             ] ││
│ │ Relationship: [          ▼] Phone: [                 ] ││
│ │ Email: [                                             ] ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ EMERGENCY CONTACT                                           │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Name: [                   ] Phone: [                  ]││
│ │ Relationship: [                                       ]││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ DEFAULT AUTHORIZED PICKUPS                                  │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ These people are pre-filled when you register.         ││
│ │                                                         ││
│ │ 1. Name: [            ] Phone: [         ] [Remove]   ││
│ │ 2. Name: [            ] Phone: [         ] [Remove]   ││
│ │                                      [+ Add Pickup]    ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ STANDING PERMISSIONS                                        │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Default Media Consent:                                  ││
│ │ ○ Internal use only (newsletters, private sharing)     ││
│ │ ○ External use allowed (website, social media)         ││
│ │ ○ No photos/videos                                      ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ COMMUNICATION PREFERENCES                                   │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ ☑ Event reminders and updates                          ││
│ │ ☑ Program announcements and news                       ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│                                          [Save Changes]     │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Files to Create/Modify

- `app/account/settings/page.tsx` - Main settings page (enhance existing)
- `components/account/ParentInfoForm.tsx` - Parent/guardian info section
- `components/account/EmergencyContactForm.tsx` - Emergency contact section
- `components/account/DefaultPickupsForm.tsx` - Default pickups management
- `components/account/MediaConsentForm.tsx` - Standing permissions
- `components/account/CommunicationPrefsForm.tsx` - Email preferences
- `app/account/actions.ts` - Add settings actions

---

## Phase 3: Account Children Management

### 3.1 Children Section on Dashboard (`/account`)

```
┌─────────────────────────────────────────────────────────────┐
│ YOUR CHILDREN                                    [+ Add]    │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Emma Barben                                             ││
│ │ Age 11 · Lincoln Elementary                             ││
│ │ Allergies: Peanuts · Medical: Asthma                    ││
│ │                                        [Edit] [Remove]  ││
│ └─────────────────────────────────────────────────────────┘│
│ ┌─────────────────────────────────────────────────────────┐│
│ │ Lucas Barben                                            ││
│ │ Age 9 · Lincoln Elementary                              ││
│ │ No allergies or medical conditions noted                ││
│ │                                        [Edit] [Remove]  ││
│ └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Add Child Modal

```
┌─────────────────────────────────────────────────────────────┐
│ Add Child                                              [X]  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ First Name *          Last Name *                           │
│ [                   ] [                   ]                 │
│                                                             │
│ Age *                 School                                │
│ [    ]                [                              ]      │
│                                                             │
│ Allergies                                                   │
│ [                                                    ]      │
│                                                             │
│ Dietary Restrictions                                        │
│ [                                                    ]      │
│                                                             │
│ Medical Conditions                                          │
│ [                                                    ]      │
│                                                             │
│ Notes (optional)                                            │
│ [                                                    ]      │
│                                                             │
│                              [Cancel]  [Save Child]         │
└─────────────────────────────────────────────────────────────┘
```

### 3.3 Files to Create/Modify

- `app/account/page.tsx` - Add children section
- `components/account/ChildrenSection.tsx` - Children list component
- `components/account/AddAccountChildModal.tsx` - Add child modal
- `components/account/EditAccountChildModal.tsx` - Edit child modal
- `components/account/RemoveAccountChildModal.tsx` - Remove confirmation
- `app/account/actions.ts` - Add children CRUD actions

---

## Phase 4: Workshop Registration Form Updates

### 4.1 Form Sections

1. **Account Section** (existing)
   - Email field with login/signup

2. **Parent/Guardian Section** (new)
   - First name, last name, relationship, phone
   - Pre-fill from account settings if logged in

3. **Emergency Contact Section** (new)
   - Name, phone, relationship
   - Pre-fill from account settings

4. **Children Section** (enhanced)
   - Show account children to select
   - Or add new child inline
   - Age validation (9-13)

5. **Authorized Pickups Section** (new)
   - 2 pickup people
   - Pre-fill from account defaults

6. **Workshop Selection** (existing)
   - Multi-select workshops

7. **Payment Section** (existing)
   - Payment method options

8. **Agreements Section** (new)
   - Liability waiver checkbox with link to terms
   - Media consent radio (3 options)
   - Terms acceptance (existing)

9. **Optional Section** (existing)
   - How heard, excited about, message

### 4.2 Files to Modify

- `app/workshops/WorkshopRegistrationForm.tsx` - Add new sections
- `app/workshops/actions.ts` - Handle new fields
- `components/forms/ParentSection.tsx` - New component
- `components/forms/EmergencySection.tsx` - New component
- `components/forms/ChildrenSection.tsx` - Enhanced component
- `components/forms/PickupsSection.tsx` - New component
- `components/forms/AgreementsSection.tsx` - New component

---

## Phase 5: Camp Registration Form Updates

### 5.1 Additional Fields Beyond Workshop

- Second parent/guardian (optional)
- 3 authorized pickups (vs 2 for workshop)
- T-shirt size per child
- Behavior expectations agreement
- Extended medical info already exists

### 5.2 Files to Modify

- `app/summer-camp/CampRegistrationForm.tsx` - Add new sections
- `app/summer-camp/actions.ts` - Handle new fields

---

## Phase 6: Pre-fill Logic

### 6.1 When User is Logged In

1. Fetch `account_settings` for user
2. Pre-fill parent info, emergency contact
3. Fetch `account_children` for user
4. Show as selectable options in children section
5. Pre-fill default pickups from settings
6. Pre-fill media consent from default

### 6.2 Data Flow

```
User logs in
    ↓
Fetch account_settings + account_children
    ↓
Pre-fill form fields
    ↓
User can modify/add as needed
    ↓
On submit:
  - Save new children to account_children
  - Link registration children to account_child_id
  - Store registration-specific overrides
```

---

## Implementation Checklist

### Database
- [ ] Create migration `004_registration_expansion.sql`
- [ ] Add `account_children` table
- [ ] Add `account_settings` table
- [ ] Add `workshop_authorized_pickups` table
- [ ] Alter `workshop_registrations` with new columns
- [ ] Alter `workshop_children` with new columns
- [ ] Alter `camp_registrations` with new columns
- [ ] Alter `camp_children` with new columns
- [ ] Add RLS policies for new tables
- [ ] Run migration

### Account Settings Page
- [ ] Create/enhance `/account/settings/page.tsx`
- [ ] Create `ParentInfoForm.tsx`
- [ ] Create `EmergencyContactForm.tsx`
- [ ] Create `DefaultPickupsForm.tsx`
- [ ] Create `MediaConsentForm.tsx`
- [ ] Create `CommunicationPrefsForm.tsx`
- [ ] Add settings actions to `app/account/actions.ts`

### Account Children
- [ ] Create `ChildrenSection.tsx` for dashboard
- [ ] Create `AddAccountChildModal.tsx`
- [ ] Create `EditAccountChildModal.tsx`
- [ ] Create `RemoveAccountChildModal.tsx`
- [ ] Add children CRUD actions
- [ ] Update `/account/page.tsx` to include children section

### Workshop Registration
- [ ] Create `ParentSection.tsx` form component
- [ ] Create `EmergencySection.tsx` form component
- [ ] Enhance `ChildrenSection.tsx` with account children
- [ ] Create `PickupsSection.tsx` form component
- [ ] Create `AgreementsSection.tsx` form component
- [ ] Update `WorkshopRegistrationForm.tsx`
- [ ] Update `app/workshops/actions.ts`

### Camp Registration
- [ ] Update `CampRegistrationForm.tsx` with all new sections
- [ ] Add second parent fields
- [ ] Add 3rd pickup field
- [ ] Add t-shirt size to children
- [ ] Add behavior agreement
- [ ] Update `app/summer-camp/actions.ts`

### Testing
- [ ] Test account settings save/load
- [ ] Test account children CRUD
- [ ] Test workshop registration with pre-fill
- [ ] Test camp registration with pre-fill
- [ ] Test new user flow (no account data)
- [ ] Test returning user flow (with account data)
- [ ] Verify RLS policies block cross-user access

---

## Notes

- Age field kept for workshops/camp (DOB optional for music school later)
- Children saved to account on registration submit
- Registration stores `account_child_id` as reference
- Registration also stores snapshot of child data (in case account child is edited later)
- Media consent stored per-registration (can differ per event)
- Liability waiver required for each registration
