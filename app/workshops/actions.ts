'use server'

import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'
import { sendWorkshopConfirmation, sendAdminNotification } from '@/lib/email'
import { PROGRAMS, SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT } from '@/lib/constants'

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
  const parentEmail = formData.get('parent_email') as string
  const parentFirstName = formData.get('parent_first_name') as string
  const parentLastName = formData.get('parent_last_name') as string
  const parentRelationship = formData.get('parent_relationship') as string
  const parentPhone = formData.get('parent_phone') as string | null

  // Emergency contact
  const emergencyName = formData.get('emergency_name') as string
  const emergencyPhone = formData.get('emergency_phone') as string
  const emergencyRelationship = formData.get('emergency_relationship') as string

  // Workshops & payment
  const workshopIds = formData.getAll('workshop_ids') as string[]
  const paymentPreference = formData.get('payment_preference') as string
  const assistanceNotes = formData.get('assistance_notes') as string | null

  // Agreements
  const liabilityWaiverAccepted = formData.get('liability_waiver_accepted') === 'on'
  const mediaConsentInternal = formData.get('media_consent_internal') === 'on'
  const mediaConsentMarketing = formData.get('media_consent_marketing') === 'on'
  const termsAccepted = formData.get('terms_accepted') === 'on'

  // Optional
  const howHeard = formData.get('how_heard') as string | null
  const excitedAbout = formData.get('excited_about') as string | null
  const message = formData.get('message') as string | null
  const childCount = parseInt(formData.get('child_count') as string) || 1

  // Account fields
  const userId = formData.get('user_id') as string | null
  const password = formData.get('password') as string | null
  const confirmPassword = formData.get('confirm_password') as string | null

  // Pickups
  const pickupCount = parseInt(formData.get('pickup_count') as string) || 0

  // Validation
  const fieldErrors: Record<string, string> = {}

  // Parent validation
  if (!parentFirstName || parentFirstName.trim().length < 1) {
    fieldErrors.parent_first_name = 'Please enter your first name'
  }
  if (!parentLastName || parentLastName.trim().length < 1) {
    fieldErrors.parent_last_name = 'Please enter your last name'
  }
  if (!parentRelationship) {
    fieldErrors.parent_relationship = 'Please select your relationship'
  }
  if (!parentPhone || parentPhone.trim().length < 5) {
    fieldErrors.parent_phone = 'Please enter a valid phone number'
  }
  if (!parentEmail || !parentEmail.includes('@')) {
    fieldErrors.parent_email = 'Please enter a valid email address'
  }

  // Emergency contact validation
  if (!emergencyName || emergencyName.trim().length < 1) {
    fieldErrors.emergency_name = 'Please enter emergency contact name'
  }
  if (!emergencyPhone || emergencyPhone.trim().length < 5) {
    fieldErrors.emergency_phone = 'Please enter emergency contact phone'
  }
  if (!emergencyRelationship || emergencyRelationship.trim().length < 1) {
    fieldErrors.emergency_relationship = 'Please enter emergency contact relationship'
  }

  // Workshop validation
  if (workshopIds.length === 0) {
    fieldErrors.workshop_ids = 'Please select at least one workshop'
  }

  // Payment validation
  if (!paymentPreference) {
    fieldErrors.payment_preference = 'Please select a payment option'
  }

  // Agreements validation
  if (!liabilityWaiverAccepted) {
    fieldErrors.liability_waiver_accepted = 'Please accept the liability waiver'
  }
  // Media consent is optional - no validation needed for checkboxes
  if (!termsAccepted) {
    fieldErrors.terms_accepted = 'Please accept the program terms'
  }

  // Validate password for new accounts (if password provided but no user_id)
  if (password && !userId) {
    if (password.length < 8) {
      fieldErrors.password = 'Password must be at least 8 characters'
    }
    if (password !== confirmPassword) {
      fieldErrors.confirm_password = 'Passwords do not match'
    }
  }

  // Validate children
  const children: {
    name: string
    age: number
    school: string | null
    account_child_id: string | null
    allergies: string | null
    medical_conditions: string | null
  }[] = []
  for (let i = 0; i < childCount; i++) {
    const childName = formData.get(`child_name_${i}`) as string
    const childAge = parseInt(formData.get(`child_age_${i}`) as string)
    const childSchool = formData.get(`child_school_${i}`) as string | null
    const accountChildId = formData.get(`child_account_id_${i}`) as string | null
    const childAllergies = formData.get(`child_allergies_${i}`) as string | null
    const childMedical = formData.get(`child_medical_${i}`) as string | null

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
      account_child_id: accountChildId?.trim() || null,
      allergies: childAllergies?.trim() || null,
      medical_conditions: childMedical?.trim() || null,
    })
  }

  // Validate pickups
  const pickups: { name: string; phone: string; relationship: string }[] = []
  for (let i = 0; i < pickupCount; i++) {
    const pickupName = formData.get(`pickup_name_${i}`) as string
    const pickupPhone = formData.get(`pickup_phone_${i}`) as string
    const pickupRelationship = formData.get(`pickup_relationship_${i}`) as string

    if (!pickupName || pickupName.trim().length < 1) {
      fieldErrors[`pickup_name_${i}`] = 'Please enter pickup name'
    }

    pickups.push({
      name: pickupName?.trim() || '',
      phone: pickupPhone?.trim() || '',
      relationship: pickupRelationship?.trim() || '',
    })
  }

  if (Object.keys(fieldErrors).length > 0) {
    console.log('Validation errors:', fieldErrors)
    return { fieldErrors }
  }

  console.log('Validation passed, proceeding with registration')

  // Calculate pricing using centralized constants
  const PRICE_CENTS = PROGRAMS.workshops.pricePerWorkshop
  let totalCents = 0
  const childDiscounts: number[] = []

  for (let i = 0; i < children.length; i++) {
    const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
    childDiscounts.push(discount)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }
  // Multiply by number of workshops
  totalCents *= workshopIds.length

  const supabase = await createClient()

  // Handle account creation if password provided (new user)
  let finalUserId = userId || null
  if (password && !userId) {
    // Create new user account using admin client
    const adminClient = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { data: newUser, error: signUpError } = await adminClient.auth.admin.createUser({
      email: parentEmail.trim().toLowerCase(),
      password: password,
      email_confirm: true, // Auto-confirm email for registration flow
    })

    if (signUpError) {
      console.error('Account creation error:', signUpError)
      // Don't fail registration, just proceed without account
      // User can create account later
    } else if (newUser?.user) {
      finalUserId = newUser.user.id
    }
  }

  // Combine parent name for backward compatibility
  const fullParentName = `${parentFirstName.trim()} ${parentLastName.trim()}`

  // Insert registration
  console.log('Inserting registration with user_id:', finalUserId)
  const { data: registration, error: regError } = await supabase
    .from('workshop_registrations')
    .insert({
      user_id: finalUserId,
      parent_name: fullParentName,
      parent_first_name: parentFirstName.trim(),
      parent_last_name: parentLastName.trim(),
      parent_relationship: parentRelationship,
      parent_email: parentEmail.trim().toLowerCase(),
      parent_phone: parentPhone?.trim() || null,
      emergency_name: emergencyName.trim(),
      emergency_phone: emergencyPhone.trim(),
      emergency_relationship: emergencyRelationship.trim(),
      workshop_ids: workshopIds,
      payment_method: paymentPreference,
      tuition_assistance: paymentPreference === 'assistance',
      assistance_notes: paymentPreference === 'assistance' ? assistanceNotes?.trim() : null,
      total_amount_cents: totalCents,
      liability_waiver_accepted: true,
      liability_waiver_accepted_at: new Date().toISOString(),
      media_consent_internal: mediaConsentInternal,
      media_consent_marketing: mediaConsentMarketing,
      media_consent_accepted_at: new Date().toISOString(),
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
    console.error('Registration data that failed:', { finalUserId, fullParentName, parentEmail, workshopIds })
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  console.log('Registration created:', registration.id)

  // Insert children
  const { error: childError } = await supabase
    .from('workshop_children')
    .insert(children.map((child, i) => ({
      registration_id: registration.id,
      child_name: child.name,
      child_age: child.age,
      child_school: child.school,
      discount_cents: childDiscounts[i],
      account_child_id: child.account_child_id || null,
      allergies: child.allergies,
      medical_conditions: child.medical_conditions,
    })))

  if (childError) {
    console.error('Workshop children insert error:', childError)
    // Registration was created, so we don't fail completely
  }

  // Insert authorized pickups
  if (pickups.length > 0) {
    const { error: pickupError } = await supabase
      .from('workshop_authorized_pickups')
      .insert(pickups.map(pickup => ({
        registration_id: registration.id,
        name: pickup.name,
        phone: pickup.phone,
        relationship: pickup.relationship,
      })))

    if (pickupError) {
      console.error('Workshop pickups insert error:', pickupError)
      // Don't fail registration for this
    }
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
      parentName: fullParentName,
      parentEmail: parentEmail.trim().toLowerCase(),
      children: children.map(c => ({ name: c.name, age: c.age })),
      workshopDates,
      totalAmount: totalCents / 100,
      paymentMethod: paymentPreference,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
      mediaConsentInternal,
      mediaConsentMarketing,
    }),
    sendAdminNotification({
      type: 'workshop',
      parentName: fullParentName,
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: children.length,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
  ]).catch(console.error)

  redirect('/workshops/thank-you')
}
