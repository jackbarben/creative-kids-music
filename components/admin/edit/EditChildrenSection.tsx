'use client'

import { useState, useTransition } from 'react'
import EditSection from './EditSection'
import ConfirmDialog from '../ConfirmDialog'

interface Child {
  id: string
  child_name: string
  child_age: number
  child_grade?: string | null
  child_school?: string | null
  tshirt_size?: string | null
  allergies?: string | null
  dietary_restrictions?: string | null
  medical_conditions?: string | null
  special_needs?: string | null
  discount_cents?: number | null
}

interface ChildFormData {
  child_name: string
  child_age: number
  child_grade?: string | null
  child_school?: string | null
  tshirt_size?: string | null
  allergies?: string | null
  dietary_restrictions?: string | null
  medical_conditions?: string | null
  special_needs?: string | null
}

interface EditChildrenSectionProps {
  registrationId: string
  registeredChildren: Child[]
  showCampFields?: boolean
  addAction: (registrationId: string, data: ChildFormData) => Promise<{ success?: boolean; error?: string }>
  updateAction: (childId: string, data: ChildFormData) => Promise<{ success?: boolean; error?: string }>
  removeAction: (childId: string) => Promise<{ success?: boolean; error?: string }>
}

const TSHIRT_SIZES = ['YS', 'YM', 'YL', 'AS', 'AM', 'AL', 'AXL']

export default function EditChildrenSection({
  registrationId,
  registeredChildren,
  showCampFields = false,
  addAction,
  updateAction,
  removeAction,
}: EditChildrenSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingChildId, setEditingChildId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; childId: string; childName: string } | null>(null)

  const emptyForm: ChildFormData = {
    child_name: '',
    child_age: 9,
    child_grade: '',
    child_school: '',
    tshirt_size: '',
    allergies: '',
    dietary_restrictions: '',
    medical_conditions: '',
    special_needs: '',
  }

  const [formData, setFormData] = useState<ChildFormData>(emptyForm)

  const handleEdit = (child: Child) => {
    setEditingChildId(child.id)
    setShowAddForm(false)
    setFormData({
      child_name: child.child_name,
      child_age: child.child_age,
      child_grade: child.child_grade || '',
      child_school: child.child_school || '',
      tshirt_size: child.tshirt_size || '',
      allergies: child.allergies || '',
      dietary_restrictions: child.dietary_restrictions || '',
      medical_conditions: child.medical_conditions || '',
      special_needs: child.special_needs || '',
    })
  }

  const handleStartAdd = () => {
    setShowAddForm(true)
    setEditingChildId(null)
    setFormData(emptyForm)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingChildId(null)
    setFormData(emptyForm)
    setMessage(null)
  }

  const handleChange = (field: keyof ChildFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!formData.child_name.trim()) {
      setMessage({ type: 'error', text: 'Child name is required' })
      return
    }

    setMessage(null)
    startTransition(async () => {
      try {
        let result
        if (editingChildId) {
          result = await updateAction(editingChildId, formData)
        } else {
          result = await addAction(registrationId, formData)
        }

        if (result.error) {
          setMessage({ type: 'error', text: result.error })
        } else {
          setMessage({ type: 'success', text: editingChildId ? 'Child updated' : 'Child added' })
          setEditingChildId(null)
          setShowAddForm(false)
          setFormData(emptyForm)
          setTimeout(() => setMessage(null), 3000)
        }
      } catch {
        setMessage({ type: 'error', text: 'An error occurred' })
      }
    })
  }

  const handleRemove = (childId: string, childName: string) => {
    setConfirmDelete({ show: true, childId, childName })
  }

  const confirmRemove = () => {
    if (!confirmDelete) return

    startTransition(async () => {
      const result = await removeAction(confirmDelete.childId)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Child removed' })
        setTimeout(() => setMessage(null), 3000)
      }
      setConfirmDelete(null)
    })
  }

  const renderForm = () => (
    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Child Name *</label>
          <input
            type="text"
            value={formData.child_name}
            onChange={(e) => handleChange('child_name', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Age</label>
          <input
            type="number"
            min={5}
            max={18}
            value={formData.child_age}
            onChange={(e) => handleChange('child_age', parseInt(e.target.value) || 9)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">School</label>
          <input
            type="text"
            value={formData.child_school || ''}
            onChange={(e) => handleChange('child_school', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        {showCampFields && (
          <>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Grade</label>
              <input
                type="text"
                value={formData.child_grade || ''}
                onChange={(e) => handleChange('child_grade', e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
          </>
        )}
      </div>

      {showCampFields && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">T-Shirt Size</label>
          <select
            value={formData.tshirt_size || ''}
            onChange={(e) => handleChange('tshirt_size', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          >
            <option value="">Select size...</option>
            {TSHIRT_SIZES.map(size => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Allergies</label>
        <input
          type="text"
          value={formData.allergies || ''}
          onChange={(e) => handleChange('allergies', e.target.value)}
          placeholder="Food allergies, medication allergies, etc."
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Dietary Restrictions</label>
        <input
          type="text"
          value={formData.dietary_restrictions || ''}
          onChange={(e) => handleChange('dietary_restrictions', e.target.value)}
          placeholder="Vegetarian, vegan, gluten-free, etc."
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Medical Conditions</label>
        <textarea
          value={formData.medical_conditions || ''}
          onChange={(e) => handleChange('medical_conditions', e.target.value)}
          rows={2}
          placeholder="Any medical conditions we should be aware of..."
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      {showCampFields && (
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Special Needs</label>
          <textarea
            value={formData.special_needs || ''}
            onChange={(e) => handleChange('special_needs', e.target.value)}
            rows={2}
            placeholder="Any special accommodations needed..."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : (editingChildId ? 'Update Child' : 'Add Child')}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="px-4 py-2 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )

  return (
    <EditSection title="Edit Children" showSaveButton={false}>
      {/* List existing children */}
      <div className="space-y-3">
        {registeredChildren.map((child, index) => (
          <div key={child.id} className="border border-stone-200 rounded-lg p-3">
            {editingChildId === child.id ? (
              renderForm()
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-stone-800">
                    {child.child_name}
                    <span className="text-stone-500 font-normal ml-2">
                      (Age {child.child_age})
                    </span>
                    {index > 0 && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        ${((child.discount_cents || 0) / 100).toFixed(0)} sibling discount
                      </span>
                    )}
                  </div>
                  {child.child_school && (
                    <div className="text-sm text-stone-500">School: {child.child_school}</div>
                  )}
                  {showCampFields && child.tshirt_size && (
                    <div className="text-sm text-stone-500">T-Shirt: {child.tshirt_size}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(child)}
                    className="text-sm text-forest-600 hover:text-forest-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(child.id, child.child_name)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add form */}
      {showAddForm && !editingChildId && (
        <div className="mt-4">
          {renderForm()}
        </div>
      )}

      {/* Add button */}
      {!showAddForm && !editingChildId && (
        <button
          type="button"
          onClick={handleStartAdd}
          className="mt-4 w-full px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-forest-400 hover:text-forest-600 transition-colors"
        >
          + Add Another Child
        </button>
      )}

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 text-green-700'
            : 'bg-red-50 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!confirmDelete?.show}
        onClose={() => setConfirmDelete(null)}
        onConfirm={confirmRemove}
        title="Remove Child?"
        message={`Are you sure you want to remove ${confirmDelete?.childName} from this registration? This will recalculate sibling discounts.`}
        confirmText="Yes, Remove"
        confirmStyle="danger"
        loading={isPending}
      />
    </EditSection>
  )
}
