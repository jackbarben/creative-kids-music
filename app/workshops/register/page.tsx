import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WorkshopRegistrationForm from '../WorkshopRegistrationForm'
import { getWorkshops } from '@/lib/data'

export default async function WorkshopRegisterPage() {
  const workshops = await getWorkshops(true)

  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 to-cream-50 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Workshop Registration
            </h1>
            <p className="text-stone-600">
              Spring 2026 at St. Luke&apos;s/San Lucas
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6">
            {workshops.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-stone-600 mb-4">
                  Workshop dates haven&apos;t been announced yet.
                </p>
                <Link href="/workshops" className="text-forest-600 hover:text-forest-700 underline">
                  Back to Workshops
                </Link>
              </div>
            ) : (
              <WorkshopRegistrationForm workshops={workshops} />
            )}
          </div>
        </section>

        {/* Details */}
        <section className="py-12 bg-cream-100">
          <div className="max-w-2xl mx-auto px-6 text-center text-stone-600 space-y-2">
            <p>3:30 – 7:30 PM</p>
            <p>$75 per child per workshop</p>
            <p className="text-sm text-stone-500">$10 sibling discount per additional child</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
