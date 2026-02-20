import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import WorkshopEditForm from './WorkshopEditForm'
import NotificationActions from './NotificationActions'
import type { Workshop } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getWorkshop(id: string): Promise<Workshop | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching workshop:', error)
    return null
  }

  return data
}

async function getRegistrationStats(workshopId: string) {
  const supabase = createAdminClient()

  // Get registrations with children count
  const { data: registrations } = await supabase
    .from('workshop_registrations')
    .select('id, status, parent_name, parent_email, created_at')
    .contains('workshop_ids', [workshopId])
    .order('created_at', { ascending: false })

  if (!registrations || registrations.length === 0) {
    return {
      totalKids: 0,
      confirmedKids: 0,
      pendingKids: 0,
      waitlistKids: 0,
      totalFamilies: 0,
      recentRegistrations: [],
    }
  }

  // Get children counts for each registration
  const registrationIds = registrations.map(r => r.id)
  const { data: children } = await supabase
    .from('workshop_children')
    .select('id, registration_id')
    .in('registration_id', registrationIds)

  // Count children per registration
  const childCountMap = new Map<string, number>()
  for (const child of children || []) {
    childCountMap.set(child.registration_id, (childCountMap.get(child.registration_id) || 0) + 1)
  }

  // Calculate totals by status
  let confirmedKids = 0
  let pendingKids = 0
  let waitlistKids = 0

  for (const reg of registrations) {
    const kidCount = childCountMap.get(reg.id) || 0
    if (reg.status === 'confirmed') confirmedKids += kidCount
    else if (reg.status === 'pending') pendingKids += kidCount
    else if (reg.status === 'waitlist') waitlistKids += kidCount
  }

  const confirmed = registrations.filter(r => r.status === 'confirmed')
  const pending = registrations.filter(r => r.status === 'pending')

  return {
    totalKids: confirmedKids + pendingKids,
    confirmedKids,
    pendingKids,
    waitlistKids,
    totalFamilies: confirmed.length + pending.length,
    recentRegistrations: registrations.slice(0, 5),
  }
}

export default async function WorkshopEditPage({ params }: PageProps) {
  const { id } = await params
  const [workshop, stats] = await Promise.all([
    getWorkshop(id),
    getRegistrationStats(id),
  ])

  if (!workshop) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  // Compare dates properly (ignoring time/timezone issues)
  const isDatePast = (dateString: string) => {
    const today = new Date()
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
    return dateString < todayStr
  }

  const isPast = isDatePast(workshop.date)
  const capacityPercentage = Math.round((stats.totalKids / (workshop.capacity || 12)) * 100)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href="/admin/programs/workshops"
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Workshops
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-800">
            {workshop.title}
          </h1>
          <p className="text-stone-500">{formatDate(workshop.date)}</p>
        </div>

        {/* Quick Stats */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-white rounded-lg border border-stone-200">
            <p className="text-2xl font-bold text-stone-800">{stats.totalKids}</p>
            <p className="text-xs text-stone-500">Kids Registered</p>
          </div>
          <div className="text-center px-4 py-2 bg-white rounded-lg border border-stone-200">
            <p className="text-2xl font-bold text-stone-800">{stats.totalFamilies}</p>
            <p className="text-xs text-stone-500">Families</p>
          </div>
          <div className="text-center px-4 py-2 bg-white rounded-lg border border-stone-200">
            <p className="text-2xl font-bold text-stone-800">{workshop.capacity}</p>
            <p className="text-xs text-stone-500">Capacity</p>
          </div>
          {stats.waitlistKids > 0 && (
            <div className="text-center px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-2xl font-bold text-blue-700">{stats.waitlistKids}</p>
              <p className="text-xs text-blue-600">Waitlist</p>
            </div>
          )}
        </div>
      </div>

      {/* Status Banner */}
      {isPast && workshop.status !== 'completed' && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
          This workshop has passed. Consider marking it as &ldquo;Completed&rdquo; and adding program notes.
        </div>
      )}

      {/* Capacity Bar */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-stone-700">Registration Status</span>
          <span className="text-sm text-stone-500">
            {stats.totalKids} kids / {workshop.capacity} capacity ({capacityPercentage}%)
          </span>
        </div>
        <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all ${
              capacityPercentage >= 100 ? 'bg-red-500' :
              capacityPercentage >= 75 ? 'bg-amber-500' : 'bg-green-500'
            }`}
            style={{ width: `${Math.min(capacityPercentage, 100)}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-stone-500">
          <span>{stats.confirmedKids} confirmed, {stats.pendingKids} pending</span>
          {stats.waitlistKids > 0 && <span className="text-blue-600">+{stats.waitlistKids} on waitlist</span>}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Edit Form */}
        <div className="col-span-2">
          <WorkshopEditForm workshop={workshop} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Notifications */}
          <NotificationActions
            workshopId={workshop.id}
            workshopDate={workshop.date}
            registeredCount={stats.totalFamilies}
            waitlistCount={stats.waitlistKids}
          />

          {/* Quick Actions */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-display font-bold text-stone-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href={`/admin/workshops?workshop=${workshop.id}`}
                className="block w-full px-4 py-2 text-center bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-sm font-medium transition-colors"
              >
                View Registrations
              </Link>
              <Link
                href={`/admin/programs/workshops/${workshop.id}/attendance`}
                className="block w-full px-4 py-2 text-center bg-forest-100 hover:bg-forest-200 text-forest-700 rounded-lg text-sm font-medium transition-colors"
              >
                {isPast ? 'View Attendance' : 'Take Attendance'}
              </Link>
            </div>
          </div>

          {/* Recent Registrations */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h3 className="font-display font-bold text-stone-800 mb-4">Recent Registrations</h3>
            {stats.recentRegistrations.length === 0 ? (
              <p className="text-sm text-stone-500">No registrations yet</p>
            ) : (
              <div className="space-y-3">
                {stats.recentRegistrations.map((reg) => (
                  <Link
                    key={reg.id}
                    href={`/admin/workshops/${reg.id}`}
                    className="block p-3 bg-stone-50 hover:bg-stone-100 rounded-lg transition-colors"
                  >
                    <p className="font-medium text-stone-800 text-sm">{reg.parent_name}</p>
                    <p className="text-xs text-stone-500">{reg.parent_email}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        reg.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        reg.status === 'waitlist' ? 'bg-blue-100 text-blue-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {reg.status}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(reg.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
