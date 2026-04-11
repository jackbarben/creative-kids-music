'use client'

import { useLocale } from 'next-intl'
import { usePathname, useRouter } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'
import { useEffect, useState } from 'react'

export default function LanguageSwitcher() {
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    // Hide on non-locale pages (terms, account, admin, auth)
    const raw = window.location.pathname
    setHidden(
      raw.startsWith('/terms') ||
      raw.startsWith('/account') ||
      raw.startsWith('/admin') ||
      raw.startsWith('/auth')
    )
  }, [])

  if (hidden) return null

  const switchLocale = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-1 text-sm">
      {routing.locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="text-slate-300 mx-1">|</span>}
          <button
            onClick={() => switchLocale(loc)}
            className={`transition-colors ${
              locale === loc
                ? 'text-slate-800 font-medium'
                : 'text-slate-400 hover:text-slate-800'
            }`}
          >
            {loc.toUpperCase()}
          </button>
        </span>
      ))}
    </div>
  )
}
