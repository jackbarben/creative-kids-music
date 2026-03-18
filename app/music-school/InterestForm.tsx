'use client'

import { useFormState } from 'react-dom'
import { submitInterestSurvey, type InterestFormState } from './actions'
import {
  FormField,
  FormSelect,
  FormTextarea,
  FormRadioGroup,
  SubmitButton,
} from '@/components/forms'

const initialState: InterestFormState = {}

export default function InterestForm() {
  const [state, formAction] = useFormState(submitInterestSurvey, initialState)

  return (
    <form action={formAction} className="space-y-6">
      {/* Honeypot field - hidden from users, visible to bots */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label="Your name"
          name="parent_name"
          required
          error={state.fieldErrors?.parent_name}
        />
        <FormField
          label="Email"
          name="parent_email"
          type="email"
          required
          error={state.fieldErrors?.parent_email}
        />
      </div>

      <div className="border-t border-stone-200 pt-6">
        <p className="text-sm text-stone-500 mb-4">
          Tell us about your child
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Child's name"
            name="child_name"
          />
          <FormSelect
            label="Grade (Fall 2026)"
            name="child_grade"
            required
            options={[
              { value: '3rd', label: '3rd Grade' },
              { value: '4th', label: '4th Grade' },
              { value: '5th', label: '5th Grade' },
              { value: '6th', label: '6th Grade' },
              { value: '7th', label: '7th Grade' },
            ]}
          />
          <FormField
            label="School"
            name="child_school"
          />
          <FormSelect
            label="Number of children"
            name="num_children"
            required
            options={[
              { value: '1', label: '1 child' },
              { value: '2', label: '2 children' },
              { value: '3', label: '3 children' },
              { value: '4', label: '4+ children' },
            ]}
          />
        </div>
      </div>

      {/* Survey Questions */}
      <div className="border-t border-stone-200 pt-6 space-y-8">
        <p className="text-sm text-stone-500 mb-4">
          Help us understand your interest
        </p>

        {/* Question 1: 3 days a week */}
        <div className="space-y-3">
          <FormRadioGroup
            label="Would you consider a 3-day-a-week after-school music program for your child?"
            name="consider_3days"
            required
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={state.fieldErrors?.consider_3days}
          />
          <FormField
            label="Tell us more (optional)"
            name="consider_3days_notes"
            placeholder="Any thoughts on the schedule..."
          />
        </div>

        {/* Question 2: Transportation */}
        <div className="space-y-3">
          <FormRadioGroup
            label="If we offered transportation, would that affect your decision?"
            name="transportation_affects"
            required
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={state.fieldErrors?.transportation_affects}
          />
          <FormField
            label="Tell us more (optional)"
            name="transportation_notes"
            placeholder="Any details about transportation needs..."
          />
        </div>

        {/* Question 3: Tuition Assistance */}
        <div className="space-y-3">
          <FormRadioGroup
            label="Would tuition assistance affect your decision?"
            name="tuition_assistance_affects"
            required
            options={[
              { value: 'yes', label: 'Yes' },
              { value: 'no', label: 'No' },
            ]}
            error={state.fieldErrors?.tuition_assistance_affects}
          />
          <FormField
            label="Tell us more (optional)"
            name="tuition_assistance_notes"
            placeholder="Any details about financial considerations..."
          />
        </div>
      </div>

      <FormTextarea
        label="What would you like to know?"
        name="message"
        placeholder="Any questions about the program?"
        rows={3}
      />

      <div className="pt-4">
        <SubmitButton>Share Your Interest</SubmitButton>
      </div>
    </form>
  )
}
