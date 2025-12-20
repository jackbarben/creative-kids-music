import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

const resend = new Resend(process.env.RESEND_API_KEY)

const FROM_EMAIL = 'Creative Kids Music <noreply@creativekidsmusic.org>'
const ADMIN_EMAIL = 'jack@creativekidsmusic.org'

type EmailResult = {
  success: boolean
  id?: string
  error?: string
}

async function logEmail(
  recipientEmail: string,
  emailType: string,
  subject: string,
  entityType: string | null,
  entityId: string | null,
  status: 'sent' | 'failed',
  providerId: string | null
) {
  try {
    const supabase = await createClient()
    await supabase.from('email_log').insert({
      recipient_email: recipientEmail,
      email_type: emailType,
      subject,
      entity_type: entityType,
      entity_id: entityId,
      status,
      provider_id: providerId,
    })
  } catch (error) {
    console.error('Failed to log email:', error)
  }
}

// ============================================
// Workshop Confirmation Email
// ============================================

interface WorkshopConfirmationData {
  parentName: string
  parentEmail: string
  children: { name: string; age: number }[]
  workshopDates: string[]
  totalAmount: number
  paymentMethod: string
  tuitionAssistance: boolean
  registrationId: string
}

export async function sendWorkshopConfirmation(data: WorkshopConfirmationData): Promise<EmailResult> {
  const subject = 'Workshop Registration Confirmed'

  const childrenList = data.children
    .map(c => `${c.name} (age ${c.age})`)
    .join(', ')

  const workshopList = data.workshopDates
    .map(d => `  • ${d}`)
    .join('\n')

  const paymentNote = data.tuitionAssistance
    ? 'You requested tuition assistance. We\'ll be in touch to discuss.'
    : data.paymentMethod === 'online'
    ? `Total: $${data.totalAmount}. Please complete payment at the link below.`
    : `Total: $${data.totalAmount}. Payment due at the workshop.`

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px;">You're registered!</h1>

      <p>Hi ${data.parentName},</p>

      <p>Thank you for registering for Creative Kids Music workshops. We're excited to have your family join us!</p>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Registration Details</h2>

      <p><strong>Children:</strong> ${childrenList}</p>

      <p><strong>Workshops:</strong></p>
      <div style="margin-left: 16px; white-space: pre-line;">${workshopList}</div>

      <p><strong>Time:</strong> 3:30 – 7:30 PM</p>
      <p><strong>Location:</strong> St. Luke's/San Lucas Episcopal Church<br>
      4106 NE St. Johns Rd, Vancouver, WA</p>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Payment</h2>
      <p>${paymentNote}</p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Reply to this email or contact us at
        <a href="mailto:connect@creativekidsmusic.org" style="color: #166534;">connect@creativekidsmusic.org</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.parentEmail,
      subject,
      html,
    })

    if (error) {
      await logEmail(data.parentEmail, 'workshop_confirmation', subject, 'workshop_registration', data.registrationId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.parentEmail, 'workshop_confirmation', subject, 'workshop_registration', data.registrationId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.parentEmail, 'workshop_confirmation', subject, 'workshop_registration', data.registrationId, 'failed', null)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Camp Confirmation Email
// ============================================

interface CampConfirmationData {
  parentName: string
  parentEmail: string
  children: { name: string; age: number }[]
  emergencyName: string
  emergencyPhone: string
  totalAmount: number
  paymentMethod: string
  tuitionAssistance: boolean
  registrationId: string
}

export async function sendCampConfirmation(data: CampConfirmationData): Promise<EmailResult> {
  const subject = 'Summer Camp Registration Confirmed'

  const childrenList = data.children
    .map(c => `${c.name} (age ${c.age})`)
    .join(', ')

  const paymentNote = data.tuitionAssistance
    ? 'You requested tuition assistance. We\'ll be in touch to discuss.'
    : data.paymentMethod === 'online'
    ? `Total: $${data.totalAmount}. Please complete payment at the link below.`
    : `Total: $${data.totalAmount}. Payment due before camp begins (June 15).`

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #c2410c; font-size: 24px;">You're registered for camp!</h1>

      <p>Hi ${data.parentName},</p>

      <p>Thank you for registering for Creative Kids Music Summer Camp. We can't wait to see your family in June!</p>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Camp Details</h2>

      <p><strong>Dates:</strong> June 22–28, 2026</p>
      <p><strong>Time:</strong> Monday–Friday, 8:30 AM – 5:00 PM</p>
      <p><strong>Sunday Performance:</strong> 10:00 AM</p>
      <p><strong>Location:</strong> St. Luke's/San Lucas Episcopal Church<br>
      4106 NE St. Johns Rd, Vancouver, WA</p>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Your Registration</h2>

      <p><strong>Children:</strong> ${childrenList}</p>

      <p><strong>Emergency Contact:</strong> ${data.emergencyName} (${data.emergencyPhone})</p>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Payment</h2>
      <p>${paymentNote}</p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        We'll send more details about what to bring and daily schedule closer to camp.
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Questions? Reply to this email or contact us at
        <a href="mailto:connect@creativekidsmusic.org" style="color: #c2410c;">connect@creativekidsmusic.org</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.parentEmail,
      subject,
      html,
    })

    if (error) {
      await logEmail(data.parentEmail, 'camp_confirmation', subject, 'camp_registration', data.registrationId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.parentEmail, 'camp_confirmation', subject, 'camp_registration', data.registrationId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.parentEmail, 'camp_confirmation', subject, 'camp_registration', data.registrationId, 'failed', null)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Waitlist Confirmation Email
// ============================================

interface WaitlistConfirmationData {
  parentName: string
  parentEmail: string
  signupId: string
}

export async function sendWaitlistConfirmation(data: WaitlistConfirmationData): Promise<EmailResult> {
  const subject = 'You\'re on the Music School Waitlist'

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #44403c; font-size: 24px;">You're on the list!</h1>

      <p>Hi ${data.parentName},</p>

      <p>Thank you for your interest in Creative Kids Music School. We've added you to our waitlist for the Fall 2026 after-school program.</p>

      <p>We're finalizing program details and will be in touch when registration opens. You'll be among the first to know!</p>

      <p>In the meantime, consider joining us for a <strong>workshop</strong> or <strong>summer camp</strong> to get a taste of what we do.</p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Reply to this email or contact us at
        <a href="mailto:connect@creativekidsmusic.org" style="color: #44403c;">connect@creativekidsmusic.org</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.parentEmail,
      subject,
      html,
    })

    if (error) {
      await logEmail(data.parentEmail, 'waitlist_confirmation', subject, 'waitlist_signup', data.signupId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.parentEmail, 'waitlist_confirmation', subject, 'waitlist_signup', data.signupId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.parentEmail, 'waitlist_confirmation', subject, 'waitlist_signup', data.signupId, 'failed', null)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Magic Link Email
// ============================================

interface MagicLinkEmailData {
  email: string
  magicLink: string
}

export async function sendMagicLinkEmail(data: MagicLinkEmailData): Promise<EmailResult> {
  const subject = 'Access Your Registrations'

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px;">View Your Registrations</h1>

      <p>You requested access to view your Creative Kids Music registrations.</p>

      <p>Click the button below to view your registrations, update contact info, or request changes:</p>

      <p style="margin: 32px 0;">
        <a href="${data.magicLink}" style="display: inline-block; background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 500;">
          View My Registrations
        </a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        This link will expire in 24 hours. If you didn't request this, you can safely ignore this email.
      </p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Contact us at
        <a href="mailto:connect@creativekidsmusic.org" style="color: #166534;">connect@creativekidsmusic.org</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject,
      html,
    })

    if (error) {
      console.error('Magic link email failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Magic link email failed:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Admin Notification Emails
// ============================================

interface AdminNotificationData {
  type: 'workshop' | 'camp' | 'waitlist'
  parentName: string
  parentEmail: string
  childrenCount: number
  tuitionAssistance?: boolean
  registrationId: string
}

export async function sendAdminNotification(data: AdminNotificationData): Promise<EmailResult> {
  const typeLabels = {
    workshop: 'Workshop Registration',
    camp: 'Summer Camp Registration',
    waitlist: 'Music School Waitlist Signup',
  }

  const subject = `New ${typeLabels[data.type]}: ${data.parentName}`

  const adminUrl = data.type === 'waitlist'
    ? `https://creativekidsmusic.org/admin/waitlist/${data.registrationId}`
    : data.type === 'workshop'
    ? `https://creativekidsmusic.org/admin/workshops/${data.registrationId}`
    : `https://creativekidsmusic.org/admin/camp/${data.registrationId}`

  const assistanceNote = data.tuitionAssistance
    ? '<p style="color: #dc2626; font-weight: bold;">⚠️ Tuition assistance requested</p>'
    : ''

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 20px;">New ${typeLabels[data.type]}</h1>

      ${assistanceNote}

      <p><strong>Parent:</strong> ${data.parentName}</p>
      <p><strong>Email:</strong> <a href="mailto:${data.parentEmail}">${data.parentEmail}</a></p>
      <p><strong>Children:</strong> ${data.childrenCount}</p>

      <p style="margin-top: 24px;">
        <a href="${adminUrl}" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          View in Admin
        </a>
      </p>
    </div>
  `

  try {
    const { data: result, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject,
      html,
    })

    if (error) {
      console.error('Admin notification failed:', error)
      return { success: false, error: error.message }
    }

    return { success: true, id: result?.id }
  } catch (error) {
    console.error('Admin notification failed:', error)
    return { success: false, error: String(error) }
  }
}
