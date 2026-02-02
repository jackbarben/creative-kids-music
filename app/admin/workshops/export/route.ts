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

  // Fetch registrations with children
  const { data: registrations, error: regError } = await supabase
    .from('workshop_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  if (regError) {
    console.error('Export error (registrations):', regError)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }

  if (!registrations || registrations.length === 0) {
    return NextResponse.json({ error: 'No registrations found' }, { status: 404 })
  }

  const { data: children, error: childError } = await supabase
    .from('workshop_children')
    .select('*')

  if (childError) {
    console.error('Export error (children):', childError)
    return NextResponse.json({ error: 'Failed to fetch children data' }, { status: 500 })
  }

  const { data: workshops, error: workshopError } = await supabase
    .from('workshops')
    .select('id, title, date')

  if (workshopError) {
    console.error('Export error (workshops):', workshopError)
    return NextResponse.json({ error: 'Failed to fetch workshops' }, { status: 500 })
  }

  // Build workshop lookup
  const workshopMap = new Map(workshops?.map(w => [w.id, w]) || [])

  // Build children lookup
  const childrenByReg = new Map<string, typeof children>()
  children?.forEach(child => {
    const existing = childrenByReg.get(child.registration_id) || []
    existing.push(child)
    childrenByReg.set(child.registration_id, existing)
  })

  // CSV header
  const headers = [
    'Registration Date',
    'Parent Name',
    'Parent Email',
    'Parent Phone',
    'Children',
    'Workshops',
    'Status',
    'Payment Status',
    'Total',
    'Paid',
    'Payment Method',
    'Tuition Assistance',
    'How Heard',
    'Message',
    'Admin Notes',
  ]

  // CSV rows
  const rows = registrations.map(reg => {
    const regChildren = childrenByReg.get(reg.id) || []
    const childrenStr = regChildren
      .map(c => `${c.child_name} (${c.child_age})`)
      .join('; ')

    const workshopsStr = reg.workshop_ids
      .map((id: string) => {
        const w = workshopMap.get(id)
        return w ? `${w.title} (${w.date})` : id
      })
      .join('; ')

    return [
      new Date(reg.created_at).toLocaleDateString(),
      reg.parent_name,
      reg.parent_email,
      reg.parent_phone || '',
      childrenStr,
      workshopsStr,
      reg.status,
      reg.payment_status,
      reg.total_amount_cents ? `$${(reg.total_amount_cents / 100).toFixed(2)}` : '',
      `$${(reg.amount_paid_cents / 100).toFixed(2)}`,
      reg.payment_method || '',
      reg.tuition_assistance ? 'Yes' : 'No',
      reg.how_heard || '',
      reg.message || '',
      reg.admin_notes || '',
    ]
  })

  // Build CSV
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
  ].join('\n')

  // Return as downloadable file
  return new NextResponse(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="workshop-registrations-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
