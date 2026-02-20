import Link from 'next/link'
import { createAdminClient } from '@/lib/supabase/server'
import type { Workshop } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

async function getWorkshopsWithCounts() {
  const supabase = createAdminClient()

  // Get all workshops
  const { data: workshops, error } = await supabase
    .from('workshops')
    .select('*')
    .order('date', { ascending: true })

  if (error) {
    console.error('Error fetching workshops:', error)
    return []
  }

  // Get registration counts for each workshop
  const workshopsWithCounts = await Promise.all(
    (workshops || []).map(async (workshop) => {
      // Count confirmed/pending registrations
      const { count: registeredCount } = await supabase
        .from('workshop_registrations')
        .select('id', { count: 'exact', head: true })
        .contains('workshop_ids', [workshop.id])
        .in('status', ['pending', 'confirmed'])

      // Count waitlist registrations
      const { count: waitlistCount } = await supabase
        .from('workshop_registrations')
        .select('id', { count: 'exact', head: true })
        .contains('workshop_ids', [workshop.id])
        .eq('status', 'waitlist')

      return {
        ...workshop,
        registeredCount: registeredCount || 0,
        waitlistCount: waitlistCount || 0,
      }
    })
  )

  return workshopsWithCounts
}

export default async function WorkshopsManagement() {
  const workshops = await getWorkshopsWithCounts()

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  // Compare dates properly (ignoring time/timezone issues)
  const isDatePast = (dateString: string) => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return dateString < todayStr
  }

  const getStatusBadge = (workshop: Workshop & { registeredCount: number }) => {
    const status = workshop.status || (workshop.is_active ? 'open' : 'closed')
    const isPast = isDatePast(workshop.date)

    if (isPast && status !== 'completed' && status !== 'archived') {
      return { label: 'Past', className: 'bg-stone-100 text-stone-600' }
    }

    const styles: Record<string, { label: string; className: string }> = {
      draft: { label: 'Draft', className: 'bg-stone-100 text-stone-600' },
      open: { label: 'Open', className: 'bg-green-100 text-green-700' },
      closed: { label: 'Closed', className: 'bg-amber-100 text-amber-700' },
      completed: { label: 'Completed', className: 'bg-blue-100 text-blue-700' },
      archived: { label: 'Archived', className: 'bg-stone-100 text-stone-500' },
    }

    return styles[status] || styles.open
  }

  const getCapacityDisplay = (workshop: Workshop & { registeredCount: number; waitlistCount: number }) => {
    const capacity = workshop.capacity || 12
    const registered = workshop.registeredCount
    const waitlist = workshop.waitlistCount
    const percentage = Math.round((registered / capacity) * 100)

    let colorClass = 'bg-green-500'
    if (percentage >= 100) colorClass = 'bg-red-500'
    else if (percentage >= 75) colorClass = 'bg-amber-500'

    return { capacity, registered, waitlist, percentage, colorClass }
  }

  // Group workshops by status
  const upcomingWorkshops = workshops.filter(
    w => !isDatePast(w.date) && w.status !== 'archived'
  )
  const pastWorkshops = workshops.filter(
    w => isDatePast(w.date) && w.status !== 'archived'
  )
  const archivedWorkshops = workshops.filter(w => w.status === 'archived')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin"
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-800">
            Workshop Management
          </h1>
          <p className="text-stone-500">
            Create, edit, and manage workshop sessions
          </p>
        </div>
        <Link
          href="/admin/programs/workshops/new"
          className="px-4 py-2 bg-forest-600 hover:bg-forest-700 text-white rounded-lg font-medium transition-colors"
        >
          + New Workshop
        </Link>
      </div>

      {/* Upcoming Workshops */}
      <div className="bg-white rounded-xl border border-stone-200">
        <div className="px-6 py-4 border-b border-stone-100">
          <h2 className="font-display font-bold text-stone-800">
            Upcoming Workshops ({upcomingWorkshops.length})
          </h2>
        </div>
        {upcomingWorkshops.length === 0 ? (
          <div className="p-8 text-center text-stone-500">
            No upcoming workshops. Create one to get started.
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {upcomingWorkshops.map((workshop) => {
              const status = getStatusBadge(workshop)
              const cap = getCapacityDisplay(workshop)

              return (
                <Link
                  key={workshop.id}
                  href={`/admin/programs/workshops/${workshop.id}`}
                  className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-stone-800">{workshop.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      {formatDate(workshop.date)} &middot; {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
                    </p>
                    <p className="text-sm text-stone-400">{workshop.location}</p>
                  </div>

                  {/* Capacity Bar */}
                  <div className="w-48 text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      <span className="text-sm font-medium text-stone-700">
                        {cap.registered} / {cap.capacity}
                      </span>
                      {cap.waitlist > 0 && (
                        <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded">
                          +{cap.waitlist} waitlist
                        </span>
                      )}
                    </div>
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${cap.colorClass} transition-all`}
                        style={{ width: `${Math.min(cap.percentage, 100)}%` }}
                      />
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Past Workshops */}
      {pastWorkshops.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h2 className="font-display font-bold text-stone-800">
              Past Workshops ({pastWorkshops.length})
            </h2>
          </div>
          <div className="divide-y divide-stone-100">
            {pastWorkshops.map((workshop) => {
              const status = getStatusBadge(workshop)
              const cap = getCapacityDisplay(workshop)

              return (
                <Link
                  key={workshop.id}
                  href={`/admin/programs/workshops/${workshop.id}`}
                  className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors opacity-75"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-stone-800">{workshop.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500">
                      {formatDate(workshop.date)}
                    </p>
                  </div>
                  <div className="text-sm text-stone-500">
                    {cap.registered} registered
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Archived Workshops */}
      {archivedWorkshops.length > 0 && (
        <details className="bg-white rounded-xl border border-stone-200">
          <summary className="px-6 py-4 cursor-pointer hover:bg-stone-50">
            <span className="font-display font-bold text-stone-600">
              Archived Workshops ({archivedWorkshops.length})
            </span>
          </summary>
          <div className="divide-y divide-stone-100 border-t border-stone-100">
            {archivedWorkshops.map((workshop) => (
              <Link
                key={workshop.id}
                href={`/admin/programs/workshops/${workshop.id}`}
                className="flex items-center justify-between p-6 hover:bg-stone-50 transition-colors opacity-50"
              >
                <div>
                  <h3 className="font-medium text-stone-600">{workshop.title}</h3>
                  <p className="text-sm text-stone-400">{formatDate(workshop.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </details>
      )}
    </div>
  )
}
