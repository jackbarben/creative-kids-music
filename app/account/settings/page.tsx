'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Link from 'next/link'

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form states
  const [newEmail, setNewEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/account')
        return
      }
      setUser(user)
      setLoading(false)
    }

    checkUser()
  }, [supabase.auth, router])

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newEmail) return

    setSaving(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      email: newEmail
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Check your new email for a verification link' })
      setNewEmail('')
    }
    setSaving(false)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters' })
      return
    }

    setSaving(true)
    setMessage(null)

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully' })
      setNewPassword('')
      setConfirmPassword('')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const isGoogleUser = user?.app_metadata?.provider === 'google'

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-6">
          {/* Back Link */}
          <Link
            href="/account"
            className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 mb-6"
          >
            ← Back to Dashboard
          </Link>

          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-8">
            Account Settings
          </h1>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {message.text}
            </div>
          )}

          {/* Email Section */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
              Email
            </h2>
            <p className="text-slate-600 mb-4">
              Current: <span className="font-medium">{user?.email}</span>
            </p>

            {isGoogleUser ? (
              <p className="text-sm text-slate-500">
                Your email is managed by Google. Sign in with a different Google account to change it.
              </p>
            ) : (
              <form onSubmit={handleChangeEmail}>
                <div className="mb-4">
                  <label htmlFor="newEmail" className="block text-sm font-medium text-slate-700 mb-1">
                    New Email
                  </label>
                  <input
                    id="newEmail"
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                    placeholder="newemail@example.com"
                  />
                </div>
                <button
                  type="submit"
                  disabled={saving || !newEmail}
                  className="px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Change Email'}
                </button>
              </form>
            )}
          </div>

          {/* Password Section */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-6">
            <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
              Password
            </h2>

            {isGoogleUser ? (
              <p className="text-sm text-slate-500">
                Your account uses Google sign-in. Password is managed by Google.
              </p>
            ) : (
              <form onSubmit={handleChangePassword}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      New Password
                    </label>
                    <input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                      placeholder="••••••••"
                      minLength={8}
                    />
                    <p className="text-xs text-slate-400 mt-1">At least 8 characters</p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                      Confirm New Password
                    </label>
                    <input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={saving || !newPassword || !confirmPassword}
                  className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Change Password'}
                </button>
              </form>
            )}
          </div>

          {/* Connected Accounts */}
          {isGoogleUser && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Connected Accounts
              </h2>
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="text-slate-700">Google</span>
                <span className="ml-auto text-sm text-green-600">Connected ✓</span>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
