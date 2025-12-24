'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'

interface AccountSectionProps {
  email: string
  onEmailChange: (email: string) => void
  onUserChange: (user: User | null) => void
  error?: string
}

type AccountState = 'idle' | 'checking' | 'new_user' | 'existing_user' | 'logged_in'

const FORM_STATE_KEY = 'registration_form_state'
const FORM_STATE_EXPIRY = 15 * 60 * 1000 // 15 minutes

export default function AccountSection({
  email,
  onEmailChange,
  onUserChange,
  error
}: AccountSectionProps) {
  const [accountState, setAccountState] = useState<AccountState>('idle')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  const supabase = createClient()

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setAccountState('logged_in')
        onUserChange(user)
        // Pre-fill email from logged in user
        if (user.email && !email) {
          onEmailChange(user.email)
        }
      }
    }
    checkSession()

    // Listen for auth changes (for OAuth callback)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user)
        setAccountState('logged_in')
        onUserChange(session.user)

        // Restore form state after OAuth
        const savedState = sessionStorage.getItem(FORM_STATE_KEY)
        if (savedState) {
          try {
            const { timestamp } = JSON.parse(savedState)
            if (Date.now() - timestamp < FORM_STATE_EXPIRY) {
              // Form will be restored by parent component
            }
          } catch (e) {
            console.error('Error restoring form state:', e)
          }
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth, onUserChange, onEmailChange, email])

  // Check if email exists when email changes (debounced)
  const checkEmailExists = useCallback(async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) {
      setAccountState('idle')
      return
    }

    setAccountState('checking')
    setAuthError(null)

    try {
      // Try to sign in with a dummy password - if user exists, we get invalid credentials
      // If user doesn't exist, we get user not found
      const { error } = await supabase.auth.signInWithPassword({
        email: emailToCheck,
        password: 'check_if_exists_dummy_password_that_wont_work',
      })

      if (error?.message?.includes('Invalid login credentials')) {
        // User exists (password was wrong, but user is there)
        setAccountState('existing_user')
      } else if (error?.message?.includes('Email not confirmed')) {
        // User exists but email not confirmed
        setAccountState('existing_user')
      } else {
        // User doesn't exist
        setAccountState('new_user')
      }
    } catch (e) {
      console.error('Error checking email:', e)
      setAccountState('new_user')
    }
  }, [supabase.auth])

  const handleEmailBlur = () => {
    if (email && email.includes('@') && accountState !== 'logged_in') {
      checkEmailExists(email)
    }
  }

  const handleLogin = async () => {
    if (!loginPassword) {
      setAuthError('Please enter your password')
      return
    }

    setLoading(true)
    setAuthError(null)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: loginPassword,
    })

    if (error) {
      setAuthError('Invalid password. Try again or use Google.')
      setLoading(false)
      return
    }

    if (data.user) {
      setUser(data.user)
      setAccountState('logged_in')
      onUserChange(data.user)
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setAuthError(null)

    // Save current form state to sessionStorage
    const formState = {
      timestamp: Date.now(),
      returnUrl: window.location.href,
    }
    sessionStorage.setItem(FORM_STATE_KEY, JSON.stringify(formState))

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href,
      },
    })

    if (error) {
      setAuthError(error.message)
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setAuthError('Enter your email address first')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })

    if (error) {
      setAuthError(error.message)
    } else {
      setAuthError(null)
      alert('Check your email for a password reset link')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setAccountState('idle')
    onUserChange(null)
    setLoginPassword('')
    setPassword('')
    setConfirmPassword('')
  }

  // Render based on account state
  return (
    <section>
      <h3 className="font-display text-xl font-bold text-stone-800 mb-4">
        Your Account
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
            onChange={(e) => {
              onEmailChange(e.target.value)
              if (accountState !== 'logged_in') {
                setAccountState('idle')
              }
            }}
            onBlur={handleEmailBlur}
            disabled={accountState === 'logged_in'}
            required
            className={`w-full px-4 py-3 rounded-lg border transition-colors outline-none
              ${error ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-100' : 'border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100'}
              ${accountState === 'logged_in' ? 'bg-stone-50' : ''}
            `}
            placeholder="you@example.com"
          />
          {accountState === 'checking' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-400"></div>
            </div>
          )}
          {accountState === 'logged_in' && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-600">
              ✓
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>

      {/* Account State UI */}
      {accountState === 'logged_in' && user && (
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
        </div>
      )}

      {accountState === 'existing_user' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          <div>
            <p className="font-medium text-slate-800">Welcome back!</p>
            <p className="text-sm text-slate-600">Sign in to continue your registration.</p>
          </div>

          {authError && (
            <p className="text-sm text-red-600">{authError}</p>
          )}

          <div>
            <label htmlFor="login_password" className="block text-sm font-medium text-slate-700 mb-1">
              Password
            </label>
            <input
              id="login_password"
              type="password"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="mt-1 text-sm text-slate-500 hover:text-slate-700"
            >
              Forgot password?
            </button>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 font-medium hover:bg-slate-900 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-2 border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors disabled:opacity-50"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
          </div>
        </div>
      )}

      {accountState === 'new_user' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-4">
          <div>
            <p className="font-medium text-slate-800">Create Your Account</p>
            <p className="text-sm text-slate-600">You&apos;ll use this to manage registrations later.</p>
          </div>

          {authError && (
            <p className="text-sm text-red-600">{authError}</p>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                placeholder="••••••••"
              />
              <p className="mt-1 text-xs text-slate-400">At least 8 characters</p>
            </div>

            <div>
              <label htmlFor="confirm_password" className="block text-sm font-medium text-slate-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm_password"
                name="confirm_password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                placeholder="••••••••"
              />
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600">Passwords don&apos;t match</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-sm text-slate-400">or</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-slate-200 rounded-lg hover:border-slate-300 transition-colors disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>
        </div>
      )}

      {/* Hidden inputs to pass user data to server action */}
      <input type="hidden" name="user_id" value={user?.id || ''} />
      {/* When logged in, email field is disabled so we need a hidden input */}
      {accountState === 'logged_in' && user?.email && (
        <input type="hidden" name="parent_email" value={user.email} />
      )}
    </section>
  )
}
