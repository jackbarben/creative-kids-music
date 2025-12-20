import Link from 'next/link'
import { getDashboardStats, getWorkshops } from '@/lib/data'

export default async function AdminDashboard() {
  const stats = await getDashboardStats()
  const workshops = await getWorkshops(true)

  // Check if database is set up (workshops table exists)
  const databaseReady = workshops.length > 0

  return (
    <div className="space-y-8">
      {/* Welcome message */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h2 className="font-fraunces text-2xl font-bold text-stone-800 mb-2">
          Welcome to Creative Kids Music Admin
        </h2>
        <p className="text-stone-600">
          Manage registrations, view waitlists, and track your programs.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Workshop Registrations"
          value={stats.workshopRegistrations.toString()}
          subtitle="Spring 2026"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
          }
          color="forest"
        />
        <StatCard
          title="Camp Registrations"
          value={stats.campRegistrations.toString()}
          subtitle="June 2026"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          color="terracotta"
        />
        <StatCard
          title="Waitlist Signups"
          value={stats.waitlistSignups.toString()}
          subtitle="Music School"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          color="stone"
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

      {/* Quick Actions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6">
        <h3 className="font-fraunces text-lg font-bold text-stone-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
            title="Export Data"
            href="#"
            description="Download CSV reports"
            disabled
          />
        </div>
      </div>

      {/* Setup Progress */}
      <div className="bg-forest-50 rounded-2xl border border-forest-200 p-6">
        <h3 className="font-fraunces text-lg font-bold text-forest-800 mb-4">Setup Progress</h3>
        <div className="space-y-3">
          <SetupItem done>Supabase connected</SetupItem>
          <SetupItem done>Admin authentication working</SetupItem>
          <SetupItem done={databaseReady}>Database tables created (Phase 3)</SetupItem>
          <SetupItem>Registration forms built (Phase 5)</SetupItem>
          <SetupItem>Email notifications set up (Phase 8)</SetupItem>
        </div>
        {!databaseReady && (
          <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-amber-800 text-sm">
              <strong>Action needed:</strong> Run the SQL migration in Supabase Dashboard → SQL Editor.
              The migration file is at <code className="bg-amber-100 px-1 rounded">supabase/migrations/001_initial_schema.sql</code>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  color,
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  color: 'forest' | 'terracotta' | 'stone'
}) {
  const colors = {
    forest: 'bg-forest-50 text-forest-600',
    terracotta: 'bg-terracotta-50 text-terracotta-600',
    stone: 'bg-stone-100 text-stone-600',
  }

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
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
