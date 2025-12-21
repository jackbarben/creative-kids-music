import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        {/* Hero - Spare, image-forward */}
        <section className="pt-12 pb-16 md:pt-20 md:pb-24">
          <div className="w-full max-w-6xl mx-auto px-6 md:px-12">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Text */}
              <div className="order-2 lg:order-1">
                <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-800 leading-[1.1] tracking-tight">
                  Your child is<br />
                  already a<br />
                  musician.
                </h1>
                <p className="mt-6 text-lg md:text-xl text-slate-600 leading-relaxed max-w-md">
                  We help them discover that.
                </p>
                <p className="mt-4 text-slate-600 leading-relaxed max-w-md">
                  At Creative Kids, children make real music from day one alongside professional musicians—building not just musical skill, but lasting confidence, creativity, and the ability to collaborate and show up with others for life.
                </p>
              </div>

              {/* Tree Image */}
              <div className="order-1 lg:order-2 flex justify-center">
                <Image
                  src="/media/logos/treecolors2.png"
                  alt="A tree with musical instruments growing from its branches"
                  width={400}
                  height={480}
                  className="w-full max-w-xs md:max-w-sm"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Programs */}
        <section className="py-20 md:py-28 bg-white">
          <div className="max-w-6xl mx-auto px-6 md:px-12">
            <h2 className="font-display text-2xl font-semibold text-slate-800 mb-12">
              Programs
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Workshops */}
              <Link href="/workshops" className="group block p-8 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase">
                  Winter/Spring 2026
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  Workshops
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  No waiting—your child performs alongside professional musicians on day one.
                </p>
              </Link>

              {/* Summer Camp */}
              <Link href="/summer-camp" className="group block p-8 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                <p className="text-xs text-sage-600 font-semibold tracking-widest uppercase">
                  June 22–27, 2026
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  Summer Camp
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  Music, nature, and stillness woven into one immersive week—they come home with a freedom to make music they&apos;ve never felt before.
                </p>
              </Link>

              {/* Music School */}
              <Link href="/music-school" className="group block p-8 bg-cream-50 rounded-lg hover:bg-cream-100 transition-colors">
                <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase">
                  Fall 2026
                </p>
                <h3 className="mt-3 font-display text-2xl font-semibold text-slate-800">
                  Music School
                </h3>
                <p className="mt-4 text-slate-600 leading-relaxed">
                  The place where music becomes theirs.
                </p>
              </Link>
            </div>

            <div className="mt-16 max-w-3xl mx-auto">
              <Image
                src="/media/photos/homepage.jpg"
                alt="Children making music together"
                width={800}
                height={500}
                className="w-full rounded-lg shadow-sm"
              />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
