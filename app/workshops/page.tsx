import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { getWorkshops } from '@/lib/data'

export default async function WorkshopsPage() {
  const workshops = await getWorkshops(true)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00')
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-forest-50 to-cream-50 py-24">
          <div className="absolute top-20 right-10 w-64 h-64 bg-forest-100 rounded-full opacity-20 blur-3xl" />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-stone-800 mb-8">
              Workshops
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream-50">
          <article className="max-w-2xl mx-auto px-6">
            <div className="prose prose-lg prose-stone max-w-none">
              <p className="text-xl leading-relaxed text-stone-700">
                Your kid doesn&apos;t need a year of lessons before their first concert. They can make real music on day one. We show them the musician already inside, hand them a few tools, and let them play alongside professionals who bring it all to life.
              </p>

              <p className="leading-relaxed text-stone-600">
                We start with the foundation of musical play—the beat. Feel it, move with it, keep it going. That&apos;s the first ball in the air. Then we add another—a loop, a pattern, a riff. The trick isn&apos;t to hold them. It&apos;s to keep them all moving.
              </p>

              <p className="leading-relaxed text-stone-600">
                But unlike typical music education, we practice keeping them moving with masters of the craft—professionals who hold us when we stumble, catch the ball when it falls, and keep it all in the air. This is what changes everything—we begin from success, supported by masters, and skill follows naturally.
              </p>

              <p className="text-xl text-forest-600 font-fraunces italic text-center my-12">
                Come see for yourself.
              </p>
            </div>
          </article>
        </section>

        {/* Dates */}
        <section className="py-16 bg-cream-100">
          <div className="max-w-2xl mx-auto px-6">
            <h2 className="font-fraunces text-3xl font-bold text-stone-800 mb-8 text-center">
              Spring 2026
            </h2>

            {workshops.length === 0 ? (
              <p className="text-center text-stone-500">Dates coming soon.</p>
            ) : (
              <div className="space-y-6">
                {workshops.map((workshop) => (
                  <div key={workshop.id} className="text-center py-4 border-b border-stone-200 last:border-0">
                    <p className="font-fraunces text-xl text-stone-800">
                      {formatDate(workshop.date)}
                    </p>
                    <p className="text-stone-500">
                      3:30 – 7:30 PM
                    </p>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12 text-center text-stone-600 space-y-2">
              <p>Ages 9–13</p>
              <p>$75 per child &bull; $10 off siblings</p>
              <p className="text-sm text-stone-500">Tuition assistance available</p>
            </div>

            <div className="mt-8 text-center text-stone-500 text-sm">
              <p>St. Luke&apos;s/San Lucas Episcopal Church</p>
              <p>4106 NE St. Johns Rd, Vancouver, WA</p>
            </div>
          </div>
        </section>

        {/* Register CTA */}
        <section className="py-16 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Link
              href="/workshops/register"
              className="inline-block px-8 py-4 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors text-lg"
            >
              Register Now
            </Link>
            <p className="mt-6 text-stone-500">
              Questions?{' '}
              <a
                href="mailto:connect@creativekidsmusic.org"
                className="text-forest-600 hover:text-forest-700 underline"
              >
                connect@creativekidsmusic.org
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
