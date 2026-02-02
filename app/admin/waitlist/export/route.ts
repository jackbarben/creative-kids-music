import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { getAdminUser } from '@/lib/admin'

export async function GET() {
  const authClient = await createClient()

  // Check admin auth
  const admin = await getAdminUser(authClient)
  if (!admin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const supabase = createAdminClient()

  // Fetch signups
  const { data: signups, error } = await supabase
    .from('waitlist_signups')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to fetch waitlist signups' }, { status: 500 })
  }

  if (!signups || signups.length === 0) {
    return NextResponse.json({ error: 'No waitlist signups found' }, { status: 404 })
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
