'use client'

import { useState } from 'react'
import { WorkshopRegistration, WorkshopChild, Workshop } from '@/lib/database.types'
import { EditContactForm } from './EditContactForm'

interface RegistrationCardProps {
  registration: WorkshopRegistration
  registeredChildren: WorkshopChild[]
  workshopMap: Map<string, Pick<Workshop, 'id' | 'title' | 'date'>>
  email: string
}

export function RegistrationCard({
  registration,
  registeredChildren,
  workshopMap,
  email,
}: RegistrationCardProps) {
  const [showEdit, setShowEdit] = useState(false)

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      waitlist: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-stone-100 text-stone-500',
    }
    return styles[status] || styles.pending
  }

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-amber-100 text-amber-800',
      waived: 'bg-blue-100 text-blue-800',
    }
    return styles[status] || styles.unpaid
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const workshopDates = registration.workshop_ids
    .map((id) => workshopMap.get(id))
    .filter(Boolean)
    .map((w) => formatDate(w!.date))

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-forest-50 px-6 py-4 border-b border-forest-200">
        <div className="flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-forest-800">
            Workshop Registration
          </h2>
          <div className="flex gap-2">
            <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(registration.status)}`}>
              {registration.status}
            </span>
            <span className={`text-xs px-2 py-1 rounded ${getPaymentBadge(registration.payment_status)}`}>
              {registration.payment_status}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        {/* Workshops */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Workshops</h3>
          <ul className="space-y-1">
            {workshopDates.map((date, i) => (
              <li key={i} className="text-stone-800">
                {date}
              </li>
            ))}
          </ul>
        </div>

        {/* Children */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Children</h3>
          <ul className="space-y-1">
            {registeredChildren.map((child) => (
              <li key={child.id} className="text-stone-800">
                {child.child_name} (age {child.child_age})
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Contact</h3>
          <p className="text-stone-800">{registration.parent_name}</p>
          <p className="text-stone-600">{registration.parent_email}</p>
          {registration.parent_phone && (
            <p className="text-stone-600">{registration.parent_phone}</p>
          )}
        </div>

        {/* Payment */}
        {registration.total_amount_cents && (
          <div>
            <h3 className="text-sm font-medium text-stone-500 mb-2">Payment</h3>
            <p className="text-stone-800">
              Total: ${(registration.total_amount_cents / 100).toFixed(2)}
            </p>
            {registration.tuition_assistance && (
              <p className="text-amber-600 text-sm">Tuition assistance requested</p>
            )}
          </div>
        )}

        {/* Edit Form */}
        {showEdit ? (
          <EditContactForm
            registrationType="workshop"
            registrationId={registration.id}
            email={email}
            currentPhone={registration.parent_phone || ''}
            onClose={() => setShowEdit(false)}
          />
        ) : (
          <button
            onClick={() => setShowEdit(true)}
            className="text-sm text-forest-600 hover:text-forest-700 hover:underline"
          >
            Edit contact info
          </button>
        )}
      </div>
    </div>
  )
}
