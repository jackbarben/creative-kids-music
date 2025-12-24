'use client'

import { useState, useTransition } from 'react'
import { updateWaitlistSignup } from './actions'

interface SignupActionsProps {
  signupId: string
  currentStatus: string
  currentNotes: string | null
}

export default function SignupActions({
  signupId,
  currentStatus,
  currentNotes,
}: SignupActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes || '')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result = await updateWaitlistSignup(signupId, {
        status,
        admin_notes: notes || undefined,
      })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        setMessage({ type: 'success', text: 'Signup updated' })
        setTimeout(() => setMessage(null), 3000)
      }
    })
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Actions</h2>

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
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
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
            placeholder="Internal notes about this signup..."
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
          disabled={isPending}
          className="w-full px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}
