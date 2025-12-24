'use client'

import { useState, useTransition } from 'react'
import { updateWorkshopRegistration } from './actions'
import ConfirmDialog from '@/components/admin/ConfirmDialog'

interface Workshop {
  id: string
  title: string
  date: string
}

interface RegistrationActionsProps {
  registrationId: string
  currentStatus: string
  currentPaymentStatus: string
  currentNotes: string | null
  workshops: Workshop[]
}

export default function RegistrationActions({
  registrationId,
  currentStatus,
  currentPaymentStatus,
  currentNotes,
  workshops,
}: RegistrationActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [notes, setNotes] = useState(currentNotes || '')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [pendingSubmit, setPendingSubmit] = useState(false)

  const performUpdate = () => {
    startTransition(async () => {
      const result = await updateWorkshopRegistration(registrationId, {
        status,
        payment_status: paymentStatus,
        admin_notes: notes || undefined,
      })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Registration updated' })
        setTimeout(() => setMessage(null), 3000)
      }
      setPendingSubmit(false)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    // If changing to cancelled, show confirmation dialog
    if (status === 'cancelled' && currentStatus !== 'cancelled') {
      setShowCancelConfirm(true)
      return
    }

    performUpdate()
  }

  const handleConfirmCancel = () => {
    setPendingSubmit(true)
    setShowCancelConfirm(false)
    performUpdate()
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Actions</h2>

      {/* Show which workshops this applies to */}
      <div className="mb-4 p-3 bg-forest-50 rounded-lg">
        <p className="text-xs font-medium text-forest-700 uppercase tracking-wide mb-2">
          Applies to {workshops.length} workshop{workshops.length !== 1 ? 's' : ''}
        </p>
        <ul className="text-sm text-forest-800 space-y-1">
          {workshops.map((w) => (
            <li key={w.id}>• {w.title}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="waitlist">Waitlist</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Payment Status
          </label>
          <select
            value={paymentStatus}
            onChange={(e) => setPaymentStatus(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="partial">Partial</option>
            <option value="waived">Waived</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Admin Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Internal notes about this registration..."
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={isPending || pendingSubmit}
          className="w-full px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending || pendingSubmit ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      <ConfirmDialog
        isOpen={showCancelConfirm}
        onClose={() => setShowCancelConfirm(false)}
        onConfirm={handleConfirmCancel}
        title="Cancel Registration?"
        message="Are you sure you want to cancel this registration? This will mark the registration as cancelled and free up the spot."
        confirmText="Yes, Cancel Registration"
        confirmStyle="danger"
        loading={pendingSubmit}
      />
    </div>
  )
}
