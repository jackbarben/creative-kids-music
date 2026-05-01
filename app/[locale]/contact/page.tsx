'use client'

import { useFormState } from 'react-dom'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { submitContactForm } from './actions'
import { SubmitButton } from '@/components/forms'

const initialState = { success: false, error: undefined as string | undefined }

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)
  const t = useTranslations('contact')
  const about = useTranslations('about')

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              {t('title')}
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl">
              {t('subtitle')}
            </p>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-2xl mx-auto px-6 md:px-12">
            {state.success ? (
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-800 mb-2">{t('successTitle')}</h2>
                <p className="text-slate-600">{t('successBody')}</p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input type="text" id="website" name="website" tabIndex={-1} autoComplete="off" />
                </div>

                {state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {state.error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('yourName')} <span className="text-terracotta-500">*</span>
                  </label>
                  <input
                    type="text" id="name" name="name" required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                    placeholder={t('namePlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('email')} <span className="text-terracotta-500">*</span>
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                    placeholder={t('emailPlaceholder')}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('subject')}
                  </label>
                  <select
                    id="subject" name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="General Inquiry">{t('subjectOptions.general')}</option>
                    <option value="Workshops">{t('subjectOptions.workshops')}</option>
                    <option value="Summer Camp">{t('subjectOptions.camp')}</option>
                    <option value="Music School">{t('subjectOptions.musicSchool')}</option>
                    <option value="Tuition Assistance">{t('subjectOptions.assistance')}</option>
                    <option value="Volunteering">{t('subjectOptions.volunteering')}</option>
                    <option value="Other">{t('subjectOptions.other')}</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    {t('message')} <span className="text-terracotta-500">*</span>
                  </label>
                  <textarea
                    id="message" name="message" required rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800 resize-none"
                    placeholder={t('messagePlaceholder')}
                  />
                </div>

                <SubmitButton className="w-full py-4">{t('send')}</SubmitButton>
              </form>
            )}

            <div className="mt-12 pt-12 border-t border-slate-200">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                {t('otherWays')}
              </h2>
              <div className="space-y-3 text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">{t('emailLabel')}</span>{' '}
                  <a href="mailto:creativekidsmusicproject@gmail.com" className="text-forest-600 hover:text-forest-700 underline underline-offset-4">
                    creativekidsmusicproject@gmail.com
                  </a>
                </p>
                <p>
                  <span className="font-medium text-slate-700">{t('phoneLabel')}</span>{' '}
                  <a href="tel:+13605242265" className="text-forest-600 hover:text-forest-700 underline underline-offset-4">
                    (360) 524-2265
                  </a>
                </p>
                <p>
                  <span className="font-medium text-slate-700">{t('locationLabel')}</span>{' '}
                  {about('churchName')}<br />
                  <span className="text-slate-500">{about('churchAddress')}</span>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
