import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCampRegistrationWithChildren } from '@/lib/data'
import RegistrationActions from './RegistrationActions'

export const dynamic = 'force-dynamic'

export default async function CampRegistrationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const registration = await getCampRegistrationWithChildren(id)

  if (!registration) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCents = (cents: number | null) => {
    if (cents === null) return '-'
    return `$${(cents / 100).toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      cancelled: 'bg-stone-100 text-stone-500'
    }
    return styles[status] || styles.pending
  }

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-amber-100 text-amber-800',
      waived: 'bg-blue-100 text-blue-800'
    }
    return styles[status] || styles.unpaid
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/camp"
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Camp
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-800">
            {registration.parent_name}
          </h1>
          <p className="text-stone-500">
            Registered {formatDate(registration.created_at)}
          </p>
        </div>
        <div className="flex gap-2">
          <span className={`text-sm px-3 py-1 rounded-full ${getStatusBadge(registration.status)}`}>
            {registration.status}
          </span>
          <span className={`text-sm px-3 py-1 rounded-full ${getPaymentBadge(registration.payment_status)}`}>
            {registration.payment_status}
          </span>
        </div>
      </div>

      {/* Cancellation Notice */}
      {registration.status === 'cancelled' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-red-500 text-xl">✕</span>
            <div>
              <p className="font-medium text-red-800">Registration Cancelled</p>
              {registration.cancelled_at && (
                <p className="text-sm text-red-600">
                  Cancelled on {formatDate(registration.cancelled_at)}
                </p>
              )}
              {registration.cancellation_reason && (
                <p className="text-sm text-red-700 mt-1">
                  Reason: {registration.cancellation_reason}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Contact</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-stone-500">Email</dt>
                <dd className="text-stone-800">
                  <a href={`mailto:${registration.parent_email}`} className="text-terracotta-600 hover:underline">
                    {registration.parent_email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Phone</dt>
                <dd className="text-stone-800">{registration.parent_phone}</dd>
              </div>
            </dl>
          </div>

          {/* Emergency Contact */}
          <div className="bg-red-50 rounded-xl border border-red-200 p-6">
            <h2 className="font-display text-lg font-bold text-red-800 mb-4">Emergency Contact</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-red-600">Name</dt>
                <dd className="text-red-900 font-medium">{registration.emergency_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-red-600">Phone</dt>
                <dd className="text-red-900 font-medium">{registration.emergency_phone}</dd>
              </div>
              {registration.emergency_relationship && (
                <div className="sm:col-span-2">
                  <dt className="text-sm text-red-600">Relationship</dt>
                  <dd className="text-red-800">{registration.emergency_relationship}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Authorized Pickups */}
          <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
            <h2 className="font-display text-lg font-bold text-blue-800 mb-4">
              Authorized Pickups
              {registration.authorized_pickups && registration.authorized_pickups.length > 0 && (
                <span className="ml-2 text-sm font-normal text-blue-600">
                  ({registration.authorized_pickups.length})
                </span>
              )}
            </h2>
            {registration.authorized_pickups && registration.authorized_pickups.length > 0 ? (
              <ul className="space-y-2">
                {registration.authorized_pickups.map((pickup) => (
                  <li key={pickup.id} className="p-3 bg-white rounded-lg">
                    <span className="text-blue-900 font-medium">{pickup.name}</span>
                    {pickup.relationship && (
                      <span className="text-blue-600 ml-1">({pickup.relationship})</span>
                    )}
                    {pickup.phone && (
                      <p className="text-blue-700 text-sm mt-1">{pickup.phone}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-blue-600 italic">No authorized pickups added yet</p>
            )}
          </div>

          {/* Children */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">
              Children ({registration.children.length})
            </h2>
            <div className="space-y-4">
              {registration.children.map((child) => (
                <div key={child.id} className="p-4 bg-stone-50 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-medium text-stone-800">{child.child_name}</p>
                      <p className="text-sm text-stone-600">
                        Age {child.child_age}
                        {child.child_grade && ` • ${child.child_grade} grade`}
                      </p>
                      {child.child_school && (
                        <p className="text-sm text-stone-500">{child.child_school}</p>
                      )}
                    </div>
                    {child.discount_cents > 0 && (
                      <span className="text-sm text-green-600">
                        -{formatCents(child.discount_cents)} sibling discount
                      </span>
                    )}
                  </div>

                  {/* Medical Info */}
                  {(child.allergies || child.dietary_restrictions || child.medical_conditions || child.special_needs) && (
                    <div className="mt-3 pt-3 border-t border-stone-200 space-y-2">
                      {child.allergies && (
                        <div>
                          <span className="text-xs font-medium text-amber-700 bg-amber-100 px-2 py-0.5 rounded">Allergies</span>
                          <p className="text-sm text-stone-600 mt-1">{child.allergies}</p>
                        </div>
                      )}
                      {child.dietary_restrictions && (
                        <div>
                          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">Dietary</span>
                          <p className="text-sm text-stone-600 mt-1">{child.dietary_restrictions}</p>
                        </div>
                      )}
                      {child.medical_conditions && (
                        <div>
                          <span className="text-xs font-medium text-red-700 bg-red-100 px-2 py-0.5 rounded">Medical</span>
                          <p className="text-sm text-stone-600 mt-1">{child.medical_conditions}</p>
                        </div>
                      )}
                      {child.special_needs && (
                        <div>
                          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">Special Needs</span>
                          <p className="text-sm text-stone-600 mt-1">{child.special_needs}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Optional Info */}
          {(registration.how_heard || registration.excited_about || registration.message) && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Additional Info</h2>
              <dl className="space-y-4">
                {registration.how_heard && (
                  <div>
                    <dt className="text-sm text-stone-500">How did you hear about us?</dt>
                    <dd className="text-stone-800">{registration.how_heard}</dd>
                  </div>
                )}
                {registration.excited_about && (
                  <div>
                    <dt className="text-sm text-stone-500">What are you most excited about?</dt>
                    <dd className="text-stone-800">{registration.excited_about}</dd>
                  </div>
                )}
                {registration.message && (
                  <div>
                    <dt className="text-sm text-stone-500">Message</dt>
                    <dd className="text-stone-800">{registration.message}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Payment</h2>
            <dl className="space-y-3">
              <div className="flex justify-between">
                <dt className="text-stone-500">Total</dt>
                <dd className="font-medium text-stone-800">{formatCents(registration.total_amount_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Paid</dt>
                <dd className="text-stone-800">{formatCents(registration.amount_paid_cents)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Method</dt>
                <dd className="text-stone-800">{registration.payment_method || '-'}</dd>
              </div>
              {registration.tuition_assistance && (
                <div className="pt-2 border-t border-stone-100">
                  <p className="text-sm text-blue-600 font-medium">Tuition Assistance Requested</p>
                  {registration.assistance_notes && (
                    <p className="text-sm text-stone-600 mt-1">{registration.assistance_notes}</p>
                  )}
                </div>
              )}
            </dl>
          </div>

          {/* Actions */}
          <RegistrationActions
            registrationId={registration.id}
            currentStatus={registration.status}
            currentPaymentStatus={registration.payment_status}
            currentNotes={registration.admin_notes}
          />
        </div>
      </div>
    </div>
  )
}
