'use client'

import { useState } from 'react'
import { WorkshopRegistrationWithChildren, CampRegistrationWithChildren, Workshop } from '@/lib/database.types'
import EditChildModal from './EditChildModal'
import AddChildModal from './AddChildModal'
import RemoveChildModal from './RemoveChildModal'
import CancelModal from './CancelModal'
import AddPickupModal from './AddPickupModal'
import { removePickup } from '@/app/account/actions'
import { PROGRAMS } from '@/lib/constants'

interface RegistrationCardProps {
  registration: WorkshopRegistrationWithChildren | CampRegistrationWithChildren
  programType: 'workshop' | 'camp'
  workshops?: Workshop[]
}

type ChildType = WorkshopRegistrationWithChildren['children'][0] | CampRegistrationWithChildren['children'][0]

export default function RegistrationCard({ registration, programType, workshops }: RegistrationCardProps) {
  const [editChildOpen, setEditChildOpen] = useState<ChildType | null>(null)
  const [addChildOpen, setAddChildOpen] = useState(false)
  const [removeChildOpen, setRemoveChildOpen] = useState<ChildType | null>(null)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [addPickupOpen, setAddPickupOpen] = useState(false)

  const isCancelled = registration.status === 'cancelled'
  const isPaid = registration.payment_status === 'paid'

  // Calculate if program has started (simplified - checks first date)
  const programStarted = (() => {
    if (programType === 'workshop' && workshops?.length) {
      const firstDate = workshops
        .map(w => new Date(w.date + 'T00:00:00'))
        .sort((a, b) => a.getTime() - b.getTime())[0]
      return firstDate && firstDate < new Date()
    }
    return new Date() >= PROGRAMS.camp.startDate
  })()

  const formatDate = (dateStr: string) => {
    // Append T00:00:00 to avoid timezone shift issues
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCurrency = (cents: number | null) => {
    if (cents === null) return '$0'
    return `$${(cents / 100).toFixed(0)}`
  }

  const amountDue = (registration.total_amount_cents || 0) - (registration.amount_paid_cents || 0)

  // Get status badge
  const statusBadge = () => {
    if (isCancelled) {
      return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded">Cancelled</span>
    }
    if (programStarted) {
      return <span className="px-2 py-1 text-xs font-medium bg-slate-100 text-slate-600 rounded">Completed</span>
    }
    if (registration.status === 'confirmed') {
      return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded">Confirmed</span>
    }
    return <span className="px-2 py-1 text-xs font-medium bg-amber-100 text-amber-700 rounded">Pending</span>
  }

  const handleRemovePickup = async (pickupId: string) => {
    if (!confirm('Remove this pickup person?')) return
    await removePickup(pickupId, registration.id)
  }

  const programName = programType === 'workshop' ? 'Spring Workshop' : 'Summer Camp 2026'

  // Get camp-specific data
  const campRegistration = programType === 'camp' ? registration as CampRegistrationWithChildren : null

  return (
    <>
      <div className={`bg-white rounded-2xl border ${isCancelled ? 'border-slate-200 opacity-60' : 'border-slate-100'} p-6`}>
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="font-display text-xl font-semibold text-slate-800">
              {programName}
            </h2>
            {programType === 'workshop' && workshops?.length ? (
              <p className="text-slate-500 text-sm mt-1">
                {workshops.map(w => formatDate(w.date)).join(', ')}
              </p>
            ) : programType === 'camp' ? (
              <p className="text-slate-500 text-sm mt-1">
                August 3–7, 2026
              </p>
            ) : null}
          </div>
          {statusBadge()}
        </div>

        {/* Children */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-slate-700 mb-2">Children</h3>
          <div className="space-y-2">
            {registration.children.map((child) => (
              <div
                key={child.id}
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
              >
                <div>
                  <span className="font-medium text-slate-800">{child.child_name}</span>
                  <span className="text-slate-500 ml-2">Age {child.child_age}</span>
                  {'allergies' in child && child.allergies && (
                    <p className="text-xs text-slate-500 mt-1">
                      Allergies: {child.allergies}
                    </p>
                  )}
                </div>
                {!programStarted && !isCancelled && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditChildOpen(child)}
                      className="text-xs text-slate-500 hover:text-slate-700"
                    >
                      Edit
                    </button>
                    {registration.children.length > 1 && (
                      <button
                        onClick={() => setRemoveChildOpen(child)}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {!programStarted && !isCancelled && (
            <button
              onClick={() => setAddChildOpen(true)}
              className="mt-2 text-sm text-slate-600 hover:text-slate-800"
            >
              + Add Child
            </button>
          )}
        </div>

        {/* Camp-specific: Authorized Pickups */}
        {programType === 'camp' && campRegistration && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-slate-700 mb-2">Authorized Pickups</h3>
            <div className="space-y-2">
              {campRegistration.authorized_pickups?.map((pickup) => (
                <div
                  key={pickup.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <span className="text-slate-800">{pickup.name}</span>
                    {pickup.relationship && (
                      <span className="text-slate-500 text-sm ml-1">({pickup.relationship})</span>
                    )}
                    {pickup.phone && (
                      <p className="text-slate-500 text-sm">{pickup.phone}</p>
                    )}
                  </div>
                  {!programStarted && !isCancelled && (
                    <button
                      onClick={() => handleRemovePickup(pickup.id)}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              {(!campRegistration.authorized_pickups || campRegistration.authorized_pickups.length === 0) && (
                <p className="text-sm text-slate-500 italic">No pickups added yet</p>
              )}
            </div>
            {!programStarted && !isCancelled && (
              <button
                onClick={() => setAddPickupOpen(true)}
                className="mt-2 text-sm text-slate-600 hover:text-slate-800"
              >
                + Add Pickup Person
              </button>
            )}
          </div>
        )}

        {/* Payment Info */}
        <div className="py-4 border-t border-slate-100">
          <div className="flex justify-between text-sm">
            <span className="text-slate-500">Total</span>
            <span className="text-slate-800 font-medium">
              {formatCurrency(registration.total_amount_cents)}
              {registration.children.length > 1 && (
                <span className="text-slate-400 font-normal ml-1">(sibling discount applied)</span>
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-slate-500">Paid</span>
            <span className="text-slate-800">{formatCurrency(registration.amount_paid_cents)}</span>
          </div>
          {amountDue > 0 && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Due</span>
              <span className="text-amber-600 font-medium">{formatCurrency(amountDue)}</span>
            </div>
          )}
          {amountDue <= 0 && isPaid && (
            <div className="flex justify-between text-sm mt-1">
              <span className="text-slate-500">Due</span>
              <span className="text-green-600 font-medium">$0 ✓</span>
            </div>
          )}
        </div>

        {/* Actions */}
        {!isCancelled && !programStarted && (
          <div className="flex items-center justify-end pt-4 border-t border-slate-100">
            <button
              onClick={() => setCancelOpen(true)}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Cancel Registration
            </button>
          </div>
        )}

        {/* Program Started Notice */}
        {programStarted && !isCancelled && (
          <p className="text-xs text-slate-400 mt-4">
            No changes allowed — program has started
          </p>
        )}
      </div>

      {/* Modals */}
      {editChildOpen && (
        <EditChildModal
          isOpen={!!editChildOpen}
          onClose={() => setEditChildOpen(null)}
          childId={editChildOpen.id}
          registrationId={registration.id}
          programType={programType}
          currentData={{
            child_name: editChildOpen.child_name,
            child_age: editChildOpen.child_age,
            child_school: editChildOpen.child_school,
            allergies: editChildOpen.allergies,
            medical_conditions: editChildOpen.medical_conditions,
            ...('special_needs' in editChildOpen && {
              special_needs: editChildOpen.special_needs,
            }),
          }}
        />
      )}

      <AddChildModal
        isOpen={addChildOpen}
        onClose={() => setAddChildOpen(false)}
        registrationId={registration.id}
        programType={programType}
        currentChildCount={registration.children.length}
      />

      {removeChildOpen && (
        <RemoveChildModal
          isOpen={!!removeChildOpen}
          onClose={() => setRemoveChildOpen(null)}
          childId={removeChildOpen.id}
          childName={removeChildOpen.child_name}
          registrationId={registration.id}
          programType={programType}
          isPaid={isPaid}
        />
      )}

      <CancelModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        registrationId={registration.id}
        programType={programType}
        programName={programName}
        isPaid={isPaid}
      />

      {programType === 'camp' && (
        <AddPickupModal
          isOpen={addPickupOpen}
          onClose={() => setAddPickupOpen(false)}
          registrationId={registration.id}
        />
      )}
    </>
  )
}
