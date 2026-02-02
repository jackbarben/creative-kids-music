'use client'

import { useState } from 'react'
import type { SelectedChild } from './ChildrenSelectionSection'

interface ChildData {
  name: string
  age: string
  grade?: string
  school?: string
  allergies?: string
  dietary?: string
  medical?: string
  special?: string
  tshirtSize?: string
}

interface ChildFieldsProps {
  showGrade?: boolean
  showSchool?: boolean
  showMedical?: boolean
  showTshirtSize?: boolean
  basePrice: number
  siblingDiscount: number
  onTotalChange?: (total: number, count: number) => void
  onChildrenChange?: (children: SelectedChild[]) => void
}

function convertToSelectedChildren(childDataArray: ChildData[]): SelectedChild[] {
  return childDataArray
    .filter(child => child.name || child.age)
    .map(child => {
      const nameParts = child.name.trim().split(/\s+/)
      return {
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || '',
        age: child.age,
        school: child.school || '',
        allergies: child.allergies || '',
        dietary_restrictions: child.dietary || '',
        medical_conditions: child.medical || '',
        notes: child.special || '',
        tshirt_size: child.tshirtSize || '',
        isNew: true,
      }
    })
}

export default function ChildFields({
  showGrade = false,
  showSchool = false,
  showMedical = false,
  showTshirtSize = false,
  basePrice,
  siblingDiscount,
  onTotalChange,
  onChildrenChange,
}: ChildFieldsProps) {
  const [children, setChildren] = useState<ChildData[]>([
    { name: '', age: '', grade: '', school: '', allergies: '', dietary: '', medical: '', special: '', tshirtSize: '' }
  ])

  const addChild = () => {
    const newChildren = [...children, { name: '', age: '', grade: '', school: '', allergies: '', dietary: '', medical: '', special: '', tshirtSize: '' }]
    setChildren(newChildren)
    if (onTotalChange) {
      onTotalChange(calculateTotal(newChildren.length), newChildren.length)
    }
    onChildrenChange?.(convertToSelectedChildren(newChildren))
  }

  const removeChild = (index: number) => {
    if (children.length > 1) {
      const newChildren = children.filter((_, i) => i !== index)
      setChildren(newChildren)
      if (onTotalChange) {
        onTotalChange(calculateTotal(newChildren.length), newChildren.length)
      }
      onChildrenChange?.(convertToSelectedChildren(newChildren))
    }
  }

  const updateChild = (index: number, field: keyof ChildData, value: string) => {
    const newChildren = [...children]
    newChildren[index] = { ...newChildren[index], [field]: value }
    setChildren(newChildren)
    onChildrenChange?.(convertToSelectedChildren(newChildren))
  }

  const calculateTotal = (count: number) => {
    let total = 0
    for (let i = 0; i < count; i++) {
      // First child: full price, subsequent children get increasing discount
      const discount = i * siblingDiscount
      total += Math.max(0, basePrice - discount)
    }
    return total
  }

  const getAgeWarning = (age: string) => {
    const ageNum = parseInt(age)
    if (isNaN(ageNum)) return null
    if (ageNum < 9) return 'This program is designed for ages 9-13. Younger children may find it challenging.'
    if (ageNum > 13) return 'This program is designed for ages 9-13. Older children may want a more advanced program.'
    return null
  }

  return (
    <div className="space-y-6">
      {children.map((child, index) => {
        const ageWarning = getAgeWarning(child.age)
        return (
          <div key={index} className="relative p-6 bg-cream-100 rounded-lg border border-stone-200">
            {children.length > 1 && (
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="absolute top-3 right-3 text-stone-400 hover:text-red-500 transition-colors"
                aria-label="Remove child"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            <h3 className="text-sm font-medium text-stone-600 mb-4">
              {children.length === 1 ? 'Child Information' : `Child ${index + 1}`}
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
                  value={child.name}
                  onChange={(e) => updateChild(index, 'name', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
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
                  onChange={(e) => updateChild(index, 'age', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                />
                {ageWarning && (
                  <p className="mt-1 text-xs text-amber-600">{ageWarning}</p>
                )}
              </div>

              {showGrade && (
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Grade (Fall 2026)
                  </label>
                  <select
                    name={`child_grade_${index}`}
                    value={child.grade}
                    onChange={(e) => updateChild(index, 'grade', e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800"
                  >
                    <option value="">Select grade</option>
                    <option value="4th">4th Grade</option>
                    <option value="5th">5th Grade</option>
                    <option value="6th">6th Grade</option>
                    <option value="7th">7th Grade</option>
                    <option value="8th">8th Grade</option>
                  </select>
                </div>
              )}

              {showSchool && (
                <div className={showGrade ? '' : 'md:col-span-2'}>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    School
                  </label>
                  <input
                    type="text"
                    name={`child_school_${index}`}
                    value={child.school}
                    onChange={(e) => updateChild(index, 'school', e.target.value)}
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
                    value={child.tshirtSize}
                    onChange={(e) => updateChild(index, 'tshirtSize', e.target.value)}
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
              <div className="mt-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Allergies
                  </label>
                  <textarea
                    name={`child_allergies_${index}`}
                    rows={2}
                    value={child.allergies}
                    onChange={(e) => updateChild(index, 'allergies', e.target.value)}
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
                    value={child.dietary}
                    onChange={(e) => updateChild(index, 'dietary', e.target.value)}
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
                    value={child.medical}
                    onChange={(e) => updateChild(index, 'medical', e.target.value)}
                    placeholder="Any conditions or medications we should know about"
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800 resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-stone-700 mb-1">
                    Special needs / accommodations
                  </label>
                  <textarea
                    name={`child_special_${index}`}
                    rows={2}
                    value={child.special}
                    onChange={(e) => updateChild(index, 'special', e.target.value)}
                    placeholder="Any accommodations that would help your child succeed"
                    className="w-full px-4 py-2 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-stone-800 resize-y"
                  />
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Hidden field to track child count */}
      <input type="hidden" name="child_count" value={children.length} />

      <button
        type="button"
        onClick={addChild}
        className="flex items-center gap-2 text-forest-600 hover:text-forest-700 font-medium transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Add another child
      </button>
    </div>
  )
}
