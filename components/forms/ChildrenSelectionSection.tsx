'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import EditAccountChildModal from './EditAccountChildModal'

interface AccountChild {
  id: string
  first_name: string
  last_name: string
  date_of_birth?: string
  school?: string
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  notes?: string
}

interface SelectedChild {
  account_child_id?: string
  first_name: string
  last_name: string
  age: string
  school?: string
  allergies?: string
  dietary_restrictions?: string
  medical_conditions?: string
  notes?: string
  // Camp-specific
  tshirt_size?: string
  // For new children not from account
  isNew?: boolean
}

interface ChildrenSelectionSectionProps {
  userId?: string
  showGrade?: boolean
  showSchool?: boolean
  showMedical?: boolean
  showTshirtSize?: boolean
  basePrice: number
  siblingDiscount: number
  maxDiscount?: number
  onChildrenChange?: (children: SelectedChild[], total: number) => void
  fieldErrors?: Record<string, string>
}

export default function ChildrenSelectionSection({
  userId,
  showGrade = false,
  showSchool = false,
  showMedical = false,
  showTshirtSize = false,
  basePrice,
  siblingDiscount,
  maxDiscount = 30,
  onChildrenChange,
  fieldErrors,
}: ChildrenSelectionSectionProps) {
  const [accountChildren, setAccountChildren] = useState<AccountChild[]>([])
  const [selectedChildren, setSelectedChildren] = useState<SelectedChild[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddNew, setShowAddNew] = useState(false)
  const [editingChild, setEditingChild] = useState<AccountChild | null>(null)
  const [newChild, setNewChild] = useState<SelectedChild>({
    first_name: '',
    last_name: '',
    age: '',
    school: '',
    allergies: '',
    dietary_restrictions: '',
    medical_conditions: '',
    tshirt_size: '',
    isNew: true,
  })

  const supabase = createClient()

  // Fetch saved children from account
  const fetchAccountChildren = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    const { data } = await supabase
      .from('account_children')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true })

    setAccountChildren((data || []) as AccountChild[])
    setLoading(false)
  }, [supabase, userId])

  useEffect(() => {
    fetchAccountChildren()
  }, [fetchAccountChildren])

  // Calculate age from date of birth
  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Calculate total price
  const calculateTotal = useCallback((count: number) => {
    let total = 0
    for (let i = 0; i < count; i++) {
      const discount = Math.min(i * siblingDiscount, maxDiscount)
      total += Math.max(0, basePrice - discount)
    }
    return total
  }, [basePrice, siblingDiscount, maxDiscount])

  // Notify parent of changes
  useEffect(() => {
    if (onChildrenChange) {
      onChildrenChange(selectedChildren, calculateTotal(selectedChildren.length))
    }
  }, [selectedChildren, onChildrenChange, calculateTotal])

  // Toggle selection of an account child
  const toggleAccountChild = (child: AccountChild) => {
    const isSelected = selectedChildren.some(sc => sc.account_child_id === child.id)

    if (isSelected) {
      setSelectedChildren(prev => prev.filter(sc => sc.account_child_id !== child.id))
    } else {
      const age = child.date_of_birth ? calculateAge(child.date_of_birth).toString() : ''
      setSelectedChildren(prev => [...prev, {
        account_child_id: child.id,
        first_name: child.first_name,
        last_name: child.last_name,
        age,
        school: child.school || '',
        allergies: child.allergies || '',
        dietary_restrictions: child.dietary_restrictions || '',
        medical_conditions: child.medical_conditions || '',
        notes: child.notes || '',
        tshirt_size: '',
        isNew: false,
      }])
    }
  }

  // Handle child update from modal
  const handleChildUpdate = (updatedChild: AccountChild) => {
    // Update account children list
    setAccountChildren(prev => prev.map(c =>
      c.id === updatedChild.id ? updatedChild : c
    ))
    // Update selected children if this child is selected
    setSelectedChildren(prev => prev.map(sc => {
      if (sc.account_child_id === updatedChild.id) {
        const age = updatedChild.date_of_birth ? calculateAge(updatedChild.date_of_birth).toString() : sc.age
        return {
          ...sc,
          first_name: updatedChild.first_name,
          last_name: updatedChild.last_name,
          age,
          school: updatedChild.school || '',
          allergies: updatedChild.allergies || '',
          dietary_restrictions: updatedChild.dietary_restrictions || '',
          medical_conditions: updatedChild.medical_conditions || '',
          notes: updatedChild.notes || '',
        }
      }
      return sc
    }))
  }

  // Update a selected child's field
  const updateSelectedChild = (index: number, field: keyof SelectedChild, value: string) => {
    setSelectedChildren(prev => prev.map((child, i) =>
      i === index ? { ...child, [field]: value } : child
    ))
  }

  // Remove a selected child
  const removeSelectedChild = (index: number) => {
    setSelectedChildren(prev => prev.filter((_, i) => i !== index))
  }

  // Add new child
  const handleAddNewChild = () => {
    if (!newChild.first_name || !newChild.age) return

    setSelectedChildren(prev => [...prev, { ...newChild }])
    setNewChild({
      first_name: '',
      last_name: '',
      age: '',
      school: '',
      allergies: '',
      medical_conditions: '',
      tshirt_size: '',
      isNew: true,
    })
    setShowAddNew(false)
  }

  const getAgeWarning = (age: string) => {
    const ageNum = parseInt(age)
    if (isNaN(ageNum)) return null
    if (ageNum < 9) return 'This program is designed for ages 9-13. Younger children may find it challenging.'
    if (ageNum > 13) return 'This program is designed for ages 9-13. Older children may want a more advanced program.'
    return null
  }

  // If no user or still loading, show regular add form
  if (!userId || loading) {
    return (
      <div className="space-y-4">
        {loading && userId ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-400"></div>
          </div>
        ) : (
          <ChildInputForm
            child={selectedChildren[0] || newChild}
            index={0}
            showSchool={showSchool}
            showMedical={showMedical}
            showTshirtSize={showTshirtSize}
            showGrade={showGrade}
            fieldErrors={fieldErrors}
            onChange={(field, value) => {
              if (selectedChildren.length === 0) {
                setNewChild(prev => ({ ...prev, [field]: value }))
                if (field === 'first_name' && value) {
                  setSelectedChildren([{ ...newChild, [field]: value }])
                }
              } else {
                updateSelectedChild(0, field, value)
              }
            }}
            onRemove={selectedChildren.length > 1 ? () => removeSelectedChild(0) : undefined}
            siblingDiscount={siblingDiscount}
          />
        )}

        {/* Hidden fields for form submission */}
        <input type="hidden" name="child_count" value={selectedChildren.length || 1} />
        {selectedChildren.map((child, i) => (
          <div key={i}>
            <input type="hidden" name={`child_account_id_${i}`} value={child.account_child_id || ''} />
            <input type="hidden" name={`child_name_${i}`} value={`${child.first_name} ${child.last_name}`.trim()} />
            <input type="hidden" name={`child_age_${i}`} value={child.age} />
            <input type="hidden" name={`child_school_${i}`} value={child.school || ''} />
            <input type="hidden" name={`child_allergies_${i}`} value={child.allergies || ''} />
            <input type="hidden" name={`child_dietary_${i}`} value={child.dietary_restrictions || ''} />
            <input type="hidden" name={`child_medical_${i}`} value={child.medical_conditions || ''} />
            {showTshirtSize && <input type="hidden" name={`child_tshirt_size_${i}`} value={child.tshirt_size || ''} />}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Saved Children Selection */}
      {accountChildren.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-slate-600 font-medium">Select from your saved children:</p>
          <div className="grid gap-3">
            {accountChildren.map((child) => {
              const isSelected = selectedChildren.some(sc => sc.account_child_id === child.id)
              return (
                <label
                  key={child.id}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    isSelected
                      ? 'border-forest-500 bg-forest-50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleAccountChild(child)}
                    className="h-5 w-5 rounded border-slate-300 text-forest-600 focus:ring-forest-500"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">
                      {child.first_name} {child.last_name}
                    </p>
                    {child.school && (
                      <p className="text-sm text-slate-500">{child.school}</p>
                    )}
                  </div>
                  {child.allergies && (
                    <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded">
                      Allergies noted
                    </span>
                  )}
                </label>
              )
            })}
          </div>
        </div>
      )}

      {/* Selected Children Details */}
      {selectedChildren.length > 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 font-medium">
            {selectedChildren.length === 1 ? 'Child details:' : `${selectedChildren.length} children selected:`}
          </p>

          {selectedChildren.map((child, index) => {
            const ageWarning = getAgeWarning(child.age)
            const discount = Math.min(index * siblingDiscount, maxDiscount)

            return (
              <div
                key={child.account_child_id || `new-${index}`}
                className="p-4 bg-cream-100 rounded-lg border border-stone-200"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-slate-800">
                    {child.first_name} {child.last_name}
                    {index > 0 && (
                      <span className="ml-2 text-sm text-forest-600 font-normal">
                        (${discount} sibling discount)
                      </span>
                    )}
                  </h4>
                  <button
                    type="button"
                    onClick={() => removeSelectedChild(index)}
                    className="text-sm text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Age - always required */}
                  <div>
                    <label className="block text-sm font-medium text-stone-700 mb-1">
                      Age <span className="text-terracotta-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={child.age}
                      onChange={(e) => updateSelectedChild(index, 'age', e.target.value)}
                      min={1}
                      max={18}
                      required
                      className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                    />
                    {ageWarning && (
                      <p className="mt-1 text-xs text-amber-600">{ageWarning}</p>
                    )}
                    {fieldErrors?.[`child_age_${index}`] && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors[`child_age_${index}`]}</p>
                    )}
                  </div>

                  {/* T-shirt size for camp */}
                  {showTshirtSize && (
                    <div>
                      <label className="block text-sm font-medium text-stone-700 mb-1">
                        T-Shirt Size <span className="text-terracotta-500">*</span>
                      </label>
                      <select
                        value={child.tshirt_size || ''}
                        onChange={(e) => updateSelectedChild(index, 'tshirt_size', e.target.value)}
                        required
                        className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                      >
                        <option value="">Select size</option>
                        <option value="YS">Youth Small</option>
                        <option value="YM">Youth Medium</option>
                        <option value="YL">Youth Large</option>
                        <option value="AS">Adult Small</option>
                        <option value="AM">Adult Medium</option>
                        <option value="AL">Adult Large</option>
                      </select>
                      {fieldErrors?.[`child_tshirt_size_${index}`] && (
                        <p className="mt-1 text-xs text-red-600">{fieldErrors[`child_tshirt_size_${index}`]}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Show stored info from account with edit option */}
                {child.account_child_id && (
                  <div className="mt-3 pt-3 border-t border-stone-200">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-slate-500">From your saved info:</p>
                      <button
                        type="button"
                        onClick={() => {
                          const accountChild = accountChildren.find(ac => ac.id === child.account_child_id)
                          if (accountChild) setEditingChild(accountChild)
                        }}
                        className="flex items-center gap-1 text-xs text-forest-600 hover:text-forest-700"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      {child.school && (
                        <p className="text-slate-600"><span className="text-slate-400">School:</span> {child.school}</p>
                      )}
                      {child.allergies && (
                        <p className="text-slate-600"><span className="text-slate-400">Allergies:</span> {child.allergies}</p>
                      )}
                      {child.dietary_restrictions && (
                        <p className="text-slate-600"><span className="text-slate-400">Dietary:</span> {child.dietary_restrictions}</p>
                      )}
                      {child.medical_conditions && (
                        <p className="text-slate-600"><span className="text-slate-400">Medical:</span> {child.medical_conditions}</p>
                      )}
                      {child.notes && (
                        <p className="text-slate-600 col-span-2"><span className="text-slate-400">Notes:</span> {child.notes}</p>
                      )}
                    </div>
                    {!child.school && !child.allergies && !child.dietary_restrictions && !child.medical_conditions && !child.notes && (
                      <p className="text-sm text-slate-400 italic">No additional info saved</p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add New Child Section */}
      {!showAddNew ? (
        <button
          type="button"
          onClick={() => setShowAddNew(true)}
          className="flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {accountChildren.length > 0 || selectedChildren.length > 0
            ? 'Add another child'
            : 'Add a child'}
        </button>
      ) : (
        <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-slate-800">Add New Child</h4>
            <button
              type="button"
              onClick={() => setShowAddNew(false)}
              className="text-sm text-slate-500 hover:text-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                First Name <span className="text-terracotta-500">*</span>
              </label>
              <input
                type="text"
                value={newChild.first_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, first_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                value={newChild.last_name}
                onChange={(e) => setNewChild(prev => ({ ...prev, last_name: e.target.value }))}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Age <span className="text-terracotta-500">*</span>
              </label>
              <input
                type="number"
                value={newChild.age}
                onChange={(e) => setNewChild(prev => ({ ...prev, age: e.target.value }))}
                min={1}
                max={18}
                className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
              />
            </div>
            {showSchool && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  School
                </label>
                <input
                  type="text"
                  value={newChild.school || ''}
                  onChange={(e) => setNewChild(prev => ({ ...prev, school: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
              </div>
            )}
            {showTshirtSize && (
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  T-Shirt Size <span className="text-terracotta-500">*</span>
                </label>
                <select
                  value={newChild.tshirt_size || ''}
                  onChange={(e) => setNewChild(prev => ({ ...prev, tshirt_size: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                >
                  <option value="">Select size</option>
                  <option value="YS">Youth Small</option>
                  <option value="YM">Youth Medium</option>
                  <option value="YL">Youth Large</option>
                  <option value="AS">Adult Small</option>
                  <option value="AM">Adult Medium</option>
                  <option value="AL">Adult Large</option>
                </select>
              </div>
            )}
          </div>

          {showMedical && (
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Allergies
                </label>
                <input
                  type="text"
                  value={newChild.allergies || ''}
                  onChange={(e) => setNewChild(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="Food, environmental, or other allergies"
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Dietary Restrictions
                </label>
                <input
                  type="text"
                  value={newChild.dietary_restrictions || ''}
                  onChange={(e) => setNewChild(prev => ({ ...prev, dietary_restrictions: e.target.value }))}
                  placeholder="Vegetarian, gluten-free, kosher, etc."
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-stone-700 mb-1">
                  Medical Conditions
                </label>
                <input
                  type="text"
                  value={newChild.medical_conditions || ''}
                  onChange={(e) => setNewChild(prev => ({ ...prev, medical_conditions: e.target.value }))}
                  placeholder="Any conditions we should know about"
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleAddNewChild}
            disabled={!newChild.first_name || !newChild.age}
            className="px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Child
          </button>
        </div>
      )}

      {/* Hidden fields for form submission */}
      <input type="hidden" name="child_count" value={selectedChildren.length} />
      {selectedChildren.map((child, i) => (
        <div key={i}>
          <input type="hidden" name={`child_account_id_${i}`} value={child.account_child_id || ''} />
          <input type="hidden" name={`child_name_${i}`} value={`${child.first_name} ${child.last_name}`.trim()} />
          <input type="hidden" name={`child_age_${i}`} value={child.age} />
          <input type="hidden" name={`child_school_${i}`} value={child.school || ''} />
          <input type="hidden" name={`child_allergies_${i}`} value={child.allergies || ''} />
          <input type="hidden" name={`child_dietary_${i}`} value={child.dietary_restrictions || ''} />
          <input type="hidden" name={`child_medical_${i}`} value={child.medical_conditions || ''} />
          {showTshirtSize && <input type="hidden" name={`child_tshirt_size_${i}`} value={child.tshirt_size || ''} />}
        </div>
      ))}

      {/* Validation message if no children selected */}
      {selectedChildren.length === 0 && accountChildren.length > 0 && (
        <p className="text-sm text-amber-600">Please select at least one child or add a new one.</p>
      )}

      {/* Edit Child Modal */}
      {editingChild && (
        <EditAccountChildModal
          isOpen={!!editingChild}
          onClose={() => setEditingChild(null)}
          child={editingChild}
          onUpdate={handleChildUpdate}
        />
      )}
    </div>
  )
}

// Simple child input form for non-logged-in users
function ChildInputForm({
  child,
  index,
  showSchool,
  showMedical,
  showTshirtSize,
  showGrade,
  fieldErrors,
  onChange,
  onRemove,
  siblingDiscount,
}: {
  child: SelectedChild
  index: number
  showSchool: boolean
  showMedical: boolean
  showTshirtSize: boolean
  showGrade: boolean
  fieldErrors?: Record<string, string>
  onChange: (field: keyof SelectedChild, value: string) => void
  onRemove?: () => void
  siblingDiscount: number
}) {
  const ageWarning = child.age ? (() => {
    const ageNum = parseInt(child.age)
    if (isNaN(ageNum)) return null
    if (ageNum < 9) return 'This program is designed for ages 9-13. Younger children may find it challenging.'
    if (ageNum > 13) return 'This program is designed for ages 9-13. Older children may want a more advanced program.'
    return null
  })() : null

  return (
    <div className="relative p-6 bg-cream-100 rounded-lg border border-stone-200">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors"
          aria-label="Remove child"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <h3 className="text-sm font-medium text-stone-600 mb-4">
        Child Information
        {index > 0 && (
          <span className="ml-2 text-forest-600 font-normal">
            (${siblingDiscount * index} sibling discount)
          </span>
        )}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Child&apos;s name <span className="text-terracotta-500">*</span>
          </label>
          <input
            type="text"
            name={`child_name_${index}`}
            required
            value={`${child.first_name} ${child.last_name}`.trim()}
            onChange={(e) => {
              const parts = e.target.value.split(' ')
              onChange('first_name', parts[0] || '')
              onChange('last_name', parts.slice(1).join(' ') || '')
            }}
            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
          />
          {fieldErrors?.[`child_name_${index}`] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors[`child_name_${index}`]}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">
            Age <span className="text-terracotta-500">*</span>
          </label>
          <input
            type="number"
            name={`child_age_${index}`}
            required
            min={1}
            max={18}
            value={child.age}
            onChange={(e) => onChange('age', e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
          />
          {ageWarning && (
            <p className="mt-1 text-xs text-amber-600">{ageWarning}</p>
          )}
          {fieldErrors?.[`child_age_${index}`] && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors[`child_age_${index}`]}</p>
          )}
        </div>

        {showSchool && (
          <div className={showGrade ? '' : 'md:col-span-2'}>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              School
            </label>
            <input
              type="text"
              name={`child_school_${index}`}
              value={child.school || ''}
              onChange={(e) => onChange('school', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
            />
          </div>
        )}

        {showTshirtSize && (
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              T-Shirt Size <span className="text-terracotta-500">*</span>
            </label>
            <select
              name={`child_tshirt_size_${index}`}
              required
              value={child.tshirt_size || ''}
              onChange={(e) => onChange('tshirt_size', e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
            >
              <option value="">Select size</option>
              <option value="YS">Youth Small</option>
              <option value="YM">Youth Medium</option>
              <option value="YL">Youth Large</option>
              <option value="AS">Adult Small</option>
              <option value="AM">Adult Medium</option>
              <option value="AL">Adult Large</option>
            </select>
            {fieldErrors?.[`child_tshirt_size_${index}`] && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors[`child_tshirt_size_${index}`]}</p>
            )}
          </div>
        )}
      </div>

      {showMedical && (
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Allergies
            </label>
            <textarea
              name={`child_allergies_${index}`}
              rows={2}
              value={child.allergies || ''}
              onChange={(e) => onChange('allergies', e.target.value)}
              placeholder="Food, environmental, or other allergies"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Dietary Restrictions
            </label>
            <textarea
              name={`child_dietary_${index}`}
              rows={2}
              value={child.dietary_restrictions || ''}
              onChange={(e) => onChange('dietary_restrictions', e.target.value)}
              placeholder="Vegetarian, gluten-free, kosher, etc."
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800 resize-y"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-1">
              Medical conditions / medications
            </label>
            <textarea
              name={`child_medical_${index}`}
              rows={2}
              value={child.medical_conditions || ''}
              onChange={(e) => onChange('medical_conditions', e.target.value)}
              placeholder="Any conditions or medications we should know about"
              className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800 resize-y"
            />
          </div>
        </div>
      )}
    </div>
  )
}
