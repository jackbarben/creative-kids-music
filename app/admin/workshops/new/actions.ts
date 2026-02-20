'use server'

import { createAdminClient, getUserByEmail } from '@/lib/supabase/server'
import { sendWorkshopConfirmation, sendAdminNotification } from '@/lib/email'
import { logActivity } from '@/lib/data'
import { ACTION_TYPES } from '@/lib/activity'
import { PROGRAMS, SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT } from '@/lib/constants'

interface ChildInput {
  name: string
  age: number
  school?: string
  allergies?: string
  medical_conditions?: string
}

interface AdminRegistrationInput {
  // Parent info
  parent_first_name: string
  parent_last_name: string
  parent_email: string
  parent_phone: string
  parent_relationship: string
  // Emergency contact
  emergency_name?: string
  emergency_phone?: string
  emergency_relationship?: string
  // Workshops
  workshop_ids: string[]
  // Children
  children: ChildInput[]
  // Admin options
  initial_status: 'pending' | 'confirmed'
  initial_payment_status: 'unpaid' | 'paid' | 'partial' | 'waived'
  admin_notes?: string
  // Consent (can be set by admin)
  media_consent_internal: boolean
  media_consent_marketing: boolean
}

export async function createWorkshopRegistration(input: AdminRegistrationInput): Promise<{ success?: boolean; error?: string; registrationId?: string }> {
  const supabase = createAdminClient()

  // Validation
  if (!input.parent_first_name || !input.parent_last_name) {
    return { error: 'Parent name is required' }
  }
  if (!input.parent_email || !input.parent_email.includes('@')) {
    return { error: 'Valid email is required' }
  }
  if (!input.parent_phone) {
    return { error: 'Phone number is required' }
  }
  if (input.workshop_ids.length === 0) {
    return { error: 'At least one workshop must be selected' }
  }
  if (input.children.length === 0) {
    return { error: 'At least one child is required' }
  }

  // Calculate pricing
  const PRICE_CENTS = PROGRAMS.workshops.pricePerWorkshop
  let totalCents = 0
  const childDiscounts: number[] = []

  for (let i = 0; i < input.children.length; i++) {
    const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
    childDiscounts.push(discount)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }
  totalCents *= input.workshop_ids.length

  // Auto-link to existing account by email
  const normalizedEmail = input.parent_email.trim().toLowerCase()
  const existingUserId = await getUserByEmail(normalizedEmail)

  // Combine parent name
  const fullParentName = `${input.parent_first_name.trim()} ${input.parent_last_name.trim()}`

  // Insert registration
  const { data: registration, error: regError } = await supabase
    .from('workshop_registrations')
    .insert({
      user_id: existingUserId || null,
      status: input.initial_status,
      payment_status: input.initial_payment_status,
      parent_name: fullParentName,
      parent_first_name: input.parent_first_name.trim(),
      parent_last_name: input.parent_last_name.trim(),
      parent_relationship: input.parent_relationship,
      parent_email: normalizedEmail,
      parent_phone: input.parent_phone.trim(),
      emergency_name: input.emergency_name?.trim() || null,
      emergency_phone: input.emergency_phone?.trim() || null,
      emergency_relationship: input.emergency_relationship?.trim() || null,
      workshop_ids: input.workshop_ids,
      total_amount_cents: totalCents,
      amount_paid_cents: input.initial_payment_status === 'paid' ? totalCents : 0,
      // Consent
      media_consent_internal: input.media_consent_internal,
      media_consent_marketing: input.media_consent_marketing,
      media_consent_accepted_at: new Date().toISOString(),
      // Mark as admin-created - terms accepted by proxy
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      liability_waiver_accepted: true,
      liability_waiver_accepted_at: new Date().toISOString(),
      admin_notes: input.admin_notes?.trim() || null,
    })
    .select()
    .single()

  if (regError || !registration) {
    console.error('Admin registration error:', regError)
    return { error: 'Failed to create registration' }
  }

  // Insert children
  const { error: childError } = await supabase
    .from('workshop_children')
    .insert(input.children.map((child, i) => ({
      registration_id: registration.id,
      child_name: child.name.trim(),
      child_age: child.age,
      child_school: child.school?.trim() || null,
      discount_cents: childDiscounts[i],
      allergies: child.allergies?.trim() || null,
      medical_conditions: child.medical_conditions?.trim() || null,
    })))

  if (childError) {
    console.error('Admin registration children error:', childError)
  }

  // Log activity
  await logActivity(
    ACTION_TYPES.REGISTRATION_CREATED_BY_ADMIN,
    'workshop_registration',
    registration.id,
    {
      parent_name: fullParentName,
      parent_email: normalizedEmail,
      children_count: input.children.length,
      workshops_count: input.workshop_ids.length,
      initial_status: input.initial_status,
      account_linked: !!existingUserId,
    }
  )

  // Get workshop details for email
  const { data: workshops } = await supabase
    .from('workshops')
    .select('id, date, title, location, address, start_time, end_time')
    .in('id', input.workshop_ids)

  const workshopDates = (workshops || []).map(w => {
    const date = new Date(w.date + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })

  const firstWorkshop = workshops?.[0]
  const workshopLocation = firstWorkshop?.location || undefined
  const workshopAddress = firstWorkshop?.address || undefined

  // Always send confirmation email (per user requirement)
  try {
    await sendWorkshopConfirmation({
      parentName: fullParentName,
      parentEmail: normalizedEmail,
      children: input.children.map(c => ({ name: c.name, age: c.age })),
      workshopDates,
      totalAmount: totalCents / 100,
      paymentMethod: input.initial_payment_status === 'paid' ? 'Paid' : 'Pending',
      tuitionAssistance: false,
      registrationId: registration.id,
      location: workshopLocation,
      address: workshopAddress,
    })
  } catch (emailError) {
    console.error('Failed to send confirmation email:', emailError)
    // Don't fail the registration for email errors
  }

  // Send admin notification
  try {
    await sendAdminNotification({
      type: 'workshop',
      parentName: fullParentName,
      parentEmail: normalizedEmail,
      childrenCount: input.children.length,
      tuitionAssistance: false,
      registrationId: registration.id,
    })
  } catch (emailError) {
    console.error('Failed to send admin notification:', emailError)
  }

  return { success: true, registrationId: registration.id }
}
