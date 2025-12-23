import Link from 'next/link'
import { getWaitlistSignups } from '@/lib/data'
import { PROGRAMS } from '@/lib/constants'

export const dynamic = 'force-dynamic'

export default async function WaitlistAdmin() {
  const signups = await getWaitlistSignups()

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-amber-100 text-amber-800',
      converted: 'bg-green-100 text-green-800'
    }
    return styles[status] || styles.new
  }

  return (
    <div className="space-y-6">
      {/* Music School info */}
      <div className="bg-stone-100 rounded-2xl border border-stone-200 p-6">
        <h3 className="font-syne text-lg font-bold text-stone-800 mb-4">Program Info</h3>
        <div className="bg-white rounded-xl p-4 border border-stone-200">
          <p className="font-semibold text-stone-800">After-School Music Program</p>
          <p className="text-sm text-stone-600">3 days per week, {PROGRAMS.musicSchool.season}</p>
          <p className="text-sm text-stone-500 mt-2">Ages 9-13, Pricing TBD</p>
          <p className="text-sm text-stone-500 mt-2">
            {signups.filter(s => s.status === 'new').length} new signups on waitlist
          </p>
        </div>
      </div>

      {/* Waitlist */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="font-syne text-xl font-bold text-stone-800 mb-2">
              Music School Waitlist
            </h2>
            <p className="text-stone-500">
              Families interested in the {PROGRAMS.musicSchool.season} after-school music program.
            </p>
          </div>
          {signups.length > 0 && (
            <a
              href="/admin/waitlist/export"
              className="px-4 py-2 text-sm bg-stone-100 text-stone-700 rounded-lg hover:bg-stone-200 transition-colors"
            >
              Export CSV
            </a>
          )}
        </div>

        {signups.length === 0 ? (
          <div className="bg-stone-50 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="text-stone-500 mb-2">No signups yet</p>
            <p className="text-sm text-stone-400">
              Waitlist signups will appear here once families express interest.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Parent</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Email</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Child</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Children</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {signups.map((signup) => (
                  <tr key={signup.id} className="border-b border-stone-100 hover:bg-stone-50">
                    <td className="py-3 px-4">
                      <Link href={`/admin/waitlist/${signup.id}`} className="font-medium text-stone-700 hover:text-stone-900 hover:underline">
                        {signup.parent_name}
                      </Link>
                    </td>
                    <td className="py-3 px-4 text-stone-600">{signup.parent_email}</td>
                    <td className="py-3 px-4 text-stone-600">
                      {signup.child_name || '-'}
                      {signup.child_grade && <span className="text-stone-400 ml-1">({signup.child_grade})</span>}
                    </td>
                    <td className="py-3 px-4 text-stone-600">{signup.num_children}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-block text-xs px-2 py-1 rounded ${getStatusBadge(signup.status)}`}>
                        {signup.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-stone-500 text-sm">
                      {new Date(signup.created_at).toLocaleDateString()}
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
