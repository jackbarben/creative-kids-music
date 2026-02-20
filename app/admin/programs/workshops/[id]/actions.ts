'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/data'

type UpdateWorkshopInput = {
  title: string
  date: string
  start_time: string
  end_time: string
  location: string
  address: string
  description: string | null
  capacity: number
  price_cents: number
  status: 'draft' | 'open' | 'closed' | 'completed' | 'archived'
  waitlist_enabled: boolean
  registration_opens_at: string | null
  registration_closes_at: string | null
  notes: string | null
  media_folder_url: string | null
}

type UpdateWorkshopResult = {
  success?: boolean
  error?: string
}

export async function updateWorkshop(
  workshopId: string,
  data: UpdateWorkshopInput
): Promise<UpdateWorkshopResult> {
  const supabase = createAdminClient()

  // Validate required fields
  if (!data.title?.trim()) {
    return { error: 'Title is required' }
  }
  if (!data.date) {
    return { error: 'Date is required' }
  }

  // Get current workshop for logging
  const { data: currentWorkshop } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', workshopId)
    .single()

  if (!currentWorkshop) {
    return { error: 'Workshop not found' }
  }

  const updateData = {
    title: data.title.trim(),
    date: data.date,
    start_time: data.start_time || '16:00',
    end_time: data.end_time || '19:30',
    location: data.location?.trim() || "St. Luke's/San Lucas Episcopal Church",
    address: data.address?.trim() || '426 E Fourth Plain Blvd, Vancouver, WA 98661',
    description: data.description?.trim() || null,
    capacity: data.capacity || 12,
    price_cents: data.price_cents || 7500,
    status: data.status || 'draft',
    is_active: data.status === 'open',
    waitlist_enabled: data.waitlist_enabled ?? true,
    registration_opens_at: data.registration_opens_at || null,
    registration_closes_at: data.registration_closes_at || null,
    notes: data.notes?.trim() || null,
    media_folder_url: data.media_folder_url?.trim() || null,
    updated_at: new Date().toISOString(),
  }

  const { error } = await supabase
    .from('workshops')
    .update(updateData)
    .eq('id', workshopId)

  if (error) {
    console.error('Update workshop error:', error)
    return { error: 'Failed to update workshop' }
  }

  // Log changes
  const changes: Record<string, { before: unknown; after: unknown }> = {}
  for (const key of Object.keys(updateData) as (keyof typeof updateData)[]) {
    if (key === 'updated_at') continue
    if (currentWorkshop[key] !== updateData[key]) {
      changes[key] = { before: currentWorkshop[key], after: updateData[key] }
    }
  }

  if (Object.keys(changes).length > 0) {
    await logActivity(
      'workshop_updated',
      'workshop',
      workshopId,
      { changes, title: data.title }
    )
  }

  revalidatePath(`/admin/programs/workshops/${workshopId}`)
  revalidatePath('/admin/programs/workshops')
  revalidatePath('/workshops')

  return { success: true }
}

type UpdateProgramNotesInput = {
  performance_summary: string | null
  session_summary: string | null
  highlights: string | null
  lessons_learned: string | null
}

export async function updateProgramNotes(
  workshopId: string,
  data: UpdateProgramNotesInput
): Promise<UpdateWorkshopResult> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('workshops')
    .update({
      performance_summary: data.performance_summary?.trim() || null,
      session_summary: data.session_summary?.trim() || null,
      highlights: data.highlights?.trim() || null,
      lessons_learned: data.lessons_learned?.trim() || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', workshopId)

  if (error) {
    console.error('Update program notes error:', error)
    return { error: 'Failed to update program notes' }
  }

  await logActivity(
    'workshop_notes_updated',
    'workshop',
    workshopId,
    { updated_fields: Object.keys(data).filter(k => data[k as keyof typeof data]) }
  )

  revalidatePath(`/admin/programs/workshops/${workshopId}`)

  return { success: true }
}

export async function archiveWorkshop(workshopId: string): Promise<UpdateWorkshopResult> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .from('workshops')
    .update({
      status: 'archived',
      archived_at: new Date().toISOString(),
      is_active: false,
      updated_at: new Date().toISOString(),
    })
    .eq('id', workshopId)

  if (error) {
    console.error('Archive workshop error:', error)
    return { error: 'Failed to archive workshop' }
  }

  await logActivity('workshop_archived', 'workshop', workshopId, {})

  revalidatePath(`/admin/programs/workshops/${workshopId}`)
  revalidatePath('/admin/programs/workshops')
  revalidatePath('/workshops')

  return { success: true }
}

export async function deleteWorkshop(workshopId: string): Promise<UpdateWorkshopResult> {
  const supabase = createAdminClient()

  // Check for registrations
  const { count } = await supabase
    .from('workshop_registrations')
    .select('id', { count: 'exact', head: true })
    .contains('workshop_ids', [workshopId])

  if (count && count > 0) {
    return { error: `Cannot delete workshop with ${count} registration(s). Archive it instead.` }
  }

  const { data: workshop } = await supabase
    .from('workshops')
    .select('title')
    .eq('id', workshopId)
    .single()

  const { error } = await supabase
    .from('workshops')
    .delete()
    .eq('id', workshopId)

  if (error) {
    console.error('Delete workshop error:', error)
    return { error: 'Failed to delete workshop' }
  }

  await logActivity('workshop_deleted', 'workshop', workshopId, { title: workshop?.title })

  revalidatePath('/admin/programs/workshops')
  revalidatePath('/workshops')

  return { success: true }
}
