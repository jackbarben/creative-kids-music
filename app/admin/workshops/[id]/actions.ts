'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

// Valid status transitions - cancelled is a terminal state
const VALID_STATUS_TRANSITIONS: Record<string, string[]> = {
  pending: ['confirmed', 'waitlist', 'cancelled'],
  confirmed: ['cancelled'],
  waitlist: ['confirmed', 'cancelled'],
  cancelled: [], // Cannot transition from cancelled
}

export async function updateWorkshopRegistration(
  registrationId: string,
  data: {
    status?: string
    payment_status?: string
    admin_notes?: string
  }
) {
  const supabase = await createClient()

  // If status is being changed, validate the transition
  if (data.status) {
    const { data: current, error: fetchError } = await supabase
      .from('workshop_registrations')
      .select('status')
      .eq('id', registrationId)
      .single()

    if (fetchError) {
      console.error('Error fetching registration:', fetchError)
      return { error: 'Failed to fetch registration' }
    }

    if (current && data.status !== current.status) {
      const allowed = VALID_STATUS_TRANSITIONS[current.status] || []
      if (!allowed.includes(data.status)) {
        return {
          error: `Cannot change status from "${current.status}" to "${data.status}"`
        }
      }
    }
  }

  const { error } = await supabase
    .from('workshop_registrations')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', registrationId)

  if (error) {
    console.error('Error updating registration:', error)
    return { error: 'Failed to update registration' }
  }

  revalidatePath(`/admin/workshops/${registrationId}`)
  revalidatePath('/admin/workshops')
  revalidatePath('/admin')

  return { success: true }
}
