// Data access functions for Creative Kids Music
import { createClient, createAdminClient } from '@/lib/supabase/server'
import type {
  Workshop,
  WorkshopRegistration,
  WorkshopChild,
  WorkshopAuthorizedPickup,
  CampRegistration,
  CampChild,
  WaitlistSignup,
  ActivityLog,
  AuthorizedPickup
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
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('workshop_registrations')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching workshop registrations:', error)
    return []
  }

  return data as WorkshopRegistration[]
}

const DEFAULT_PAGE_SIZE = 25

interface PaginationFilters {
  search?: string
  status?: string
  payment?: string
}

export async function getWorkshopRegistrationsPaginated(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters: PaginationFilters = {}
) {
  const supabase = createAdminClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('workshop_registrations')
    .select('*', { count: 'exact' })
    .neq('status', 'archived') // Exclude archived by default

  // Apply filters
  if (filters.search) {
    query = query.or(`parent_name.ilike.%${filters.search}%,parent_email.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.payment) {
    query = query.eq('payment_status', filters.payment)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching workshop registrations:', error)
    return { data: [], count: 0, page, pageSize, totalPages: 0 }
  }

  return {
    data: data as WorkshopRegistration[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

export async function getWorkshopRegistrationWithChildren(id: string) {
  const supabase = createAdminClient()

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

  // Fetch authorized pickups
  const { data: pickups } = await supabase
    .from('workshop_authorized_pickups')
    .select('*')
    .eq('registration_id', id)

  return {
    ...registration,
    children: children || [],
    authorized_pickups: pickups || []
  } as WorkshopRegistration & { children: WorkshopChild[]; authorized_pickups: WorkshopAuthorizedPickup[] }
}

export async function getWorkshopChildrenCount(workshopIds: string[]) {
  const supabase = createAdminClient()

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
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('camp_registrations')
    .select('*')
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching camp registrations:', error)
    return []
  }

  return data as CampRegistration[]
}

export async function getCampRegistrationsPaginated(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters: PaginationFilters = {}
) {
  const supabase = createAdminClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('camp_registrations')
    .select('*', { count: 'exact' })
    .neq('status', 'archived') // Exclude archived by default

  // Apply filters
  if (filters.search) {
    query = query.or(`parent_name.ilike.%${filters.search}%,parent_email.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }
  if (filters.payment) {
    query = query.eq('payment_status', filters.payment)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching camp registrations:', error)
    return { data: [], count: 0, page, pageSize, totalPages: 0 }
  }

  return {
    data: data as CampRegistration[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

export async function getCampRegistrationWithChildren(id: string) {
  const supabase = createAdminClient()

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

  const { data: pickups } = await supabase
    .from('authorized_pickups')
    .select('*')
    .eq('camp_registration_id', id)

  return {
    ...registration,
    children: children || [],
    authorized_pickups: pickups || []
  } as CampRegistration & { children: CampChild[]; authorized_pickups: AuthorizedPickup[] }
}

// ============================================
// WAITLIST
// ============================================

export async function getWaitlistSignups() {
  const supabase = createAdminClient()

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

export async function getWaitlistSignupsPaginated(
  page: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
  filters: PaginationFilters = {}
) {
  const supabase = createAdminClient()

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  let query = supabase
    .from('waitlist_signups')
    .select('*', { count: 'exact' })

  // Apply filters
  if (filters.search) {
    query = query.or(`parent_name.ilike.%${filters.search}%,parent_email.ilike.%${filters.search}%`)
  }
  if (filters.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching waitlist signups:', error)
    return { data: [], count: 0, page, pageSize, totalPages: 0 }
  }

  return {
    data: data as WaitlistSignup[],
    count: count || 0,
    page,
    pageSize,
    totalPages: Math.ceil((count || 0) / pageSize)
  }
}

// ============================================
// ACTIVITY LOG
// ============================================

export async function getActivityLog(limit = 50) {
  const supabase = createAdminClient()

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
  const supabase = createAdminClient()

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

export async function getDetailedDashboardStats() {
  const supabase = createAdminClient()

  // Basic counts
  const { count: workshopCount } = await supabase
    .from('workshops')
    .select('*', { count: 'exact', head: true })
    .eq('is_active', true)

  const { count: waitlistCount } = await supabase
    .from('waitlist_signups')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  // Workshop registrations with financial data
  const { data: workshopRegs } = await supabase
    .from('workshop_registrations')
    .select('status, payment_status, total_amount_cents, amount_paid_cents, tuition_assistance, created_at')
    .not('status', 'eq', 'cancelled')

  // Camp registrations with financial data
  const { data: campRegs } = await supabase
    .from('camp_registrations')
    .select('status, payment_status, total_amount_cents, amount_paid_cents, tuition_assistance, created_at')
    .not('status', 'eq', 'cancelled')

  // Calculate workshop stats
  const workshopStats = calculateProgramStats(workshopRegs || [])

  // Calculate camp stats
  const campStats = calculateProgramStats(campRegs || [])

  // Combined totals
  const totalRevenue = workshopStats.amountPaid + campStats.amountPaid
  const totalOutstanding = workshopStats.outstanding + campStats.outstanding
  const totalPending = workshopStats.pending + campStats.pending
  const totalConfirmed = workshopStats.confirmed + campStats.confirmed
  const totalAssistanceRequests = workshopStats.assistanceRequests + campStats.assistanceRequests
  const totalNeedingAttention = workshopStats.needingAttention + campStats.needingAttention

  return {
    activeWorkshops: workshopCount || 0,
    waitlistSignups: waitlistCount || 0,

    // Registration counts
    workshopRegistrations: (workshopRegs || []).length,
    campRegistrations: (campRegs || []).length,
    totalRegistrations: (workshopRegs || []).length + (campRegs || []).length,

    // Status breakdown
    pendingRegistrations: totalPending,
    confirmedRegistrations: totalConfirmed,

    // Financial
    totalRevenue,
    totalOutstanding,

    // Attention items
    assistanceRequests: totalAssistanceRequests,
    needingAttention: totalNeedingAttention,

    // Per-program breakdowns
    workshop: workshopStats,
    camp: campStats,
  }
}

function calculateProgramStats(registrations: Array<{
  status: string
  payment_status: string
  total_amount_cents: number | null
  amount_paid_cents: number
  tuition_assistance: boolean
  created_at: string
}>) {
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  let pending = 0
  let confirmed = 0
  let amountPaid = 0
  let outstanding = 0
  let assistanceRequests = 0
  let needingAttention = 0

  for (const reg of registrations) {
    // Status counts
    if (reg.status === 'pending') pending++
    if (reg.status === 'confirmed') confirmed++

    // Financial calculations
    amountPaid += reg.amount_paid_cents || 0

    // Outstanding = total - paid, but only for unpaid/partial
    if (reg.payment_status === 'unpaid' || reg.payment_status === 'partial') {
      const total = reg.total_amount_cents || 0
      const paid = reg.amount_paid_cents || 0
      outstanding += Math.max(0, total - paid)
    }

    // Assistance requests
    if (reg.tuition_assistance) assistanceRequests++

    // Pending registrations older than 7 days need attention
    if (reg.status === 'pending') {
      const createdAt = new Date(reg.created_at)
      if (createdAt < sevenDaysAgo) needingAttention++
    }
  }

  return {
    total: registrations.length,
    pending,
    confirmed,
    amountPaid,
    outstanding,
    assistanceRequests,
    needingAttention,
  }
}

// ============================================
// PARENT LOOKUP
// ============================================

export interface ParentSearchResult {
  email: string
  name: string
  phone: string | null
  workshopRegistrations: WorkshopRegistration[]
  campRegistrations: CampRegistration[]
  waitlistSignups: WaitlistSignup[]
  workshopChildren: WorkshopChild[]
  campChildren: CampChild[]
}

export async function getAllParents(): Promise<ParentSearchResult[]> {
  const supabase = createAdminClient()

  // Get all registrations from all three tables
  const [workshopResult, campResult, waitlistResult] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select('*')
      .order('parent_name', { ascending: true }),

    supabase
      .from('camp_registrations')
      .select('*')
      .order('parent_name', { ascending: true }),

    supabase
      .from('waitlist_signups')
      .select('*')
      .order('parent_name', { ascending: true }),
  ])

  // Collect unique parent emails
  const parentMap = new Map<string, ParentSearchResult>()

  const addOrUpdate = (
    email: string,
    name: string,
    phone: string | null,
    type: 'workshop' | 'camp' | 'waitlist',
    registration: WorkshopRegistration | CampRegistration | WaitlistSignup
  ) => {
    const key = email.toLowerCase()
    if (!parentMap.has(key)) {
      parentMap.set(key, {
        email,
        name,
        phone,
        workshopRegistrations: [],
        campRegistrations: [],
        waitlistSignups: [],
        workshopChildren: [],
        campChildren: [],
      })
    }
    const parent = parentMap.get(key)!
    if (name && !parent.name) parent.name = name
    if (phone && !parent.phone) parent.phone = phone

    if (type === 'workshop') parent.workshopRegistrations.push(registration as WorkshopRegistration)
    if (type === 'camp') parent.campRegistrations.push(registration as CampRegistration)
    if (type === 'waitlist') parent.waitlistSignups.push(registration as WaitlistSignup)
  }

  for (const reg of workshopResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'workshop', reg)
  }
  for (const reg of campResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'camp', reg)
  }
  for (const signup of waitlistResult.data || []) {
    addOrUpdate(signup.parent_email, signup.parent_name, null, 'waitlist', signup)
  }

  // Get children for all registrations
  const allWorkshopIds = (workshopResult.data || []).map(r => r.id)
  const allCampIds = (campResult.data || []).map(r => r.id)

  const [workshopChildrenResult, campChildrenResult] = await Promise.all([
    allWorkshopIds.length > 0
      ? supabase.from('workshop_children').select('*').in('registration_id', allWorkshopIds)
      : { data: [] },
    allCampIds.length > 0
      ? supabase.from('camp_children').select('*').in('registration_id', allCampIds)
      : { data: [] },
  ])

  // Attach children to parents
  for (const child of workshopChildrenResult.data || []) {
    const reg = (workshopResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.workshopChildren.push(child)
    }
  }
  for (const child of campChildrenResult.data || []) {
    const reg = (campResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.campChildren.push(child)
    }
  }

  // Sort by name alphabetically
  return Array.from(parentMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )
}

export async function searchParents(query: string): Promise<ParentSearchResult[]> {
  const supabase = createAdminClient()
  const searchTerm = query.toLowerCase().trim()

  if (!searchTerm || searchTerm.length < 2) {
    return []
  }

  // Search all three tables in parallel
  const [workshopResult, campResult, waitlistResult] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false }),

    supabase
      .from('camp_registrations')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false }),

    supabase
      .from('waitlist_signups')
      .select('*')
      .or(`parent_email.ilike.%${searchTerm}%,parent_name.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false }),
  ])

  // Collect unique parent emails
  const parentMap = new Map<string, ParentSearchResult>()

  const addOrUpdate = (
    email: string,
    name: string,
    phone: string | null,
    type: 'workshop' | 'camp' | 'waitlist',
    registration: WorkshopRegistration | CampRegistration | WaitlistSignup
  ) => {
    const key = email.toLowerCase()
    if (!parentMap.has(key)) {
      parentMap.set(key, {
        email,
        name,
        phone,
        workshopRegistrations: [],
        campRegistrations: [],
        waitlistSignups: [],
        workshopChildren: [],
        campChildren: [],
      })
    }
    const parent = parentMap.get(key)!
    // Update name/phone if we have better data
    if (name && !parent.name) parent.name = name
    if (phone && !parent.phone) parent.phone = phone

    if (type === 'workshop') parent.workshopRegistrations.push(registration as WorkshopRegistration)
    if (type === 'camp') parent.campRegistrations.push(registration as CampRegistration)
    if (type === 'waitlist') parent.waitlistSignups.push(registration as WaitlistSignup)
  }

  // Process results
  for (const reg of workshopResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'workshop', reg)
  }
  for (const reg of campResult.data || []) {
    addOrUpdate(reg.parent_email, reg.parent_name, reg.parent_phone, 'camp', reg)
  }
  for (const signup of waitlistResult.data || []) {
    addOrUpdate(signup.parent_email, signup.parent_name, null, 'waitlist', signup)
  }

  // Get children for all registrations
  const allWorkshopIds = (workshopResult.data || []).map(r => r.id)
  const allCampIds = (campResult.data || []).map(r => r.id)

  const [workshopChildrenResult, campChildrenResult] = await Promise.all([
    allWorkshopIds.length > 0
      ? supabase.from('workshop_children').select('*').in('registration_id', allWorkshopIds)
      : { data: [] },
    allCampIds.length > 0
      ? supabase.from('camp_children').select('*').in('registration_id', allCampIds)
      : { data: [] },
  ])

  // Attach children to parents
  for (const child of workshopChildrenResult.data || []) {
    const reg = (workshopResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.workshopChildren.push(child)
    }
  }
  for (const child of campChildrenResult.data || []) {
    const reg = (campResult.data || []).find(r => r.id === child.registration_id)
    if (reg) {
      const parent = parentMap.get(reg.parent_email.toLowerCase())
      if (parent) parent.campChildren.push(child)
    }
  }

  return Array.from(parentMap.values())
}
