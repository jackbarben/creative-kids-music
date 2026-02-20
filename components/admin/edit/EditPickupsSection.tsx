'use client'

import { useState, useTransition } from 'react'
import EditSection from './EditSection'
import ConfirmDialog from '../ConfirmDialog'

interface Pickup {
  id: string
  name: string
  phone?: string | null
  relationship?: string | null
}

interface PickupFormData {
  name: string
  phone?: string | null
  relationship?: string | null
}

interface EditPickupsSectionProps {
  registrationId: string
  pickups: Pickup[]
  addAction: (registrationId: string, data: PickupFormData) => Promise<{ success?: boolean; error?: string }>
  updateAction: (pickupId: string, data: PickupFormData) => Promise<{ success?: boolean; error?: string }>
  removeAction: (pickupId: string) => Promise<{ success?: boolean; error?: string }>
}

export default function EditPickupsSection({
  registrationId,
  pickups,
  addAction,
  updateAction,
  removeAction,
}: EditPickupsSectionProps) {
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [editingPickupId, setEditingPickupId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<{ show: boolean; pickupId: string; pickupName: string } | null>(null)

  const emptyForm: PickupFormData = {
    name: '',
    phone: '',
    relationship: '',
  }

  const [formData, setFormData] = useState<PickupFormData>(emptyForm)

  const handleEdit = (pickup: Pickup) => {
    setEditingPickupId(pickup.id)
    setShowAddForm(false)
    setFormData({
      name: pickup.name,
      phone: pickup.phone || '',
      relationship: pickup.relationship || '',
    })
  }

  const handleStartAdd = () => {
    setShowAddForm(true)
    setEditingPickupId(null)
    setFormData(emptyForm)
  }

  const handleCancel = () => {
    setShowAddForm(false)
    setEditingPickupId(null)
    setFormData(emptyForm)
    setMessage(null)
  }

  const handleChange = (field: keyof PickupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    if (!formData.name.trim()) {
      setMessage({ type: 'error', text: 'Name is required' })
      return
    }

    setMessage(null)
    startTransition(async () => {
      try {
        let result
        if (editingPickupId) {
          result = await updateAction(editingPickupId, formData)
        } else {
          result = await addAction(registrationId, formData)
        }

        if (result.error) {
          setMessage({ type: 'error', text: result.error })
        } else {
          setMessage({ type: 'success', text: editingPickupId ? 'Pickup updated' : 'Pickup added' })
          setEditingPickupId(null)
          setShowAddForm(false)
          setFormData(emptyForm)
          setTimeout(() => setMessage(null), 3000)
        }
      } catch {
        setMessage({ type: 'error', text: 'An error occurred' })
      }
    })
  }

  const handleRemove = (pickupId: string, pickupName: string) => {
    setConfirmDelete({ show: true, pickupId, pickupName })
  }

  const confirmRemove = () => {
    if (!confirmDelete) return

    startTransition(async () => {
      const result = await removeAction(confirmDelete.pickupId)
      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Authorized pickup removed' })
        setTimeout(() => setMessage(null), 3000)
      }
      setConfirmDelete(null)
    })
  }

  const renderForm = () => (
    <div className="bg-stone-50 rounded-lg p-4 space-y-4">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
          <input
            type="tel"
            value={formData.phone || ''}
            onChange={(e) => handleChange('phone', e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Relationship</label>
          <input
            type="text"
            value={formData.relationship || ''}
            onChange={(e) => handleChange('relationship', e.target.value)}
            placeholder="Grandparent, Aunt, etc."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={handleSave}
          disabled={isPending}
          className="px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : (editingPickupId ? 'Update' : 'Add Pickup')}
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
    <EditSection title="Edit Authorized Pickups" showSaveButton={false}>
      {/* List existing pickups */}
      <div className="space-y-3">
        {pickups.length === 0 && !showAddForm && (
          <p className="text-sm text-stone-500 italic">No authorized pickups added</p>
        )}

        {pickups.map((pickup) => (
          <div key={pickup.id} className="border border-stone-200 rounded-lg p-3">
            {editingPickupId === pickup.id ? (
              renderForm()
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="font-medium text-stone-800">{pickup.name}</div>
                  {pickup.relationship && (
                    <div className="text-sm text-stone-500">{pickup.relationship}</div>
                  )}
                  {pickup.phone && (
                    <div className="text-sm text-stone-500">{pickup.phone}</div>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(pickup)}
                    className="text-sm text-forest-600 hover:text-forest-700 font-medium"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemove(pickup.id, pickup.name)}
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
      {showAddForm && !editingPickupId && (
        <div className="mt-4">
          {renderForm()}
        </div>
      )}

      {/* Add button */}
      {!showAddForm && !editingPickupId && (
        <button
          type="button"
          onClick={handleStartAdd}
          className="mt-4 w-full px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-forest-400 hover:text-forest-600 transition-colors"
        >
          + Add Authorized Pickup
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
        title="Remove Authorized Pickup?"
        message={`Are you sure you want to remove ${confirmDelete?.pickupName} from the authorized pickup list?`}
        confirmText="Yes, Remove"
        confirmStyle="danger"
        loading={isPending}
      />
    </EditSection>
  )
}
