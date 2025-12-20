'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendCampConfirmation, sendAdminNotification } from '@/lib/email'

export type CampFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitCampRegistration(
  prevState: CampFormState,
  formData: FormData
): Promise<CampFormState> {
  // Honeypot check
  const honeypot = formData.get('website')
  if (honeypot) {
    redirect('/summer-camp/thank-you')
  }

  // Extract form data
  const parentName = formData.get('parent_name') as string
  const parentEmail = formData.get('parent_email') as string
  const parentPhone = formData.get('parent_phone') as string
  const emergencyName = formData.get('emergency_name') as string
  const emergencyPhone = formData.get('emergency_phone') as string
  const emergencyRelationship = formData.get('emergency_relationship') as string | null
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

  if (!parentPhone || parentPhone.trim().length < 7) {
    fieldErrors.parent_phone = 'Please enter your phone number'
  }

  if (!emergencyName || emergencyName.trim().length < 2) {
    fieldErrors.emergency_name = 'Please enter an emergency contact name'
  }

  if (!emergencyPhone || emergencyPhone.trim().length < 7) {
    fieldErrors.emergency_phone = 'Please enter an emergency contact phone'
  }

  if (!paymentPreference) {
    fieldErrors.payment_preference = 'Please select a payment option'
  }

  if (!termsAccepted) {
    fieldErrors.terms_accepted = 'Please accept the terms to continue'
  }

  // Validate children
  const children: {
    name: string
    age: number
    grade: string | null
    school: string | null
    allergies: string | null
    medical: string | null
    special: string | null
  }[] = []

  for (let i = 0; i < childCount; i++) {
    const childName = formData.get(`child_name_${i}`) as string
    const childAge = parseInt(formData.get(`child_age_${i}`) as string)
    const childGrade = formData.get(`child_grade_${i}`) as string | null
    const childSchool = formData.get(`child_school_${i}`) as string | null
    const allergies = formData.get(`child_allergies_${i}`) as string | null
    const medical = formData.get(`child_medical_${i}`) as string | null
    const special = formData.get(`child_special_${i}`) as string | null

    if (!childName || childName.trim().length < 2) {
      fieldErrors[`child_name_${i}`] = `Please enter child ${i + 1}'s name`
    }
    if (isNaN(childAge) || childAge < 1 || childAge > 18) {
      fieldErrors[`child_age_${i}`] = `Please enter a valid age`
    }

    children.push({
      name: childName?.trim() || '',
      age: childAge || 0,
      grade: childGrade || null,
      school: childSchool?.trim() || null,
      allergies: allergies?.trim() || null,
      medical: medical?.trim() || null,
      special: special?.trim() || null,
    })
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  // Calculate pricing
  const PRICE_CENTS = 40000 // $400
  const SIBLING_DISCOUNT = 1000 // $10
  let totalCents = 0
  const childDiscounts: number[] = []

  for (let i = 0; i < children.length; i++) {
    const discount = i * SIBLING_DISCOUNT
    childDiscounts.push(discount)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }

  const supabase = await createClient()

  // Insert registration
  const { data: registration, error: regError } = await supabase
    .from('camp_registrations')
    .insert({
      parent_name: parentName.trim(),
      parent_email: parentEmail.trim().toLowerCase(),
      parent_phone: parentPhone.trim(),
      emergency_name: emergencyName.trim(),
      emergency_phone: emergencyPhone.trim(),
      emergency_relationship: emergencyRelationship?.trim() || null,
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
    console.error('Camp registration error:', regError)
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  // Insert children
  const { error: childError } = await supabase
    .from('camp_children')
    .insert(children.map((child, i) => ({
      registration_id: registration.id,
      child_name: child.name,
      child_age: child.age,
      child_grade: child.grade,
      child_school: child.school,
      allergies: child.allergies,
      medical_conditions: child.medical,
      special_needs: child.special,
      discount_cents: childDiscounts[i],
    })))

  if (childError) {
    console.error('Camp children insert error:', childError)
  }

  // Send confirmation emails (don't block on failure)
  Promise.all([
    sendCampConfirmation({
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      children: children.map(c => ({ name: c.name, age: c.age })),
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim(),
      totalAmount: totalCents / 100,
      paymentMethod: paymentPreference,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
    sendAdminNotification({
      type: 'camp',
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: children.length,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
  ]).catch(console.error)

  redirect('/summer-camp/thank-you')
}
