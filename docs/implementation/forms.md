# Registration Forms

Documentation for the registration form system.

---

## Overview

Three registration forms collect signups for different programs:

| Form | Route | Database Tables |
|------|-------|-----------------|
| Music School Waitlist | `/music-school` | `waitlist_signups` |
| Workshop Registration | `/workshops/register` | `workshop_registrations`, `workshop_children` |
| Summer Camp Registration | `/summer-camp/register` | `camp_registrations`, `camp_children` |

---

## Form Components

Reusable form components in `/components/forms/`:

| Component | Purpose |
|-----------|---------|
| `FormField` | Text, email, phone, number inputs |
| `FormTextarea` | Multi-line text |
| `FormSelect` | Dropdown select |
| `FormCheckbox` | Single checkbox |
| `FormRadioGroup` | Radio button group |
| `SubmitButton` | Submit with pending state |
| `ChildFields` | Multi-child entry with discounts |
| `AccountSection` | Email entry with inline login/signup |

### Usage

```tsx
import { FormField, FormSelect, SubmitButton } from '@/components/forms'

<FormField
  label="Email"
  name="email"
  type="email"
  required
  error={state.fieldErrors?.email}
/>
```

---

## Multi-Child Support

The `ChildFields` component handles adding/removing children with automatic sibling discounts.

```tsx
<ChildFields
  showGrade        // Show grade dropdown
  showSchool       // Show school field
  showMedical      // Show allergy/medical fields
  basePrice={75}   // Base price per child
  siblingDiscount={10}  // Discount per additional child
  onTotalChange={(total, count) => setChildCount(count)}
/>
```

**Discount Structure:**
- 1st child: Full price
- 2nd child: $10 off
- 3rd child: $20 off
- etc.

Child data is submitted as indexed fields: `child_name_0`, `child_age_0`, `child_name_1`, etc.

---

## Account Section

The `AccountSection` component handles inline account creation/login during registration.

```tsx
<AccountSection
  email={email}
  onEmailChange={setEmail}
  onUserChange={() => {}}
  error={state.fieldErrors?.parent_email}
/>
```

### How It Works

1. User enters email address
2. On blur, system checks if email exists in Supabase Auth
3. Shows different UI based on state:

| State | UI Shown |
|-------|----------|
| `idle` | Just email input |
| `checking` | Loading spinner |
| `new_user` | Password fields + Google OAuth option |
| `existing_user` | Login form (password or Google) |
| `logged_in` | Confirmation with sign-out option |

### Hidden Fields

The component adds hidden fields to the form:
- `user_id` - The logged-in user's ID (if any)
- `password` - New password for account creation
- `confirm_password` - Password confirmation

### Google OAuth Flow

When user clicks "Continue with Google":
1. Form state saved to sessionStorage
2. User redirects to Google
3. After auth, returns to form
4. Form detects logged-in state and continues

---

## Server Actions

Each form has a server action in its route folder:

- `/app/music-school/actions.ts` - `submitWaitlistSignup`
- `/app/workshops/actions.ts` - `submitWorkshopRegistration`
- `/app/summer-camp/actions.ts` - `submitCampRegistration`

### Action Pattern

```tsx
'use server'

export type FormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitForm(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // 1. Honeypot check
  if (formData.get('website')) {
    redirect('/thank-you')  // Silently reject bots
  }

  // 2. Extract and validate
  const email = formData.get('email') as string
  if (!email?.includes('@')) {
    return { fieldErrors: { email: 'Invalid email' } }
  }

  // 3. Insert to database
  const supabase = await createClient()
  const { error } = await supabase.from('table').insert({...})

  if (error) {
    return { error: 'Something went wrong.' }
  }

  // 4. Redirect on success
  redirect('/thank-you')
}
```

---

## Spam Prevention

All forms include a honeypot field:

```tsx
<div className="hidden" aria-hidden="true">
  <label htmlFor="website">Website</label>
  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
</div>
```

If filled (by bots), the form silently redirects to success without saving.

---

## Validation

### Client-side
- Required fields use HTML `required` attribute
- Age fields have `min`/`max` constraints
- Errors display below fields in red

### Server-side
- All required fields validated
- Email format checked
- Age range soft warnings (9-13)
- Field errors returned to form for display

---

## Payment Preferences

All paid forms offer three options:

| Value | Label | Description |
|-------|-------|-------------|
| `online` | Pay online now | Redirect to payment after registration |
| `later` | Pay later | Payment due before program starts |
| `assistance` | Tuition assistance | Request financial help |

When `assistance` is selected, an optional notes field appears.

---

## Confirmation Pages

Each form redirects to a thank-you page on success:

- `/music-school/thank-you`
- `/workshops/thank-you`
- `/summer-camp/thank-you`

---

## Database Schema

### Waitlist Signups
```
parent_name, parent_email (required)
child_name, child_grade, child_school, num_children, message (optional)
```

### Workshop Registrations
```
Parent: parent_name, parent_email (required), parent_phone (optional)
Workshops: workshop_ids[] (array of selected workshop IDs)
Payment: payment_method, tuition_assistance, total_amount_cents
Terms: terms_accepted, terms_accepted_at
Optional: how_heard, excited_about, message
```

### Workshop Children
```
registration_id, child_name, child_age (required)
child_school, discount_cents (optional)
```

### Camp Registrations
```
Parent: parent_name, parent_email, parent_phone (all required)
Emergency: emergency_name, emergency_phone (required), emergency_relationship (optional)
Payment: payment_method, tuition_assistance, total_amount_cents
Terms: terms_accepted, terms_accepted_at
Optional: how_heard, excited_about, message
```

### Camp Children
```
registration_id, child_name, child_age (required)
child_grade, child_school (optional)
allergies, medical_conditions, special_needs (optional)
discount_cents
```
