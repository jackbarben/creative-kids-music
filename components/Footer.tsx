import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#4A4639] text-cream-100">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-16">
        <div className="grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link href="/" className="font-display text-lg font-semibold tracking-tight">
              Creative Kids
            </Link>
            <p className="mt-4 text-slate-400 text-sm leading-relaxed">
              Where children discover the musician inside.
            </p>
          </div>

          {/* Links */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link
                  href="/workshops"
                  className="text-slate-400 hover:text-cream-100 transition-colors"
                >
                  Workshops
                </Link>
              </li>
              <li>
                <Link
                  href="/summer-camp"
                  className="text-slate-400 hover:text-cream-100 transition-colors"
                >
                  Summer Camp
                </Link>
              </li>
              <li>
                <Link
                  href="/music-school"
                  className="text-slate-400 hover:text-cream-100 transition-colors"
                >
                  Music School
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-400 hover:text-cream-100 transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm">
            <a
              href="mailto:info@creativekidsmusic.org"
              className="block text-slate-400 hover:text-cream-100 transition-colors"
            >
              info@creativekidsmusic.org
            </a>
            <a
              href="tel:+13605242265"
              className="block text-slate-400 hover:text-cream-100 transition-colors"
            >
              (360) 524-2265
            </a>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-700">
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Creative Kids Music
          </p>
        </div>
      </div>
    </footer>
  )
}
