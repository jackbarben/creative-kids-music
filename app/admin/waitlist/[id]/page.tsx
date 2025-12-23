import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import SignupActions from './SignupActions'

export const dynamic = 'force-dynamic'

async function getWaitlistSignup(id: string) {
  const supabase = await createClient()
  const { data } = await supabase
    .from('waitlist_signups')
    .select('*')
    .eq('id', id)
    .single()
  return data
}

export default async function WaitlistSignupDetail({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const signup = await getWaitlistSignup(id)

  if (!signup) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      new: 'bg-blue-100 text-blue-800',
      contacted: 'bg-amber-100 text-amber-800',
      converted: 'bg-green-100 text-green-800'
    }
    return styles[status] || styles.new
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/admin/waitlist"
            className="text-sm text-forest-600 hover:text-forest-700 mb-2 inline-block"
          >
            &larr; Back to Waitlist
          </Link>
          <h1 className="font-syne text-2xl font-bold text-stone-800">
            {signup.parent_name}
          </h1>
          <p className="text-stone-500">
            Signed up {formatDate(signup.created_at)}
          </p>
        </div>
        <span className={`text-sm px-3 py-1 rounded-full ${getStatusBadge(signup.status)}`}>
          {signup.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
            <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Contact</h2>
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-sm text-stone-500">Email</dt>
                <dd className="text-stone-800">
                  <a href={`mailto:${signup.parent_email}`} className="text-stone-700 hover:underline">
                    {signup.parent_email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-sm text-stone-500">Number of Children</dt>
                <dd className="text-stone-800">{signup.num_children}</dd>
              </div>
            </dl>
          </div>

          {/* Child Info */}
          {(signup.child_name || signup.child_grade || signup.child_school) && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Child Info</h2>
              <dl className="grid gap-4 sm:grid-cols-2">
                {signup.child_name && (
                  <div>
                    <dt className="text-sm text-stone-500">Name</dt>
                    <dd className="text-stone-800">{signup.child_name}</dd>
                  </div>
                )}
                {signup.child_grade && (
                  <div>
                    <dt className="text-sm text-stone-500">Grade (Fall 2026)</dt>
                    <dd className="text-stone-800">{signup.child_grade}</dd>
                  </div>
                )}
                {signup.child_school && (
                  <div className="sm:col-span-2">
                    <dt className="text-sm text-stone-500">School</dt>
                    <dd className="text-stone-800">{signup.child_school}</dd>
                  </div>
                )}
              </dl>
            </div>
          )}

          {/* Message */}
          {signup.message && (
            <div className="bg-white rounded-xl border border-stone-200 p-6">
              <h2 className="font-syne text-lg font-bold text-stone-800 mb-4">Message</h2>
              <p className="text-stone-700 whitespace-pre-wrap">{signup.message}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <SignupActions
            signupId={signup.id}
            currentStatus={signup.status}
            currentNotes={signup.admin_notes}
          />
        </div>
      </div>
    </div>
  )
}
