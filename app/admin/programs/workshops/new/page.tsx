'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkshop } from './actions'

export default function NewWorkshopPage() {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    start_time: '16:00',
    end_time: '19:30',
    location: "St. Luke's/San Lucas Episcopal Church",
    address: '426 E Fourth Plain Blvd, Vancouver, WA 98661',
    description: '',
    capacity: 12,
    price_cents: 7500,
    status: 'draft' as const,
    waitlist_enabled: true,
    registration_opens_at: '',
    registration_closes_at: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)

    const result = await createWorkshop(formData)

    if (result.error) {
      setError(result.error)
      setSaving(false)
    } else if (result.workshopId) {
      router.push(`/admin/programs/workshops/${result.workshopId}`)
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-stone-800"

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/admin/programs/workshops"
          className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
        >
          &larr; Back to Workshops
        </Link>
        <h1 className="font-display text-2xl font-bold text-stone-800">
          Create New Workshop
        </h1>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-stone-800 mb-4">Basic Information</h2>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
              Workshop Title *
            </label>
            <input
              id="title"
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={inputClass}
              placeholder="e.g., Winter Music Workshop"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-stone-700 mb-1">
                Date *
              </label>
              <input
                id="date"
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="start_time" className="block text-sm font-medium text-stone-700 mb-1">
                Start Time
              </label>
              <input
                id="start_time"
                type="time"
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="end_time" className="block text-sm font-medium text-stone-700 mb-1">
                End Time
              </label>
              <input
                id="end_time"
                type="time"
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-stone-700 mb-1">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-stone-700 mb-1">
              Address
            </label>
            <input
              id="address"
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-1">
              Description (optional)
            </label>
            <textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={inputClass}
              placeholder="Brief description for parents..."
            />
          </div>
        </div>

        {/* Capacity & Pricing */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-stone-800 mb-4">Capacity & Pricing</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="capacity" className="block text-sm font-medium text-stone-700 mb-1">
                Capacity
              </label>
              <input
                id="capacity"
                type="number"
                min={1}
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 12 })}
                className={inputClass}
              />
              <p className="text-xs text-stone-500 mt-1">Maximum number of children</p>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-stone-700 mb-1">
                Price ($)
              </label>
              <input
                id="price"
                type="number"
                min={0}
                step={0.01}
                value={(formData.price_cents / 100).toFixed(2)}
                onChange={(e) => setFormData({ ...formData, price_cents: Math.round(parseFloat(e.target.value) * 100) || 0 })}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.waitlist_enabled}
                onChange={(e) => setFormData({ ...formData, waitlist_enabled: e.target.checked })}
                className="w-5 h-5 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
              />
              <div>
                <span className="font-medium text-stone-700">Enable waitlist</span>
                <p className="text-sm text-stone-500">Allow registrations after capacity is reached</p>
              </div>
            </label>
          </div>
        </div>

        {/* Registration Window */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-stone-800 mb-4">Registration Window</h2>
          <p className="text-sm text-stone-500 mb-4">
            Optional: Set when registration opens and closes. Leave blank for manual control.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="registration_opens_at" className="block text-sm font-medium text-stone-700 mb-1">
                Opens At
              </label>
              <input
                id="registration_opens_at"
                type="datetime-local"
                value={formData.registration_opens_at}
                onChange={(e) => setFormData({ ...formData, registration_opens_at: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="registration_closes_at" className="block text-sm font-medium text-stone-700 mb-1">
                Closes At
              </label>
              <input
                id="registration_closes_at"
                type="datetime-local"
                value={formData.registration_closes_at}
                onChange={(e) => setFormData({ ...formData, registration_closes_at: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-stone-800 mb-4">Status</h2>

          <div className="flex gap-4">
            {(['draft', 'open', 'closed'] as const).map((status) => (
              <label key={status} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={status}
                  checked={formData.status === status}
                  onChange={() => setFormData({ ...formData, status })}
                  className="w-4 h-4 text-forest-600 focus:ring-forest-500"
                />
                <span className="text-stone-700 capitalize">{status}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-stone-500">
            Draft: Not visible to parents. Open: Accepting registrations. Closed: Visible but not accepting.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link
            href="/admin/programs/workshops"
            className="px-6 py-3 text-stone-600 hover:text-stone-800 font-medium"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating...' : 'Create Workshop'}
          </button>
        </div>
      </form>
    </div>
  )
}
