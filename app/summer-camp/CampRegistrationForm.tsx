'use client'

import { useState, useEffect, useCallback } from 'react'
import { useFormState } from 'react-dom'
import { createClient } from '@/lib/supabase/client'
import { submitCampRegistration, type CampFormState } from './actions'
import {
  FormField,
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
import type { User } from '@supabase/supabase-js'
import type { AccountSettings } from '@/app/account/actions'

const initialState: CampFormState = {}

export default function CampRegistrationForm() {
  const [state, formAction] = useFormState(submitCampRegistration, initialState)
  const [childCount, setChildCount] = useState(1)
  const [howHeard, setHowHeard] = useState('')
  const [email, setEmail] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const [accountSettings, setAccountSettings] = useState<AccountSettings | null>(null)
  const [showSecondParent, setShowSecondParent] = useState(false)
  const [pendingChildren, setPendingChildren] = useState<SelectedChild[]>([])

  const supabase = createClient()

  const PRICE = 400
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
      const row = data as AccountSettings
      setAccountSettings(row)
      if (row.parent2_first_name || row.parent2_last_name) {
        setShowSecondParent(true)
      }
    }
  }, [supabase])

  useEffect(() => {
    if (user) {
      loadAccountSettings(user.id)
    } else {
      setAccountSettings(null)
    }
  }, [user, loadAccountSettings])

  const calculateTotal = () => {
    let total = 0
    for (let i = 0; i < childCount; i++) {
      const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
      total += Math.max(0, PRICE - discount)
    }
    return total
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

      {/* Child Information */}
      <section>
        <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
          Who&apos;s coming to camp?
        </h3>
        {user ? (
          <ChildrenSelectionSection
            userId={user.id}
            showGrade
            showSchool
            showMedical
            showTshirtSize
            basePrice={PRICE}
            siblingDiscount={SIBLING_DISCOUNT}
            maxDiscount={MAX_SIBLING_DISCOUNT}
            onChildrenChange={(children) => setChildCount(children.length || 1)}
            fieldErrors={state.fieldErrors}
            initialChildren={pendingChildren}
          />
        ) : (
          <ChildFields
            showGrade
            showSchool
            showMedical
            showTshirtSize
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

      {/* Second Parent Section (Camp only) */}
      <section>
        {!showSecondParent ? (
          <button
            type="button"
            onClick={() => setShowSecondParent(true)}
            className="text-sm text-terracotta-600 hover:text-terracotta-700 font-medium"
          >
            + Add Second Parent/Guardian
          </button>
        ) : (
          <div className="p-6 bg-stone-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-stone-800">
                Second Parent/Guardian
              </h3>
              <button
                type="button"
                onClick={() => setShowSecondParent(false)}
                className="text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="parent2_first_name"
                defaultValue={accountSettings?.parent2_first_name}
              />
              <FormField
                label="Last Name"
                name="parent2_last_name"
                defaultValue={accountSettings?.parent2_last_name}
              />
              <FormField
                label="Relationship"
                name="parent2_relationship"
                placeholder="e.g., Father, Step-mother"
                defaultValue={accountSettings?.parent2_relationship}
              />
              <FormField
                label="Phone"
                name="parent2_phone"
                type="tel"
                placeholder="(555) 555-5555"
                defaultValue={accountSettings?.parent2_phone}
              />
              <div className="md:col-span-2">
                <FormField
                  label="Email"
                  name="parent2_email"
                  type="email"
                  placeholder="email@example.com"
                  defaultValue={accountSettings?.parent2_email}
                />
              </div>
            </div>
          </div>
        )}
      </section>

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

      {/* Authorized Pickups - 3 for camp */}
      <AuthorizedPickupsSection
        maxPickups={3}
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

        <div className="mb-6 p-4 bg-terracotta-50 rounded-lg">
          <p className="text-stone-700">
            {childCount} {childCount === 1 ? 'child' : 'children'} = <span className="font-bold text-terracotta-700">${calculateTotal()}</span>
            {childCount > 1 && (
              <span className="text-sm text-terracotta-600 ml-2">(includes sibling discount)</span>
            )}
          </p>
        </div>

        <FormRadioGroup
          label="Payment"
          name="payment_preference"
          required
          options={[
            {
              value: 'later',
              label: 'Standard payment',
              description: 'Pay day-of via Vanco, check, or cash',
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

      {/* Agreements - with behavior agreement for camp */}
      <AgreementsSection
        showBehaviorAgreement={true}
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
                { value: 'workshop', label: 'Attended a workshop' },
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
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-terracotta-400 focus:ring-2 focus:ring-terracotta-100 outline-none transition-colors"
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
        <SubmitButton>Register for Camp</SubmitButton>
      </div>
    </form>
  )
}
