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
    .from('camp_registrations')
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
    .from('camp_children')
    .select('*')

  if (childError) {
    console.error('Export error (children):', childError)
    return NextResponse.json({ error: 'Failed to fetch children data' }, { status: 500 })
  }

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
    'Emergency Contact',
    'Emergency Phone',
    'Emergency Relationship',
    'Children',
    'Allergies',
    'Medical Conditions',
    'Special Needs',
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
      .map(c => `${c.child_name} (${c.child_age}${c.child_grade ? `, ${c.child_grade}` : ''})`)
      .join('; ')

    const allergiesStr = regChildren
      .filter(c => c.allergies)
      .map(c => `${c.child_name}: ${c.allergies}`)
      .join('; ')

    const medicalStr = regChildren
      .filter(c => c.medical_conditions)
      .map(c => `${c.child_name}: ${c.medical_conditions}`)
      .join('; ')

    const specialStr = regChildren
      .filter(c => c.special_needs)
      .map(c => `${c.child_name}: ${c.special_needs}`)
      .join('; ')

    return [
      new Date(reg.created_at).toLocaleDateString(),
      reg.parent_name,
      reg.parent_email,
      reg.parent_phone,
      reg.emergency_name,
      reg.emergency_phone,
      reg.emergency_relationship || '',
      childrenStr,
      allergiesStr,
      medicalStr,
      specialStr,
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
      'Content-Disposition': `attachment; filename="camp-registrations-${new Date().toISOString().split('T')[0]}.csv"`,
    },
  })
}
