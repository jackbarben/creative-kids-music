'use client'

import { NextIntlClientProvider } from 'next-intl'
import Header from './Header'
import Footer from './Footer'

// Minimal English messages for pages outside [locale] layout
const messages = {
  nav: {
    home: 'Home',
    about: 'About',
    workshops: 'Workshops',
    summerCamp: 'Summer Camp',
    musicSchool: 'Music School',
    faq: 'FAQ',
    contact: 'Contact',
    account: 'Account',
  },
  footer: {
    tagline: 'Where children discover the musician inside.',
    termsConditions: 'Terms & Conditions',
    refundPolicy: 'Refund Policy',
    liabilityWaiver: 'Liability Waiver',
  },
}

export function HeaderWithIntl() {
  return (
    <NextIntlClientProvider locale='en' messages={messages}>
      <Header />
    </NextIntlClientProvider>
  )
}

export function FooterWithIntl() {
  return (
    <NextIntlClientProvider locale='en' messages={messages}>
      <Footer />
    </NextIntlClientProvider>
  )
}
