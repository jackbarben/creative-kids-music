'use client'

import { useState, useEffect, useCallback } from 'react'
import { useFormState } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { submitWorkshopRegistration, type WorkshopFormState } from './actions'
import {
  FormTextarea,
  FormSelect,
  FormRadioGroup,
  SubmitButton,
  ChildFields,
  ChildrenSelectionSection,
  AccountSection,
  ParentSection,
  EmergencyContactSection,
  AuthorizedPickupsSection,
  AgreementsSection,
} from '@/components/forms'
import type { SelectedChild } from '@/components/forms'
import type { Workshop } from '@/lib/database.types'
import type { User } from '@supabase/supabase-js'
import type { AccountSettings } from '@/app/account/actions'

interface WorkshopRegistrationFormProps {
  workshops: Workshop[]
}

const initialState: WorkshopFormState = {}

export default function WorkshopRegistrationForm({ workshops }: WorkshopRegistrationFormProps) {
  const [state, formAction] = useFormState(submitWorkshopRegistration, initialState)
  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([])
  const [childCount, setChildCount] = useState(1)
  const [howHeard, setHowHeard] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null)
  const [pendingChildren, setPendingChildren] = useState<SelectedChild[]>([])

  const supabase = createClient()

  const PRICE = 75
  const SIBLING_DISCOUNT = 10
  const MAX_SIBLING_DISCOUNT = 30

  // Load account settings when user changes
  const loadAccountSettings = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('account_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (data && typeof data === 'object') {
      setAccountSettings(data as AccountSettings)
    }
  }, [supabase])

  useEffect(() => {
    if (user) {
      loadAccountSettings(user.id)
    } else {
      setAccountSettings(null)
    }
  }, [user, loadAccountSettings])

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
      const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
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

  const handleUserChange = (newUser: User | null) => {
    setUser(newUser)
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
        <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
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
        <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
          Who&apos;s coming?
        </h3>
        {user ? (
          <ChildrenSelectionSection
            userId={user.id}
            showSchool
            basePrice={PRICE}
            siblingDiscount={SIBLING_DISCOUNT}
            maxDiscount={MAX_SIBLING_DISCOUNT}
            onChildrenChange={(children) => setChildCount(children.length || 1)}
            fieldErrors={state.fieldErrors}
            initialChildren={pendingChildren}
          />
        ) : (
          <ChildFields
            showSchool
            basePrice={PRICE}
            siblingDiscount={SIBLING_DISCOUNT}
            onTotalChange={(_, count) => setChildCount(count)}
            onChildrenChange={setPendingChildren}
          />
        )}
      </section>

      {/* Account Section */}
      <AccountSection
        email={email}
        onEmailChange={setEmail}
        onUserChange={handleUserChange}
        error={state.fieldErrors?.parent_email}
      />

      {/* Parent Information */}
      <ParentSection
        fieldErrors={state.fieldErrors}
        defaultValues={accountSettings ? {
          parent_first_name: accountSettings.parent_first_name,
          parent_last_name: accountSettings.parent_last_name,
          parent_relationship: accountSettings.parent_relationship,
          parent_phone: accountSettings.parent_phone,
        } : undefined}
      />

      {/* Emergency Contact - key forces remount when account settings load */}
      <EmergencyContactSection
        key={accountSettings ? 'loaded' : 'default'}
        fieldErrors={state.fieldErrors}
        defaultValues={accountSettings ? {
          emergency_name: accountSettings.emergency_name,
          emergency_phone: accountSettings.emergency_phone,
          emergency_relationship: accountSettings.emergency_relationship,
        } : undefined}
      />

      {/* Authorized Pickups */}
      <AuthorizedPickupsSection
        maxPickups={2}
        fieldErrors={state.fieldErrors}
        defaultValues={accountSettings?.default_pickups?.map(p => ({
          name: p.name,
          phone: p.phone,
          relationship: p.relationship || '',
        }))}
      />

      {/* Payment */}
      <section>
        <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
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
          label="Payment"
          name="payment_preference"
          required
          options={[
            {
              value: 'later',
              label: 'Standard payment',
              description: 'Payment collected day-of (Vanco, check, or cash)',
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

      {/* Agreements */}
      <AgreementsSection
        showBehaviorAgreement={false}
        fieldErrors={state.fieldErrors}
        defaultMediaConsentInternal={accountSettings?.default_media_consent_internal || false}
        defaultMediaConsentMarketing={accountSettings?.default_media_consent_marketing || false}
      />

      {/* Optional */}
      <section className="border-t border-stone-200 pt-8">
        <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
          Optional
        </h3>
        <div className="space-y-6">
          <div>
            <FormSelect
              label="How did you hear about us?"
              name="how_heard"
              options={[
                { value: '', label: 'Select...' },
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
              <div className="mt-3">
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Please specify
                </label>
                <input
                  type="text"
                  name="how_heard_other"
                  placeholder="How did you hear about us?"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors"
                />
              </div>
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

      <div className="pt-4">
        <SubmitButton>Register</SubmitButton>
      </div>
    </form>
  )
}
