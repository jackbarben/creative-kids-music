'use client'

import { useEffect } from 'react'

export default function GlobalError({
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
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily:
              'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            backgroundColor: '#faf9f6',
            padding: '1.5rem',
          }}
        >
          <div style={{ textAlign: 'center' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 600,
                color: '#1c1917',
                marginBottom: '1rem',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: '#57534e',
                marginBottom: '2rem',
                maxWidth: '28rem',
              }}
            >
              We&apos;re sorry, an unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                backgroundColor: '#2d5a3d',
                color: '#ffffff',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.5rem',
                border: 'none',
                fontSize: '1rem',
                cursor: 'pointer',
              }}
            >
              Try Again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
