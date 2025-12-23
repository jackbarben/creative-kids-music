'use client'

import { useFormState } from 'react-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { submitContactForm } from './actions'
import { SubmitButton } from '@/components/forms'

const initialState = { success: false, error: undefined as string | undefined }

export default function ContactPage() {
  const [state, formAction] = useFormState(submitContactForm, initialState)

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        {/* Hero */}
        <section className="pt-24 pb-12 md:pt-32 md:pb-16">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              Contact Us
            </h1>
            <p className="mt-6 text-xl text-slate-600 max-w-2xl">
              Have a question about our programs? Want to learn more about Creative Kids Music? We&apos;d love to hear from you.
            </p>
          </div>
        </section>

        {/* Form Section */}
        <section className="pb-24 md:pb-32">
          <div className="max-w-2xl mx-auto px-6 md:px-12">
            {state.success ? (
              <div className="bg-forest-50 border border-forest-200 rounded-xl p-8 text-center">
                <div className="w-16 h-16 bg-forest-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="font-display text-2xl font-semibold text-slate-800 mb-2">Message Sent</h2>
                <p className="text-slate-600">
                  Thank you for reaching out. We&apos;ll get back to you as soon as possible.
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-6">
                {/* Honeypot */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website">Website</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                {state.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                    {state.error}
                  </div>
                )}

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                    Your Name <span className="text-terracotta-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                    placeholder="Jane Smith"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                    Email Address <span className="text-terracotta-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                    placeholder="jane@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Summer Camp">Summer Camp</option>
                    <option value="Music School">Music School (Fall 2026)</option>
                    <option value="Tuition Assistance">Tuition Assistance</option>
                    <option value="Volunteering">Volunteering</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                    Message <span className="text-terracotta-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-forest-500 focus:border-transparent bg-white text-slate-800 resize-none"
                    placeholder="How can we help you?"
                  />
                </div>

                <SubmitButton className="w-full py-4">Send Message</SubmitButton>
              </form>
            )}

            {/* Alternative Contact */}
            <div className="mt-12 pt-12 border-t border-slate-200">
              <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                Other Ways to Reach Us
              </h2>
              <div className="space-y-3 text-slate-600">
                <p>
                  <span className="font-medium text-slate-700">Email:</span>{' '}
                  <a href="mailto:info@creativekidsmusic.org" className="text-forest-600 hover:text-forest-700 underline underline-offset-4">
                    info@creativekidsmusic.org
                  </a>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Phone:</span>{' '}
                  <a href="tel:+13605242265" className="text-forest-600 hover:text-forest-700 underline underline-offset-4">
                    (360) 524-2265
                  </a>
                </p>
                <p>
                  <span className="font-medium text-slate-700">Location:</span>{' '}
                  St. Luke&apos;s / San Lucas Episcopal Church<br />
                  <span className="text-slate-500">426 E Fourth Plain Blvd, Vancouver, WA 98663</span>
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
