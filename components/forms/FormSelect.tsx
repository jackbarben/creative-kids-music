'use client'

import { useId } from 'react'

interface FormSelectProps {
  label: string
  name: string
  options: { value: string; label: string }[]
  required?: boolean
  error?: string
  defaultValue?: string
  placeholder?: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function FormSelect({
  label,
  name,
  options,
  required = false,
  error,
  defaultValue,
  placeholder = 'Select an option',
  className = '',
  onChange,
}: FormSelectProps) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </label>
      <select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue || ''}
        onChange={onChange}
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error ? 'border-red-400' : 'border-stone-300'}
          focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
          bg-white text-stone-800
        `}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
