'use client'

import { useFormState } from 'react-dom'
import { requestMagicLink } from './actions'
import FormField from '@/components/forms/FormField'
import SubmitButton from '@/components/forms/SubmitButton'

export function EmailRequestForm() {
  const [state, formAction] = useFormState(requestMagicLink, {})

  if (state.success) {
    return (
      <div className="text-center py-4">
        <div className="w-12 h-12 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="font-fraunces text-xl font-bold text-stone-800 mb-2">
          Check Your Email
        </h2>
        <p className="text-stone-600">
          {state.message}
        </p>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <FormField
        label="Email Address"
        name="email"
        type="email"
        required
        placeholder="you@example.com"
      />

      <SubmitButton className="w-full">
        Send Access Link
      </SubmitButton>
    </form>
  )
}
