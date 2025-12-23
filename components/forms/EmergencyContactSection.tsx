'use client'

import { FormField, PhoneField } from './index'

interface EmergencyContactSectionProps {
  fieldErrors?: Record<string, string>
  defaultValues?: {
    emergency_name?: string
    emergency_phone?: string
    emergency_relationship?: string
  }
}

export default function EmergencyContactSection({ fieldErrors, defaultValues }: EmergencyContactSectionProps) {
  return (
    <section>
      <h3 className="font-syne text-xl font-bold text-stone-800 mb-2">
        Emergency Contact
      </h3>
      <p className="text-sm text-stone-500 mb-4">
        Someone we can reach in case of emergency (other than yourself).
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label="Name"
          name="emergency_name"
          required
          defaultValue={defaultValues?.emergency_name}
          error={fieldErrors?.emergency_name}
        />
        <PhoneField
          label="Phone"
          name="emergency_phone"
          required
          defaultValue={defaultValues?.emergency_phone}
          error={fieldErrors?.emergency_phone}
        />
        <FormField
          label="Relationship"
          name="emergency_relationship"
          required
          placeholder="e.g., Grandmother"
          defaultValue={defaultValues?.emergency_relationship}
          error={fieldErrors?.emergency_relationship}
        />
      </div>
    </section>
  )
}
