'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const supabase = createClient()
  const router = useRouter()

  // Check if we have a valid session from the reset link
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // No session - might be invalid or expired link
        setError('Invalid or expired reset link. Please request a new one.')
      }
    }
    checkSession()
  }, [supabase.auth])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      // Redirect to account after a short delay
      setTimeout(() => {
        router.push('/account')
      }, 2000)
    }
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-md mx-auto px-6">
          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2 text-center">
            Reset Password
          </h1>
          <p className="text-slate-500 text-center mb-8">
            Enter your new password below
          </p>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            {success ? (
              <div className="text-center">
                <div className="text-4xl mb-4">✓</div>
                <h2 className="font-display text-xl font-semibold text-slate-800 mb-2">
                  Password Updated
                </h2>
                <p className="text-slate-500 mb-4">
                  Redirecting to your account...
                </p>
                <Link
                  href="/account"
                  className="text-slate-600 hover:text-slate-800 underline underline-offset-4"
                >
                  Go to Account
                </Link>
              </div>
            ) : (
              <>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                    {error.includes('expired') && (
                      <Link
                        href="/account"
                        className="block mt-2 underline"
                      >
                        Request new reset link
                      </Link>
                    )}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                      placeholder="••••••••"
                    />
                    <p className="text-xs text-slate-400 mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !password || !confirmPassword}
                    className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </form>
              </>
            )}
          </div>

          <p className="text-center mt-6 text-sm text-slate-500">
            <Link href="/account" className="text-slate-600 hover:text-slate-800">
              ← Back to Sign In
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  )
}
