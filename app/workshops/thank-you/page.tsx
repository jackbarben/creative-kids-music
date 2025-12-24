import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function WorkshopThankYouPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="py-24 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              Your spot is reserved.
            </h1>
            <p className="text-xl text-stone-600 mb-4">
              We&apos;ve received your workshop reservation.
            </p>
            <p className="text-stone-500 mb-8">
              You&apos;ll receive a confirmation email shortly with details about what to expect.
            </p>
            <p className="text-stone-400 text-sm mb-12">
              Payment details will be sent in early January.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
