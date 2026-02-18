import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}

// Admin client using service role key — bypasses RLS.
// Only use server-side for admin data queries.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      global: {
        fetch: (url: RequestInfo | URL, options?: RequestInit) =>
          fetch(url, { ...options, cache: 'no-store' }),
      },
    }
  )
}

// Look up a user's ID by their email address.
// Returns null if no user exists with that email.
export async function getUserByEmail(email: string): Promise<string | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .rpc('get_user_id_by_email', { email_input: email.toLowerCase() })

  if (error || !data) return null
  return data as string
}
