'use client'

import { useFormState } from 'react-dom'
import { submitWaitlistSignup, type WaitlistFormState } from './actions'
import {
  FormField,
  FormSelect,
  FormTextarea,
  SubmitButton,
} from '@/components/forms'

const initialState: WaitlistFormState = {}

export default function WaitlistForm() {
  const [state, formAction] = useFormState(submitWaitlistSignup, initialState)

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
          Optional: Tell us about your child
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Child's name"
            name="child_name"
          />
          <FormSelect
            label="Grade (Fall 2026)"
            name="child_grade"
            options={[
              { value: '4th', label: '4th Grade' },
              { value: '5th', label: '5th Grade' },
              { value: '6th', label: '6th Grade' },
              { value: '7th', label: '7th Grade' },
              { value: '8th', label: '8th Grade' },
            ]}
          />
          <FormField
            label="School"
            name="child_school"
          />
          <FormSelect
            label="Number of children"
            name="num_children"
            options={[
              { value: '1', label: '1 child' },
              { value: '2', label: '2 children' },
              { value: '3', label: '3 children' },
              { value: '4', label: '4+ children' },
            ]}
            defaultValue="1"
          />
        </div>
      </div>

      <FormTextarea
        label="Questions or message"
        name="message"
        placeholder="Anything you'd like us to know?"
        rows={3}
      />

      <div className="pt-4">
        <SubmitButton>Join the Waitlist</SubmitButton>
      </div>
    </form>
  )
}
