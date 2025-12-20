'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendWorkshopConfirmation, sendAdminNotification } from '@/lib/email'

export type WorkshopFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitWorkshopRegistration(
  prevState: WorkshopFormState,
  formData: FormData
): Promise<WorkshopFormState> {
  // Honeypot check
  const honeypot = formData.get('website')
  if (honeypot) {
    redirect('/workshops/thank-you')
  }

  // Extract form data
  const parentName = formData.get('parent_name') as string
  const parentEmail = formData.get('parent_email') as string
  const parentPhone = formData.get('parent_phone') as string | null
  const workshopIds = formData.getAll('workshop_ids') as string[]
  const paymentPreference = formData.get('payment_preference') as string
  const assistanceNotes = formData.get('assistance_notes') as string | null
  const howHeard = formData.get('how_heard') as string | null
  const excitedAbout = formData.get('excited_about') as string | null
  const message = formData.get('message') as string | null
  const termsAccepted = formData.get('terms_accepted') === 'on'
  const childCount = parseInt(formData.get('child_count') as string) || 1

  // Validation
  const fieldErrors: Record<string, string> = {}

  if (!parentName || parentName.trim().length < 2) {
    fieldErrors.parent_name = 'Please enter your name'
  }

  if (!parentEmail || !parentEmail.includes('@')) {
    fieldErrors.parent_email = 'Please enter a valid email address'
  }

  if (workshopIds.length === 0) {
    fieldErrors.workshop_ids = 'Please select at least one workshop'
  }

  if (!paymentPreference) {
    fieldErrors.payment_preference = 'Please select a payment option'
  }

  if (!termsAccepted) {
    fieldErrors.terms_accepted = 'Please accept the terms to continue'
  }

  // Validate children
  const children: { name: string; age: number; school: string | null }[] = []
  for (let i = 0; i < childCount; i++) {
    const childName = formData.get(`child_name_${i}`) as string
    const childAge = parseInt(formData.get(`child_age_${i}`) as string)
    const childSchool = formData.get(`child_school_${i}`) as string | null

    if (!childName || childName.trim().length < 2) {
      fieldErrors[`child_name_${i}`] = `Please enter child ${i + 1}'s name`
    }
    if (isNaN(childAge) || childAge < 1 || childAge > 18) {
      fieldErrors[`child_age_${i}`] = `Please enter a valid age`
    }

    children.push({
      name: childName?.trim() || '',
      age: childAge || 0,
      school: childSchool?.trim() || null,
    })
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  // Calculate pricing
  const PRICE_CENTS = 7500 // $75
  const SIBLING_DISCOUNT = 1000 // $10
  let totalCents = 0
  const childDiscounts: number[] = []

  for (let i = 0; i < children.length; i++) {
    const discount = i * SIBLING_DISCOUNT
    childDiscounts.push(discount)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }
  // Multiply by number of workshops
  totalCents *= workshopIds.length

  const supabase = await createClient()

  // Insert registration
  const { data: registration, error: regError } = await supabase
    .from('workshop_registrations')
    .insert({
      parent_name: parentName.trim(),
      parent_email: parentEmail.trim().toLowerCase(),
      parent_phone: parentPhone?.trim() || null,
      workshop_ids: workshopIds,
      payment_method: paymentPreference,
      tuition_assistance: paymentPreference === 'assistance',
      assistance_notes: paymentPreference === 'assistance' ? assistanceNotes?.trim() : null,
      total_amount_cents: totalCents,
      terms_accepted: true,
      terms_accepted_at: new Date().toISOString(),
      how_heard: howHeard?.trim() || null,
      excited_about: excitedAbout?.trim() || null,
      message: message?.trim() || null,
    })
    .select()
    .single()

  if (regError || !registration) {
    console.error('Workshop registration error:', regError)
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  // Insert children
  const { error: childError } = await supabase
    .from('workshop_children')
    .insert(children.map((child, i) => ({
      registration_id: registration.id,
      child_name: child.name,
      child_age: child.age,
      child_school: child.school,
      discount_cents: childDiscounts[i],
    })))

  if (childError) {
    console.error('Workshop children insert error:', childError)
    // Registration was created, so we don't fail completely
  }

  // Get workshop dates for email
  const { data: workshops } = await supabase
    .from('workshops')
    .select('id, date, title')
    .in('id', workshopIds)

  const workshopDates = (workshops || []).map(w => {
    const date = new Date(w.date + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  })

  // Send confirmation emails (don't block on failure)
  Promise.all([
    sendWorkshopConfirmation({
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      children: children.map(c => ({ name: c.name, age: c.age })),
      workshopDates,
      totalAmount: totalCents / 100,
      paymentMethod: paymentPreference,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
    sendAdminNotification({
      type: 'workshop',
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: children.length,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
  ]).catch(console.error)

  redirect('/workshops/thank-you')
}
