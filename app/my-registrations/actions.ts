'use server'

import { createClient } from '@/lib/supabase/server'
import { sendMagicLinkEmail } from '@/lib/email'
import crypto from 'crypto'

export type MagicLinkFormState = {
  success?: boolean
  error?: string
  message?: string
}

export async function requestMagicLink(
  prevState: MagicLinkFormState,
  formData: FormData
): Promise<MagicLinkFormState> {
  const email = (formData.get('email') as string)?.trim().toLowerCase()

  if (!email || !email.includes('@')) {
    return { error: 'Please enter a valid email address' }
  }

  const supabase = await createClient()

  // Check if this email has any registrations
  const [{ data: workshops }, { data: camp }, { data: waitlist }] = await Promise.all([
    supabase.from('workshop_registrations').select('id').eq('parent_email', email).limit(1),
    supabase.from('camp_registrations').select('id').eq('parent_email', email).limit(1),
    supabase.from('waitlist_signups').select('id').eq('parent_email', email).limit(1),
  ])

  const hasRegistrations = (workshops?.length || 0) + (camp?.length || 0) + (waitlist?.length || 0) > 0

  // Always show success message (don't reveal if email exists)
  // But only send email if there are registrations
  if (!hasRegistrations) {
    // Pretend we sent it (security: don't reveal if email exists)
    return {
      success: true,
      message: 'If you have registrations with this email, you\'ll receive a link shortly.',
    }
  }

  // Generate secure token
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours

  // Store token
  const { error: insertError } = await supabase.from('magic_links').insert({
    email,
    token,
    expires_at: expiresAt.toISOString(),
  })

  if (insertError) {
    console.error('Magic link insert error:', insertError)
    return { error: 'Something went wrong. Please try again.' }
  }

  // Send email
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://creativekidsmusic.org'
  const magicLink = `${baseUrl}/my-registrations/${token}`

  await sendMagicLinkEmail({
    email,
    magicLink,
  })

  return {
    success: true,
    message: 'If you have registrations with this email, you\'ll receive a link shortly.',
  }
}

export async function validateMagicLink(token: string) {
  const supabase = await createClient()

  // Find valid token
  const { data: link, error } = await supabase
    .from('magic_links')
    .select('*')
    .eq('token', token)
    .is('used_at', null)
    .gt('expires_at', new Date().toISOString())
    .single()

  if (error || !link) {
    return { valid: false, email: null }
  }

  // Mark as used
  await supabase
    .from('magic_links')
    .update({ used_at: new Date().toISOString() })
    .eq('id', link.id)

  return { valid: true, email: link.email }
}

export async function getParentRegistrations(email: string) {
  const supabase = await createClient()

  // Fetch all registrations for this email
  const [
    { data: workshopRegs },
    { data: campRegs },
    { data: waitlistSignups },
    { data: workshops },
  ] = await Promise.all([
    supabase
      .from('workshop_registrations')
      .select('*, workshop_children(*)')
      .eq('parent_email', email)
      .order('created_at', { ascending: false }),
    supabase
      .from('camp_registrations')
      .select('*, camp_children(*)')
      .eq('parent_email', email)
      .order('created_at', { ascending: false }),
    supabase
      .from('waitlist_signups')
      .select('*')
      .eq('parent_email', email)
      .order('created_at', { ascending: false }),
    supabase
      .from('workshops')
      .select('id, title, date')
      .eq('is_active', true),
  ])

  return {
    workshopRegistrations: workshopRegs || [],
    campRegistrations: campRegs || [],
    waitlistSignups: waitlistSignups || [],
    workshops: workshops || [],
  }
}

export type UpdateContactFormState = {
  success?: boolean
  error?: string
}

export async function updateContactInfo(
  prevState: UpdateContactFormState,
  formData: FormData
): Promise<UpdateContactFormState> {
  const email = formData.get('email') as string
  const registrationType = formData.get('registration_type') as string
  const registrationId = formData.get('registration_id') as string
  const parentPhone = formData.get('parent_phone') as string
  const emergencyName = formData.get('emergency_name') as string | null
  const emergencyPhone = formData.get('emergency_phone') as string | null

  if (!email || !registrationType || !registrationId) {
    return { error: 'Missing required information' }
  }

  const supabase = await createClient()

  if (registrationType === 'workshop') {
    const { error } = await supabase
      .from('workshop_registrations')
      .update({
        parent_phone: parentPhone?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', registrationId)
      .eq('parent_email', email) // Security: only update if email matches

    if (error) {
      console.error('Update workshop contact error:', error)
      return { error: 'Failed to update. Please try again.' }
    }
  } else if (registrationType === 'camp') {
    const updates: Record<string, string | null> = {
      updated_at: new Date().toISOString(),
    }
    if (parentPhone) updates.parent_phone = parentPhone.trim()
    if (emergencyName) updates.emergency_name = emergencyName.trim()
    if (emergencyPhone) updates.emergency_phone = emergencyPhone.trim()

    const { error } = await supabase
      .from('camp_registrations')
      .update(updates)
      .eq('id', registrationId)
      .eq('parent_email', email) // Security: only update if email matches

    if (error) {
      console.error('Update camp contact error:', error)
      return { error: 'Failed to update. Please try again.' }
    }
  }

  return { success: true }
}

export async function requestCancellation(
  registrationType: 'workshop' | 'camp',
  registrationId: string,
  email: string,
  reason: string
) {
  const supabase = await createClient()

  // Verify the registration belongs to this email
  const table = registrationType === 'workshop' ? 'workshop_registrations' : 'camp_registrations'
  const { data: reg } = await supabase
    .from(table)
    .select('id, parent_name')
    .eq('id', registrationId)
    .eq('parent_email', email)
    .single()

  if (!reg) {
    return { success: false, error: 'Registration not found' }
  }

  // Log the cancellation request (admin will handle it)
  await supabase.from('activity_log').insert({
    action: 'cancellation_requested',
    entity_type: table,
    entity_id: registrationId,
    user_email: email,
    details: { reason, parent_name: reg.parent_name },
  })

  // TODO: Send email to admin about cancellation request

  return { success: true }
}
