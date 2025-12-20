'use client'

import { useId } from 'react'

interface FormCheckboxProps {
  label: string | React.ReactNode
  name: string
  value?: string
  required?: boolean
  error?: string
  defaultChecked?: boolean
  className?: string
}

export default function FormCheckbox({
  label,
  name,
  value,
  required = false,
  error,
  defaultChecked = false,
  className = '',
}: FormCheckboxProps) {
  const id = useId()

  return (
    <div className={className}>
      <label htmlFor={id} className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          id={id}
          name={name}
          value={value}
          required={required}
          defaultChecked={defaultChecked}
          className={`
            mt-1 h-4 w-4 rounded border-stone-300
            text-forest-600 focus:ring-forest-500
          `}
        />
        <span className="text-sm text-stone-700">
          {label}
          {required && <span className="text-terracotta-500 ml-1">*</span>}
        </span>
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
