'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateCampRegistration(
  registrationId: string,
  data: {
    status?: string
    payment_status?: string
    admin_notes?: string
  }
) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('camp_registrations')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    console.error('Error updating registration:', error)
    return { error: 'Failed to update registration' }
  }

  revalidatePath(`/admin/camp/${registrationId}`)
  revalidatePath('/admin/camp')
  revalidatePath('/admin')

  return { success: true }
}
