import Link from 'next/link'
import { getCampRegistrations } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function CampAdmin() {
  const registrations = await getCampRegistrations()

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
      {/* Camp info for reference */}
      <div className="bg-terracotta-50 rounded-2xl border border-terracotta-200 p-6">
        <h3 className="font-syne text-lg font-bold text-terracotta-800 mb-4">Camp Details</h3>
        <div className="bg-white rounded-xl p-4 border border-terracotta-200">
          <p className="font-semibold text-terracotta-800">June 22-27, 2026 (Mon-Fri)</p>
          <p className="text-sm text-terracotta-600">8:30 AM - 5:00 PM · Lunch included</p>
          <p className="text-sm text-terracotta-600">Sunday performance June 29 · 9-11 AM</p>
          <p className="text-sm text-stone-500 mt-2">Ages 9-13, $400 per child</p>
          <p className="text-sm text-stone-500 mt-2">
            {registrations.filter(r => r.status !== 'cancelled').length} registrations
          </p>
        </div>
      </div>

      {/* Registrations */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-syne text-xl font-bold text-stone-800 mb-2">
              Summer Camp Registrations
            </h2>
            <p className="text-stone-500">
              View and manage registrations for Summer Camp 2026.
            </p>
          </div>
          {registrations.length > 0 && (
            <a
              href="/admin/camp/export"
              className="px-4 py-2 text-sm bg-terracotta-100 text-terracotta-700 rounded-lg hover:bg-terracotta-200 transition-colors"
            >
              Export CSV
            </a>
          )}
        </div>

        {registrations.length === 0 ? (
          <div className="bg-stone-50 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
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
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Phone</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Payment</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr key={reg.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/camp/${reg.id}`} className="font-medium text-terracotta-600 hover:text-terracotta-700 hover:underline">
                        {reg.parent_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{reg.parent_email}</td>
                    <td className="py-3 px-4 text-stone-600">{reg.parent_phone}</td>
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
