'use client'

import { useState, useTransition } from 'react'
import EditSection from './EditSection'

interface EmergencyInfo {
  emergency_name?: string | null
  emergency_phone?: string | null
  emergency_relationship?: string | null
}

interface EditEmergencySectionProps {
  registrationId: string
  emergencyInfo: EmergencyInfo
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction: (registrationId: string, data: any) => Promise<{ success?: boolean; error?: string }>
}

export default function EditEmergencySection({
  registrationId,
  emergencyInfo,
  updateAction,
}: EditEmergencySectionProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    emergency_name: emergencyInfo.emergency_name || '',
    emergency_phone: emergencyInfo.emergency_phone || '',
    emergency_relationship: emergencyInfo.emergency_relationship || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setMessage(null)
    startTransition(async () => {
      const result = await updateAction(registrationId, {
        emergency_name: formData.emergency_name || undefined,
        emergency_phone: formData.emergency_phone || undefined,
        emergency_relationship: formData.emergency_relationship || undefined,
      })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Emergency contact updated' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <EditSection
      title="Edit Emergency Contact"
      isPending={isPending}
      message={message}
      onSave={handleSave}
    >
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Contact Name</label>
        <input
          type="text"
          value={formData.emergency_name}
          onChange={(e) => handleChange('emergency_name', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.emergency_phone}
            onChange={(e) => handleChange('emergency_phone', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Relationship</label>
          <input
            type="text"
            value={formData.emergency_relationship}
            onChange={(e) => handleChange('emergency_relationship', e.target.value)}
            placeholder="Grandparent, Aunt, etc."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      </div>
    </EditSection>
  )
}
