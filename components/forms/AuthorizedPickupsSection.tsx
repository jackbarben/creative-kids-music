'use client'

import { useState, useEffect, useRef } from 'react'

interface Pickup {
  name: string
  phone: string
  relationship: string
}

interface AuthorizedPickupsSectionProps {
  maxPickups?: number
  fieldErrors?: Record<string, string>
  defaultValues?: Pickup[]
}

export default function AuthorizedPickupsSection({
  maxPickups = 2,
  fieldErrors,
  defaultValues = [],
}: AuthorizedPickupsSectionProps) {
  const [pickups, setPickups] = useState<Pickup[]>(
    defaultValues.length > 0
      ? defaultValues
      : [{ name: '', phone: '', relationship: '' }]
  )

  // Track if user has manually modified the form
  const hasUserModified = useRef(false)

  // Update pickups when defaultValues change (async load from account settings)
  useEffect(() => {
    if (!hasUserModified.current && defaultValues.length > 0) {
      setPickups(defaultValues)
    }
  }, [defaultValues])

  const addPickup = () => {
    if (pickups.length < maxPickups) {
      setPickups([...pickups, { name: '', phone: '', relationship: '' }])
    }
  }

  const removePickup = (index: number) => {
    if (pickups.length > 1) {
      setPickups(pickups.filter((_, i) => i !== index))
    }
  }

  const updatePickup = (index: number, field: keyof Pickup, value: string) => {
    hasUserModified.current = true
    setPickups(
      pickups.map((p, i) => (i === index ? { ...p, [field]: value } : p))
    )
  }

  return (
    <section>
      <h3 className="font-syne text-xl font-bold text-stone-800 mb-2">
        Authorized Pickups
      </h3>
      <p className="text-sm text-stone-500 mb-4">
        People other than parents who can pick up your children at the end of the event.
      </p>

      <div className="space-y-4">
        {pickups.map((pickup, index) => (
          <div key={index} className="p-4 bg-stone-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-stone-600">
                Pickup #{index + 1}
              </span>
              {pickups.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePickup(index)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={`pickup_name_${index}`}
                  value={pickup.name}
                  onChange={(e) => updatePickup(index, 'name', e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"
                />
                {fieldErrors?.[`pickup_name_${index}`] && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors[`pickup_name_${index}`]}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name={`pickup_phone_${index}`}
                  value={pickup.phone}
                  onChange={(e) => updatePickup(index, 'phone', e.target.value)}
                  required
                  placeholder="(555) 555-5555"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Relationship
                </label>
                <input
                  type="text"
                  name={`pickup_relationship_${index}`}
                  value={pickup.relationship}
                  onChange={(e) => updatePickup(index, 'relationship', e.target.value)}
                  placeholder="e.g., Aunt"
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"
                />
              </div>
            </div>
          </div>
        ))}

        {/* Hidden input to track pickup count */}
        <input type="hidden" name="pickup_count" value={pickups.length} />

        {pickups.length < maxPickups && (
          <button
            type="button"
            onClick={addPickup}
            className="text-sm text-forest-600 hover:text-forest-700 font-medium"
          >
            + Add Another Pickup Person
          </button>
        )}
      </div>
    </section>
  )
}
