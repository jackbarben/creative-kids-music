'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { submitCampRegistration, type CampFormState } from './actions'
import {
  FormField,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  SubmitButton,
  ChildFields,
} from '@/components/forms'

const initialState: CampFormState = {}

export default function CampRegistrationForm() {
  const [state, formAction] = useFormState(submitCampRegistration, initialState)
  const [childCount, setChildCount] = useState(1)

  const PRICE = 400
  const SIBLING_DISCOUNT = 10

  const calculateTotal = () => {
    let total = 0
    for (let i = 0; i < childCount; i++) {
      const discount = i * SIBLING_DISCOUNT
      total += Math.max(0, PRICE - discount)
    }
    return total
  }

  return (
    <form action={formAction} className="space-y-8">
      {/* Honeypot */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.error}
        </div>
      )}

      {/* Child Information */}
      <section>
        <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-4">
          Who&apos;s coming to camp?
        </h3>
        <ChildFields
          showGrade
          showSchool
          showMedical
          basePrice={PRICE}
          siblingDiscount={SIBLING_DISCOUNT}
          onTotalChange={(_, count) => setChildCount(count)}
        />
      </section>

      {/* Parent Information */}
      <section>
        <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-4">
          Parent/Guardian
        </h3>
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
          <FormField
            label="Phone"
            name="parent_phone"
            type="tel"
            required
            error={state.fieldErrors?.parent_phone}
            className="md:col-span-2"
          />
        </div>
      </section>

      {/* Emergency Contact */}
      <section>
        <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-4">
          Emergency Contact
        </h3>
        <p className="text-sm text-stone-500 mb-4">
          Someone other than the parent/guardian who can be reached in an emergency.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Name"
            name="emergency_name"
            required
            error={state.fieldErrors?.emergency_name}
          />
          <FormField
            label="Phone"
            name="emergency_phone"
            type="tel"
            required
            error={state.fieldErrors?.emergency_phone}
          />
          <FormField
            label="Relationship to child"
            name="emergency_relationship"
            placeholder="e.g., Grandparent, Aunt, Family friend"
            className="md:col-span-2"
          />
        </div>
      </section>

      {/* Payment */}
      <section>
        <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-4">
          Payment
        </h3>

        <div className="mb-6 p-4 bg-terracotta-50 rounded-lg">
          <p className="text-stone-700">
            {childCount} {childCount === 1 ? 'child' : 'children'} = <span className="font-bold text-terracotta-700">${calculateTotal()}</span>
            {childCount > 1 && (
              <span className="text-sm text-terracotta-600 ml-2">(includes sibling discount)</span>
            )}
          </p>
        </div>

        <FormRadioGroup
          label="How would you like to pay?"
          name="payment_preference"
          required
          options={[
            {
              value: 'online',
              label: 'Pay online now',
              description: 'You\'ll be directed to our payment page after registration',
            },
            {
              value: 'later',
              label: 'Pay before camp begins',
              description: 'Payment due by June 15, 2026',
            },
            {
              value: 'assistance',
              label: 'Request tuition assistance',
              description: 'We want every child to participate regardless of finances',
            },
          ]}
          error={state.fieldErrors?.payment_preference}
        />

        <FormTextarea
          label="Anything else about tuition assistance?"
          name="assistance_notes"
          className="mt-4"
          placeholder="Optional - share anything that would help us understand your situation"
        />
      </section>

      {/* Optional */}
      <section className="border-t border-stone-200 pt-8">
        <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-4">
          Optional
        </h3>
        <div className="space-y-6">
          <FormSelect
            label="How did you hear about us?"
            name="how_heard"
            options={[
              { value: 'friend', label: 'Friend or family' },
              { value: 'church', label: 'St. Luke\'s / San Lucas' },
              { value: 'school', label: 'School' },
              { value: 'social', label: 'Social media' },
              { value: 'search', label: 'Online search' },
              { value: 'workshop', label: 'Attended a workshop' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <FormTextarea
            label="What are you most excited about?"
            name="excited_about"
            rows={2}
          />
          <FormTextarea
            label="Anything else we should know?"
            name="message"
            rows={2}
          />
        </div>
      </section>

      {/* Terms */}
      <section className="border-t border-stone-200 pt-8">
        <FormCheckbox
          label={
            <>
              I accept the program terms and camp policies, including photo/video release for program use.
            </>
          }
          name="terms_accepted"
          required
          error={state.fieldErrors?.terms_accepted}
        />
      </section>

      <div className="pt-4">
        <SubmitButton>Register for Camp</SubmitButton>
      </div>
    </form>
  )
}
