'use client'

import { useTranslations } from 'next-intl'
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
  const t = useTranslations('forms.emergency')

  return (
    <section>
      <h3 className="font-display text-xl font-bold text-stone-800 mb-2">
        {t('title')}
      </h3>
      <p className="text-sm text-stone-500 mb-4">
        {t('description')}
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          label={t('name')}
          name="emergency_name"
          required
          defaultValue={defaultValues?.emergency_name}
          error={fieldErrors?.emergency_name}
        />
        <PhoneField
          label={t('phone')}
          name="emergency_phone"
          required
          defaultValue={defaultValues?.emergency_phone}
          error={fieldErrors?.emergency_phone}
        />
        <FormField
          label={t('relationship')}
          name="emergency_relationship"
          required
          placeholder={t('relationshipPlaceholder')}
          defaultValue={defaultValues?.emergency_relationship}
          error={fieldErrors?.emergency_relationship}
        />
      </div>
    </section>
  )
}
