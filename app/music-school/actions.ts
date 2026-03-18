'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendWaitlistConfirmation, sendAdminNotification } from '@/lib/email'

export type WaitlistFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export type InterestFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

export async function submitInterestSurvey(
  prevState: InterestFormState,
  formData: FormData
): Promise<InterestFormState> {
  // Honeypot check - if this field is filled, it's likely a bot
  const honeypot = formData.get('website')
  if (honeypot) {
    // Silently reject but pretend success
    redirect('/music-school/thank-you')
  }

  // Extract form data
  const parentName = formData.get('parent_name') as string
  const parentEmail = formData.get('parent_email') as string
  const childName = formData.get('child_name') as string | null
  const childGrade = formData.get('child_grade') as string | null
  const childSchool = formData.get('child_school') as string | null
  const numChildren = parseInt(formData.get('num_children') as string) || 1
  const message = formData.get('message') as string | null

  // Survey responses
  const consider3days = formData.get('consider_3days') as string | null
  const consider3daysNotes = formData.get('consider_3days_notes') as string | null
  const transportationAffects = formData.get('transportation_affects') as string | null
  const transportationNotes = formData.get('transportation_notes') as string | null
  const tuitionAssistanceAffects = formData.get('tuition_assistance_affects') as string | null
  const tuitionAssistanceNotes = formData.get('tuition_assistance_notes') as string | null

  // Validation
  const fieldErrors: Record<string, string> = {}

  if (!parentName || parentName.trim().length < 2) {
    fieldErrors.parent_name = 'Please enter your name'
  }

  if (!parentEmail || !parentEmail.includes('@')) {
    fieldErrors.parent_email = 'Please enter a valid email address'
  }

  if (!consider3days) {
    fieldErrors.consider_3days = 'Please answer this question'
  }

  if (!transportationAffects) {
    fieldErrors.transportation_affects = 'Please answer this question'
  }

  if (!tuitionAssistanceAffects) {
    fieldErrors.tuition_assistance_affects = 'Please answer this question'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  // Use admin client to bypass RLS for signup operations
  const supabase = createAdminClient()

  const { data: signup, error } = await supabase
    .from('waitlist_signups')
    .insert({
      parent_name: parentName.trim(),
      parent_email: parentEmail.trim().toLowerCase(),
      child_name: childName?.trim() || null,
      child_grade: childGrade || null,
      child_school: childSchool?.trim() || null,
      num_children: numChildren,
      message: message?.trim() || null,
      consider_3days: consider3days,
      consider_3days_notes: consider3daysNotes?.trim() || null,
      transportation_affects: transportationAffects,
      transportation_notes: transportationNotes?.trim() || null,
      tuition_assistance_affects: tuitionAssistanceAffects,
      tuition_assistance_notes: tuitionAssistanceNotes?.trim() || null,
    })
    .select()
    .single()

  if (error || !signup) {
    console.error('Interest survey error:', error)
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  // Send confirmation emails (don't block on failure)
  Promise.all([
    sendWaitlistConfirmation({
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      signupId: signup.id,
    }),
    sendAdminNotification({
      type: 'waitlist',
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: numChildren,
      registrationId: signup.id,
    }),
  ]).catch(console.error)

  redirect('/music-school/thank-you')
}

// Keep legacy function for backwards compatibility
export async function submitWaitlistSignup(
  prevState: WaitlistFormState,
  formData: FormData
): Promise<WaitlistFormState> {
  // Honeypot check - if this field is filled, it's likely a bot
  const honeypot = formData.get('website')
  if (honeypot) {
    // Silently reject but pretend success
    redirect('/music-school/thank-you')
  }

  // Extract form data
  const parentName = formData.get('parent_name') as string
  const parentEmail = formData.get('parent_email') as string
  const childName = formData.get('child_name') as string | null
  const childGrade = formData.get('child_grade') as string | null
  const childSchool = formData.get('child_school') as string | null
  const numChildren = parseInt(formData.get('num_children') as string) || 1
  const message = formData.get('message') as string | null

  // Validation
  const fieldErrors: Record<string, string> = {}

  if (!parentName || parentName.trim().length < 2) {
    fieldErrors.parent_name = 'Please enter your name'
  }

  if (!parentEmail || !parentEmail.includes('@')) {
    fieldErrors.parent_email = 'Please enter a valid email address'
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors }
  }

  // Use admin client to bypass RLS for signup operations
  const supabase = createAdminClient()

  const { data: signup, error } = await supabase
    .from('waitlist_signups')
    .insert({
      parent_name: parentName.trim(),
      parent_email: parentEmail.trim().toLowerCase(),
      child_name: childName?.trim() || null,
      child_grade: childGrade || null,
      child_school: childSchool?.trim() || null,
      num_children: numChildren,
      message: message?.trim() || null,
    })
    .select()
    .single()

  if (error || !signup) {
    console.error('Waitlist signup error:', error)
    return { error: 'Something went wrong. Please try again or email us directly.' }
  }

  // Send confirmation emails (don't block on failure)
  Promise.all([
    sendWaitlistConfirmation({
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      signupId: signup.id,
    }),
    sendAdminNotification({
      type: 'waitlist',
      parentName: parentName.trim(),
      parentEmail: parentEmail.trim().toLowerCase(),
      childrenCount: numChildren,
      registrationId: signup.id,
    }),
  ]).catch(console.error)

  redirect('/music-school/thank-you')
}
