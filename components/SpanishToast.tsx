'use client'

import { useState, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/i18n/navigation'

const STORAGE_KEY = 'ckm-spanish-toast-seen'

export default function SpanishToast() {
  const [visible, setVisible] = useState(false)
  const locale = useLocale()
  const t = useTranslations('toast')
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (locale !== 'en') return
    if (localStorage.getItem(STORAGE_KEY)) return
    const timer = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(timer)
  }, [locale])

  const dismiss = () => {
    setVisible(false)
    localStorage.setItem(STORAGE_KEY, '1')
  }

  const switchToSpanish = () => {
    localStorage.setItem(STORAGE_KEY, '1')
    setVisible(false)
    router.replace(pathname, { locale: 'es' })
  }

  if (!visible) return null

  return (
    <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-white rounded-xl shadow-xl border border-forest-200 p-5 ring-1 ring-forest-100">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="font-medium text-slate-800 text-sm">
              {t('spanishAvailable')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {t('aiTranslated')}
            </p>
            <div className="flex gap-2 mt-3">
              <button
                onClick={switchToSpanish}
                className="px-3 py-1.5 bg-forest-600 text-white text-xs font-medium rounded-lg hover:bg-forest-700 transition-colors"
              >
                {t('switchToSpanish')}
              </button>
              <button
                onClick={dismiss}
                className="px-3 py-1.5 text-slate-500 text-xs font-medium hover:text-slate-700 transition-colors"
              >
                {t('dismiss')}
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            className="text-slate-400 hover:text-slate-600 transition-colors -mt-1 -mr-1"
            aria-label="Close"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
