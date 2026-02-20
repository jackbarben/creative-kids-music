'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function WorkshopThankYouPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }
    checkUser()
  }, [supabase.auth])

  return (
    <div className="min-h-screen bg-cream-50 font-sans">
      <Header />

      <main>
        <section className="py-24 bg-cream-50">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-stone-800 mb-6">
              Your spot is reserved.
            </h1>
            <p className="text-xl text-stone-600 mb-4">
              We&apos;ve received your workshop reservation.
            </p>
            <p className="text-stone-500 mb-8">
              You&apos;ll receive a confirmation email shortly with details about what to expect.
            </p>
            <p className="text-stone-400 text-sm mb-12">
              Payment can be made day-of via the church&apos;s Vanco portal or by check/cash at the event.
            </p>

            {/* Account Section - different based on login status */}
            {isLoggedIn === null ? (
              // Loading state
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8">
                <div className="animate-pulse h-20 bg-stone-100 rounded"></div>
              </div>
            ) : isLoggedIn ? (
              // Logged in - show link to account
              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-left">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-green-600 text-xl">✓</span>
                  <h2 className="font-display text-lg font-semibold text-green-800">
                    Registration linked to your account
                  </h2>
                </div>
                <p className="text-green-700 text-sm mb-4">
                  You can view and manage your registration from your account dashboard.
                </p>
                <Link
                  href="/account"
                  className="inline-block px-5 py-2.5 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors"
                >
                  Go to My Account
                </Link>
              </div>
            ) : (
              // Not logged in - show create account prompt
              <div className="bg-white border border-stone-200 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-display text-lg font-semibold text-stone-800 mb-2">
                  Want to manage your registration online?
                </h2>
                <p className="text-stone-600 text-sm mb-4">
                  Create a free parent account to view your registrations, update contact info, and track payment status.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/account/create"
                    className="inline-block px-5 py-2.5 bg-forest-600 text-white rounded-lg font-medium hover:bg-forest-700 transition-colors text-center"
                  >
                    Create Account
                  </Link>
                  <Link
                    href="/"
                    className="inline-block px-5 py-2.5 border border-stone-300 text-stone-600 rounded-lg font-medium hover:bg-stone-50 transition-colors text-center"
                  >
                    Maybe Later
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
