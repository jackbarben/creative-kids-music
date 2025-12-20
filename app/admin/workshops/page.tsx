import Link from 'next/link'
import { getWorkshops, getWorkshopRegistrations } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function WorkshopsAdmin() {
  const workshops = await getWorkshops()
  const registrations = await getWorkshopRegistrations()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
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

  const formatCents = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`
  }

  return (
    <div className="space-y-6">
      {/* Workshops Overview */}
      <div className="bg-forest-50 rounded-2xl border border-forest-200 p-6">
        <h3 className="font-syne text-lg font-bold text-forest-800 mb-4">Workshop Schedule</h3>
        {workshops.length === 0 ? (
          <div className="bg-white rounded-xl p-6 text-center border border-forest-200">
            <p className="text-stone-500">No workshops found. Run the database migration to add initial workshops.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {workshops.map((workshop) => (
              <div key={workshop.id} className="bg-white rounded-xl p-4 border border-forest-200">
                <p className="font-semibold text-forest-800">{workshop.title}</p>
                <p className="text-sm text-forest-600">
                  {formatDate(workshop.date)}
                </p>
                <p className="text-sm text-forest-600">
                  {formatTime(workshop.start_time)} – {formatTime(workshop.end_time)}
                </p>
                <p className="text-sm text-stone-500 mt-2">
                  {formatCents(workshop.price_cents)} • Capacity: {workshop.capacity}
                </p>
                {!workshop.is_active && (
                  <span className="inline-block mt-2 text-xs bg-stone-200 text-stone-600 px-2 py-1 rounded">
                    Inactive
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registrations */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-syne text-xl font-bold text-stone-800 mb-2">
              Workshop Registrations
            </h2>
            <p className="text-stone-500">
              View and manage registrations for Spring 2026 workshops.
            </p>
          </div>
          {registrations.length > 0 && (
            <a
              href="/admin/workshops/export"
              className="px-4 py-2 text-sm bg-forest-100 text-forest-700 rounded-lg hover:bg-forest-200 transition-colors"
            >
              Export CSV
            </a>
          )}
        </div>

        {registrations.length === 0 ? (
          <div className="bg-stone-50 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            <p className="text-stone-500 mb-2">No registrations yet</p>
            <p className="text-sm text-stone-400">
              Registrations will appear here once families start signing up.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Parent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Workshops</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/workshops/${reg.id}`} className="font-medium text-forest-600 hover:text-forest-700 hover:underline">
                        {reg.parent_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{reg.parent_email}</td>
                    <td className="py-3 px-4 text-stone-600">{reg.workshop_ids.length} selected</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-xs px-2 py-1 rounded ${getStatusBadge(reg.status)}`}>
                        {reg.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-xs px-2 py-1 rounded ${getPaymentBadge(reg.payment_status)}`}>
                        {reg.payment_status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-sm">
                      {new Date(reg.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
