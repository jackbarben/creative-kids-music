'use server'

import { sendContactFormEmail } from '@/lib/email'
import { getTranslations } from 'next-intl/server'

interface ContactFormState {
  success?: boolean
  error?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const locale = (formData.get('locale') as string) || 'en'
  const t = await getTranslations({ locale, namespace: 'forms.validation' })

  // Honeypot check
  const honeypot = formData.get('website')
  if (honeypot) {
    // Silently reject spam
    return { success: true }
  }

  const name = formData.get('name')?.toString().trim()
  const email = formData.get('email')?.toString().trim()
  const subject = formData.get('subject')?.toString().trim()
  const message = formData.get('message')?.toString().trim()

  // Validation
  if (!name || !email || !message) {
    return { success: false, error: t('fillRequired') }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: t('validEmail') }
  }

  if (message.length < 10) {
    return { success: false, error: t('longerMessage') }
  }

  try {
    const result = await sendContactFormEmail({
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
    })

    if (!result.success) {
      console.error('Contact form email failed:', result.error)
      return { success: false, error: t('sendFailed') }
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: t('unexpectedError') }
  }
}
