import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WaitlistForm from './WaitlistForm'

export default function MusicSchoolPage() {
  return (
    <div className="min-h-screen bg-cream-50 font-nunito">
      <Header />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-stone-100 to-cream-50 py-24">
          <div className="absolute top-20 right-10 w-64 h-64 bg-stone-200 rounded-full opacity-20 blur-3xl" />
          <div className="max-w-3xl mx-auto px-6 text-center">
            <p className="text-stone-500 mb-4">Coming Fall 2026</p>
            <h1 className="font-fraunces text-5xl md:text-6xl font-bold text-stone-800 mb-8">
              Music School
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 bg-cream-50">
          <article className="max-w-2xl mx-auto px-6">
            <div className="prose prose-lg prose-stone max-w-none space-y-8">
              <p className="text-xl leading-relaxed text-stone-700">
                The workshops plant a seed. The summer camp lets it take root. The music school is where it grows.
              </p>

              <p className="leading-relaxed text-stone-600">
                Coming this fall: Creative Kids Music School. Three afternoons a week, kids go deeper into everything they&apos;ve tasted.
              </p>

              <p className="leading-relaxed text-stone-600">
                This is where they&apos;re headed: improvising, composing, leading, teaching. Exploring new instruments and understanding how music fits together. Finding real collaborators and a place to belong.
              </p>

              <p className="text-xl leading-relaxed text-stone-700 my-12">
                The creative flow they&apos;ve tasted stops being special and starts being theirs—a field they can walk into whenever they want.
              </p>
            </div>
          </article>
        </section>

        {/* Waitlist Signup */}
        <section className="py-16 bg-stone-100">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="font-fraunces text-2xl font-bold text-stone-800 mb-2 text-center">
              Join the Waitlist
            </h2>
            <p className="text-stone-600 mb-8 text-center">
              Be the first to know when registration opens.
            </p>
            <WaitlistForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
