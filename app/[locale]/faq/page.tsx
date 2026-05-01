import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default async function FAQPage() {
  const t = await getTranslations('faq')
  const c = await getTranslations('common')

  const faqs = [
    { question: t('q1'), answer: t('a1') },
    { question: t('q2'), answer: t('a2') },
    { question: t('q3'), answer: t('a3') },
    { question: t('q4'), answer: t('a4') },
    { question: t('q5'), answer: t('a5') },
    { question: t('q6'), answer: t('a6') },
    { question: t('q7'), answer: t('a7') },
    { question: t('q8'), answer: t('a8') },
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              {t('title')}
            </h1>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="space-y-12">
              {faqs.map((faq, index) => (
                <div key={index} className="pb-12 border-b border-slate-200 last:border-0 last:pb-0">
                  <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                    {faq.question}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-16">
              <Image
                src="/media/photos/faq.jpg"
                alt={t('photoAlt')}
                width={800}
                height={500}
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <p className="text-slate-500">
              {c('moreQuestions')}{' '}
              <a href="mailto:creativekidsmusicproject@gmail.com" className="text-slate-700 hover:text-slate-900 underline underline-offset-4">
                creativekidsmusicproject@gmail.com
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
