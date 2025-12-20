import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-stone-100 border-t border-stone-200">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-fraunces text-xl font-bold text-forest-600 mb-3">Creative Kids Music</h3>
            <p className="text-stone-600 text-sm">
              A new kind of music school.<br />
              Where music takes root.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-stone-800 mb-3">Programs</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><Link href="/workshops" className="hover:text-forest-600 transition-colors">Workshops</Link></li>
              <li><Link href="/summer-camp" className="hover:text-forest-600 transition-colors">Summer Camp</Link></li>
              <li><Link href="/music-school" className="hover:text-forest-600 transition-colors">Music School</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-stone-800 mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-stone-600">
              <li><a href="mailto:connect@creativekidsmusic.org" className="hover:text-forest-600 transition-colors">connect@creativekidsmusic.org</a></li>
              <li>Vancouver, WA</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-stone-300 text-center text-sm text-stone-500">
          © {new Date().getFullYear()} Creative Kids Music. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
