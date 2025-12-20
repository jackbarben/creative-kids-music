'use client'

import { useState } from 'react'
import { useFormState } from 'react-dom'
import { submitWorkshopRegistration, type WorkshopFormState } from './actions'
import {
  FormField,
  FormTextarea,
  FormSelect,
  FormCheckbox,
  FormRadioGroup,
  SubmitButton,
  ChildFields,
} from '@/components/forms'
import type { Workshop } from '@/lib/database.types'

interface WorkshopRegistrationFormProps {
  workshops: Workshop[]
}

const initialState: WorkshopFormState = {}

export default function WorkshopRegistrationForm({ workshops }: WorkshopRegistrationFormProps) {
  const [state, formAction] = useFormState(submitWorkshopRegistration, initialState)
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([])
  const [childCount, setChildCount] = useState(1)
  const [paymentPreference, setPaymentPreference] = useState('')
  const [howHeard, setHowHeard] = useState('')

  const PRICE = 75
  const SIBLING_DISCOUNT = 10

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const calculateTotal = () => {
    let perWorkshopTotal = 0
    for (let i = 0; i < childCount; i++) {
      const discount = i * SIBLING_DISCOUNT
      perWorkshopTotal += Math.max(0, PRICE - discount)
    }
    return perWorkshopTotal * selectedWorkshops.length
  }

  const handleWorkshopChange = (workshopId: string, checked: boolean) => {
    if (checked) {
      setSelectedWorkshops([...selectedWorkshops, workshopId])
    } else {
      setSelectedWorkshops(selectedWorkshops.filter(id => id !== workshopId))
    }
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

      {/* Workshop Selection */}
      <section>
        <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
          Which workshops?
        </h3>
        {state.fieldErrors?.workshop_ids && (
          <p className="mb-2 text-sm text-red-600">{state.fieldErrors.workshop_ids}</p>
        )}
        <div className="space-y-3">
          {workshops.map((workshop) => (
            <label key={workshop.id} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="workshop_ids"
                value={workshop.id}
                onChange={(e) => handleWorkshopChange(workshop.id, e.target.checked)}
                className="h-5 w-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
              />
              <span className="text-stone-700">
                {formatDate(workshop.date)}
              </span>
            </label>
          ))}
        </div>
      </section>

      {/* Child Information */}
      <section>
        <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
          Who&apos;s coming?
        </h3>
        <ChildFields
          showSchool
          basePrice={PRICE}
          siblingDiscount={SIBLING_DISCOUNT}
          onTotalChange={(_, count) => setChildCount(count)}
        />
      </section>

      {/* Parent Information */}
      <section>
        <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
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
            className="md:col-span-2"
          />
        </div>
      </section>

      {/* Payment */}
      <section>
        <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
          Payment
        </h3>

        {selectedWorkshops.length > 0 && (
          <div className="mb-6 p-4 bg-forest-50 rounded-lg">
            <p className="text-stone-700">
              {childCount} {childCount === 1 ? 'child' : 'children'} × {selectedWorkshops.length} {selectedWorkshops.length === 1 ? 'workshop' : 'workshops'} = <span className="font-bold text-forest-700">${calculateTotal()}</span>
              {childCount > 1 && (
                <span className="text-sm text-forest-600 ml-2">(includes sibling discount)</span>
              )}
            </p>
          </div>
        )}

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
              label: 'Pay before the workshop',
              description: 'Must be paid online before start time (no cash or check)',
            },
            {
              value: 'assistance',
              label: 'Request tuition assistance',
              description: 'We want every child to participate regardless of finances',
            },
          ]}
          error={state.fieldErrors?.payment_preference}
        />

        <div className="mt-4">
          <input
            type="hidden"
            name="payment_preference_hidden"
            value={paymentPreference}
          />
          <div className="space-y-3">
            {['online', 'later', 'assistance'].map((value) => (
              <input
                key={value}
                type="radio"
                name="payment_preference_tracker"
                value={value}
                className="sr-only"
                onChange={(e) => setPaymentPreference(e.target.value)}
              />
            ))}
          </div>
        </div>

        <FormTextarea
          label="Anything else about tuition assistance?"
          name="assistance_notes"
          className="mt-4"
          placeholder="Optional - share anything that would help us understand your situation"
        />
      </section>

      {/* Optional */}
      <section className="border-t border-stone-200 pt-8">
        <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
          Optional
        </h3>
        <div className="space-y-6">
          <div>
            <FormSelect
              label="How did you hear about us?"
              name="how_heard"
              options={[
                { value: 'friend', label: 'Friend or family' },
                { value: 'church', label: 'St. Luke\'s / San Lucas' },
                { value: 'school', label: 'School' },
                { value: 'social', label: 'Social media' },
                { value: 'search', label: 'Online search' },
                { value: 'other', label: 'Other' },
              ]}
              onChange={(e) => setHowHeard(e.target.value)}
            />
            {howHeard === 'other' && (
              <FormField
                label="Please specify"
                name="how_heard_other"
                className="mt-3"
                placeholder="How did you hear about us?"
              />
            )}
          </div>
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
              I accept the program terms and understand the workshop policies.
            </>
          }
          name="terms_accepted"
          required
          error={state.fieldErrors?.terms_accepted}
        />
      </section>

      <div className="pt-4">
        <SubmitButton>Register</SubmitButton>
      </div>
    </form>
  )
}
