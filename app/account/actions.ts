'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/data'
import {
  PROGRAMS,
  SIBLING_DISCOUNT,
  MAX_SIBLING_DISCOUNT,
} from '@/lib/constants'

export type ActionResult = {
  success?: boolean
  error?: string
}

// ============================================================
// CONSTANTS (from lib/constants.ts)
// ============================================================
const WORKSHOP_PRICE_CENTS = PROGRAMS.workshops.pricePerWorkshop
const CAMP_PRICE_CENTS = PROGRAMS.camp.price
const SIBLING_DISCOUNT_CENTS = SIBLING_DISCOUNT
const MAX_SIBLING_DISCOUNT_CENTS = MAX_SIBLING_DISCOUNT

// ============================================================
// HELPER: Check if program has started
// ============================================================
async function isProgramStarted(
  supabase: Awaited<ReturnType<typeof createClient>>,
  registrationId: string,
  programType: 'workshop' | 'camp'
): Promise<boolean> {
  const now = new Date()

  if (programType === 'camp') {
    return now >= PROGRAMS.camp.startDate
  }

  // For workshops, check the earliest workshop date in the registration
  const { data: reg } = await supabase
    .from('workshop_registrations')
    .select('workshop_ids')
    .eq('id', registrationId)
    .single()

  if (!reg?.workshop_ids?.length) return false

  const { data: workshops } = await supabase
    .from('workshops')
    .select('date')
    .in('id', reg.workshop_ids)
    .order('date', { ascending: true })
    .limit(1)

  if (!workshops?.length) return false

  const firstDate = new Date(workshops[0].date + 'T00:00:00-08:00') // Pacific time
  return now >= firstDate
}

// ============================================================
// HELPER: Calculate sibling discount (capped at $30)
// ============================================================
function calculateSiblingDiscount(childIndex: number): number {
  return Math.min(childIndex * SIBLING_DISCOUNT_CENTS, MAX_SIBLING_DISCOUNT_CENTS)
}

// ============================================================
// EDIT CONTACT INFO
// ============================================================
export async function updateContactInfo(
  registrationId: string,
  programType: 'workshop' | 'camp',
  data: {
    parent_phone?: string
    emergency_name?: string
    emergency_phone?: string
    emergency_relationship?: string
  }
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  const table = programType === 'camp' ? 'camp_registrations' : 'workshop_registrations'

  const { error } = await supabase
    .from(table)
    .update({
      parent_phone: data.parent_phone || null,
      ...(programType === 'camp' && {
        emergency_name: data.emergency_name || null,
        emergency_phone: data.emergency_phone || null,
        emergency_relationship: data.emergency_relationship || null,
      }),
    })
    .eq('id', registrationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Update contact info error:', error)
    return { error: 'Failed to update contact info' }
  }

  // Log activity
  await logActivity(
    'parent_updated_contact',
    programType === 'camp' ? 'camp_registration' : 'workshop_registration',
    registrationId,
    { fields_updated: Object.keys(data).filter(k => data[k as keyof typeof data]) }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// EDIT CHILD
// ============================================================
export async function updateChild(
  childId: string,
  registrationId: string,
  programType: 'workshop' | 'camp',
  data: {
    child_name: string
    child_age: number
    child_school?: string
    allergies?: string
    dietary_restrictions?: string
    medical_conditions?: string
    special_needs?: string
  }
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if program has started (block name/age edits)
  const programStarted = await isProgramStarted(supabase, registrationId, programType)
  if (programStarted) {
    return { error: 'Cannot edit child info after program has started' }
  }

  // Validate age
  if (data.child_age < 9 || data.child_age > 13) {
    return { error: 'Child age must be between 9 and 13' }
  }

  const table = programType === 'camp' ? 'camp_children' : 'workshop_children'

  const updateData = {
    child_name: data.child_name.trim(),
    child_age: data.child_age,
    child_school: data.child_school?.trim() || null,
    ...(programType === 'camp' && {
      allergies: data.allergies?.trim() || null,
      dietary_restrictions: data.dietary_restrictions?.trim() || null,
      medical_conditions: data.medical_conditions?.trim() || null,
      special_needs: data.special_needs?.trim() || null,
    }),
  }

  const { error } = await supabase
    .from(table)
    .update(updateData)
    .eq('id', childId)
    .eq('registration_id', registrationId)

  if (error) {
    console.error('Update child error:', error)
    return { error: 'Failed to update child' }
  }

  // Log activity
  await logActivity(
    'parent_updated_child',
    programType === 'camp' ? 'camp_child' : 'workshop_child',
    childId,
    { child_name: data.child_name, registration_id: registrationId }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// ADD CHILD
// ============================================================
export async function addChild(
  registrationId: string,
  programType: 'workshop' | 'camp',
  data: {
    child_name: string
    child_age: number
    child_school?: string
    allergies?: string
    dietary_restrictions?: string
    medical_conditions?: string
    special_needs?: string
  }
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if program has started
  const programStarted = await isProgramStarted(supabase, registrationId, programType)
  if (programStarted) {
    return { error: 'Cannot add children after program has started' }
  }

  // Validate age
  if (data.child_age < 9 || data.child_age > 13) {
    return { error: 'Child age must be between 9 and 13' }
  }

  const table = programType === 'camp' ? 'camp_children' : 'workshop_children'
  const regTable = programType === 'camp' ? 'camp_registrations' : 'workshop_registrations'
  const basePrice = programType === 'camp' ? CAMP_PRICE_CENTS : WORKSHOP_PRICE_CENTS

  // Get current registration to check ownership and child count
  const { data: reg, error: regError } = await supabase
    .from(regTable)
    .select('id, user_id, total_amount_cents')
    .eq('id', registrationId)
    .eq('user_id', user.id)
    .single()

  if (regError || !reg) {
    return { error: 'Registration not found' }
  }

  // Count current children for discount calculation
  const { count } = await supabase
    .from(table)
    .select('id', { count: 'exact' })
    .eq('registration_id', registrationId)

  const childIndex = count || 0
  const siblingDiscount = calculateSiblingDiscount(childIndex) // Capped at $30
  const childPrice = Math.max(0, basePrice - siblingDiscount)

  // Insert child
  const insertData = {
    registration_id: registrationId,
    child_name: data.child_name.trim(),
    child_age: data.child_age,
    child_school: data.child_school?.trim() || null,
    discount_cents: siblingDiscount,
    ...(programType === 'camp' && {
      allergies: data.allergies?.trim() || null,
      dietary_restrictions: data.dietary_restrictions?.trim() || null,
      medical_conditions: data.medical_conditions?.trim() || null,
      special_needs: data.special_needs?.trim() || null,
    }),
  }

  const { error: insertError } = await supabase
    .from(table)
    .insert(insertData)

  if (insertError) {
    console.error('Add child error:', insertError)
    return { error: 'Failed to add child' }
  }

  // Update total amount
  const newTotal = (reg.total_amount_cents || 0) + childPrice
  await supabase
    .from(regTable)
    .update({ total_amount_cents: newTotal })
    .eq('id', registrationId)

  // Log activity
  await logActivity(
    'parent_added_child',
    programType === 'camp' ? 'camp_registration' : 'workshop_registration',
    registrationId,
    { child_name: data.child_name, new_total_cents: newTotal }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// REMOVE CHILD
// ============================================================
export async function removeChild(
  childId: string,
  registrationId: string,
  programType: 'workshop' | 'camp'
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if program has started
  const programStarted = await isProgramStarted(supabase, registrationId, programType)
  if (programStarted) {
    return { error: 'Cannot remove children after program has started' }
  }

  const table = programType === 'camp' ? 'camp_children' : 'workshop_children'
  const regTable = programType === 'camp' ? 'camp_registrations' : 'workshop_registrations'

  // Get child info for logging
  const { data: child, error: childError } = await supabase
    .from(table)
    .select('id, child_name')
    .eq('id', childId)
    .eq('registration_id', registrationId)
    .single()

  if (childError || !child) {
    return { error: 'Child not found' }
  }

  // Verify registration ownership
  const { data: reg, error: regError } = await supabase
    .from(regTable)
    .select('id')
    .eq('id', registrationId)
    .eq('user_id', user.id)
    .single()

  if (regError || !reg) {
    return { error: 'Registration not found' }
  }

  // Delete child
  const { error: deleteError } = await supabase
    .from(table)
    .delete()
    .eq('id', childId)

  if (deleteError) {
    console.error('Remove child error:', deleteError)
    return { error: 'Failed to remove child' }
  }

  // Recalculate remaining children's discounts (this also updates total)
  const newTotal = await recalculateChildDiscounts(supabase, registrationId, programType)

  // Log activity
  await logActivity(
    'parent_removed_child',
    programType === 'camp' ? 'camp_registration' : 'workshop_registration',
    registrationId,
    { child_name: child.child_name, new_total_cents: newTotal }
  )

  revalidatePath('/account')
  return { success: true }
}

// Helper to recalculate sibling discounts after removal (with $30 cap)
async function recalculateChildDiscounts(
  supabase: Awaited<ReturnType<typeof createClient>>,
  registrationId: string,
  programType: 'workshop' | 'camp'
): Promise<number> {
  const table = programType === 'camp' ? 'camp_children' : 'workshop_children'
  const regTable = programType === 'camp' ? 'camp_registrations' : 'workshop_registrations'
  const basePrice = programType === 'camp' ? CAMP_PRICE_CENTS : WORKSHOP_PRICE_CENTS

  // Get all remaining children sorted by creation
  const { data: children } = await supabase
    .from(table)
    .select('id')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: true })

  if (!children) return 0

  let totalCents = 0
  for (let i = 0; i < children.length; i++) {
    const discount = calculateSiblingDiscount(i) // Capped at $30
    const childPrice = Math.max(0, basePrice - discount)
    totalCents += childPrice

    await supabase
      .from(table)
      .update({ discount_cents: discount })
      .eq('id', children[i].id)
  }

  // Update registration total
  await supabase
    .from(regTable)
    .update({ total_amount_cents: totalCents })
    .eq('id', registrationId)

  return totalCents
}

// ============================================================
// CANCEL REGISTRATION
// ============================================================
export async function cancelRegistration(
  registrationId: string,
  programType: 'workshop' | 'camp',
  reason?: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if program has started
  const programStarted = await isProgramStarted(supabase, registrationId, programType)
  if (programStarted) {
    return { error: 'Cannot cancel after program has started. Please contact us.' }
  }

  const table = programType === 'camp' ? 'camp_registrations' : 'workshop_registrations'

  const { error } = await supabase
    .from(table)
    .update({
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
      cancellation_reason: reason?.trim() || null,
    })
    .eq('id', registrationId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Cancel registration error:', error)
    return { error: 'Failed to cancel registration' }
  }

  // Log activity
  await logActivity(
    'parent_cancelled_registration',
    programType === 'camp' ? 'camp_registration' : 'workshop_registration',
    registrationId,
    { reason: reason?.trim() || null }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// MANAGE PICKUPS (Camp only)
// ============================================================
export async function addPickup(
  registrationId: string,
  name: string,
  phone?: string,
  relationship?: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify registration ownership
  const { data: reg } = await supabase
    .from('camp_registrations')
    .select('id')
    .eq('id', registrationId)
    .eq('user_id', user.id)
    .single()

  if (!reg) {
    return { error: 'Registration not found' }
  }

  const { error } = await supabase
    .from('authorized_pickups')
    .insert({
      camp_registration_id: registrationId,
      name: name.trim(),
      phone: phone?.trim() || null,
      relationship: relationship?.trim() || null,
    })

  if (error) {
    console.error('Add pickup error:', error)
    return { error: 'Failed to add pickup' }
  }

  // Log activity
  await logActivity(
    'parent_added_pickup',
    'camp_registration',
    registrationId,
    { pickup_name: name.trim() }
  )

  revalidatePath('/account')
  return { success: true }
}

export async function removePickup(
  pickupId: string,
  registrationId: string
): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Verify registration ownership
  const { data: reg } = await supabase
    .from('camp_registrations')
    .select('id')
    .eq('id', registrationId)
    .eq('user_id', user.id)
    .single()

  if (!reg) {
    return { error: 'Registration not found' }
  }

  // Get pickup name for logging
  const { data: pickup } = await supabase
    .from('authorized_pickups')
    .select('name')
    .eq('id', pickupId)
    .single()

  const { error } = await supabase
    .from('authorized_pickups')
    .delete()
    .eq('id', pickupId)
    .eq('camp_registration_id', registrationId)

  if (error) {
    console.error('Remove pickup error:', error)
    return { error: 'Failed to remove pickup' }
  }

  // Log activity
  await logActivity(
    'parent_removed_pickup',
    'camp_registration',
    registrationId,
    { pickup_name: pickup?.name }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// ACCOUNT SETTINGS
// ============================================================
export type AccountSettings = {
  parent_first_name?: string
  parent_last_name?: string
  parent_relationship?: string
  parent_phone?: string
  parent2_first_name?: string
  parent2_last_name?: string
  parent2_relationship?: string
  parent2_phone?: string
  parent2_email?: string
  emergency_name?: string
  emergency_phone?: string
  emergency_relationship?: string
  default_pickups?: { name: string; phone: string; relationship?: string }[]
  default_media_consent_internal?: boolean
  default_media_consent_marketing?: boolean
  email_reminders?: boolean
  email_updates?: boolean
}

export async function getAccountSettings(): Promise<AccountSettings | null> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('account_settings')
    .select('*')
    .eq('user_id', user.id)
    .single()

  return data || null
}

export async function saveAccountSettings(settings: AccountSettings): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Check if settings exist
  const { data: existing } = await supabase
    .from('account_settings')
    .select('id')
    .eq('user_id', user.id)
    .single()

  const settingsData = {
    user_id: user.id,
    parent_first_name: settings.parent_first_name?.trim() || null,
    parent_last_name: settings.parent_last_name?.trim() || null,
    parent_relationship: settings.parent_relationship || null,
    parent_phone: settings.parent_phone?.trim() || null,
    parent2_first_name: settings.parent2_first_name?.trim() || null,
    parent2_last_name: settings.parent2_last_name?.trim() || null,
    parent2_relationship: settings.parent2_relationship || null,
    parent2_phone: settings.parent2_phone?.trim() || null,
    parent2_email: settings.parent2_email?.trim().toLowerCase() || null,
    emergency_name: settings.emergency_name?.trim() || null,
    emergency_phone: settings.emergency_phone?.trim() || null,
    emergency_relationship: settings.emergency_relationship?.trim() || null,
    default_pickups: settings.default_pickups || [],
    default_media_consent_internal: settings.default_media_consent_internal ?? false,
    default_media_consent_marketing: settings.default_media_consent_marketing ?? false,
    email_reminders: settings.email_reminders ?? true,
    email_updates: settings.email_updates ?? true,
  }

  if (existing) {
    const { error } = await supabase
      .from('account_settings')
      .update(settingsData)
      .eq('user_id', user.id)

    if (error) {
      console.error('Update settings error:', error)
      return { error: 'Failed to save settings' }
    }
  } else {
    const { error } = await supabase
      .from('account_settings')
      .insert(settingsData)

    if (error) {
      console.error('Insert settings error:', error)
      return { error: 'Failed to save settings' }
    }
  }

  await logActivity(
    'parent_updated_settings',
    'account_settings',
    user.id,
    { fields_updated: Object.keys(settings) }
  )

  revalidatePath('/account')
  revalidatePath('/account/settings')
  return { success: true }
}

// ============================================================
// ACCOUNT CHILDREN (stored at account level, reusable)
// ============================================================
export type AccountChild = {
  id?: string
  first_name: string
  last_name: string
  date_of_birth?: string
  school?: string
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  notes?: string
}

export async function getAccountChildren(): Promise<AccountChild[]> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('account_children')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  return data || []
}

export async function addAccountChild(child: AccountChild): Promise<ActionResult & { childId?: string }> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  if (!child.first_name?.trim() || !child.last_name?.trim()) {
    return { error: 'First and last name are required' }
  }

  const { data, error } = await supabase
    .from('account_children')
    .insert({
      user_id: user.id,
      first_name: child.first_name.trim(),
      last_name: child.last_name.trim(),
      date_of_birth: child.date_of_birth || null,
      school: child.school?.trim() || null,
      allergies: child.allergies?.trim() || null,
      dietary_restrictions: child.dietary_restrictions?.trim() || null,
      medical_conditions: child.medical_conditions?.trim() || null,
      notes: child.notes?.trim() || null,
    })
    .select('id')
    .single()

  if (error) {
    console.error('Add account child error:', error)
    return { error: 'Failed to add child' }
  }

  await logActivity(
    'parent_added_account_child',
    'account_children',
    data.id,
    { child_name: `${child.first_name} ${child.last_name}` }
  )

  revalidatePath('/account')
  return { success: true, childId: data.id }
}

export async function updateAccountChild(childId: string, child: AccountChild): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  if (!child.first_name?.trim() || !child.last_name?.trim()) {
    return { error: 'First and last name are required' }
  }

  const { error } = await supabase
    .from('account_children')
    .update({
      first_name: child.first_name.trim(),
      last_name: child.last_name.trim(),
      date_of_birth: child.date_of_birth || null,
      school: child.school?.trim() || null,
      allergies: child.allergies?.trim() || null,
      dietary_restrictions: child.dietary_restrictions?.trim() || null,
      medical_conditions: child.medical_conditions?.trim() || null,
      notes: child.notes?.trim() || null,
    })
    .eq('id', childId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Update account child error:', error)
    return { error: 'Failed to update child' }
  }

  await logActivity(
    'parent_updated_account_child',
    'account_children',
    childId,
    { child_name: `${child.first_name} ${child.last_name}` }
  )

  revalidatePath('/account')
  return { success: true }
}

export async function removeAccountChild(childId: string): Promise<ActionResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'You must be logged in' }
  }

  // Get child name for logging
  const { data: child } = await supabase
    .from('account_children')
    .select('first_name, last_name')
    .eq('id', childId)
    .eq('user_id', user.id)
    .single()

  const { error } = await supabase
    .from('account_children')
    .delete()
    .eq('id', childId)
    .eq('user_id', user.id)

  if (error) {
    console.error('Remove account child error:', error)
    return { error: 'Failed to remove child' }
  }

  await logActivity(
    'parent_removed_account_child',
    'account_children',
    childId,
    { child_name: child ? `${child.first_name} ${child.last_name}` : 'Unknown' }
  )

  revalidatePath('/account')
  return { success: true }
}

// ============================================================
// CREATE ACCOUNT WITH AUTO-LINK
// ============================================================
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/server'

export type CreateAccountResult = {
  success?: boolean
  error?: string
  linkedWorkshops?: number
  linkedCamp?: number
  linkedWaitlist?: number
}

export async function createAccountAndLinkRegistrations(
  email: string,
  password: string
): Promise<CreateAccountResult> {
  // Validate inputs
  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }
  if (!password || password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  const normalizedEmail = email.trim().toLowerCase()

  // Create the auth user using admin client
  const authClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: newUser, error: signUpError } = await authClient.auth.admin.createUser({
    email: normalizedEmail,
    password: password,
    email_confirm: true,
  })

  if (signUpError) {
    console.error('Account creation error:', signUpError)
    if (signUpError.message?.includes('already been registered')) {
      return { error: 'An account with this email already exists. Please sign in instead.' }
    }
    return { error: 'Failed to create account. Please try again.' }
  }

  if (!newUser?.user) {
    return { error: 'Failed to create account. Please try again.' }
  }

  const userId = newUser.user.id

  // Link all registrations by email using admin client
  const supabase = createAdminClient()

  // Create a family for this user
  let familyId: string | null = null
  try {
    const { data: familyData, error: familyError } = await supabase
      .rpc('create_family_for_user', { p_user_id: userId, p_email: normalizedEmail })

    if (!familyError && familyData) {
      familyId = familyData as string
    }
  } catch {
    // Family tables may not exist yet (migration not run)
    console.log('Family creation skipped - migration may not be applied yet')
  }

  // Link workshop registrations (include family_id if available)
  const { data: workshopData } = await supabase
    .from('workshop_registrations')
    .update({
      user_id: userId,
      ...(familyId && { family_id: familyId }),
    })
    .eq('parent_email', normalizedEmail)
    .is('user_id', null)
    .select('id')

  // Link camp registrations (include family_id if available)
  const { data: campData } = await supabase
    .from('camp_registrations')
    .update({
      user_id: userId,
      ...(familyId && { family_id: familyId }),
    })
    .eq('parent_email', normalizedEmail)
    .is('user_id', null)
    .select('id')

  // Link waitlist signups
  const { data: waitlistData } = await supabase
    .from('waitlist_signups')
    .update({ user_id: userId })
    .eq('parent_email', normalizedEmail)
    .is('user_id', null)
    .select('id')

  const linkedWorkshops = workshopData?.length || 0
  const linkedCamp = campData?.length || 0
  const linkedWaitlist = waitlistData?.length || 0

  // Auto-populate account_settings from the first linked registration
  const firstWorkshopReg = workshopData?.[0]?.id
  const firstCampReg = campData?.[0]?.id

  if (firstWorkshopReg || firstCampReg) {
    // Get registration data to populate account settings
    let regData: {
      parent_first_name?: string
      parent_last_name?: string
      parent_relationship?: string
      parent_phone?: string
      emergency_name?: string
      emergency_phone?: string
      emergency_relationship?: string
    } | null = null

    if (firstWorkshopReg) {
      const { data } = await supabase
        .from('workshop_registrations')
        .select('parent_first_name, parent_last_name, parent_relationship, parent_phone, emergency_name, emergency_phone, emergency_relationship')
        .eq('id', firstWorkshopReg)
        .single()
      regData = data
    } else if (firstCampReg) {
      const { data } = await supabase
        .from('camp_registrations')
        .select('parent_first_name, parent_last_name, parent_relationship, parent_phone, emergency_name, emergency_phone, emergency_relationship')
        .eq('id', firstCampReg)
        .single()
      regData = data
    }

    if (regData) {
      await supabase
        .from('account_settings')
        .insert({
          user_id: userId,
          ...(familyId && { family_id: familyId }),
          parent_first_name: regData.parent_first_name || null,
          parent_last_name: regData.parent_last_name || null,
          parent_relationship: regData.parent_relationship || null,
          parent_phone: regData.parent_phone || null,
          emergency_name: regData.emergency_name || null,
          emergency_phone: regData.emergency_phone || null,
          emergency_relationship: regData.emergency_relationship || null,
        })
    }
  }

  // Also update account_children with family_id if they exist
  if (familyId) {
    await supabase
      .from('account_children')
      .update({ family_id: familyId })
      .eq('user_id', userId)
      .is('family_id', null)
  }

  await logActivity(
    'parent_created_account',
    'users',
    userId,
    {
      email: normalizedEmail,
      family_id: familyId,
      linkedWorkshops,
      linkedCamp,
      linkedWaitlist,
    }
  )

  return {
    success: true,
    linkedWorkshops,
    linkedCamp,
    linkedWaitlist,
  }
}
