'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/data'

export async function generateAttendance(workshopId: string): Promise<{ success: boolean; count: number; error?: string }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('generate_workshop_attendance', {
    p_workshop_id: workshopId
  })

  if (error) {
    console.error('Generate attendance error:', error)
    return { success: false, count: 0, error: 'Failed to generate attendance records' }
  }

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true, count: data || 0 }
}

export async function checkInChild(
  workshopId: string,
  childId: string,
  checkedInBy: string = 'admin'
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('check_in_child', {
    p_workshop_id: workshopId,
    p_child_id: childId,
    p_checked_in_by: checkedInBy
  })

  if (error) {
    console.error('Check-in error:', error)
    return { success: false, error: 'Failed to check in child' }
  }

  if (!data) {
    return { success: false, error: 'Child not found or already checked in' }
  }

  // Get child name for logging
  const { data: child } = await supabase
    .from('workshop_children')
    .select('child_name')
    .eq('id', childId)
    .single()

  await logActivity('child_checked_in', 'workshop', workshopId, {
    child_id: childId,
    child_name: child?.child_name
  })

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true }
}

export async function undoCheckIn(
  workshopId: string,
  childId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('undo_check_in', {
    p_workshop_id: workshopId,
    p_child_id: childId
  })

  if (error) {
    console.error('Undo check-in error:', error)
    return { success: false, error: 'Failed to undo check-in' }
  }

  if (!data) {
    return { success: false, error: 'Child not found or not checked in' }
  }

  // Get child name for logging
  const { data: child } = await supabase
    .from('workshop_children')
    .select('child_name')
    .eq('id', childId)
    .single()

  await logActivity('child_checkin_undone', 'workshop', workshopId, {
    child_id: childId,
    child_name: child?.child_name
  })

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true }
}

export async function markNoShow(
  workshopId: string,
  childId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { data, error } = await supabase.rpc('mark_no_show', {
    p_workshop_id: workshopId,
    p_child_id: childId
  })

  if (error) {
    console.error('Mark no-show error:', error)
    return { success: false, error: 'Failed to mark as no-show' }
  }

  if (!data) {
    return { success: false, error: 'Child not found' }
  }

  // Get child name for logging
  const { data: child } = await supabase
    .from('workshop_children')
    .select('child_name')
    .eq('id', childId)
    .single()

  await logActivity('child_marked_no_show', 'workshop', workshopId, {
    child_id: childId,
    child_name: child?.child_name
  })

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true }
}

export async function updateAttendanceNotes(
  workshopId: string,
  childId: string,
  notes: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('workshop_attendance')
    .update({ notes: notes || null, updated_at: new Date().toISOString() })
    .eq('workshop_id', workshopId)
    .eq('child_id', childId)

  if (error) {
    console.error('Update notes error:', error)
    return { success: false, error: 'Failed to update notes' }
  }

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true }
}

export async function resetAttendance(
  workshopId: string,
  childId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('workshop_attendance')
    .update({
      status: 'expected',
      checked_in_at: null,
      checked_in_by: null,
      updated_at: new Date().toISOString()
    })
    .eq('workshop_id', workshopId)
    .eq('child_id', childId)

  if (error) {
    console.error('Reset attendance error:', error)
    return { success: false, error: 'Failed to reset attendance' }
  }

  revalidatePath(`/admin/programs/workshops/${workshopId}/attendance`)

  return { success: true }
}
