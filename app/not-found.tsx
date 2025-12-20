import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[60vh] flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <p className="text-6xl font-display text-forest-700 mb-4">404</p>
          <h1 className="text-2xl font-display text-stone-800 mb-4">
            Page Not Found
          </h1>
          <p className="text-stone-600 mb-8 max-w-md">
            We couldn&apos;t find the page you&apos;re looking for.
            It might have been moved or doesn&apos;t exist.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-block bg-forest-600 text-white px-6 py-3 rounded-lg hover:bg-forest-700 transition-colors"
            >
              Go Home
            </Link>
            <Link
              href="/workshops"
              className="inline-block border border-forest-600 text-forest-600 px-6 py-3 rounded-lg hover:bg-forest-50 transition-colors"
            >
              View Workshops
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
