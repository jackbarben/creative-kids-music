'use client'

import { useEffect } from 'react'

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-cream-50 flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-2xl font-display text-stone-800 mb-4">
          Something went wrong
        </h1>
        <p className="text-stone-600 mb-8 max-w-md">
          We&apos;re sorry, an unexpected error occurred. Please try again or
          contact us if the problem persists.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="inline-block bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors"
          >
            Try Again
          </button>
          <a
            href="/"
            className="inline-block border border-forest-600 text-forest-600 px-6 py-3 rounded-lg hover:bg-forest-50 transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
