'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { addAccountChild, updateAccountChild, removeAccountChild, type AccountChild } from '@/app/account/actions'

interface ChildrenSectionProps {
  userId: string
}

// Calculate age from date of birth
function calculateAge(dob: string): number {
  const today = new Date()
  const birthDate = new Date(dob)
  let age = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  return age
}

// Format date for display
function formatDate(dob: string): string {
  const date = new Date(dob + 'T00:00:00')
  return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// Input class with proper text color
const inputClass = "w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"

export default function ChildrenSection({ userId }: ChildrenSectionProps) {
  const [children, setChildren] = useState<(AccountChild & { id: string })[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingChild, setEditingChild] = useState<(AccountChild & { id: string }) | null>(null)
  const [deletingChild, setDeletingChild] = useState<(AccountChild & { id: string }) | null>(null)

  const supabase = createClient()

  const fetchChildren = useCallback(async () => {
    const { data } = await supabase
      .from('account_children')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    setChildren((data || []) as (AccountChild & { id: string })[])
    setLoading(false)
  }, [supabase, userId])

  useEffect(() => {
    fetchChildren()
  }, [fetchChildren])

  const handleAddChild = async (child: AccountChild) => {
    const result = await addAccountChild(child)
    if (result.success) {
      fetchChildren()
      setShowAddModal(false)
    }
    return result
  }

  const handleUpdateChild = async (childId: string, child: AccountChild) => {
    const result = await updateAccountChild(childId, child)
    if (result.success) {
      fetchChildren()
      setEditingChild(null)
    }
    return result
  }

  const handleRemoveChild = async (childId: string) => {
    const result = await removeAccountChild(childId)
    if (result.success) {
      fetchChildren()
      setDeletingChild(null)
    }
    return result
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400"></div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl font-semibold text-slate-800">
            Your Children
          </h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="text-sm text-forest-600 hover:text-forest-700 font-medium"
          >
            + Add Child
          </button>
        </div>

        {children.length === 0 ? (
          <div className="text-center py-8 bg-slate-50 rounded-lg">
            <p className="text-slate-500 mb-3">No children added yet</p>
            <p className="text-sm text-slate-400">
              Add your children here to pre-fill registration forms
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {children.map((child) => (
              <div
                key={child.id}
                className="p-4 bg-slate-50 rounded-lg"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-slate-800">
                      {child.first_name} {child.last_name}
                      {child.date_of_birth && (
                        <span className="ml-2 text-sm font-normal text-slate-500">
                          (Age {calculateAge(child.date_of_birth)})
                        </span>
                      )}
                    </p>
                    <div className="text-sm text-slate-500 mt-1 space-y-0.5">
                      {child.date_of_birth && <p>Birthday: {formatDate(child.date_of_birth)}</p>}
                      {child.school && <p>School: {child.school}</p>}
                      {child.allergies && <p>Allergies: {child.allergies}</p>}
                      {child.dietary_restrictions && <p>Dietary: {child.dietary_restrictions}</p>}
                      {child.medical_conditions && <p>Medical: {child.medical_conditions}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingChild(child)}
                      className="text-sm text-slate-500 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingChild(child)}
                      className="text-sm text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Child Modal */}
      {showAddModal && (
        <ChildModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddChild}
        />
      )}

      {/* Edit Child Modal */}
      {editingChild && (
        <ChildModal
          child={editingChild}
          onClose={() => setEditingChild(null)}
          onSave={(child) => handleUpdateChild(editingChild.id, child)}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingChild && (
        <DeleteModal
          childName={`${deletingChild.first_name} ${deletingChild.last_name}`}
          onClose={() => setDeletingChild(null)}
          onConfirm={() => handleRemoveChild(deletingChild.id)}
        />
      )}
    </>
  )
}

// Child Form Modal
function ChildModal({
  child,
  onClose,
  onSave,
}: {
  child?: AccountChild & { id: string }
  onClose: () => void
  onSave: (child: AccountChild) => Promise<{ success?: boolean; error?: string }>
}) {
  const [formData, setFormData] = useState<AccountChild>({
    first_name: child?.first_name || '',
    last_name: child?.last_name || '',
    date_of_birth: child?.date_of_birth || '',
    school: child?.school || '',
    allergies: child?.allergies || '',
    dietary_restrictions: child?.dietary_restrictions || '',
    medical_conditions: child?.medical_conditions || '',
    notes: child?.notes || '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const result = await onSave(formData)
    if (result.error) {
      setError(result.error)
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl font-semibold text-slate-800">
              {child ? 'Edit Child' : 'Add Child'}
            </h3>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.date_of_birth || ''}
              onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
              required
              className={inputClass}
            />
            {formData.date_of_birth && (
              <p className="mt-1 text-sm text-slate-500">
                Age: {calculateAge(formData.date_of_birth)} years old
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              School
            </label>
            <input
              type="text"
              value={formData.school || ''}
              onChange={(e) => setFormData({ ...formData, school: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Allergies
            </label>
            <input
              type="text"
              value={formData.allergies || ''}
              onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
              className={inputClass}
              placeholder="e.g., Peanuts, Tree nuts"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dietary Restrictions
            </label>
            <input
              type="text"
              value={formData.dietary_restrictions || ''}
              onChange={(e) => setFormData({ ...formData, dietary_restrictions: e.target.value })}
              className={inputClass}
              placeholder="e.g., Vegetarian, Gluten-free"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Medical Conditions
            </label>
            <input
              type="text"
              value={formData.medical_conditions || ''}
              onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
              className={inputClass}
              placeholder="e.g., Asthma, Diabetes"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className={`${inputClass} resize-none`}
              placeholder="Any additional information..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50"
            >
              {saving && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {saving ? 'Saving...' : child ? 'Save Changes' : 'Add Child'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Delete Confirmation Modal
function DeleteModal({
  childName,
  onClose,
  onConfirm,
}: {
  childName: string
  onClose: () => void
  onConfirm: () => Promise<{ success?: boolean; error?: string }>
}) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setDeleting(true)
    setError(null)

    const result = await onConfirm()
    if (result.error) {
      setError(result.error)
      setDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-slate-800 mb-3">
            Remove Child
          </h3>
          <p className="text-slate-600 mb-4">
            Are you sure you want to remove <strong>{childName}</strong> from your account?
          </p>
          <p className="text-sm text-slate-500 mb-6">
            This will not affect existing registrations. You can add them back anytime.
          </p>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm mb-4">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {deleting && (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {deleting ? 'Removing...' : 'Remove'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
