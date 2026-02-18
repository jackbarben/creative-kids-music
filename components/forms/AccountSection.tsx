'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AccountSectionProps {
  email: string
  onEmailChange: (email: string) => void
  onUserChange: (user: User | null) => void
  error?: string
}

export default function AccountSection({
  email,
  onEmailChange,
  onUserChange,
  error
}: AccountSectionProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        onUserChange(user)
        // Pre-fill email from logged in user
        if (user.email && !email) {
          onEmailChange(user.email)
        }
      }
      setLoading(false)
    }
    checkSession()

    // Listen for auth changes (for OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        onUserChange(session.user)
        if (session.user.email) {
          onEmailChange(session.user.email)
        }
      } else {
        setUser(null)
        onUserChange(null)
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, onUserChange, onEmailChange, email])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    onUserChange(null)
  }

  const isLoggedIn = !!user

  return (
    <section>
      <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
        Contact Email
      </h3>

      {/* Email Field */}
      <div className="mb-4">
        <label htmlFor="parent_email" className="block text-sm font-medium text-stone-700 mb-1">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            id="parent_email"
            name="parent_email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            disabled={isLoggedIn}
            required
            className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100'}
              ${isLoggedIn ? 'bg-stone-50' : ''}
            `}
            placeholder="you@example.com"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
            </div>
          )}
          {isLoggedIn && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
              ✓
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Logged-in state */}
      {isLoggedIn && user && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-green-700">✓</span>
              <span className="text-green-800 font-medium">Signed in as {user.email}</span>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-sm text-green-600 hover:text-green-800"
            >
              Sign out
            </button>
          </div>
          <p className="mt-2 text-sm text-green-700">
            Your registration will be linked to your account.
          </p>
        </div>
      )}

      {/* Not logged in - show helpful text */}
      {!isLoggedIn && !loading && (
        <p className="text-sm text-slate-500">
          Already have an account? <a href="/account" className="text-forest-600 hover:text-forest-700 underline">Sign in first</a> to link this registration to your account.
        </p>
      )}

      {/* Hidden inputs to pass user data to server action */}
      <input type="hidden" name="user_id" value={user?.id || ''} />
      {/* When logged in, email field is disabled so we need a hidden input */}
      {isLoggedIn && user?.email && (
        <input type="hidden" name="parent_email" value={user.email} />
      )}
    </section>
  )
}
