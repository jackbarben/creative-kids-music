import { Link } from '@/i18n/navigation'
import { getTranslations, getLocale } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const HIGHLIGHTS = [
  { date: '2026-05-01', videoId: 'TyjkujxA-lU' },
  { date: '2026-03-20', videoId: 'J7V7OAiYykI' },
  { date: '2026-02-20', videoId: 'OyFniZn-kUg' },
]

export default async function WorkshopsPage() {
  const t = await getTranslations('workshops')
  const nav = await getTranslations('nav')
  const locale = await getLocale()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString(locale === 'es' ? 'es-US' : 'en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
              {/* Main Content */}
              <div className="md:col-span-7">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase mb-6">
                  {t('season')}
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

                <div className="mt-16">
                  <h2 className="font-display text-3xl font-semibold text-slate-800">
                    {t('highlightsTitle')}
                  </h2>
                  <p className="mt-3 text-slate-600 leading-relaxed">
                    {t('highlightsBody')}
                  </p>
                  <div className="mt-10 space-y-12">
                    {HIGHLIGHTS.map(({ date, videoId }) => (
                      <div key={videoId}>
                        <p className="text-xs text-slate-500 font-semibold tracking-widest uppercase mb-3">
                          {formatDate(date)}
                        </p>
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                            title={`${t('title')} — ${formatDate(date)}`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    {t('seasonStatusLabel')}
                  </h2>

                  <p className="font-display text-2xl font-semibold text-slate-800">
                    {t('seasonComplete')}
                  </p>
                  <p className="mt-4 text-slate-600 leading-relaxed">
                    {t('seasonCompleteBody')}
                  </p>

                  <div className="mt-10 space-y-4">
                    <Link
                      href="/summer-camp"
                      className="block p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-400 transition-colors group"
                    >
                      <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase">
                        {t('summerCampDates')}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                        {nav('summerCamp')} →
                      </p>
                    </Link>
                    <Link
                      href="/music-school"
                      className="block p-5 bg-white rounded-lg border border-slate-200 hover:border-slate-400 transition-colors group"
                    >
                      <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase">
                        {t('musicSchoolWhen')}
                      </p>
                      <p className="mt-1 font-display text-lg font-semibold text-slate-800 group-hover:text-slate-900">
                        {nav('musicSchool')} →
                      </p>
                    </Link>
                  </div>
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
