'use client'

import { useFormState } from 'react-dom'
import { updateContactInfo } from '../actions'
import FormField from '@/components/forms/FormField'
import SubmitButton from '@/components/forms/SubmitButton'

interface EditContactFormProps {
  registrationType: 'workshop' | 'camp'
  registrationId: string
  email: string
  currentPhone: string
  currentEmergencyName?: string
  currentEmergencyPhone?: string
  onClose: () => void
}

export function EditContactForm({
  registrationType,
  registrationId,
  email,
  currentPhone,
  currentEmergencyName,
  currentEmergencyPhone,
  onClose,
}: EditContactFormProps) {
  const [state, formAction] = useFormState(updateContactInfo, {})

  if (state.success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <p className="text-green-800 text-sm mb-2">Contact info updated successfully!</p>
        <button
          onClick={onClose}
          className="text-sm text-green-700 hover:underline"
        >
          Close
        </button>
      </div>
    )
  }

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-lg p-4">
      <h4 className="font-medium text-stone-800 mb-4">Update Contact Info</h4>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="email" value={email} />
        <input type="hidden" name="registration_type" value={registrationType} />
        <input type="hidden" name="registration_id" value={registrationId} />

        {state.error && (
          <div className="bg-red-50 text-red-700 px-3 py-2 rounded text-sm">
            {state.error}
          </div>
        )}

        <FormField
          label="Phone Number"
          name="parent_phone"
          type="tel"
          defaultValue={currentPhone}
        />

        {registrationType === 'camp' && (
          <>
            <FormField
              label="Emergency Contact Name"
              name="emergency_name"
              defaultValue={currentEmergencyName}
            />
            <FormField
              label="Emergency Contact Phone"
              name="emergency_phone"
              type="tel"
              defaultValue={currentEmergencyPhone}
            />
          </>
        )}

        <div className="flex gap-3">
          <SubmitButton className="flex-1">Save Changes</SubmitButton>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
