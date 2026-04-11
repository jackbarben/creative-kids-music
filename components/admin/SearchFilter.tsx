'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useTransition } from 'react'

interface FilterOption {
  value: string
  label: string
}

interface SearchFilterProps {
  placeholder?: string
  statusOptions?: FilterOption[]
  paymentOptions?: FilterOption[]
  workshopOptions?: FilterOption[]
  baseUrl: string
}

export default function SearchFilter({
  placeholder = 'Search by name or email...',
  statusOptions,
  paymentOptions,
  workshopOptions,
  baseUrl,
}: SearchFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [status, setStatus] = useState(searchParams.get('status') || '')
  const [payment, setPayment] = useState(searchParams.get('payment') || '')
  const [workshop, setWorkshop] = useState(searchParams.get('workshop') || '')

  const buildUrl = (overrides: Record<string, string> = {}) => {
    const values = {
      search,
      status,
      payment,
      workshop,
      ...overrides,
    }
    const params = new URLSearchParams()
    if (values.search) params.set('search', values.search)
    if (values.status) params.set('status', values.status)
    if (values.payment) params.set('payment', values.payment)
    if (values.workshop) params.set('workshop', values.workshop)
    params.set('page', '1')
    return `${baseUrl}?${params.toString()}`
  }

  const applyFilters = () => {
    startTransition(() => {
      router.push(buildUrl())
    })
  }

  const applySelectFilter = (key: string, value: string) => {
    if (key === 'status') setStatus(value)
    if (key === 'payment') setPayment(value)
    if (key === 'workshop') setWorkshop(value)
    startTransition(() => {
      router.push(buildUrl({ [key]: value }))
    })
  }

  const clearFilters = () => {
    setSearch('')
    setStatus('')
    setPayment('')
    setWorkshop('')
    startTransition(() => {
      router.push(baseUrl)
    })
  }

  const hasFilters = search || status || payment || workshop

  return (
    <div className="mb-6 space-y-3">
      <div className="flex flex-wrap gap-3">
        {/* Search input */}
        <div className="flex-1 min-w-[200px]">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm text-slate-800 placeholder:text-slate-400"
          />
        </div>

        {/* Status filter */}
        {statusOptions && (
          <select
            value={status}
            onChange={(e) => applySelectFilter('status', e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm text-slate-800"
          >
            <option value="">All statuses</option>
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Workshop filter */}
        {workshopOptions && (
          <select
            value={workshop}
            onChange={(e) => applySelectFilter('workshop', e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm text-slate-800"
          >
            <option value="">All workshops</option>
            {workshopOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Payment filter */}
        {paymentOptions && (
          <select
            value={payment}
            onChange={(e) => applySelectFilter('payment', e.target.value)}
            className="px-3 py-2 border border-stone-300 rounded-lg focus:ring-2 focus:ring-forest-500 focus:border-transparent text-sm text-slate-800"
          >
            <option value="">All payments</option>
            {paymentOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        )}

        {/* Apply button */}
        <button
          onClick={applyFilters}
          disabled={isPending}
          className="px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 disabled:opacity-50 text-sm"
        >
          {isPending ? 'Searching...' : 'Search'}
        </button>

        {/* Clear button */}
        {hasFilters && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 text-sm"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
