import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WorkshopRegistrationForm from '../WorkshopRegistrationForm'
import { getWorkshops } from '@/lib/data'

export default async function WorkshopRegisterPage() {
  const workshops = await getWorkshops(true)
  const t = await getTranslations('forms')

  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 to-cream-50 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              {t('workshop.title')}
            </h1>
            <p className="text-stone-600">{t('workshop.subtitle')}</p>
          </div>
        </section>

        <section className="py-12 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6">
            {workshops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-600 mb-4">{t('workshop.noWorkshops')}</p>
                <Link href="/workshops" className="text-forest-600 hover:text-forest-700 underline">
                  {t('workshop.backToWorkshops')}
                </Link>
              </div>
            ) : (
              <WorkshopRegistrationForm workshops={workshops} />
            )}
          </div>
        </section>

        <section className="py-12 bg-cream-100">
          <div className="max-w-2xl mx-auto px-6 text-center text-stone-600 space-y-2">
            <p>{t('workshop.detailsTime')}</p>
            <p>{t('workshop.detailsPrice')}</p>
            <p className="text-sm text-stone-500">{t('workshop.detailsSibling')}</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
