import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InterestForm from './InterestForm'

export default async function MusicSchoolPage() {
  const t = await getTranslations('musicSchool')

  const bullets = [
    t('bullet1'), t('bullet2'), t('bullet3'),
    t('bullet4'), t('bullet5'), t('bullet6'),
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-24">
              <div className="md:col-span-7">
                <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase mb-6">
                  {t('coming')}
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
                  {t('title')}
                </h1>

                <p className="mt-12 text-xl text-slate-700 leading-relaxed">
                  {t('headline')}
                </p>

                <div className="mt-10">
                  <Image
                    src="/media/photos/music-school.jpg"
                    alt={t('photoAlt')}
                    width={800}
                    height={500}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>

                <div className="mt-10 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>{t('body1')}</p>
                  <p>{t('body2')}</p>
                </div>

                <div className="mt-10 space-y-4">
                  {bullets.map((bullet, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                      <p className="text-slate-600 leading-relaxed">{bullet}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-10 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>{t('closing1')}</p>
                </div>

                <div className="mt-12 pt-12 border-t border-slate-200">
                  <p className="text-xl text-slate-700 leading-relaxed">{t('closing2')}</p>
                  <p className="mt-4 text-slate-600 leading-relaxed">{t('closing3')}</p>
                  <p className="mt-4 text-xl font-medium text-slate-700">{t('closing4')}</p>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    {t('sidebarLabel')}
                  </h2>
                  <p className="text-2xl text-slate-800 font-display font-semibold mb-2">
                    {t('sidebarTitle')}
                  </p>
                  <p className="text-slate-500 mb-10">
                    {t('sidebarDesc')}
                  </p>
                  <InterestForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
