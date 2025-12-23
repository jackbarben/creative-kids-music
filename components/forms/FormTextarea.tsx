'use client'

import { useId } from 'react'

interface FormTextareaProps {
  label: string
  name: string
  required?: boolean
  placeholder?: string
  error?: string
  defaultValue?: string
  rows?: number
  className?: string
}

export default function FormTextarea({
  label,
  name,
  required = false,
  placeholder,
  error,
  defaultValue,
  rows = 3,
  className = '',
}: FormTextareaProps) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        rows={rows}
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error ? 'border-red-400' : 'border-stone-300'}
          focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
          bg-white text-stone-800 placeholder:text-stone-400 resize-y
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
