'use server'

import { sendContactFormEmail } from '@/lib/email'

interface ContactFormState {
  success?: boolean
  error?: string
}

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
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
    return { success: false, error: 'Please fill in all required fields.' }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }

  if (message.length < 10) {
    return { success: false, error: 'Please enter a longer message.' }
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
      return { success: false, error: 'Failed to send message. Please try again.' }
    }

    return { success: true }
  } catch (error) {
    console.error('Contact form error:', error)
    return { success: false, error: 'An unexpected error occurred. Please try again.' }
  }
}
