import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function SummerCampPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
              {/* Main Content */}
              <div className="md:col-span-7">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase mb-6">
                  June 22–27, 2026
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
                  Summer Camp
                </h1>

                <p className="mt-12 text-xl text-slate-700 font-medium leading-relaxed">
                  A week where music, nature, and play weave together into a single immersive experience.
                </p>

                <div className="mt-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    Each day begins outside—sitting in stillness, walking barefoot, listening for the farthest sound, the quietest sound. When the body is awake and the mind is open, music flows.
                  </p>
                  <p>
                    Then we go deeper. Kids hold the bass line while others carry the melody. They add rhythm, create texture, write their own songs, pick up new instruments. Professional musicians are there all week, playing alongside them, and each day a guest instructor arrives, weaving in movement, voice, rhythm, composition—another thread added to the week.
                  </p>
                </div>

                <div className="mt-16 pt-16 border-t border-slate-200">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    The Finale
                  </h2>
                  <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                    <p>
                      Friday evening, parents gather to share dinner and hear what their kids have been creating. Sunday morning, the children help create and transform the musical tapestry of the 10am St. Luke&apos;s service.
                    </p>
                    <p>
                      What they carry home is bigger than any performance: a freedom to make music they&apos;ve never felt before.
                    </p>
                  </div>
                </div>

                <div className="mt-12">
                  <Image
                    src="/media/photos/summer-camp.jpg"
                    alt="Children at summer music camp"
                    width={800}
                    height={500}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>
              </div>

              {/* Sidebar - aligned with title */}
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    Details
                  </h2>

                  <div className="space-y-6">
                    <div className="pb-6 border-b border-slate-200">
                      <p className="font-display font-semibold text-slate-800">Dates</p>
                      <p className="text-sm text-slate-500 mt-2">
                        June 22–27, 2026 (Mon–Fri)
                      </p>
                    </div>
                    <div className="pb-6 border-b border-slate-200">
                      <p className="font-display font-semibold text-slate-800">Time</p>
                      <p className="text-sm text-slate-500 mt-2">
                        8:30 AM – 5:00 PM daily<br />
                        Lunch included
                      </p>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-slate-800">Performance</p>
                      <p className="text-sm text-slate-500 mt-2">
                        Sunday, June 29 · 9–11 AM
                      </p>
                    </div>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                    <p>Ages 9–13</p>
                    <p>$400 per child · $10 off siblings</p>
                    <p className="text-slate-400">Tuition assistance available</p>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-200 text-sm text-slate-400">
                    <p>St. Luke&apos;s / San Lucas Episcopal Church</p>
                    <p>426 E Fourth Plain Blvd, Vancouver, WA</p>
                  </div>

                  <Link
                    href="/summer-camp/register"
                    className="mt-10 block w-full py-4 bg-slate-800 text-white text-center text-sm font-medium tracking-wide rounded hover:bg-slate-700 transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Spacer for mobile sticky button */}
      <div className="md:hidden h-24"></div>

      <Footer />

      {/* Mobile sticky Register button */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-cream-50/95 backdrop-blur-sm border-t border-slate-200">
        <Link
          href="/summer-camp/register"
          className="block w-full py-4 bg-slate-800 text-white text-center text-sm font-medium tracking-wide rounded hover:bg-slate-700 transition-colors"
        >
          Register · $400
        </Link>
      </div>
    </div>
  )
}
