'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createWorkshopRegistration } from './actions'

interface Workshop {
  id: string
  title: string
  date: string
}

interface Child {
  name: string
  age: number
  school: string
  allergies: string
  medical_conditions: string
}

export default function NewWorkshopRegistration() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [workshopsLoaded, setWorkshopsLoaded] = useState(false)

  // Form state
  const [parentFirstName, setParentFirstName] = useState('')
  const [parentLastName, setParentLastName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentRelationship, setParentRelationship] = useState('Parent')

  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelationship, setEmergencyRelationship] = useState('')

  const [selectedWorkshops, setSelectedWorkshops] = useState<string[]>([])
  const [children, setChildren] = useState<Child[]>([{ name: '', age: 9, school: '', allergies: '', medical_conditions: '' }])

  const [initialStatus, setInitialStatus] = useState<'pending' | 'confirmed'>('confirmed')
  const [initialPaymentStatus, setInitialPaymentStatus] = useState<'unpaid' | 'paid' | 'partial' | 'waived'>('unpaid')
  const [adminNotes, setAdminNotes] = useState('')

  const [mediaConsentInternal, setMediaConsentInternal] = useState(true)
  const [mediaConsentMarketing, setMediaConsentMarketing] = useState(false)

  // Fetch workshops on mount
  useState(() => {
    fetch('/api/workshops')
      .then(res => res.json())
      .then(data => {
        setWorkshops(data)
        setWorkshopsLoaded(true)
      })
      .catch(() => setWorkshopsLoaded(true))
  })

  const addChild = () => {
    setChildren([...children, { name: '', age: 9, school: '', allergies: '', medical_conditions: '' }])
  }

  const removeChild = (index: number) => {
    if (children.length > 1) {
      setChildren(children.filter((_, i) => i !== index))
    }
  }

  const updateChild = (index: number, field: keyof Child, value: string | number) => {
    const updated = [...children]
    updated[index] = { ...updated[index], [field]: value }
    setChildren(updated)
  }

  const toggleWorkshop = (id: string) => {
    if (selectedWorkshops.includes(id)) {
      setSelectedWorkshops(selectedWorkshops.filter(w => w !== id))
    } else {
      setSelectedWorkshops([...selectedWorkshops, id])
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    startTransition(async () => {
      const result = await createWorkshopRegistration({
        parent_first_name: parentFirstName,
        parent_last_name: parentLastName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
        parent_relationship: parentRelationship,
        emergency_name: emergencyName || undefined,
        emergency_phone: emergencyPhone || undefined,
        emergency_relationship: emergencyRelationship || undefined,
        workshop_ids: selectedWorkshops,
        children: children.map(c => ({
          name: c.name,
          age: c.age,
          school: c.school || undefined,
          allergies: c.allergies || undefined,
          medical_conditions: c.medical_conditions || undefined,
        })),
        initial_status: initialStatus,
        initial_payment_status: initialPaymentStatus,
        admin_notes: adminNotes || undefined,
        media_consent_internal: mediaConsentInternal,
        media_consent_marketing: mediaConsentMarketing,
      })

      if (result.error) {
        setMessage({ type: 'error', text: result.error })
      } else {
        router.push(`/admin/workshops/${result.registrationId}`)
      }
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/workshops"
          className="text-sm text-forest-600 hover:text-forest-700"
        >
          &larr; Back to Workshops
        </Link>
        <h1 className="font-display text-2xl font-bold text-stone-800 mt-2">
          New Workshop Registration
        </h1>
        <p className="text-stone-500 text-sm">
          Create a registration manually. A confirmation email will be sent to the parent.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Parent/Guardian Info */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Parent/Guardian</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">First Name *</label>
              <input
                type="text"
                value={parentFirstName}
                onChange={(e) => setParentFirstName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Last Name *</label>
              <input
                type="text"
                value={parentLastName}
                onChange={(e) => setParentLastName(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Email *</label>
              <input
                type="email"
                value={parentEmail}
                onChange={(e) => setParentEmail(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={parentPhone}
                onChange={(e) => setParentPhone(e.target.value)}
                required
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Relationship *</label>
              <select
                value={parentRelationship}
                onChange={(e) => setParentRelationship(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              >
                <option value="Parent">Parent</option>
                <option value="Guardian">Guardian</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Emergency Contact (Optional)</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Phone</label>
              <input
                type="tel"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Relationship</label>
              <input
                type="text"
                value={emergencyRelationship}
                onChange={(e) => setEmergencyRelationship(e.target.value)}
                placeholder="Grandparent, Neighbor, etc."
                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Workshop Selection */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Workshops *</h2>
          {!workshopsLoaded ? (
            <p className="text-stone-500">Loading workshops...</p>
          ) : workshops.length === 0 ? (
            <p className="text-stone-500">No workshops available</p>
          ) : (
            <div className="space-y-2">
              {workshops.map((workshop) => (
                <label key={workshop.id} className="flex items-center gap-3 p-3 border border-stone-200 rounded-lg cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={selectedWorkshops.includes(workshop.id)}
                    onChange={() => toggleWorkshop(workshop.id)}
                    className="h-4 w-4 text-forest-600 border-stone-300 rounded focus:ring-forest-500"
                  />
                  <div>
                    <p className="font-medium text-stone-800">{workshop.title}</p>
                    <p className="text-sm text-stone-500">{formatDate(workshop.date)}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
          {selectedWorkshops.length === 0 && (
            <p className="text-sm text-red-600 mt-2">Please select at least one workshop</p>
          )}
        </div>

        {/* Children */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Children *</h2>
          <div className="space-y-4">
            {children.map((child, index) => (
              <div key={index} className="p-4 bg-stone-50 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-stone-700">Child {index + 1}</h3>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Name *</label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => updateChild(index, 'name', e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Age *</label>
                    <input
                      type="number"
                      min={5}
                      max={18}
                      value={child.age}
                      onChange={(e) => updateChild(index, 'age', parseInt(e.target.value) || 9)}
                      required
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">School</label>
                    <input
                      type="text"
                      value={child.school}
                      onChange={(e) => updateChild(index, 'school', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Allergies</label>
                    <input
                      type="text"
                      value={child.allergies}
                      onChange={(e) => updateChild(index, 'allergies', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">Medical Conditions</label>
                    <input
                      type="text"
                      value={child.medical_conditions}
                      onChange={(e) => updateChild(index, 'medical_conditions', e.target.value)}
                      className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addChild}
            className="mt-4 w-full px-4 py-2 border-2 border-dashed border-stone-300 rounded-lg text-stone-600 hover:border-forest-400 hover:text-forest-600 transition-colors"
          >
            + Add Another Child
          </button>
        </div>

        {/* Media Consent */}
        <div className="bg-white rounded-xl border border-stone-200 p-6">
          <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Media Consent</h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mediaConsentInternal}
                onChange={(e) => setMediaConsentInternal(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-forest-600 border-stone-300 rounded focus:ring-forest-500"
              />
              <div>
                <span className="text-sm font-medium text-stone-800">Internal Use</span>
                <p className="text-xs text-stone-500">Photos/videos for internal program records</p>
              </div>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mediaConsentMarketing}
                onChange={(e) => setMediaConsentMarketing(e.target.checked)}
                className="mt-0.5 h-4 w-4 text-forest-600 border-stone-300 rounded focus:ring-forest-500"
              />
              <div>
                <span className="text-sm font-medium text-stone-800">Marketing Use</span>
                <p className="text-xs text-stone-500">Photos/videos for website and social media</p>
              </div>
            </label>
          </div>
        </div>

        {/* Admin Options */}
        <div className="bg-amber-50 rounded-xl border border-amber-200 p-6">
          <h2 className="font-display text-lg font-bold text-amber-800 mb-4">Admin Options</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Initial Status</label>
              <select
                value={initialStatus}
                onChange={(e) => setInitialStatus(e.target.value as 'pending' | 'confirmed')}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">Payment Status</label>
              <select
                value={initialPaymentStatus}
                onChange={(e) => setInitialPaymentStatus(e.target.value as 'unpaid' | 'paid' | 'partial' | 'waived')}
                className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 bg-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="waived">Waived</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-amber-800 mb-1">Admin Notes</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              rows={2}
              placeholder="Internal notes about this registration..."
              className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-slate-800 bg-white"
            />
          </div>
        </div>

        {/* Message */}
        {message && (
          <div className={`p-4 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {message.text}
          </div>
        )}

        {/* Submit */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isPending || selectedWorkshops.length === 0}
            className="flex-1 px-6 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
          >
            {isPending ? 'Creating...' : 'Create Registration'}
          </button>
          <Link
            href="/admin/workshops"
            className="px-6 py-3 bg-stone-200 text-stone-700 rounded-lg font-medium hover:bg-stone-300 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}
