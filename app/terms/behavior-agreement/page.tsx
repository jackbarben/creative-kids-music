import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Behavior Agreement | Creative Kids Music',
  description: 'Behavior expectations and agreement for Creative Kids Music Project summer camp participants.',
}

export default function BehaviorAgreementPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <article className="max-w-3xl mx-auto px-6">
          <header className="mb-8 pb-8 border-b border-slate-200">
            <p className="text-xs uppercase tracking-widest font-semibold text-slate-500 mb-2">
              Summer Camp
            </p>
            <h1 className="font-display text-4xl font-semibold text-slate-800 mb-2">
              Camper Behavior Agreement
            </h1>
            <p className="text-lg text-slate-600">Creative Kids Music Project</p>
          </header>

          <div className="prose prose-slate max-w-none">
            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Our Community Values
              </h2>
              <p className="text-slate-600 mb-4">
                Creative Kids Music Camp is a community where young musicians come together to learn,
                create, and grow. We believe that music-making is a collaborative experience that requires
                respect, kindness, and a willingness to support one another. These behavior expectations
                help us maintain a safe, positive, and productive environment for all campers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Respect for Others
              </h2>
              <p className="text-slate-600 mb-4">Campers are expected to:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Treat all staff, instructors, and fellow campers with kindness and respect</li>
                <li>Use appropriate language at all times (no profanity, put-downs, or hurtful comments)</li>
                <li>Listen when others are speaking or performing</li>
                <li>Celebrate the efforts and achievements of fellow campers</li>
                <li>Accept and include others, regardless of ability level or background</li>
                <li>Keep hands and feet to themselves</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Respect for Equipment
              </h2>
              <p className="text-slate-600 mb-4">Campers are expected to:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Handle all instruments and equipment with care</li>
                <li>Follow instructions for proper use of instruments</li>
                <li>Ask permission before using equipment that is not assigned to them</li>
                <li>Report any damage or issues to staff immediately</li>
                <li>Clean up their workspace and materials at the end of each activity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Respect for the Program
              </h2>
              <p className="text-slate-600 mb-4">Campers are expected to:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Follow the daily schedule and be on time for activities</li>
                <li>Listen to and follow instructions from staff and instructors</li>
                <li>Participate actively in all camp activities</li>
                <li>Stay with their assigned group unless given permission to leave</li>
                <li>Keep personal electronics (phones, tablets, gaming devices) put away during camp hours unless authorized by staff</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Safety Rules
              </h2>
              <p className="text-slate-600 mb-4">For everyone&apos;s safety, campers must:</p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Stay within designated camp areas at all times</li>
                <li>Walk (not run) inside buildings</li>
                <li>Use the buddy system when going to restrooms during activities</li>
                <li>Report any safety concerns or incidents to staff immediately</li>
                <li>Follow all emergency procedures as instructed</li>
                <li>Not bring prohibited items (weapons, drugs, alcohol, tobacco, or anything that could be used to harm others)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Consequences
              </h2>
              <p className="text-slate-600 mb-4">
                When behavior issues arise, we follow a progressive approach:
              </p>
              <ol className="list-decimal pl-6 text-slate-600 space-y-3">
                <li>
                  <strong>Verbal Warning:</strong> Staff will privately remind the camper of expectations.
                </li>
                <li>
                  <strong>Time Out:</strong> The camper may be asked to take a break from the current activity.
                </li>
                <li>
                  <strong>Parent Contact:</strong> Parents/guardians will be notified about ongoing or serious behavior concerns.
                </li>
                <li>
                  <strong>Behavior Plan:</strong> A written plan may be created with specific expectations and consequences.
                </li>
                <li>
                  <strong>Dismissal:</strong> In cases of severe or repeated misconduct, a camper may be sent home early or dismissed from camp. No refund will be provided for dismissal due to behavior.
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Immediate Dismissal
              </h2>
              <p className="text-slate-600 mb-4">
                The following behaviors may result in immediate dismissal without warning:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>Physical violence or threats of violence</li>
                <li>Bullying, harassment, or intimidation</li>
                <li>Possession of weapons or dangerous items</li>
                <li>Possession or use of drugs, alcohol, or tobacco</li>
                <li>Theft or intentional destruction of property</li>
                <li>Leaving camp property without permission</li>
                <li>Any behavior that puts themselves or others at risk</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Communication
              </h2>
              <p className="text-slate-600">
                We believe in open communication with families. If there are any concerns about your
                child&apos;s behavior or experience at camp, please contact us right away. Similarly, we will
                reach out to you if we have concerns that need to be addressed together.
              </p>
            </section>

            <section className="mb-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
              <h2 className="font-display text-2xl font-semibold text-slate-800 mb-4">
                Acknowledgment
              </h2>
              <p className="text-slate-600 mb-4">
                By accepting this agreement during registration, I acknowledge that:
              </p>
              <ul className="list-disc pl-6 text-slate-600 space-y-2">
                <li>I have read and understand the Camper Behavior Agreement</li>
                <li>I have reviewed these expectations with my child</li>
                <li>My child agrees to follow these behavior expectations</li>
                <li>I understand that violation of these rules may result in dismissal without refund</li>
                <li>I agree to support camp staff in enforcing these expectations</li>
              </ul>
            </section>

            <footer className="pt-6 border-t border-slate-200 text-sm text-slate-500">
              <p className="mb-2">
                This agreement is accepted electronically during summer camp registration.
              </p>
              <p>
                Questions? Contact us at{' '}
                <a href="mailto:info@creativekidsmusic.org" className="text-forest-600 hover:text-forest-700">
                  info@creativekidsmusic.org
                </a>
              </p>
            </footer>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  )
}
