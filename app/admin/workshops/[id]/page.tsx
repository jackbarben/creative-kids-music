import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkshopRegistrationWithChildren, getWorkshops } from '@/lib/data'
import RegistrationActions from './RegistrationActions'
import RegistrationEditPanel from './RegistrationEditPanel'

export const dynamic = 'force-dynamic'

export default async function WorkshopRegistrationDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const registration = await getWorkshopRegistrationWithChildren(id)
  const workshops = await getWorkshops()

  if (!registration) {
    notFound()
  }

  const workshopMap = new Map(workshops.map(w => [w.id, w]))

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
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
      waitlist: 'bg-blue-100 text-blue-800',
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
            href="/admin/workshops"
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Workshops
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-800">
            {registration.parent_name}
          </h1>
          <p className="text-stone-500">
            Registered {formatDate(registration.created_at)}
            {registration.user_id && (
              <span className="ml-2 text-xs bg-forest-100 text-forest-700 px-2 py-0.5 rounded-full">
                Account Linked
              </span>
            )}
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
                <dt className="text-sm text-stone-500">Name</dt>
                <dd className="text-stone-800">{registration.parent_name}</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Relationship</dt>
                <dd className="text-stone-800">{registration.parent_relationship || '-'}</dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Email</dt>
                <dd className="text-stone-800">
                  <a href={`mailto:${registration.parent_email}`} className="text-forest-600 hover:underline">
                    {registration.parent_email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Phone</dt>
                <dd className="text-stone-800">{registration.parent_phone || '-'}</dd>
              </div>
            </dl>
          </div>

          {/* Emergency Contact */}
          {(registration.emergency_name || registration.emergency_phone) && (
            <div className="bg-red-50 rounded-xl border border-red-200 p-6">
              <h2 className="font-display text-lg font-bold text-red-800 mb-4">Emergency Contact</h2>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div>
                  <dt className="text-sm text-red-600">Name</dt>
                  <dd className="text-red-900 font-medium">{registration.emergency_name || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-red-600">Phone</dt>
                  <dd className="text-red-900 font-medium">{registration.emergency_phone || '-'}</dd>
                </div>
                <div>
                  <dt className="text-sm text-red-600">Relationship</dt>
                  <dd className="text-red-900">{registration.emergency_relationship || '-'}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Authorized Pickups */}
          {registration.authorized_pickups && registration.authorized_pickups.length > 0 && (
            <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
              <h2 className="font-display text-lg font-bold text-blue-800 mb-4">
                Authorized Pickups ({registration.authorized_pickups.length})
              </h2>
              <div className="space-y-3">
                {registration.authorized_pickups.map((pickup) => (
                  <div key={pickup.id} className="flex justify-between items-center p-3 bg-white rounded-lg">
                    <div>
                      <p className="font-medium text-blue-900">{pickup.name}</p>
                      {pickup.relationship && (
                        <p className="text-sm text-blue-700">{pickup.relationship}</p>
                      )}
                    </div>
                    {pickup.phone && (
                      <p className="text-sm text-blue-800">{pickup.phone}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

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
                      <p className="text-sm text-stone-600">Age {child.child_age}</p>
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
                  {(child.allergies || child.dietary_restrictions || child.medical_conditions) && (
                    <div className="pt-3 border-t border-stone-200 space-y-2">
                      {child.allergies && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded">Allergies</span>
                          <span className="text-sm text-stone-700">{child.allergies}</span>
                        </div>
                      )}
                      {child.dietary_restrictions && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded">Dietary</span>
                          <span className="text-sm text-stone-700">{child.dietary_restrictions}</span>
                        </div>
                      )}
                      {child.medical_conditions && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-0.5 rounded">Medical</span>
                          <span className="text-sm text-stone-700">{child.medical_conditions}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Workshops */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">
              Workshops Selected ({registration.workshop_ids.length})
            </h2>
            <div className="space-y-2">
              {registration.workshop_ids.map((workshopId) => {
                const workshop = workshopMap.get(workshopId)
                return (
                  <div key={workshopId} className="p-3 bg-forest-50 rounded-lg">
                    {workshop ? (
                      <p className="text-forest-800">
                        {workshop.title} - {formatDate(workshop.date)}
                      </p>
                    ) : (
                      <p className="text-stone-500">Workshop {workshopId}</p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Media Consent */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Media Consent</h2>
            <div className="flex flex-wrap gap-3">
              <span className={`text-sm px-3 py-1 rounded-full ${
                registration.media_consent_internal
                  ? 'bg-green-100 text-green-800'
                  : 'bg-stone-100 text-stone-500'
              }`}>
                {registration.media_consent_internal ? '✓' : '✗'} Internal Documentation
              </span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                registration.media_consent_marketing
                  ? 'bg-green-100 text-green-800'
                  : 'bg-stone-100 text-stone-500'
              }`}>
                {registration.media_consent_marketing ? '✓' : '✗'} Marketing Use
              </span>
            </div>
            {registration.media_consent_accepted_at && (
              <p className="text-xs text-stone-400 mt-2">
                Consent recorded {formatDateTime(registration.media_consent_accepted_at)}
              </p>
            )}
          </div>

          {/* Agreements */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-800 mb-4">Agreements</h2>
            <dl className="space-y-3">
              <div className="flex justify-between items-center">
                <dt className="text-stone-600">Terms & Conditions</dt>
                <dd className="text-sm">
                  {registration.terms_accepted ? (
                    <span className="text-green-600">
                      ✓ Accepted {registration.terms_accepted_at && formatDateTime(registration.terms_accepted_at)}
                    </span>
                  ) : (
                    <span className="text-red-600">✗ Not accepted</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between items-center">
                <dt className="text-stone-600">Liability Waiver</dt>
                <dd className="text-sm">
                  {registration.liability_waiver_accepted ? (
                    <span className="text-green-600">
                      ✓ Accepted {registration.liability_waiver_accepted_at && formatDateTime(registration.liability_waiver_accepted_at)}
                    </span>
                  ) : (
                    <span className="text-red-600">✗ Not accepted</span>
                  )}
                </dd>
              </div>
            </dl>
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

          {/* Metadata */}
          <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
            <h2 className="font-display text-lg font-bold text-stone-600 mb-4">Registration Details</h2>
            <dl className="grid gap-3 sm:grid-cols-2 text-sm">
              <div>
                <dt className="text-stone-400">Registration ID</dt>
                <dd className="text-stone-600 font-mono text-xs">{registration.id}</dd>
              </div>
              <div>
                <dt className="text-stone-400">Confirmation #</dt>
                <dd className="text-stone-600 font-mono">{registration.id.substring(0, 8).toUpperCase()}</dd>
              </div>
              <div>
                <dt className="text-stone-400">Created</dt>
                <dd className="text-stone-600">{formatDateTime(registration.created_at)}</dd>
              </div>
              <div>
                <dt className="text-stone-400">Last Updated</dt>
                <dd className="text-stone-600">{formatDateTime(registration.updated_at)}</dd>
              </div>
              {registration.user_id && (
                <div className="sm:col-span-2">
                  <dt className="text-stone-400">Linked Account</dt>
                  <dd className="text-stone-600 font-mono text-xs">{registration.user_id}</dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Sidebar - Payment & Actions */}
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
                <dt className="text-stone-500">Outstanding</dt>
                <dd className={`font-medium ${
                  (registration.total_amount_cents || 0) - (registration.amount_paid_cents || 0) > 0
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}>
                  {formatCents((registration.total_amount_cents || 0) - (registration.amount_paid_cents || 0))}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Method</dt>
                <dd className="text-stone-800">{registration.payment_method || '-'}</dd>
              </div>
              {registration.payment_date && (
                <div className="flex justify-between">
                  <dt className="text-stone-500">Payment Date</dt>
                  <dd className="text-stone-800">{formatDateTime(registration.payment_date)}</dd>
                </div>
              )}
              {registration.payment_notes && (
                <div className="pt-2 border-t border-stone-100">
                  <dt className="text-sm text-stone-500 mb-1">Payment Notes</dt>
                  <dd className="text-sm text-stone-700">{registration.payment_notes}</dd>
                </div>
              )}
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
            workshops={registration.workshop_ids
              .map(id => workshopMap.get(id))
              .filter((w): w is NonNullable<typeof w> => w !== undefined)
              .map(w => ({ id: w.id, title: w.title, date: w.date }))
            }
          />

          {/* Edit Panel */}
          <RegistrationEditPanel
            registrationId={registration.id}
            registrationStatus={registration.status}
            parentInfo={{
              parent_name: registration.parent_name,
              parent_first_name: registration.parent_first_name,
              parent_last_name: registration.parent_last_name,
              parent_email: registration.parent_email,
              parent_phone: registration.parent_phone,
              parent_relationship: registration.parent_relationship,
            }}
            emergencyInfo={{
              emergency_name: registration.emergency_name,
              emergency_phone: registration.emergency_phone,
              emergency_relationship: registration.emergency_relationship,
            }}
            mediaConsent={{
              media_consent_internal: registration.media_consent_internal,
              media_consent_marketing: registration.media_consent_marketing,
            }}
            registeredChildren={registration.children.map(c => ({
              id: c.id,
              child_name: c.child_name,
              child_age: c.child_age,
              child_school: c.child_school,
              allergies: c.allergies,
              dietary_restrictions: c.dietary_restrictions,
              medical_conditions: c.medical_conditions,
              discount_cents: c.discount_cents,
            }))}
            pickups={registration.authorized_pickups?.map(p => ({
              id: p.id,
              name: p.name,
              phone: p.phone,
              relationship: p.relationship,
            })) || []}
          />
        </div>
      </div>
    </div>
  )
}
