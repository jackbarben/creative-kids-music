import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CampRegistrationForm from '../CampRegistrationForm'

export default async function CampRegisterPage() {
  const t = await getTranslations('forms')

  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="relative overflow-hidden bg-gradient-to-b from-terracotta-50 to-cream-50 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              {t('camp.title')}
            </h1>
            <p className="text-stone-600">{t('camp.subtitle')}</p>
          </div>
        </section>

        <section className="py-12 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6">
            <CampRegistrationForm />
          </div>
        </section>

        <section className="py-12 bg-terracotta-50">
          <div className="max-w-2xl mx-auto px-6 text-center text-stone-600 space-y-2">
            <p>{t('camp.detailsSchedule')}</p>
            <p>{t('camp.detailsPerformance')}</p>
            <p className="pt-2">{t('camp.detailsPrice')}</p>
            <p className="text-sm text-stone-500">{t('camp.detailsSibling')}</p>
            <p className="pt-4 text-sm text-stone-500">
              {t('camp.detailsLocation')}<br />
              {t('camp.detailsAddress')}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
