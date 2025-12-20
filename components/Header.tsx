'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  const linkClass = (path: string) =>
    `font-medium transition-colors ${
      isActive(path)
        ? 'text-forest-600'
        : 'text-stone-600 hover:text-forest-600'
    }`

  return (
    <header className="bg-cream-100/90 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-50">
      <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-fraunces text-2xl font-bold text-forest-600">
          Creative Kids Music
        </Link>
        <div className="hidden md:flex gap-8">
          <Link href="/workshops" className={linkClass('/workshops')}>
            Workshops
          </Link>
          <Link href="/summer-camp" className={linkClass('/summer-camp')}>
            Summer Camp
          </Link>
          <Link href="/music-school" className={linkClass('/music-school')}>
            Music School
          </Link>
          <Link href="/about" className={linkClass('/about')}>
            About
          </Link>
        </div>
        {/* Mobile menu button - simplified for now */}
        <button className="md:hidden p-2 text-stone-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
    </header>
  )
}
