'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/data'
import { trackChanges, ACTION_TYPES } from '@/lib/activity'
import { SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT } from '@/lib/constants'

// Valid status transitions - cancelled is a terminal state
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'cancelled', 'archived'],
  confirmed: ['cancelled', 'archived'],
  cancelled: ['archived'],
  archived: [], // Cannot transition from archived
}

function revalidateCampPaths(registrationId: string) {
  revalidatePath(`/admin/camp/${registrationId}`)
  revalidatePath('/admin/camp')
  revalidatePath('/admin')
}

// ============================================
// STATUS & NOTES UPDATE
// ============================================

export async function updateCampRegistration(
  registrationId: string,
  data: {
    status?: string
    payment_status?: string
    admin_notes?: string
  }
) {
  const supabase = createAdminClient()

  // Fetch current state for logging
  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('status, payment_status, admin_notes')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    console.error('Error fetching registration:', fetchError)
    return { error: 'Failed to fetch registration' }
  }

  // If status is being changed, validate the transition
  if (data.status && current && data.status !== current.status) {
    const allowed = VALID_STATUS_TRANSITIONS[current.status] || []
    if (!allowed.includes(data.status)) {
      return {
        error: `Cannot change status from "${current.status}" to "${data.status}"`
      }
    }
  }

  // Build update object
  const updateData: Record<string, unknown> = {
    ...data,
    updated_at: new Date().toISOString(),
  }

  // Add cancellation timestamp if cancelling
  if (data.status === 'cancelled' && current?.status !== 'cancelled') {
    updateData.cancelled_at = new Date().toISOString()
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update(updateData)
    .eq('id', registrationId)

  if (error) {
    console.error('Error updating registration:', error)
    return { error: 'Failed to update registration' }
  }

  // Log activity with before/after changes
  const changes = trackChanges(
    current as Record<string, unknown>,
    data as Record<string, unknown>
  )

  if (changes.length > 0) {
    // Determine the primary action type
    let actionType: string = ACTION_TYPES.REGISTRATION_NOTES_UPDATED
    if (data.status && data.status !== current?.status) {
      actionType = ACTION_TYPES.REGISTRATION_STATUS_UPDATED
    } else if (data.payment_status && data.payment_status !== current?.payment_status) {
      actionType = ACTION_TYPES.REGISTRATION_PAYMENT_UPDATED
    }

    await logActivity(
      actionType,
      'camp_registration',
      registrationId,
      {
        changes,
        fields_updated: changes.map(c => c.field),
      }
    )
  }

  revalidateCampPaths(registrationId)
  return { success: true }
}

// ============================================
// PARENT INFO UPDATE (includes second parent)
// ============================================

export async function updateParentInfo(
  registrationId: string,
  data: {
    parent_name?: string
    parent_first_name?: string
    parent_last_name?: string
    parent_email?: string
    parent_phone?: string
    parent_relationship?: string
    parent2_name?: string | null
    parent2_email?: string | null
    parent2_phone?: string | null
    parent2_relationship?: string | null
  }
) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('parent_name, parent_first_name, parent_last_name, parent_email, parent_phone, parent_relationship, parent2_name, parent2_email, parent2_phone, parent2_relationship')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to update parent info' }
  }

  const changes = trackChanges(current as Record<string, unknown>, data as Record<string, unknown>)
  if (changes.length > 0) {
    await logActivity(
      ACTION_TYPES.REGISTRATION_PARENT_UPDATED,
      'camp_registration',
      registrationId,
      { changes, fields_updated: changes.map(c => c.field) }
    )
  }

  revalidateCampPaths(registrationId)
  return { success: true }
}

// ============================================
// EMERGENCY CONTACT UPDATE
// ============================================

export async function updateEmergencyContact(
  registrationId: string,
  data: {
    emergency_name?: string
    emergency_phone?: string
    emergency_relationship?: string
  }
) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('emergency_name, emergency_phone, emergency_relationship')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to update emergency contact' }
  }

  const changes = trackChanges(current as Record<string, unknown>, data as Record<string, unknown>)
  if (changes.length > 0) {
    await logActivity(
      ACTION_TYPES.REGISTRATION_EMERGENCY_UPDATED,
      'camp_registration',
      registrationId,
      { changes, fields_updated: changes.map(c => c.field) }
    )
  }

  revalidateCampPaths(registrationId)
  return { success: true }
}

// ============================================
// MEDIA CONSENT UPDATE
// ============================================

export async function updateMediaConsent(
  registrationId: string,
  data: {
    media_consent_internal: boolean
    media_consent_marketing: boolean
  }
) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('media_consent_internal, media_consent_marketing')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({
      ...data,
      media_consent_accepted_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to update media consent' }
  }

  const changes = trackChanges(current as Record<string, unknown>, data as Record<string, unknown>)
  if (changes.length > 0) {
    await logActivity(
      ACTION_TYPES.REGISTRATION_CONSENT_UPDATED,
      'camp_registration',
      registrationId,
      { changes, fields_updated: changes.map(c => c.field) }
    )
  }

  revalidateCampPaths(registrationId)
  return { success: true }
}

// ============================================
// PAYMENT UPDATE
// ============================================

export async function updatePaymentDetails(
  registrationId: string,
  data: {
    total_amount_cents?: number
    amount_paid_cents?: number
    payment_method?: string
    payment_date?: string | null
    payment_notes?: string
    tuition_assistance?: boolean
    assistance_notes?: string
  }
) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('total_amount_cents, amount_paid_cents, payment_method, payment_date, payment_notes, tuition_assistance, assistance_notes')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to update payment details' }
  }

  const changes = trackChanges(current as Record<string, unknown>, data as Record<string, unknown>)
  if (changes.length > 0) {
    await logActivity(
      ACTION_TYPES.REGISTRATION_PAYMENT_UPDATED,
      'camp_registration',
      registrationId,
      { changes, fields_updated: changes.map(c => c.field) }
    )
  }

  revalidateCampPaths(registrationId)
  return { success: true }
}

// ============================================
// CHILDREN CRUD
// ============================================

interface CampChildData {
  child_name: string
  child_age: number
  child_grade?: string | null
  child_school?: string | null
  tshirt_size?: string | null
  allergies?: string | null
  dietary_restrictions?: string | null
  medical_conditions?: string | null
  special_needs?: string | null
}

export async function addChild(registrationId: string, data: CampChildData) {
  const supabase = createAdminClient()

  // Get current children to calculate discount
  const { data: existingChildren } = await supabase
    .from('camp_children')
    .select('id')
    .eq('registration_id', registrationId)

  const childIndex = existingChildren?.length || 0
  const discount = Math.min(childIndex * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)

  const { data: newChild, error } = await supabase
    .from('camp_children')
    .insert({
      registration_id: registrationId,
      child_name: data.child_name,
      child_age: data.child_age,
      child_grade: data.child_grade || null,
      child_school: data.child_school || null,
      tshirt_size: data.tshirt_size || null,
      allergies: data.allergies || null,
      dietary_restrictions: data.dietary_restrictions || null,
      medical_conditions: data.medical_conditions || null,
      special_needs: data.special_needs || null,
      discount_cents: discount,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Failed to add child' }
  }

  await logActivity(
    ACTION_TYPES.CHILD_ADDED,
    'camp_registration',
    registrationId,
    { child_name: data.child_name, child_id: newChild?.id }
  )

  // Recalculate totals
  await recalculateTotal(registrationId)

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', registrationId)

  revalidateCampPaths(registrationId)
  return { success: true, child: newChild }
}

export async function updateChild(childId: string, data: CampChildData) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('camp_children')
    .select('*, registration_id')
    .eq('id', childId)
    .single()

  if (fetchError || !current) {
    return { error: 'Child not found' }
  }

  const { error } = await supabase
    .from('camp_children')
    .update({
      child_name: data.child_name,
      child_age: data.child_age,
      child_grade: data.child_grade || null,
      child_school: data.child_school || null,
      tshirt_size: data.tshirt_size || null,
      allergies: data.allergies || null,
      dietary_restrictions: data.dietary_restrictions || null,
      medical_conditions: data.medical_conditions || null,
      special_needs: data.special_needs || null,
    })
    .eq('id', childId)

  if (error) {
    return { error: 'Failed to update child' }
  }

  const changes = trackChanges(
    current as unknown as Record<string, unknown>,
    data as unknown as Record<string, unknown>
  )

  if (changes.length > 0) {
    await logActivity(
      ACTION_TYPES.CHILD_UPDATED,
      'camp_registration',
      current.registration_id,
      { child_id: childId, child_name: data.child_name, changes }
    )
  }

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', current.registration_id)

  revalidateCampPaths(current.registration_id)
  return { success: true }
}

export async function removeChild(childId: string) {
  const supabase = createAdminClient()

  const { data: child, error: fetchError } = await supabase
    .from('camp_children')
    .select('registration_id, child_name')
    .eq('id', childId)
    .single()

  if (fetchError || !child) {
    return { error: 'Child not found' }
  }

  const { error } = await supabase
    .from('camp_children')
    .delete()
    .eq('id', childId)

  if (error) {
    return { error: 'Failed to remove child' }
  }

  await logActivity(
    ACTION_TYPES.CHILD_REMOVED,
    'camp_registration',
    child.registration_id,
    { child_id: childId, child_name: child.child_name }
  )

  // Recalculate discounts for remaining children
  await recalculateDiscounts(child.registration_id)
  await recalculateTotal(child.registration_id)

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', child.registration_id)

  revalidateCampPaths(child.registration_id)
  return { success: true }
}

// ============================================
// PICKUPS CRUD
// ============================================

interface PickupData {
  name: string
  phone?: string | null
  relationship?: string | null
}

export async function addPickup(registrationId: string, data: PickupData) {
  const supabase = createAdminClient()

  const { data: newPickup, error } = await supabase
    .from('authorized_pickups')
    .insert({
      registration_id: registrationId,
      name: data.name,
      phone: data.phone || null,
      relationship: data.relationship || null,
    })
    .select()
    .single()

  if (error) {
    return { error: 'Failed to add pickup' }
  }

  await logActivity(
    ACTION_TYPES.PICKUP_ADDED,
    'camp_registration',
    registrationId,
    { pickup_name: data.name, pickup_id: newPickup?.id }
  )

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', registrationId)

  revalidateCampPaths(registrationId)
  return { success: true, pickup: newPickup }
}

export async function updatePickup(pickupId: string, data: PickupData) {
  const supabase = createAdminClient()

  const { data: current, error: fetchError } = await supabase
    .from('authorized_pickups')
    .select('*, registration_id')
    .eq('id', pickupId)
    .single()

  if (fetchError || !current) {
    return { error: 'Pickup not found' }
  }

  const { error } = await supabase
    .from('authorized_pickups')
    .update({
      name: data.name,
      phone: data.phone || null,
      relationship: data.relationship || null,
    })
    .eq('id', pickupId)

  if (error) {
    return { error: 'Failed to update pickup' }
  }

  await logActivity(
    ACTION_TYPES.PICKUP_UPDATED,
    'camp_registration',
    current.registration_id,
    { pickup_id: pickupId, pickup_name: data.name }
  )

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', current.registration_id)

  revalidateCampPaths(current.registration_id)
  return { success: true }
}

export async function removePickup(pickupId: string) {
  const supabase = createAdminClient()

  const { data: pickup, error: fetchError } = await supabase
    .from('authorized_pickups')
    .select('registration_id, name')
    .eq('id', pickupId)
    .single()

  if (fetchError || !pickup) {
    return { error: 'Pickup not found' }
  }

  const { error } = await supabase
    .from('authorized_pickups')
    .delete()
    .eq('id', pickupId)

  if (error) {
    return { error: 'Failed to remove pickup' }
  }

  await logActivity(
    ACTION_TYPES.PICKUP_REMOVED,
    'camp_registration',
    pickup.registration_id,
    { pickup_id: pickupId, pickup_name: pickup.name }
  )

  // Update registration timestamp
  await supabase
    .from('camp_registrations')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', pickup.registration_id)

  revalidateCampPaths(pickup.registration_id)
  return { success: true }
}

// ============================================
// ARCHIVE / DELETE
// ============================================

export async function archiveRegistration(registrationId: string, reason?: string) {
  const supabase = createAdminClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('status')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  if (current?.status === 'archived') {
    return { error: 'Registration is already archived' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
      archived_by: user?.id,
      archive_reason: reason || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to archive registration' }
  }

  await logActivity(
    ACTION_TYPES.REGISTRATION_ARCHIVED,
    'camp_registration',
    registrationId,
    { reason, previous_status: current?.status }
  )

  revalidateCampPaths(registrationId)
  return { success: true }
}

export async function restoreRegistration(registrationId: string, targetStatus: string = 'cancelled') {
  const supabase = createAdminClient()

  const validStatuses = ['pending', 'confirmed', 'cancelled']
  if (!validStatuses.includes(targetStatus)) {
    return { error: 'Invalid target status' }
  }

  const { error } = await supabase
    .from('camp_registrations')
    .update({
      status: targetStatus,
      archived_at: null,
      archived_by: null,
      archive_reason: null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to restore registration' }
  }

  await logActivity(
    ACTION_TYPES.REGISTRATION_RESTORED,
    'camp_registration',
    registrationId,
    { restored_to_status: targetStatus }
  )

  revalidateCampPaths(registrationId)
  return { success: true }
}

export async function deleteRegistration(registrationId: string) {
  const supabase = createAdminClient()

  // Only allow deleting archived registrations
  const { data: current, error: fetchError } = await supabase
    .from('camp_registrations')
    .select('status, parent_name')
    .eq('id', registrationId)
    .single()

  if (fetchError) {
    return { error: 'Failed to fetch registration' }
  }

  if (current?.status !== 'archived') {
    return { error: 'Only archived registrations can be permanently deleted' }
  }

  // Delete children first (cascade should handle this, but being explicit)
  await supabase
    .from('camp_children')
    .delete()
    .eq('registration_id', registrationId)

  // Delete pickups
  await supabase
    .from('authorized_pickups')
    .delete()
    .eq('registration_id', registrationId)

  // Delete registration
  const { error } = await supabase
    .from('camp_registrations')
    .delete()
    .eq('id', registrationId)

  if (error) {
    return { error: 'Failed to delete registration' }
  }

  await logActivity(
    ACTION_TYPES.REGISTRATION_DELETED,
    'camp_registration',
    registrationId,
    { parent_name: current?.parent_name, permanently_deleted: true }
  )

  revalidatePath('/admin/camp')
  revalidatePath('/admin/archives')
  revalidatePath('/admin')

  return { success: true }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

async function recalculateDiscounts(registrationId: string) {
  const supabase = createAdminClient()

  const { data: children } = await supabase
    .from('camp_children')
    .select('id')
    .eq('registration_id', registrationId)
    .order('created_at', { ascending: true })

  if (!children) return

  for (let i = 0; i < children.length; i++) {
    const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
    await supabase
      .from('camp_children')
      .update({ discount_cents: discount })
      .eq('id', children[i].id)
  }
}

async function recalculateTotal(registrationId: string) {
  const supabase = createAdminClient()

  // Get children with discounts
  const { data: children } = await supabase
    .from('camp_children')
    .select('discount_cents')
    .eq('registration_id', registrationId)

  if (!children) return

  const pricePerChild = 40000 // $400 in cents - should come from DB/constants

  let totalCents = 0
  for (const child of children) {
    totalCents += Math.max(0, pricePerChild - (child.discount_cents || 0))
  }

  await supabase
    .from('camp_registrations')
    .update({ total_amount_cents: totalCents })
    .eq('id', registrationId)
}
