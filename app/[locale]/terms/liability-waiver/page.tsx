import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Liability Waiver | Creative Kids Music',
  description: 'Liability Waiver and Release of Claims for Creative Kids Music Project programs.',
}

export default async function LiabilityWaiverPage() {
  const t = await getTranslations('terms')
  const tl = await getTranslations('terms.liability')
  const locale = await getLocale()

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
      <article className="max-w-3xl mx-auto px-6">
        {locale === 'es' && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800 italic mb-1">{t('disclaimerBanner')}</p>
            <p className="text-sm text-amber-800 italic mb-2">{t('disclaimerBannerEs')}</p>
            <Link href="/terms/liability-waiver" locale="en" className="text-sm font-medium text-amber-700 hover:text-amber-900 underline">
              {t('viewInEnglish')}
            </Link>
          </div>
        )}

        <header className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
            {t('legalDocument')}
          </p>
          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2">
            {tl('title')}
          </h1>
          <p className="text-lg text-slate-600">{t('subtitle')}</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('assumptionOfRisk')}
            </h2>
            <p className="text-slate-600 mb-4">{tl('assumptionIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
              <li>{tl('riskMusic')}</li>
              <li>{tl('riskEquipment')}</li>
              <li>{tl('riskGroup')}</li>
              <li>{tl('riskOutdoor')}</li>
              <li>{tl('riskArts')}</li>
              <li>{tl('riskTrips')}</li>
              <li>{tl('riskInteraction')}</li>
              <li>{tl('riskTransport')}</li>
            </ul>
            <p className="text-slate-600">{tl('assumptionClose')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('waiverTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tl('waiverIntro')}</p>
            <ol className="list-decimal pl-6 text-slate-600 space-y-4">
              <li><strong>{tl('waiverRelease').split(' ').slice(0, 3).join(' ')}</strong> {tl('waiverRelease').split(' ').slice(3).join(' ')}</li>
              <li><strong>{tl('waiverWaive').split(' ').slice(0, 3).join(' ')}</strong> {tl('waiverWaive').split(' ').slice(3).join(' ')}</li>
              <li><strong>{tl('waiverNoSue').split(' ').slice(0, 4).join(' ')}</strong> {tl('waiverNoSue').split(' ').slice(4).join(' ')}</li>
              <li><strong>{tl('waiverIndemnify').split(' ').slice(0, 4).join(' ')}</strong> {tl('waiverIndemnify').split(' ').slice(4).join(' ')}</li>
            </ol>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('medicalTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tl('medicalIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
              <li>{tl('medicalFirstAid')}</li>
              <li>{tl('medicalEms')}</li>
              <li>{tl('medicalTreatment')}</li>
              <li>{tl('medicalTransport')}</li>
            </ul>
            <p className="text-slate-600">{tl('medicalClose')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('accuracyTitle')}
            </h2>
            <p className="text-slate-600">{tl('accuracyBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('photoTitle')}
            </h2>
            <p className="text-slate-600">{tl('photoBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('rulesTitle')}
            </h2>
            <p className="text-slate-600">{tl('rulesBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('durationTitle')}
            </h2>
            <p className="text-slate-600">{tl('durationBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('severabilityTitle')}
            </h2>
            <p className="text-slate-600">{tl('severabilityBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('governingLawTitle')}
            </h2>
            <p className="text-slate-600">{tl('governingLawBody')}</p>
          </section>

          <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tl('acknowledgmentTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tl('acknowledgmentIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tl('ackRead')}</li>
              <li>{tl('ackParent')}</li>
              <li>{tl('ackAuthority')}</li>
              <li>{tl('ackAgree')}</li>
              <li>{tl('ackDuration')}</li>
            </ul>
          </section>

          <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p className="mb-2">{t('acceptedElectronically')}</p>
            <p>{t('copyProvided')}</p>
          </footer>
        </div>
      </article>
    </main>
      <Footer />
    </div>
  )
}
