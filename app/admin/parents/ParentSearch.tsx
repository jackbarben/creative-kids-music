'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface ParentSearchProps {
  initialQuery: string
  initialMedicalFilter: boolean
}

export default function ParentSearch({ initialQuery, initialMedicalFilter }: ParentSearchProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [medicalOnly, setMedicalOnly] = useState(initialMedicalFilter)
  const [isPending, startTransition] = useTransition()

  const buildUrl = (q: string, medical: boolean) => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (medical) params.set('medical', '1')
    const queryString = params.toString()
    return `/admin/parents${queryString ? `?${queryString}` : ''}`
  }

  const handleSearch = () => {
    if (!query.trim()) return
    startTransition(() => {
      router.push(buildUrl(query, medicalOnly))
    })
  }

  const handleMedicalToggle = (checked: boolean) => {
    setMedicalOnly(checked)
    startTransition(() => {
      router.push(buildUrl(query, checked))
    })
  }

  const handleClear = () => {
    setQuery('')
    setMedicalOnly(false)
    startTransition(() => {
      router.push('/admin/parents')
    })
  }

  const hasFilters = initialQuery || initialMedicalFilter

  return (
    <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search by email or name..."
          className="flex-1 px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-slate-800 placeholder:text-slate-400"
        />
        <button
          onClick={handleSearch}
          disabled={isPending || !query.trim()}
          className="px-6 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50 transition-colors"
        >
          {isPending ? 'Searching...' : 'Search'}
        </button>
        {hasFilters && (
          <button
            onClick={handleClear}
            disabled={isPending}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 transition-colors"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="medical-filter"
          checked={medicalOnly}
          onChange={(e) => handleMedicalToggle(e.target.checked)}
          className="w-4 h-4 rounded border-stone-300 text-forest-600 focus:ring-forest-500"
        />
        <label htmlFor="medical-filter" className="text-sm text-stone-600 cursor-pointer">
          Show only families with medical info (allergies, conditions, special needs)
        </label>
      </div>
    </div>
  )
}
