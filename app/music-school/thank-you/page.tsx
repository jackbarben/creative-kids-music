import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function MusicSchoolThankYouPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        <section className="py-24 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-syne text-4xl md:text-5xl font-bold text-stone-800 mb-6">
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
