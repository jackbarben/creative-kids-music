'use client'

import { FormField, PhoneField } from './index'

interface ParentSectionProps {
  fieldErrors?: Record<string, string>
  defaultValues?: {
    parent_first_name?: string
    parent_last_name?: string
    parent_relationship?: string
    parent_phone?: string
  }
}

export default function ParentSection({ fieldErrors, defaultValues }: ParentSectionProps) {
  return (
    <section>
      <h3 className="font-syne text-xl font-bold text-stone-800 mb-4">
        Parent/Guardian
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="First Name"
          name="parent_first_name"
          required
          defaultValue={defaultValues?.parent_first_name}
          error={fieldErrors?.parent_first_name}
        />
        <FormField
          label="Last Name"
          name="parent_last_name"
          required
          defaultValue={defaultValues?.parent_last_name}
          error={fieldErrors?.parent_last_name}
        />
        <FormField
          label="Relationship to Child"
          name="parent_relationship"
          required
          placeholder="e.g., Mother, Father, Guardian"
          defaultValue={defaultValues?.parent_relationship}
          error={fieldErrors?.parent_relationship}
        />
        <PhoneField
          label="Phone"
          name="parent_phone"
          required
          defaultValue={defaultValues?.parent_phone}
          error={fieldErrors?.parent_phone}
        />
      </div>
    </section>
  )
}
