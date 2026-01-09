import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Liability Waiver | Creative Kids Music',
  description: 'Liability Waiver and Release of Claims for Creative Kids Music Project programs.',
}

export default function LiabilityWaiverPage() {
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
              Liability Waiver and Release of Claims
            </h1>
            <p className="text-lg text-slate-600">Creative Kids Music Project</p>
          </header>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Assumption of Risk
              </h2>
              <p className="text-slate-600 mb-4">
                I, the undersigned parent or legal guardian, acknowledge that participation in programs
                offered by Creative Kids Music Project (&ldquo;the Program&rdquo;) involves certain inherent risks.
                These activities may include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                <li>Music instruction, practice, and performance</li>
                <li>Use of musical instruments and equipment</li>
                <li>Group activities, games, and movement exercises</li>
                <li>Indoor and outdoor recreational activities</li>
                <li>Arts and crafts projects</li>
                <li>Field trips and off-site activities</li>
                <li>Interaction with other participants and staff</li>
                <li>Transportation to and from program activities (if applicable)</li>
              </ul>
              <p className="text-slate-600">
                I understand that these activities carry risks of personal injury, illness, property damage,
                or other harm. I voluntarily assume all such risks on behalf of my child.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Waiver and Release
              </h2>
              <p className="text-slate-600 mb-4">
                In consideration of my child being permitted to participate in the Program, I hereby:
              </p>
              <ol className="list-decimal pl-6 text-slate-600 space-y-4">
                <li>
                  <strong>Release and discharge</strong> Creative Kids Music Project, its host organizations
                  (including St. Luke&apos;s/San Lucas Episcopal Church, Vancouver, Washington), and their respective directors,
                  officers, employees, volunteers, instructors, and agents (collectively, &ldquo;Released Parties&rdquo;)
                  from any and all claims, demands, actions, or causes of action arising out of or related to
                  any loss, damage, or injury that may be sustained by my child while participating in Program activities.
                </li>
                <li>
                  <strong>Waive any claims</strong> I or my child may have against the Released Parties for any
                  injury, illness, death, or property damage arising from participation in the Program, except
                  in cases of gross negligence or willful misconduct.
                </li>
                <li>
                  <strong>Agree not to sue</strong> the Released Parties for any claims arising from my child&apos;s
                  participation in the Program.
                </li>
                <li>
                  <strong>Indemnify and hold harmless</strong> the Released Parties from any claims, damages,
                  or expenses (including attorney fees) arising from my child&apos;s participation in the Program.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Medical Authorization
              </h2>
              <p className="text-slate-600 mb-4">
                In the event of an emergency, I authorize Program staff to:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2 mb-4">
                <li>Administer basic first aid</li>
                <li>Contact emergency medical services (911)</li>
                <li>Arrange for emergency medical treatment</li>
                <li>Transport my child to a medical facility if necessary</li>
              </ul>
              <p className="text-slate-600">
                I understand that I am responsible for any medical expenses incurred on behalf of my child.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Accuracy of Information
              </h2>
              <p className="text-slate-600">
                I acknowledge that emergency contact, medical, and authorized pickup information is collected
                separately during registration. I agree to keep this information current and to notify the
                Program promptly of any changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Photography and Recording
              </h2>
              <p className="text-slate-600">
                I understand that photographs, video, and audio recordings may be taken during Program activities.
                Media consent is addressed separately in the Media Release form.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Program Rules
              </h2>
              <p className="text-slate-600">
                I agree that my child will follow all Program rules and instructions from staff. I understand
                that failure to follow rules may result in dismissal from the Program without refund.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Duration of Agreement
              </h2>
              <p className="text-slate-600">
                For single-event programs (workshops, performances, or similar), this waiver applies to the
                specific event indicated during registration. For ongoing programs (music school sessions,
                summer camps, or similar), this waiver remains in effect for one year from the date of
                acceptance or until the conclusion of the registered program, whichever is later.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Severability
              </h2>
              <p className="text-slate-600">
                If any provision of this waiver is found to be unenforceable, the remaining provisions shall
                continue in full force and effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Governing Law
              </h2>
              <p className="text-slate-600">
                This agreement shall be governed by the laws of the State of Washington.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Acknowledgment
              </h2>
              <p className="text-slate-600 mb-4">
                By checking the acceptance box during registration, I acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>I have read and understand this Liability Waiver</li>
                <li>I am the parent or legal guardian of the child being registered</li>
                <li>I have the legal authority to sign this waiver on behalf of my child</li>
                <li>I voluntarily agree to be bound by its terms</li>
                <li>This waiver remains in effect for all Program activities during the registered session(s)</li>
              </ul>
            </section>

            <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
              <p className="mb-2">
                This waiver is accepted electronically during online registration.
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
