import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Creative Kids Music',
  description: 'Terms and conditions for Creative Kids Music Project programs including workshops, summer camp, and music school.',
}

export default function ProgramTermsPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
              Legal Document
            </p>
            <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2">
              Terms &amp; Conditions
            </h1>
            <p className="text-lg text-slate-600">Creative Kids Music Project</p>
          </header>

          <p className="text-slate-600 mb-8">
            By registering for a Creative Kids Music Project program, you agree to the following terms and conditions.
          </p>

          <div className="prose prose-slate max-w-none">
            {/* Program Participation */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Program Participation
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Registration</h3>
              <p className="text-slate-600 mb-4">
                Registration is complete when you have submitted all required forms and payment. Space is
                confirmed upon receipt of payment. Waitlist placement does not guarantee enrollment.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Accuracy of Information</h3>
              <p className="text-slate-600 mb-4">
                You agree to provide accurate information during registration and to notify us
                promptly of any changes to contact, medical, or emergency information.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Program Rules</h3>
              <p className="text-slate-600 mb-4">
                Participants are expected to follow all program rules and instructions from staff. We reserve the
                right to dismiss any participant whose behavior disrupts the program or poses a safety concern to themselves or
                others. In such cases, refunds are not guaranteed.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Supervision</h3>
              <p className="text-slate-600">
                For drop-off programs, children must be signed in and out by a parent, guardian, or authorized
                pickup person. We are not responsible for supervision before the designated start time or after the designated
                end time.
              </p>
            </section>

            {/* Payment & Fees */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Payment &amp; Fees
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Payment</h3>
              <p className="text-slate-600 mb-4">
                Full payment is due at the time of registration unless a payment plan is offered and selected. We accept
                credit/debit cards and other payment methods as indicated during registration.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Late Payment</h3>
              <p className="text-slate-600 mb-4">
                If payment fails or is not received, your registration may be canceled and your spot offered to
                another family.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Additional Fees</h3>
              <p className="text-slate-600">
                Some programs may have optional add-ons (extended care, materials, etc.) with additional fees
                as indicated during registration.
              </p>
            </section>

            {/* Cancellation & Refunds */}
            <section id="cancellation" className="mb-10 scroll-mt-24">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Payment &amp; Refunds
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Payment Policy</h3>
              <p className="text-slate-600 mb-4">
                You may register for any program and pay at any time before the program begins.
                Payment is due before your child&apos;s first day of participation.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Refund Policy</h3>
              <p className="text-slate-600 mb-4">
                <strong>All payments are final.</strong> Once payment is made, no refunds will be issued.
                If you need to cancel before paying, simply cancel your registration through your account
                or contact us—there is no penalty.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Cancellation by Us</h3>
              <p className="text-slate-600">
                If we cancel a program due to insufficient enrollment or other circumstances,
                you will receive a full refund. We are not responsible for other costs you may
                have incurred (travel, childcare, etc.).
              </p>
            </section>

            {/* Weather & Closures */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Weather &amp; Closures
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Weather Closures</h3>
              <p className="text-slate-600 mb-4">
                If we must cancel a session due to inclement weather, power outage, or other emergency, we
                will notify registered families as soon as possible via email and text.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Make-Up Sessions</h3>
              <p className="text-slate-600 mb-4">
                For multi-session programs, we will attempt to schedule a make-up session when possible.
                If a make-up cannot be scheduled, a prorated credit may be issued at our discretion.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Single Events</h3>
              <p className="text-slate-600 mb-4">
                For workshops or single-day events canceled due to weather, we will reschedule if possible. If
                rescheduling is not possible, a full refund or credit will be issued.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Your Decision Not to Attend</h3>
              <p className="text-slate-600 mb-4">
                If you choose not to attend due to weather conditions but the program is running
                as scheduled, no refund will be issued.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">How We Decide</h3>
              <p className="text-slate-600">
                We consider road conditions, forecasts, and facility availability. If Vancouver Public Schools
                closes due to weather, we will likely cancel as well, but this is not automatic—we will communicate our decision
                directly.
              </p>
            </section>

            {/* Drop-Off & Pickup */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Drop-Off &amp; Pickup
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Authorized Pickup</h3>
              <p className="text-slate-600 mb-4">
                Children will only be released to parents, guardians, or individuals listed as authorized pickup persons during
                registration. We may request photo ID for verification, especially for individuals we have not met before.
              </p>
              <p className="text-slate-600 mb-4">
                If someone not on your authorized list needs to pick up your child, you must notify us in advance (email or
                phone) with the person&apos;s name and relationship to your child.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Sign-In &amp; Sign-Out</h3>
              <p className="text-slate-600 mb-4">
                For drop-off programs, children must be signed in at arrival and signed out at pickup. Please do not drop off
                children before the designated start time, as supervision is not available until then.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Late Pickup</h3>
              <p className="text-slate-600 mb-4">
                We understand that delays happen. Please contact us as soon as possible if you will be late.
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-1">
                <li>Up to 15 minutes late: No charge, but please notify us</li>
                <li>15–30 minutes late: $15 late fee</li>
                <li>More than 30 minutes late: $15 plus $1 per additional minute</li>
              </ul>
              <p className="text-slate-600 mt-4">
                Repeated late pickups may result in loss of enrollment privileges.
              </p>
            </section>

            {/* Media */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Media &amp; Photography
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Updating Your Preferences</h3>
              <p className="text-slate-600 mb-4">
                You may change your media permissions at any time by contacting the program director. Changes apply to future
                use; we make reasonable efforts to remove previously shared materials upon request, though we cannot control
                third-party reposts or cached content.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Other Families &amp; Personal Sharing</h3>
              <p className="text-slate-600 mb-4">
                We cannot control photography by other families attending sessions or events. We ask all families to be respectful
                of others&apos; privacy preferences and to avoid posting photos of other children to social media without permission
                from their parents. If you have concerns about your child appearing in other families&apos; personal photos, please
                speak with us so we can address this at sessions.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Events Open to Visitors</h3>
              <p className="text-slate-600">
                Occasionally we host open events, performances, or showcases where visitors or press may be present and photography
                may occur. We will notify families in advance when such events are scheduled. Families who have opted
                out of media permissions may choose not to attend or may request accommodations.
              </p>
            </section>

            {/* Communication */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Communication
              </h2>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Program Updates</h3>
              <p className="text-slate-600 mb-4">
                We will communicate program information via the email address provided during registration. Please add our email
                address to your contacts to ensure you receive important updates.
              </p>

              <h3 className="font-semibold text-slate-700 text-lg mb-2">Emergency Communication</h3>
              <p className="text-slate-600">
                In case of emergency, weather closure, or last-minute schedule changes, we will contact you via phone, text,
                or email as appropriate.
              </p>
            </section>

            {/* Liability */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Liability
              </h2>
              <p className="text-slate-600">
                Participation in Creative Kids Music Project programs involves inherent risks. A separate{' '}
                <a href="/terms/liability-waiver" className="text-forest-600 hover:text-forest-700 underline">
                  Liability Waiver
                </a>{' '}
                addresses assumption of risk, release of claims, and related matters. By completing registration, you acknowledge
                that you have read and agreed to the Liability Waiver.
              </p>
            </section>

            {/* Changes to Terms */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Changes to Terms
              </h2>
              <p className="text-slate-600">
                We may update these Terms &amp; Conditions from time to time. Material changes will be communicated to registered
                families. Continued participation after changes are communicated constitutes acceptance of the updated terms.
              </p>
            </section>

            {/* Governing Law */}
            <section className="mb-10">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Governing Law
              </h2>
              <p className="text-slate-600">
                These terms shall be governed by the laws of the State of Washington.
              </p>
            </section>

            {/* Acknowledgment */}
            <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Acknowledgment
              </h2>
              <p className="text-slate-600 mb-4">
                By completing registration, you acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>You have read and understand these Terms &amp; Conditions</li>
                <li>You have read and agreed to the{' '}
                  <a href="/terms/liability-waiver" className="text-forest-600 hover:text-forest-700 underline">
                    Liability Waiver
                  </a>
                </li>
                <li>You are the parent or legal guardian of the child being registered</li>
                <li>You agree to abide by all program policies and rules</li>
                <li>You accept responsibility for ensuring your child follows program expectations</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Contact
              </h2>
              <p className="text-slate-600 mb-4">
                Questions about these terms may be directed to:
              </p>
              <address className="text-slate-600 not-italic">
                <strong>Creative Kids Music Project</strong><br />
                <a href="mailto:info@creativekidsmusic.org" className="text-forest-600 hover:text-forest-700">
                  info@creativekidsmusic.org
                </a>
              </address>
            </section>

            <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
              <p className="mb-2">
                These terms are accepted electronically during online registration.
              </p>
              <p>
                A copy is provided via confirmation email for your records.
              </p>
            </footer>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
