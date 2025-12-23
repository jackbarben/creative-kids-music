'use client'

import { useState } from 'react'
import Modal from './Modal'
import { updateChild } from '@/app/account/actions'

interface EditChildModalProps {
  isOpen: boolean
  onClose: () => void
  childId: string
  registrationId: string
  programType: 'workshop' | 'camp'
  currentData: {
    child_name: string
    child_age: number
    child_school?: string | null
    allergies?: string | null
    medical_conditions?: string | null
    special_needs?: string | null
  }
}

export default function EditChildModal({
  isOpen,
  onClose,
  childId,
  registrationId,
  programType,
  currentData,
}: EditChildModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await updateChild(childId, registrationId, programType, {
      child_name: formData.get('child_name') as string,
      child_age: parseInt(formData.get('child_age') as string) || 0,
      child_school: formData.get('child_school') as string,
      allergies: formData.get('allergies') as string,
      medical_conditions: formData.get('medical_conditions') as string,
      special_needs: formData.get('special_needs') as string,
    })

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Child">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="child_name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="child_name"
            name="child_name"
            required
            defaultValue={currentData.child_name}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="child_age" className="block text-sm font-medium text-slate-700 mb-1">
            Age <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="child_age"
            name="child_age"
            required
            min={9}
            max={13}
            defaultValue={currentData.child_age}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
          <p className="mt-1 text-xs text-slate-500">Ages 9-13 only</p>
        </div>

        <div>
          <label htmlFor="child_school" className="block text-sm font-medium text-slate-700 mb-1">
            School
          </label>
          <input
            type="text"
            id="child_school"
            name="child_school"
            defaultValue={currentData.child_school || ''}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {programType === 'camp' && (
          <>
            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Medical Information</h3>
            </div>
            <div>
              <label htmlFor="allergies" className="block text-sm font-medium text-slate-700 mb-1">
                Allergies
              </label>
              <textarea
                id="allergies"
                name="allergies"
                rows={2}
                defaultValue={currentData.allergies || ''}
                placeholder="List any allergies..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="medical_conditions" className="block text-sm font-medium text-slate-700 mb-1">
                Medical Conditions
              </label>
              <textarea
                id="medical_conditions"
                name="medical_conditions"
                rows={2}
                defaultValue={currentData.medical_conditions || ''}
                placeholder="List any medical conditions..."
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
              />
            </div>
            <div>
              <label htmlFor="special_needs" className="block text-sm font-medium text-slate-700 mb-1">
                Special Needs
              </label>
              <textarea
                id="special_needs"
                name="special_needs"
                rows={2}
                defaultValue={currentData.special_needs || ''}
                placeholder="Any special accommodations needed..."
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
