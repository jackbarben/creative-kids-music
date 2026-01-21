import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null
function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = 'Creative Kids Music <noreply@creativekidsmusic.org>'
const ADMIN_EMAIL = 'jack@creativekidsmusic.org'
const SITE_URL = 'https://creativekidsmusic.org'

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

// Format confirmation number (first 8 chars of UUID)
function formatConfirmationNumber(id: string): string {
  return id.substring(0, 8).toUpperCase()
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
  mediaConsentInternal?: boolean
  mediaConsentMarketing?: boolean
}

export async function sendWorkshopConfirmation(data: WorkshopConfirmationData): Promise<EmailResult> {
  const subject = "You're registered! Winter/Spring Music Workshop confirmation"
  const confirmationNumber = formatConfirmationNumber(data.registrationId)

  const childrenList = data.children
    .map(c => `${c.name} (age ${c.age})`)
    .join(', ')

  const workshopList = data.workshopDates
    .map(d => `<li style="margin-bottom: 4px;">${d}</li>`)
    .join('\n')

  const paymentNote = data.tuitionAssistance
    ? 'You requested tuition assistance. We\'ll be in touch to discuss.'
    : `Total: $${data.totalAmount}. We'll send payment details in early January.`

  // Media consent summary
  let mediaConsentText = 'No photo/video permissions granted'
  if (data.mediaConsentInternal && data.mediaConsentMarketing) {
    mediaConsentText = 'Internal documentation and marketing use'
  } else if (data.mediaConsentInternal) {
    mediaConsentText = 'Internal documentation only'
  } else if (data.mediaConsentMarketing) {
    mediaConsentText = 'Marketing use only'
  }

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">You're registered!</h1>
      <p style="color: #78716c; margin-top: 0;">Winter/Spring Music Workshop</p>

      <p>Hi ${data.parentName},</p>

      <p>Thank you for registering for our Winter/Spring Music Workshop! We're excited to have you join us.</p>

      <div style="background: #f5f5f4; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #44403c; font-size: 16px; margin: 0 0 16px 0;">Registration Summary</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Confirmation #</td>
            <td style="padding: 4px 0; font-weight: 600;">${confirmationNumber}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Participant(s)</td>
            <td style="padding: 4px 0;">${childrenList}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c; vertical-align: top;">Workshop Date(s)</td>
            <td style="padding: 4px 0;">
              <ul style="margin: 0; padding-left: 16px;">${workshopList}</ul>
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Time</td>
            <td style="padding: 4px 0;">4:00–6:30 PM Workshop<br>6:30–7:00 PM Dinner (Parents Welcome to Join!)<br>7:00 PM Performance</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Location</td>
            <td style="padding: 4px 0;">St. Luke's/San Lucas Episcopal Church<br>426 E Fourth Plain Blvd, Vancouver, WA</td>
          </tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What's Included</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Music instruction and group activities</li>
        <li>Dinner for all participants</li>
        <li>Parent showcase performance at the end</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What You Agreed To</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li><a href="${SITE_URL}/terms/liability-waiver" style="color: #166534;">Liability Waiver</a></li>
        <li><a href="${SITE_URL}/terms/program-terms" style="color: #166534;">Program Terms & Conditions</a></li>
        <li>Media Consent: ${mediaConsentText}</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Payment</h2>
      <p>${paymentNote}</p>

      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #166534; font-size: 16px; margin: 0 0 12px 0;">What Happens Next</h2>
        <ol style="color: #57534e; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>Save this email</strong> for your records</li>
          <li style="margin-bottom: 8px;"><strong>Mark your calendar</strong> with the workshop date(s)</li>
          <li style="margin-bottom: 8px;"><strong>Watch for our welcome email</strong> — We'll send detailed information about a week before</li>
          <li><strong>Plan to join us for the showcase</strong> — Parents are invited back at the end!</li>
        </ol>
      </div>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Need to make changes? Contact us at
        <a href="mailto:info@creativekidsmusic.org" style="color: #166534;">info@creativekidsmusic.org</a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Thank you for being part of Creative Kids Music Project!
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music Project<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await getResend().emails.send({
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
  mediaConsentInternal?: boolean
  mediaConsentMarketing?: boolean
}

export async function sendCampConfirmation(data: CampConfirmationData): Promise<EmailResult> {
  const subject = "You're registered! Summer Camp 2026 confirmation"
  const confirmationNumber = formatConfirmationNumber(data.registrationId)

  const childrenList = data.children
    .map(c => `${c.name} (age ${c.age})`)
    .join(', ')

  const paymentNote = data.tuitionAssistance
    ? 'You requested tuition assistance. We\'ll be in touch to discuss.'
    : `Total: $${data.totalAmount}. We'll send payment details in early January.`

  // Media consent summary
  let mediaConsentText = 'No photo/video permissions granted'
  if (data.mediaConsentInternal && data.mediaConsentMarketing) {
    mediaConsentText = 'Internal documentation and marketing use'
  } else if (data.mediaConsentInternal) {
    mediaConsentText = 'Internal documentation only'
  } else if (data.mediaConsentMarketing) {
    mediaConsentText = 'Marketing use only'
  }

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #c2410c; font-size: 24px; margin-bottom: 8px;">You're registered!</h1>
      <p style="color: #78716c; margin-top: 0;">Summer Camp 2026</p>

      <p>Hi ${data.parentName},</p>

      <p>Thank you for registering for Creative Kids Music Summer Camp! We can't wait to see your family in August.</p>

      <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #44403c; font-size: 16px; margin: 0 0 16px 0;">Registration Summary</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Confirmation #</td>
            <td style="padding: 4px 0; font-weight: 600;">${confirmationNumber}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Participant(s)</td>
            <td style="padding: 4px 0;">${childrenList}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Camp Dates</td>
            <td style="padding: 4px 0;">August 3–7, 2026 (Mon–Fri)</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Daily Schedule</td>
            <td style="padding: 4px 0;">8:30 AM – 5:00 PM</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Sunday Performance</td>
            <td style="padding: 4px 0;">August 9, 9–11 AM</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Location</td>
            <td style="padding: 4px 0;">St. Luke's/San Lucas Episcopal Church<br>426 E Fourth Plain Blvd, Vancouver, WA</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Emergency Contact</td>
            <td style="padding: 4px 0;">${data.emergencyName} (${data.emergencyPhone})</td>
          </tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What's Included</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Full week of music instruction and activities</li>
        <li>Lunch provided daily</li>
        <li>Camp t-shirt</li>
        <li>Sunday showcase performance for family and friends</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What You Agreed To</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li><a href="${SITE_URL}/terms/liability-waiver" style="color: #c2410c;">Liability Waiver</a></li>
        <li><a href="${SITE_URL}/terms/program-terms" style="color: #c2410c;">Program Terms & Conditions</a></li>
        <li><a href="${SITE_URL}/terms/behavior-agreement" style="color: #c2410c;">Behavior Expectations Agreement</a></li>
        <li>Media Consent: ${mediaConsentText}</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Payment</h2>
      <p>${paymentNote}</p>

      <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #c2410c; font-size: 16px; margin: 0 0 12px 0;">What Happens Next</h2>
        <ol style="color: #57534e; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>Save this email</strong> for your records</li>
          <li style="margin-bottom: 8px;"><strong>Mark your calendar</strong> for August 3–7 (and the Sunday performance!)</li>
          <li style="margin-bottom: 8px;"><strong>Watch for our welcome packet</strong> — We'll send detailed information closer to camp including what to bring, daily schedule, and drop-off procedures</li>
          <li><strong>Plan to attend the Sunday showcase</strong> — Your camper will perform!</li>
        </ol>
      </div>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Need to make changes? Contact us at
        <a href="mailto:info@creativekidsmusic.org" style="color: #c2410c;">info@creativekidsmusic.org</a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Thank you for being part of Creative Kids Music Project!
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music Project<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await getResend().emails.send({
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
        <a href="mailto:info@creativekidsmusic.org" style="color: #44403c;">info@creativekidsmusic.org</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
    </div>
  `

  try {
    const { data: result, error } = await getResend().emails.send({
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
    const { data: result, error } = await getResend().emails.send({
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

// ============================================
// Contact Form Email
// ============================================

interface ContactFormData {
  name: string
  email: string
  subject: string
  message: string
}

export async function sendContactFormEmail(data: ContactFormData): Promise<EmailResult> {
  const emailSubject = `Contact Form: ${data.subject}`

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 20px;">New Contact Form Submission</h1>

      <div style="background: #f5f5f4; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <p style="margin: 0 0 12px 0;"><strong>From:</strong> ${data.name}</p>
        <p style="margin: 0 0 12px 0;"><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
        <p style="margin: 0;"><strong>Subject:</strong> ${data.subject}</p>
      </div>

      <h2 style="color: #44403c; font-size: 16px;">Message:</h2>
      <div style="background: #fafaf9; border-left: 4px solid #166534; padding: 16px; margin: 16px 0;">
        <p style="margin: 0; white-space: pre-wrap;">${data.message}</p>
      </div>

      <p style="margin-top: 24px;">
        <a href="mailto:${data.email}?subject=Re: ${encodeURIComponent(data.subject)}" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px;">
          Reply to ${data.name}
        </a>
      </p>
    </div>
  `

  try {
    const { data: result, error } = await getResend().emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      replyTo: data.email,
      subject: emailSubject,
      html,
    })

    if (error) {
      await logEmail(ADMIN_EMAIL, 'contact_form', emailSubject, null, null, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(ADMIN_EMAIL, 'contact_form', emailSubject, null, null, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(ADMIN_EMAIL, 'contact_form', emailSubject, null, null, 'failed', null)
    return { success: false, error: String(error) }
  }
}
