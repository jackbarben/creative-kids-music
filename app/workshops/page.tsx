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
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-20">
              {/* Main Content */}
              <div className="md:col-span-7">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase mb-6">
                  Winter/Spring 2026
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
                  Workshops
                </h1>

                <p className="mt-12 text-xl text-slate-700 font-medium leading-relaxed">
                  Your child makes real music on day one—not after a year of lessons.
                </p>

                <div className="mt-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    We start with the foundation: the beat. Feel it, move with it, keep it going.
                    Then we add another layer—a loop, a pattern, a riff. Your child plays alongside
                    professional musicians who hold the groove when they stumble and keep everything
                    moving together.
                  </p>
                  <p>
                    This is how we teach: we begin from success, supported by masters, and skill follows naturally.
                  </p>
                </div>
              </div>

              {/* Sidebar - aligned with title */}
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    Dates
                  </h2>

                  {workshops.length === 0 ? (
                    <p className="text-slate-500">Dates coming soon.</p>
                  ) : (
                    <div className="space-y-6">
                      {workshops.map((workshop) => (
                        <div
                          key={workshop.id}
                          className="pb-6 border-b border-slate-200 last:border-0 last:pb-0"
                        >
                          <p className="font-display font-semibold text-slate-800">
                            {formatDate(workshop.date)}
                          </p>
                          <p className="text-sm text-slate-500 mt-2">
                            3:30–7:00 PM Workshop & Dinner<br />
                            7:00 PM Performance
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="mt-10 pt-10 border-t border-slate-200 space-y-2 text-sm text-slate-600">
                    <p>Ages 9–13</p>
                    <p>$75 per child · $10 off siblings</p>
                    <p className="text-slate-400">Tuition assistance available</p>
                  </div>

                  <div className="mt-10 pt-10 border-t border-slate-200 text-sm text-slate-400">
                    <p>St. Luke&apos;s / San Lucas Episcopal Church</p>
                    <p>426 E Fourth Plain Blvd, Vancouver, WA</p>
                  </div>

                  <Link
                    href="/workshops/register"
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
          href="/workshops/register"
          className="block w-full py-4 bg-slate-800 text-white text-center text-sm font-medium tracking-wide rounded hover:bg-slate-700 transition-colors"
        >
          Register · $75
        </Link>
      </div>
    </div>
  )
}
