import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Behavior Agreement | Creative Kids Music',
  description: 'Behavior expectations and agreement for Creative Kids Music Project summer camp participants.',
}

export default async function BehaviorAgreementPage() {
  const t = await getTranslations('terms')
  const tb = await getTranslations('terms.behavior')
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
            <Link href="/terms/behavior-agreement" locale="en" className="text-sm font-medium text-amber-700 hover:text-amber-900 underline">
              {t('viewInEnglish')}
            </Link>
          </div>
        )}

        <header className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
            {t('summerCamp')}
          </p>
          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2">
            {tb('title')}
          </h1>
          <p className="text-lg text-slate-600">{t('subtitle')}</p>
        </header>

        <div className="prose prose-slate max-w-none">
          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('valuesTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('valuesBody')}</p>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('respectOthersTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('respectOthersIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tb('respectKindness')}</li>
              <li>{tb('respectLanguage')}</li>
              <li>{tb('respectListen')}</li>
              <li>{tb('respectCelebrate')}</li>
              <li>{tb('respectInclude')}</li>
              <li>{tb('respectHands')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('respectEquipmentTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('respectEquipmentIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tb('equipCare')}</li>
              <li>{tb('equipInstructions')}</li>
              <li>{tb('equipPermission')}</li>
              <li>{tb('equipReport')}</li>
              <li>{tb('equipClean')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('respectProgramTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('respectProgramIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tb('programSchedule')}</li>
              <li>{tb('programInstructions')}</li>
              <li>{tb('programParticipate')}</li>
              <li>{tb('programGroup')}</li>
              <li>{tb('programElectronics')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('safetyTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('safetyIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tb('safetyAreas')}</li>
              <li>{tb('safetyWalk')}</li>
              <li>{tb('safetyBuddy')}</li>
              <li>{tb('safetyReport')}</li>
              <li>{tb('safetyEmergency')}</li>
              <li>{tb('safetyProhibited')}</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('communicationTitle')}
            </h2>
            <p className="text-slate-600">{tb('communicationBody')}</p>
          </section>

          <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tb('acknowledgmentTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tb('acknowledgmentIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tb('ackRead')}</li>
              <li>{tb('ackReviewed')}</li>
              <li>{tb('ackFollows')}</li>
              <li>{tb('ackSupport')}</li>
            </ul>
          </section>

          <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p className="mb-2">{t('behaviorAcceptedElectronically')}</p>
            <p>
              {t('questionsContact')}{' '}
              <a href="mailto:info@creativekidsmusic.org" className="text-forest-600 hover:text-forest-700">
                info@creativekidsmusic.org
              </a>
            </p>
          </footer>
        </div>
      </article>
    </main>
      <Footer />
    </div>
  )
}
