import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MusicSchoolThankYouPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="py-24 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              You&apos;re on the list.
            </h1>
            <p className="text-xl text-stone-600 mb-8">
              We&apos;ll be in touch when registration opens for Fall 2026.
            </p>
            <p className="text-stone-500 mb-12">
              In the meantime, consider joining us for a{' '}
              <Link href="/workshops" className="text-forest-600 hover:text-forest-700 underline">
                workshop
              </Link>{' '}
              or{' '}
              <Link href="/summer-camp" className="text-forest-600 hover:text-forest-700 underline">
                summer camp
              </Link>
              .
            </p>

            {/* Account Creation Prompt */}
            <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8 text-left">
              <h2 className="font-display text-lg font-semibold text-stone-800 mb-2">
                Want to stay connected?
              </h2>
              <p className="text-stone-600 text-sm mb-4">
                Create a free parent account to manage your waitlist signup and be first to know when registration opens.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/account/create"
                  className="inline-block px-5 py-2.5 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors text-center"
                >
                  Create Account
                </Link>
                <Link
                  href="/"
                  className="inline-block px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors text-center"
                >
                  Maybe Later
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
