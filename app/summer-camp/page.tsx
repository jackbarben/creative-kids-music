import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SummerCampPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-terracotta-50 to-cream-50 py-24">
          <div className="absolute top-20 left-10 w-64 h-64 bg-terracotta-100 rounded-full opacity-20 blur-3xl" />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-stone-800 mb-8">
              Summer Camp
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream-50">
          <article className="max-w-2xl mx-auto px-6">
            <div className="prose prose-lg prose-stone max-w-none space-y-8">
              <p className="text-xl leading-relaxed text-stone-700">
                Imagine your kid waking up each morning and walking into something alive—a week where music, nature, and play weave together into a single immersive experience. That&apos;s Creative Kids Music Camp.
              </p>

              <div className="my-16 py-8 border-t border-b border-stone-200">
                <p className="leading-relaxed text-stone-600">
                  We start each day outside. Sitting in stillness. Walking barefoot. Listening for the farthest sound, the quietest sound. Senses open before a single note is played.
                </p>
                <p className="leading-relaxed text-stone-600 mt-6">
                  This isn&apos;t separate from music—it&apos;s how we prepare for it. When the body is awake and the mind is quiet, music flows.
                </p>
              </div>

              <p className="leading-relaxed text-stone-600">
                Then we go deep. We build on the foundational elements of music—groove, pattern, listening, space—and expand from there. Kids learn to take different roles: holding the bass line, carrying the melody, adding rhythm, creating texture. They write their own songs. They pick up new instruments. If they already play one, they bring it and find new ways to use it.
              </p>

              <p className="leading-relaxed text-stone-600">
                Professional musicians are there all week, playing alongside them, guiding them deeper into what music can be.
              </p>

              <p className="leading-relaxed text-stone-600">
                Each day a guest instructor arrives—a dancer, a drummer, a singer, a songwriter—each one bringing their own gift, another thread woven into the week.
              </p>

              <div className="my-16 py-8 border-t border-b border-stone-200">
                <p className="leading-relaxed text-stone-600">
                  Friday evening is the dress rehearsal. Parents gather, share dinner, and hear what their kids have been creating all week.
                </p>
                <p className="leading-relaxed text-stone-600 mt-6">
                  Sunday morning, they perform at the 10am service—using what they&apos;ve learned to transform a community gathering into something special.
                </p>
              </div>

              <p className="text-xl leading-relaxed text-stone-700">
                What they carry home is bigger than any performance: a freedom to make music they&apos;ve never felt before. Confidence and creativity in their bones. The knowledge that they can do this—and keep doing it.
              </p>
            </div>
          </article>
        </section>

        {/* Details */}
        <section className="py-16 bg-terracotta-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h2 className="font-fraunces text-3xl font-bold text-stone-800 mb-8">
              June 22–28, 2026
            </h2>

            <div className="text-stone-600 space-y-2">
              <p>Monday–Friday, 8:30 AM – 5:00 PM</p>
              <p>Sunday performance at 10 AM</p>
            </div>

            <div className="mt-8 text-stone-600 space-y-2">
              <p>Ages 9–13</p>
              <p>$400 per child &bull; $10 off siblings</p>
              <p className="text-sm text-stone-500">Tuition assistance available</p>
            </div>

            <div className="mt-8 text-stone-500 text-sm">
              <p>St. Luke&apos;s/San Lucas Episcopal Church</p>
              <p>4106 NE St. Johns Rd, Vancouver, WA</p>
            </div>
          </div>
        </section>

        {/* Register CTA */}
        <section className="py-16 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Link
              href="/summer-camp/register"
              className="inline-block px-8 py-4 bg-terracotta-500 text-white rounded-lg font-medium hover:bg-terracotta-600 transition-colors text-lg"
            >
              Register Now
            </Link>
            <p className="mt-6 text-stone-500">
              Questions?{' '}
              <a
                href="mailto:connect@creativekidsmusic.org"
                className="text-terracotta-500 hover:text-terracotta-600 underline"
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
