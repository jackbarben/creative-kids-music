import Link from 'next/link'
import { getDetailedDashboardStats, getWorkshops } from '@/lib/data'

export const dynamic = 'force-dynamic'

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100)
}

export default async function AdminDashboard() {
  const stats = await getDetailedDashboardStats()
  const workshops = await getWorkshops(true)

  // Check if database is set up (workshops table exists)
  const databaseReady = workshops.length > 0

  return (
    <div className="space-y-8">
      {/* Attention Banner */}
      {(stats.needingAttention > 0 || stats.assistanceRequests > 0) && (
        <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6">
          <h3 className="font-display text-lg font-bold text-amber-800 mb-3">Needs Attention</h3>
          <div className="flex flex-wrap gap-4">
            {stats.needingAttention > 0 && (
              <div className="flex items-center gap-2 text-amber-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{stats.needingAttention} pending registration{stats.needingAttention !== 1 ? 's' : ''} older than 7 days</span>
              </div>
            )}
            {stats.assistanceRequests > 0 && (
              <div className="flex items-center gap-2 text-amber-700">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{stats.assistanceRequests} tuition assistance request{stats.assistanceRequests !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Stats Grid - Row 1: Registrations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workshop Registrations"
          value={stats.workshopRegistrations.toString()}
          subtitle={`${stats.workshop.confirmed} confirmed, ${stats.workshop.pending} pending`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
          color="forest"
          href="/admin/workshops"
        />
        <StatCard
          title="Camp Registrations"
          value={stats.campRegistrations.toString()}
          subtitle={`${stats.camp.confirmed} confirmed, ${stats.camp.pending} pending`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="terracotta"
          href="/admin/camp"
        />
        <StatCard
          title="Waitlist Signups"
          value={stats.waitlistSignups.toString()}
          subtitle="Music School interest"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="stone"
          href="/admin/waitlist"
        />
        <StatCard
          title="Active Workshops"
          value={stats.activeWorkshops.toString()}
          subtitle="Available to register"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
          color="forest"
        />
      </div>

      {/* Stats Grid - Row 2: Financial */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Revenue Received"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="Total payments collected"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="forest"
        />
        <StatCard
          title="Outstanding Balance"
          value={formatCurrency(stats.totalOutstanding)}
          subtitle="Unpaid and partial payments"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          color={stats.totalOutstanding > 0 ? 'terracotta' : 'stone'}
        />
        <StatCard
          title="Confirmed Registrations"
          value={stats.confirmedRegistrations.toString()}
          subtitle={`of ${stats.totalRegistrations} total registrations`}
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          color="forest"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="font-display text-lg font-bold text-stone-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <QuickAction
            title="View Workshop Registrations"
            href="/admin/workshops"
            description="See all workshop signups"
          />
          <QuickAction
            title="View Camp Registrations"
            href="/admin/camp"
            description="See all camp signups"
          />
          <QuickAction
            title="View Waitlist"
            href="/admin/waitlist"
            description="Music school interest list"
          />
          <QuickAction
            title="Families"
            href="/admin/parents"
            description="View family registrations"
          />
          <QuickAction
            title="Activity Log"
            href="/admin/activity"
            description="View recent actions"
          />
        </div>
      </div>

      {/* Setup Progress - only show if not ready */}
      {!databaseReady && (
        <div className="bg-forest-50 rounded-2xl border border-forest-200 p-6">
          <h3 className="font-display text-lg font-bold text-forest-800 mb-4">Setup Progress</h3>
          <div className="space-y-3">
            <SetupItem done>Supabase connected</SetupItem>
            <SetupItem done>Admin authentication working</SetupItem>
            <SetupItem done={databaseReady}>Database tables created</SetupItem>
          </div>
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Action needed:</strong> Run the SQL migration in Supabase Dashboard.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
  href,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  color: 'forest' | 'terracotta' | 'stone'
  href?: string
}) {
  const colors = {
    forest: 'bg-forest-50 text-forest-600',
    terracotta: 'bg-terracotta-50 text-terracotta-600',
    stone: 'bg-stone-100 text-stone-600',
  }

  const content = (
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-stone-500 mb-1">{title}</p>
        <p className="text-3xl font-bold text-stone-800">{value}</p>
        <p className="text-sm text-stone-400 mt-1">{subtitle}</p>
      </div>
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        {icon}
      </div>
    </div>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="bg-white rounded-2xl border border-stone-200 p-6 block hover:border-forest-300 hover:shadow-sm transition-all"
      >
        {content}
      </Link>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      {content}
    </div>
  )
}

function QuickAction({
  title,
  href,
  description,
  disabled = false,
}: {
  title: string
  href: string
  description: string
  disabled?: boolean
}) {
  const content = (
    <div className={`p-4 rounded-xl border transition-colors ${
      disabled
        ? 'border-stone-100 bg-stone-50 cursor-not-allowed'
        : 'border-stone-200 hover:border-forest-300 hover:bg-forest-50 cursor-pointer'
    }`}>
      <h4 className={`font-medium mb-1 ${disabled ? 'text-stone-400' : 'text-stone-800'}`}>
        {title}
      </h4>
      <p className={`text-sm ${disabled ? 'text-stone-300' : 'text-stone-500'}`}>
        {description}
      </p>
      {disabled && (
        <span className="inline-block mt-2 text-xs bg-stone-200 text-stone-500 px-2 py-1 rounded">
          Coming soon
        </span>
      )}
    </div>
  )

  if (disabled) {
    return content
  }

  return (
    <Link href={href}>
      {content}
    </Link>
  )
}

function SetupItem({ children, done = false }: { children: React.ReactNode; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <svg className="w-5 h-5 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <div className="w-5 h-5 rounded-full border-2 border-forest-300" />
      )}
      <span className={done ? 'text-forest-700' : 'text-forest-600/70'}>{children}</span>
    </div>
  )
}
