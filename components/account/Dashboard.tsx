'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Link from 'next/link'
import { WorkshopRegistrationWithChildren, CampRegistrationWithChildren, Workshop } from '@/lib/database.types'
import RegistrationCard from './RegistrationCard'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [workshopRegistrations, setWorkshopRegistrations] = useState<(WorkshopRegistrationWithChildren & { workshops?: Workshop[] })[]>([])
  const [campRegistrations, setCampRegistrations] = useState<CampRegistrationWithChildren[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true)
      setError(null)

      try {
        // Fetch workshop registrations with children (exclude cancelled/archived)
        const { data: workshopRegs, error: workshopError } = await supabase
          .from('workshop_registrations')
          .select(`
            *,
            children:workshop_children(*)
          `)
          .eq('user_id', user.id)
          .neq('status', 'cancelled')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })

        if (workshopError) throw workshopError

        // Fetch all workshops for display
        const { data: allWorkshops, error: allWorkshopsError } = await supabase
          .from('workshops')
          .select('*')

        if (allWorkshopsError) throw allWorkshopsError

        // Attach workshop details to registrations
        const typedAllWorkshops = (allWorkshops || []) as Workshop[]
        const workshopsWithDetails = (workshopRegs || []).map((reg) => {
          const typedReg = reg as WorkshopRegistrationWithChildren
          return {
            ...typedReg,
            workshops: typedAllWorkshops.filter(w => typedReg.workshop_ids.includes(w.id))
          }
        })

        setWorkshopRegistrations(workshopsWithDetails)

        // Fetch camp registrations with children and pickups (exclude cancelled/archived)
        const { data: campRegs, error: campError } = await supabase
          .from('camp_registrations')
          .select(`
            *,
            children:camp_children(*),
            authorized_pickups(*)
          `)
          .eq('user_id', user.id)
          .neq('status', 'cancelled')
          .neq('status', 'archived')
          .order('created_at', { ascending: false })

        if (campError) throw campError
        setCampRegistrations((campRegs || []) as CampRegistrationWithChildren[])
      } catch (err) {
        console.error('Error fetching registrations:', err)
        setError('Failed to load registrations. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchRegistrations()
  }, [user.id, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const hasRegistrations = workshopRegistrations.length > 0 || campRegistrations.length > 0

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-4xl font-semibold text-slate-800">
            My Account
          </h1>
          <p className="text-slate-500 mt-1">
            {user.email}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/account/settings"
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-slate-700"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Registrations Section Title */}
      <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
        My Registrations
      </h2>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 mb-6">
          {error}
          <button
            onClick={() => window.location.reload()}
            className="ml-4 underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && !hasRegistrations && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
          <div className="text-4xl mb-4">🎵</div>
          <h2 className="font-display text-2xl font-semibold text-slate-800 mb-2">
            No registrations yet
          </h2>
          <p className="text-slate-500 mb-6">
            Ready to get started? Register for a program.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/workshops"
              className="px-6 py-3 bg-slate-800 text-white rounded-lg font-medium hover:bg-slate-900 transition-colors"
            >
              View Workshops
            </Link>
            <Link
              href="/summer-camp"
              className="px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 rounded-lg font-medium hover:border-slate-300 transition-colors"
            >
              View Summer Camp
            </Link>
          </div>
        </div>
      )}

      {/* Registration Cards */}
      {!loading && !error && hasRegistrations && (
        <div className="space-y-6">
          {/* Workshop Registrations */}
          {workshopRegistrations.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
              programType="workshop"
              workshops={registration.workshops}
            />
          ))}

          {/* Camp Registrations */}
          {campRegistrations.map((registration) => (
            <RegistrationCard
              key={registration.id}
              registration={registration}
              programType="camp"
            />
          ))}

          {/* CTA */}
          <div className="pt-6 border-t border-slate-200">
            <p className="text-slate-500 mb-4">
              Want to register for another program?
            </p>
            <div className="flex gap-4">
              <Link
                href="/workshops"
                className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
              >
                View Workshops
              </Link>
              <Link
                href="/summer-camp"
                className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
              >
                View Summer Camp
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
