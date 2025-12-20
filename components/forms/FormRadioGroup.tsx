'use client'

import { useId } from 'react'

interface RadioOption {
  value: string
  label: string
  description?: string
}

interface FormRadioGroupProps {
  label: string
  name: string
  options: RadioOption[]
  required?: boolean
  error?: string
  defaultValue?: string
  className?: string
}

export default function FormRadioGroup({
  label,
  name,
  options,
  required = false,
  error,
  defaultValue,
  className = '',
}: FormRadioGroupProps) {
  const groupId = useId()

  return (
    <div className={className}>
      <p className="block text-sm font-medium text-stone-700 mb-3">
        {label}
        {required && <span className="text-terracotta-500 ml-1">*</span>}
      </p>
      <div className="space-y-3">
        {options.map((option) => {
          const optionId = `${groupId}-${option.value}`
          return (
            <label key={option.value} htmlFor={optionId} className="flex items-start gap-3 cursor-pointer">
              <input
                type="radio"
                id={optionId}
                name={name}
                value={option.value}
                required={required}
                defaultChecked={defaultValue === option.value}
                className="mt-0.5 h-4 w-4 border-stone-300 text-forest-600 focus:ring-forest-500"
              />
              <div>
                <span className="text-sm text-stone-800">{option.label}</span>
                {option.description && (
                  <p className="text-xs text-stone-500 mt-0.5">{option.description}</p>
                )}
              </div>
            </label>
          )
        })}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}
