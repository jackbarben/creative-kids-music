'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendWaitlistConfirmation, sendAdminNotification } from '@/lib/email'

export type WaitlistFormState = {
  success?: boolean
  error?: string
  fieldErrors?: Record<string, string>
}

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

  // Insert into database
  const supabase = await createClient()

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
