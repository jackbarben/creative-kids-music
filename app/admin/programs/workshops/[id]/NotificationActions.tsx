'use client'

import { useState } from 'react'
import { sendWorkshopReminders, notifyWaitlist } from './actions'

interface NotificationActionsProps {
  workshopId: string
  workshopDate: string
  registeredCount: number
  waitlistCount: number
}

export default function NotificationActions({
  workshopId,
  workshopDate,
  registeredCount,
  waitlistCount,
}: NotificationActionsProps) {
  const [sendingReminders, setSendingReminders] = useState(false)
  const [notifyingWaitlist, setNotifyingWaitlist] = useState(false)
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Compare dates properly (ignoring time/timezone issues)
  const getTodayStr = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }

  const getTomorrowStr = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`
  }

  const isPast = workshopDate < getTodayStr()
  const isToday = workshopDate === getTodayStr()
  const isTomorrow = workshopDate === getTomorrowStr()

  const handleSendReminders = async () => {
    if (!confirm(`Send reminder emails to ${registeredCount} registered families?`)) {
      return
    }

    setSendingReminders(true)
    setResult(null)

    const res = await sendWorkshopReminders(workshopId)

    setSendingReminders(false)

    if (res.success) {
      setResult({
        type: 'success',
        message: `Sent ${res.sent} reminder${res.sent !== 1 ? 's' : ''}${res.failed > 0 ? ` (${res.failed} failed)` : ''}`,
      })
    } else {
      setResult({ type: 'error', message: res.error || 'Failed to send reminders' })
    }

    // Clear result after 5 seconds
    setTimeout(() => setResult(null), 5000)
  }

  const handleNotifyWaitlist = async () => {
    const spots = prompt('How many spots are available?', '1')
    if (!spots) return

    const spotsNum = parseInt(spots)
    if (isNaN(spotsNum) || spotsNum < 1) {
      setResult({ type: 'error', message: 'Please enter a valid number' })
      return
    }

    setNotifyingWaitlist(true)
    setResult(null)

    const res = await notifyWaitlist(workshopId, spotsNum)

    setNotifyingWaitlist(false)

    if (res.success) {
      setResult({
        type: 'success',
        message: res.notified > 0
          ? `Notified ${res.notified} ${res.notified === 1 ? 'person' : 'people'} on waitlist`
          : 'No one on waitlist to notify',
      })
    } else {
      setResult({ type: 'error', message: res.error || 'Failed to notify waitlist' })
    }

    setTimeout(() => setResult(null), 5000)
  }

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6">
      <h3 className="font-display font-bold text-stone-800 mb-4">Notifications</h3>

      {result && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            result.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
        >
          {result.message}
        </div>
      )}

      <div className="space-y-3">
        {/* Send Reminders */}
        <div>
          <button
            onClick={handleSendReminders}
            disabled={sendingReminders || isPast || registeredCount === 0}
            className="w-full px-4 py-2 text-center bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sendingReminders ? 'Sending...' : 'Send Reminders'}
          </button>
          <p className="text-xs text-stone-500 mt-1">
            {isPast
              ? 'Workshop has passed'
              : registeredCount === 0
              ? 'No registrations'
              : isTomorrow
              ? `Send "tomorrow!" reminder to ${registeredCount} families`
              : isToday
              ? `Send "today!" reminder to ${registeredCount} families`
              : `Email ${registeredCount} registered families`}
          </p>
        </div>

        {/* Notify Waitlist */}
        {waitlistCount > 0 && (
          <div>
            <button
              onClick={handleNotifyWaitlist}
              disabled={notifyingWaitlist || isPast}
              className="w-full px-4 py-2 text-center bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {notifyingWaitlist ? 'Notifying...' : 'Notify Waitlist'}
            </button>
            <p className="text-xs text-stone-500 mt-1">
              {isPast
                ? 'Workshop has passed'
                : `Let ${waitlistCount} ${waitlistCount === 1 ? 'person' : 'people'} know a spot opened`}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
