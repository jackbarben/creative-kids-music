import { SupabaseClient } from '@supabase/supabase-js'

// Admin email allowlist
// Add admin emails here
const ADMIN_EMAILS = [
  'jack@creativekidsmusic.org',
  'jackbarben3@gmail.com', // Test account
]

/**
 * Check if the current user is an admin
 * Returns the user if admin, null otherwise
 */
export async function getAdminUser(supabase: SupabaseClient) {
  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  if (!user.email || !ADMIN_EMAILS.includes(user.email)) {
    return null
  }

  return user
}

/**
 * Check if an email is an admin email
 */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email)
}
