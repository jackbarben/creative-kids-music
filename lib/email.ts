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
const ADMIN_EMAILS = [
  'creativekidsmusicproject@gmail.com',
]
const SITE_URL = 'https://creativekidsmusic.org'

// Legal disclaimer for bilingual emails
const BILINGUAL_DISCLAIMER = `
  <div style="background: #f1f5f9; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 13px; color: #64748b;">
    <p style="margin: 0 0 8px 0;"><em>This email has been translated into Spanish for your convenience. In the event of any discrepancy between the English and Spanish versions, the English version shall prevail.</em></p>
    <p style="margin: 0;"><em>Este correo electrónico ha sido traducido al español para su conveniencia. En caso de cualquier discrepancia entre las versiones en inglés y en español, prevalecerá la versión en inglés.</em></p>
  </div>
`

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
  // Location/schedule from database
  location?: string
  address?: string
  schedule?: string // e.g., "4:00–6:30 PM Workshop<br>6:30–7:00 PM Dinner<br>7:00 PM Performance"
  locale?: string
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
    : `Total: $${data.totalAmount}. Payment is collected day-of—we'll help you set up the church's Vanco portal, or you can pay by check or cash.`

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
            <td style="padding: 4px 0;">${data.schedule || '4:00–6:30 PM Workshop<br>6:30–7:00 PM Dinner — Parents, please join us!<br>7:00 PM Performance for Parents'}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Location</td>
            <td style="padding: 4px 0;">${data.location || "St. Luke's/San Lucas Episcopal Church"}<br>${data.address || '426 E Fourth Plain Blvd, Vancouver, WA'}</td>
          </tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What's Included</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Music instruction and group activities</li>
        <li>Dinner for kids and parents — please join us!</li>
        <li>Performance at 7:00 PM for parents to see what they've created</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">What You Agreed To</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li><a href="${SITE_URL}/en/terms/liability-waiver" style="color: #166534;">Liability Waiver</a></li>
        <li><a href="${SITE_URL}/en/terms/program-terms" style="color: #166534;">Program Terms & Conditions</a></li>
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

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #334155; font-size: 16px; margin: 0 0 12px 0;">Manage Your Registration Online</h2>
        <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
          Create a free parent account to view your registrations, update contact info, and track payment status.
        </p>
        <a href="${SITE_URL}/account/create?email=${encodeURIComponent(data.parentEmail)}"
           style="display: inline-block; background: #166534; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          Create Account
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Need to make changes? Contact us at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #166534;">creativekidsmusicproject@gmail.com</a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Thank you for being part of Creative Kids Music Project!
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music Project<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
      ${data.locale === 'es' ? `
      <hr style="border: none; border-top: 2px solid #166534; margin: 32px 0;">
      ${BILINGUAL_DISCLAIMER}
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">\u00a1Est\u00e1s registrado/a!</h1>
      <p style="color: #78716c; margin-top: 0;">Taller de M\u00fasica \u2014 Invierno/Primavera</p>

      <p>Hola ${data.parentName},</p>

      <p>\u00a1Gracias por inscribirte en nuestro Taller de M\u00fasica de Invierno/Primavera! Estamos emocionados de que te unas a nosotros.</p>

      <div style="background: #f5f5f4; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #44403c; font-size: 16px; margin: 0 0 16px 0;">Resumen de Inscripci\u00f3n</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #78716c;">Confirmaci\u00f3n #</td><td style="padding: 4px 0; font-weight: 600;">${confirmationNumber}</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Participante(s)</td><td style="padding: 4px 0;">${childrenList}</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c; vertical-align: top;">Fecha(s) del Taller</td><td style="padding: 4px 0;"><ul style="margin: 0; padding-left: 16px;">${workshopList}</ul></td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Horario</td><td style="padding: 4px 0;">4:00\u20136:30 PM Taller<br>6:30\u20137:00 PM Cena \u2014 \u00a1Padres, acomp\u00e1\u00f1ennos!<br>7:00 PM Presentaci\u00f3n para Padres</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Ubicaci\u00f3n</td><td style="padding: 4px 0;">${data.location || "St. Luke's/San Lucas Episcopal Church"}<br>${data.address || '426 E Fourth Plain Blvd, Vancouver, WA'}</td></tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Qu\u00e9 Incluye</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Instrucci\u00f3n musical y actividades en grupo</li>
        <li>Cena para ni\u00f1os y padres \u2014 \u00a1acomp\u00e1\u00f1ennos!</li>
        <li>Presentaci\u00f3n a las 7:00 PM para que los padres vean lo que han creado</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Pago</h2>
      <p>${data.tuitionAssistance
        ? 'Solicitaste asistencia de matr\u00edcula. Nos pondremos en contacto para conversar.'
        : `Total: $${data.totalAmount}. El pago se recoge el d\u00eda del evento \u2014 te ayudaremos a configurar el portal Vanco de la iglesia, o puedes pagar con cheque o efectivo.`}</p>

      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #166534; font-size: 16px; margin: 0 0 12px 0;">Pr\u00f3ximos Pasos</h2>
        <ol style="color: #57534e; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>Guarda este correo</strong> para tus registros</li>
          <li style="margin-bottom: 8px;"><strong>Marca tu calendario</strong> con la(s) fecha(s) del taller</li>
          <li style="margin-bottom: 8px;"><strong>Espera nuestro correo de bienvenida</strong> \u2014 Enviaremos informaci\u00f3n detallada una semana antes</li>
          <li><strong>Planea acompa\u00f1arnos para la presentaci\u00f3n</strong> \u2014 \u00a1Los padres est\u00e1n invitados!</li>
        </ol>
      </div>

      <p style="color: #78716c; font-size: 14px;">
        \u00bfNecesitas hacer cambios? Cont\u00e1ctanos en
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #166534;">creativekidsmusicproject@gmail.com</a>
      </p>
      ` : ''}
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
  locale?: string
}

export async function sendCampConfirmation(data: CampConfirmationData): Promise<EmailResult> {
  const subject = "You're registered! Summer Camp 2026 confirmation"
  const confirmationNumber = formatConfirmationNumber(data.registrationId)

  const childrenList = data.children
    .map(c => `${c.name} (age ${c.age})`)
    .join(', ')

  const paymentNote = data.tuitionAssistance
    ? 'You requested tuition assistance. We\'ll be in touch to discuss.'
    : `Total: $${data.totalAmount}. Payment is collected day-of—we'll help you set up the church's Vanco portal, or you can pay by check or cash.`

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
        <li><a href="${SITE_URL}/en/terms/liability-waiver" style="color: #c2410c;">Liability Waiver</a></li>
        <li><a href="${SITE_URL}/en/terms/program-terms" style="color: #c2410c;">Program Terms & Conditions</a></li>
        <li><a href="${SITE_URL}/en/terms/behavior-agreement" style="color: #c2410c;">Behavior Expectations Agreement</a></li>
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

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #334155; font-size: 16px; margin: 0 0 12px 0;">Manage Your Registration Online</h2>
        <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
          Create a free parent account to view your registrations, update contact info, and track payment status.
        </p>
        <a href="${SITE_URL}/account/create?email=${encodeURIComponent(data.parentEmail)}"
           style="display: inline-block; background: #c2410c; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          Create Account
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Need to make changes? Contact us at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #c2410c;">creativekidsmusicproject@gmail.com</a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Thank you for being part of Creative Kids Music Project!
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music Project<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
      ${data.locale === 'es' ? `
      <hr style="border: none; border-top: 2px solid #c2410c; margin: 32px 0;">
      ${BILINGUAL_DISCLAIMER}
      <h1 style="color: #c2410c; font-size: 24px; margin-bottom: 8px;">\u00a1Est\u00e1s registrado/a!</h1>
      <p style="color: #78716c; margin-top: 0;">Campamento de Verano 2026</p>

      <p>Hola ${data.parentName},</p>

      <p>\u00a1Gracias por inscribirte en el Campamento de Verano de Creative Kids Music! No podemos esperar a ver a tu familia en agosto.</p>

      <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #44403c; font-size: 16px; margin: 0 0 16px 0;">Resumen de Inscripci\u00f3n</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 4px 0; color: #78716c;">Confirmaci\u00f3n #</td><td style="padding: 4px 0; font-weight: 600;">${confirmationNumber}</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Participante(s)</td><td style="padding: 4px 0;">${childrenList}</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Fechas del Campamento</td><td style="padding: 4px 0;">3\u20137 de agosto de 2026 (lunes a viernes)</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Horario Diario</td><td style="padding: 4px 0;">8:30 AM \u2013 5:00 PM</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Presentaci\u00f3n Domingo</td><td style="padding: 4px 0;">9 de agosto, 9\u201311 AM</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Ubicaci\u00f3n</td><td style="padding: 4px 0;">St. Luke's/San Lucas Episcopal Church<br>426 E Fourth Plain Blvd, Vancouver, WA</td></tr>
          <tr><td style="padding: 4px 0; color: #78716c;">Contacto de Emergencia</td><td style="padding: 4px 0;">${data.emergencyName} (${data.emergencyPhone})</td></tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Qu\u00e9 Incluye</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Semana completa de instrucci\u00f3n musical y actividades</li>
        <li>Almuerzo incluido todos los d\u00edas</li>
        <li>Camiseta del campamento</li>
        <li>Presentaci\u00f3n del domingo para familia y amigos</li>
      </ul>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Pago</h2>
      <p>${data.tuitionAssistance
        ? 'Solicitaste asistencia de matr\u00edcula. Nos pondremos en contacto para conversar.'
        : `Total: $${data.totalAmount}. El pago se recoge el d\u00eda del evento \u2014 te ayudaremos a configurar el portal Vanco de la iglesia, o puedes pagar con cheque o efectivo.`}</p>

      <div style="background: #fff7ed; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #c2410c; font-size: 16px; margin: 0 0 12px 0;">Pr\u00f3ximos Pasos</h2>
        <ol style="color: #57534e; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;"><strong>Guarda este correo</strong> para tus registros</li>
          <li style="margin-bottom: 8px;"><strong>Marca tu calendario</strong> del 3 al 7 de agosto (\u00a1y la presentaci\u00f3n del domingo!)</li>
          <li style="margin-bottom: 8px;"><strong>Espera nuestro paquete de bienvenida</strong> \u2014 Enviaremos informaci\u00f3n detallada antes del campamento</li>
          <li><strong>Planea asistir a la presentaci\u00f3n del domingo</strong> \u2014 \u00a1Tu campista actuar\u00e1!</li>
        </ol>
      </div>

      <p style="color: #78716c; font-size: 14px;">
        \u00bfNecesitas hacer cambios? Cont\u00e1ctanos en
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #c2410c;">creativekidsmusicproject@gmail.com</a>
      </p>
      ` : ''}
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
  locale?: string
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

      <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #334155; font-size: 16px; margin: 0 0 12px 0;">Stay Connected</h2>
        <p style="color: #64748b; margin: 0 0 16px 0; font-size: 14px;">
          Create a free parent account to manage your waitlist signup and be first to know when registration opens.
        </p>
        <a href="${SITE_URL}/account/create?email=${encodeURIComponent(data.parentEmail)}"
           style="display: inline-block; background: #44403c; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; font-weight: 500;">
          Create Account
        </a>
      </div>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Reply to this email or contact us at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #44403c;">creativekidsmusicproject@gmail.com</a>
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music<br>
        St. Luke's/San Lucas Episcopal Church<br>
        Vancouver, WA
      </p>
      ${data.locale === 'es' ? `
      <hr style="border: none; border-top: 2px solid #44403c; margin: 32px 0;">
      ${BILINGUAL_DISCLAIMER}
      <h1 style="color: #44403c; font-size: 24px;">\u00a1Est\u00e1s en la lista!</h1>

      <p>Hola ${data.parentName},</p>

      <p>Gracias por tu inter\u00e9s en Creative Kids Music School. Te hemos agregado a nuestra lista de espera para el programa despu\u00e9s de clases de oto\u00f1o 2026.</p>

      <p>Estamos finalizando los detalles del programa y te contactaremos cuando se abra la inscripci\u00f3n. \u00a1Ser\u00e1s de los primeros en saberlo!</p>

      <p>Mientras tanto, considera unirte a un <strong>taller</strong> o <strong>campamento de verano</strong> para conocer lo que hacemos.</p>

      <p style="color: #78716c; font-size: 14px;">
        \u00bfPreguntas? Cont\u00e1ctanos en
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #44403c;">creativekidsmusicproject@gmail.com</a>
      </p>
      ` : ''}
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
      to: ADMIN_EMAILS,
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
// Family Invite Email
// ============================================

interface FamilyInviteData {
  inviteeEmail: string
  inviterName: string
  familyId: string
  memberId: string
}

export async function sendFamilyInviteEmail(data: FamilyInviteData): Promise<EmailResult> {
  const subject = "You're invited to join a Creative Kids Music family account"

  // Link to account creation with invite context
  const inviteUrl = `${SITE_URL}/account/create?email=${encodeURIComponent(data.inviteeEmail)}&invite=true`

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">You're invited!</h1>
      <p style="color: #78716c; margin-top: 0;">Join your family's Creative Kids Music account</p>

      <p>Hi there,</p>

      <p><strong>${data.inviterName}</strong> has invited you to join their family account on Creative Kids Music.</p>

      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #166534; font-size: 16px; margin: 0 0 12px 0;">What you'll have access to:</h2>
        <ul style="color: #57534e; padding-left: 20px; margin: 0;">
          <li style="margin-bottom: 8px;">View all family registrations and payments</li>
          <li style="margin-bottom: 8px;">Manage children's information</li>
          <li style="margin-bottom: 8px;">Update emergency contacts and pickup authorizations</li>
          <li>Register for workshops and camps</li>
        </ul>
      </div>

      <p style="margin: 24px 0;">
        <a href="${inviteUrl}" style="display: inline-block; background: #166534; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500;">
          Set Up Your Login
        </a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        Once you create your account, you'll automatically be connected to the family and can view all shared information.
      </p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Contact us at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #166534;">creativekidsmusicproject@gmail.com</a>
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
      to: data.inviteeEmail,
      subject,
      html,
    })

    if (error) {
      await logEmail(data.inviteeEmail, 'family_invite', subject, 'family_member', data.memberId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.inviteeEmail, 'family_invite', subject, 'family_member', data.memberId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.inviteeEmail, 'family_invite', subject, 'family_member', data.memberId, 'failed', null)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Workshop Reminder Email
// ============================================

interface WorkshopReminderData {
  parentName: string
  parentEmail: string
  childrenNames: string[]
  workshopTitle: string
  workshopDate: string  // formatted date string
  workshopTime: string  // e.g., "4:00 PM"
  location: string
  address: string
  registrationId: string
}

export async function sendWorkshopReminder(data: WorkshopReminderData): Promise<EmailResult> {
  const subject = `Reminder: ${data.workshopTitle} is tomorrow!`

  const childrenList = data.childrenNames.length === 1
    ? data.childrenNames[0]
    : data.childrenNames.slice(0, -1).join(', ') + ' and ' + data.childrenNames[data.childrenNames.length - 1]

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">See you tomorrow!</h1>
      <p style="color: #78716c; margin-top: 0;">${data.workshopTitle}</p>

      <p>Hi ${data.parentName},</p>

      <p>This is a friendly reminder that <strong>${childrenList}</strong> ${data.childrenNames.length === 1 ? 'is' : 'are'} registered for our workshop tomorrow!</p>

      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0;">
        <h2 style="color: #166534; font-size: 16px; margin: 0 0 16px 0;">Workshop Details</h2>

        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Date</td>
            <td style="padding: 4px 0; font-weight: 600;">${data.workshopDate}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Drop-off Time</td>
            <td style="padding: 4px 0;">${data.workshopTime}</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Schedule</td>
            <td style="padding: 4px 0;">
              4:00–6:30 PM — Workshop<br>
              6:30–7:00 PM — Dinner (join us!)<br>
              7:00 PM — Performance
            </td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #78716c;">Location</td>
            <td style="padding: 4px 0;">${data.location}<br>${data.address}</td>
          </tr>
        </table>
      </div>

      <h2 style="color: #44403c; font-size: 18px; margin-top: 24px;">Quick Checklist</h2>
      <ul style="color: #57534e; padding-left: 20px;">
        <li>Arrive by ${data.workshopTime} for drop-off</li>
        <li>Come back at 6:30 PM for dinner and the 7:00 PM performance</li>
        <li>Comfortable clothes recommended</li>
        <li>No instruments needed — we provide everything!</li>
      </ul>

      <p style="margin-top: 24px;">
        <a href="${SITE_URL}/account" style="display: inline-block; background: #166534; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">
          View Your Registration
        </a>
      </p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Need to cancel? Please let us know as soon as possible at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #166534;">creativekidsmusicproject@gmail.com</a>
      </p>

      <p style="color: #78716c; font-size: 14px;">
        See you tomorrow!<br>
        Creative Kids Music Team
      </p>

      <p style="color: #a8a29e; font-size: 12px; margin-top: 24px;">
        Creative Kids Music Project<br>
        ${data.location}<br>
        ${data.address}
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
      await logEmail(data.parentEmail, 'workshop_reminder', subject, 'workshop_registration', data.registrationId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.parentEmail, 'workshop_reminder', subject, 'workshop_registration', data.registrationId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.parentEmail, 'workshop_reminder', subject, 'workshop_registration', data.registrationId, 'failed', null)
    return { success: false, error: String(error) }
  }
}

// ============================================
// Waitlist Spot Available Email
// ============================================

interface WaitlistSpotData {
  parentName: string
  parentEmail: string
  workshopTitle: string
  workshopDate: string
  registrationId: string
  spotsAvailable: number
}

export async function sendWaitlistSpotAvailable(data: WaitlistSpotData): Promise<EmailResult> {
  const subject = `A spot opened up! ${data.workshopTitle}`

  const html = `
    <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; color: #1c1917;">
      <h1 style="color: #166534; font-size: 24px; margin-bottom: 8px;">Great news!</h1>
      <p style="color: #78716c; margin-top: 0;">A spot just opened up</p>

      <p>Hi ${data.parentName},</p>

      <p>A spot has opened up for the <strong>${data.workshopTitle}</strong> on <strong>${data.workshopDate}</strong>!</p>

      <p>You were on our waitlist, and we wanted to give you first priority to claim this spot.</p>

      <div style="background: #ecfdf5; border-radius: 8px; padding: 20px; margin: 24px 0; text-align: center;">
        <p style="font-size: 18px; color: #166534; font-weight: 600; margin: 0 0 8px 0;">
          ${data.spotsAvailable} spot${data.spotsAvailable > 1 ? 's' : ''} available
        </p>
        <p style="color: #57534e; margin: 0; font-size: 14px;">
          First come, first served
        </p>
      </div>

      <p style="text-align: center; margin: 24px 0;">
        <a href="${SITE_URL}/account" style="display: inline-block; background: #166534; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
          Claim Your Spot
        </a>
      </p>

      <p style="color: #78716c; font-size: 14px; text-align: center;">
        Log in to your account to confirm your registration and secure your spot.
      </p>

      <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 24px 0;">

      <p style="color: #78716c; font-size: 14px;">
        Questions? Contact us at
        <a href="mailto:creativekidsmusicproject@gmail.com" style="color: #166534;">creativekidsmusicproject@gmail.com</a>
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
      await logEmail(data.parentEmail, 'waitlist_spot_available', subject, 'workshop_registration', data.registrationId, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(data.parentEmail, 'waitlist_spot_available', subject, 'workshop_registration', data.registrationId, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(data.parentEmail, 'waitlist_spot_available', subject, 'workshop_registration', data.registrationId, 'failed', null)
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
      to: ADMIN_EMAILS,
      replyTo: data.email,
      subject: emailSubject,
      html,
    })

    if (error) {
      await logEmail(ADMIN_EMAILS.join(', '), 'contact_form', emailSubject, null, null, 'failed', null)
      return { success: false, error: error.message }
    }

    await logEmail(ADMIN_EMAILS.join(', '), 'contact_form', emailSubject, null, null, 'sent', result?.id || null)
    return { success: true, id: result?.id }
  } catch (error) {
    await logEmail(ADMIN_EMAILS.join(', '), 'contact_form', emailSubject, null, null, 'failed', null)
    return { success: false, error: String(error) }
  }
}
