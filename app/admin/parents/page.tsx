import Link from 'next/link'
import { searchParents, getAllParents, getWorkshops, type ParentSearchResult } from '@/lib/data'
import type { Workshop, WorkshopChild, CampChild } from '@/lib/database.types'
import ParentSearch from './ParentSearch'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams: Promise<{ q?: string; medical?: string }>
}

// Helper to check if a family has medical info
function hasMedicalInfo(parent: ParentSearchResult): boolean {
  return parent.campChildren.some(
    c => c.allergies || c.dietary_restrictions || c.medical_conditions || c.special_needs
  )
}

export default async function ParentsAdmin({ searchParams }: PageProps) {
  const params = await searchParams
  const query = params.q || ''
  const medicalFilter = params.medical === '1'

  // Always get all parents for the directory
  const [allParents, searchResults, workshops] = await Promise.all([
    getAllParents(),
    query ? searchParents(query) : Promise.resolve([]),
    getWorkshops(),
  ])
  const workshopMap = new Map(workshops.map(w => [w.id, w]))

  // Apply medical filter to directory
  const filteredParents = medicalFilter
    ? allParents.filter(hasMedicalInfo)
    : allParents

  // If searching and got exactly one result, show detail view
  const showingDetail = query && searchResults.length === 1

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin"
          className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
        >
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold text-stone-800">
          Families
        </h1>
        <p className="text-stone-500">
          Search for a family or select from the directory below.
        </p>
      </div>

      {/* Search */}
      <ParentSearch initialQuery={query} initialMedicalFilter={medicalFilter} />

      {/* Search Results */}
      {query && (
        <div className="space-y-6">
          {searchResults.length === 0 ? (
            <NoResults query={query} />
          ) : searchResults.length === 1 ? (
            <ParentDetail parent={searchResults[0]} workshopMap={workshopMap} />
          ) : (
            <ParentList parents={searchResults} title={`${searchResults.length} results for "${query}"`} />
          )}
        </div>
      )}

      {/* Full Directory (hide when showing detail view) */}
      {!showingDetail && (
        <ParentDirectory parents={filteredParents} medicalFilter={medicalFilter} />
      )}
    </div>
  )
}

function NoResults({ query }: { query: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 p-12 text-center">
      <svg className="w-12 h-12 text-stone-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      <p className="text-stone-600 font-medium mb-1">No parent found</p>
      <p className="text-stone-500 text-sm">No registrations found for &quot;{query}&quot;</p>
    </div>
  )
}

function ParentList({ parents, title }: { parents: ParentSearchResult[]; title?: string }) {
  return (
    <div className="bg-white rounded-xl border border-stone-200 divide-y divide-stone-100">
      <div className="px-6 py-3 bg-stone-50 rounded-t-xl">
        <p className="text-sm text-stone-600">{title || `${parents.length} parents found`}</p>
      </div>
      {parents.map((parent) => {
        const totalRegs = parent.workshopRegistrations.length + parent.campRegistrations.length + parent.waitlistSignups.length
        return (
          <Link
            key={parent.email}
            href={`/admin/parents?q=${encodeURIComponent(parent.email)}`}
            className="flex items-center justify-between px-6 py-4 hover:bg-stone-50 transition-colors"
          >
            <div>
              <p className="font-medium text-stone-800">{parent.name}</p>
              <p className="text-sm text-stone-500">{parent.email}</p>
            </div>
            <div className="text-sm text-stone-500">
              {totalRegs} registration{totalRegs !== 1 ? 's' : ''}
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function ParentDirectory({ parents, medicalFilter }: { parents: ParentSearchResult[]; medicalFilter: boolean }) {
  if (parents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-stone-200 p-8 text-center">
        <p className="text-stone-500">
          {medicalFilter
            ? 'No families with medical info found.'
            : 'No families registered yet.'}
        </p>
      </div>
    )
  }

  // Group parents by first letter of name
  const grouped = parents.reduce((acc, parent) => {
    const letter = parent.name.charAt(0).toUpperCase()
    if (!acc[letter]) acc[letter] = []
    acc[letter].push(parent)
    return acc
  }, {} as Record<string, ParentSearchResult[]>)

  const letters = Object.keys(grouped).sort()

  return (
    <div className="bg-white rounded-xl border border-stone-200">
      <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
        <h2 className="font-display font-bold text-stone-800">
          {medicalFilter ? 'Families with Medical Info' : 'All Families'} ({parents.length})
        </h2>
        {medicalFilter && (
          <span className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded-full">
            Filtered
          </span>
        )}
      </div>
      <div className="divide-y divide-stone-100">
        {letters.map((letter) => (
          <div key={letter}>
            <div className="px-6 py-2 bg-stone-50 sticky top-0">
              <span className="font-bold text-forest-600">{letter}</span>
            </div>
            {grouped[letter].map((parent) => {
              const totalRegs = parent.workshopRegistrations.length + parent.campRegistrations.length + parent.waitlistSignups.length
              // Count unique children
              const uniqueChildNames = new Set([
                ...parent.workshopChildren.map(c => c.child_name.toLowerCase()),
                ...parent.campChildren.map(c => c.child_name.toLowerCase())
              ])
              const childCount = uniqueChildNames.size
              return (
                <Link
                  key={parent.email}
                  href={`/admin/parents?q=${encodeURIComponent(parent.email)}`}
                  className="flex items-center justify-between px-6 py-3 hover:bg-stone-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-stone-800">{parent.name}</p>
                    <p className="text-sm text-stone-500">{parent.email}</p>
                  </div>
                  <div className="text-sm text-stone-500 text-right">
                    <p>{totalRegs} reg{totalRegs !== 1 ? 's' : ''}</p>
                    {childCount > 0 && (
                      <p className="text-xs text-stone-400">{childCount} child{childCount !== 1 ? 'ren' : ''}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

function ParentDetail({ parent, workshopMap }: { parent: ParentSearchResult; workshopMap: Map<string, Workshop> }) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatCents = (cents: number | null) => {
    if (cents === null) return '-'
    return `$${(cents / 100).toFixed(2)}`
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-amber-100 text-amber-800',
      confirmed: 'bg-green-100 text-green-800',
      waitlist: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-stone-100 text-stone-500',
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-amber-100 text-amber-800',
      converted: 'bg-green-100 text-green-800',
    }
    return styles[status] || 'bg-stone-100 text-stone-600'
  }

  const getPaymentBadge = (status: string) => {
    const styles: Record<string, string> = {
      unpaid: 'bg-red-100 text-red-800',
      paid: 'bg-green-100 text-green-800',
      partial: 'bg-amber-100 text-amber-800',
      waived: 'bg-blue-100 text-blue-800',
    }
    return styles[status] || 'bg-stone-100 text-stone-600'
  }

  // Calculate summary stats
  const totalRegistrations = parent.workshopRegistrations.length + parent.campRegistrations.length
  const uniqueChildNames = new Set([
    ...parent.workshopChildren.map(c => c.child_name),
    ...parent.campChildren.map(c => c.child_name)
  ])
  const totalChildren = uniqueChildNames.size

  const totalAmount =
    parent.workshopRegistrations.reduce((sum, r) => sum + (r.total_amount_cents || 0), 0) +
    parent.campRegistrations.reduce((sum, r) => sum + (r.total_amount_cents || 0), 0)

  const totalPaid =
    parent.workshopRegistrations.reduce((sum, r) => sum + (r.amount_paid_cents || 0), 0) +
    parent.campRegistrations.reduce((sum, r) => sum + (r.amount_paid_cents || 0), 0)

  return (
    <div className="space-y-6">
      {/* Family Header */}
      <div className="bg-white rounded-xl border border-stone-200 p-6">
        <h2 className="font-display text-xl font-bold text-stone-800">{parent.name}</h2>
        <p className="text-stone-500">
          {parent.email}
          {parent.phone && <> &middot; {parent.phone}</>}
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-stone-600">
          <span>{totalRegistrations} registration{totalRegistrations !== 1 ? 's' : ''}</span>
          <span>&middot;</span>
          <span>{totalChildren} child{totalChildren !== 1 ? 'ren' : ''}</span>
          <span>&middot;</span>
          <span>{formatCents(totalAmount)} total</span>
          {totalPaid < totalAmount && (
            <>
              <span>&middot;</span>
              <span className="text-amber-600">{formatCents(totalAmount - totalPaid)} outstanding</span>
            </>
          )}
        </div>

        {/* Family Members */}
        {parent.familyMembers.length > 1 && (
          <div className="mt-4 pt-4 border-t border-stone-100">
            <p className="text-sm font-medium text-stone-600 mb-2">Family Members</p>
            <div className="flex flex-wrap gap-2">
              {parent.familyMembers.map((member) => (
                <span
                  key={member.email}
                  className={`text-xs px-2 py-1 rounded-full ${
                    member.email === parent.email
                      ? 'bg-forest-100 text-forest-700'
                      : member.joined_at
                      ? 'bg-stone-100 text-stone-600'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {member.email}
                  {!member.joined_at && ' (pending)'}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Children Section - shows all children with medical info */}
      <ChildrenSection
        workshopChildren={parent.workshopChildren}
        campChildren={parent.campChildren}
      />

      {/* Management Note */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium">To manage a registration:</p>
        <p className="mt-1">Click &ldquo;View →&rdquo; on any registration below to update status, payment, or add notes.</p>
      </div>

      {/* Workshop Registrations */}
      {parent.workshopRegistrations.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-display font-bold text-stone-800">
              Workshop Registrations ({parent.workshopRegistrations.length})
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {parent.workshopRegistrations.map((reg) => {
              const children = parent.workshopChildren.filter(c => c.registration_id === reg.id)
              return (
                <div key={reg.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm text-stone-500">Registered {formatDate(reg.created_at)}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(reg.status)}`}>
                          {reg.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentBadge(reg.payment_status)}`}>
                          {reg.payment_status}
                        </span>
                        <span className="text-sm text-stone-600">{formatCents(reg.total_amount_cents)}</span>
                      </div>
                      {children.length > 0 && (
                        <p className="text-sm text-stone-600 mt-2">
                          Children: {children.map(c => `${c.child_name} (${c.child_age})`).join(', ')}
                        </p>
                      )}
                      <div className="mt-2 text-sm text-stone-500">
                        Workshops: {reg.workshop_ids.map(id => {
                          const w = workshopMap.get(id)
                          return w ? formatDate(w.date) : id
                        }).join(', ')}
                      </div>
                    </div>
                    <Link
                      href={`/admin/workshops/${reg.id}`}
                      className="text-forest-600 hover:text-forest-700 text-sm font-medium"
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Camp Registrations */}
      {parent.campRegistrations.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-display font-bold text-stone-800">
              Summer Camp ({parent.campRegistrations.length})
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {parent.campRegistrations.map((reg) => {
              const children = parent.campChildren.filter(c => c.registration_id === reg.id)
              return (
                <div key={reg.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-stone-800">Summer Camp 2026</p>
                      <p className="text-sm text-stone-500">Registered {formatDate(reg.created_at)}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(reg.status)}`}>
                          {reg.status}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${getPaymentBadge(reg.payment_status)}`}>
                          {reg.payment_status}
                        </span>
                        <span className="text-sm text-stone-600">{formatCents(reg.total_amount_cents)}</span>
                      </div>
                      {children.length > 0 && (
                        <p className="text-sm text-stone-600 mt-2">
                          Children: {children.map(c => `${c.child_name} (${c.child_age})`).join(', ')}
                        </p>
                      )}
                      <p className="mt-2 text-sm text-stone-500">August 3–7, 2026</p>
                    </div>
                    <Link
                      href={`/admin/camp/${reg.id}`}
                      className="text-forest-600 hover:text-forest-700 text-sm font-medium"
                    >
                      View &rarr;
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Waitlist Signups */}
      {parent.waitlistSignups.length > 0 && (
        <div className="bg-white rounded-xl border border-stone-200">
          <div className="px-6 py-4 border-b border-stone-100">
            <h3 className="font-display font-bold text-stone-800">
              Music School Waitlist
            </h3>
          </div>
          <div className="divide-y divide-stone-100">
            {parent.waitlistSignups.map((signup) => (
              <div key={signup.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-stone-500">Signed up {formatDate(signup.created_at)}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusBadge(signup.status)}`}>
                        {signup.status}
                      </span>
                      <span className="text-sm text-stone-600">
                        {signup.num_children} child{signup.num_children !== 1 ? 'ren' : ''} interested
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/admin/waitlist/${signup.id}`}
                    className="text-forest-600 hover:text-forest-700 text-sm font-medium"
                  >
                    View &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ChildrenSection({
  workshopChildren,
  campChildren,
}: {
  workshopChildren: WorkshopChild[]
  campChildren: CampChild[]
}) {
  // Combine and deduplicate children by name (prefer camp data as it has medical info)
  const childrenMap = new Map<string, {
    name: string
    age: number
    school: string | null
    programs: string[]
    // Medical info (from camp)
    allergies: string | null
    dietary_restrictions: string | null
    medical_conditions: string | null
    special_needs: string | null
  }>()

  // Add workshop children first
  for (const child of workshopChildren) {
    const key = child.child_name.toLowerCase()
    if (!childrenMap.has(key)) {
      childrenMap.set(key, {
        name: child.child_name,
        age: child.child_age,
        school: child.child_school,
        programs: ['Workshop'],
        allergies: null,
        dietary_restrictions: null,
        medical_conditions: null,
        special_needs: null,
      })
    } else {
      const existing = childrenMap.get(key)!
      if (!existing.programs.includes('Workshop')) {
        existing.programs.push('Workshop')
      }
    }
  }

  // Add/update with camp children (has medical info)
  for (const child of campChildren) {
    const key = child.child_name.toLowerCase()
    if (!childrenMap.has(key)) {
      childrenMap.set(key, {
        name: child.child_name,
        age: child.child_age,
        school: child.child_school,
        programs: ['Camp'],
        allergies: child.allergies,
        dietary_restrictions: child.dietary_restrictions,
        medical_conditions: child.medical_conditions,
        special_needs: child.special_needs,
      })
    } else {
      const existing = childrenMap.get(key)!
      if (!existing.programs.includes('Camp')) {
        existing.programs.push('Camp')
      }
      // Update with medical info from camp
      existing.allergies = child.allergies
      existing.dietary_restrictions = child.dietary_restrictions
      existing.medical_conditions = child.medical_conditions
      existing.special_needs = child.special_needs
    }
  }

  const children = Array.from(childrenMap.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  )

  // Show debug info if no children (helps troubleshoot)
  if (children.length === 0) {
    return (
      <div className="bg-stone-50 rounded-xl border border-stone-200 p-6">
        <p className="text-sm text-stone-500">
          No children data loaded. (Workshop: {workshopChildren.length}, Camp: {campChildren.length})
        </p>
      </div>
    )
  }

  const hasMedicalInfo = children.some(
    c => c.allergies || c.dietary_restrictions || c.medical_conditions || c.special_needs
  )

  return (
    <div className={`bg-white rounded-xl border ${hasMedicalInfo ? 'border-red-200' : 'border-stone-200'}`}>
      <div className={`px-6 py-4 border-b ${hasMedicalInfo ? 'border-red-100 bg-red-50' : 'border-stone-100'} flex items-center justify-between rounded-t-xl`}>
        <h3 className="font-display font-bold text-stone-800">
          Children ({children.length})
        </h3>
        {hasMedicalInfo && (
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full font-medium">
            ⚠️ Has Medical Info
          </span>
        )}
      </div>
      <div className="divide-y divide-stone-100">
        {children.map((child) => {
          const hasInfo = child.allergies || child.dietary_restrictions || child.medical_conditions || child.special_needs
          return (
            <div key={child.name} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-stone-800">{child.name}</p>
                  <p className="text-sm text-stone-500">
                    Age {child.age}
                    {child.school && <> &middot; {child.school}</>}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {child.programs.map((program) => (
                      <span
                        key={program}
                        className="text-xs px-2 py-0.5 rounded-full bg-forest-50 text-forest-700"
                      >
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Medical Info - prominently displayed */}
              {hasInfo ? (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg space-y-2">
                  {child.allergies && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-medium shrink-0">
                        Allergies
                      </span>
                      <span className="text-sm text-stone-700 font-medium">{child.allergies}</span>
                    </div>
                  )}
                  {child.dietary_restrictions && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-blue-200 text-blue-900 font-medium shrink-0">
                        Dietary
                      </span>
                      <span className="text-sm text-stone-700">{child.dietary_restrictions}</span>
                    </div>
                  )}
                  {child.medical_conditions && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-red-200 text-red-900 font-medium shrink-0">
                        Medical
                      </span>
                      <span className="text-sm text-stone-700 font-medium">{child.medical_conditions}</span>
                    </div>
                  )}
                  {child.special_needs && (
                    <div className="flex items-start gap-2">
                      <span className="text-xs px-2 py-0.5 rounded bg-purple-200 text-purple-900 font-medium shrink-0">
                        Special Needs
                      </span>
                      <span className="text-sm text-stone-700">{child.special_needs}</span>
                    </div>
                  )}
                </div>
              ) : (
                <p className="mt-3 text-xs text-stone-400">No medical info on file</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
