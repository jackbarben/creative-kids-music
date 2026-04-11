'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function WorkshopThankYouPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const supabase = createClient()
  const t = useTranslations('thankYou')

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()
  }, [supabase.auth])

  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="py-24 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              {t('workshopTitle')}
            </h1>
            <p className="text-xl text-stone-600 mb-4">{t('workshopBody')}</p>
            <p className="text-stone-500 mb-8">{t('workshopDetail')}</p>
            <p className="text-stone-400 text-sm mb-12">{t('paymentNote')}</p>

            {isLoggedIn === null ? (
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
                <div className="animate-pulse h-20 bg-stone-100 rounded"></div>
              </div>
            ) : isLoggedIn ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <h2 className="font-display text-lg font-semibold text-green-800">
                    {t('accountLinkedTitle')}
                  </h2>
                </div>
                <p className="text-green-700 text-sm mb-4">{t('accountLinkedBody')}</p>
                <a
                  href="/account"
                  className="inline-block px-5 py-2.5 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors"
                >
                  {t('goToAccount')}
                </a>
              </div>
            ) : (
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-display text-lg font-semibold text-stone-800 mb-2">
                  {t('createAccountTitle')}
                </h2>
                <p className="text-stone-600 text-sm mb-4">{t('createAccountBody')}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href="/account/create"
                    className="inline-block px-5 py-2.5 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors text-center"
                  >
                    {t('createAccount')}
                  </a>
                  <Link
                    href="/"
                    className="inline-block px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors text-center"
                  >
                    {t('maybeLater')}
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
