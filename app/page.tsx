import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

// Design: Warm & Organic
// Evolution of current earthy style, more polished
// Colors: Forest green, terracotta, cream
// Typography: Fraunces (display), Nunito (body)

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50">
          {/* Organic decorative shapes */}
          <div className="absolute top-10 right-0 w-96 h-96 bg-forest-100 rounded-[60%_40%_30%_70%/60%_30%_70%_40%] opacity-40" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-terracotta-100 rounded-[40%_60%_70%_30%/40%_50%_60%_50%] opacity-40" />

          <div className="relative max-w-4xl mx-auto px-6 py-24 text-center">
            <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-stone-800 mb-6 leading-tight">
              A new kind of <span className="text-forest-600">music school.</span>
            </h1>
            <p className="font-fraunces text-2xl text-terracotta-500 mb-8 italic">
              Where music takes root.
            </p>
            <p className="text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed mb-10">
              Music isn&apos;t rules to memorize or a series of notes to play. It&apos;s something they
              already have, they already feel. We help them find it, nurture it, and grow it into
              something uniquely theirs.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/workshops"
                className="bg-forest-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-forest-700 transition-colors shadow-md"
              >
                View Programs
              </Link>
              <Link
                href="/about"
                className="bg-cream-50 text-forest-600 px-8 py-4 rounded-lg font-semibold border-2 border-forest-200 hover:border-forest-400 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </section>

        {/* Program Cards */}
        <section className="py-20 bg-cream-50">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="font-fraunces text-4xl font-bold text-center text-stone-800 mb-4">Our Programs</h2>
            <p className="text-stone-500 text-center mb-12 text-lg">Find the right fit for your child</p>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Workshops */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-stone-100">
                <div className="w-16 h-16 bg-forest-50 rounded-xl flex items-center justify-center mb-6 border border-forest-100">
                  <svg className="w-8 h-8 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                  </svg>
                </div>
                <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-3">Workshops</h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  One-day immersive sessions where kids explore improvisation, composition, and ensemble playing.
                </p>
                <p className="text-forest-600 font-semibold mb-6">Spring 2026 • Ages 9-13</p>
                <Link href="/workshops" className="text-forest-600 font-medium hover:text-forest-700 inline-flex items-center gap-2">
                  Learn more <span>→</span>
                </Link>
              </div>

              {/* Summer Camp */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-stone-100">
                <div className="w-16 h-16 bg-terracotta-50 rounded-xl flex items-center justify-center mb-6 border border-terracotta-100">
                  <svg className="w-8 h-8 text-terracotta-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-3">Summer Camp</h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  A full week of music-making, creativity, and performance. The ultimate musical adventure.
                </p>
                <p className="text-terracotta-500 font-semibold mb-6">June 22-28, 2026 • Ages 9-13</p>
                <Link href="/summer-camp" className="text-terracotta-500 font-medium hover:text-terracotta-600 inline-flex items-center gap-2">
                  Learn more <span>→</span>
                </Link>
              </div>

              {/* Music School */}
              <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow border border-stone-100">
                <div className="w-16 h-16 bg-stone-50 rounded-xl flex items-center justify-center mb-6 border border-stone-200">
                  <svg className="w-8 h-8 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="font-fraunces text-xl font-bold text-stone-800 mb-3">Music School</h3>
                <p className="text-stone-600 mb-4 leading-relaxed">
                  After-school program, 3 days a week. Deep musical development in a nurturing community.
                </p>
                <p className="text-stone-500 font-semibold mb-6">Coming Fall 2026</p>
                <Link href="/music-school" className="text-stone-500 font-medium hover:text-stone-700 inline-flex items-center gap-2">
                  Join waitlist <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Vignettes Section */}
        <section className="py-20 bg-cream-100">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-fraunces text-4xl font-bold text-center text-stone-800 mb-4">What It Looks Like</h2>
            <p className="text-stone-500 text-center mb-16 text-lg">Real stories of musical growth</p>

            {/* Vignette 1: Main Street */}
            <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border-l-4 border-forest-400">
              <h3 className="font-fraunces text-2xl font-bold text-forest-700 mb-4">Main Street</h3>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <p>
                  A Saturday morning, outside a coffee shop. A few kids—ages ten, eleven, twelve—are
                  hanging out, waiting for their parents. One of them notices a small crowd forming
                  nearby, some open space. She catches her friend&apos;s eye. A nod.
                </p>
                <p className="font-semibold text-stone-800">
                  No discussion. No sheet music. No plan.
                </p>
                <p>
                  One kid starts a groove on a hand drum. Another joins on melodica. A third hums a
                  bass line, then starts to sing. Within a minute, something is happening. People stop.
                  A toddler starts dancing. Someone pulls out a phone to record.
                </p>
              </div>
              <p className="mt-6 text-forest-600 font-fraunces italic text-lg">
                This isn&apos;t a performance. It&apos;s a way of being—spontaneous, creative, alive to the moment.
              </p>
            </div>

            {/* Vignette 2: The Concert */}
            <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border-l-4 border-terracotta-400">
              <h3 className="font-fraunces text-2xl font-bold text-terracotta-600 mb-4">The Concert</h3>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <p>
                  A Creative Kids cohort has decided to do a show at the community center. Not because
                  someone assigned it—because they want to.
                </p>
                <p>
                  Now comes the real work. What&apos;s the arc of the set? How do we open—high energy
                  or slow build? What do we want people to feel at the end? They argue about it. They
                  try things. They scrap ideas and start over.
                </p>
                <p>
                  Some tunes are covers—songs they love, rearranged for their instruments. Other
                  pieces are original. A twelve-year-old brings in a melody she&apos;s been humming for
                  weeks. The group builds it into a full arrangement.
                </p>
              </div>
              <p className="mt-6 text-terracotta-500 font-fraunces italic text-lg">
                The concert isn&apos;t the goal. The concert is proof of what they&apos;ve become: musicians
                who can plan, execute, and still leave space for magic.
              </p>
            </div>

            {/* Vignette 3: The Liturgy */}
            <div className="mb-12 bg-white p-8 rounded-2xl shadow-sm border-l-4 border-stone-400">
              <h3 className="font-fraunces text-2xl font-bold text-stone-700 mb-4">The Liturgy</h3>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <p>
                  Sunday morning. Fifteen minutes before service. Three kids are setting up in the
                  choir loft. Today they&apos;re playing the prelude, leading the circle song, and
                  playing a composition during communion.
                </p>
                <p>
                  They&apos;ve spent the week preparing—but not just learning notes. They&apos;ve talked about
                  what a prelude is for. The congregation is arriving, settling, transitioning. The
                  music needs to meet them where they are and bring them somewhere else.
                </p>
                <p>
                  After the service, a parishioner stops one of them. &quot;That was beautiful. I didn&apos;t
                  want it to end.&quot;
                </p>
              </div>
              <p className="mt-6 text-stone-600 font-fraunces italic text-lg">
                She&apos;s twelve. She smiles. &quot;Thanks. We&apos;ll be back next month.&quot;
              </p>
            </div>

            {/* Vignette 4: The Long Game */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border-l-4 border-forest-400">
              <h3 className="font-fraunces text-2xl font-bold text-stone-800 mb-4">The Long Game</h3>
              <div className="space-y-4 text-stone-700 leading-relaxed">
                <p>
                  A dorm common room, ten years later. She&apos;s a sophomore now. A few friends are
                  hanging out—someone mentions they used to play violin, another played flute in
                  middle school. &quot;I haven&apos;t touched it in years,&quot; one says.
                </p>
                <p>
                  She laughs. &quot;That&apos;s wild to me.&quot;
                </p>
                <p>
                  Because for her, music never stopped. It couldn&apos;t. It wasn&apos;t a class she took—it&apos;s
                  how she connects. Last week she found two people who play guitar and organized a
                  jam in the lounge. Next month she&apos;s putting together a pickup group for a friend&apos;s
                  art show.
                </p>
              </div>
              <p className="mt-6 text-forest-600 font-fraunces italic text-lg">
                &quot;You should come play with us,&quot; she says. &quot;I&apos;ll show you. It&apos;s not that hard.&quot;
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-forest-600 py-20">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="font-fraunces text-4xl font-bold text-white mb-6">Ready to Start the Journey?</h2>
            <p className="text-forest-100 text-lg mb-10 max-w-2xl mx-auto">
              Give your child the gift of real musicianship—the kind that lasts a lifetime.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/workshops"
                className="bg-cream-50 text-forest-700 px-8 py-4 rounded-lg font-semibold hover:bg-white transition-colors shadow-lg"
              >
                Register Now
              </Link>
              <Link
                href="mailto:connect@creativekidsmusic.org"
                className="bg-transparent text-white px-8 py-4 rounded-lg font-semibold border-2 border-white/50 hover:border-white transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
