'use client'

import { useState } from 'react'
import Modal from './Modal'
import { updateContactInfo } from '@/app/account/actions'

interface EditContactModalProps {
  isOpen: boolean
  onClose: () => void
  registrationId: string
  programType: 'workshop' | 'camp'
  currentData: {
    parent_phone?: string | null
    emergency_name?: string | null
    emergency_phone?: string | null
    emergency_relationship?: string | null
  }
}

export default function EditContactModal({
  isOpen,
  onClose,
  registrationId,
  programType,
  currentData,
}: EditContactModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateContactInfo(registrationId, programType, {
      parent_phone: formData.get('parent_phone') as string,
      emergency_name: formData.get('emergency_name') as string,
      emergency_phone: formData.get('emergency_phone') as string,
      emergency_relationship: formData.get('emergency_relationship') as string,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Contact Info">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="parent_phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="parent_phone"
            name="parent_phone"
            defaultValue={currentData.parent_phone || ''}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {programType === 'camp' && (
          <>
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Emergency Contact</h3>
            </div>
            <div>
              <label htmlFor="emergency_name" className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                type="text"
                id="emergency_name"
                name="emergency_name"
                defaultValue={currentData.emergency_name || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="emergency_phone" className="block text-sm font-medium text-slate-700 mb-1">
                Phone
              </label>
              <input
                type="tel"
                id="emergency_phone"
                name="emergency_phone"
                defaultValue={currentData.emergency_phone || ''}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="emergency_relationship" className="block text-sm font-medium text-slate-700 mb-1">
                Relationship
              </label>
              <input
                type="text"
                id="emergency_relationship"
                name="emergency_relationship"
                defaultValue={currentData.emergency_relationship || ''}
                placeholder="e.g., Grandparent, Aunt"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
              />
            </div>
          </>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-slate-800 text-white rounded-lg hover:bg-slate-900 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
