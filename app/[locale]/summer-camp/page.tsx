import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function SummerCampPage() {
  const t = await getTranslations('summerCamp')

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
              <div className="md:col-span-7">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase mb-6">
                  {t('date')}
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
                  {t('title')}
                </h1>

                <p className="mt-12 text-xl text-slate-700 font-medium leading-relaxed">
                  {t('headline')}
                </p>

                <div className="mt-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>{t('body1')}</p>
                  <p>{t('body2')}</p>
                </div>

                <div className="mt-16 pt-16 border-t border-slate-200">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    {t('finale')}
                  </h2>
                  <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                    <p>{t('finaleBody1')}</p>
                    <p>{t('finaleBody2')}</p>
                  </div>
                </div>

                <div className="mt-12">
                  <Image
                    src="/media/photos/summer-camp.jpg"
                    alt={t('photoAlt')}
                    width={800}
                    height={500}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    {t('details')}
                  </h2>

                  <div className="space-y-6">
                    <div className="pb-6 border-b border-slate-200">
                      <p className="font-display font-semibold text-slate-800">{t('datesLabel')}</p>
                      <p className="text-sm text-slate-500 mt-2">{t('datesValue')}</p>
                    </div>
                    <div className="pb-6 border-b border-slate-200">
                      <p className="font-display font-semibold text-slate-800">{t('timeLabel')}</p>
                      <p className="text-sm text-slate-500 mt-2">
                        {t('timeValue')}<br />
                        {t('lunchIncluded')}
                      </p>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-slate-800">{t('performanceLabel')}</p>
                      <p className="text-sm text-slate-500 mt-2">{t('performanceValue')}</p>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                    <p>{t('ages')}</p>
                    <p>{t('pricing')}</p>
                    <p className="text-slate-400">{t('assistance')}</p>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-200 text-sm text-slate-400">
                    <p>{t('location')}</p>
                    <p>{t('address')}</p>
                  </div>

                  <Link
                    href="/summer-camp/register"
                    className="mt-10 block w-full py-4 bg-slate-800 text-white text-center text-sm font-medium tracking-wide rounded hover:bg-slate-700 transition-colors"
                  >
                    {t('register')}
                  </Link>
                  <p className="mt-3 text-xs text-slate-400 text-center">
                    {t('paymentNote')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div className="md:hidden h-24"></div>
      <Footer />

      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-cream-50/95 backdrop-blur-sm border-t border-slate-200">
        <Link
          href="/summer-camp/register"
          className="block w-full py-4 bg-slate-800 text-white text-center text-sm font-medium tracking-wide rounded hover:bg-slate-700 transition-colors"
        >
          {t('registerPrice')}
        </Link>
      </div>
    </div>
  )
}
