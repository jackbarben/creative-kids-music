'use client'

import { useId } from 'react'

interface FormFieldProps {
  label: string
  name: string
  type?: 'text' | 'email' | 'tel' | 'number'
  required?: boolean
  placeholder?: string
  error?: string
  defaultValue?: string
  min?: number
  max?: number
  className?: string
}

export default function FormField({
  label,
  name,
  type = 'text',
  required = false,
  placeholder,
  error,
  defaultValue,
  min,
  max,
  className = '',
}: FormFieldProps) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        min={min}
        max={max}
        className={`
          w-full px-4 py-2 rounded-lg border
          ${error ? 'border-red-400' : 'border-stone-300'}
          focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
          bg-white text-stone-800
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
