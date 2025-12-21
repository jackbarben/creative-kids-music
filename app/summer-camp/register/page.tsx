import Header from '@/components/Header'
import Footer from '@/components/Footer'
import CampRegistrationForm from '../CampRegistrationForm'

export default function CampRegisterPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-terracotta-50 to-cream-50 py-16">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-stone-800 mb-4">
              Summer Camp Registration
            </h1>
            <p className="text-stone-600">
              June 22–28, 2026
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="py-12 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6">
            <CampRegistrationForm />
          </div>
        </section>

        {/* Details */}
        <section className="py-12 bg-terracotta-50">
          <div className="max-w-2xl mx-auto px-6 text-center text-stone-600 space-y-2">
            <p>Monday–Friday, 8:30 AM – 5:00 PM · Lunch included</p>
            <p>Sunday performance, June 29 · 9–11 AM</p>
            <p className="pt-2">$400 per child</p>
            <p className="text-sm text-stone-500">$10 sibling discount per additional child</p>
            <p className="pt-4 text-sm text-stone-500">
              St. Luke&apos;s/San Lucas Episcopal Church<br />
              426 E Fourth Plain Blvd, Vancouver, WA
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
