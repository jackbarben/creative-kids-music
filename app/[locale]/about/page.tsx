import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function AboutPage() {
  const t = await getTranslations('about')
  const c = await getTranslations('common')

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              {t('title')}
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <Image
              src="/media/photos/jack.jpg"
              alt={t('jackAlt')}
              width={200}
              height={250}
              className="float-right ml-8 mb-6 rounded-lg shadow-sm w-40 md:w-52"
            />
            <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>{t('bio1')}</p>
                <p className="text-slate-800 font-medium">{t('bio2')}</p>
                <p>{t('bio3')}</p>
                <p className="text-slate-800 font-medium">{t('bio4')}</p>
                <p>{t('bio5')}</p>
            </div>

            {/* Our Home */}
            <div className="mt-16 pt-16 border-t border-slate-200">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-6">
                {t('ourHome')}
              </h2>
              <p className="text-lg text-slate-600 leading-relaxed">
                {t('ourHomeDesc')}
              </p>
              <div className="mt-8 rounded-lg overflow-hidden border border-slate-200">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2783.8731095673986!2d-122.67088892341044!3d45.64088897107754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x5495af41d9f9b9c7%3A0x7c3b5a5d3a5c5a5a!2s426%20E%20Fourth%20Plain%20Blvd%2C%20Vancouver%2C%20WA%2098663!5e0!3m2!1sen!2sus!4v1703084400000!5m2!1sen!2sus"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={t('churchName')}
                ></iframe>
                <div className="p-4 bg-slate-50">
                  <p className="font-medium text-slate-800">{t('churchName')}</p>
                  <p className="text-slate-600 text-sm mt-1">{t('churchAddress')}</p>
                  <a
                    href="https://maps.google.com/?q=426+E+Fourth+Plain+Blvd+Vancouver+WA+98663"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-slate-700 hover:text-slate-900 underline underline-offset-4"
                  >
                    {t('getDirections')} →
                  </a>
                </div>
              </div>
              <div className="mt-8">
                <Image
                  src="/media/photos/st-lukes.jpg"
                  alt={t('churchPhotoAlt')}
                  width={800}
                  height={500}
                  className="w-full rounded-lg shadow-sm"
                />
              </div>
            </div>

            {/* Invitation */}
            <div className="mt-16 pt-16 border-t border-slate-200">
              <p className="text-xl text-slate-700 font-medium leading-relaxed">
                {t('invitation')}
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <p className="text-slate-500">
              {c('questions')}{' '}
              <a href="mailto:info@creativekidsmusic.org" className="text-slate-700 hover:text-slate-900 underline underline-offset-4">
                info@creativekidsmusic.org
              </a>
              {' '}{c('or')}{' '}
              <a href="tel:+13605242265" className="text-slate-700 hover:text-slate-900 underline underline-offset-4">
                (360) 524-2265
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
