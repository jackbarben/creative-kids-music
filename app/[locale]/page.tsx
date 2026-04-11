import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SpanishToast from '@/components/SpanishToast'

export default async function Home() {
  const t = await getTranslations('home')
  const nav = await getTranslations('nav')
  const c = await getTranslations('common')

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        {/* Hero - Spare, image-forward */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text */}
              <div className="order-2 lg:order-1">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-800 leading-[1.1] tracking-tight whitespace-pre-line">
                  {t('heroTitle')}
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-md">
                  {t('heroSubtitle')}
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
                  {t('heroBody')}
                </p>
              </div>

              {/* Tree Image */}
              <div className="order-1 lg:order-2 flex justify-center">
                <Image
                  src="/media/logos/treecolors2.png"
                  alt={t('heroImageAlt')}
                  width={400}
                  height={480}
                  className="w-full max-w-xs md:max-w-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-12 md:py-16 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-slate-800 mb-12">
              {t('programs')}
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Workshops */}
              <div className="p-8 bg-cream-50 rounded-lg flex flex-col">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase">
                  {t('winterSpring')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  {nav('workshops')}
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed flex-grow">
                  {t('workshopsDesc')}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/workshops/register" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                    {c('reserveNow')}
                  </Link>
                  <Link href="/workshops" className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors">
                    {c('learnMore')}
                  </Link>
                </div>
              </div>

              {/* Summer Camp */}
              <div className="p-8 bg-cream-50 rounded-lg flex flex-col">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase">
                  {t('campDate')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  {nav('summerCamp')}
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed flex-grow">
                  {t('campDesc')}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/summer-camp/register" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                    {c('reserveNow')}
                  </Link>
                  <Link href="/summer-camp" className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors">
                    {c('learnMore')}
                  </Link>
                </div>
              </div>

              {/* Music School */}
              <div className="p-8 bg-cream-50 rounded-lg flex flex-col">
                <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase">
                  {t('fall')}
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  {nav('musicSchool')}
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed flex-grow">
                  {t('musicSchoolDesc')}
                </p>
                <div className="mt-6 flex gap-3">
                  <Link href="/music-school" className="px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full hover:bg-slate-700 transition-colors">
                    {t('joinWaitlist')}
                  </Link>
                  <Link href="/music-school" className="px-4 py-2 border border-slate-300 text-slate-600 text-sm font-medium rounded-full hover:bg-slate-50 transition-colors">
                    {c('learnMore')}
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-24 max-w-3xl mx-auto relative">
              <Image
                src="/media/photos/homepage.jpg"
                alt={t('photoAlt')}
                width={800}
                height={500}
                className="w-full rounded-lg shadow-sm"
              />
              <div className="absolute top-3 left-3 flex items-center gap-2.5 bg-black/60 backdrop-blur-sm rounded-full pl-1.5 pr-4 py-1.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  <Image
                    src="/media/logos/treecolors2.png"
                    alt=""
                    width={28}
                    height={28}
                    className="w-7 h-7 object-contain"
                  />
                </div>
                <span className="text-white text-sm font-medium" style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>{t('overlayText')}</span>
              </div>
            </div>

            <div className="mt-12 max-w-3xl mx-auto">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-sm">
                <iframe
                  src="https://www.youtube.com/embed/OyFniZn-kUg?rel=0"
                  title={t('videoTitle')}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <SpanishToast />
    </div>
  )
}
