'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginForm from '@/components/account/LoginForm'
import Dashboard from '@/components/account/Dashboard'

export default function AccountPage() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check current session
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    checkUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-50">
        <Header />
        <main className="pt-24 pb-16">
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-800"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Header />
      <main className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6">
          {user ? (
            <Dashboard user={user} />
          ) : (
            <LoginForm />
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}
