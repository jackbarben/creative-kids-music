import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Creative Kids Music',
  description: 'Terms and conditions for Creative Kids Music Project programs including workshops, summer camp, and music school.',
}

export default async function ProgramTermsPage() {
  const t = await getTranslations('terms')
  const tp = await getTranslations('terms.programTerms')
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
            <Link href="/terms/program-terms" locale="en" className="text-sm font-medium text-amber-700 hover:text-amber-900 underline">
              {t('viewInEnglish')}
            </Link>
          </div>
        )}

        <header className="mb-8 pb-8 border-b border-slate-200">
          <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
            {t('legalDocument')}
          </p>
          <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2">
            {tp('title')}
          </h1>
          <p className="text-lg text-slate-600">{t('subtitle')}</p>
        </header>

        <p className="text-slate-600 mb-8">{tp('intro')}</p>

        <div className="prose prose-slate max-w-none">
          {/* Program Participation */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('participationTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('registrationTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('registrationBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('accuracyTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('accuracyBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('rulesTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('rulesBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('supervisionTitle')}</h3>
            <p className="text-slate-600">{tp('supervisionBody')}</p>
          </section>

          {/* Payment & Fees */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('paymentFeesTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('paymentTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('paymentBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('latePaymentTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('latePaymentBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('additionalFeesTitle')}</h3>
            <p className="text-slate-600">{tp('additionalFeesBody')}</p>
          </section>

          {/* Payment & Refunds */}
          <section id="cancellation" className="mb-10 scroll-mt-24">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('refundsTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('paymentPolicyTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('paymentPolicyBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('refundPolicyTitle')}</h3>
            <p className="text-slate-600 mb-4">
              <strong>{tp('refundPolicyBody').split('.')[0]}.</strong>{' '}
              {tp('refundPolicyBody').split('.').slice(1).join('.')}
            </p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('cancellationByUsTitle')}</h3>
            <p className="text-slate-600">{tp('cancellationByUsBody')}</p>
          </section>

          {/* Weather & Closures */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('weatherTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('weatherClosuresTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('weatherClosuresBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('makeUpTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('makeUpBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('singleEventsTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('singleEventsBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('yourDecisionTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('yourDecisionBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('howWeDecideTitle')}</h3>
            <p className="text-slate-600">{tp('howWeDecideBody')}</p>
          </section>

          {/* Drop-Off & Pickup */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('dropoffTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('authorizedPickupTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('authorizedPickupBody1')}</p>
            <p className="text-slate-600 mb-4">{tp('authorizedPickupBody2')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('signInOutTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('signInOutBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('latePickupTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('latePickupIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-1">
              <li>{tp('latePickup15')}</li>
              <li>{tp('latePickup30')}</li>
              <li>{tp('latePickup30plus')}</li>
            </ul>
            <p className="text-slate-600 mt-4">{tp('latePickupNote')}</p>
          </section>

          {/* Media */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('mediaTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('mediaPreferencesTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('mediaPreferencesBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('mediaFamiliesTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('mediaFamiliesBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('mediaEventsTitle')}</h3>
            <p className="text-slate-600">{tp('mediaEventsBody')}</p>
          </section>

          {/* Communication */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('communicationTitle')}
            </h2>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('programUpdatesTitle')}</h3>
            <p className="text-slate-600 mb-4">{tp('programUpdatesBody')}</p>

            <h3 className="font-semibold text-slate-700 text-lg mb-2">{tp('emergencyCommTitle')}</h3>
            <p className="text-slate-600">{tp('emergencyCommBody')}</p>
          </section>

          {/* Liability */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('liabilityTitle')}
            </h2>
            <p className="text-slate-600">
              {tp.rich('liabilityBody', {
                liabilityLink: (chunks) => (
                  <Link href="/terms/liability-waiver" className="text-forest-600 hover:text-forest-700 underline">
                    {chunks}
                  </Link>
                ),
              })}
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('changesToTermsTitle')}
            </h2>
            <p className="text-slate-600">{tp('changesToTermsBody')}</p>
          </section>

          {/* Governing Law */}
          <section className="mb-10">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('governingLawTitle')}
            </h2>
            <p className="text-slate-600">{tp('governingLawBody')}</p>
          </section>

          {/* Acknowledgment */}
          <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('acknowledgmentTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tp('acknowledgmentIntro')}</p>
            <ul className="list-disc pl-6 text-slate-600 space-y-2">
              <li>{tp('ackRead')}</li>
              <li>
                {tp.rich('ackLiability', {
                  liabilityLink: (chunks) => (
                    <Link href="/terms/liability-waiver" className="text-forest-600 hover:text-forest-700 underline">
                      {chunks}
                    </Link>
                  ),
                })}
              </li>
              <li>{tp('ackParent')}</li>
              <li>{tp('ackAbide')}</li>
              <li>{tp('ackResponsibility')}</li>
            </ul>
          </section>

          {/* Contact */}
          <section className="mb-8">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
              {tp('contactTitle')}
            </h2>
            <p className="text-slate-600 mb-4">{tp('contactIntro')}</p>
            <address className="text-slate-600 not-italic">
              <strong>{tp('contactOrg')}</strong><br />
              <a href="mailto:creativekidsmusicproject@gmail.com" className="text-forest-600 hover:text-forest-700">
                creativekidsmusicproject@gmail.com
              </a>
            </address>
          </section>

          <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
            <p className="mb-2">{t('termsAcceptedElectronically')}</p>
            <p>{t('copyProvided')}</p>
          </footer>
        </div>
      </article>
    </main>
      <Footer />
    </div>
  )
}
