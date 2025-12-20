import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = await createClient()

  // Check auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch registrations with children
  const { data: registrations } = await supabase
    .from('workshop_registrations')
    .select('*')
    .order('created_at', { ascending: false })

  const { data: children } = await supabase
    .from('workshop_children')
    .select('*')

  const { data: workshops } = await supabase
    .from('workshops')
    .select('id, title, date')

  if (!registrations) {
    return NextResponse.json({ error: 'No data' }, { status: 404 })
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
