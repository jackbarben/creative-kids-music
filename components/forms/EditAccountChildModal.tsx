'use client'

import { useState, useTransition } from 'react'
import { updateAccountChild } from '@/app/account/actions'

interface AccountChild {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  school?: string
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  notes?: string
}

interface EditAccountChildModalProps {
  isOpen: boolean
  onClose: () => void
  child: AccountChild
  onUpdate: (updatedChild: AccountChild) => void
}

export default function EditAccountChildModal({
  isOpen,
  onClose,
  child,
  onUpdate,
}: EditAccountChildModalProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<AccountChild>(child)

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result = await updateAccountChild(child.id, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth || null,
        school: formData.school || null,
        allergies: formData.allergies || null,
        dietary_restrictions: formData.dietary_restrictions || null,
        medical_conditions: formData.medical_conditions || null,
        notes: formData.notes || null,
      })

      if (result.error) {
        setError(result.error)
      } else {
        onUpdate(formData)
        onClose()
      }
    })
  }

  const handleChange = (field: keyof AccountChild, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-bold text-slate-800">
              Edit Child Information
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  First Name <span className="text-terracotta-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => handleChange('first_name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.last_name || ''}
                  onChange={(e) => handleChange('last_name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Date of birth and school */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={formData.date_of_birth || ''}
                  onChange={(e) => handleChange('date_of_birth', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={formData.school || ''}
                  onChange={(e) => handleChange('school', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Medical section */}
            <div className="pt-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-800 mb-3">Medical Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Allergies
                  </label>
                  <textarea
                    rows={2}
                    value={formData.allergies || ''}
                    onChange={(e) => handleChange('allergies', e.target.value)}
                    placeholder="Food, environmental, or other allergies"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Dietary Restrictions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.dietary_restrictions || ''}
                    onChange={(e) => handleChange('dietary_restrictions', e.target.value)}
                    placeholder="Vegetarian, gluten-free, kosher, etc."
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Medical Conditions
                  </label>
                  <textarea
                    rows={2}
                    value={formData.medical_conditions || ''}
                    onChange={(e) => handleChange('medical_conditions', e.target.value)}
                    placeholder="Any conditions or medications we should know about"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => handleChange('notes', e.target.value)}
                    placeholder="Anything else we should know"
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y"
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isPending}
                className="px-6 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50"
              >
                {isPending ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
