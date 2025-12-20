import { redirect } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { validateMagicLink, getParentRegistrations } from '../actions'
import { RegistrationCard } from './RegistrationCard'
import { CampRegistrationCard } from './CampRegistrationCard'
import { WaitlistCard } from './WaitlistCard'

export const metadata = {
  title: 'My Registrations | Creative Kids Music',
  description: 'View and manage your Creative Kids Music registrations',
}

interface PageProps {
  params: { token: string }
}

export default async function ParentDashboardPage({ params }: PageProps) {
  const { valid, email } = await validateMagicLink(params.token)

  if (!valid || !email) {
    redirect('/my-registrations?error=invalid')
  }

  const data = await getParentRegistrations(email)

  const hasRegistrations =
    data.workshopRegistrations.length > 0 ||
    data.campRegistrations.length > 0 ||
    data.waitlistSignups.length > 0

  // Create a map of workshop IDs to workshop details
  const workshopMap = new Map(data.workshops.map((w) => [w.id, w]))

  return (
    <>
      <Header />
      <main className="min-h-[60vh] py-16 px-6 bg-cream-50">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-syne text-3xl font-bold text-stone-800 mb-2">
            My Registrations
          </h1>
          <p className="text-stone-600 mb-8">
            Viewing registrations for <span className="font-medium">{email}</span>
          </p>

          {!hasRegistrations ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center">
              <p className="text-stone-600 mb-4">
                No registrations found for this email address.
              </p>
              <a
                href="/workshops"
                className="inline-block bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors"
              >
                View Programs
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Camp Registrations */}
              {data.campRegistrations.map((reg) => (
                <CampRegistrationCard
                  key={reg.id}
                  registration={reg}
                  registeredChildren={reg.camp_children || []}
                  email={email}
                />
              ))}

              {/* Workshop Registrations */}
              {data.workshopRegistrations.map((reg) => (
                <RegistrationCard
                  key={reg.id}
                  registration={reg}
                  registeredChildren={reg.workshop_children || []}
                  workshopMap={workshopMap}
                  email={email}
                />
              ))}

              {/* Waitlist Signups */}
              {data.waitlistSignups.map((signup) => (
                <WaitlistCard key={signup.id} signup={signup} />
              ))}
            </div>
          )}

          <div className="mt-8 p-4 bg-stone-100 rounded-xl">
            <p className="text-sm text-stone-600">
              Need to make changes? Contact us at{' '}
              <a
                href="mailto:info@creativekidsmusic.org"
                className="text-forest-600 hover:underline"
              >
                info@creativekidsmusic.org
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
