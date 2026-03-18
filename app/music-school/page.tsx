import Image from 'next/image'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import InterestForm from './InterestForm'

export default function MusicSchoolPage() {
  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-24 md:pt-32 md:pb-32">
          <div className="max-w-2xl mx-auto px-6">
            <p className="text-xs text-lavender-600 font-semibold tracking-widest uppercase mb-6">
              Fall 2026
            </p>
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              Music School
            </h1>

            <p className="mt-12 text-2xl md:text-3xl text-slate-700 leading-relaxed">
              What if we brought music back into our lives? What if every child could sing, dance, feel rhythm, create songs? What if kids could learn to be creative and expressive at the same time as disciplined and focused? What if music became part of our lives again as something that nourished community, nourished our souls, nourished our hearts, and held us together as it has for thousands of years?
            </p>

            <div className="mt-10">
              <Image
                src="/media/photos/music-school.jpg"
                alt="Children learning music together"
                width={800}
                height={500}
                className="w-full rounded-lg shadow-sm"
              />
            </div>

            <div className="mt-10 space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Not long ago in this country, everyone sang together. We danced together. We had social gatherings where music was present and everyone participated. We are losing that world. Creative Kids Music hopes to bring it back into our community and our culture.
              </p>
              <p>
                The vision is built on a simple model of how music used to root and nourish us. It models language acquisition: immersion first, understanding later. It draws on what we know about how the brain actually learns, on techniques of concentration that develop both discipline and musical expressiveness, and on sources as varied as Alexander Technique, the work of Iain McGilchrist, meditation and body awareness, and the vast array of methods and techniques musicians have been using for hundreds of years. At Creative Kids Music, these tools and models take shape in the real world and the results speak for themselves.
              </p>
            </div>

            {/* What Kids Get */}
            <div className="mt-12 space-y-5">
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kids are immersed in music three days a week.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kids develop a musical foundation that includes theory, relative pitch, rhythmic mastery, composition and improvisation techniques, and a working understanding of different musical genres.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  We emphasize playing. Kids learn by doing and imitating. Access to professional musicians in a variety of settings gives them multiple models and different ways of experiencing and expressing music.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kids put what they learn into practice through frequent, low-stress performance opportunities.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kids learn how to listen to each other, to respond in real time, and to make themselves and the people around them sound good.
                </p>
              </div>
              <div className="flex gap-4">
                <div className="w-1.5 bg-sage-300 rounded-full flex-shrink-0"></div>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kids develop discipline, concentration, patience, and diligence. They learn how to learn. They build confidence on the back of real skills. They develop the ability to listen to themselves, to assess honestly what they&apos;re doing, and to use that feedback to grow.
                </p>
              </div>
            </div>

            <div className="mt-12 space-y-6 text-lg text-slate-600 leading-relaxed">
              <p>
                Creative Kids Music is designed to complement the variety of musical offerings throughout the Vancouver and Portland area. If your child takes private lessons, this program will deepen and enrich that work. If they don&apos;t, this is a foundation that will serve them wherever music takes them. What we&apos;re building is a culture of music, of community that connects through making music together, not just listening to it.
              </p>
            </div>

            {/* Call to Action */}
            <div className="mt-16 pt-16 border-t border-slate-200">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">
                Help Us Build This
              </h2>
              <p className="text-2xl text-slate-800 font-display font-semibold mb-4">
                Be Part of Something New
              </p>
              <div className="space-y-4 text-slate-600 mb-10">
                <p>
                  Our goal is to launch our after-school program in the fall of 2026. We need a minimum of 8 families committed to make it happen, and we&apos;d love for you to consider being a part of it.
                </p>
                <p>
                  We need people who believe in this vision to help support scholarships. We need parents who want to help spread the word. We need music teachers and professionals who are looking to enhance and expand what they offer their students.
                </p>
                <p className="text-xl font-medium text-slate-700">
                  Please consider being a part of this. We can&apos;t do it without you.
                </p>
              </div>
              <InterestForm />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
