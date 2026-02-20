import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/server'
import AttendanceList from './AttendanceList'
import type { Workshop } from '@/lib/database.types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

async function getWorkshop(id: string): Promise<Workshop | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from('workshops')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching workshop:', error)
    return null
  }

  return data
}

interface AttendanceRecord {
  id: string
  workshop_id: string
  registration_id: string
  child_id: string
  status: 'expected' | 'checked_in' | 'no_show' | 'cancelled'
  checked_in_at: string | null
  checked_in_by: string | null
  notes: string | null
  child: {
    id: string
    child_name: string
    child_age: number
    allergies: string | null
    medical_conditions: string | null
  }
  registration: {
    id: string
    parent_name: string
    parent_phone: string | null
    parent_email: string
  }
}

async function getAttendance(workshopId: string): Promise<AttendanceRecord[]> {
  const supabase = createAdminClient()

  // First, ensure attendance records exist
  await supabase.rpc('generate_workshop_attendance', { p_workshop_id: workshopId })

  // Then fetch attendance with child and registration details
  const { data, error } = await supabase
    .from('workshop_attendance')
    .select(`
      id,
      workshop_id,
      registration_id,
      child_id,
      status,
      checked_in_at,
      checked_in_by,
      notes,
      child:workshop_children!inner(
        id,
        child_name,
        child_age,
        allergies,
        medical_conditions
      ),
      registration:workshop_registrations!inner(
        id,
        parent_name,
        parent_phone,
        parent_email
      )
    `)
    .eq('workshop_id', workshopId)
    .order('child->child_name')

  if (error) {
    console.error('Error fetching attendance:', error)
    return []
  }

  // Transform the data to flatten the nested objects
  return (data || []).map(record => ({
    ...record,
    child: Array.isArray(record.child) ? record.child[0] : record.child,
    registration: Array.isArray(record.registration) ? record.registration[0] : record.registration
  })) as AttendanceRecord[]
}

async function getAttendanceSummary(workshopId: string) {
  const supabase = createAdminClient()

  const { data } = await supabase.rpc('get_workshop_attendance_summary', {
    p_workshop_id: workshopId
  })

  if (data && data.length > 0) {
    return data[0]
  }

  return {
    total_expected: 0,
    checked_in: 0,
    no_show: 0,
    cancelled: 0
  }
}

export default async function AttendancePage({ params }: PageProps) {
  const { id } = await params
  const [workshop, attendance, summary] = await Promise.all([
    getWorkshop(id),
    getAttendance(id),
    getAttendanceSummary(id)
  ])

  if (!workshop) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString + 'T00:00:00').toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}:${minutes} ${ampm}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <Link
            href={`/admin/programs/workshops/${id}`}
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Workshop
          </Link>
          <h1 className="font-display text-2xl font-bold text-stone-800">
            Attendance: {workshop.title}
          </h1>
          <p className="text-stone-500">
            {formatDate(workshop.date)} &middot; {formatTime(workshop.start_time)} - {formatTime(workshop.end_time)}
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-stone-200 p-4 text-center">
          <p className="text-3xl font-bold text-stone-800">{summary.total_expected}</p>
          <p className="text-sm text-stone-500">Expected</p>
        </div>
        <div className="bg-white rounded-xl border border-green-200 p-4 text-center">
          <p className="text-3xl font-bold text-green-700">{summary.checked_in}</p>
          <p className="text-sm text-green-600">Checked In</p>
        </div>
        <div className="bg-white rounded-xl border border-amber-200 p-4 text-center">
          <p className="text-3xl font-bold text-amber-700">{summary.total_expected - summary.checked_in - summary.no_show}</p>
          <p className="text-sm text-amber-600">Waiting</p>
        </div>
        <div className="bg-white rounded-xl border border-red-200 p-4 text-center">
          <p className="text-3xl font-bold text-red-700">{summary.no_show}</p>
          <p className="text-sm text-red-600">No Show</p>
        </div>
      </div>

      {/* Attendance List */}
      <AttendanceList
        workshopId={id}
        attendance={attendance}
      />
    </div>
  )
}
