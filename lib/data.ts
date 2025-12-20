// Data access functions for Creative Kids Music
import { createClient } from '@/lib/supabase/server'
import type {
  Workshop,
  WorkshopRegistration,
  WorkshopChild,
  CampRegistration,
  CampChild,
  WaitlistSignup,
  ActivityLog
} from '@/lib/database.types'

// ============================================
// WORKSHOPS
// ============================================

export async function getWorkshops(activeOnly = false) {
  const supabase = await createClient()

  let query = supabase
    .from('workshops')
    .select('*')
    .order('date', { ascending: true })

  if (activeOnly) {
    query = query.eq('is_active', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching workshops:', error)
    return []
  }

  return data as Workshop[]
}

export async function getWorkshopById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching workshop:', error)
    return null
  }

  return data as Workshop
}

// ============================================
// WORKSHOP REGISTRATIONS
// ============================================

export async function getWorkshopRegistrations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching workshop registrations:', error)
    return []
  }

  return data as WorkshopRegistration[]
}

export async function getWorkshopRegistrationWithChildren(id: string) {
  const supabase = await createClient()

  const { data: registration, error: regError } = await supabase
    .from('workshop_registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (regError) {
    console.error('Error fetching registration:', regError)
    return null
  }

  const { data: children, error: childError } = await supabase
    .from('workshop_children')
    .select('*')
    .eq('registration_id', id)

  if (childError) {
    console.error('Error fetching children:', childError)
    return null
  }

  return {
    ...registration,
    children: children || []
  } as WorkshopRegistration & { children: WorkshopChild[] }
}

export async function getWorkshopChildrenCount(workshopIds: string[]) {
  const supabase = await createClient()

  // Get all registrations that include any of the workshop IDs
  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('id, workshop_ids, status')
    .not('status', 'in', '("cancelled","waitlist")')

  if (error) {
    console.error('Error fetching registrations:', error)
    return {}
  }

  // Count children per workshop
  const counts: Record<string, number> = {}
  for (const workshopId of workshopIds) {
    counts[workshopId] = 0
  }

  for (const reg of data || []) {
    const { data: children } = await supabase
      .from('workshop_children')
      .select('id')
      .eq('registration_id', reg.id)

    const childCount = children?.length || 0
    for (const workshopId of reg.workshop_ids) {
      if (workshopId in counts) {
        counts[workshopId] += childCount
      }
    }
  }

  return counts
}

// ============================================
// CAMP REGISTRATIONS
// ============================================

export async function getCampRegistrations() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('camp_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching camp registrations:', error)
    return []
  }

  return data as CampRegistration[]
}

export async function getCampRegistrationWithChildren(id: string) {
  const supabase = await createClient()

  const { data: registration, error: regError } = await supabase
    .from('camp_registrations')
    .select('*')
    .eq('id', id)
    .single()

  if (regError) {
    console.error('Error fetching registration:', regError)
    return null
  }

  const { data: children, error: childError } = await supabase
    .from('camp_children')
    .select('*')
    .eq('registration_id', id)

  if (childError) {
    console.error('Error fetching children:', childError)
    return null
  }

  return {
    ...registration,
    children: children || []
  } as CampRegistration & { children: CampChild[] }
}

// ============================================
// WAITLIST
// ============================================

export async function getWaitlistSignups() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching waitlist signups:', error)
    return []
  }

  return data as WaitlistSignup[]
}

// ============================================
// ACTIVITY LOG
// ============================================

export async function getActivityLog(limit = 50) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching activity log:', error)
    return []
  }

  return data as ActivityLog[]
}

export async function logActivity(
  action: string,
  entityType?: string,
  entityId?: string,
  details?: Record<string, unknown>
) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  const { error } = await supabase
    .from('activity_log')
    .insert({
      action,
      entity_type: entityType,
      entity_id: entityId,
      details,
      user_id: user?.id,
      user_email: user?.email
    })

  if (error) {
    console.error('Error logging activity:', error)
  }
}

// ============================================
// DASHBOARD STATS
// ============================================

export async function getDashboardStats() {
  const supabase = await createClient()

  // Get workshop count
  const { count: workshopCount } = await supabase
    .from('workshops')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  // Get workshop registrations count
  const { count: workshopRegCount } = await supabase
    .from('workshop_registrations')
    .select('*', { count: 'exact', head: true })
    .not('status', 'eq', 'cancelled')

  // Get camp registrations count
  const { count: campRegCount } = await supabase
    .from('camp_registrations')
    .select('*', { count: 'exact', head: true })
    .not('status', 'eq', 'cancelled')

  // Get waitlist count
  const { count: waitlistCount } = await supabase
    .from('waitlist_signups')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return {
    activeWorkshops: workshopCount || 0,
    workshopRegistrations: workshopRegCount || 0,
    campRegistrations: campRegCount || 0,
    waitlistSignups: waitlistCount || 0
  }
}
