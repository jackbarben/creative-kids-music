'use client'

import { useFormState } from 'react-dom'
import { useTranslations, useLocale } from 'next-intl'
import { submitInterestSurvey, type InterestFormState } from './actions'
import {
  FormField,
  FormSelect,
  FormTextarea,
  FormRadioGroup,
  SubmitButton,
} from '@/components/forms'

const initialState: InterestFormState = {}

export default function InterestForm() {
  const [state, formAction] = useFormState(submitInterestSurvey, initialState)
  const t = useTranslations('forms.interest')
  const locale = useLocale()

  return (
    <form action={formAction} className="space-y-6">
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <input type="hidden" name="locale" value={locale} />

      {state.error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          label={t('yourName')}
          name="parent_name"
          required
          error={state.fieldErrors?.parent_name}
        />
        <FormField
          label={t('email')}
          name="parent_email"
          type="email"
          required
          error={state.fieldErrors?.parent_email}
        />
      </div>

      <div className="border-t border-stone-200 pt-6">
        <p className="text-sm text-stone-500 mb-4">
          {t('tellUsAboutChild')}
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField label={t('childName')} name="child_name" />
          <FormSelect
            label={t('grade')}
            name="child_grade"
            required
            options={[
              { value: '3rd', label: t('gradeOptions.3rd') },
              { value: '4th', label: t('gradeOptions.4th') },
              { value: '5th', label: t('gradeOptions.5th') },
              { value: '6th', label: t('gradeOptions.6th') },
              { value: '7th', label: t('gradeOptions.7th') },
            ]}
          />
          <FormField label={t('school')} name="child_school" />
          <FormSelect
            label={t('numChildren')}
            name="num_children"
            required
            options={[
              { value: '1', label: t('numChildrenOptions.1') },
              { value: '2', label: t('numChildrenOptions.2') },
              { value: '3', label: t('numChildrenOptions.3') },
              { value: '4', label: t('numChildrenOptions.4') },
            ]}
          />
        </div>
      </div>

      <div className="border-t border-stone-200 pt-6 space-y-8">
        <p className="text-sm text-stone-500 mb-4">
          {t('helpUsUnderstand')}
        </p>

        <div className="space-y-3">
          <FormRadioGroup
            label={t('consider3days')}
            name="consider_3days"
            required
            options={[
              { value: 'yes', label: t('yes') },
              { value: 'no', label: t('no') },
            ]}
            error={state.fieldErrors?.consider_3days}
          />
          <FormField
            label={t('tellUsMore')}
            name="consider_3days_notes"
            placeholder={t('schedulePlaceholder')}
          />
        </div>

        <div className="space-y-3">
          <FormRadioGroup
            label={t('transportationQuestion')}
            name="transportation_affects"
            required
            options={[
              { value: 'yes', label: t('yes') },
              { value: 'no', label: t('no') },
            ]}
            error={state.fieldErrors?.transportation_affects}
          />
          <FormField
            label={t('tellUsMore')}
            name="transportation_notes"
            placeholder={t('transportationPlaceholder')}
          />
        </div>

        <div className="space-y-3">
          <FormRadioGroup
            label={t('assistanceQuestion')}
            name="tuition_assistance_affects"
            required
            options={[
              { value: 'yes', label: t('yes') },
              { value: 'no', label: t('no') },
            ]}
            error={state.fieldErrors?.tuition_assistance_affects}
          />
          <FormField
            label={t('tellUsMore')}
            name="tuition_assistance_notes"
            placeholder={t('assistancePlaceholder')}
          />
        </div>
      </div>

      <FormTextarea
        label={t('whatToKnow')}
        name="message"
        placeholder={t('whatToKnowPlaceholder')}
        rows={3}
      />

      <div className="pt-4">
        <SubmitButton>{t('submit')}</SubmitButton>
      </div>
    </form>
  )
}
