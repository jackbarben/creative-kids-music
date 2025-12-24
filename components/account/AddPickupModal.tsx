'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import Modal from './Modal'
import { addPickup } from '@/app/account/actions'
import { formatPhoneNumber } from '@/lib/utils/phone'

interface AddPickupModalProps {
  isOpen: boolean
  onClose: () => void
  registrationId: string
}

export default function AddPickupModal({
  isOpen,
  onClose,
  registrationId,
}: AddPickupModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('Please enter a name')
      return
    }

    setLoading(true)
    setError(null)

    const result = await addPickup(registrationId, name, phone, relationship)

    setLoading(false)

    if (result.error) {
      setError(result.error)
      toast.error('Failed to add pickup person')
    } else {
      toast.success('Pickup person added')
      setName('')
      setPhone('')
      setRelationship('')
      onClose()
    }
  }

  const handleClose = () => {
    setName('')
    setPhone('')
    setRelationship('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Authorized Pickup">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <p className="text-sm text-slate-600">
          Add someone who is authorized to pick up your child from camp.
          We&apos;ll verify their identity in person at pickup.
        </p>

        <div>
          <label htmlFor="pickup_name" className="block text-sm font-medium text-slate-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="pickup_name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Jane Doe"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="pickup_phone" className="block text-sm font-medium text-slate-700 mb-1">
            Phone
          </label>
          <input
            type="tel"
            id="pickup_phone"
            value={phone}
            onChange={(e) => setPhone(formatPhoneNumber(e.target.value))}
            placeholder="(555) 555-5555"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div>
          <label htmlFor="pickup_relationship" className="block text-sm font-medium text-slate-700 mb-1">
            Relationship
          </label>
          <input
            type="text"
            id="pickup_relationship"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            placeholder="e.g., Grandmother, Neighbor, Family Friend"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800 placeholder:text-slate-400"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-sm bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Pickup Person'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
