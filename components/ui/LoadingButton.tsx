'use client'

interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
}

export default function LoadingButton({
  loading = false,
  children,
  variant = 'primary',
  className = '',
  disabled,
  ...props
}: LoadingButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

  const variantStyles = {
    primary: 'bg-forest-600 text-white hover:bg-forest-700',
    secondary: 'border border-slate-200 text-slate-700 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  }

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  )
}
