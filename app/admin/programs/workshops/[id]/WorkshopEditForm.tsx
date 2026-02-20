'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Workshop } from '@/lib/database.types'
import { updateWorkshop, updateProgramNotes, archiveWorkshop, deleteWorkshop } from './actions'

interface WorkshopEditFormProps {
  workshop: Workshop
}

export default function WorkshopEditForm({ workshop }: WorkshopEditFormProps) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [savingNotes, setSavingNotes] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Compare dates properly (ignoring time/timezone issues)
  const isDatePast = (dateString: string) => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return dateString < todayStr
  }

  const isPast = isDatePast(workshop.date)

  const [formData, setFormData] = useState({
    title: workshop.title,
    date: workshop.date,
    start_time: workshop.start_time,
    end_time: workshop.end_time,
    location: workshop.location,
    address: workshop.address || '',
    description: workshop.description || '',
    capacity: workshop.capacity || 12,
    price_cents: workshop.price_cents || 7500,
    status: workshop.status || 'draft',
    waitlist_enabled: workshop.waitlist_enabled ?? true,
    registration_opens_at: workshop.registration_opens_at?.slice(0, 16) || '',
    registration_closes_at: workshop.registration_closes_at?.slice(0, 16) || '',
    notes: workshop.notes || '',
    media_folder_url: workshop.media_folder_url || '',
  })

  const [notesData, setNotesData] = useState({
    performance_summary: workshop.performance_summary || '',
    session_summary: workshop.session_summary || '',
    highlights: workshop.highlights || '',
    lessons_learned: workshop.lessons_learned || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(null)

    const result = await updateWorkshop(workshop.id, {
      ...formData,
      registration_opens_at: formData.registration_opens_at || null,
      registration_closes_at: formData.registration_closes_at || null,
      notes: formData.notes || null,
      media_folder_url: formData.media_folder_url || null,
      description: formData.description || null,
    })

    setSaving(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Workshop updated successfully')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleSaveNotes = async () => {
    setSavingNotes(true)
    setError(null)
    setSuccess(null)

    const result = await updateProgramNotes(workshop.id, {
      performance_summary: notesData.performance_summary || null,
      session_summary: notesData.session_summary || null,
      highlights: notesData.highlights || null,
      lessons_learned: notesData.lessons_learned || null,
    })

    setSavingNotes(false)

    if (result.error) {
      setError(result.error)
    } else {
      setSuccess('Program notes saved')
      setTimeout(() => setSuccess(null), 3000)
    }
  }

  const handleArchive = async () => {
    if (!confirm('Are you sure you want to archive this workshop? It will be hidden from the main list.')) {
      return
    }

    const result = await archiveWorkshop(workshop.id)
    if (result.error) {
      setError(result.error)
    } else {
      router.push('/admin/programs/workshops')
    }
  }

  const handleDelete = async () => {
    const result = await deleteWorkshop(workshop.id)
    if (result.error) {
      setError(result.error)
      setShowDeleteConfirm(false)
    } else {
      router.push('/admin/programs/workshops')
    }
  }

  const inputClass = "w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-500 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-stone-800"

  return (
    <div className="space-y-6">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
          {success}
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
              Description
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

          <div className="flex flex-wrap gap-4">
            {(['draft', 'open', 'closed', 'completed'] as const).map((status) => (
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
            Draft: Not visible. Open: Accepting registrations. Closed: Visible but not accepting. Completed: Past workshop with notes.
          </p>
        </div>

        {/* Admin Notes */}
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <h2 className="font-display font-bold text-stone-800 mb-4">Admin Notes</h2>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-stone-700 mb-1">
              Internal Notes
            </label>
            <textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className={inputClass}
              placeholder="Notes visible only to admins..."
            />
          </div>

          <div>
            <label htmlFor="media_folder_url" className="block text-sm font-medium text-stone-700 mb-1">
              Media Folder URL
            </label>
            <input
              id="media_folder_url"
              type="url"
              value={formData.media_folder_url}
              onChange={(e) => setFormData({ ...formData, media_folder_url: e.target.value })}
              className={inputClass}
              placeholder="Link to Google Drive folder with photos/videos..."
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>

      {/* Program Notes (for completed/past workshops) */}
      {(isPast || formData.status === 'completed') && (
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-stone-800">Program Notes</h2>
            <span className="text-xs text-stone-500">For completed workshops</span>
          </div>

          <div>
            <label htmlFor="performance_summary" className="block text-sm font-medium text-stone-700 mb-1">
              Performance Summary
            </label>
            <textarea
              id="performance_summary"
              rows={3}
              value={notesData.performance_summary}
              onChange={(e) => setNotesData({ ...notesData, performance_summary: e.target.value })}
              className={inputClass}
              placeholder="How did the final performance go?"
            />
          </div>

          <div>
            <label htmlFor="session_summary" className="block text-sm font-medium text-stone-700 mb-1">
              Session Summary
            </label>
            <textarea
              id="session_summary"
              rows={3}
              value={notesData.session_summary}
              onChange={(e) => setNotesData({ ...notesData, session_summary: e.target.value })}
              className={inputClass}
              placeholder="What did we work on? What songs/activities?"
            />
          </div>

          <div>
            <label htmlFor="highlights" className="block text-sm font-medium text-stone-700 mb-1">
              Highlights
            </label>
            <textarea
              id="highlights"
              rows={2}
              value={notesData.highlights}
              onChange={(e) => setNotesData({ ...notesData, highlights: e.target.value })}
              className={inputClass}
              placeholder="Special moments, standout kids, breakthroughs..."
            />
          </div>

          <div>
            <label htmlFor="lessons_learned" className="block text-sm font-medium text-stone-700 mb-1">
              Lessons Learned
            </label>
            <textarea
              id="lessons_learned"
              rows={2}
              value={notesData.lessons_learned}
              onChange={(e) => setNotesData({ ...notesData, lessons_learned: e.target.value })}
              className={inputClass}
              placeholder="What would we do differently next time?"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium disabled:opacity-50 transition-colors"
            >
              {savingNotes ? 'Saving...' : 'Save Program Notes'}
            </button>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="font-display font-bold text-red-700 mb-4">Danger Zone</h2>
        <div className="space-y-4">
          {workshop.status !== 'archived' && (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-stone-700">Archive Workshop</p>
                <p className="text-sm text-stone-500">Hide from main list. Can be restored later.</p>
              </div>
              <button
                type="button"
                onClick={handleArchive}
                className="px-4 py-2 text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg font-medium transition-colors"
              >
                Archive
              </button>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-stone-700">Delete Workshop</p>
              <p className="text-sm text-stone-500">Permanently delete. Only works if no registrations.</p>
            </div>
            {showDeleteConfirm ? (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-stone-600 hover:text-stone-800 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors"
                >
                  Confirm Delete
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-medium transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
