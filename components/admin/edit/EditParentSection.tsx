'use client'

import { useState, useTransition } from 'react'
import EditSection from './EditSection'

interface ParentInfo {
  parent_name?: string | null
  parent_first_name?: string | null
  parent_last_name?: string | null
  parent_email?: string | null
  parent_phone?: string | null
  parent_relationship?: string | null
  // For camp - second parent
  parent2_name?: string | null
  parent2_email?: string | null
  parent2_phone?: string | null
  parent2_relationship?: string | null
}

interface EditParentSectionProps {
  registrationId: string
  parentInfo: ParentInfo
  showSecondParent?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  updateAction: (registrationId: string, data: any) => Promise<{ success?: boolean; error?: string }>
}

export default function EditParentSection({
  registrationId,
  parentInfo,
  showSecondParent = false,
  updateAction,
}: EditParentSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    parent_first_name: parentInfo.parent_first_name || '',
    parent_last_name: parentInfo.parent_last_name || '',
    parent_email: parentInfo.parent_email || '',
    parent_phone: parentInfo.parent_phone || '',
    parent_relationship: parentInfo.parent_relationship || '',
    parent2_name: parentInfo.parent2_name || '',
    parent2_email: parentInfo.parent2_email || '',
    parent2_phone: parentInfo.parent2_phone || '',
    parent2_relationship: parentInfo.parent2_relationship || '',
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    setMessage(null)
    startTransition(async () => {
      const dataToSave: ParentInfo = {
        parent_first_name: formData.parent_first_name || null,
        parent_last_name: formData.parent_last_name || null,
        parent_name: `${formData.parent_first_name} ${formData.parent_last_name}`.trim() || null,
        parent_email: formData.parent_email || null,
        parent_phone: formData.parent_phone || null,
        parent_relationship: formData.parent_relationship || null,
      }

      if (showSecondParent) {
        dataToSave.parent2_name = formData.parent2_name || null
        dataToSave.parent2_email = formData.parent2_email || null
        dataToSave.parent2_phone = formData.parent2_phone || null
        dataToSave.parent2_relationship = formData.parent2_relationship || null
      }

      const result = await updateAction(registrationId, dataToSave)

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Parent info updated' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <EditSection
      title="Edit Parent/Guardian Info"
      isPending={isPending}
      message={message}
      onSave={handleSave}
    >
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">First Name</label>
          <input
            type="text"
            value={formData.parent_first_name}
            onChange={(e) => handleChange('parent_first_name', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Last Name</label>
          <input
            type="text"
            value={formData.parent_last_name}
            onChange={(e) => handleChange('parent_last_name', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          type="email"
          value={formData.parent_email}
          onChange={(e) => handleChange('parent_email', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.parent_phone}
            onChange={(e) => handleChange('parent_phone', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Relationship</label>
          <input
            type="text"
            value={formData.parent_relationship}
            onChange={(e) => handleChange('parent_relationship', e.target.value)}
            placeholder="Parent, Guardian, etc."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      </div>

      {showSecondParent && (
        <>
          <div className="border-t border-stone-200 pt-4 mt-4">
            <h4 className="text-sm font-semibold text-stone-700 mb-3">Second Parent/Guardian (Optional)</h4>
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
            <input
              type="text"
              value={formData.parent2_name}
              onChange={(e) => handleChange('parent2_name', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.parent2_email}
              onChange={(e) => handleChange('parent2_email', e.target.value)}
              className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={formData.parent2_phone}
                onChange={(e) => handleChange('parent2_phone', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Relationship</label>
              <input
                type="text"
                value={formData.parent2_relationship}
                onChange={(e) => handleChange('parent2_relationship', e.target.value)}
                placeholder="Parent, Guardian, etc."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
          </div>
        </>
      )}
    </EditSection>
  )
}
