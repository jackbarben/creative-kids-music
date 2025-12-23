'use client'

import { useState, useId } from 'react'
import { formatPhoneNumber } from '@/lib/utils/phone'

interface PhoneFieldProps {
  label: string
  name: string
  required?: boolean
  error?: string
  defaultValue?: string
  className?: string
}

export default function PhoneField({
  label,
  name,
  required = false,
  error,
  defaultValue,
  className = '',
}: PhoneFieldProps) {
  const id = useId()
  const [value, setValue] = useState(defaultValue ? formatPhoneNumber(defaultValue) : '')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setValue(formatted)
  }

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </label>
      <input
        type="tel"
        id={id}
        name={name}
        required={required}
        value={value}
        onChange={handleChange}
        placeholder="(555) 555-5555"
        className={`
          w-full px-4 py-3 rounded-lg border
          ${error ? 'border-red-400' : 'border-stone-300'}
          focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent
          bg-white text-stone-800 placeholder:text-stone-400
        `}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
