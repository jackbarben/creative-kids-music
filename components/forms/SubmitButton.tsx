'use client'

import { useFormStatus } from 'react-dom'

interface SubmitButtonProps {
  children: React.ReactNode
  className?: string
}

export default function SubmitButton({ children, className = '' }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`
        px-6 py-3 rounded-lg font-medium
        bg-forest-600 text-white
        hover:bg-forest-700
        focus:outline-none focus:ring-2 focus:ring-forest-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors
        ${className}
      `}
    >
      {pending ? 'Submitting...' : children}
    </button>
  )
}
