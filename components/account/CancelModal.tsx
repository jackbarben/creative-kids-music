'use client'

import { useState } from 'react'
import Modal from './Modal'
import { cancelRegistration } from '@/app/account/actions'

interface CancelModalProps {
  isOpen: boolean
  onClose: () => void
  registrationId: string
  programType: 'workshop' | 'camp'
  programName: string
  isPaid: boolean
}

export default function CancelModal({
  isOpen,
  onClose,
  registrationId,
  programType,
  programName,
  isPaid,
}: CancelModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)

  const handleCancel = async () => {
    if (!confirmed) return

    setLoading(true)
    setError(null)

    const result = await cancelRegistration(registrationId, programType, reason)

    setLoading(false)

    if (result.error) {
      setError(result.error)
    } else {
      onClose()
    }
  }

  const handleClose = () => {
    setConfirmed(false)
    setReason('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Cancel Registration">
      <div className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg">
            {error}
          </div>
        )}

        <p className="text-slate-700">
          Are you sure you want to cancel your <span className="font-semibold">{programName}</span> registration?
        </p>

        {isPaid ? (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm font-medium">No refund available</p>
            <p className="text-amber-700 text-sm mt-1">
              Payment has already been received. Cancelling will free up the spot but no refund will be issued.
            </p>
          </div>
        ) : (
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-slate-600 text-sm">
              You can cancel with no penalty since payment has not been received.
            </p>
          </div>
        )}

        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-700 mb-1">
            Reason (optional)
          </label>
          <select
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-100 focus:border-forest-400 text-slate-800"
          >
            <option value="">Select a reason...</option>
            <option value="schedule_conflict">Schedule conflict</option>
            <option value="child_not_interested">Child no longer interested</option>
            <option value="financial">Financial reasons</option>
            <option value="moving">Moving away</option>
            <option value="other">Other</option>
          </select>
        </div>

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-slate-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm text-slate-700">
            I understand and want to cancel this registration
          </span>
        </label>

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:text-slate-800"
          >
            Keep Registration
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading || !confirmed}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? 'Cancelling...' : 'Cancel Registration'}
          </button>
        </div>
      </div>
    </Modal>
  )
}
