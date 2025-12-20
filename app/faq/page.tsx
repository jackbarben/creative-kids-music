import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function FAQPage() {
  const faqs = [
    {
      question: "What ages do you work with?",
      answer: "Creative Kids programs are designed for rising 3rd through 8th graders (ages 9–13). We welcome all skill levels—from kids who've never touched an instrument to those who've been playing for years."
    },
    {
      question: "What if my child has never played an instrument?",
      answer: "Perfect. That's often the best place to start. Children who arrive without habits or expectations tend to listen more openly and jump in more freely. They'll be making music with the group in their first session."
    },
    {
      question: "What should my child bring to a workshop?",
      answer: "Comfortable clothes and a water bottle. If they play an instrument and want to bring it, they're welcome to—but it's not required. We provide everything else."
    },
    {
      question: "What should my child bring to summer camp?",
      answer: "Comfortable clothes they can move in, closed-toe shoes for outdoor time, a water bottle, and sunscreen. If they play an instrument and want to bring it, they're welcome to—but it's not required. We provide everything else."
    },
    {
      question: "What are the drop-off and pick-up details?",
      answer: "Drop-off and pick-up happen at St. Luke's Episcopal Church. Please come in the main entrance. We ask that parents arrive promptly."
    },
    {
      question: "What's the ratio of kids to instructors?",
      answer: "One professional musician for every 4–6 children."
    },
    {
      question: "What's your refund and cancellation policy?",
      answer: "Full refund if you cancel more than two weeks before the program start date. Within two weeks, we offer a 50% refund or credit toward a future program."
    },
    {
      question: "Is this a religious program?",
      answer: "Creative Kids is hosted at St. Luke's Episcopal Church, a community that shares our belief in the formative power of music, nature, and creativity. The program is not religious, and all families are welcome. The partnership gives children something special: a real audience who shows up and genuinely celebrates what they create."
    }
  ]

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />

      <main>
        <section className="pt-24 pb-16 md:pt-32 md:pb-24">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <h1 className="font-display text-5xl md:text-6xl font-semibold text-slate-800 leading-[0.95] tracking-tight">
              FAQ
            </h1>
          </div>
        </section>

        <section className="pb-24 md:pb-32">
          <div className="max-w-3xl mx-auto px-6 md:px-12">
            <div className="space-y-12">
              {faqs.map((faq, index) => (
                <div key={index} className="pb-12 border-b border-slate-200 last:border-0 last:pb-0">
                  <h2 className="font-display text-xl font-semibold text-slate-800 mb-4">
                    {faq.question}
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="py-12 border-t border-slate-200">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <p className="text-slate-500">
              More questions?{' '}
              <a
                href="mailto:info@creativekidsmusic.org"
                className="text-slate-700 hover:text-slate-900 underline underline-offset-4"
              >
                info@creativekidsmusic.org
              </a>
              {' '}or{' '}
              <a
                href="tel:+13605242265"
                className="text-slate-700 hover:text-slate-900 underline underline-offset-4"
              >
                (360) 524-2265
              </a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
