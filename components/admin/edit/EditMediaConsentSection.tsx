'use client'

import { useState, useTransition } from 'react'
import EditSection from './EditSection'

interface MediaConsentInfo {
  media_consent_internal?: boolean | null
  media_consent_marketing?: boolean | null
}

interface EditMediaConsentSectionProps {
  registrationId: string
  consentInfo: MediaConsentInfo
  updateAction: (registrationId: string, data: { media_consent_internal: boolean; media_consent_marketing: boolean }) => Promise<{ success?: boolean; error?: string }>
}

export default function EditMediaConsentSection({
  registrationId,
  consentInfo,
  updateAction,
}: EditMediaConsentSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    media_consent_internal: consentInfo.media_consent_internal ?? false,
    media_consent_marketing: consentInfo.media_consent_marketing ?? false,
  })

  const handleChange = (field: 'media_consent_internal' | 'media_consent_marketing', value: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await updateAction(registrationId, formData)

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Media consent updated' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <EditSection
      title="Edit Media Consent"
      isPending={isPending}
      message={message}
      onSave={handleSave}
    >
      <div className="space-y-3">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.media_consent_internal}
            onChange={(e) => handleChange('media_consent_internal', e.target.checked)}
            className="mt-0.5 h-4 w-4 text-forest-600 border-stone-300 rounded focus:ring-forest-500"
          />
          <div>
            <span className="text-sm font-medium text-stone-800">Internal Use</span>
            <p className="text-xs text-stone-500">Photos/videos for internal program records and communications with families</p>
          </div>
        </label>

        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.media_consent_marketing}
            onChange={(e) => handleChange('media_consent_marketing', e.target.checked)}
            className="mt-0.5 h-4 w-4 text-forest-600 border-stone-300 rounded focus:ring-forest-500"
          />
          <div>
            <span className="text-sm font-medium text-stone-800">Marketing Use</span>
            <p className="text-xs text-stone-500">Photos/videos for website, social media, and promotional materials</p>
          </div>
        </label>
      </div>

      <p className="text-xs text-stone-500 mt-2">
        Note: Updating consent will record the current timestamp as the acceptance date.
      </p>
    </EditSection>
  )
}
