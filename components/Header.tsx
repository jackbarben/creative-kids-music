'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export default function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/'
    return pathname.startsWith(path)
  }

  const linkClass = (path: string) =>
    `transition-colors ${
      isActive(path)
        ? 'text-slate-800'
        : 'text-slate-400 hover:text-slate-800'
    }`

  const navLinks = [
    { href: '/workshops', label: 'Workshops' },
    { href: '/summer-camp', label: 'Summer Camp' },
    { href: '/music-school', label: 'Music School' },
    { href: '/faq', label: 'FAQ' },
    { href: '/about', label: 'About' },
    { href: '/account', label: 'Account' },
  ]

  return (
    <header className="sticky top-0 z-50 bg-cream-50/90 backdrop-blur-sm">
      <nav className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 md:gap-3"
          >
            <Image
              src="/favicon.png"
              alt="Creative Kids Music tree logo"
              width={36}
              height={36}
              className="w-8 h-8 md:w-9 md:h-9"
            />
            <span className="font-display text-xl md:text-2xl tracking-tight">
              <span className="font-bold text-amber-900">Creative Kids</span>
              <span className="hidden md:inline font-normal text-amber-800/70"> Music Project</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm tracking-wide ${linkClass(link.href)}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 -mr-2 text-slate-600"
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden pb-6">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 text-base ${linkClass(link.href)}`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
