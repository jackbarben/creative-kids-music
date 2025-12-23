import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getWorkshopRegistrationWithChildren, getWorkshops } from '@/lib/data'
import RegistrationActions from './RegistrationActions'

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
          <h1 className="font-syne text-2xl font-bold text-stone-800">
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
            <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Contact</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
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

          {/* Children */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">
              Children ({registration.children.length})
            </h2>
            <div className="space-y-4">
              {registration.children.map((child) => (
                <div key={child.id} className="p-4 bg-stone-50 rounded-lg">
                  <div className="flex justify-between items-start">
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
                </div>
              ))}
            </div>
          </div>

          {/* Workshops */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">
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

          {/* Optional Info */}
          {(registration.how_heard || registration.excited_about || registration.message) && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Additional Info</h2>
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

        {/* Sidebar - Payment & Actions */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Payment</h2>
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
