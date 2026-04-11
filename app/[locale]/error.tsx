'use client'

import { useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations('error')

  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="text-2xl font-display text-stone-800 mb-4">
            {t('title')}
          </h1>
          <p className="text-stone-600 mb-8 max-w-md">
            {t('body')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-block bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors"
            >
              {t('retry')}
            </button>
            <Link
              href="/"
              className="inline-block border border-forest-600 text-forest-600 px-6 py-3 rounded-lg hover:bg-forest-50 transition-colors"
            >
              {t('goHome')}
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
