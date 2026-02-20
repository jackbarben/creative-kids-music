'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCampRegistration } from './actions'
import { PROGRAMS, SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT } from '@/lib/constants'

interface ChildForm {
  id: string
  name: string
  age: string
  grade: string
  school: string
  tshirt_size: string
  allergies: string
  dietary_restrictions: string
  medical_conditions: string
  special_needs: string
}

const TSHIRT_SIZES = ['Youth S', 'Youth M', 'Youth L', 'Adult S', 'Adult M', 'Adult L']

function generateId() {
  return Math.random().toString(36).substr(2, 9)
}

function createEmptyChild(): ChildForm {
  return {
    id: generateId(),
    name: '',
    age: '',
    grade: '',
    school: '',
    tshirt_size: '',
    allergies: '',
    dietary_restrictions: '',
    medical_conditions: '',
    special_needs: '',
  }
}

export default function AdminCampRegistrationPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  // Form state
  const [parentFirstName, setParentFirstName] = useState('')
  const [parentLastName, setParentLastName] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPhone, setParentPhone] = useState('')
  const [parentRelationship, setParentRelationship] = useState('Mother')

  // Second parent
  const [showSecondParent, setShowSecondParent] = useState(false)
  const [parent2FirstName, setParent2FirstName] = useState('')
  const [parent2LastName, setParent2LastName] = useState('')
  const [parent2Email, setParent2Email] = useState('')
  const [parent2Phone, setParent2Phone] = useState('')
  const [parent2Relationship, setParent2Relationship] = useState('Father')

  // Emergency contact
  const [emergencyName, setEmergencyName] = useState('')
  const [emergencyPhone, setEmergencyPhone] = useState('')
  const [emergencyRelationship, setEmergencyRelationship] = useState('')

  // Children
  const [children, setChildren] = useState<ChildForm[]>([createEmptyChild()])

  // Admin options
  const [initialStatus, setInitialStatus] = useState<'pending' | 'confirmed'>('pending')
  const [initialPaymentStatus, setInitialPaymentStatus] = useState<'unpaid' | 'paid' | 'partial' | 'waived'>('unpaid')
  const [adminNotes, setAdminNotes] = useState('')

  // Consent
  const [mediaConsentInternal, setMediaConsentInternal] = useState(false)
  const [mediaConsentMarketing, setMediaConsentMarketing] = useState(false)

  // Calculate total
  const PRICE_CENTS = PROGRAMS.camp.price
  let totalCents = 0
  for (let i = 0; i < children.length; i++) {
    const discount = Math.min(i * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)
    totalCents += Math.max(0, PRICE_CENTS - discount)
  }

  const addChild = () => {
    setChildren([...children, createEmptyChild()])
  }

  const removeChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(c => c.id !== id))
    }
  }

  const updateChild = (id: string, field: keyof ChildForm, value: string) => {
    setChildren(children.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validate children
    const validChildren = children.filter(c => c.name.trim() && c.age)
    if (validChildren.length === 0) {
      setError('At least one child is required')
      return
    }

    startTransition(async () => {
      const result = await createCampRegistration({
        parent_first_name: parentFirstName,
        parent_last_name: parentLastName,
        parent_email: parentEmail,
        parent_phone: parentPhone,
        parent_relationship: parentRelationship,
        parent2_first_name: showSecondParent ? parent2FirstName : undefined,
        parent2_last_name: showSecondParent ? parent2LastName : undefined,
        parent2_email: showSecondParent ? parent2Email : undefined,
        parent2_phone: showSecondParent ? parent2Phone : undefined,
        parent2_relationship: showSecondParent ? parent2Relationship : undefined,
        emergency_name: emergencyName,
        emergency_phone: emergencyPhone,
        emergency_relationship: emergencyRelationship || undefined,
        children: validChildren.map(c => ({
          name: c.name,
          age: parseInt(c.age),
          grade: c.grade || undefined,
          school: c.school || undefined,
          tshirt_size: c.tshirt_size || undefined,
          allergies: c.allergies || undefined,
          dietary_restrictions: c.dietary_restrictions || undefined,
          medical_conditions: c.medical_conditions || undefined,
          special_needs: c.special_needs || undefined,
        })),
        initial_status: initialStatus,
        initial_payment_status: initialPaymentStatus,
        admin_notes: adminNotes || undefined,
        media_consent_internal: mediaConsentInternal,
        media_consent_marketing: mediaConsentMarketing,
      })

      if (result.error) {
        setError(result.error)
      } else if (result.registrationId) {
        router.push(`/admin/camp/${result.registrationId}`)
      }
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/admin/camp" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to Camp Registrations
        </Link>
      </div>

      <h1 className="font-display text-3xl font-semibold text-slate-800 mb-2">
        New Camp Registration
      </h1>
      <p className="text-slate-600 mb-8">
        Create a camp registration on behalf of a parent. A confirmation email will be sent automatically.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Parent Information */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
            Parent/Guardian Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                required
                value={parentFirstName}
                onChange={e => setParentFirstName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                required
                value={parentLastName}
                onChange={e => setParentLastName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={parentEmail}
                onChange={e => setParentEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={parentPhone}
                onChange={e => setParentPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Relationship *
              </label>
              <select
                required
                value={parentRelationship}
                onChange={e => setParentRelationship(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              >
                <option value="Mother">Mother</option>
                <option value="Father">Father</option>
                <option value="Guardian">Guardian</option>
                <option value="Grandparent">Grandparent</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Second Parent Toggle */}
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowSecondParent(!showSecondParent)}
              className="text-sm text-forest-600 hover:text-forest-700"
            >
              {showSecondParent ? '- Remove Second Parent' : '+ Add Second Parent/Guardian'}
            </button>
          </div>

          {showSecondParent && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <h3 className="text-sm font-medium text-slate-700 mb-3">Second Parent/Guardian</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={parent2FirstName}
                    onChange={e => setParent2FirstName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={parent2LastName}
                    onChange={e => setParent2LastName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={parent2Email}
                    onChange={e => setParent2Email(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={parent2Phone}
                    onChange={e => setParent2Phone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Relationship
                  </label>
                  <select
                    value={parent2Relationship}
                    onChange={e => setParent2Relationship(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                  >
                    <option value="Mother">Mother</option>
                    <option value="Father">Father</option>
                    <option value="Guardian">Guardian</option>
                    <option value="Grandparent">Grandparent</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Emergency Contact */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
            Emergency Contact *
          </h2>
          <p className="text-sm text-slate-500 mb-4">Required for camp registration.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={emergencyName}
                onChange={e => setEmergencyName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Phone *
              </label>
              <input
                type="tel"
                required
                value={emergencyPhone}
                onChange={e => setEmergencyPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Relationship
              </label>
              <input
                type="text"
                placeholder="e.g., Aunt, Neighbor"
                value={emergencyRelationship}
                onChange={e => setEmergencyRelationship(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
              />
            </div>
          </div>
        </section>

        {/* Children */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold text-slate-800">
              Children
            </h2>
            <button
              type="button"
              onClick={addChild}
              className="text-sm text-forest-600 hover:text-forest-700 font-medium"
            >
              + Add Child
            </button>
          </div>

          <div className="space-y-6">
            {children.map((child, index) => (
              <div key={child.id} className="border border-slate-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-slate-700">
                    Child {index + 1}
                    {index > 0 && (
                      <span className="ml-2 text-green-600 text-xs">
                        (${((Math.min(index * SIBLING_DISCOUNT, MAX_SIBLING_DISCOUNT)) / 100).toFixed(0)} sibling discount)
                      </span>
                    )}
                  </span>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeChild(child.id)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={child.name}
                      onChange={e => updateChild(child.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Age *
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max="18"
                      value={child.age}
                      onChange={e => updateChild(child.id, 'age', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Grade
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 5th"
                      value={child.grade}
                      onChange={e => updateChild(child.id, 'grade', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      School
                    </label>
                    <input
                      type="text"
                      value={child.school}
                      onChange={e => updateChild(child.id, 'school', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      T-Shirt Size
                    </label>
                    <select
                      value={child.tshirt_size}
                      onChange={e => updateChild(child.id, 'tshirt_size', e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                    >
                      <option value="">Select size...</option>
                      {TSHIRT_SIZES.map(size => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Medical Information */}
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700 mb-3">Medical Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Allergies
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Peanuts, bee stings"
                        value={child.allergies}
                        onChange={e => updateChild(child.id, 'allergies', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Dietary Restrictions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Vegetarian, gluten-free"
                        value={child.dietary_restrictions}
                        onChange={e => updateChild(child.id, 'dietary_restrictions', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Medical Conditions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Asthma, diabetes"
                        value={child.medical_conditions}
                        onChange={e => updateChild(child.id, 'medical_conditions', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Special Needs
                      </label>
                      <input
                        type="text"
                        placeholder="Accommodations needed"
                        value={child.special_needs}
                        onChange={e => updateChild(child.id, 'special_needs', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Media Consent */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
            Media Consent
          </h2>
          <div className="space-y-3">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={mediaConsentInternal}
                onChange={e => setMediaConsentInternal(e.target.checked)}
                className="mt-1 h-4 w-4 text-forest-600 focus:ring-forest-500 border-slate-300 rounded"
              />
              <span className="text-sm text-slate-700">
                <strong>Internal Use:</strong> Photos/videos for internal program documentation
              </span>
            </label>
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                checked={mediaConsentMarketing}
                onChange={e => setMediaConsentMarketing(e.target.checked)}
                className="mt-1 h-4 w-4 text-forest-600 focus:ring-forest-500 border-slate-300 rounded"
              />
              <span className="text-sm text-slate-700">
                <strong>Marketing Use:</strong> Photos/videos for website, social media, promotional materials
              </span>
            </label>
          </div>
        </section>

        {/* Admin Options */}
        <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h2 className="font-display text-xl font-semibold text-amber-800 mb-4">
            Admin Options
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Initial Status
              </label>
              <select
                value={initialStatus}
                onChange={e => setInitialStatus(e.target.value as 'pending' | 'confirmed')}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Initial Payment Status
              </label>
              <select
                value={initialPaymentStatus}
                onChange={e => setInitialPaymentStatus(e.target.value as 'unpaid' | 'paid' | 'partial' | 'waived')}
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="unpaid">Unpaid</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="waived">Waived</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-amber-800 mb-1">
                Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
                placeholder="Internal notes about this registration..."
                className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              />
            </div>
          </div>
        </section>

        {/* Summary & Submit */}
        <section className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-display text-xl font-semibold text-slate-800">
              Summary
            </h2>
            <span className="text-2xl font-bold text-forest-600">
              ${(totalCents / 100).toFixed(2)}
            </span>
          </div>
          <div className="text-sm text-slate-600 mb-6">
            <p>{PROGRAMS.camp.displayDates}</p>
            <p>{PROGRAMS.camp.time}</p>
            <p>{children.length} {children.length === 1 ? 'child' : 'children'}</p>
          </div>

          <div className="flex gap-4">
            <Link
              href="/admin/camp"
              className="px-6 py-3 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 px-6 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? 'Creating Registration...' : 'Create Registration'}
            </button>
          </div>
        </section>
      </form>
    </div>
  )
}
