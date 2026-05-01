'use client'

import { Link } from '@/i18n/navigation'
import { useTranslations } from 'next-intl'
import packageJson from '@/package.json'

export default function Footer() {
  const t = useTranslations('nav')
  const f = useTranslations('footer')

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
              {f('tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/workshops" className="text-slate-400 hover:text-cream-100 transition-colors">
                  {t('workshops')}
                </Link>
              </li>
              <li>
                <Link href="/summer-camp" className="text-slate-400 hover:text-cream-100 transition-colors">
                  {t('summerCamp')}
                </Link>
              </li>
              <li>
                <Link href="/music-school" className="text-slate-400 hover:text-cream-100 transition-colors">
                  {t('musicSchool')}
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-cream-100 transition-colors">
                  {t('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-cream-100 transition-colors">
                  {t('contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3 text-sm">
            <a
              href="mailto:creativekidsmusicproject@gmail.com"
              className="block text-slate-400 hover:text-cream-100 transition-colors"
            >
              creativekidsmusicproject@gmail.com
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
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500 mb-4">
            <Link href="/terms/program-terms" className="hover:text-slate-400 transition-colors">
              {f('termsConditions')}
            </Link>
            <Link href="/terms/program-terms#cancellation" className="hover:text-slate-400 transition-colors">
              {f('refundPolicy')}
            </Link>
            <Link href="/terms/liability-waiver" className="hover:text-slate-400 transition-colors">
              {f('liabilityWaiver')}
            </Link>
            <Link href="/faq" className="hover:text-slate-400 transition-colors">
              {t('faq')}
            </Link>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              © {new Date().getFullYear()} Creative Kids Music
            </p>
            <p className="text-xs text-slate-600">
              v{packageJson.version}
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
