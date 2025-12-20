import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-cream-100 to-cream-50 py-24">
          <div className="absolute top-20 right-10 w-64 h-64 bg-forest-100 rounded-full opacity-20 blur-3xl" />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-stone-800 mb-8">
              About
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream-50">
          <article className="max-w-2xl mx-auto px-6">
            <div className="prose prose-lg prose-stone max-w-none space-y-8">
              <p className="text-xl leading-relaxed text-stone-700">
                A new kind of music school is coming to Vancouver. We help kids discover the musician that&apos;s already inside them—and develop it into a lifelong practice of listening, creativity, and play.
              </p>

              <div className="my-16 py-8 border-t border-b border-stone-200">
                <h2 className="font-fraunces text-2xl font-bold text-stone-800 mb-6">Inspiration</h2>
                <p className="leading-relaxed text-stone-600">
                  The spark for this work was lit in 2009, deep in the Tennessee woods at a Music/Nature camp. That week didn&apos;t just change how I play; it changed how I pay attention. It showed me that musical growth is less about piling on information and more about waking up the faculties we already possess: perception, curiosity, and the courage to respond.
                </p>
                <p className="leading-relaxed text-stone-600 mt-6">
                  Since then, my purpose has been simple: help people—especially kids—discover the musician that already lives inside them, and show them how to use that way of being to become curious learners in the world.
                </p>
              </div>

              <h2 className="font-fraunces text-2xl font-bold text-stone-800">What We&apos;re Building</h2>
              <p className="leading-relaxed text-stone-600">
                A school that treats music as a living language and a lifelong companion. The goal is not merely to make &quot;students who play songs,&quot; but to cultivate musicians—people who listen deeply, notice acutely, and create generously.
              </p>

              <div className="my-16 py-8 border-t border-b border-stone-200">
                <h2 className="font-fraunces text-2xl font-bold text-stone-800 mb-6">Our Approach</h2>

                <p className="leading-relaxed text-stone-600">
                  <span className="font-semibold text-stone-700">Attention is the instrument.</span> We train noticing: posture, breath, the room&apos;s soundscape, the way a single note blooms and fades. Technique grows from refined attention.
                </p>

                <p className="leading-relaxed text-stone-600 mt-6">
                  <span className="font-semibold text-stone-700">Listening before speaking.</span> Every session begins with listening practices—indoors and outdoors. Students learn to tune themselves to drones, birdsong, and each other before we add complexity.
                </p>

                <p className="leading-relaxed text-stone-600 mt-6">
                  <span className="font-semibold text-stone-700">Harmony is felt, not memorized.</span> We use drones, call-and-response, and movement to embody intervals and rhythm. Theory is learned through the ear and body first, then named.
                </p>

                <p className="leading-relaxed text-stone-600 mt-6">
                  <span className="font-semibold text-stone-700">Nature as teacher.</span> Outdoor sessions sharpen awareness and broaden the idea of what counts as &quot;music.&quot; Students learn silence, space, and the rhythm of attention.
                </p>

                <p className="leading-relaxed text-stone-600 mt-6">
                  <span className="font-semibold text-stone-700">Community jams.</span> Beginners play with advanced students often—like toddlers learning language at the dinner table. Structured improvisation builds confidence and groove.
                </p>
              </div>

              <h2 className="font-fraunces text-2xl font-bold text-stone-800">For Parents</h2>
              <p className="leading-relaxed text-stone-600">
                Children who learn to listen deeply grow into adults who can focus, empathize, and adapt—and find joy as they learn and grow. Music gives them an ideal path to practice those capacities every day.
              </p>
              <p className="leading-relaxed text-stone-600 mt-6">
                What changes you&apos;ll see: increased self-confidence, better self-regulation, more curiosity, and a noticeable ease with learning new things.
              </p>

              <div className="my-16 py-8 border-t border-b border-stone-200">
                <h2 className="font-fraunces text-2xl font-bold text-stone-800 mb-6">An Invitation</h2>
                <p className="leading-relaxed text-stone-600">
                  The Creative Kids Music Project at St. Luke&apos;s is an invitation—to hear more, to notice more, and to bring more of ourselves to the world. Every child arrives musical. Our work is to uncover that truth, nurture it, and let it grow.
                </p>
                <p className="text-xl leading-relaxed text-forest-600 font-fraunces italic mt-8">
                  If this resonates, let&apos;s build it together.
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* Contact */}
        <section className="py-16 bg-cream-100">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <Link
              href="mailto:connect@creativekidsmusic.org"
              className="text-forest-600 font-medium hover:text-forest-700 transition-colors"
            >
              connect@creativekidsmusic.org
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
