import { getActivityLog } from '@/lib/data'

export const dynamic = 'force-dynamic'

export default async function ActivityAdmin() {
  const activities = await getActivityLog(100)

  const getActionColor = (action: string) => {
    if (action.includes('create') || action.includes('new')) return 'bg-green-100 text-green-800'
    if (action.includes('update') || action.includes('edit')) return 'bg-blue-100 text-blue-800'
    if (action.includes('delete') || action.includes('cancel')) return 'bg-red-100 text-red-800'
    if (action.includes('email') || action.includes('send')) return 'bg-purple-100 text-purple-800'
    if (action.includes('payment') || action.includes('pay')) return 'bg-amber-100 text-amber-800'
    return 'bg-stone-100 text-stone-800'
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-display text-xl font-bold text-stone-800 mb-2">
          Activity Log
        </h2>
        <p className="text-stone-500 mb-6">
          Track all admin actions and system events.
        </p>

        {activities.length === 0 ? (
          <div className="bg-stone-50 rounded-xl p-8 text-center">
            <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-stone-500 mb-2">No activity yet</p>
            <p className="text-sm text-stone-400">
              Activity logs will appear here as actions are taken.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-4 p-4 bg-stone-50 rounded-xl">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block text-xs px-2 py-1 rounded ${getActionColor(activity.action)}`}>
                      {activity.action}
                    </span>
                    {activity.entity_type && (
                      <span className="text-xs text-stone-400">
                        {activity.entity_type}
                      </span>
                    )}
                  </div>
                  {activity.details && (
                    <p className="text-sm text-stone-600">
                      {typeof activity.details === 'object'
                        ? JSON.stringify(activity.details)
                        : String(activity.details)}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                    <span>{formatTime(activity.created_at)}</span>
                    {activity.user_email && (
                      <span>by {activity.user_email}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* What gets logged */}
      <div className="bg-stone-100 rounded-2xl border border-stone-200 p-6">
        <h3 className="font-display text-lg font-bold text-stone-800 mb-4">What Gets Logged</h3>
        <ul className="space-y-2 text-stone-600 text-sm">
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-forest-500 rounded-full"></span>
            New registrations
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-terracotta-500 rounded-full"></span>
            Payment status updates
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-stone-500 rounded-full"></span>
            Admin actions (edits, cancellations)
          </li>
          <li className="flex items-center gap-2">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            Emails sent
          </li>
        </ul>
      </div>
    </div>
  )
}
