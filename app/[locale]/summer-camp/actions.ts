'use server'

import { createAdminClient, getUserByEmail } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { sendCampConfirmation, sendAdminNotification } from '@/lib/email'
import { PROGRAMS, SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT } from '@/lib/constants'

export type CampFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitCampRegistration(
  prevState: CampFormState,
  formData: FormData
): Promise<CampFormState> {
  const locale = (formData.get('locale') as string) || 'en'
  const t = await getTranslations({ locale, namespace: 'forms.validation' })

  // Honeypot check
  const honeypot = formData.get('website')
  if (honeypot) {
    redirect(`/${locale}/summer-camp/thank-you`)
  }

  // Extract form data
  const parentEmail = formData.get('parent_email') as string
  const parentFirstName = formData.get('parent_first_name') as string
  const parentLastName = formData.get('parent_last_name') as string
  const parentRelationship = formData.get('parent_relationship') as string
  const parentPhone = formData.get('parent_phone') as string | null

  // Second parent (optional)
  const parent2FirstName = formData.get('parent2_first_name') as string | null
  const parent2LastName = formData.get('parent2_last_name') as string | null
  const parent2Relationship = formData.get('parent2_relationship') as string | null
  const parent2Phone = formData.get('parent2_phone') as string | null
  const parent2Email = formData.get('parent2_email') as string | null

  // Emergency contact
  const emergencyName = formData.get('emergency_name') as string
  const emergencyPhone = formData.get('emergency_phone') as string
  const emergencyRelationship = formData.get('emergency_relationship') as string

  // Payment
  const paymentPreference = formData.get('payment_preference') as string
  const assistanceNotes = formData.get('assistance_notes') as string | null

  // Agreements
  const liabilityWaiverAccepted = formData.get('liability_waiver_accepted') === 'on'
  const mediaConsentInternal = formData.get('media_consent_internal') === 'on'
  const mediaConsentMarketing = formData.get('media_consent_marketing') === 'on'
  const behaviorAgreementAccepted = formData.get('behavior_agreement_accepted') === 'on'
  const termsAccepted = formData.get('terms_accepted') === 'on'

  // Optional
  const howHeard = formData.get('how_heard') as string | null
  const excitedAbout = formData.get('excited_about') as string | null
  const message = formData.get('message') as string | null
  const childCount = parseInt(formData.get('child_count') as string) || 1

  // Account fields (user_id is set if user is logged in)
  const userId = formData.get('user_id') as string | null

  // Pickups
  const pickupCount = parseInt(formData.get('pickup_count') as string) || 0

  // Validation
  const fieldErrors: Record<string, string> = {}

  // Parent validation
  if (!parentFirstName || parentFirstName.trim().length < 1) {
    fieldErrors.parent_first_name = t('enterFirstName')
  }
  if (!parentLastName || parentLastName.trim().length < 1) {
    fieldErrors.parent_last_name = t('enterLastName')
  }
  if (!parentRelationship) {
    fieldErrors.parent_relationship = t('selectRelationship')
  }
  if (!parentPhone || parentPhone.trim().length < 5) {
    fieldErrors.parent_phone = t('validPhone')
  }
  if (!parentEmail || !parentEmail.includes('@')) {
    fieldErrors.parent_email = t('validEmail')
  }

  // Emergency contact validation
  if (!emergencyName || emergencyName.trim().length < 1) {
    fieldErrors.emergency_name = t('emergencyName')
  }
  if (!emergencyPhone || emergencyPhone.trim().length < 5) {
    fieldErrors.emergency_phone = t('emergencyPhone')
  }
  if (!emergencyRelationship || emergencyRelationship.trim().length < 1) {
    fieldErrors.emergency_relationship = t('emergencyRelationship')
  }

  // Payment validation
  if (!paymentPreference) {
    fieldErrors.payment_preference = t('selectPayment')
  }

  // Agreements validation
  if (!liabilityWaiverAccepted) {
    fieldErrors.liability_waiver_accepted = t('acceptLiability')
  }
  // Media consent is optional - no validation needed for checkboxes
  if (!behaviorAgreementAccepted) {
    fieldErrors.behavior_agreement_accepted = t('acceptBehavior')
  }
  if (!termsAccepted) {
    fieldErrors.terms_accepted = t('acceptTerms')
  }

  // Validate children
  const children: {
    first_name: string
    last_name: string
    name: string
    age: number
    grade: string | null
    school: string | null
    allergies: string | null
    dietary: string | null
    medical: string | null
    special: string | null
    tshirtSize: string | null
    account_child_id: string | null
  }[] = []

  for (let i = 0; i < childCount; i++) {
    const childFirstName = (formData.get(`child_first_name_${i}`) as string | null)?.trim() || ''
    const childLastName = (formData.get(`child_last_name_${i}`) as string | null)?.trim() || ''
    const childAge = parseInt(formData.get(`child_age_${i}`) as string)
    const childGrade = formData.get(`child_grade_${i}`) as string | null
    const childSchool = formData.get(`child_school_${i}`) as string | null
    const allergies = formData.get(`child_allergies_${i}`) as string | null
    const dietary = formData.get(`child_dietary_${i}`) as string | null
    const medical = formData.get(`child_medical_${i}`) as string | null
    const special = formData.get(`child_special_${i}`) as string | null
    const tshirtSize = formData.get(`child_tshirt_size_${i}`) as string | null
    const accountChildId = formData.get(`child_account_id_${i}`) as string | null

    if (!childFirstName) {
      fieldErrors[`child_first_name_${i}`] = t('enterChildName', { number: i + 1 })
    }
    if (!childLastName) {
      fieldErrors[`child_last_name_${i}`] = t('enterChildName', { number: i + 1 })
    }
    if (isNaN(childAge) || childAge < 1 || childAge > 18) {
      fieldErrors[`child_age_${i}`] = t('validAge')
    }
    if (!tshirtSize) {
      fieldErrors[`child_tshirt_size_${i}`] = t('selectTshirt')
    }

    children.push({
      first_name: childFirstName,
      last_name: childLastName,
      name: `${childFirstName} ${childLastName}`.trim(),
      age: childAge || 0,
      grade: childGrade || null,
      school: childSchool?.trim() || null,
      allergies: allergies?.trim() || null,
      dietary: dietary?.trim() || null,
      medical: medical?.trim() || null,
      special: special?.trim() || null,
      tshirtSize: tshirtSize || null,
      account_child_id: accountChildId?.trim() || null,
    })
  }

  // Validate pickups
  const pickups: { name: string; phone: string; relationship: string }[] = []
  for (let i = 0; i < pickupCount; i++) {
    const pickupName = formData.get(`pickup_name_${i}`) as string
    const pickupPhone = formData.get(`pickup_phone_${i}`) as string
    const pickupRelationship = formData.get(`pickup_relationship_${i}`) as string

    if (!pickupName || pickupName.trim().length < 1) {
      fieldErrors[`pickup_name_${i}`] = t('enterPickupName')
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

  // Calculate pricing using centralized constants
  const PRICE_CENTS = PROGRAMS.camp.price
  let totalCents = 0
  const childDiscounts: number[] = []

  for (let i = 0; i < children.length; i++) {
    const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
    childDiscounts.push(discount)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }

  // Use admin client to bypass RLS for registration operations
  const supabase = createAdminClient()

  // Auto-link to existing account by email
  const normalizedEmail = parentEmail.trim().toLowerCase()
  const existingUserId = await getUserByEmail(normalizedEmail)
  const finalUserId = userId || existingUserId || null

  // Combine parent name for backward compatibility
  const fullParentName = `${parentFirstName.trim()} ${parentLastName.trim()}`

  // Insert registration
  console.log('Inserting camp registration with user_id:', finalUserId)
  const { data: registration, error: regError } = await supabase
    .from('camp_registrations')
    .insert({
      user_id: finalUserId,
      locale,
      parent_name: fullParentName,
      parent_first_name: parentFirstName.trim(),
      parent_last_name: parentLastName.trim(),
      parent_relationship: parentRelationship,
      parent_email: parentEmail.trim().toLowerCase(),
      parent_phone: parentPhone?.trim() || null,
      parent2_first_name: parent2FirstName?.trim() || null,
      parent2_last_name: parent2LastName?.trim() || null,
      parent2_relationship: parent2Relationship || null,
      parent2_phone: parent2Phone?.trim() || null,
      parent2_email: parent2Email?.trim().toLowerCase() || null,
      emergency_name: emergencyName.trim(),
      emergency_phone: emergencyPhone.trim(),
      emergency_relationship: emergencyRelationship.trim(),
      payment_method: paymentPreference,
      tuition_assistance: paymentPreference === 'assistance',
      assistance_notes: paymentPreference === 'assistance' ? assistanceNotes?.trim() : null,
      total_amount_cents: totalCents,
      liability_waiver_accepted: true,
      liability_waiver_accepted_at: new Date().toISOString(),
      media_consent_internal: mediaConsentInternal,
      media_consent_marketing: mediaConsentMarketing,
      media_consent_accepted_at: new Date().toISOString(),
      behavior_agreement_accepted: true,
      behavior_agreement_accepted_at: new Date().toISOString(),
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
    return { error: t('genericError') }
  }

  console.log('Camp registration created:', registration.id)

  // Insert children
  const { error: childError } = await supabase
    .from('camp_children')
    .insert(children.map((child, i) => ({
      registration_id: registration.id,
      first_name: child.first_name,
      last_name: child.last_name,
      child_name: child.name,
      child_age: child.age,
      child_grade: child.grade,
      child_school: child.school,
      allergies: child.allergies,
      dietary_restrictions: child.dietary,
      medical_conditions: child.medical,
      special_needs: child.special,
      tshirt_size: child.tshirtSize,
      discount_cents: childDiscounts[i],
      account_child_id: child.account_child_id || null,
    })))

  if (childError) {
    console.error('Camp children insert error:', childError)
  }

  // Sync medical info back to account_children for linked children
  for (const child of children) {
    if (child.account_child_id) {
      await supabase
        .from('account_children')
        .update({
          allergies: child.allergies,
          dietary_restrictions: child.dietary,
          medical_conditions: child.medical,
        })
        .eq('id', child.account_child_id)
    }
  }

  // Insert authorized pickups
  if (pickups.length > 0) {
    const { error: pickupError } = await supabase
      .from('authorized_pickups')
      .insert(pickups.map(pickup => ({
        camp_registration_id: registration.id,
        name: pickup.name,
        phone: pickup.phone,
        relationship: pickup.relationship,
      })))

    if (pickupError) {
      console.error('Camp pickups insert error:', pickupError)
    }
  }

  // Send confirmation emails (don't block on failure)
  Promise.all([
    sendCampConfirmation({
      parentName: fullParentName,
      parentEmail: parentEmail.trim().toLowerCase(),
      children: children.map(c => ({ name: c.name, age: c.age })),
      emergencyName: emergencyName.trim(),
      emergencyPhone: emergencyPhone.trim(),
      totalAmount: totalCents / 100,
      paymentMethod: paymentPreference,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
      mediaConsentInternal,
      mediaConsentMarketing,
      locale,
    }),
    sendAdminNotification({
      type: 'camp',
      parentName: fullParentName,
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: children.length,
      tuitionAssistance: paymentPreference === 'assistance',
      registrationId: registration.id,
    }),
  ]).catch(console.error)

  redirect(`/${locale}/summer-camp/thank-you`)
}
