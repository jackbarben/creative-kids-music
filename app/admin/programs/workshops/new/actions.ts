'use server'

import { createAdminClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logActivity } from '@/lib/data'

type CreateWorkshopInput = {
  title: string
  date: string
  start_time: string
  end_time: string
  location: string
  address: string
  description: string
  capacity: number
  price_cents: number
  status: 'draft' | 'open' | 'closed'
  waitlist_enabled: boolean
  registration_opens_at: string
  registration_closes_at: string
}

type CreateWorkshopResult = {
  success?: boolean
  error?: string
  workshopId?: string
}

export async function createWorkshop(data: CreateWorkshopInput): Promise<CreateWorkshopResult> {
  const supabase = createAdminClient()

  // Validate required fields
  if (!data.title?.trim()) {
    return { error: 'Title is required' }
  }
  if (!data.date) {
    return { error: 'Date is required' }
  }

  const insertData = {
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
  }

  const { data: workshop, error } = await supabase
    .from('workshops')
    .insert(insertData)
    .select('id')
    .single()

  if (error) {
    console.error('Create workshop error:', error)
    return { error: 'Failed to create workshop' }
  }

  await logActivity(
    'workshop_created',
    'workshop',
    workshop.id,
    { title: data.title, date: data.date, status: data.status }
  )

  revalidatePath('/admin/programs/workshops')
  revalidatePath('/workshops')

  return { success: true, workshopId: workshop.id }
}
