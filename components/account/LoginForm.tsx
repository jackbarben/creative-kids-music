'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const t = useTranslations('account.login')

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(t('invalidCredentials'))
      setLoading(false)
    }
    // On success, the auth state change listener will update the UI
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError(t('enterEmailFirst'))
      return
    }

    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/account/reset-password`,
    })

    if (error) {
      setError(error.message)
    } else {
      setError(null)
      alert(t('checkEmailForReset'))
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2 text-center">
        {t('title')}
      </h1>
      <p className="text-slate-500 text-center mb-8">
        {t('subtitle')}
      </p>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-white border-2 border-slate-200 rounded-lg px-4 py-3 text-slate-700 font-medium hover:border-slate-300 hover:bg-slate-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
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
          {t('continueWithGoogle')}
        </button>

        <div className="my-6 flex items-center">
          <div className="flex-1 border-t border-slate-200"></div>
          <span className="px-4 text-sm text-slate-400">{t('or')}</span>
          <div className="flex-1 border-t border-slate-200"></div>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              {t('emailLabel')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"
              placeholder={t('emailPlaceholder')}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
              {t('passwordLabel')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-slate-400 focus:ring-2 focus:ring-slate-100 outline-none transition-colors text-slate-800 placeholder:text-slate-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={handleForgotPassword}
              className="mt-2 text-sm text-slate-500 hover:text-slate-700"
            >
              {t('forgotPassword')}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-800 text-white rounded-lg px-4 py-3 font-semibold hover:bg-slate-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? t('signingIn') : t('signIn')}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100">
          <p className="text-sm text-slate-500 text-center">
            {t('noAccount')}{' '}
            <span className="text-slate-700">
              {t('registerPrompt')}
            </span>
          </p>
          <div className="flex gap-4 mt-4 justify-center">
            <Link
              href="/workshops"
              className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
            >
              {t('viewWorkshops')}
            </Link>
            <Link
              href="/summer-camp"
              className="text-sm text-slate-600 hover:text-slate-800 underline underline-offset-4"
            >
              {t('viewSummerCamp')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
