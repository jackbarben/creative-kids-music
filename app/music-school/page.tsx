import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaitlistForm from './WaitlistForm'

export default function MusicSchoolPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid md:grid-cols-12 gap-12 md:gap-16 lg:gap-24">
              {/* Main Content */}
              <div className="md:col-span-7">
                <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase mb-6">
                  Coming Fall 2026
                </p>
                <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
                  Music School
                </h1>

                <p className="mt-12 text-xl text-slate-700 font-medium leading-relaxed">
                  This is where it grows.
                </p>

                <div className="mt-8 space-y-6 text-lg text-slate-600 leading-relaxed">
                  <p>
                    Three afternoons a week, kids go deeper—improvising, composing, learning to lead and teach. They explore new instruments, find real collaborators, and discover a place to belong.
                  </p>
                  <p>
                    The creative flow stops being special and starts being theirs—a field they can walk into whenever they want.
                  </p>
                </div>

                <div className="mt-12">
                  <Image
                    src="/media/photos/music-school.jpg"
                    alt="Children learning music together"
                    width={800}
                    height={500}
                    className="w-full rounded-lg shadow-sm"
                  />
                </div>

                <div className="mt-16 pt-16 border-t border-slate-200">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-8">
                    Program Structure
                  </h2>
                  <div className="space-y-4 text-slate-600">
                    <p>3 days per week, after school</p>
                    <p>Small cohort model</p>
                    <p>Professional musicians as guides</p>
                    <p>Performances happen throughout the year, woven into the rhythm of the program.</p>
                  </div>
                </div>
              </div>

              {/* Sidebar - Waitlist */}
              <div className="md:col-span-5">
                <div className="md:sticky md:top-32">
                  <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                    Waitlist
                  </h2>
                  <p className="text-2xl text-slate-800 font-display font-semibold mb-2">
                    Join the Waitlist
                  </p>
                  <p className="text-slate-500 mb-10">
                    Be the first to know when registration opens.
                  </p>
                  <WaitlistForm />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
