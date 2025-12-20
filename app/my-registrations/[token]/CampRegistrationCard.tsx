'use client'

import { useState } from 'react'
import { CampRegistration, CampChild } from '@/lib/database.types'
import { EditContactForm } from './EditContactForm'

interface CampRegistrationCardProps {
  registration: CampRegistration
  registeredChildren: CampChild[]
  email: string
}

export function CampRegistrationCard({
  registration,
  registeredChildren,
  email,
}: CampRegistrationCardProps) {
  const [showEdit, setShowEdit] = useState(false)

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
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

  return (
    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
      {/* Header */}
      <div className="bg-terracotta-50 px-6 py-4 border-b border-terracotta-200">
        <div className="flex items-center justify-between">
          <h2 className="font-syne text-lg font-bold text-terracotta-800">
            Summer Camp 2026
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
        {/* Camp Info */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Dates</h3>
          <p className="text-stone-800">June 22–27, 2026</p>
          <p className="text-stone-600 text-sm">Monday–Friday, 8:30 AM – 5:00 PM · Lunch included</p>
          <p className="text-stone-600 text-sm">Sunday performance, June 29 · 9–11 AM</p>
        </div>

        {/* Children */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Children</h3>
          <ul className="space-y-2">
            {registeredChildren.map((child) => (
              <li key={child.id} className="text-stone-800">
                <span className="font-medium">{child.child_name}</span> (age {child.child_age})
                {child.allergies && (
                  <p className="text-sm text-stone-500">Allergies: {child.allergies}</p>
                )}
                {child.medical_conditions && (
                  <p className="text-sm text-stone-500">Medical: {child.medical_conditions}</p>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Contact</h3>
          <p className="text-stone-800">{registration.parent_name}</p>
          <p className="text-stone-600">{registration.parent_email}</p>
          <p className="text-stone-600">{registration.parent_phone}</p>
        </div>

        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-medium text-stone-500 mb-2">Emergency Contact</h3>
          <p className="text-stone-800">{registration.emergency_name}</p>
          <p className="text-stone-600">{registration.emergency_phone}</p>
          {registration.emergency_relationship && (
            <p className="text-stone-500 text-sm">({registration.emergency_relationship})</p>
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
            registrationType="camp"
            registrationId={registration.id}
            email={email}
            currentPhone={registration.parent_phone}
            currentEmergencyName={registration.emergency_name}
            currentEmergencyPhone={registration.emergency_phone}
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
