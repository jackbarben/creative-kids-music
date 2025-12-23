'use client'

import { useState } from 'react'
import Modal from './Modal'
import { removeChild } from '@/app/account/actions'

interface RemoveChildModalProps {
  isOpen: boolean
  onClose: () => void
  childId: string
  childName: string
  registrationId: string
  programType: 'workshop' | 'camp'
  isPaid: boolean
}

export default function RemoveChildModal({
  isOpen,
  onClose,
  childId,
  childName,
  registrationId,
  programType,
  isPaid,
}: RemoveChildModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [confirmed, setConfirmed] = useState(false)

  const handleRemove = async () => {
    if (!confirmed) return

    setLoading(true)
    setError(null)

    const result = await removeChild(childId, registrationId, programType)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  const handleClose = () => {
    setConfirmed(false)
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Remove Child">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <p className="text-slate-700">
          Are you sure you want to remove <span className="font-semibold">{childName}</span> from this registration?
        </p>

        {isPaid ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm font-medium">No refund will be issued</p>
            <p className="text-amber-700 text-sm mt-1">
              Payment has already been received. Removing this child will not result in a refund.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm">
              Your registration total will be recalculated to reflect the change.
            </p>
          </div>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-slate-700">
            I understand and want to remove this child
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleRemove}
            disabled={loading || !confirmed}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Removing...' : 'Remove Child'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
