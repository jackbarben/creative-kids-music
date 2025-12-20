import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch signups
  const { data: signups } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (!signups) {
    return NextResponse.json({ error: 'No data' }, { status: 404 })
  }

  // CSV header
  const headers = [
    'Signup Date',
    'Parent Name',
    'Parent Email',
    'Child Name',
    'Child Grade',
    'Child School',
    'Number of Children',
    'Status',
    'Message',
    'Admin Notes',
  ]

  // CSV rows
  const rows = signups.map(signup => [
    new Date(signup.created_at).toLocaleDateString(),
    signup.parent_name,
    signup.parent_email,
    signup.child_name || '',
    signup.child_grade || '',
    signup.child_school || '',
    signup.num_children,
    signup.status,
    signup.message || '',
    signup.admin_notes || '',
  ])

  // Build CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  // Return as downloadable file
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="music-school-waitlist-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
