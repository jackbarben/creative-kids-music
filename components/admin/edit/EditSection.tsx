'use client'

import { useState, ReactNode } from 'react'

interface EditSectionProps {
  title: string
  children: ReactNode
  isExpanded?: boolean
  onToggle?: () => void
  isPending?: boolean
  message?: { type: 'success' | 'error'; text: string } | null
  onSave?: () => void
  saveText?: string
  showSaveButton?: boolean
}

export default function EditSection({
  title,
  children,
  isExpanded = false,
  onToggle,
  isPending = false,
  message,
  onSave,
  saveText = 'Save',
  showSaveButton = true,
}: EditSectionProps) {
  const [localExpanded, setLocalExpanded] = useState(isExpanded)
  const expanded = onToggle ? isExpanded : localExpanded
  const toggleExpanded = onToggle || (() => setLocalExpanded(!localExpanded))

  return (
    <div className="border border-stone-200 rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full flex items-center justify-between p-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
      >
        <span className="font-medium text-stone-800">{title}</span>
        <svg
          className={`w-5 h-5 text-stone-500 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {expanded && (
        <div className="p-4 border-t border-stone-200 space-y-4">
          {children}

          {message && (
            <div className={`p-3 rounded-lg text-sm ${
              message.type === 'success'
                ? 'bg-green-50 text-green-700'
                : 'bg-red-50 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {showSaveButton && onSave && (
            <button
              type="button"
              onClick={onSave}
              disabled={isPending}
              className="w-full px-4 py-2 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Saving...' : saveText}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
