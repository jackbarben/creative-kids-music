'use client'

import { useState, useTransition } from 'react'
import { updateWorkshopRegistration } from './actions'

interface RegistrationActionsProps {
  registrationId: string
  currentStatus: string
  currentPaymentStatus: string
  currentNotes: string | null
}

export default function RegistrationActions({
  registrationId,
  currentStatus,
  currentPaymentStatus,
  currentNotes,
}: RegistrationActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [notes, setNotes] = useState(currentNotes || '')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

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
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-fraunces text-lg font-bold text-stone-800 mb-4">Actions</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent"
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
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-y"
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
          disabled={isPending}
          className="w-full px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
