'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { createAccountAndLinkRegistrations } from '../actions'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

function CreateAccountForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState<{
    linkedWorkshops: number
    linkedCamp: number
    linkedWaitlist: number
  } | null>(null)

  const supabase = createClient()

  // Pre-fill email from URL param
  useEffect(() => {
    const emailParam = searchParams.get('email')
    if (emailParam) {
      setEmail(emailParam)
    }
  }, [searchParams])

  // Check if already logged in
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        router.push('/account')
      }
    }
    checkUser()
  }, [supabase.auth, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const result = await createAccountAndLinkRegistrations(email, password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    if (result.success) {
      setSuccess({
        linkedWorkshops: result.linkedWorkshops || 0,
        linkedCamp: result.linkedCamp || 0,
        linkedWaitlist: result.linkedWaitlist || 0,
      })

      // Sign in the user
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        // Account created but couldn't auto-sign in
        setError('Account created! Please sign in manually.')
        setLoading(false)
        return
      }

      // Redirect to account dashboard after short delay
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    }

    setLoading(false)
  }

  const handleGoogleSignUp = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/account`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const totalLinked = success
    ? success.linkedWorkshops + success.linkedCamp + success.linkedWaitlist
    : 0

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-display text-3xl font-bold text-stone-800 text-center mb-2">
            Create Your Account
          </h1>
          <p className="text-stone-600 text-center mb-8">
            Manage your registrations, update contact info, and more.
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <div className="text-green-600 text-4xl mb-3">✓</div>
              <h2 className="font-display text-xl font-semibold text-green-800 mb-2">
                Account Created!
              </h2>
              {totalLinked > 0 ? (
                <p className="text-green-700 mb-4">
                  We found and linked {totalLinked} existing registration{totalLinked !== 1 ? 's' : ''} to your account.
                </p>
              ) : (
                <p className="text-green-700 mb-4">
                  Your account is ready to use.
                </p>
              )}
              <p className="text-green-600 text-sm">
                Redirecting to your dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors"
                  placeholder="At least 8 characters"
                />
              </div>

              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-stone-700 mb-1">
                  Confirm Password
                </label>
                <input
                  id="confirm_password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg border border-stone-200 focus:border-forest-400 focus:ring-2 focus:ring-forest-100 outline-none transition-colors"
                  placeholder="Confirm your password"
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">Passwords don&apos;t match</p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              <div className="flex items-center gap-3">
                <div className="flex-1 border-t border-stone-200"></div>
                <span className="text-sm text-stone-400">or</span>
                <div className="flex-1 border-t border-stone-200"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-stone-200 rounded-lg hover:border-stone-300 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </button>

              <p className="text-center text-sm text-stone-500">
                Already have an account?{' '}
                <Link href="/account" className="text-forest-600 hover:text-forest-700 underline">
                  Sign in
                </Link>
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function CreateAccountPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-cream-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-md mx-auto px-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800 mx-auto"></div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <CreateAccountForm />
    </Suspense>
  )
}
