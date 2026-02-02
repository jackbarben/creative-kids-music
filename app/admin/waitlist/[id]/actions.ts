'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateWaitlistSignup(
  signupId: string,
  data: {
    status?: string
    admin_notes?: string
  }
) {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('waitlist_signups')
    .update(data)
    .eq('id', signupId)

  if (error) {
    console.error('Error updating waitlist signup:', error)
    return { error: 'Failed to update signup' }
  }

  revalidatePath(`/admin/waitlist/${signupId}`)
  revalidatePath('/admin/waitlist')
  revalidatePath('/admin')

  return { success: true }
}
